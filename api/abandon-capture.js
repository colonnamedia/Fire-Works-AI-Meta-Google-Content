import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { email, full_name, business_name, website_url } = req.body;

    // Save abandoned lead
    await pool.query(`
      INSERT INTO ad_generations (email, full_name, business_name, website_url, payment_status, abandoned)
      VALUES ($1, $2, $3, $4, 'unpaid', true)
      ON CONFLICT DO NOTHING
    `, [email, full_name, business_name, website_url]);

    // Send abandon email
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Fire-Works AI <onboarding@resend.dev>',
        to: 'colonnamedia@gmail.com',
        subject: `Abandoned Lead — ${business_name || email}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;">
            <h2 style="color:#E53E3E;">Abandoned Lead</h2>
            <p>Someone started the form but didn't complete it.</p>
            <table style="width:100%;font-size:14px;">
              <tr><td style="color:#9ca3af;padding:6px 0;width:140px;">Name</td><td>${full_name || 'Not provided'}</td></tr>
              <tr><td style="color:#9ca3af;padding:6px 0;">Email</td><td>${email}</td></tr>
              <tr><td style="color:#9ca3af;padding:6px 0;">Business</td><td>${business_name || 'Not provided'}</td></tr>
              <tr><td style="color:#9ca3af;padding:6px 0;">Website</td><td>${website_url || 'Not provided'}</td></tr>
            </table>
            <p style="margin-top:24px;"><a href="mailto:${email}" style="background:#E53E3E;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">Follow Up With Them</a></p>
          </div>
        `
      })
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('abandon-capture error:', err);
    return res.status(500).json({ error: err.message });
  }
}
