import Stripe from 'stripe';
import pkg from 'pg';
const { Pool } = pkg;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { generationId } = session.metadata;
    const email = session.customer_email;

    // Update payment status
    await pool.query(
      `UPDATE ad_generations SET payment_status = 'paid', stripe_session_id = $1 WHERE id = $2`,
      [session.id, generationId]
    );

    // Fetch generation data
    const result = await pool.query(
      `SELECT * FROM ad_generations WHERE id = $1`,
      [generationId]
    );
    const generation = result.rows[0];

    // Send email
    await fetch(`${process.env.APP_URL}/api/send-ad-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ generation, email })
    });
  }

  return res.status(200).json({ received: true });
}
