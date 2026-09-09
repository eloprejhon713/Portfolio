/**
 * Resume-only Q&A for Jhon Elopre (Junior Programmer — Elopre, Jhon.pdf).
 * Answers in first person; facts only from the resume.
 */

const RESUME = {
  about:
    "I'm Jhon Elopre, a Full-Stack Web & Mobile Developer. I graduated with a BS in Computer Science from Pamantasan ng Lungsod ng Muntinlupa (2021–2025). I'm currently working as a Developer at a private school in Taguig, and I also freelance on web and mobile projects. I've built systems like Alumni Tracking and Barangay Management, plus AI work such as an LSTM-based career recommendation system.",
  contact:
    "You can reach me at eloprepotchy@gmail.com or +639369881562. LinkedIn: https://www.linkedin.com/in/jhon-elopre-083778369/. I'm based at NBP Reservation Magdaong Drive, Poblacion, Muntinlupa City.",
  education:
    "I graduated with a Bachelor of Science in Computer Science from Pamantasan ng Lungsod ng Muntinlupa (February 2021 – December 2025). I completed Senior High School (ICT Strand) at Muntinlupa National High School Main (June 2017 – March 2021).",
  certifications:
    "I hold certifications in Python Fundamentals for Beginners and Python for Data Science from Great Learning Academy.",
  experience:
    "I currently work as a Developer at a private school in Taguig. I also freelance as a Web & Mobile Developer (January 2023 – Present), building responsive websites and SPAs with HTML, CSS, JavaScript, PHP, Bootstrap, and React.js, as well as Flutter mobile apps with REST API integration.\n\nI previously served as Intern Programmer (August 12 – November 17, 2025), contributing to an Alumni Tracking System and OJT Portal—implementing record workflows, improving Bootstrap UI, and helping deliver systems that manage 500+ records.",
  freelance:
    "My freelance portfolio includes:\n\n• Barangay Management System — resident profiling, records, document requests, and printable Barangay Clearance generation.\n• Traffic Routing with Genetic Algorithms & Big Data — smarter routes, reduced congestion, and data-driven recommendations.\n• Alumni Tracking System — profiling, employment tracking, announcements, and institutional reporting.\n• AI Budget Decision Support System — predictive analytics for small-business expense and income forecasting.\n\nI also built Food Hub (Flutter/Dart food ordering app with Firebase & MySQL) and games: Find the Five Stars (Node.js), Fluppybrid (Dart/Flutter), and Eagle's Path (Python/Pygame).",
  thesis:
    "My thesis projects are:\n\n• LSTM-Based NLP Career Recommendation System — personalized career suggestions using LSTM, NLP, OCR (Tesseract), and GloVe embeddings in Python.\n• SupplySyncApp — a Flutter app with a PHP API for supply requests, inventory monitoring, approvals, and facility reservations.",
  skills:
    "I work with HTML, CSS, JavaScript, React.js, and Bootstrap on the frontend; PHP, Python, Node.js, MySQL, and Firebase on the backend; Flutter for mobile; and Python with LSTM, NLP, OCR, and predictive analytics for AI/ML. I use Git, GitHub, and CI/CD for version control and delivery.",
  achievements:
    "I've competed in the Huawei 9th ICT Competition, the 13th IT Skills Olympics, and E-ROVOUTIKA: E-ROBOT V1 Robotics Competition.",
  acts:
    "I also built live ACTS Colleges portals: Student (https://student.actscolleges.edu.ph/studentportal.html), Parent (https://parent.actscolleges.edu.ph/), and Employee (https://employee.actscolleges.edu.ph/).",
  notFound:
    "I don't have that detail here. Feel free to email me at eloprepotchy@gmail.com for more information.",
};

