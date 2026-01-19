export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS (safe default)
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    // Handle preflight
    if (request.method === "OPTIONS") {
      return new Response("", { status: 200, headers: corsHeaders });
    }

    const body = await request.json().catch(() => ({}));
    const { name, email, address, goal, website } = body || {};

    // Honeypot: bots fill this; humans won't
    if (website && String(website).trim().length > 0) {
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
    }

    if (!name || !email || !address || !goal) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), { status: 400, headers: corsHeaders });
    }

    const safeName = String(name).trim().slice(0, 120);
    const safeEmail = String(email).trim().slice(0, 180);
    const safeAddress = String(address).trim().slice(0, 240);
    const safeGoal = String(goal).trim().slice(0, 80);

    const from = env.RESEND_FROM || "CASA <no-reply@casa-adu.com>";
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
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
        <p style="margin: 0; color: #666; font-size: 12px;">Submitted from casa-adu.com site assessment form.</p>
      </div>
    `;

    // Call Resend (no npm package needed)
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: ["gqdesignconcepts@gmail.com", "steven@entrepreneurshiphacks.com"],
        reply_to: safeEmail,
        subject,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text().catch(() => "");
      return new Response(JSON.stringify({ error: `Resend error: ${errText || resendRes.status}` }), {
        status: 502,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: err?.message || "Server error" }), { status: 500, headers: corsHeaders });
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
