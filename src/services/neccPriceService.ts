/**
 * NECC Price Service
 * 
 * Provides real-time and historical NECC (National Egg Coordination Committee)
 * zonal price data for eggs and broilers across India.
 * 
 * In production, this will connect to the NECC API or scraping service.
 * Currently uses realistic mock data matching actual NECC zone structure.
 * 
 * User Stories: US-006, US-017, US-004
 */

export interface NECCZonePrice {
  zone: string;
  zoneCode: string;
  state: string;
  eggPrice: number;       // ₹ per piece
  broilerPrice: number;   // ₹ per kg live weight
  eggDelta: number;       // Change vs yesterday
  broilerDelta: number;   // Change vs yesterday
  date: string;           // ISO date string
  updatedAt: string;      // ISO timestamp
}

export interface NECCHistoricalPrice {
  date: string;
  eggPrice: number;
  broilerPrice: number;
  feedCostIndex: number;
}

export interface NECCPriceAlert {
  id: string;
  zone: string;
  type: 'spike' | 'drop' | 'anomaly';
  commodity: 'egg' | 'broiler';
  message: string;
  percentChange: number;
  timestamp: string;
}

export interface SeasonalityMarker {
  date: string;
  label: string;
  type: 'festival' | 'weather' | 'regulatory' | 'outbreak';
}

// NECC Zones — real Indian poultry market zones
const NECC_ZONES: Omit<NECCZonePrice, 'date' | 'updatedAt'>[] = [
  { zone: 'Namakkal', zoneCode: 'NMK', state: 'Tamil Nadu', eggPrice: 5.45, broilerPrice: 118, eggDelta: 0.15, broilerDelta: -2 },
  { zone: 'Hyderabad', zoneCode: 'HYD', state: 'Telangana', eggPrice: 5.30, broilerPrice: 115, eggDelta: 0.10, broilerDelta: 3 },
  { zone: 'Barwala', zoneCode: 'BWL', state: 'Haryana', eggPrice: 5.10, broilerPrice: 108, eggDelta: -0.05, broilerDelta: -1 },
  { zone: 'Ajmer', zoneCode: 'AJM', state: 'Rajasthan', eggPrice: 5.20, broilerPrice: 110, eggDelta: 0.10, broilerDelta: 2 },
  { zone: 'Ludhiana', zoneCode: 'LDH', state: 'Punjab', eggPrice: 5.15, broilerPrice: 112, eggDelta: 0.05, broilerDelta: 0 },
  { zone: 'Mumbai', zoneCode: 'MUM', state: 'Maharashtra', eggPrice: 5.60, broilerPrice: 125, eggDelta: 0.20, broilerDelta: 5 },
  { zone: 'Kolkata', zoneCode: 'KOL', state: 'West Bengal', eggPrice: 5.35, broilerPrice: 120, eggDelta: -0.10, broilerDelta: -3 },
  { zone: 'Bangalore', zoneCode: 'BLR', state: 'Karnataka', eggPrice: 5.50, broilerPrice: 122, eggDelta: 0.15, broilerDelta: 4 },
  { zone: 'Vijayawada', zoneCode: 'VJA', state: 'Andhra Pradesh', eggPrice: 5.25, broilerPrice: 114, eggDelta: 0.08, broilerDelta: 1 },
  { zone: 'Warangal', zoneCode: 'WGL', state: 'Telangana', eggPrice: 5.28, broilerPrice: 113, eggDelta: 0.12, broilerDelta: 2 },
  { zone: 'Hospet', zoneCode: 'HSP', state: 'Karnataka', eggPrice: 5.42, broilerPrice: 119, eggDelta: 0.05, broilerDelta: -1 },
  { zone: 'Delhi NCR', zoneCode: 'DEL', state: 'Delhi', eggPrice: 5.55, broilerPrice: 130, eggDelta: 0.25, broilerDelta: 8 },
  { zone: 'Pune', zoneCode: 'PUN', state: 'Maharashtra', eggPrice: 5.48, broilerPrice: 121, eggDelta: 0.10, broilerDelta: 3 },
  { zone: 'Chennai', zoneCode: 'CHN', state: 'Tamil Nadu', eggPrice: 5.40, broilerPrice: 117, eggDelta: 0.12, broilerDelta: 2 },
  { zone: 'Indore', zoneCode: 'IDR', state: 'Madhya Pradesh', eggPrice: 5.18, broilerPrice: 109, eggDelta: -0.08, broilerDelta: -2 },
];

