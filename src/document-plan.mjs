/** Deterministic page plan for the sanitized demonstration, not a complete PDF renderer. */
export function planManual(record, assets = []) {
  const text = value => typeof value === 'string' ? value.trim() : '';
  const pages = [
    { section: 'Cover', text: text(record.projectName) },
    { section: 'Overview', text: text(record.overview) },
    { section: 'Materials', text: text(record.materials) },
    { section: 'Dimensions', text: text(record.dimensions) },
    { section: 'Setup', text: text(record.setup) },
    { section: 'Safety', text: text(record.safety) },
  ];
  const validAssets = assets.filter(asset => asset && typeof asset.id === 'string' && typeof asset.caption === 'string');
  if (validAssets.length) pages.push({ section: 'Reference images', text: '', assets: validAssets.map(asset => ({ id: asset.id, caption: asset.caption })) });
  return pages.filter(page => page.section === 'Cover' || page.text || page.assets);
}
