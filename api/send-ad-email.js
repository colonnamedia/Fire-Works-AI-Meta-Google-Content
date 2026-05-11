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
  .header p { margin: 0; opacity: 0.7; font-size: 14px;