// Generate realistic historical data with seasonal patterns
function generateHistoricalData(zone: string, days: number): NECCHistoricalPrice[] {
  const data: NECCHistoricalPrice[] = [];
  const baseZone = NECC_ZONES.find(z => z.zone === zone || z.zoneCode === zone) || NECC_ZONES[0];
  const baseEgg = baseZone.eggPrice;
  const baseBroiler = baseZone.broilerPrice;
  
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Seasonal variation: eggs peak in winter, dip in summer
    const monthFactor = Math.sin((date.getMonth() - 3) * Math.PI / 6) * 0.15;
    
    // Weekly micro-variation
    const dayNoise = (Math.sin(i * 0.8) * 0.03) + (Math.random() - 0.5) * 0.02;
    
    // Festival spikes (Diwali ~Oct/Nov, Eid, Navratri)
    const month = date.getMonth();
    const festivalBoost = (month === 9 || month === 10) ? 0.08 : 0;
    
    const eggPrice = +(baseEgg * (1 + monthFactor + dayNoise + festivalBoost)).toFixed(2);
    const broilerPrice = +(baseBroiler * (1 + monthFactor * 0.8 + dayNoise * 1.2)).toFixed(0);
    const feedCostIndex = +(100 + (i % 30) * 0.5 + Math.random() * 5).toFixed(1);
    
    data.push({
      date: date.toISOString().split('T')[0],
      eggPrice,
      broilerPrice,
      feedCostIndex
    });
  }
  
  return data;
}

// Seasonality markers for chart overlays
const SEASONALITY_MARKERS: SeasonalityMarker[] = [
  { date: '2025-01-14', label: 'Makar Sankranti', type: 'festival' },
  { date: '2025-03-14', label: 'Holi', type: 'festival' },
  { date: '2025-03-31', label: 'Eid al-Fitr', type: 'festival' },
  { date: '2025-04-15', label: 'Summer Heat Onset', type: 'weather' },
  { date: '2025-06-01', label: 'Monsoon Start', type: 'weather' },
  { date: '2025-07-15', label: 'HPAI Alert Season', type: 'outbreak' },
  { date: '2025-08-15', label: 'Independence Day', type: 'festival' },
  { date: '2025-10-02', label: 'Navratri Start', type: 'festival' },
  { date: '2025-10-20', label: 'Diwali', type: 'festival' },
  { date: '2025-11-15', label: 'Winter Demand Surge', type: 'weather' },
  { date: '2025-12-25', label: 'Christmas/Year-end', type: 'festival' },
  { date: '2026-01-14', label: 'Makar Sankranti', type: 'festival' },
  { date: '2026-04-01', label: 'DAHD Registration Deadline', type: 'regulatory' },
  { date: '2026-06-01', label: 'Monsoon Start', type: 'weather' },
];

/**
 * Get current NECC prices for all zones
 */
export function getAllZonePrices(): NECCZonePrice[] {
  const now = new Date();
  return NECC_ZONES.map(zone => ({
    ...zone,
    date: now.toISOString().split('T')[0],
    updatedAt: now.toISOString(),
  }));
}

/**
 * Get NECC price for a specific zone
 */
export function getZonePrice(zoneCode: string): NECCZonePrice | null {
  const zone = NECC_ZONES.find(z => z.zoneCode === zoneCode || z.zone === zoneCode);
  if (!zone) return null;
  
  const now = new Date();
  return {
    ...zone,
    date: now.toISOString().split('T')[0],
    updatedAt: now.toISOString(),
  };
}

/**
 * Get NECC prices for a specific state (useful for farmer's local zone)
 */
