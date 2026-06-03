import { jsPDF } from 'jspdf';

function generatePDFBase64(generation, results) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = 210;
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = 20;

  const checkPage = (needed = 10) => {
    if (y + needed > 280) {
      doc.addPage();
      y = 20;
    }
  };

  const addHeading = (text, size = 14, color = [220, 50, 50]) => {
    checkPage(12);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, y);
    y += size * 0.5 + 4;
  };

  const addSubheading = (text) => {
    checkPage(8);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'bold');
    doc.text(text.toUpperCase(), margin, y);
    y += 6;
  };

  const addText = (text, indent = 0) => {
    checkPage(6);
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, contentW - indent);
    lines.forEach(line => {
      checkPage(5);
      doc.text(line, margin + indent, y);
      y += 5;
    });
  };

  const addItem = (num, text, badge) => {
    checkPage(6);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'bold');
    doc.text(`${num}.`, margin, y);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, contentW - 15);
    doc.text(lines[0], margin + 8, y);
    if (badge) {
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text(`[${badge}]`, margin + 8 + doc.getTextWidth(lines[0]) + 3, y);
    }
    y += 5;
    if (lines.length > 1) {
      lines.slice(1).forEach(line => {
        checkPage(5);
        doc.text(line, margin + 8, y);
        y += 5;
      });
    }
  };

  const addDivider = () => {
    checkPage(5);
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y, pageW - margin, y);
    y += 6;
  };

  // Header
  doc.setFillColor(13, 17, 23);
  doc.rect(0, 0, pageW, 40, 'F');
  doc.setFontSize(20);
  doc.setTextColor(229, 62, 62);
  doc.setFont('helvetica', 'bold');
  doc.text('FIRE-WORKS AI', margin, 18);
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.setFont('helvetica', 'normal');
  doc.text('Ad Content Generation Report', margin, 26);
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(`${generation.business_name} • ${new Date().toLocaleDateString()}`, margin, 34);
  y = 50;

  // Business info
  addHeading('Business Overview', 12, [50, 50, 50]);
  addText(`Business: ${generation.business_name}`);
  addText(`Industry: ${generation.industry}`);
  if (generation.offer_type) addText(`Offer: ${generation.offer_type}`);
  if (generation.website_url) addText(`Website: ${generation.website_url}`);
  if (generation.target_audience) addText(`Target Audience: ${generation.target_audience}`);
  if (generation.goal) addText(`Goal: ${generation.goal}`);
  if (generation.budget) addText(`Budget: ${generation.budget}`);
  y += 4;
  addDivider();

  // Google Ads
  if (results?.google) {
    addHeading('Google Ads Campaign Setup', 13, [52, 211, 153]);
    addSubheading('Campaign Setup');
    addText(`Campaign Type: ${results.google.campaign_type}`);
    addText(`Objective: ${results.google.campaign_objective}`);
    addText(`Budget: ${results.google.budget_recommendation}`);
    addText(`Bidding: ${results.google.bidding_strategy}`);
    addText(`Location: ${results.google.location_targeting}`);
    addText(`Exclusions: ${results.google.location_exclusions}`);
    addText(`Audience: ${results.google.audience_targeting}`);
    y += 3;

    addSubheading('Headlines (15) — max 30 chars');
    results.google.headlines.forEach((h, i) => addItem(i + 1, h, `${h.length}/30`));
    y += 3;

    addSubheading('Descriptions (4) — max 90 chars');
    results.google.descriptions.forEach((d, i) => addItem(i + 1, d, `${d.length}/90`));
    y += 3;

    addSubheading('Sitelink Extensions');
    results.google.sitelinks.forEach((s, i) => {
      checkPage(15);
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'bold');
      doc.text(`${i + 1}. ${s.title}`, margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      if (s.suggested_url) {
        const fullUrl = generation.website_url ? generation.website_url + s.suggested_url : s.suggested_url;
        doc.text(`   URL: ${fullUrl}`, margin, y);
        y += 4;
      }
      doc.text(`   ${s.description1}`, margin, y); y += 4;
      doc.text(`   ${s.description2}`, margin, y); y += 6;
    });

    addSubheading('Callout Extensions');
    addText(results.google.callouts.join('  •  '));
    y += 3;

    addSubheading('Keywords with Match Types');
    results.google.keywords.forEach((k, i) => addItem(i + 1, k.keyword, `${k.match_type} | ${k.intent}`));
    y += 3;

    addSubheading('Negative Keywords');
    addText(results.google.negative_keywords.join(', '));
    y += 3;

    addSubheading('Campaign Tip');
    addText(results.google.campaign_tip);
    y += 4;
    addDivider();
  }

  // Meta Ads
  if (results?.meta) {
    addHeading('Meta Ads Campaign Setup', 13, [96, 165, 250]);
    addSubheading('Campaign Setup');
    addText(`Objective: ${results.meta.campaign_objective}`);
    addText(`Budget: ${results.meta.budget_recommendation}`);
    addText(`Ad Set Structure: ${results.meta.ad_set_structure}`);
    addText(`Placements: ${results.meta.placement_recommendation}`);
    addText(`Geographic: ${results.meta.geographic_targeting}`);
    addText(`Creative: ${results.meta.creative_direction}`);
    addText(`Format: ${results.meta.creative_format}`);
    y += 3;

    addSubheading('Audience Targeting');
    addText(`Age: ${results.meta.audience?.age_range}`);
    addText(`Gender: ${results.meta.audience?.gender}`);
    addText(`Interests: ${results.meta.audience?.interests?.join(', ')}`);
    addText(`Behaviors: ${results.meta.audience?.behaviors?.join(', ')}`);
    addText(`Exclusions: ${results.meta.audience?.exclusions}`);
    y += 3;

    addSubheading('Primary Text Options');
    results.meta.primary_texts.forEach((t, i) => { addItem(i + 1, t); y += 2; });

    addSubheading('Headlines');
    results.meta.headlines.forEach((h, i) => addItem(i + 1, h));

    addSubheading('Hook Ideas');
    results.meta.hooks.forEach((h, i) => addItem(i + 1, `"${h}"`));

    addSubheading('CTA');
    addText(results.meta.cta_recommendation);

    addSubheading('Creative Angles');
    results.meta.creative_angles.forEach((a, i) => addItem(i + 1, a));

    addSubheading('Retargeting Strategy');
    addText(results.meta.retargeting_recommendation);

    addSubheading('Warning');
    addText(results.meta.warning);
    y += 4;
    addDivider();
  }

  // Social
  if (results?.social) {
    addHeading('Organic Social Content', 13, [244, 114, 182]);
    addSubheading('Content Strategy');
    addText(results.social.content_strategy);
    y += 3;

    addSubheading('Caption Ideas');
    results.social.captions.forEach((c, i) => { addItem(i + 1, c); y += 2; });

    addSubheading('Hashtags');
    addText(results.social.hashtags.map(h => `#${h}`).join('  '));

    addSubheading('Best Time to Post');
    addText(results.social.best_time_to_post);

    addSubheading('Content Angles');
    results.social.content_angles.forEach((a, i) => addItem(i + 1, a));

    addSubheading('Story Ideas');
    results.social.story_ideas.forEach((s, i) => addItem(i + 1, s));

    addSubheading('Reel / Video Concepts');
    results.social.reel_concepts.forEach((r, i) => addItem(i + 1, r));
    y += 4;
    addDivider();
  }

  // Keywords
  if (results?.keywords) {
    addHeading('Keyword Research Report', 13, [251, 191, 36]);

    addSubheading('Primary Keywords');
    results.keywords.primary_keywords.forEach((k, i) =>
      addItem(i + 1, k.keyword, `${k.match_type} | ${k.estimated_competition}`)
    );

    addSubheading('Long-Tail Keywords');
    results.keywords.long_tail_keywords.forEach((k, i) =>
      addItem(i + 1, k.keyword, k.intent)
    );

    addSubheading('Negative Keywords');
    addText(results.keywords.negative_keywords.join(', '));

    addSubheading('Competitor Terms');
    addText(results.keywords.competitor_terms.join(', '));

    addSubheading('SEO Opportunities');
    results.keywords.seo_opportunities.forEach((s, i) => addItem(i + 1, s));

    addSubheading('Keyword Strategy');
    addText(results.keywords.keyword_strategy);
  }

  // Footer
  doc.setFillColor(13, 17, 23);
  doc.rect(0, 285, pageW, 12, 'F');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Generated by Fire-Works AI — A Fire-Works Eco by Colonna Media Tool — fireworks-campaignbuilder.com', margin, 291);

  return doc.output('datauristring').split(',')[1];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { generation, email } = req.body;
  const { business_name, content_type, website_url } = generation;
  const results = typeof generation.results === 'string'
    ? JSON.parse(generation.results)
    : generation.results;

  const contentLabel = {
    google_ads: 'Google Ads Campaign',
    meta_ads: 'Meta Ads Campaign',
    organic_social: 'Organic Social Content',
    keyword_research: 'Keyword Research',
    google_meta: 'Google + Meta Campaigns',
    everything: 'Google + Meta + Social + Keywords',
  }[content_type] || content_type;

  // Generate PDF
  let pdfBase64 = null;
  try {
    pdfBase64 = generatePDFBase64(generation, results);
  } catch (pdfErr) {
    console.error('PDF generation error:', pdfErr);
  }

  const googleSection = results?.google ? `
    <div style="background:#fff;border-radius:12px;padding:24px;margin-bottom:20px;border:1px solid #e5e7eb;">
      <h2 style="color:#34d399;margin:0 0 16px;font-size:18px;">Google Ads Campaign Setup</h2>
      <table style="width:100%;font-size:13px;margin-bottom:16px;">
        <tr><td style="color:#9ca3af;padding:4px 0;width:140px;">Campaign Type</td><td>${results.google.campaign_type}</td></tr>
        <tr><td style="color:#9ca3af;padding:4px 0;">Objective</td><td>${results.google.campaign_objective}</td></tr>
        <tr><td style="color:#9ca3af;padding:4px 0;">Budget</td><td>${results.google.budget_recommendation}</td></tr>
        <tr><td style="color:#9ca3af;padding:4px 0;">Bidding</td><td>${results.google.bidding_strategy}</td></tr>
        <tr><td style="color:#9ca3af;padding:4px 0;">Location</td><td>${results.google.location_targeting}</td></tr>
        <tr><td style="color:#9ca3af;padding:4px 0;">Exclusions</td><td>${results.google.location_exclusions}</td></tr>
        <tr><td style="color:#9ca3af;padding:4px 0;">Audience</td><td>${results.google.audience_targeting}</td></tr>
      </table>
      <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#9ca3af;margin:16px 0 8px;">Headlines (max 30 chars each)</h3>
      ${results.google.headlines.map((h, i) => `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f3f4f6;font-size:13px;"><span><strong style="color:#9ca3af;margin-right:8px;">${i + 1}.</strong>${h}</span><span style="color:#9ca3af;font-size:11px;">${h.length}/30</span></div>`).join('')}
      <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#9ca3af;margin:16px 0 8px;">Descriptions (max 90 chars each)</h3>
      ${results.google.descriptions.map((d, i) => `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f3f4f6;font-size:13px;"><span><strong style="color:#9ca3af;margin-right:8px;">${i + 1}.</strong>${d}</span><span style="color:#9ca3af;font-size:11px;">${d.length}/90</span></div>`).join('')}
      <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#9ca3af;margin:16px 0 8px;">Sitelink Extensions</h3>
      ${results.google.sitelinks.map((s, i) => `
        <div style="background:#f9fafb;border-radius:8px;padding:12px;margin-bottom:8px;">
          <strong style="font-size:13px;display:block;margin-bottom:4px;">${s.title}</strong>
          ${s.suggested_url ? `<div style="font-size:11px;color:#6b7280;margin-bottom:4px;">${website_url ? website_url + s.suggested_url : s.suggested_url}</div>` : ''}
          <div style="font-size:12px;color:#6b7280;">${s.description1}</div>
          <div style="font-size:12px;color:#6b7280;">${s.description2}</div>
        </div>
      `).join('')}
      <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#9ca3af;margin:16px 0 8px;">Callout Extensions</h3>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">${results.google.callouts.map(c => `<span style="background:#f3f4f6;border-radius:6px;padding:4px 10px;font-size:12px;">${c}</span>`).join('')}</div>
      <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#9ca3af;margin:16px 0 8px;">Keywords with Match Types</h3>
      ${results.google.keywords.map((k, i) => `<div style="padding:6px 0;border-bottom:1px solid #f3f4f6;font-size:13px;display:flex;justify-content:space-between;"><span><strong style="color:#9ca3af;margin-right:8px;">${i + 1}.</strong>${k.keyword}</span><span style="font-size:11px;color:#9ca3af;">${k.match_type}</span></div>`).join('')}
      <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#9ca3af;margin:16px 0 8px;">Negative Keywords</h3>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">${results.google.negative_keywords.map(k => `<span style="background:#fef2f2;border:1px solid #fecaca;border-radius:20px;padding:3px 10px;font-size:12px;color:#991b1b;">−${k}</span>`).join('')}</div>
      <div style="background:#eff6ff;border-left:3px solid #3b82f6;padding:12px;border-radius:0 8px 8px 0;margin-top:16px;font-size:13px;color:#1e40af;">${results.google.campaign_tip}</div>
    </div>` : '';

  const metaSection = results?.meta ? `
    <div style="background:#fff;border-radius:12px;padding:24px;margin-bottom:20px;border:1px solid #e5e7eb;">
      <h2 style="color:#60a5fa;margin:0 0 16px;font-size:18px;">Meta Ads Campaign Setup</h2>
      <table style="width:100%;font-size:13px;margin-bottom:16px;">
        <tr><td style="color:#9ca3af;padding:4px 0;width:140px;">Objective</td><td>${results.meta.campaign_objective}</td></tr>
        <tr><td style="color:#9ca3af;padding:4px 0;">Budget</td><td>${results.meta.budget_recommendation}</td></tr>
        <tr><td style="color:#9ca3af;padding:4px 0;">Ad Set Structure</td><td>${results.meta.ad_set_structure}</td></tr>
        <tr><td style="color:#9ca3af;padding:4px 0;">Placements</td><td>${results.meta.placement_recommendation}</td></tr>
        <tr><td style="color:#9ca3af;padding:4px 0;">Geographic</td><td>${results.meta.geographic_targeting}</td></tr>
        <tr><td style="color:#9ca3af;padding:4px 0;">Creative</td><td>${results.meta.creative_direction}</td></tr>
        <tr><td style="color:#9ca3af;padding:4px 0;">Format</td><td>${results.meta.creative_format}</td></tr>
      </table>
      <h3 style="font-size:11px;text-transform:uppercase;color:#9ca3af;margin:16px 0 8px;">Audience</h3>
      <div style="background:#f9fafb;border-radius:8px;padding:12px;font-size:13px;">
        <div style="margin-bottom:6px;"><span style="color:#9ca3af;">Age:</span> ${results.meta.audience?.age_range}</div>
        <div style="margin-bottom:6px;"><span style="color:#9ca3af;">Gender:</span> ${results.meta.audience?.gender}</div>
        <div style="margin-bottom:6px;"><span style="color:#9ca3af;">Interests:</span> ${results.meta.audience?.interests?.join(', ')}</div>
        <div style="margin-bottom:6px;"><span style="color:#9ca3af;">Behaviors:</span> ${results.meta.audience?.behaviors?.join(', ')}</div>
        <div><span style="color:#9ca3af;">Exclusions:</span> ${results.meta.audience?.exclusions}</div>
      </div>
      <h3 style="font-size:11px;text-transform:uppercase;color:#9ca3af;margin:16px 0 8px;">Primary Text Options</h3>
      ${results.meta.primary_texts.map((t, i) => `<div style="background:#f9fafb;border-radius:8px;padding:12px;margin-bottom:8px;font-size:13px;"><div style="color:#9ca3af;font-size:11px;margin-bottom:4px;">Option ${i + 1}</div>${t}</div>`).join('')}
      <h3 style="font-size:11px;text-transform:uppercase;color:#9ca3af;margin:16px 0 8px;">Headlines</h3>
      ${results.meta.headlines.map((h, i) => `<div style="padding:6px 0;border-bottom:1px solid #f3f4f6;font-size:13px;"><strong style="color:#9ca3af;margin-right:8px;">${i + 1}.</strong>${h}</div>`).join('')}
      <h3 style="font-size:11px;text-transform:uppercase;color:#9ca3af;margin:16px 0 8px;">Hook Ideas</h3>
      ${results.meta.hooks.map((h, i) => `<div style="padding:6px 0;border-bottom:1px solid #f3f4f6;font-size:13px;font-style:italic;"><strong style="color:#9ca3af;margin-right:8px;">${i + 1}.</strong>"${h}"</div>`).join('')}
      <h3 style="font-size:11px;text-transform:uppercase;color:#9ca3af;margin:16px 0 8px;">CTA</h3>
      <div style="background:#eff6ff;border-left:3px solid #3b82f6;padding:12px;border-radius:0 8px 8px 0;font-size:13px;color:#1e40af;">${results.meta.cta_recommendation}</div>
      <h3 style="font-size:11px;text-transform:uppercase;color:#9ca3af;margin:16px 0 8px;">Retargeting Strategy</h3>
      <div style="background:#eff6ff;border-left:3px solid #3b82f6;padding:12px;border-radius:0 8px 8px 0;font-size:13px;color:#1e40af;">${results.meta.retargeting_recommendation}</div>
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px;margin-top:12px;font-size:13px;color:#991b1b;"><strong>Warning:</strong> ${results.meta.warning}</div>
    </div>` : '';

  const socialSection = results?.social ? `
    <div style="background:#fff;border-radius:12px;padding:24px;margin-bottom:20px;border:1px solid #e5e7eb;">
      <h2 style="color:#f472b6;margin:0 0 16px;font-size:18px;">Organic Social Content</h2>
      <div style="background:#f9fafb;border-radius:8px;padding:12px;margin-bottom:16px;font-size:13px;color:#374151;">${results.social.content_strategy}</div>
      <h3 style="font-size:11px;text-transform:uppercase;color:#9ca3af;margin:16px 0 8px;">Caption Ideas</h3>
      ${results.social.captions.map((c, i) => `<div style="background:#f9fafb;border-radius:8px;padding:12px;margin-bottom:8px;font-size:13px;"><div style="color:#9ca3af;font-size:11px;margin-bottom:4px;">Post ${i + 1}</div>${c}</div>`).join('')}
      <h3 style="font-size:11px;text-transform:uppercase;color:#9ca3af;margin:16px 0 8px;">Hashtags</h3>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">${results.social.hashtags.map(h => `<span style="background:#f3f4f6;border-radius:20px;padding:3px 10px;font-size:12px;">#${h}</span>`).join('')}</div>
      <h3 style="font-size:11px;text-transform:uppercase;color:#9ca3af;margin:16px 0 8px;">Best Time to Post</h3>
      <div style="background:#eff6ff;border-left:3px solid #3b82f6;padding:12px;border-radius:0 8px 8px 0;font-size:13px;color:#1e40af;">${results.social.best_time_to_post}</div>
      <h3 style="font-size:11px;text-transform:uppercase;color:#9ca3af;margin:16px 0 8px;">Story Ideas</h3>
      ${results.social.story_ideas.map((s, i) => `<div style="padding:6px 0;border-bottom:1px solid #f3f4f6;font-size:13px;"><strong style="color:#9ca3af;margin-right:8px;">${i + 1}.</strong>${s}</div>`).join('')}
      <h3 style="font-size:11px;text-transform:uppercase;color:#9ca3af;margin:16px 0 8px;">Reel / Video Concepts</h3>
      ${results.social.reel_concepts.map((r, i) => `<div style="padding:6px 0;border-bottom:1px solid #f3f4f6;font-size:13px;"><strong style="color:#9ca3af;margin-right:8px;">${i + 1}.</strong>${r}</div>`).join('')}
    </div>` : '';

  const keywordsSection = results?.keywords ? `
    <div style="background:#fff;border-radius:12px;padding:24px;margin-bottom:20px;border:1px solid #e5e7eb;">
      <h2 style="color:#fbbf24;margin:0 0 16px;font-size:18px;">Keyword Research Report</h2>
      <h3 style="font-size:11px;text-transform:uppercase;color:#9ca3af;margin:0 0 8px;">Primary Keywords</h3>
      ${results.keywords.primary_keywords.map((k, i) => `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f3f4f6;font-size:13px;"><span><strong style="color:#9ca3af;margin-right:8px;">${i + 1}.</strong>${k.keyword}</span><span style="font-size:11px;color:#9ca3af;">${k.match_type} · ${k.estimated_competition}</span></div>`).join('')}
      <h3 style="font-size:11px;text-transform:uppercase;color:#9ca3af;margin:16px 0 8px;">Long-Tail Keywords</h3>
      ${results.keywords.long_tail_keywords.map((k, i) => `<div style="padding:6px 0;border-bottom:1px solid #f3f4f6;font-size:13px;"><strong style="color:#9ca3af;margin-right:8px;">${i + 1}.</strong>${k.keyword}</div>`).join('')}
      <h3 style="font-size:11px;text-transform:uppercase;color:#9ca3af;margin:16px 0 8px;">Negative Keywords</h3>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">${results.keywords.negative_keywords.map(k => `<span style="background:#fef2f2;border:1px solid #fecaca;border-radius:20px;padding:3px 10px;font-size:12px;color:#991b1b;">−${k}</span>`).join('')}</div>
      <h3 style="font-size:11px;text-transform:uppercase;color:#9ca3af;margin:16px 0 8px;">Competitor Terms</h3>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">${results.keywords.competitor_terms.map(k => `<span style="background:#fff7ed;border:1px solid #fed7aa;border-radius:20px;padding:3px 10px;font-size:12px;color:#92400e;">${k}</span>`).join('')}</div>
      <h3 style="font-size:11px;text-transform:uppercase;color:#9ca3af;margin:16px 0 8px;">Keyword Strategy</h3>
      <div style="background:#eff6ff;border-left:3px solid #3b82f6;padding:12px;border-radius:0 8px 8px 0;font-size:13px;color:#1e40af;">${results.keywords.keyword_strategy}</div>
    </div>` : '';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;margin:0;padding:0;background:#f3f4f6;">

  <!-- Header -->
  <div style="background:#0D1117;padding:40px 32px;">
    <div style="max-width:680px;margin:0 auto;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
        <div style="width:32px;height:32px;background:#E53E3E;border-radius:8px;display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-size:18px;font-weight:900;">⚡</span>
        </div>
        <span style="color:white;font-size:18px;font-weight:900;">Fire-Works AI</span>
      </div>
      <h1 style="color:#E53E3E;font-size:28px;font-weight:900;margin:0 0 8px;">Your Ad Content is Ready! 🚀</h1>
      <p style="color:#9ca3af;font-size:15px;margin:0;">Here's your complete ${contentLabel} for <strong style="color:white;">${business_name}</strong></p>
    </div>
  </div>

  <div style="max-width:680px;margin:0 auto;padding:24px 16px;">

    <!-- Success banner -->
    <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:12px;padding:16px 20px;margin-bottom:20px;display:flex;align-items:center;gap:12px;">
      <span style="font-size:24px;">✅</span>
      <div>
        <p style="margin:0;font-weight:600;color:#065f46;font-size:14px;">Payment confirmed — full report attached as PDF</p>
        <p style="margin:4px 0 0;color:#047857;font-size:13px;">Check the PDF attachment for your complete campaign setup you can print or save.</p>
      </div>
    </div>

    ${googleSection}
    ${metaSection}
    ${socialSection}
    ${keywordsSection}

    <!-- Come back CTA -->
    <div style="background:#0D1117;border-radius:16px;padding:32px;text-align:center;margin:24px 0;">
      <p style="color:#E53E3E;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;">🔥 Ready to dominate more channels?</p>
      <h2 style="color:white;font-size:22px;font-weight:900;margin:0 0 8px;">Generate More Ad Content</h2>
      <p style="color:#6b7280;font-size:14px;margin:0 0 20px;">New campaign? New offer? Seasonal promotion?<br>Come back and generate fresh content in minutes.</p>
      <a href="https://www.fireworks-campaignbuilder.com/get-started" style="display:inline-block;background:#E53E3E;color:white;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;text-decoration:none;">⚡ Generate More Content</a>
      <div style="margin-top:20px;display:flex;justify-content:center;gap:16px;flex-wrap:wrap;">
        <div style="text-align:center;">
          <div style="color:white;font-size:18px;font-weight:900;">$9.99</div>
          <div style="color:#6b7280;font-size:11px;">Google Ads</div>
        </div>
        <div style="text-align:center;">
          <div style="color:white;font-size:18px;font-weight:900;">$9.99</div>
          <div style="color:#6b7280;font-size:11px;">Meta Ads</div>
        </div>
        <div style="text-align:center;">
          <div style="color:white;font-size:18px;font-weight:900;">$4.99</div>
          <div style="color:#6b7280;font-size:11px;">Social Posts</div>
        </div>
        <div style="text-align:center;">
          <div style="color:white;font-size:18px;font-weight:900;">$19.99</div>
          <div style="color:#6b7280;font-size:11px;">Everything</div>
        </div>
      </div>
    </div>

    <!-- Dashboard CTA -->
    <div style="background:#161B22;border:1px solid #374151;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;">
      <p style="color:white;font-size:14px;font-weight:600;margin:0 0 8px;">View all your past generations in one place</p>
      <p style="color:#6b7280;font-size:13px;margin:0 0 16px;">Create a free account to save your business info and access your full history.</p>
      <a href="https://www.fireworks-campaignbuilder.com/dashboard" style="display:inline-block;border:1px solid #E53E3E;color:#E53E3E;font-weight:600;font-size:13px;padding:10px 24px;border-radius:8px;text-decoration:none;">View My Dashboard →</a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:20px 0;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">Generated by Fire-Works AI · A Fire-Works Eco by Colonna Media tool</p>
      <p style="color:#9ca3af;font-size:12px;margin:4px 0 0;">Questions? <a href="mailto:colonnamedia@gmail.com" style="color:#E53E3E;">colonnamedia@gmail.com</a></p>
    </div>
  </div>
</body>
</html>`;

  // Build email payload
  const emailPayload = {
    from: 'Fire-Works AI <onboarding@resend.dev>',
    to: email,
    subject: `🔥 Your ${contentLabel} is Ready — ${business_name}`,
    html,
  };

  // Add PDF attachment if generated
  if (pdfBase64) {
    emailPayload.attachments = [
      {
        filename: `${business_name.replace(/\s+/g, '-')}-FireWorks-Campaign.pdf`,
        content: pdfBase64,
      }
    ];
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify(emailPayload)
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
