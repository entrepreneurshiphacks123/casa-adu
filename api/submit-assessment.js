import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { name, email, address, goal, website } = req.body || {};

    // honeypot
    if (website && String(website).trim().length > 0) return res.status(200).json({ ok: true });

    if (!name || !email || !address || !goal) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const safeName = String(name).trim().slice(0, 120);
    const safeEmail = String(email).trim().slice(0, 180);
    const safeAddress = String(address).trim().slice(0, 240);
    const safeGoal = String(goal).trim().slice(0, 80);

    const from = process.env.RESEND_FROM || "CASA <no-reply@casa-adu.com>";
    const subject = `New CASA Site Assessment — ${safeName} (${safeGoal})`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
        <h2 style="margin: 0 0 12px;">New Site Assessment Request</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
          <tr><td style="padding: 8px 0; width: 140px; font-weight: 700;">Name</td><td style="padding: 8px 0;">${escapeHtml(safeName)}</td></tr>
          <tr><td style="padding: 8px 0; width: 140px; font-weight: 700;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(safeEmail)}">${escapeHtml(safeEmail)}</a></td></tr>
          <tr><td style="padding: 8px 0; width: 140px; font-weight: 700;">Address</td><td style="padding: 8px 0;">${escapeHtml(safeAddress)}</td></tr>
          <tr><td style="padding: 8px 0; width: 140px; font-weight: 700;">Goal</td><td style="padding: 8px 0;">${escapeHtml(safeGoal)}</td></tr>
        </table>
      </div>
    `;

    await resend.emails.send({
      from,
      to: ["gqdesignconcepts@gmail.com", "steven@entrepreneurshiphacks.com"],
      reply_to: safeEmail,
      subject,
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err?.message || "Server error" });
  }
}
