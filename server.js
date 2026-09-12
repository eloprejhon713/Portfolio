const path = require("path");
const express = require("express");
const { Resend } = require("resend");
require("dotenv").config();

const { answerFromResume, PORTFOLIO_SYSTEM } = require("./resumeAnswers");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Allow GitHub Pages (and local) to call the API on Render
const ALLOWED_ORIGINS = new Set([
  "https://eloprejhon713.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://portfolio-1-f9t6.onrender.com",
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Parse JSON and URL-encoded data
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true })); // extended: true is safer for nested objects
app.use(express.static(path.join(__dirname)));

// Utility: trim strings
function toSafeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

// Utility: escape HTML
function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Validate input
function validateInput(body) {
  const firstName = toSafeString(body.firstName);
  const lastName = toSafeString(body.lastName);
  const email = toSafeString(body.email);
  const phone = toSafeString(body.phone).replace(/\D/g, "");
  const service = toSafeString(body.service) || "Not specified";
  const message = toSafeString(body.message);

  if (!firstName || !lastName || !email || !phone || !message) {
    return { error: "Please complete all required fields." };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { error: "Please provide a valid email address." };
  }

  if (!/^\d{11}$/.test(phone)) {
    return { error: "Please provide a valid 11-digit contact number." };
  }

  if (message.length > 4000) {
    return { error: "Message is too long. Please keep it under 4000 characters." };
  }

  return { data: { firstName, lastName, email, phone, service, message } };
}

// Check if Resend email config exists (HTTPS API — works on Render; Gmail SMTP times out there)
function checkEmailConfig() {
  const requiredEnv = ["RESEND_API_KEY", "CONTACT_TO"];
  const missing = requiredEnv.filter((key) => !process.env[key]);
  return { ok: missing.length === 0 && !!resend, missing };
}

function getFromAddress() {
  const fromName = process.env.CONTACT_FROM_NAME || "Portfolio Contact Form";
  // Use a verified domain address in production, e.g. "Jhon <hello@yourdomain.com>"
  // Until then, Resend's onboarding address works for testing (to your Resend account email).
  const fromEmail = process.env.CONTACT_FROM || "onboarding@resend.dev";
  if (fromEmail.includes("<")) return fromEmail;
  return `${fromName} <${fromEmail}>`;
}

