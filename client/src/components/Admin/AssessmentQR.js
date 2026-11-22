import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { XMarkIcon, ArrowDownTrayIcon, LinkIcon } from "@heroicons/react/24/outline";

const LIVE_SITE = "https://www.barbish-institution.com";

// QR codes are printed on brochures, so they must always point to the live site,
// even when this panel is opened from a local or staging copy.
const siteOrigin = () => {
  const origin = window.location.origin;
  return /localhost|127\.0\.0\.1/.test(origin) ? LIVE_SITE : origin;
};

const cleanSource = (value) =>
  value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9_-]/g, "").slice(0, 60);

const AssessmentQR = ({ onClose }) => {
  const [source, setSource] = useState(`jobfair-${new Date().getFullYear()}`);
  const [png, setPng] = useState("");
  const [copied, setCopied] = useState(false);
  const src = cleanSource(source);
  const link = `${siteOrigin()}/assessment${src ? `?src=${src}` : ""}`;

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(link, {
      width: 1200,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark: "#1c1a4b", light: "#ffffff" },
    }).then((url) => alive && setPng(url));
    return () => {
      alive = false;
    };
  }, [link]);

  const downloadSvg = async () => {
    const svg = await QRCode.toString(link, {
      type: "svg",
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark: "#1c1a4b", light: "#ffffff" },
    });
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `barbish-assessment-qr-${src || "general"}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      window.prompt("Copy this link", link);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-title"
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="qr-title" className="text-xl font-bold text-gray-900">
              Brochure QR code
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Scanning it opens the career assessment. The tag shows where each person came from.
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:text-gray-600" aria-label="Close">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-medium text-gray-700">Source tag</span>
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="jobfair-2026"
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
          />
          <span className="mt-1 block text-xs text-gray-500">
            Use one tag per event or brochure, for example jobfair-2026 or university-visit.
          </span>
        </label>

        <div className="mt-5 flex justify-center rounded-xl border border-gray-200 bg-white p-4">
          {png ? (
            <img src={png} alt={`QR code for ${link}`} className="h-64 w-64" />
          ) : (
            <div className="h-64 w-64 animate-pulse rounded-lg bg-gray-100" />
          )}
        </div>

        <p className="mt-3 break-all rounded-lg bg-gray-50 px-3 py-2 text-center text-sm text-gray-700" dir="ltr">
          {link}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <a
            href={png || undefined}
            download={`barbish-assessment-qr-${src || "general"}.png`}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <ArrowDownTrayIcon className="h-4 w-4" /> PNG
          </a>
          <button
            onClick={downloadSvg}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowDownTrayIcon className="h-4 w-4" /> SVG for print
          </button>
          <button
            onClick={copy}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <LinkIcon className="h-4 w-4" /> {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentQR;
