import React from "react";
import strings from "./strings";

const formatDate = (value, lang) => {
  try {
    return new Intl.DateTimeFormat(lang === "ar" ? "ar-LB-u-nu-latn" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch (e) {
    return "";
  }
};

export const referenceFor = (publicId, createdAt) =>
  `BI-${new Date(createdAt).getFullYear()}-${String(publicId || "").slice(0, 6).toUpperCase()}`;

const SectionTitle = ({ children }) => (
  <h2 className="font-alex text-[20px] font-semibold leading-snug text-primary">{children}</h2>
);

// The match score drawn on a measuring rule (0–100) instead of a big number.
const MatchRule = ({ score, label }) => {
  const value = Math.max(0, Math.min(100, Number(score) || 0));
  // Follows the page direction: fills from the right in Arabic, from the left in English.
  return (
    <div className="mt-6">
      <div className="mb-2 flex items-baseline justify-between text-sm text-mute">
        <span>0</span>
        <span className="font-medium text-primary">
          {label}{" "}
          <span className="font-alex text-base font-bold" dir="ltr">
            {value}%
          </span>
        </span>
        <span>100</span>
      </div>
      <div className="relative h-8" role="img" aria-label={`${label} ${value}%`}>
        <div className="absolute inset-x-0 top-3 h-2 rounded-full bg-rule" />
        <div className="absolute start-0 top-3 h-2 rounded-full bg-primary" style={{ width: `${value}%` }} />
        {Array.from({ length: 11 }).map((_, i) => (
          <span
            key={i}
            className={`absolute top-0 w-px ${i % 5 === 0 ? "h-3 bg-primary/50" : "h-2 bg-primary/25"}`}
            style={{ insetInlineStart: `${i * 10}%` }}
          />
        ))}
        <span
          className="absolute top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] border-white bg-highlight shadow-[0_0_0_1px_rgba(28,26,75,0.15)] rtl:translate-x-1/2"
          style={{ insetInlineStart: `${value}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

const priorityStyle = {
  high: "text-highlight",
  medium: "text-sky",
  low: "text-mute",
};

const ReportView = ({ data, publicId, compact = false, actions = null }) => {
  const lang = data.language === "en" ? "en" : "ar";
  const t = strings[lang];
  const r = data.result || {};
  const courses = data.courses || [];
  const path = r.recommendedPath || {};

  return (
    <article
      dir={t.dir}
      lang={lang}
      translate="no"
      className="report-page notranslate bg-paper font-plex text-primary antialiased"
    >
      {/* Header band */}
      <header className={`bg-primary text-white ${compact ? "px-5 pb-16 pt-6" : "px-5 pb-20 pt-8"}`}>
        <div className="mx-auto max-w-2xl">
          <p className="text-[15px] text-white/70">{t.reportLabel}</p>
          <h1 className={`mt-2 font-alex font-bold leading-tight ${compact ? "text-[28px]" : "text-[34px] sm:text-[40px]"}`}>
            {data.fullName}
          </h1>
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-[14px]">
            <div>
              <dt className="text-white/60">{t.issued}</dt>
              <dd className="font-medium">{formatDate(data.createdAt, lang)}</dd>
            </div>
            <div>
              <dt className="text-white/60">{t.reference}</dt>
              <dd className="font-medium" dir="ltr">{referenceFor(publicId, data.createdAt)}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 sm:px-5">
        {/* Best-fit path: the one strong moment of the page */}
        <section className="report-section -mt-12 rounded-[20px] border border-rule bg-white p-6 sm:p-8">
          <p className="text-[15px] text-mute">{t.bestPath}</p>
          <p className="mt-1 font-alex text-[26px] font-bold leading-snug sm:text-[30px]">{path.title}</p>
          {path.matchScore != null && <MatchRule score={path.matchScore} label={t.match} />}
          {path.why && <p className="mt-5 text-[16px] leading-relaxed text-mute">{path.why}</p>}
        </section>

        {(r.headline || r.summary) && (
          <section className="report-section px-1 pt-10">
            {r.headline && (
              <p className="border-s-4 border-highlight ps-4 font-alex text-[20px] font-semibold leading-snug">
                {r.headline}
              </p>
            )}
            {r.summary && <p className="mt-4 text-[16px] leading-[1.8] text-mute">{r.summary}</p>}
          </section>
        )}

        <div className="grid gap-10 px-1 pt-10 sm:grid-cols-2 sm:gap-8">
          {[
            [t.strengths, r.strengths],
            [t.passions, r.passions],
          ].map(([title, items]) =>
            items && items.length ? (
              <section key={title} className="report-section">
                <SectionTitle>{title}</SectionTitle>
                <ul className="mt-4 space-y-4">
                  {items.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-sky" aria-hidden="true" />
                      <div>
                        <p className="font-semibold leading-snug">{item.title}</p>
                        <p className="mt-1 text-[15px] leading-relaxed text-mute">{item.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null
          )}
        </div>

        {r.growthAreas && r.growthAreas.length > 0 && (
          <section className="report-section px-1 pt-12">
            <SectionTitle>{t.growth}</SectionTitle>
            <ul className="mt-4 divide-y divide-rule rounded-2xl border border-rule bg-white">
              {r.growthAreas.map((g, i) => (
                <li key={i} className="p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="font-semibold">{g.title}</p>
                    <span className={`text-[13px] font-medium ${priorityStyle[g.priority] || "text-mute"}`}>
                      {t.priority[g.priority] || ""}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-mute">{g.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {courses.length > 0 && (
          <section className="report-section px-1 pt-12">
            <div className="flex items-baseline justify-between gap-4">
              <SectionTitle>{t.courses}</SectionTitle>
              {!compact && (
                <a href="/courses" className="no-print shrink-0 text-[15px] font-medium text-sky underline-offset-4 hover:underline">
                  {t.viewCourses}
                </a>
              )}
            </div>
            <div className="mt-4 space-y-4">
              {courses.map((c) => (
                <div key={c.id} className="overflow-hidden rounded-2xl border border-rule bg-white sm:flex">
                  {c.image && (
                    <img
                      src={c.image}
                      alt=""
                      loading="lazy"
                      className="h-40 w-full object-cover sm:h-auto sm:w-44 sm:shrink-0"
                    />
                  )}
                  <div className="p-5">
                    <p className="font-alex text-[17px] font-semibold leading-snug">
                      <bdi>{c.title}</bdi>
                    </p>
                    {(c.category || c.durationHours) && (
                      <p className="mt-1 text-[14px] text-mute">
                        {[c.category, c.durationHours ? t.hours(c.durationHours) : null].filter(Boolean).join(lang === "ar" ? "، " : ", ")}
                      </p>
                    )}
                    <p className="mt-3 text-[15px] leading-relaxed">{c.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {r.roadmap && r.roadmap.length > 0 && (
          <section className="report-section px-1 pt-12">
            <SectionTitle>{t.roadmap}</SectionTitle>
            <ol className="mt-5">
              {r.roadmap.map((s, i) => (
                <li key={i} className="relative flex gap-4 pb-7 last:pb-0">
                  {i < r.roadmap.length - 1 && (
                    <span className="absolute start-[15px] top-9 h-[calc(100%-2.25rem)] w-0.5 bg-rule" aria-hidden="true" />
                  )}
                  <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary font-alex text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <div className="pt-0.5">
                    <p className="font-semibold leading-snug">{s.step}</p>
                    <p className="mt-0.5 text-[14px] font-medium text-sky">{s.timeframe}</p>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-mute">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {r.careerOptions && r.careerOptions.length > 0 && (
          <section className="report-section px-1 pt-12">
            <SectionTitle>{t.careers}</SectionTitle>
            <ul className="mt-4 space-y-4">
              {r.careerOptions.map((c, i) => (
                <li key={i} className="border-b border-rule pb-4 last:border-0 last:pb-0">
                  <p className="font-semibold">{c.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-mute">{c.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(r.howWeHelp || r.nextStep) && (
          <section className="report-section mt-12 rounded-[20px] bg-primary p-6 text-white sm:p-8">
            <h2 className="font-alex text-[20px] font-semibold">{t.howWeHelp}</h2>
            {r.howWeHelp && <p className="mt-3 text-[16px] leading-relaxed text-white/85">{r.howWeHelp}</p>}
            {r.nextStep && <p className="mt-4 font-semibold leading-relaxed">{r.nextStep}</p>}
            {actions && <div className="no-print mt-6">{actions}</div>}
          </section>
        )}

        {!compact && (
          <p className="px-1 pb-14 pt-8 text-[14px] leading-relaxed text-mute">{t.footnote}</p>
        )}
        {compact && <div className="pb-8" />}
      </div>
    </article>
  );
};

export default ReportView;
