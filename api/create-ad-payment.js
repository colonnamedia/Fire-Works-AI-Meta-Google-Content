import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICES = {
  google: 499,
  meta: 499,
  both: 899,
};

const LABELS = {
  google: 'Google Ads Copy',
  meta: 'Meta Ads + Organic Social Copy',
  both: 'Google + Meta + Organic Social Copy',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { generationId, email, platform } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: LABELS[platform] || 'Ad Copy Generation',
              description: 'AI-generated ad copy — delivered instantly.',
            },
            unit_amount: PRICES[platform] || 499,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.VITE_APP_URL}/results?generationId=${generationId}&success=true`,
      cancel_url: `${process.env.VITE_APP_URL}/get-started?cancelled=true`,
      metadata: { generationId, platform },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('create-ad-payment error:', err);
    return res.status(500).json({ error: err.message });
  }
}
