import jsPDF from "jspdf";

const PRIMARY = [220, 38, 38]; // red brand color
const DARK = [15, 23, 42];
const MUTED = [100, 116, 139];
const LIGHT_BG = [248, 250, 252];
const BORDER = [226, 232, 240];

function addHeader(doc, entry) {
  // Background bar
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, 210, 22, "F");

  // Logo text
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("Fire-Works AI", 14, 14);

  // Tag line right
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Meta & Google Ad Creation", 196, 14, { align: "right" });

  // Title block
  doc.setFillColor(...LIGHT_BG);
  doc.rect(0, 22, 210, 24, "F");

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text(entry.title || "Ad Strategy", 14, 33);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  const meta = [
    entry.business_name,
    entry.industry,
    entry.goal ? `Goal: ${entry.goal}` : null,
    entry.budget ? `Budget: ${entry.budget}` : null,
  ].filter(Boolean).join("  ·  ");
  doc.text(meta, 14, 41);

  // Date
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 196, 41, { align: "right" });

  return 54; // y after header
}

function addSectionTitle(doc, text, y) {
  doc.setFillColor(...PRIMARY);
  doc.rect(14, y, 3, 6, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text(text, 20, y + 5);
  return y + 10;
}

function addBodyText(doc, text, y, maxWidth = 180) {
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...DARK);
  const lines = doc.splitTextToSize(String(text || "—"), maxWidth);
  doc.text(lines, 14, y);
  return y + lines.length * 5 + 2;
}

function addBulletList(doc, items, y) {
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...DARK);
  items.forEach((item, i) => {
    if (y > 270) { doc.addPage(); y = 20; }
    const lines = doc.splitTextToSize(`• ${item}`, 175);
    doc.text(lines, 16, y);
    y += lines.length * 5 + 1;
  });
  return y + 3;
}

function addInfoGrid(doc, pairs, y) {
  const colW = 86;
  pairs.forEach(([label, value], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 14 + col * (colW + 10);
    const gy = y + row * 14;
    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(x, gy - 5, colW, 12, 2, 2, "F");
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(label, x + 4, gy + 0.5);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    const val = doc.splitTextToSize(String(value || "—"), colW - 8);
    doc.text(val[0], x + 4, gy + 5.5);
  });
  const rows = Math.ceil(pairs.length / 2);
  return y + rows * 14 + 4;
}

function addDivider(doc, y) {
  doc.setDrawColor(...BORDER);
  doc.line(14, y, 196, y);
  return y + 6;
}

function maybeNewPage(doc, y, needed = 30) {
  if (y + needed > 280) { doc.addPage(); return 20; }
  return y;
}

