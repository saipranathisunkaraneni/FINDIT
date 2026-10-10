export interface CampusLocationPoint {
  id: string;
  name: string;
  shortName: string;
  lat: number;
  lng: number;
  description: string;
}

export const KITSW_CENTER = {
  lat: 18.0522,
  lng: 79.5361,
  name: 'Kakatiya Institute of Technology & Science (KITSW), Warangal',
};

export const KITSW_BLOCKS: CampusLocationPoint[] = [
  {
    id: 'block-1',
    name: 'Block I: Civil Engineering',
    shortName: 'Block I (Civil)',
    lat: 18.0528,
    lng: 79.5358,
    description: 'Civil Engineering department & structural laboratories',
  },
  {
    id: 'block-2',
    name: 'Block II: Computer Science & Engineering (CSE)',
    shortName: 'Block II (CSE)',
    lat: 18.0526,
    lng: 79.5363,
    description: 'CSE labs, classrooms & faculty cabins',
  },
  {
    id: 'block-3',
    name: 'Block III: Electrical & Electronics Engineering (EEE) and Mechanical Engineering',
    shortName: 'Block III (EEE & Mech)',
    lat: 18.0524,
    lng: 79.5356,
    description: 'Electrical & Mechanical labs, thermal engineering workshop',
  },
  {
    id: 'block-4',
    name: 'Block IV: Administrative Block',
    shortName: 'Block IV (Admin)',
    lat: 18.0522,
    lng: 79.5361,
    description: 'Principal office, academic section, examination branch',
  },
  {
    id: 'block-5',
    name: 'Block V: Information Technology (IT)',
    shortName: 'Block V (IT)',
    lat: 18.0531,
    lng: 79.5365,
    description: 'IT department, computing centers, software labs',
  },
  {
    id: 'block-6',
    name: 'Block VI: Electronics & Communication Engineering (ECE)',
    shortName: 'Block VI (ECE)',
    lat: 18.052,
    lng: 79.5367,
    description: 'ECE labs, communication systems, VLSI center',
  },
  {
    id: 'block-7',
    name: 'Block VII: I2RE',
    shortName: 'Block VII (I2RE)',
    lat: 18.0518,
    lng: 79.5359,
    description: 'Innovation, Incubation, Research & Entrepreneurship center',
  },
  {
    id: 'library',
    name: 'Library',
    shortName: 'Central Library',
    lat: 18.0525,
    lng: 79.536,
    description: 'Central library, digital library, reading halls',
  },
  {
    id: 'auditorium',
    name: 'Auditorium',
    shortName: 'Auditorium',
    lat: 18.0523,
    lng: 79.537,
    description: 'Main campus auditorium for events and symposiums',
  },
  {
    id: 'convention-hall',
    name: 'New Convention Hall',
    shortName: 'Convention Hall',
    lat: 18.0525,
    lng: 79.5375,
    description: 'Air-conditioned conference and seminar hall',
  },
  {
    id: 'cafeteria',
    name: 'Cafeteria',
    shortName: 'Cafeteria & Canteen',
    lat: 18.0515,
    lng: 79.536,
    description: 'Student cafeteria, dining area & snack counters',
  },
  {
    id: 'indoor-stadium',
    name: 'Indoor Stadium',
    shortName: 'Indoor Stadium',
    lat: 18.0535,
    lng: 79.5372,
    description: 'Badminton courts, gym, table tennis & sports arena',
  },
  {
    id: 'girls-hostel',
    name: "Girl's Hostel",
    shortName: "Girl's Hostel",
    lat: 18.054,
    lng: 79.535,
    description: 'Campus residence for female students',
  },
  {
    id: 'boys-hostel',
    name: "Boy's Hostel",
    shortName: "Boy's Hostel",
    lat: 18.0505,
    lng: 79.5375,
    description: 'Campus residence for male students',
  },
  {
    id: 'dispensary',
    name: 'Dispensary',
    shortName: 'Dispensary & Health Center',
    lat: 18.0517,
    lng: 79.5364,
    description: 'Campus health post and medical first-aid clinic',
  },
  {
    id: 'workshop',
    name: 'Workshop',
    shortName: 'Central Workshop',
    lat: 18.0512,
    lng: 79.5352,
    description: 'Fitting, welding, machine shops and carpentry labs',
  },
  {
    id: 'main-gate',
    name: 'Main Gate',
    shortName: 'Main Entrance & Gate',
    lat: 18.0502,
    lng: 79.5365,
    description: 'Main campus entrance, security post & bike parking',
  },
];

export function findCampusBlock(nameOrQuery: string): CampusLocationPoint | undefined {
  if (!nameOrQuery) return undefined;
  const q = nameOrQuery.toLowerCase().trim();
  return KITSW_BLOCKS.find(
    (b) =>
      b.name.toLowerCase() === q ||
      b.shortName.toLowerCase() === q ||
      b.id.toLowerCase() === q ||
      b.name.toLowerCase().includes(q) ||
      q.includes(b.name.toLowerCase())
  );
}

/**
 * Calculates geographic distance in meters between two lat/lng coordinates (Haversine formula).
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Finds the nearest designated KITSW campus block given arbitrary coordinates.
 */
export function findNearestCampusBlock(lat: number, lng: number): CampusLocationPoint {
  let nearest = KITSW_BLOCKS[0];
  let minDistance = Infinity;

  for (const block of KITSW_BLOCKS) {
    const dist = calculateDistanceMeters(lat, lng, block.lat, block.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = block;
    }
  }

  return nearest;
}

