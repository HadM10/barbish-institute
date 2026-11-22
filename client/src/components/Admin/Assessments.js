import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  ArrowPathIcon,
  ArrowDownTrayIcon,
  QrCodeIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import {
  listAssessments,
  getAssessment,
  updateAssessment,
  regenerateAssessment,
  deleteAssessment,
} from "../../api/assessmentAPI";
import ReportView from "../Assessment/ReportView";
import AssessmentQR from "./AssessmentQR";

const FOLLOW_UP = [
  { value: "new", label: "New", cls: "bg-blue-50 text-blue-700 ring-blue-200" },
  { value: "contacted", label: "Contacted", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  { value: "registered", label: "Registered", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  { value: "not_interested", label: "Not interested", cls: "bg-gray-100 text-gray-600 ring-gray-200" },
];
const followUpMeta = (v) => FOLLOW_UP.find((f) => f.value === v) || FOLLOW_UP[0];

const LEAD = {
  hot: { label: "Hot lead", cls: "bg-red-50 text-red-700" },
  warm: { label: "Warm lead", cls: "bg-amber-50 text-amber-700" },
  cold: { label: "Cold lead", cls: "bg-gray-100 text-gray-600" },
};

// USD per million tokens (input, output)
const PRICES = {
  "claude-opus-5-5": [4, 20],
  "claude-sonnet-5-5": [2, 10],
  "claude-haiku-5-5": [0.1, 0.5],
};
const costOf = (a) => {
  if (!a.aiModel || a.inputTokens == null) return null;
  const key = Object.keys(PRICES).find((k) => a.aiModel.startsWith(k));
  if (!key) return null;
  const [pin, pout] = PRICES[key];
  return ((a.inputTokens || 0) * pin + (a.outputTokens || 0) * pout) / 1e6;
};

// WhatsApp needs the international format. Local Lebanese numbers get +961.
const waNumber = (phone) => {
  let d = String(phone || "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("961")) return d;
  if (d.length === 8 && d.startsWith("0")) return `961${d.slice(1)}`; // 03 123 456
  if (d.length === 7 || d.length === 8) return `961${d}`; // 3 123 456, 71 123 456
  return d;
};

const fmtDate = (v) =>
  new Date(v).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const isToday = (v) => new Date(v).toDateString() === new Date().toDateString();

const badge = "shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium";
const StatusBadge = ({ a }) => {
  if (a.status === "pending") return <span className={`${badge} bg-indigo-50 text-indigo-700`}>Preparing report</span>;
  if (a.status === "failed") return <span className={`${badge} bg-red-50 text-red-700`}>Report failed</span>;
  const lead = LEAD[a.leadScore];
  return lead ? <span className={`${badge} ${lead.cls}`}>{lead.label}</span> : null;
};

const FollowUpSelect = ({ value, onChange }) => {
  const meta = followUpMeta(value);
  return (
    <select
      value={value}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-full border-0 py-1 pl-3 pr-8 text-xs font-medium ring-1 focus:ring-2 focus:ring-indigo-500 ${meta.cls}`}
      aria-label="Follow-up status"
    >
      {FOLLOW_UP.map((f) => (
        <option key={f.value} value={f.value}>
          {f.label}
        </option>
      ))}
    </select>
  );
};

// ---------------------------------------------------------------------------

const Assessments = () => {
  const { logout } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [search, setSearch] = useState("");
  const [followUp, setFollowUp] = useState("all");
  const [lead, setLead] = useState("all");
  const [source, setSource] = useState("all");
  const [visitorType, setVisitorType] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [showQR, setShowQR] = useState(false);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    const res = await listAssessments();
    setLoading(false);
    if (res.success) {
      setItems(res.data);
      setAuthError(false);
    } else if (res.status === 401 || res.status === 403) {
      setAuthError(true);
    } else if (!quiet) {
      toast.error(res.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Refresh while any report is still being prepared.
  const anyPending = items.some((a) => a.status === "pending");
  useEffect(() => {
    if (!anyPending) return undefined;
    const id = setInterval(() => load(true), 8000);
    return () => clearInterval(id);
  }, [anyPending, load]);

  const sources = useMemo(() => [...new Set(items.map((a) => a.source).filter(Boolean))].sort(), [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((a) => {
      if (followUp !== "all" && a.followUpStatus !== followUp) return false;
      if (lead !== "all" && a.leadScore !== lead) return false;
      if (source !== "all" && (a.source || "") !== source) return false;
      if (visitorType !== "all" && a.visitorType !== visitorType) return false;
      if (!q) return true;
      return [a.fullName, a.phone, a.email, a.recommendedPath, a.topCourse]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(q));
    });
  }, [items, search, followUp, lead, source, visitorType]);

  const stats = useMemo(() => {
    const total = items.length;
    const today = items.filter((a) => isToday(a.createdAt)).length;
    const hot = items.filter((a) => a.leadScore === "hot").length;
    const registered = items.filter((a) => a.followUpStatus === "registered").length;
    const cost = items.reduce((s, a) => s + (costOf(a) || 0), 0);
    return { total, today, hot, registered, cost };
  }, [items]);

  const changeFollowUp = async (id, value) => {
    const prev = items;
    setItems((list) => list.map((a) => (a.id === id ? { ...a, followUpStatus: value } : a)));
    const res = await updateAssessment(id, { followUpStatus: value });
    if (!res.success) {
      setItems(prev);
      toast.error(res.message);
    }
  };

  const exportCsv = () => {
    const cols = [
      ["Date", (a) => new Date(a.createdAt).toLocaleString("en-GB")],
      ["Name", (a) => a.fullName],
      ["Phone", (a) => a.phone],
      ["Email", (a) => a.email || ""],
      ["Visitor type", (a) => a.visitorTypeLabel || ""],
      ["Language", (a) => a.language],
      ["Source", (a) => a.source || ""],
      ["Follow-up", (a) => followUpMeta(a.followUpStatus).label],
      ["Lead", (a) => (LEAD[a.leadScore] ? LEAD[a.leadScore].label : "")],
      ["Recommended path", (a) => a.recommendedPath || ""],
      ["Match %", (a) => (a.matchScore != null ? a.matchScore : "")],
      ["Top course", (a) => a.topCourse || ""],
      ["Summary", (a) => a.insight || ""],
    ];
    const esc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const rows = [cols.map((c) => esc(c[0])).join(",")].concat(
      filtered.map((a) => cols.map((c) => esc(c[1](a))).join(","))
    );
    // BOM so Excel opens Arabic names correctly
    const blob = new Blob(["﻿" + rows.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `career-assessments-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (authError) {
    return (
      <div className="p-2 md:p-6">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <h2 className="text-xl font-bold text-gray-900">Your admin session expired</h2>
          <p className="mt-2 text-gray-600">Sign in again to see the career assessments.</p>
          <button onClick={logout} className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700">
            Sign in again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-2 md:p-6">
      {/* Header */}
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-lg md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-indigo-950">Career Assessments</h1>
            <p className="mt-1 text-gray-600">Everyone who filled in the assessment, with their personal report.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowQR(true)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <QrCodeIcon className="h-5 w-5" /> QR code
            </button>
            <button
              onClick={exportCsv}
              disabled={!filtered.length}
              className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <ArrowDownTrayIcon className="h-5 w-5" /> Export Excel
            </button>
            <button
              onClick={() => load()}
              className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              aria-label="Refresh"
            >
              <ArrowPathIcon className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ["Total", stats.total],
            ["Today", stats.today],
            ["Hot leads", stats.hot],
            ["Registered", stats.registered],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-gray-50 px-4 py-3">
              <dt className="text-sm text-gray-500">{label}</dt>
              <dd className="mt-0.5 text-2xl font-bold text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5">
          <div className="relative sm:col-span-2 lg:col-span-4 2xl:col-span-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full rounded-xl border border-gray-300 py-2 pl-4 pr-10 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
            />
            <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select value={visitorType} onChange={(e) => setVisitorType(e.target.value)} className="rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500">
            <option value="all">All visitors</option>
            <option value="school">High school</option>
            <option value="university">University students</option>
            <option value="graduate">Graduates / job seekers</option>
            <option value="employed">Employed / career changers</option>
          </select>
          <select value={followUp} onChange={(e) => setFollowUp(e.target.value)} className="rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500">
            <option value="all">All follow-up statuses</option>
            {FOLLOW_UP.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <select value={lead} onChange={(e) => setLead(e.target.value)} className="rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500">
            <option value="all">All leads</option>
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="cold">Cold</option>
          </select>
          <select value={source} onChange={(e) => setSource(e.target.value)} className="rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500">
            <option value="all">All sources</option>
            {sources.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards */}
      {!loading && filtered.length === 0 ? (
        <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-lg">
          <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-3 text-lg font-semibold text-gray-900">
            {items.length ? "No assessments match these filters" : "No assessments yet"}
          </h3>
          <p className="mt-1 text-gray-500">
            {items.length
              ? "Clear the search or filters to see everyone."
              : "Print the QR code on your brochures. Every submission shows up here as a card."}
          </p>
          {!items.length && (
            <button onClick={() => setShowQR(true)} className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
              Get the QR code
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((a) => (
            <div
              key={a.id}
              role="button"
              tabIndex={0}
              onClick={() => setOpenId(a.id)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpenId(a.id)}
              className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-gray-900">
                    <bdi>{a.fullName}</bdi>
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">
                    <bdi>{a.phone}</bdi>
                    {a.visitorTypeLabel ? `, ${a.visitorTypeLabel}` : ""}
                  </p>
                </div>
                <StatusBadge a={a} />
              </div>

              <div className="mt-4 min-h-[64px]">
                {a.status === "completed" ? (
                  <>
                    <p className="flex items-baseline justify-between gap-3 text-sm text-gray-500">
                      <span>Recommended path</span>
                      {a.matchScore != null && <span className="font-medium text-indigo-600">{a.matchScore}% match</span>}
                    </p>
                    <p className="font-medium text-gray-900">
                      <bdi>{a.recommendedPath}</bdi>
                    </p>
                    {a.topCourse && (
                      <p className="mt-1 truncate text-sm text-gray-600">
                        Course: <bdi>{a.topCourse}</bdi>
                      </p>
                    )}
                  </>
                ) : a.status === "pending" ? (
                  <p className="text-sm text-gray-500">The report is being prepared. This card updates on its own.</p>
                ) : (
                  <p className="text-sm text-gray-500">Open the card to generate the report again.</p>
                )}
              </div>

              {a.insight && <p className="mt-3 line-clamp-2 text-sm text-gray-600">{a.insight}</p>}

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-4">
                <FollowUpSelect value={a.followUpStatus} onChange={(v) => changeFollowUp(a.id, v)} />
                <div className="flex items-center gap-1">
                  <a
                    href={`https://wa.me/${waNumber(a.phone)}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                    title="WhatsApp"
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  </a>
                  <a
                    href={`tel:${a.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                    title="Call"
                  >
                    <PhoneIcon className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-400">
                {fmtDate(a.createdAt)}
                {a.source ? ` from ${a.source}` : ""}
                {a.hasNotes ? ", has notes" : ""}
              </p>
            </div>
          ))}
        </div>
      )}

      {stats.cost > 0 && (
        <p className="mt-6 text-center text-xs text-gray-400">
          Report generation cost so far: about ${stats.cost.toFixed(2)}
        </p>
      )}

      {openId && (
        <AssessmentDrawer
          id={openId}
          onClose={() => setOpenId(null)}
          onChanged={(patch) => setItems((list) => list.map((a) => (a.id === openId ? { ...a, ...patch } : a)))}
          onDeleted={() => {
            setItems((list) => list.filter((a) => a.id !== openId));
            setOpenId(null);
          }}
          onRegenerated={() => load(true)}
        />
      )}

      {showQR && <AssessmentQR onClose={() => setShowQR(false)} />}
    </div>
  );
};

// ---------------------------------------------------------------------------

const AssessmentDrawer = ({ id, onClose, onChanged, onDeleted, onRegenerated }) => {
  const [a, setA] = useState(null);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchOne = useCallback(async () => {
    const res = await getAssessment(id);
    if (res.success) {
      setA(res.data);
      setNotes((n) => (n === "" ? res.data.adminNotes || "" : n));
    } else {
      toast.error(res.message);
    }
  }, [id]);

  useEffect(() => {
    setA(null);
    setNotes("");
    fetchOne();
  }, [fetchOne]);

  useEffect(() => {
    if (!a || a.status !== "pending") return undefined;
    const t = setInterval(fetchOne, 5000);
    return () => clearInterval(t);
  }, [a, fetchOne]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const setFollowUp = async (value) => {
    const res = await updateAssessment(id, { followUpStatus: value });
    if (res.success) {
      setA((x) => ({ ...x, followUpStatus: value }));
      onChanged({ followUpStatus: value });
    } else toast.error(res.message);
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    const res = await updateAssessment(id, { adminNotes: notes });
    setSavingNotes(false);
    if (res.success) {
      toast.success("Notes saved");
      onChanged({ hasNotes: Boolean(notes.trim()) });
    } else toast.error(res.message);
  };

  const regenerate = async () => {
    if (!window.confirm("Generate a new report for this person? The current report will be replaced.")) return;
    const res = await regenerateAssessment(id);
    if (res.success) {
      setA((x) => ({ ...x, status: "pending" }));
      onChanged({ status: "pending" });
      onRegenerated();
    } else toast.error(res.message);
  };

  const remove = async () => {
    if (!window.confirm("Delete this assessment and its report? This can't be undone.")) return;
    const res = await deleteAssessment(id);
    if (res.success) {
      toast.success("Assessment deleted");
      onDeleted();
    } else toast.error(res.message);
  };

  const insights = a && a.result ? a.result.adminInsights : null;
  const cost = a ? costOf(a) : null;
  const publicLink = a ? `${window.location.origin}/assessment/report/${a.publicId}` : "";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Assessment details"
        className="h-full w-full max-w-3xl overflow-y-auto bg-gray-50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-5 py-4">
          <div className="min-w-0">
            <p className="truncate text-xl font-bold text-gray-900">
              <bdi>{a ? a.fullName : "Loading..."}</bdi>
            </p>
            {a && (
              <p className="text-sm text-gray-500">
                {fmtDate(a.createdAt)}
                {a.source ? ` from ${a.source}` : ""}
              </p>
            )}
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="Close">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {!a ? (
          <div className="p-10 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="space-y-5 p-5">
            {/* Contact and actions */}
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-gray-500">Phone</dt>
                  <dd className="font-medium text-gray-900" dir="ltr">{a.phone}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Email</dt>
                  <dd className="break-all font-medium text-gray-900">{a.email || "Not given"}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Report language</dt>
                  <dd className="font-medium text-gray-900">{a.language === "ar" ? "Arabic" : "English"}</dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={`https://wa.me/${waNumber(a.phone)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                  <ChatBubbleLeftRightIcon className="h-4 w-4" /> WhatsApp
                </a>
                <a href={`tel:${a.phone}`} className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <PhoneIcon className="h-4 w-4" /> Call
                </a>
                <a href={publicLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" /> Open their report
                </a>
                <button onClick={regenerate} className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <ArrowPathIcon className="h-4 w-4" /> Generate again
                </button>
                <button onClick={remove} className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                  <TrashIcon className="h-4 w-4" /> Delete
                </button>
              </div>
            </section>

            {/* Follow-up */}
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Follow-up</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {FOLLOW_UP.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFollowUp(f.value)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 ${
                      a.followUpStatus === f.value ? f.cls : "bg-white text-gray-500 ring-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes from calls or visits..."
                className="mt-4 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                dir="auto"
              />
              <button
                onClick={saveNotes}
                disabled={savingNotes}
                className="mt-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {savingNotes ? "Saving..." : "Save notes"}
              </button>
            </section>

            {/* Internal insights */}
            {insights && (
              <section className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-indigo-950">For the team</h3>
                  {LEAD[insights.leadScore] && (
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${LEAD[insights.leadScore].cls}`}>
                      {LEAD[insights.leadScore].label}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-700">{insights.summary}</p>
                <p className="mt-2 text-sm text-gray-700">
                  <span className="font-medium text-indigo-950">How to approach them: </span>
                  {insights.followUpTip}
                </p>
              </section>
            )}

            {/* Answers */}
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Their answers</h3>
              <dl className="mt-3 divide-y divide-gray-100">
                {(a.answersReadable || []).map((x) => (
                  <div key={x.id} className="py-3">
                    <dt className="text-sm text-gray-500">{x.question}</dt>
                    <dd className="mt-0.5 font-medium text-gray-900" dir="auto">{x.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Report */}
            <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <h3 className="font-semibold text-gray-900">Report they received</h3>
                {cost != null && (
                  <span className="text-xs text-gray-400">
                    {a.aiModel}, about ${cost.toFixed(3)}
                  </span>
                )}
              </div>
              {a.status === "completed" && (
                <ReportView data={{ ...a, courses: a.courses }} publicId={a.publicId} compact />
              )}
              {a.status === "pending" && <p className="px-5 pb-6 text-sm text-gray-500">The report is being prepared...</p>}
              {a.status === "failed" && (
                <div className="px-5 pb-6">
                  <p className="text-sm text-red-600">The report couldn't be generated.</p>
                  {a.errorMessage && <p className="mt-1 break-words text-xs text-gray-500">{a.errorMessage}</p>}
                  <button onClick={regenerate} className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    Generate again
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </aside>
    </div>
  );
};

export default Assessments;
