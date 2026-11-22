// Career assessment questions (single source of truth).
// A short, practical version of the institute's "BARBISH AI CAREER EXPLORER"
// Google Form: about 10 tap-to-answer questions per visitor (around 2 minutes),
// keeping the answers the report needs to stay accurate.
// The public form is rendered from this list, the AI prompt uses the labels,
// and the admin panel shows answers with the same labels.
//
// Types:
//   single – pick one option
//   multi  – pick several (optional `max`)
//   grid   – rate each row from 1 to 5 (supported, not used right now)
//   text   – free text (set required: false to make it optional)
//
// showIf: { currentStatus: [...] } shows a question only to those visitors,
// so school students get study-choice questions and everyone else gets
// career questions. Hidden questions are never required.
//
// To change the form, edit this file only. Keep option `value`s stable once
// the form is live, because saved answers reference them.

const SCHOOL = ["school"];
const CAREER = ["university", "graduate", "employed"];

const o = (value, en, ar) => ({ value, en, ar });
const UP_TO_3 = { en: "Choose up to 3", ar: "اختر حتى 3" };

const QUESTIONS = [
  {
    id: "currentStatus",
    type: "single",
    required: true,
    label: { en: "What describes you right now?", ar: "ما هو وضعك الحالي؟" },
    options: [
      o("school", "School student", "طالب مدرسة"),
      o("university", "University student", "طالب جامعي"),
      o("graduate", "Graduate looking for work", "خريج وأبحث عن عمل"),
      o("employed", "Working, and want to grow or change field", "موظف وأريد التطور أو تغيير مجالي"),
    ],
  },
  {
    id: "schoolGrade",
    type: "single",
    required: true,
    showIf: { currentStatus: SCHOOL },
    label: { en: "Which grade are you in?", ar: "في أي صف أنت؟" },
    options: [
      o("10", "Grade 10", "العاشر"),
      o("11", "Grade 11", "الحادي عشر"),
      o("12", "Grade 12", "الثاني عشر"),
      o("completed", "Finished school", "أنهيت المدرسة"),
    ],
  },
  {
    id: "favoriteSubjects",
    type: "multi",
    max: 3,
    required: true,
    showIf: { currentStatus: SCHOOL },
    label: { en: "Which subjects do you like most?", ar: "ما هي المواد التي تحبها أكثر؟" },
    hint: UP_TO_3,
    options: [
      o("math", "Math", "الرياضيات"),
      o("science", "Science (physics, chemistry, biology)", "العلوم (فيزياء، كيمياء، أحياء)"),
      o("computing", "Computers", "الحاسوب"),
      o("languages", "Languages", "اللغات"),
      o("arts", "Arts", "الفنون"),
      o("business", "Economics and business", "الاقتصاد وإدارة الأعمال"),
      o("social", "Social sciences", "العلوم الاجتماعية"),
    ],
  },
  {
    id: "fieldOfStudy",
    type: "text",
    required: false,
    showIf: { currentStatus: CAREER },
    label: { en: "What did you study?", ar: "ما هو اختصاصك أو مجال دراستك؟" },
    placeholder: { en: "Business, nursing, computer science...", ar: "إدارة أعمال، تمريض، علوم حاسوب..." },
  },
  {
    id: "interests",
    type: "multi",
    max: 3,
    required: true,
    label: { en: "Which fields interest you most?", ar: "أي مجال يجذبك أكثر؟" },
    hint: UP_TO_3,
    options: [
      o("tech", "Technology and programming", "التكنولوجيا والبرمجة"),
      o("design", "Design and media", "التصميم والإعلام"),
      o("business", "Marketing and business", "التسويق والأعمال"),
      o("engineering", "Engineering", "الهندسة"),
      o("health", "Health and nursing", "الصحة والتمريض"),
      o("languages", "Languages", "اللغات"),
      o("education", "Teaching and training", "التعليم والتدريب"),
      o("finance", "Accounting and finance", "المحاسبة والمال"),
    ],
  },
  {
    id: "enjoys",
    type: "multi",
    max: 3,
    required: true,
    label: { en: "What do you enjoy doing?", ar: "ماذا تحب أن تفعل؟" },
    hint: UP_TO_3,
    options: [
      o("problemSolving", "Solving problems", "حل المشكلات"),
      o("helping", "Helping people", "مساعدة الناس"),
      o("creating", "Designing and creating", "التصميم والإبداع"),
      o("computer", "Working on a computer", "العمل على الكمبيوتر"),
      o("organizing", "Organizing and leading", "التنظيم والقيادة"),
      o("communicating", "Talking and persuading", "التواصل والإقناع"),
      o("handsOn", "Building and experimenting", "التجربة والعمل باليد"),
    ],
  },
  {
    id: "strengths",
    type: "multi",
    max: 3,
    required: true,
    label: { en: "What are your strongest points?", ar: "ما هي أبرز نقاط قوتك؟" },
    hint: UP_TO_3,
    options: [
      o("analysis", "Analysis and logic", "التحليل والتفكير المنطقي"),
      o("communication", "Communication", "التواصل"),
      o("creativity", "Creativity", "الإبداع"),
      o("organization", "Accuracy and organization", "الدقة والتنظيم"),
      o("leadership", "Leadership", "القيادة"),
      o("teamwork", "Teamwork", "العمل مع فريق"),
      o("digital", "Digital skills", "المهارات الرقمية"),
      o("unsure", "Not sure", "لست متأكداً"),
    ],
  },
  {
    id: "workType",
    type: "single",
    required: true,
    label: { en: "What kind of work suits you best?", ar: "أي نوع عمل يناسبك أكثر؟" },
    options: [
      o("people", "With people and clients", "مع الناس والعملاء"),
      o("tech", "On computers and technology", "على الكمبيوتر والتكنولوجيا"),
      o("creative", "Creative work", "عمل إبداعي"),
      o("data", "With numbers and data", "مع الأرقام والبيانات"),
      o("health", "In healthcare", "في القطاع الصحي"),
      o("teaching", "Teaching and training", "في التعليم والتدريب"),
      o("field", "Field or hands-on work", "عمل ميداني أو يدوي"),
      o("ownBusiness", "My own business", "مشروعي الخاص"),
    ],
  },
  {
    id: "majorChallenge",
    type: "single",
    required: true,
    showIf: { currentStatus: SCHOOL },
    label: { en: "What's hardest about choosing your major?", ar: "ما أصعب شيء في اختيار تخصصك؟" },
    options: [
      o("unsure", "I don't know what suits me", "لا أعرف ما يناسبني"),
      o("tooMany", "Too many options", "الخيارات كثيرة"),
      o("jobs", "Jobs after graduating", "فرص العمل بعد التخرج"),
      o("cost", "The cost", "التكلفة"),
      o("family", "My family's opinion", "رأي العائلة"),
      o("none", "Nothing, I've decided", "لا شيء، قررت"),
    ],
  },
  {
    id: "goal",
    type: "single",
    required: true,
    showIf: { currentStatus: CAREER },
    label: { en: "What's your goal for the next 6 months?", ar: "ما هدفك خلال الأشهر الستة القادمة؟" },
    options: [
      o("firstJob", "My first job", "أول وظيفة"),
      o("betterJob", "A better job or promotion", "وظيفة أفضل أو ترقية"),
      o("change", "Change my field", "تغيير مجالي"),
      o("freelance", "Freelance or remote work", "العمل الحر أو عن بُعد"),
      o("skill", "Learn a new skill", "تعلّم مهارة جديدة"),
      o("business", "Start my own business", "بدء مشروعي الخاص"),
    ],
  },
  {
    id: "experience",
    type: "single",
    required: true,
    showIf: { currentStatus: CAREER },
    label: { en: "How much work experience do you have?", ar: "كم لديك من خبرة عمل؟" },
    options: [
      o("none", "None", "لا توجد"),
      o("internship", "Internship only", "تدريب عملي فقط"),
      o("under1", "Less than a year", "أقل من سنة"),
      o("1to3", "1 to 3 years", "من سنة إلى 3 سنوات"),
      o("over3", "More than 3 years", "أكثر من 3 سنوات"),
    ],
  },
  {
    id: "challenge",
    type: "single",
    required: true,
    showIf: { currentStatus: CAREER },
    label: { en: "What's holding you back most right now?", ar: "ما الذي يعيقك أكثر الآن؟" },
    options: [
      o("direction", "I don't know which direction to take", "لا أعرف أي اتجاه أختار"),
      o("skills", "I'm missing skills", "تنقصني المهارات"),
      o("experience", "I'm missing experience", "تنقصني الخبرة"),
      o("cv", "My CV is weak", "سيرتي الذاتية ضعيفة"),
      o("interviews", "Interviews and confidence", "المقابلات والثقة بالنفس"),
      o("opportunities", "Few opportunities", "قلة الفرص"),
      o("timeMoney", "Time or money", "الوقت أو المال"),
    ],
  },
  {
    id: "weeklyTime",
    type: "single",
    required: true,
    label: { en: "How many hours a week can you give to learning?", ar: "كم ساعة أسبوعياً يمكنك أن تخصص للتعلم؟" },
    options: [
      o("under2", "Less than 2 hours", "أقل من ساعتين"),
      o("2to5", "2 to 5 hours", "من 2 إلى 5 ساعات"),
      o("6to10", "6 to 10 hours", "من 6 إلى 10 ساعات"),
      o("over10", "More than 10 hours", "أكثر من 10 ساعات"),
    ],
  },
  {
    id: "location",
    type: "single",
    required: true,
    label: { en: "Where would you like to study or work?", ar: "أين تفضّل أن تدرس أو تعمل؟" },
    options: [
      o("lebanon", "Lebanon", "لبنان"),
      o("gulf", "The Gulf", "الخليج"),
      o("europe", "Europe", "أوروبا"),
      o("remote", "Remotely, from anywhere", "عن بُعد من أي مكان"),
      o("undecided", "Not decided yet", "لم أقرر بعد"),
    ],
  },
];

