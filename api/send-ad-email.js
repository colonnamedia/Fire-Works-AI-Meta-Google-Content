export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { generation, email } = req.body;
  const { business_name, platform, results } = generation;

  const googleSection = results?.google ? `
  <div class="section">
    <h2 style="color:#1a73e8;">Google Ads Copy</h2>
    
    <h3>Headlines (15)</h3>
    <div class="grid">
      ${results.google.headlines.map((h, i) => `
        <div class="item">
          <span class="num">${i + 1}</span>
          <span>${h}</span>
          <span class="chars">${h.length}/30</span>
        </div>
      `).join('')}
    </div>

    <h3>Descriptions (4)</h3>
    ${results.google.descriptions.map((d, i) => `
      <div class="item">
        <span class="num">${i + 1}</span>
        <span>${d}</span>
        <span class="chars">${d.length}/90</span>
      </div>
    `).join('')}

    <h3>Keywords</h3>
    <div class="keywords">
      ${results.google.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}
    </div>

    <h3>Match Type Recommendation</h3>
    <p class="tip">${results.google.match_type_recommendation}</p>

    <h3>Campaign Tip</h3>
    <p class="tip">${results.google.campaign_tip}</p>
  </div>
  ` : '';

  const metaSection = results?.meta ? `
  <div class="section">
    <h2 style="color:#1877f2;">Meta Ads Copy</h2>

    <h3>Primary Text Options</h3>
    ${results.meta.primary_texts.map((t, i) => `
      <div class="card">
        <p class="label">Option ${i + 1}</p>
        <p>${t}</p>
      </div>
    `).join('')}

    <h3>Headlines</h3>
    ${results.meta.headlines.map((h, i) => `
      <div class="item"><span class="num">${i + 1}</span><span>${h}</span></div>
    `).join('')}

    <h3>Hook Ideas</h3>
    ${results.meta.hooks.map((h, i) => `
      <div class="item"><span class="num">${i + 1}</span><span class="italic">"${h}"</span></div>
    `).join('')}

    <h3>CTA Recommendation</h3>
    <p class="tip">${results.meta.cta_recommendation}</p>

    <h3>Audience Direction</h3>
    <p class="tip">${results.meta.audience_direction}</p>

    <h3>Creative Angles</h3>
    ${results.meta.creative_angles.map((a, i) => `
      <div class="item"><span class="num">${i + 1}</span><span>${a}</span></div>
    `).join('')}

    <div class="warning">
      <strong>Warning:</strong> ${results.meta.warning}
    </div>
  </div>
  ` : '';

  const socialSection = results?.social ? `
  <div class="section">
    <h2 style="color:#e1306c;">Organic Social Posts</h2>

    <h3>Caption Ideas (5)</h3>
    ${results.social.captions.map((c, i) => `
      <div class="card">
        <p class="label">Post ${i + 1}</p>
        <p>${c}</p>
      </div>
    `).join('')}

    <h3>Hashtags</h3>
    <div class="keywords">
      ${results.social.hashtags.map(h => `<span class="keyword">#${h}</span>`).join('')}
    </div>

    <h3>Best Time to Post</h3>
    <p class="tip">${results.social.best_time_to_post}</p>

    <h3>Content Angles</h3>
    ${results.social.content_angles.map((a, i) => `
      <div class="item"><span class="num">${i + 1}</span><span>${a}</span></div>
    `).join('')}
  </div>
  ` : '';

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 32px 20px; color: #1a1a1a; background: #f9fafb; }
  .header { background: #0D1117; padding: 32px; border-radius: 12px; color: white; margin-bottom: 24px; }
  .header h1 { margin: 0 0 6px; font-size: 24px; color: #E53E3E; }
  .header p { margin: 0; opacity: 0.7; font-size: 14px; }
  .section { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 20px; border: 1px solid #e5e7eb; }
  .section h2 { margin: 0 0 16px; font-size: 18px; }
  .section h3 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280; margin: 16px 0 8px; }
  .item { display: flex; align-items: flex-start; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
  .item:last-child { border-bottom: none; }
  .num { width: 22px; height: 22px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; flex-shrink: 0; color: #6b7280; }
  .chars { font-size: 10px; color: #9ca3af; white-space: nowrap; margin-left: auto; }
  .card { background: #f9fafb; border-radius: 8px; padding: 12px; margin-bottom: 8px; font-size: 13px; }
  .card .label { font-size: 11px; text-transform: uppercase; color: #9ca3af; margin: 0 0 6px; }
  .card p { margin: 0; line-height: 1.6; }
  .tip { background: #f0f9ff; border-left: 3px solid #38bdf8; padding: 10px 14px; border-radius: 0 8px 8px 0; font-size: 13px; margin: 0; }
  .keywords { display: flex; flex-wrap: wrap; gap: 6px; }
  .keyword { background: #f3f4f6; border-radius: 4px; padding: 4px 10px; font-size: 12px; color: #374151; }
  .warning { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; font-size: 13px; color: #991b1b; margin-top: 12px; }
  .italic { font-style: italic; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
  .footer { text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px; }
</style>
</head>
<body>

<div class="header">
  <h1>Fire-Works AI Ad Copy</h1>
  <p>${business_name} · ${platform === 'both' ? 'Google + Meta + Social' : platform === 'google' ? 'Google Ads' : 'Meta Ads + Social'} · Generated by Fire-Works Campaign Builder</p>
</div>

${googleSection}
${metaSection}
${socialSection}

<div class="footer">
  <p>Generated by Fire-Works Campaign Builder · A Colonna Media tool</p>
  <p>Questions? colonnamedia@gmail.com</p>
</div>

</body>
</html>`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'Fire-Works AI <onboarding@resend.dev>',
      to: email,
      subject: `Your Ad Copy — ${business_name}`,
      html
    })
  });

  const { Pool } = await import('pg');
  const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await pool.query(
    `UPDATE ad_generations SET email_sent = true WHERE id = $1`,
    [generation.id]
  );

  return res.status(200).json({ success: true });
}
