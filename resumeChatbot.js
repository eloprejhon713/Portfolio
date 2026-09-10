/*
===========================================================
 JHON ELOPRE - RESUME CHATBOT (intent-scored)
 First-person answers for portfolio chat.
===========================================================
*/

const GREETING_REPLIES = [
  "Hello! How may I assist you today?",
  "Hi! How can I help you today?",
  "Hello! How can I assist you?",
  "Hi there! How may I help you?",
  "Hello! What can I assist you with today?",
  "Hi! Please let me know how I can assist you.",
  "Hello! Thank you for reaching out.",
  "Hi! Thank you for contacting us.",
  "Hello! How may we assist you today?",
];

const THANKS_REPLIES = [
  "You're welcome! I'm glad I could assist.",
  "You're very welcome. Please don't hesitate to reach out if you need anything else.",
  "My pleasure. I'm happy I could assist you.",
  "You're welcome! Is there anything else I can help you with?",
  "Glad I could assist. Have a great day!",
  "You're welcome, and thank you for reaching out.",
];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

const resumeKnowledge = {
  personal: {
    name: "Jhon Elopre",
    role: [
      "Full-Stack Web & Mobile Developer",
      "Freelance Web & Mobile Developer",
      "Intern Programmer",
    ],
    summary:
      "I'm a Full-Stack Web & Mobile Developer who builds responsive websites, single-page applications, cross-platform mobile apps, management systems, and AI-powered solutions.",
  },
  education: {
    college: {
      degree: "Bachelor of Science in Computer Science",
      school: "Pamantasan ng Lungsod ng Muntinlupa",
      location: "Muntinlupa City, Philippines",
      period: "February 2021 - December 2025",
    },
    seniorHigh: {
      strand: "Information Communication Technology (ICT)",
      school: "Muntinlupa National High School (MNHS) - Main",
      location: "Muntinlupa City, Philippines",
      period: "June 2017 - March 2021",
    },
  },
  experience: {
    freelance: {
      position: "Freelance Web & Mobile Developer",
      period: "January 2023 - Present",
    },
    internship: {
      position: "Intern Programmer",
      period: "August 12 2025 - November 17 2025",
    },
    current: {
      position: "Developer at a private school in Taguig",
      period: "Present",
    },
  },
  technologies: {
    web: ["HTML", "CSS", "JavaScript", "PHP", "Bootstrap", "React.js"],
    mobile: ["Flutter"],
    programming: ["Python", "JavaScript", "PHP", "Node.js"],
    ai: ["LSTM", "NLP", "OCR", "Tesseract", "GloVe embeddings", "Machine Learning", "Predictive Analytics"],
    api: ["RESTful APIs", "PHP Backend API"],
  },
  certifications: [
    "Python Fundamentals for Beginners - Great Learning Academy",
    "Python for Data Science - Great Learning Academy",
  ],
  competitions: [
    "Huawei 9th ICT Competition",
    "13th IT Skills Olympics",
    "E-ROVOUTIKA: E-ROBOT V1 Robotics Competition",
  ],
  projects: {
    barangay: {
      name: "Barangay Management System",
      features: [
        "Resident profiling",
        "Record keeping",
        "Document request tracking",
        "Barangay Clearance generation & printing",
      ],
    },
    traffic: {
      name: "Optimizing Traffic Routing Using Genetic Algorithms and Big Data Analytics",
      features: [
        "Smart route optimization",
        "Genetic Algorithms",
        "Big Data Analytics",
        "Congestion analysis",
      ],
    },
    alumni: {
      name: "Alumni Tracking System",
      features: [
        "Alumni profiling",
        "Batch management",
        "Employment status tracking",
        "Announcements & verification",
      ],
    },
    budget: {
      name: "Cloud-Based Decision Support System with AI-Powered Predictive Analytics for Small Business Budget Planning",
      features: [
        "AI budget forecasting",
        "Expense & income forecasting",
        "Real-time financial insights",
      ],
    },
    career: {
      name: "LSTM-Based NLP Career Recommendation System",
      technologies: ["Python", "LSTM", "NLP", "OCR", "Tesseract", "GloVe embeddings"],
      features: [
        "Personalized career suggestions",
        "Student skill matching",
        "Career roadmaps",
      ],
    },
    supplySync: {
      name: "SupplySyncApp Supply & Reservation Management System",
      technologies: ["Flutter", "PHP Backend API"],
      features: [
        "Supply request management",
        "Inventory tracking",
        "Facility reservations",
        "Admin/staff approvals",
      ],
    },
    portals: {
      name: "Campus Portals (Student, Parents, Employee)",
      features: [
        "Student Portal — https://student.actscolleges.edu.ph/studentportal.html",
        "Parents Portal — https://parent.actscolleges.edu.ph/",
        "Employee Portal — https://employee.actscolleges.edu.ph/",
      ],
    },
    games: {
      name: "Games & Food Hub",
      features: [
        "Fluppybrid (Dart/Flutter)",
        "Find the Five Stars (Node.js)",
        "Eagle's Path (Python/Pygame)",
        "Food Hub (Flutter/Dart, Firebase & MySQL)",
      ],
    },
  },
  contact: {
    email: "eloprepotchy@gmail.com",
    phone: "+639369881562",
    linkedin: "https://www.linkedin.com/in/jhon-elopre-083778369/",
    location: "NBP Reservation Magdaong Drive, Poblacion, Muntinlupa City",
  },
};