function buildMetaSection(doc, m, y) {
  y = maybeNewPage(doc, y);
  // Blue platform badge
  doc.setFillColor(219, 234, 254);
  doc.roundedRect(14, y - 4, 40, 8, 2, 2, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(37, 99, 235);
  doc.text("META ADS", 17, y + 1);
  y += 10;

  y = addSectionTitle(doc, "Campaign Objective", y);
  y = addInfoGrid(doc, [
    ["Recommended Objective", m.recommendedObjective],
    ["Optimization Goal", m.recommendedOptimizationGoal],
  ], y);
  y = addBodyText(doc, m.whyThisMakesSense, y);
  y = addDivider(doc, y);

  if (m.hooks?.length) {
    y = maybeNewPage(doc, y);
    y = addSectionTitle(doc, "Hook Ideas", y);
    y = addBulletList(doc, m.hooks, y);
  }
  if (m.headlines?.length) {
    y = maybeNewPage(doc, y);
    y = addSectionTitle(doc, "Headlines", y);
    y = addBulletList(doc, m.headlines, y);
  }
  if (m.primaryTextOptions) {
    y = maybeNewPage(doc, y);
    y = addSectionTitle(doc, "Primary Ad Copy", y);
    if (m.primaryTextOptions.short) { y = addBodyText(doc, `Short: ${m.primaryTextOptions.short}`, y); }
    if (m.primaryTextOptions.medium) { y = addBodyText(doc, `Medium: ${m.primaryTextOptions.medium}`, y); }
  }
  if (m.audienceAngles?.length) {
    y = maybeNewPage(doc, y);
    y = addSectionTitle(doc, "Audience Angles", y);
    y = addBulletList(doc, m.audienceAngles, y);
  }
  if (m.targetingIdeas) {
    y = maybeNewPage(doc, y);
    y = addSectionTitle(doc, "Targeting Ideas", y);
    const all = [
      ...(m.targetingIdeas.interests || []).map(i => `Interest: ${i}`),
      ...(m.targetingIdeas.behaviors || []).map(b => `Behavior: ${b}`),
    ];
    if (all.length) y = addBulletList(doc, all, y);
  }
  if (m.risksWarnings?.length) {
    y = maybeNewPage(doc, y);
    y = addSectionTitle(doc, "Risks & Warnings", y);
    y = addBulletList(doc, m.risksWarnings, y);
  }
  if (m.finalRecommendation) {
    y = maybeNewPage(doc, y);
    y = addSectionTitle(doc, "Final Recommendation", y);
    y = addBodyText(doc, m.finalRecommendation, y);
  }
  return y;
}

function buildGoogleSection(doc, g, y) {
  y = maybeNewPage(doc, y);
  doc.setFillColor(220, 252, 231);
  doc.roundedRect(14, y - 4, 46, 8, 2, 2, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 163, 74);
  doc.text("GOOGLE ADS", 17, y + 1);
  y += 10;

  y = addSectionTitle(doc, "Campaign Type & Goal", y);
  y = addInfoGrid(doc, [
    ["Recommended Campaign Type", g.recommendedCampaignType],
    ["Campaign Goal", g.campaignGoal],
    ["Bidding Strategy", g.biddingStrategy],
  ], y);
  y = addBodyText(doc, g.whyThisMakesSense, y);
  y = addDivider(doc, y);

  if (g.keywordIdeas?.length) {
    y = maybeNewPage(doc, y);
    y = addSectionTitle(doc, "Keyword Ideas", y);
    // Render as tag cloud style rows
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    let x = 14;
    g.keywordIdeas.forEach(kw => {
      const w = doc.getTextWidth(kw) + 8;
      if (x + w > 196) { x = 14; y += 8; }
      doc.setFillColor(...LIGHT_BG);
      doc.roundedRect(x, y - 5, w, 7, 1.5, 1.5, "F");
      doc.text(kw, x + 4, y);
      x += w + 4;
    });
    y += 12;
  }

  if (g.searchHeadlines?.length) {
    y = maybeNewPage(doc, y);
    y = addSectionTitle(doc, "Search Headlines", y);
    y = addBulletList(doc, g.searchHeadlines, y);
  }
  if (g.descriptions?.length) {
    y = maybeNewPage(doc, y);
    y = addSectionTitle(doc, "Ad Descriptions", y);
    y = addBulletList(doc, g.descriptions, y);
  }
  if (g.extensionsIdeas?.length) {
    y = maybeNewPage(doc, y);
    y = addSectionTitle(doc, "Ad Extensions", y);
    y = addBulletList(doc, g.extensionsIdeas, y);
  }
  if (g.risksWarnings?.length) {
    y = maybeNewPage(doc, y);
    y = addSectionTitle(doc, "Risks & Warnings", y);
    y = addBulletList(doc, g.risksWarnings, y);
  }
  if (g.finalRecommendation) {
    y = maybeNewPage(doc, y);
    y = addSectionTitle(doc, "Final Recommendation", y);
    y = addBodyText(doc, g.finalRecommendation, y);
  }
  return y;
}

export function exportStrategyPdf(entry) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const ai = entry.ai_response_json || {};

  let y = addHeader(doc, entry);

  const metaData = ai.meta || (!ai.google && ai.recommendedObjective ? ai : null);
  const googleData = ai.google || (!ai.meta && ai.recommendedCampaignType ? ai : null);

  if (metaData) {
    y = buildMetaSection(doc, metaData, y);
  }
  if (googleData) {
    if (metaData) { doc.addPage(); y = 20; }
    y = buildGoogleSection(doc, googleData, y);
  }

  // Footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text("Fire-Works AI — fireworks-ai.com", 14, 291);
    doc.text(`Page ${i} of ${pageCount}`, 196, 291, { align: "right" });
  }

  doc.save(`${(entry.title || "strategy").replace(/\s+/g, "-")}-fireworks.pdf`);
}