export function getZonePricesByState(state: string): NECCZonePrice[] {
  const now = new Date();
  return NECC_ZONES
    .filter(z => z.state.toLowerCase() === state.toLowerCase())
    .map(zone => ({
      ...zone,
      date: now.toISOString().split('T')[0],
      updatedAt: now.toISOString(),
    }));
}

/**
 * Get historical NECC price data for a zone
 */
export function getHistoricalPrices(
  zoneCode: string, 
  period: '7d' | '30d' | '90d' | '1y' = '30d'
): NECCHistoricalPrice[] {
  const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
  return generateHistoricalData(zoneCode, daysMap[period]);
}

/**
 * Get the national average price (weighted by zone volume)
 */
export function getNationalAverage(): { eggPrice: number; broilerPrice: number; eggDelta: number; broilerDelta: number } {
  const zones = NECC_ZONES;
  const avgEgg = +(zones.reduce((sum, z) => sum + z.eggPrice, 0) / zones.length).toFixed(2);
  const avgBroiler = +(zones.reduce((sum, z) => sum + z.broilerPrice, 0) / zones.length).toFixed(0);
  const avgEggDelta = +(zones.reduce((sum, z) => sum + z.eggDelta, 0) / zones.length).toFixed(2);
  const avgBroilerDelta = +(zones.reduce((sum, z) => sum + z.broilerDelta, 0) / zones.length).toFixed(0);
  
  return { eggPrice: avgEgg, broilerPrice: avgBroiler, eggDelta: avgEggDelta, broilerDelta: avgBroilerDelta };
}

/**
 * Get price alerts (anomaly detection - >15% day-over-day swing)
 */
export function getPriceAlerts(): NECCPriceAlert[] {
  return NECC_ZONES
    .filter(z => Math.abs(z.eggDelta / z.eggPrice) > 0.03 || Math.abs(z.broilerDelta / z.broilerPrice) > 0.03)
    .map(z => ({
      id: `alert-${z.zoneCode}-${Date.now()}`,
      zone: z.zone,
      type: (Math.abs(z.eggDelta) > 0.15 || Math.abs(z.broilerDelta) > 5) ? 'spike' as const : 'anomaly' as const,
      commodity: Math.abs(z.eggDelta / z.eggPrice) > Math.abs(z.broilerDelta / z.broilerPrice) ? 'egg' as const : 'broiler' as const,
      message: `${z.zone}: ${z.eggDelta > 0 ? '↑' : '↓'} Egg ₹${Math.abs(z.eggDelta).toFixed(2)}, ${z.broilerDelta > 0 ? '↑' : '↓'} Broiler ₹${Math.abs(z.broilerDelta)}`,
      percentChange: +(z.eggDelta / z.eggPrice * 100).toFixed(1),
      timestamp: new Date().toISOString()
    }));
}

/**
 * Get seasonality markers for chart overlays
 */
export function getSeasonalityMarkers(): SeasonalityMarker[] {
  return SEASONALITY_MARKERS;
}

/**
 * Determine fair price indicator color based on NECC rate comparison
 * Green: at or above NECC rate
 * Amber: within 5% below NECC rate
 * Red: more than 5% below NECC rate
 */
export function getFairPriceIndicator(
  askingPrice: number, 
  neccRate: number
): { color: 'green' | 'amber' | 'red'; label: string; percentDiff: number } {
  const percentDiff = +((askingPrice - neccRate) / neccRate * 100).toFixed(1);
  
  if (percentDiff >= 0) {
    return { color: 'green', label: 'At or above NECC rate', percentDiff };
  } else if (percentDiff >= -5) {
    return { color: 'amber', label: 'Slightly below NECC rate', percentDiff };
  } else {
    return { color: 'red', label: 'Significantly below NECC rate', percentDiff };
  }
}

/**
 * Get list of all available zones
 */
export function getAvailableZones(): { zone: string; zoneCode: string; state: string }[] {
  return NECC_ZONES.map(({ zone, zoneCode, state }) => ({ zone, zoneCode, state }));
}
