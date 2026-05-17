/**
 * Disease Alert Service
 * 
 * Provides HPAI/Newcastle disease outbreak alerts for poultry farmers
 * based on proximity to their registered farm location.
 * 
 * In production, this will connect to DAHD/WOAH outbreak feeds.
 * Currently uses realistic mock data based on actual 2024-2025 outbreak patterns.
 * 
 * User Story: US-012 (P0)
 */

export interface DiseaseAlert {
  id: string;
  diseaseType: 'HPAI' | 'Newcastle' | 'IBD' | 'Marek' | 'Coccidiosis';
  severity: 'critical' | 'high' | 'medium' | 'low';
  location: {
    district: string;
    state: string;
    lat: number;
    lng: number;
  };
  radiusKm: number;
  affectedBirds: number;
  culledBirds: number;
  reportedDate: string;
  source: 'DAHD' | 'WOAH' | 'State Veterinary' | 'Farmer Report';
  status: 'active' | 'contained' | 'resolved';
  biosecuritySteps: string[];
  insuranceLink: boolean;
}

export interface BiosecurityChecklist {
  id: string;
  step: string;
  description: string;
  priority: 'immediate' | 'within24h' | 'within48h';
  completed?: boolean;
}

// Simulated active disease alerts based on real 2024-2025 outbreak patterns
const ACTIVE_ALERTS: DiseaseAlert[] = [
  {
    id: 'alert-hpai-001',
    diseaseType: 'HPAI',
    severity: 'critical',
    location: { district: 'Krishna', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
    radiusKm: 10,
    affectedBirds: 45000,
    culledBirds: 38000,
    reportedDate: '2026-05-15',
    source: 'DAHD',
    status: 'active',
    biosecuritySteps: [
      'Restrict all visitor and vehicle entry to farm premises immediately',
      'Disinfect all entry points with 2% sodium hypochlorite solution',
      'Monitor flock for symptoms: sudden death, swollen head, nasal discharge, drop in egg production',
      'Report any suspicious mortality (>3% daily) to nearest veterinary office within 24 hours',
      'Do NOT move any birds or eggs off-farm until cleared by authorities'
    ],
    insuranceLink: true
  },
  {
    id: 'alert-hpai-002',
    diseaseType: 'HPAI',
    severity: 'high',
    location: { district: 'Nalgonda', state: 'Telangana', lat: 17.0583, lng: 79.2671 },
    radiusKm: 25,
    affectedBirds: 12000,
    culledBirds: 12000,
    reportedDate: '2026-05-12',
    source: 'State Veterinary',
    status: 'active',
    biosecuritySteps: [
      'Increase biosecurity level: limit farm access to essential personnel only',
      'Install footbaths at all entry points with approved disinfectant',
      'Ensure all feed and water sources are covered and protected from wild birds',
      'Daily temperature and mortality monitoring — log all data',
      'Prepare emergency vaccination supplies (consult state vet for approved vaccines)'
    ],
    insuranceLink: true
  },
  {
    id: 'alert-newcastle-001',
    diseaseType: 'Newcastle',
    severity: 'medium',
    location: { district: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lng: 78.0373 },
    radiusKm: 50,
    affectedBirds: 5000,
    culledBirds: 0,
    reportedDate: '2026-05-10',
    source: 'State Veterinary',
    status: 'contained',
    biosecuritySteps: [
      'Verify vaccination status of your flock — ensure Newcastle Disease vaccine is up to date',
      'Increase monitoring frequency to twice daily',
      'Isolate any birds showing respiratory symptoms immediately',
      'Clean and disinfect equipment between sheds',
      'Contact your nearest KVK for free vaccination support'
    ],
    insuranceLink: false
  },
];

// Standard biosecurity checklist (5-step, as per US-012 AC)
const BIOSECURITY_CHECKLIST: BiosecurityChecklist[] = [
  {
    id: 'bio-1',
    step: 'Restrict Access',
    description: 'Block all non-essential visitors and vehicles. Use footbaths with 2% sodium hypochlorite at every entry point.',
    priority: 'immediate'
  },
  {
    id: 'bio-2',
    step: 'Disinfect Everything',
    description: 'Spray all equipment, vehicles, and surfaces with approved disinfectant. Change clothes and footwear before entering sheds.',
    priority: 'immediate'
  },
  {
    id: 'bio-3',
    step: 'Monitor Your Flock',
    description: 'Check all birds twice daily. Look for: sudden death, swollen head/eyes, nasal discharge, greenish diarrhea, drop in egg production.',
    priority: 'immediate'
  },
  {
    id: 'bio-4',
    step: 'Report Suspicious Signs',
    description: 'If daily mortality exceeds 3%, contact your district veterinary officer IMMEDIATELY. Call 1800-180-1551 (DAHD helpline).',
    priority: 'within24h'
  },
  {
    id: 'bio-5',
    step: 'Freeze Movement',
    description: 'Do NOT sell, transport, or move any birds, eggs, manure, or feed until cleared by veterinary authorities.',
    priority: 'immediate'
  }
];

/**
 * Get all active disease alerts
 */
export function getActiveAlerts(): DiseaseAlert[] {
  return ACTIVE_ALERTS.filter(a => a.status === 'active' || a.status === 'contained');
}

/**
 * Get alerts within a specific radius of a location
 */
export function getAlertsByProximity(
  lat: number, 
  lng: number, 
  maxRadiusKm: number = 100
): (DiseaseAlert & { distanceKm: number })[] {
  return ACTIVE_ALERTS
    .map(alert => ({
      ...alert,
      distanceKm: calculateDistance(lat, lng, alert.location.lat, alert.location.lng)
    }))
    .filter(alert => alert.distanceKm <= maxRadiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Get alerts for a specific state
 */
export function getAlertsByState(state: string): DiseaseAlert[] {
  return ACTIVE_ALERTS.filter(
    a => a.location.state.toLowerCase() === state.toLowerCase()
  );
}

/**
 * Get the standard 5-step biosecurity checklist
 */
export function getBiosecurityChecklist(): BiosecurityChecklist[] {
  return BIOSECURITY_CHECKLIST;
}

/**
 * Get severity level based on distance from outbreak
 */
export function getProximitySeverity(distanceKm: number): 'critical' | 'high' | 'medium' | 'low' {
  if (distanceKm <= 10) return 'critical';
  if (distanceKm <= 25) return 'high';
  if (distanceKm <= 50) return 'medium';
  return 'low';
}

/**
 * Get severity color for UI display
 */
export function getSeverityColor(severity: string): { bg: string; text: string; border: string } {
  switch (severity) {
    case 'critical':
      return { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-300' };
    case 'high':
      return { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-300' };
    case 'medium':
      return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' };
    case 'low':
      return { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-300' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-300' };
  }
}

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(1);
}

function toRad(deg: number): number {
  return deg * Math.PI / 180;
}
