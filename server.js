const path = require("path");
const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const { answerFromResume, PORTFOLIO_SYSTEM } = require("./resumeAnswers");

const app = express();
const PORT = Number(process.env.PORT || 3000);

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
  const service = toSafeString(body.service) || "Not specified";
  const message = toSafeString(body.message);

  if (!firstName || !lastName || !email || !message) {
    return { error: "Please complete all required fields." };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { error: "Please provide a valid email address." };
  }

  if (message.length > 4000) {
    return { error: "Message is too long. Please keep it under 4000 characters." };
  }

  return { data: { firstName, lastName, email, service, message } };
}

// Check if email config exists
function checkEmailConfig() {
  const requiredEnv = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "CONTACT_TO"];
  const missing = requiredEnv.filter((key) => !process.env[key]);
  return { ok: missing.length === 0, missing };
}

// Create Nodemailer transporter
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
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

  const { firstName, lastName, email, service, message } = validated.data;
  const fullName = `${firstName} ${lastName}`.trim();
  const safeMessageHtml = escapeHtml(message).replace(/\n/g, "<br>");
  const fromName = process.env.CONTACT_FROM_NAME || "Portfolio Contact Form";

 const mailOptions = {
  from: `"${fromName}" <${process.env.SMTP_USER}>`,
  to: process.env.CONTACT_TO,
  replyTo: email,
  subject: `New Inquiry from ${fullName} — ${service}`,
  text: `New Client Inquiry\n\nName: ${fullName}\nEmail: ${email}\nService: ${service}\n\nMessage:\n${message}\n\n---\nSent via elopre.dev contact form`,
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Client Inquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background-color:#0d1b3e;padding:36px 40px 32px;text-align:center;">
              <!-- Logo wordmark -->
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;margin-bottom:6px;">
                elopre<span style="color:#3b82f6;">.dev</span>
              </div>
              <div style="width:40px;height:1px;background-color:#1e3a8a;margin:0 auto 20px;"></div>
              <!-- Badge -->
              <div style="display:inline-block;background-color:#1e3a8a;border:1px solid #2563eb;padding:5px 16px;margin-bottom:20px;">
                <span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#93c5fd;">New Inquiry</span>
              </div>
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">
                You've got a new<br><span style="color:transparent;-webkit-text-stroke:1px #3b82f6;">message.</span>
              </h1>
            </td>
          </tr>

          <!-- ── ACCENT BAR ── -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#1e3a8a 0%,#3b82f6 50%,#1e3a8a 100%);"></td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="background-color:#ffffff;padding:40px;">

              <!-- Intro -->
              <p style="margin:0 0 28px;font-size:15px;color:#64748b;line-height:1.7;">
                A visitor submitted the contact form on your portfolio. Here are the details:
              </p>

              <!-- Detail rows -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-collapse:collapse;margin-bottom:32px;">

                <tr>
                  <td style="padding:14px 18px;background-color:#f8fafc;border-bottom:1px solid #e2e8f0;width:130px;">
                    <span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#94a3b8;font-weight:700;">Full Name</span>
                  </td>
                  <td style="padding:14px 18px;background-color:#ffffff;border-bottom:1px solid #e2e8f0;">
                    <span style="font-size:15px;color:#0f172a;font-weight:600;">${escapeHtml(fullName)}</span>
                  </td>
                </tr>

                <tr>
                  <td style="padding:14px 18px;background-color:#f8fafc;border-bottom:1px solid #e2e8f0;">
                    <span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#94a3b8;font-weight:700;">Email</span>
                  </td>
                  <td style="padding:14px 18px;background-color:#ffffff;border-bottom:1px solid #e2e8f0;">
                    <a href="mailto:${escapeHtml(email)}" style="font-size:15px;color:#2563eb;text-decoration:none;font-weight:500;">${escapeHtml(email)}</a>
                  </td>
                </tr>

                <tr>
                  <td style="padding:14px 18px;background-color:#f8fafc;">
                    <span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#94a3b8;font-weight:700;">Service</span>
                  </td>
                  <td style="padding:14px 18px;background-color:#ffffff;">
                    <span style="display:inline-block;background-color:#dbeafe;color:#1e3a8a;font-family:'Courier New',monospace;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:4px 12px;font-weight:700;">${escapeHtml(service)}</span>
                  </td>
                </tr>

              </table>

              <!-- Message block -->
              <div style="margin-bottom:32px;">
                <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#94a3b8;font-weight:700;margin-bottom:12px;">Message</div>
                <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-left:3px solid #2563eb;padding:20px 22px;">
                  <p style="margin:0;font-size:15px;color:#334155;line-height:1.8;">${safeMessageHtml}</p>
                </div>
              </div>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="mailto:${escapeHtml(email)}" style="display:inline-block;background-color:#1e3a8a;color:#ffffff;font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 32px;font-weight:700;transition:background .3s;">
                      Reply to ${escapeHtml(fullName)} →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background-color:#0d1b3e;padding:24px 40px;text-align:center;border-top:1px solid #1a2d5a;">
              <p style="margin:0 0 6px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:1px;color:#475569;text-transform:uppercase;">
                Sent via the contact form at
                <a href="https://elopre.dev" style="color:#3b82f6;text-decoration:none;">elopre.dev</a>
              </p>
              <p style="margin:0;font-size:11px;color:#334155;">
                © ${new Date().getFullYear()} Jhon Elopre — All rights reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `,
};

  try {
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);
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

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
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

    return res.json({ reply: answerFromResume(question), source: "resume" });
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
app.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
});