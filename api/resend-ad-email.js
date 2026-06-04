import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { generation_id, email } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM ad_generations WHERE id = $1`,
      [generation_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Generation not found' });
    }

    const generation = result.rows[0];

    await fetch(`${process.env.APP_URL}/api/send-ad-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ generation, email: email || generation.email })
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('resend-ad-email error:', err);
    return res.status(500).json({ error: err.message });
  }
}