// Contact form route
app.post("/api/contact", async (req, res) => {
  const validated = validateInput(req.body || {});
  if (validated.error) return res.status(400).json({ message: validated.error });

  const config = checkEmailConfig();
  if (!config.ok) {
    console.error("Missing email configuration:", config.missing.join(", "));
    return res.status(500).json({
      message: "Server email is not configured yet. Please contact the site owner.",
    });
  }

  const { firstName, lastName, email, phone, service, message } = validated.data;
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = `${(firstName[0] || "").toUpperCase()}${(lastName[0] || "").toUpperCase()}` || "?";
  const replyName = (firstName || fullName.split(/\s+/)[0] || "guest").toLowerCase();
  const serviceSlug = String(service || "inquiry")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "inquiry";
  const safeMessageHtml = escapeHtml(message).replace(/\n/g, "<br>");
  const replySubject = encodeURIComponent("Re: Your inquiry on elopre.dev");
  const year = new Date().getFullYear();
  const logoUrl = "https://eloprejhon713.github.io/Portfolio/assets/images/logonobg.png";

  const mailOptions = {
  from: getFromAddress(),
  to: process.env.CONTACT_TO,
  replyTo: email,
  subject: `New Inquiry from ${fullName} — ${service}`,
  text: `New Client Inquiry\n\nName: ${fullName}\nEmail: ${email}\nContact Number: ${phone}\nService: ${service}\n\nMessage:\n${message}\n\n---\nSent via elopre.dev contact form`,
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New inquiry — elopre.dev</title>
</head>
<body style="margin:0;padding:0;background-color:#eef1f8;font-family:Segoe UI,Arial,Helvetica,sans-serif;color:#0f172a;-webkit-font-smoothing:antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#eef1f8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(13,27,62,0.10);">

          <!-- Title bar -->
          <tr>
            <td style="padding:14px 18px;background:#f1f5f9;border-bottom:1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="width:56px;vertical-align:middle;">
                    <span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#ef4444;margin-right:6px;"></span>
                    <span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#f59e0b;margin-right:6px;"></span>
                    <span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#22c55e;"></span>
                  </td>
                  <td align="center" style="font-family:Consolas,'Courier New',monospace;font-size:12.5px;color:#64748b;vertical-align:middle;">
                    inbox/<span style="color:#0f172a;font-weight:600;">new-inquiry.log</span>
                  </td>
                  <td align="right" style="width:70px;vertical-align:middle;">
                    <span style="display:inline-block;font-family:Consolas,'Courier New',monospace;font-size:11px;font-weight:600;color:#2563eb;padding:4px 10px;border-radius:999px;background:#dbeafe;">
                      ● new
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px 26px;">

              <!-- Prompt + logo -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
                <tr>
                  <td style="vertical-align:middle;padding-right:12px;">
                    <p style="margin:0 0 6px;font-family:Consolas,'Courier New',monospace;font-size:13px;line-height:1.6;color:#64748b;">
                      <span style="color:#2563eb;">guest@elopre.dev</span>
                      <span style="color:#64748b;"> ~/inbox %</span>
                      <span style="color:#0f172a;"> cat</span>
                      <span style="color:#0d1b3e;font-weight:600;"> new-inquiry.log</span>
                    </p>
                    <p style="margin:0;font-family:Consolas,'Courier New',monospace;font-size:13px;color:#16a34a;">
                      // Someone reached out through your portfolio contact form
                    </p>
                  </td>
                  <td align="right" width="40" style="vertical-align:middle;width:40px;">
                    <img src="${logoUrl}" alt="elopre.dev" width="34" height="34" style="display:block;width:34px;height:34px;object-fit:contain;border:0;outline:none;opacity:0.9;">
                  </td>
                </tr>
              </table>

              <!-- JSON sender block -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid #e2e8f0;border-radius:12px;margin-bottom:16px;">
                <tr>
                  <td style="padding:18px 20px;font-family:Consolas,'Courier New',monospace;font-size:13px;line-height:1.85;color:#0f172a;">

                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #e2e8f0;">
                      <tr>
                        <td style="width:44px;vertical-align:middle;">
                          <div style="width:34px;height:34px;border-radius:9px;background:#dbeafe;color:#0d1b3e;font-family:Segoe UI,Arial,sans-serif;font-weight:700;font-size:13px;line-height:34px;text-align:center;">
                            ${escapeHtml(initials)}
                          </div>
                        </td>
                        <td style="vertical-align:middle;font-family:Segoe UI,Arial,sans-serif;font-weight:700;font-size:14px;color:#0f172a;">
                          ${escapeHtml(fullName)}
                        </td>
                      </tr>
                    </table>

                    <div style="color:#64748b;">{</div>
                    <div style="padding-left:6px;">
                      <span style="color:#2563eb;">"email"</span><span style="color:#64748b;">:</span>
                      <a href="mailto:${escapeHtml(email)}" style="color:#16a34a;text-decoration:none;">"${escapeHtml(email)}"</a><span style="color:#64748b;">,</span>
                    </div>
                    <div style="padding-left:6px;">
                      <span style="color:#2563eb;">"contact"</span><span style="color:#64748b;">:</span>
                      <a href="tel:${escapeHtml(phone)}" style="color:#16a34a;text-decoration:none;">"${escapeHtml(phone)}"</a><span style="color:#64748b;">,</span>
                    </div>
                    <div style="padding-left:6px;">
                      <span style="color:#2563eb;">"interest"</span><span style="color:#64748b;">:</span>
                    </div>
                    <div style="padding-left:18px;padding-top:4px;">
                      <span style="display:inline-block;background:#dbeafe;color:#0d1b3e;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600;">
                        ${escapeHtml(serviceSlug)}
                      </span>
                    </div>
                    <div style="color:#64748b;">}</div>

                  </td>
                </tr>
              </table>

              <!-- message.txt -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:10px 16px;background:#f1f5f9;border-bottom:1px solid #e2e8f0;font-family:Consolas,'Courier New',monospace;font-size:12.5px;color:#64748b;">
                    message.txt
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td width="44" valign="top" style="padding:14px 0;font-family:Consolas,'Courier New',monospace;font-size:13px;color:#cbd5e1;text-align:center;">
                          1
                        </td>
                        <td valign="top" style="padding:14px 16px 14px 0;font-family:Consolas,'Courier New',monospace;font-size:13.5px;color:#0f172a;word-break:break-word;">
                          ${safeMessageHtml}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Reply -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center">
                    <a href="mailto:${escapeHtml(email)}?subject=${replySubject}" style="display:block;background:#2563eb;color:#ffffff;text-decoration:none;font-family:Consolas,'Courier New',monospace;font-weight:600;font-size:14px;padding:14px 24px;border-radius:10px;text-align:center;box-shadow:0 4px 14px rgba(37,99,235,0.3);">
                      $ reply --to ${escapeHtml(replyName)}
                    </a>
                    <p style="margin:10px 0 0;font-size:12.5px;color:#64748b;">
                      Opens your default email app
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:12px 20px;background:#f1f5f9;border-top:1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="font-family:Consolas,'Courier New',monospace;font-size:11.5px;color:#64748b;">
                    <a href="https://elopre.dev" style="color:#2563eb;text-decoration:none;">elopre.dev</a> contact form
                  </td>
                  <td align="right" style="font-family:Consolas,'Courier New',monospace;font-size:11.5px;color:#64748b;">
                    UTF-8
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <p style="margin:22px 0 0;font-size:11.5px;color:#64748b;text-align:center;">
          © ${year} Jhon Elopre. All rights reserved.
        </p>
      </td>
    </tr>
  </table>

</body>
</html>
  `,
};

  try {
    const { data, error } = await resend.emails.send(mailOptions);
    if (error) {
      console.error("Failed to send contact email:", error);
      return res.status(500).json({
        message: "Unable to send message right now. Please try again later.",
      });
    }
    console.log("Contact email sent:", data?.id || "ok");
    return res.status(200).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return res.status(500).json({
      message: "Unable to send message right now. Please try again later.",
    });
  }
});

// Chatbot — resume answers (optional Anthropic if ANTHROPIC_API_KEY is set)
app.post("/api/chat", async (req, res) => {
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const lastUser = [...messages].reverse().find((m) => m && m.role === "user" && typeof m.content === "string");
    const question = lastUser ? lastUser.content.trim() : toSafeString(req.body?.message);

    if (!question) {
      return res.status(400).json({ reply: "Please ask a question about Jhon's resume." });
    }
    if (question.length > 2000) {
      return res.status(400).json({ reply: "Please keep your question under 2000 characters." });
    }

    // Intent-scored resume chatbot (greetings / thanks / topic answers)
    const localReply = answerFromResume(question);
    const probe = String(question).toLowerCase().trim();
    const isSocial =
      /^(hi|hello|hey|yo|good\s*(morning|afternoon|evening))\b[!.,?\s]*$/i.test(probe)
      || /^(hi|hello|hey)\s+(there|jhon|everyone)?[!.,?\s]*$/i.test(probe)
      || /^(thanks+|thank\s*you+|thankyou+|ty|thx|salamat)\b[!.,?\s]*$/i.test(probe)
      || /^(thanks+|thank\s*you+|thankyou+)\s+(so\s+much|a\s+lot|po)?[!.,?\s]*$/i.test(probe);

    if (isSocial) {
      return res.json({ reply: localReply, source: "greeting" });
    }

    // Prefer local resume chatbot; optional Anthropic only if key is set and local fell back
    const looksLikeFallback = /I can only assist with questions related to my professional experience/i.test(localReply);
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey && looksLikeFallback) {
      const safeHistory = messages
        .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: PORTFOLIO_SYSTEM,
          messages: safeHistory.length ? safeHistory : [{ role: "user", content: question }],
        }),
      });

      const data = await response.json();
      if (response.ok && Array.isArray(data.content)) {
        const reply = data.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
        if (reply) return res.json({ reply, source: "anthropic" });
      }
      console.error("Anthropic chat error:", data?.error || data);
    }

    return res.json({ reply: localReply, source: "resume" });
  } catch (error) {
    console.error("Chat route failed:", error);
    const fallbackQ = toSafeString(req.body?.message) ||
      (Array.isArray(req.body?.messages)
        ? [...req.body.messages].reverse().find((m) => m?.role === "user")?.content
        : "");
    return res.json({
      reply: answerFromResume(fallbackQ || "about"),
      source: "resume-fallback",
    });
  }
});

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Portfolio server running on port ${PORT}`);
});