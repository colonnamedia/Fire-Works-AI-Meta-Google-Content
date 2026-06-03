import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICES = {
  google_ads: 999,
  meta_ads: 999,
  organic_social: 499,
  google_meta: 1699,
  keyword_research: 499,
  everything: 1999,
};

const LABELS = {
  google_ads: 'Google Ads Campaign Setup',
  meta_ads: 'Meta Ads Campaign Setup',
  organic_social: 'Organic Social Content',
  google_meta: 'Google + Meta Ad Campaigns',
  keyword_research: 'Keyword Research Report',
  everything: 'Google + Meta + Organic Social + Keywords',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { generationId, email, content_type } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: LABELS[content_type] || 'Ad Content Generation',
              description: 'AI-generated ad content — delivered instantly.',
            },
            unit_amount: PRICES[content_type] || 999,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.APP_URL}/results?generationId=${generationId}&success=true`,
      cancel_url: `${process.env.APP_URL}/get-started?cancelled=true`,
      metadata: { generationId, content_type },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('create-ad-payment error:', err);
    return res.status(500).json({ error: err.message });
  }
}