// Kept for older records and the AI prompt; the current form doesn't ask for age.
const AGE_RANGES = [
  { value: "under18", en: "Under 18", ar: "أقل من 18" },
  { value: "18-22", en: "18–22", ar: "18–22" },
  { value: "23-29", en: "23–29", ar: "23–29" },
  { value: "30plus", en: "30+", ar: "30 وما فوق" },
];

const TEXT_MAX = 600;

// Is this question shown for these answers?
function isVisible(q, answers) {
  if (!q.showIf) return true;
  return Object.entries(q.showIf).every(([key, allowed]) =>
    allowed.includes(answers ? answers[key] : undefined)
  );
}

// Validate raw answers from the client against the config.
// Returns { answers, errors } where answers only contains known, clean values
// for questions this visitor actually sees.
function validateAnswers(raw) {
  const input = raw && typeof raw === "object" ? raw : {};
  const answers = {};
  const errors = [];

  for (const q of QUESTIONS) {
    // Visibility depends on earlier answers, which are already cleaned.
    if (!isVisible(q, answers)) continue;
    const value = input[q.id];

    if (q.type === "single") {
      if (q.options.some((opt) => opt.value === value)) answers[q.id] = value;
      else if (q.required) errors.push(q.id);
    } else if (q.type === "multi") {
      const list = Array.isArray(value) ? value : [];
      const clean = [...new Set(list)].filter((v) => q.options.some((opt) => opt.value === v));
      if (clean.length > 0 && (!q.max || clean.length <= q.max)) answers[q.id] = clean;
      else if (q.required || clean.length > 0) errors.push(q.id);
    } else if (q.type === "grid") {
      const obj = value && typeof value === "object" ? value : {};
      const clean = {};
      for (const row of q.rows) {
        const n = Number(obj[row.value]);
        if (Number.isInteger(n) && n >= 1 && n <= 5) clean[row.value] = n;
      }
      if (Object.keys(clean).length === q.rows.length) answers[q.id] = clean;
      else if (q.required || Object.keys(clean).length > 0) errors.push(q.id);
    } else if (q.type === "text") {
      const text = typeof value === "string" ? value.trim().slice(0, TEXT_MAX) : "";
      if (text) answers[q.id] = text;
      else if (q.required) errors.push(q.id);
    }
  }

  return { answers, errors };
}

// Turn stored answers into readable "question → answer" pairs.
function describeAnswers(answers, lang = "en") {
  const l = lang === "ar" ? "ar" : "en";
  const sep = l === "ar" ? "، " : ", ";
  const label = (list, v) => {
    const found = list.find((x) => x.value === v);
    return found ? found[l] : String(v);
  };

  return QUESTIONS.filter((q) => answers && answers[q.id] !== undefined).map((q) => {
    const value = answers[q.id];
    let text;
    if (q.type === "single") text = label(q.options, value);
    else if (q.type === "multi") text = value.map((v) => label(q.options, v)).join(sep);
    else if (q.type === "grid") text = q.rows.map((r) => `${r[l]}: ${value[r.value]}/5`).join(sep);
    else text = String(value);
    return { id: q.id, question: q.label[l], answer: text };
  });
}

module.exports = { QUESTIONS, AGE_RANGES, TEXT_MAX, isVisible, validateAnswers, describeAnswers };
