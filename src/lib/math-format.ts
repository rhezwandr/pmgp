/**
 * Normalize mathematical formatting for display.
 * Converts plain-text representations to proper Unicode symbols.
 * Applied at render time only — does NOT modify database values.
 */
export function formatMath(text: string): string {
  return text
    .replace(/cm2\b/g, "cm²")
    .replace(/m2\b/g, "m²")
    .replace(/dm2\b/g, "dm²")
    .replace(/km2\b/g, "km²")
    .replace(/cm3\b/g, "cm³")
    .replace(/m3\b/g, "m³")
    .replace(/dm3\b/g, "dm³")
    .replace(/satuan2\b/g, "satuan²")
    .replace(/(\d+)[oO]\b/g, "$1°")
    .replace(/(\d+),\s+(\d+)/g, "$1,$2")
    .trim();
}