const intents = {
  about: [
    "who is jhon", "who is jhon elopre", "about jhon", "about you", "tell me about yourself",
    "tell me about jhon", "background", "professional background", "developer", "programmer",
    "full stack developer", "full-stack developer", "web developer", "mobile developer",
  ],
  services: [
    "service", "services", "what can you do", "what do you offer", "offer",
    "development service", "web development", "mobile development", "software development",
    "custom system", "digital solution", "business solution", "automation",
  ],
  webDevelopment: [
    "website", "web application", "web app", "web development", "responsive website",
    "single page application", "spa", "frontend", "html", "css", "javascript", "php",
    "bootstrap", "react", "react.js", "reactjs",
  ],
  mobileDevelopment: [
    "mobile", "mobile app", "mobile application", "mobile development", "app development",
    "flutter", "cross platform", "cross-platform",
  ],
  api: [
    "api", "rest api", "restful api", "api integration", "backend", "php backend",
    "real time data", "real-time data", "dynamic features",
  ],
  managementSystems: [
    "management system", "record management", "tracking system", "workflow management",
    "document management", "business system",
  ],
  barangay: [
    "barangay", "barangay system", "barangay management", "resident profiling",
    "barangay clearance", "document request",
  ],
  alumni: [
    "alumni", "alumni system", "alumni tracking", "alumni database", "batch management",
    "graduate tracking", "ojt portal",
  ],
  supplySync: [
    "supplysync", "supplysyncapp", "supply sync", "supply management", "inventory",
    "low stock", "facility reservation", "reservation", "booking",
  ],
  ai: [
    "ai", "artificial intelligence", "machine learning", "ml", "nlp", "lstm", "ocr",
    "tesseract", "glove", "recommendation system", "predictive analytics",
  ],
  career: [
    "career recommendation", "career suggestions", "career path", "thesis project", "thesis",
    "skill matching", "career roadmap",
  ],
  predictiveAnalytics: [
    "predictive analytics", "forecast", "budget forecast", "budget planning", "small business",
    "expense forecasting", "income forecasting", "decision support system", "cloud-based",
  ],
  traffic: [
    "traffic", "traffic routing", "route optimization", "genetic algorithm", "big data",
    "congestion", "travel time",
  ],
  portals: [
    "portal", "portals", "student portal", "parents portal", "parent portal", "employee portal",
    "acts", "campus portal",
  ],
  games: [
    "game", "games", "fluppy", "flappy", "five stars", "eagle", "food hub", "foodhub",
  ],
  freelance: [
    "freelance", "freelancer", "freelance developer", "client", "clients", "freelance project",
  ],
  internship: [
    "intern", "internship", "intern programmer", "ojt", "500 records", "500+ records",
  ],
  technologies: [
    "technology", "technologies", "tech stack", "programming language", "framework", "tools",
  ],
  python: ["python", "python programming", "python skills", "python certification"],
  react: ["react", "react.js", "reactjs", "react experience", "react developer"],
  flutter: ["flutter", "flutter app", "flutter development", "cross platform app"],
  education: [
    "education", "degree", "bachelor", "computer science", "university", "college",
    "pamantasan", "plmun", "senior high", "ict", "mnhs",
  ],
  certifications: [
    "certification", "certifications", "certificate", "great learning", "data science",
  ],
  competitions: [
    "competition", "competitions", "huawei", "it skills olympics", "robotics", "e-rovoutika",
  ],
  portfolio: [
    "portfolio", "projects", "project", "past projects", "sample projects", "work samples",
  ],
  contact: [
    "contact", "email", "phone", "linkedin", "hire", "reach you", "get in touch", "address",
  ],
  currentWork: [
    "current job", "where do you work", "taguig", "private school", "currently working",
  ],
};

