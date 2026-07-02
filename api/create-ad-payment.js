import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const BASE_PRICES = {
  google_ads: 999,
  meta_ads: 999,
  organic_social: 499,
  google_meta: 1699,
  everything: 1999,
};

const BASE_LABELS = {
  google_ads: 'Google Ads Campaign Setup',
  meta_ads: 'Meta Ads Campaign Setup',
  organic_social: 'Organic Social Content',
  google_meta: 'Google + Meta Ad Campaigns',
  everything: 'Google + Meta + Organic Social + Keywords',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { generationId, email, content_type, add_on_keywords, add_on_social } = req.body;

  try {
    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: BASE_LABELS[content_type] || 'Ad Content Generation',
            description: 'AI-generated ad content — delivered instantly.',
          },
          unit_amount: BASE_PRICES[content_type] || 999,
        },
        quantity: 1,
      },
    ];

    if (add_on_keywords) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Keyword Research Add-on',
            description: 'Primary, long-tail, negative keywords + competitor terms',
          },
          unit_amount: 499,
        },
        quantity: 1,
      });
    }

    if (add_on_social) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Organic Social Content Add-on',
            description: '5 captions, hashtags, story ideas, reel concepts',
          },
          unit_amount: 499,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.APP_URL}/results?generationId=${generationId}&success=true`,
      cancel_url: `${process.env.APP_URL}/get-started?cancelled=true`,
      metadata: { generationId, content_type, add_on_keywords: String(add_on_keywords), add_on_social: String(add_on_social) },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('create-ad-payment error:', err);
    return res.status(500).json({ error: err.message });
  }
}
