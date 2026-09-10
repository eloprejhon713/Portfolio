/**
 * Resume Q&A for Jhon Elopre — delegates to intent-scored resumeChatbot.
 * Keeps PORTFOLIO_SYSTEM for optional Anthropic enrichment.
 */

const { chatbot, resumeKnowledge } = require("./resumeChatbot");

const RESUME = {
  about: resumeKnowledge.personal.summary,
  contact: `You can reach me at ${resumeKnowledge.contact.email} or ${resumeKnowledge.contact.phone}. LinkedIn: ${resumeKnowledge.contact.linkedin}. Based at ${resumeKnowledge.contact.location}.`,
  education: `BS Computer Science — ${resumeKnowledge.education.college.school} (${resumeKnowledge.education.college.period}). Senior High ICT — ${resumeKnowledge.education.seniorHigh.school} (${resumeKnowledge.education.seniorHigh.period}).`,
  certifications: resumeKnowledge.certifications.join("; "),
  experience: `${resumeKnowledge.experience.current.position} (${resumeKnowledge.experience.current.period}). Freelance: ${resumeKnowledge.experience.freelance.position} (${resumeKnowledge.experience.freelance.period}). Internship: ${resumeKnowledge.experience.internship.position} (${resumeKnowledge.experience.internship.period}).`,
  freelance: Object.values(resumeKnowledge.projects)
    .map((p) => p.name)
    .join("; "),
  thesis: `${resumeKnowledge.projects.career.name}; ${resumeKnowledge.projects.supplySync.name}`,
  skills: [
    ...resumeKnowledge.technologies.web,
    ...resumeKnowledge.technologies.mobile,
    ...resumeKnowledge.technologies.programming,
    ...resumeKnowledge.technologies.ai,
  ].join(", "),
  achievements: resumeKnowledge.competitions.join("; "),
  acts: resumeKnowledge.projects.portals.features.join("; "),
  notFound:
    "I don't have that detail here. Feel free to email me at eloprepotchy@gmail.com for more information.",
};

function answerFromResume(question) {
  return chatbot(question).text;
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