function answerFromResume(question) {
  const t = String(question || "").toLowerCase().trim();
  if (!t) return RESUME.notFound;

  if (/(contact|email|phone|linkedin|hire|reach|get in touch|address)/.test(t)) {
    return RESUME.contact;
  }
  if (/(work experience|experience|intern|freelance developer|job|employment|ojt)/.test(t)) {
    return RESUME.experience;
  }
  if (/(thesis)/.test(t) || /(lstm|career recommendation|supplysync|supply sync|reservation)/.test(t)) {
    if (/lstm|career/.test(t)) {
      return "I developed an LSTM-Based NLP Career Recommendation System using LSTM, NLP, OCR (Tesseract), and GloVe embeddings in Python. It matches student skills to career paths and provides personalized roadmaps.";
    }
    if (/supply|reservation/.test(t)) {
      return "SupplySyncApp is my Flutter mobile system with a PHP backend for supply requests, low-stock inventory monitoring, admin/staff approvals, and facility reservation booking.";
    }
    return RESUME.thesis;
  }
  if (/food hub|foodhub|food order|ordering app/.test(t)) {
    return "I built Food Hub — a Flutter/Dart mobile food ordering app. Browse menus, add to cart, pay with GCash and other options, track orders in real time, and manage accounts. It uses Firebase and MySQL on the backend.";
  }
  if (/eagle|eagle'?s path|python game/.test(t)) {
    return "I built Eagle's Path — a Flappy Bird–inspired pixel-art game in Python with Pygame. Press Space to flap, dodge wooden logs, track your best score, and restart for endless flights.";
  }
  if (/fluppy|flappy|dart game/.test(t)) {
    return "I built Fluppybrid — a Flappy Bird–style 2D mobile game with Dart and Flutter. Tap to flap, dodge wooden obstacles, chase high scores, and restart quickly for endless gameplay.";
  }
  if (/find|five stars|platform|puzzle game|nodejs game|node\.?js game/.test(t)) {
    return "I built Find the Five Stars — a 2D platform puzzle game with Node.js. Players collect five hidden stars, dodge spikes and enemies, use keys and hints, and reach the goal across increasingly challenging levels.";
  }
  if (/(freelance project|freelance projects|project portfolio|projects|systems have you built)/.test(t)) {
    return RESUME.freelance;
  }
  if (/barangay/.test(t)) {
    return "My Barangay Management System handles resident profiling, record keeping, and document request tracking, including a Barangay Clearance feature to create, generate, and print official documents with less manual paperwork.";
  }
  if (/traffic|genetic|routing|congestion/.test(t)) {
    return "I built a traffic routing system using Genetic Algorithms and Big Data Analytics to optimize travel paths, reduce congestion, and provide data-driven routing recommendations.";
  }
  if (/alumni/.test(t)) {
    return "My Alumni Tracking System centralizes alumni profiling, batch management, employment status, and contact updates, with announcements, verification, and reporting. During my internship, I helped deliver systems managing 500+ records.";
  }
  if (/budget|predictive|decision support|dss|small business/.test(t)) {
    return "I built a cloud-based decision support system that uses AI predictive analytics to forecast expenses and income for small businesses, delivering real-time financial insights and automated budget planning.";
  }
  if (/(certification|certificate|great learning)/.test(t)) {
    return RESUME.certifications;
  }
  if (/(education|school|college|university|plmun|degree|graduate)/.test(t)) {
    return RESUME.education;
  }
  if (/(tech stack|skills|technologies|tools|react|flutter|php|python|stack)/.test(t)) {
    return RESUME.skills;
  }
  if (/(achievement|award|competition|olympics|huawei|robotics)/.test(t)) {
    return RESUME.achievements;
  }
  if (/(acts|student portal|parent portal|employee portal)/.test(t)) {
    return RESUME.acts;
  }
  if (/(who is|about jhon|about you|summary|introduce)/.test(t)) {
    return RESUME.about;
  }
  if (/(service|offer|what do you do)/.test(t)) {
    return `${RESUME.about}\n\n${RESUME.skills}`;
  }

  return RESUME.notFound;
}

const PORTFOLIO_SYSTEM = `
You are Jhon Elopre answering as yourself (first person: I / my / me). Use only the facts below.

STRICT RULES:
- Speak as Jhon in first person
- Answer ONLY based on the resume facts below
- DO NOT invent projects, experience, or skills
- Do NOT say "his", "he", or "from my resume"
- Professional, concise tone (max ~120 words)
- If not found, say you don't have that detail and offer eloprepotchy@gmail.com

${Object.entries(RESUME)
  .filter(([k]) => k !== "notFound")
  .map(([k, v]) => `${k.toUpperCase()}:\n${v}`)
  .join("\n\n")}
`.trim();

module.exports = { answerFromResume, PORTFOLIO_SYSTEM, RESUME };
