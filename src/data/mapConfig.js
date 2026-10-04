/**
 * Map and filter configuration for the home page.
 *
 * Kept apart from content: this is UI vocabulary (which region chips exist, which layers
 * highlight which states), and it ships with the app rather than living in the database.
 */

export const REGIONS = ['All', 'North', 'South', 'East', 'West', 'Central', 'Northeast', 'Island'];

const UT_IDS = new Set([
  'andaman-nicobar', 'chandigarh', 'dnh-daman-diu', 'delhi',
  'jammu-kashmir', 'ladakh', 'lakshadweep', 'puducherry',
]);

// With all 36 states/UTs catalogued, "has hidden gems" / "has cuisine" no longer discriminate
// (every entry has both) — layers instead highlight genuinely distinct subsets of the map.
export const LAYERS = [
  { id: 'unesco', label: 'UNESCO', test: (s) => s.unesco },
  { id: 'ut', label: 'Union Territories', test: (s) => UT_IDS.has(s.id) },
  { id: 'northeast', label: 'Northeast', test: (s) => s.region === 'Northeast' },
];
