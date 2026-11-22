import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import strings, { INSTITUTE_WHATSAPP } from "../../components/Assessment/strings";
import { getAssessmentForm, submitAssessment, getAssessmentResult } from "../../api/assessmentAPI";

const DRAFT_KEY = "barbish-assessment-draft";
const LAST_KEY = "barbish-assessment-last";

const readDraft = () => {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY)) || {};
  } catch (e) {
    return {};
  }
};
const writeDraft = (data) => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch (e) {
    /* storage unavailable: the form still works without a draft */
  }
};

const EMPTY_DETAILS = { fullName: "", phone: "", email: "", consent: false };

// Same rule as the server: a question with showIf only appears for matching answers.
const isVisible = (q, answers) =>
  !q.showIf ||
  Object.entries(q.showIf).every(([key, allowed]) => allowed.includes(answers[key]));

// --- Small building blocks -------------------------------------------------

export const AssessmentHeader = ({ t, onSwitchLang, dark = false }) => (
  <header className="mx-auto flex w-full max-w-xl items-center justify-between px-5 pt-5">
    <a
      href="/"
      className={`flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky ${
        dark ? "text-white" : "text-primary"
      }`}
    >
      <img src={logo} alt="" className="h-9 w-9 rounded-full bg-white object-cover object-top" />
      <span className="font-alex text-[15px] font-semibold">{t.institute}</span>
    </a>
    {onSwitchLang && (
      <button
        type="button"
        onClick={onSwitchLang}
        className={`rounded-lg px-3 py-2 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky ${
          dark ? "text-white/75" : "text-mute"
        }`}
      >
        {t.switchLang}
      </button>
    )}
  </header>
);

const PathMark = () => (
  <svg
    viewBox="0 0 320 120"
    className="pointer-events-none absolute -bottom-2 end-0 h-28 w-[85%] max-w-[360px] rtl:-scale-x-100"
    aria-hidden="true"
  >
    <path
      className="path-draw"
      d="M8 104 C 70 104, 70 40, 140 48 S 230 100, 312 16"
      fill="none"
      stroke="#409cd6"
      strokeWidth="2"
      strokeLinecap="round"
      pathLength="100"
      strokeDasharray="100"
    />
    <circle cx="8" cy="104" r="5" fill="#409cd6" />
    <circle cx="140" cy="48" r="5" fill="#409cd6" />
    <circle cx="312" cy="16" r="7" fill="#f16146" />
  </svg>
);

