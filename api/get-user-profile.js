import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { clerk_user_id } = req.query;
  if (!clerk_user_id) return res.status(400).json({ error: 'Missing clerk_user_id' });

  const result = await pool.query(
    `SELECT * FROM user_profiles WHERE clerk_user_id = $1`,
    [clerk_user_id]
  );

  if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });

  return res.status(200).json(result.rows[0]);
}
