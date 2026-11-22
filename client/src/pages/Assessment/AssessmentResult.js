import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import strings, { INSTITUTE_WHATSAPP } from "../../components/Assessment/strings";
import ReportView from "../../components/Assessment/ReportView";
import { AssessmentHeader } from "./AssessmentForm";
import { getAssessmentResult } from "../../api/assessmentAPI";

const waLink = (phone, text) =>
  `https://wa.me/${phone || ""}?text=${encodeURIComponent(text)}`;

const Spinner = () => (
  <span
    className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-sky border-t-transparent motion-reduce:animate-none"
    aria-hidden="true"
  />
);

const AssessmentResult = () => {
  const { publicId } = useParams();
  const [data, setData] = useState(null);
  const [state, setState] = useState("loading"); // loading | pending | completed | failed | notfound | error
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    let cancelled = false;
    let timer = null;

    const poll = async () => {
      const res = await getAssessmentResult(publicId);
      if (cancelled) return;

      if (res.success) {
        setData(res.data);
        setState(res.data.status);
        if (res.data.status === "pending") {
          const waited = Date.now() - startedAt.current;
          if (waited < 10 * 60 * 1000) timer = setTimeout(poll, waited < 90000 ? 2500 : 6000);
        }
      } else if (res.status === 404) {
        setState("notfound");
      } else {
        setState((s) => (s === "loading" ? "error" : s));
        timer = setTimeout(poll, 6000);
      }
    };

    poll();
    const tick = setInterval(() => setElapsed(Date.now() - startedAt.current), 1000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearInterval(tick);
    };
  }, [publicId]);

  const lang = data && data.language === "en" ? "en" : "ar";
  const t = strings[lang];
  const link = typeof window !== "undefined" ? window.location.href : "";
  const name = data ? data.fullName : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      window.prompt("", link);
    }
  };

  const shell = (children) => (
    <div dir={t.dir} lang={lang} translate="no" className="notranslate min-h-screen bg-paper font-plex text-primary antialiased">
      <AssessmentHeader t={t} />
      <main className="mx-auto max-w-xl px-5 pb-16 pt-16">{children}</main>
    </div>
  );

  if (state === "loading") {
    return shell(
      <div className="flex justify-center pt-10">
        <Spinner />
      </div>
    );
  }

  if (state === "notfound" || (state === "error" && !data)) {
    return shell(<p className="text-[17px] leading-relaxed text-mute">{state === "notfound" ? t.notFound : t.errLoadForm}</p>);
  }

  if (state === "pending") {
    // Each stage ticks after ~8 seconds; the last one stays active until the report is ready.
    const stage = Math.min(Math.floor(elapsed / 8000), t.preparingSteps.length - 1);
    return shell(
      <div aria-live="polite">
        <h1 className="font-alex text-[28px] font-semibold leading-snug">{t.preparingTitle(name)}</h1>
        <ol className="mt-8 space-y-4">
          {t.preparingSteps.map((label, i) => {
            const done = i < stage;
            const active = i === stage;
            return (
              <li key={label} className={`flex items-center gap-4 text-[17px] ${i > stage ? "text-mute/60" : ""}`}>
                <span className="grid h-7 w-7 shrink-0 place-items-center">
                  {done ? (
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-sky text-white">
                      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  ) : active ? (
                    <Spinner />
                  ) : (
                    <span className="h-2.5 w-2.5 rounded-full bg-rule" />
                  )}
                </span>
                <span className={active ? "font-medium" : ""}>{label}</span>
              </li>
            );
          })}
        </ol>
        <p className="mt-10 text-[15px] leading-relaxed text-mute">
          {elapsed > 75000 ? t.slowNote : t.preparingNote}
        </p>
      </div>
    );
  }

  if (state === "failed") {
    return shell(
      <div>
        <h1 className="font-alex text-[28px] font-semibold leading-snug">{t.failedTitle}</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-mute">{t.failedBody}</p>
        <a
          href={waLink(INSTITUTE_WHATSAPP, t.waBook(name, link))}
          target="_blank"
          rel="noreferrer"
          className="mt-8 block rounded-xl bg-highlight px-6 py-4 text-center font-alex text-[17px] font-semibold text-white hover:bg-[#e2523a]"
        >
          {t.bookCall}
        </a>
      </div>
    );
  }

  const actions = (
    <div className="space-y-3">
      <a
        href={waLink(INSTITUTE_WHATSAPP, t.waBook(name, link))}
        target="_blank"
        rel="noreferrer"
        className="block rounded-xl bg-highlight px-6 py-4 text-center font-alex text-[17px] font-semibold text-white transition-colors hover:bg-[#e2523a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
      >
        {t.bookCall}
      </a>
      <div className="grid grid-cols-3 gap-2 text-[14px]">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-xl border border-white/25 px-2 py-3 font-medium hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {t.savePdf}
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="rounded-xl border border-white/25 px-2 py-3 font-medium hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {copied ? t.copied : t.copyLink}
        </button>
        <a
          href={waLink("", t.waSelf(link))}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-white/25 px-2 py-3 text-center font-medium hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {t.sendMe}
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper" dir={t.dir}>
      <div className="bg-primary">
        <AssessmentHeader t={t} dark />
      </div>
      <ReportView data={data} publicId={publicId} actions={actions} />
    </div>
  );
};

export default AssessmentResult;