const Progress = ({ current, total }) => (
  <div className="flex gap-1" aria-hidden="true">
    {Array.from({ length: total }).map((_, i) => (
      <span
        key={i}
        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
          i <= current ? "bg-primary" : "bg-rule"
        }`}
      />
    ))}
  </div>
);

const Check = ({ on, square }) => (
  <span
    className={`grid h-6 w-6 shrink-0 place-items-center border-2 transition-colors ${
      square ? "rounded-md" : "rounded-full"
    } ${on ? "border-sky bg-sky text-white" : "border-rule bg-white"}`}
    aria-hidden="true"
  >
    {on && (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </span>
);

const optionClass = (on) =>
  `flex min-h-[56px] w-full items-center gap-3 rounded-xl border px-4 py-3 text-start text-[16px] leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
    on ? "border-sky bg-sky/10 text-primary" : "border-rule bg-white hover:border-primary/40"
  }`;

const numberClass = (on, height = "h-14") =>
  `${height} rounded-xl border font-alex text-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
    on ? "border-primary bg-primary text-white" : "border-rule bg-white hover:border-primary/40"
  }`;

const inputClass = (bad) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-[16px] text-primary placeholder:text-mute/60 focus:outline-none focus:ring-2 focus:ring-sky ${
    bad ? "border-highlight" : "border-rule"
  }`;

// --- Page -------------------------------------------------------------------

const AssessmentForm = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const source = params.get("src") || params.get("source") || "";
  const draft = useMemo(readDraft, []);

  const [lang, setLang] = useState(draft.lang === "en" ? "en" : "ar");
  const t = strings[lang];
  const [form, setForm] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [step, setStep] = useState(-1); // -1 intro, 0..n-1 questions, n details
  const [answers, setAnswers] = useState(draft.answers || {});
  const [details, setDetails] = useState({ ...EMPTY_DETAILS, ...(draft.details || {}) });
  const [stepError, setStepError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [phoneUsed, setPhoneUsed] = useState(false);
  // One assessment per person: if this device already submitted, show its report instead.
  const [checkingPrevious, setCheckingPrevious] = useState(true);
  const [previousId, setPreviousId] = useState(null);
  const advanceTimer = useRef(null);

  const load = async () => {
    setLoadError(false);
    const res = await getAssessmentForm();
    if (res.success) setForm(res.data);
    else setLoadError(true);
  };

  const checkPrevious = async () => {
    let id = null;
    try {
      id = localStorage.getItem(LAST_KEY);
    } catch (e) {
      /* storage unavailable */
    }
    if (id) {
      const res = await getAssessmentResult(id);
      if (res.success) {
        setPreviousId(id);
        if (res.data && res.data.language) setLang(res.data.language === "en" ? "en" : "ar");
      } else if (res.status === 404) {
        // The report was deleted (for example by an admin), so allow a new assessment.
        try {
          localStorage.removeItem(LAST_KEY);
        } catch (e) {
          /* ignore */
        }
      }
    }
    setCheckingPrevious(false);
  };

  useEffect(() => {
    load();
    checkPrevious();
    const timer = advanceTimer;
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    writeDraft({ lang, answers, details: { ...details, consent: false } });
  }, [lang, answers, details]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setStepError("");
  }, [step]);

  // Questions this visitor sees, based on their answers so far.
  const questions = useMemo(
    () => (form ? form.questions.filter((q) => isVisible(q, answers)) : []),
    [form, answers]
  );
  const total = questions.length + 1;
  const isDetails = form && step === questions.length;
  const q = form && step >= 0 && step < questions.length ? questions[step] : null;

  const switchLang = () => setLang((l) => (l === "ar" ? "en" : "ar"));
  // If the visitor closed the page earlier, resume at the first unanswered question.
  const startIn = (l) => {
    setLang(l);
    const firstOpen = questions.findIndex((x) => x.required && !isAnswered(x));
    setStep(firstOpen === -1 ? questions.length : firstOpen);
  };

  const isAnswered = (question) => {
    const v = answers[question.id];
    if (question.type === "multi") return Array.isArray(v) && v.length > 0;
    if (question.type === "text") return typeof v === "string" && v.trim().length > 0;
    if (question.type === "grid")
      return !!v && question.rows.every((r) => Number.isInteger(v[r.value]));
    return v !== undefined && v !== null && v !== "";
  };

  const goNext = () => {
    if (q && q.required && !isAnswered(q)) {
      setStepError(q.type === "grid" ? t.errGrid : t.errRequired);
      return;
    }
    setStep((s) => Math.min(s + 1, questions.length));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, -1));

  const pickSingle = (value) => {
    setAnswers((a) => ({ ...a, [q.id]: value }));
    clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => setStep((s) => s + 1), 220);
  };

  const toggleMulti = (value) => {
    setStepError("");
    setAnswers((a) => {
      const list = Array.isArray(a[q.id]) ? a[q.id] : [];
      if (list.includes(value)) return { ...a, [q.id]: list.filter((v) => v !== value) };
      if (q.max && list.length >= q.max) return a;
      return { ...a, [q.id]: [...list, value] };
    });
  };

  const setGrid = (row, n) => {
    setStepError("");
    setAnswers((a) => ({ ...a, [q.id]: { ...(a[q.id] || {}), [row]: n } }));
  };

  const setDetail = (key, value) => {
    setDetails((d) => ({ ...d, [key]: value }));
    setFieldErrors((e) => ({ ...e, [key]: undefined }));
    if (key === "phone") setPhoneUsed(false);
  };

  const validateDetails = () => {
    const errs = {};
    if (details.fullName.trim().length < 2) errs.fullName = t.errName;
    const digits = details.phone.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15 || !/^[+\d\s()-]+$/.test(details.phone.trim()))
      errs.phone = t.errPhone;
    if (details.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim()))
      errs.email = t.errEmail;
    if (!details.consent) errs.consent = t.errConsent;
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validateDetails()) return;
    setSubmitting(true);

    // Only send answers for questions this visitor actually saw.
    const visibleAnswers = {};
    questions.forEach((x) => {
      if (answers[x.id] !== undefined) visibleAnswers[x.id] = answers[x.id];
    });

    const res = await submitAssessment({
      fullName: details.fullName.trim(),
      phone: details.phone.trim(),
      email: details.email.trim(),
      consent: details.consent,
      language: lang,
      source,
      answers: visibleAnswers,
    });
    setSubmitting(false);

    if (res.success && res.publicId) {
      try {
        localStorage.removeItem(DRAFT_KEY);
        localStorage.setItem(LAST_KEY, res.publicId);
      } catch (err) {
        /* ignore */
      }
      navigate(`/assessment/report/${res.publicId}`);
      return;
    }

    // Send the visitor back to the first question the server rejected.
    const badQuestion = questions.findIndex((x) => (res.fields || []).includes(x.id));
    if (badQuestion >= 0) {
      setStep(badQuestion);
      setTimeout(() => setStepError(t.errRequired), 0);
      return;
    }
    if (res.status === 409 && res.code === "ALREADY_SUBMITTED") {
      setPhoneUsed(true);
      return;
    }
    setSubmitError(res.status === 429 ? res.message : t.errSubmit);
  };

  // --- Render -------------------------------------------------------------

  if (checkingPrevious) {
    return <div className="min-h-screen bg-paper" />;
  }

  if (previousId) {
    return (
      <div dir={t.dir} lang={lang} translate="no" className="notranslate min-h-screen bg-paper font-plex text-primary antialiased">
        <AssessmentHeader t={t} />
        <main className="mx-auto max-w-xl px-5 pb-16 pt-16">
          <h1 className="font-alex text-[28px] font-semibold leading-snug">{t.alreadyTitle}</h1>
          <p className="mt-4 text-[17px] leading-relaxed text-mute">{t.alreadyBody}</p>
          <button
            type="button"
            onClick={() => navigate(`/assessment/report/${previousId}`)}
            className="mt-8 w-full rounded-xl bg-highlight px-6 py-4 font-alex text-[17px] font-semibold text-white transition-colors hover:bg-[#e2523a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            {t.viewMyReport}
          </button>
        </main>
      </div>
    );
  }

  return (
    <div
      dir={t.dir}
      lang={lang}
      translate="no"
      className="notranslate min-h-screen bg-paper font-plex text-primary antialiased"
    >
      {step === -1 && (
        <>
          <section className="relative overflow-hidden bg-primary pb-28 text-white">
            <AssessmentHeader t={t} onSwitchLang={switchLang} dark />
            <div className="mx-auto max-w-xl px-5 pt-14">
              <h1 className="font-alex text-[38px] font-bold leading-[1.2] sm:text-5xl">
                {t.introTitle}
              </h1>
              <p className="mt-5 max-w-md text-[17px] leading-relaxed text-white/80">
                {t.introBody}
              </p>
              <p className="mt-4 text-[15px] text-white/60">{t.introMeta}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {[lang, lang === "ar" ? "en" : "ar"].map((l, i) => (
                  <button
                    key={l}
                    type="button"
                    lang={l}
                    onClick={() => startIn(l)}
                    disabled={!form}
                    className={`rounded-xl px-6 py-4 font-alex text-[17px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary disabled:opacity-60 ${
                      i === 0
                        ? "bg-highlight text-white hover:bg-[#e2523a]"
                        : "border border-white/30 text-white hover:bg-white/10"
                    }`}
                  >
                    {l === "ar" ? t.startAr : t.startEn}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[14px] text-white/55">{t.languageNote}</p>

              {loadError && (
                <p className="mt-4 text-[15px] text-white">
                  {t.errLoadForm}{" "}
                  <button type="button" onClick={load} className="font-semibold underline">
                    {t.retry}
                  </button>
                </p>
              )}
            </div>
            <PathMark />
          </section>

          <section className="mx-auto max-w-xl px-5 py-12">
            <h2 className="font-alex text-xl font-semibold">{t.howTitle}</h2>
            <ol className="mt-6 space-y-5">
              {t.how.map((line, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-primary font-alex text-sm font-semibold">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-[16px] leading-relaxed text-mute">{line}</span>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}

      {step >= 0 && form && (
        <div className="mx-auto flex min-h-screen max-w-xl flex-col">
          <AssessmentHeader t={t} onSwitchLang={switchLang} />

          <div className="px-5 pt-6">
            <Progress current={step} total={total} />
            <div className="mt-3 flex items-center justify-between text-sm text-mute">
              <button
                type="button"
                onClick={goBack}
                className="-ms-2 rounded-lg px-2 py-1 font-medium hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky"
              >
                {t.back}
              </button>
              <span>{t.stepOf(step + 1, total)}</span>
            </div>
          </div>

          {q && (
            <div className="flex flex-1 flex-col px-5 pb-32 pt-8">
              <h1 className="font-alex text-[26px] font-semibold leading-snug">{q.label[lang]}</h1>

              {q.type === "multi" && (
                <div className="mt-2 flex items-baseline justify-between gap-4 text-[15px] text-mute">
                  <span>{q.hint ? q.hint[lang] : q.max ? t.chooseUpTo(q.max) : t.chooseAll}</span>
                  {Array.isArray(answers[q.id]) && answers[q.id].length > 0 && (
                    <span className="font-medium text-sky">
                      {t.selected(answers[q.id].length, q.max)}
                    </span>
                  )}
                </div>
              )}
              {q.type === "grid" && (
                <p className="mt-2 text-[15px] text-mute">{q.hint ? q.hint[lang] : t.gridHint}</p>
              )}

              <div className="mt-7">
                {q.type === "single" && (
                  <div className="space-y-3" role="radiogroup" aria-label={q.label[lang]}>
                    {q.options.map((o) => {
                      const on = answers[q.id] === o.value;
                      return (
                        <button
                          key={o.value}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => pickSingle(o.value)}
                          className={optionClass(on)}
                        >
                          <Check on={on} />
                          <span>{o[lang]}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.type === "multi" && (
                  <div className="space-y-3" role="group" aria-label={q.label[lang]}>
                    {q.options.map((o) => {
                      const list = answers[q.id] || [];
                      const on = list.includes(o.value);
                      const full = !on && q.max && list.length >= q.max;
                      return (
                        <button
                          key={o.value}
                          type="button"
                          role="checkbox"
                          aria-checked={on}
                          onClick={() => toggleMulti(o.value)}
                          className={`${optionClass(on)} ${full ? "opacity-50" : ""}`}
                        >
                          <Check on={on} square />
                          <span>{o[lang]}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.type === "grid" && (
                  <div className="space-y-6">
                    {q.rows.map((row) => {
                      const current = (answers[q.id] || {})[row.value];
                      return (
                        <div key={row.value}>
                          <p className="mb-2.5 text-[16px] font-medium leading-snug">{row[lang]}</p>
                          <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label={row[lang]}>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <button
                                key={n}
                                type="button"
                                role="radio"
                                aria-checked={current === n}
                                onClick={() => setGrid(row.value, n)}
                                className={numberClass(current === n, "h-12")}
                              >
                                {n}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {q.type === "text" && (
                  <textarea
                    rows={4}
                    maxLength={600}
                    value={answers[q.id] || ""}
                    onChange={(e) => {
                      setStepError("");
                      setAnswers((a) => ({ ...a, [q.id]: e.target.value }));
                    }}
                    placeholder={q.placeholder ? q.placeholder[lang] : ""}
                    className={`${inputClass(false)} resize-none leading-relaxed`}
                    aria-label={q.label[lang]}
                  />
                )}
              </div>

              {stepError && (
                <p role="alert" className="mt-4 text-[15px] font-medium text-highlight">
                  {stepError}
                </p>
              )}
            </div>
          )}

          {isDetails && (
            <form onSubmit={submit} noValidate className="flex flex-1 flex-col px-5 pb-12 pt-8">
              <h1 className="font-alex text-[26px] font-semibold leading-snug">{t.detailsTitle}</h1>
              <p className="mt-2 text-[15px] leading-relaxed text-mute">{t.detailsBody}</p>

              <div className="mt-7 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-[15px] font-medium">{t.fullName}</span>
                  <input
                    type="text"
                    autoComplete="name"
                    value={details.fullName}
                    onChange={(e) => setDetail("fullName", e.target.value)}
                    placeholder={t.fullNamePh}
                    className={inputClass(fieldErrors.fullName)}
                  />
                  {fieldErrors.fullName && (
                    <span className="mt-1.5 block text-sm text-highlight">{fieldErrors.fullName}</span>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-[15px] font-medium">{t.phone}</span>
                  <input
                    type="tel"
                    dir="ltr"
                    inputMode="tel"
                    autoComplete="tel"
                    value={details.phone}
                    onChange={(e) => setDetail("phone", e.target.value)}
                    placeholder={t.phonePh}
                    className={`${inputClass(fieldErrors.phone)} rtl:text-right`}
                  />
                  {fieldErrors.phone && (
                    <span className="mt-1.5 block text-sm text-highlight">{fieldErrors.phone}</span>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-[15px] font-medium">
                    {t.email} <span className="font-normal text-mute">({t.optional})</span>
                  </span>
                  <input
                    type="email"
                    dir="ltr"
                    autoComplete="email"
                    value={details.email}
                    onChange={(e) => setDetail("email", e.target.value)}
                    placeholder="name@email.com"
                    className={`${inputClass(fieldErrors.email)} rtl:text-right`}
                  />
                  {fieldErrors.email && (
                    <span className="mt-1.5 block text-sm text-highlight">{fieldErrors.email}</span>
                  )}
                </label>

                <label className="flex cursor-pointer items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    checked={details.consent}
                    onChange={(e) => setDetail("consent", e.target.checked)}
                    className="peer sr-only"
                  />
                  <span className="rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-sky">
                    <Check on={details.consent} square />
                  </span>
                  <span className="text-[15px] leading-relaxed text-mute">{t.consent}</span>
                </label>
                {fieldErrors.consent && (
                  <p className="-mt-2 text-sm text-highlight">{fieldErrors.consent}</p>
                )}
              </div>

              {submitError && (
                <p role="alert" className="mt-5 text-[15px] font-medium text-highlight">
                  {submitError}
                </p>
              )}

              {phoneUsed && (
                <div role="alert" className="mt-5 rounded-xl border border-highlight/40 bg-white p-4">
                  <p className="text-[15px] font-medium leading-relaxed text-primary">{t.errPhoneUsed}</p>
                  <a
                    href={`https://wa.me/${INSTITUTE_WHATSAPP}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block font-semibold text-sky underline-offset-4 hover:underline"
                  >
                    {t.messageUs}
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 w-full rounded-xl bg-highlight px-6 py-4 font-alex text-[17px] font-semibold text-white transition-colors hover:bg-[#e2523a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-70"
              >
                {submitting ? t.submitting : t.submit}
              </button>
            </form>
          )}

          {q && (
            <div className="fixed inset-x-0 bottom-0 border-t border-rule bg-paper/95 backdrop-blur">
              <div className="mx-auto flex max-w-xl gap-3 px-5 py-4">
                <button
                  type="button"
                  onClick={goNext}
                  className="flex-1 rounded-xl bg-primary px-6 py-3.5 font-alex text-[16px] font-semibold text-white transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2"
                >
                  {q.type === "text" && !q.required && !isAnswered(q) ? t.skip : t.next}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssessmentForm;