function normalizeText(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function calculateIntentScore(message, keywords) {
  let score = 0;
  const matched = [];
  const normalizedMessage = normalizeText(message);

  for (const keyword of keywords) {
    const normalizedKeyword = normalizeText(keyword);
    if (!normalizedKeyword) continue;
    if (normalizedMessage.includes(normalizedKeyword)) {
      matched.push(keyword);
      const wordCount = normalizedKeyword.split(" ").length;
      if (wordCount >= 4) score += 5;
      else if (wordCount === 3) score += 4;
      else if (wordCount === 2) score += 2;
      else score += 1;
    }
  }
  return { score, matched };
}

function detectIntents(userMessage) {
  const results = [];
  for (const [intentName, keywords] of Object.entries(intents)) {
    const result = calculateIntentScore(userMessage, keywords);
    if (result.score > 0) {
      results.push({
        intent: intentName,
        score: result.score,
        matchedKeywords: result.matched,
      });
    }
  }
  results.sort((a, b) => b.score - a.score);
  return results;
}

function bullets(items) {
  return items.map((i) => `• ${i}`).join("\n");
}

const responses = {
  about: () =>
    "I'm Jhon Elopre, a Full-Stack Web & Mobile Developer. I build responsive websites, SPAs, cross-platform mobile apps, management systems, and AI-powered solutions. I graduated with a BS in Computer Science from PLMun and currently work as a Developer at a private school in Taguig while freelancing.",

  services: () =>
    "I offer web development, mobile development, custom management systems, API integration, workflow automation, and AI / predictive analytics solutions — from idea to shipped software.",

  webDevelopment: () =>
    "I develop responsive websites and single-page applications using HTML, CSS, JavaScript, PHP, Bootstrap, and React.js.",

  mobileDevelopment: () =>
    "I build cross-platform mobile applications with Flutter, including apps integrated with backend APIs (like SupplySyncApp and Food Hub).",

  api: () =>
    "I integrate RESTful APIs for dynamic features and real-time data. For example, SupplySyncApp uses Flutter with a PHP backend API.",

  managementSystems: () =>
    "I've built management systems for records, tracking, workflows, document generation, inventory, reservations, and campus operations.",

  barangay: () => {
    const p = resumeKnowledge.projects.barangay;
    return `${p.name}\n\nFeatures include:\n${bullets(p.features)}`;
  },

  alumni: () => {
    const p = resumeKnowledge.projects.alumni;
    return `${p.name}\n\nFeatures include:\n${bullets(p.features)}\n\nDuring my internship I also worked on an OJT Portal and helped deliver systems managing 500+ records.`;
  },

  supplySync: () => {
    const p = resumeKnowledge.projects.supplySync;
    return `${p.name}\n\nTechnologies:\n${bullets(p.technologies)}\n\nFeatures:\n${bullets(p.features)}`;
  },

  ai: () =>
    "I work with AI and machine learning — LSTM, NLP, OCR/Tesseract, GloVe embeddings, Python, and predictive analytics — through thesis and freelance projects.",

  career: () => {
    const p = resumeKnowledge.projects.career;
    return `${p.name}\n\nTechnologies:\n${bullets(p.technologies)}\n\nFeatures:\n${bullets(p.features)}`;
  },

  predictiveAnalytics: () => {
    const p = resumeKnowledge.projects.budget;
    return `${p.name}\n\nIt forecasts expenses and income for small businesses with:\n${bullets(p.features)}`;
  },

  traffic: () => {
    const p = resumeKnowledge.projects.traffic;
    return `${p.name}\n\nFocus areas:\n${bullets(p.features)}`;
  },

  portals: () => {
    const p = resumeKnowledge.projects.portals;
    return `${p.name}\n\n${bullets(p.features)}`;
  },

  games: () => {
    const p = resumeKnowledge.projects.games;
    return `${p.name}\n\n${bullets(p.features)}`;
  },

  freelance: () =>
    "I've freelanced as a Web & Mobile Developer since January 2023 — responsive sites, SPAs, Flutter apps, REST APIs, requirements gathering, and scalable client solutions. Projects include Barangay Management, traffic routing, Alumni Tracking, and an AI budget DSS.",

  internship: () =>
    "I was an Intern Programmer from August 12, 2025 to November 17, 2025. I worked on an Alumni Tracking System and OJT Portal, improved Bootstrap UI, tested and debugged features, and helped deliver systems managing 500+ records.",

  currentWork: () =>
    "I'm currently working as a Developer at a private school in Taguig, and I also continue freelance web and mobile work.",

  technologies: () =>
    `My stack includes:\n\nWeb:\n${bullets(resumeKnowledge.technologies.web)}\n\nMobile:\n${bullets(resumeKnowledge.technologies.mobile)}\n\nAI / Data:\n${bullets(resumeKnowledge.technologies.ai)}\n\nAlso: Node.js, MySQL, Firebase, Git, and CI/CD.`,

  python: () =>
    "I use Python for AI/ML, NLP, OCR, and data projects. I also hold Great Learning certifications in Python Fundamentals for Beginners and Python for Data Science.",

  react: () =>
    "I use React.js to build responsive websites and single-page applications.",

  flutter: () =>
    "I use Flutter for cross-platform mobile apps. SupplySyncApp and Food Hub are Flutter projects with backend API support.",

  education: () =>
    "I graduated with a BS in Computer Science from Pamantasan ng Lungsod ng Muntinlupa (February 2021 – December 2025). I completed Senior High (ICT Strand) at Muntinlupa National High School Main (June 2017 – March 2021).",

  certifications: () =>
    `My certifications:\n${bullets(resumeKnowledge.certifications)}`,

  competitions: () =>
    `I've competed in:\n${bullets(resumeKnowledge.competitions)}`,

  portfolio: () =>
    `Selected projects:\n${bullets([
      "Barangay Management System",
      "Traffic Routing (Genetic Algorithms + Big Data)",
      "Alumni Tracking System",
      "AI Budget Planning DSS",
      "LSTM NLP Career Recommendation System",
      "SupplySyncApp",
      "Student / Parents / Employee portals",
      "Food Hub + games (Fluppybrid, Find the Five Stars, Eagle's Path)",
    ])}`,

  contact: () => {
    const c = resumeKnowledge.contact;
    return `You can reach me at ${c.email} or ${c.phone}. LinkedIn: ${c.linkedin}. Based at ${c.location}.`;
  },
};

function fallbackResponse() {
  return `I can answer questions about my services, technologies, projects, AI experience, freelance/internship work, education, certifications, competitions, and contact info.

Try asking:
• "What services do you offer?"
• "What technologies do you use?"
• "What projects have you developed?"
• "Do you have experience with AI?"

Or email me at eloprepotchy@gmail.com.`;
}

function isGreeting(t) {
  return (
    /^(hi|hello|hey|yo|good\s*(morning|afternoon|evening))\b[!.,?\s]*$/i.test(t) ||
    /^(hi|hello|hey)\s+(there|jhon|everyone)?[!.,?\s]*$/i.test(t)
  );
}

function isThanks(t) {
  return (
    /^(thanks+|thank\s*you+|thankyou+|ty|thx|salamat)\b[!.,?\s]*$/i.test(t) ||
    /^(thanks+|thank\s*you+|thankyou+)\s+(so\s+much|a\s+lot|po)?[!.,?\s]*$/i.test(t)
  );
}

function chatbot(userMessage) {
  if (!userMessage || !String(userMessage).trim()) {
    return { text: fallbackResponse(), intent: null, confidence: 0, matches: [] };
  }

  const raw = String(userMessage).trim();
  const t = raw.toLowerCase();

  if (isGreeting(t)) {
    return { text: pickRandom(GREETING_REPLIES), intent: "greeting", confidence: 100, matches: ["greeting"] };
  }
  if (isThanks(t)) {
    return { text: pickRandom(THANKS_REPLIES), intent: "thanks", confidence: 100, matches: ["thanks"] };
  }

  const detected = detectIntents(userMessage);
  if (detected.length === 0) {
    return { text: fallbackResponse(), intent: null, confidence: 0, matches: [] };
  }

  const best = detected[0];
  const confidence = Math.min(100, Math.round((best.score / 10) * 100));
  const answer = responses[best.intent] ? responses[best.intent]() : fallbackResponse();

  return {
    text: answer,
    intent: best.intent,
    confidence,
    matches: best.matchedKeywords,
    allDetectedIntents: detected,
  };
}

const suggestedQuestions = [
  "What services do you offer?",
  "Can you develop a website for my business?",
  "Can you build a mobile application?",
  "What technologies do you use?",
  "What projects have you worked on?",
  "What is your thesis project?",
  "Do you have freelance experience?",
  "How can I contact you?",
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    resumeKnowledge,
    intents,
    responses,
    suggestedQuestions,
    normalizeText,
    detectIntents,
    chatbot,
    fallbackResponse,
    isGreeting,
    isThanks,
  };
}

if (typeof window !== "undefined") {
  window.ResumeChatbot = {
    resumeKnowledge,
    intents,
    responses,
    suggestedQuestions,
    normalizeText,
    detectIntents,
    chatbot,
    fallbackResponse,
  };
}
