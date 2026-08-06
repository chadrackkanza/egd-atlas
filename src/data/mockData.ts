import type { ZoneData, MapLayer, AtlasTemplate, DataEntry, ExportEntry } from '../types'

export const ZONES: ZoneData[] = [
  { province: 'Kinshasa', commune: 'Kintambo', secteur: 'Joli-Parc', ecoles: 45, sante: 12, eau: 38, population: 125430, superficie: 8.45 },
  { province: 'Kinshasa', commune: 'Gombe', secteur: 'Centre-Ville', ecoles: 62, sante: 18, eau: 51, population: 87200, superficie: 4.18 },
  { province: 'Kinshasa', commune: 'Ngaliema', secteur: 'Binza Météo', ecoles: 38, sante: 9, eau: 29, population: 210500, superficie: 22.3 },
  { province: 'Kinshasa', commune: 'Kalamu', secteur: 'Mombele', ecoles: 55, sante: 15, eau: 42, population: 158000, superficie: 6.72 },
  { province: 'Kinshasa', commune: 'Lemba', secteur: 'Righini', ecoles: 71, sante: 21, eau: 60, population: 234000, superficie: 11.4 },
  { province: 'Nord-Kivu', commune: 'Goma', secteur: 'Katindo', ecoles: 33, sante: 8, eau: 22, population: 95000, superficie: 5.6 },
  { province: 'Katanga', commune: 'Lubumbashi', secteur: 'Kampemba', ecoles: 48, sante: 14, eau: 35, population: 176000, superficie: 9.8 },
]

export const PROVINCES = [...new Set(ZONES.map(z => z.province))]
export const COMMUNES_BY_PROVINCE: Record<string, string[]> = {
  'Kinshasa': ['Kintambo', 'Gombe', 'Ngaliema', 'Kalamu', 'Lemba'],
  'Nord-Kivu': ['Goma', 'Butembo', 'Beni'],
  'Katanga': ['Lubumbashi', 'Kolwezi', 'Likasi'],
}
export const SECTEURS_BY_COMMUNE: Record<string, string[]> = {
  'Kintambo': ['Joli-Parc', 'Kintambo-Magasin', 'Mbanza-Lemba'],
  'Gombe': ['Centre-Ville', 'Gombele', 'Socimat'],
  'Ngaliema': ['Binza Météo', 'Delvaux', 'Righini'],
  'Kalamu': ['Mombele', 'Righini', 'Salongo'],
  'Lemba': ['Righini', 'Matete', 'Kimbanseke'],
  'Goma': ['Katindo', 'Himbi', 'Karisimbi'],
  'Lubumbashi': ['Kampemba', 'Kenya', 'Rwashi'],
}

export const DEFAULT_LAYERS: MapLayer[] = [
  { id: 'ecoles', label: 'Écoles', color: '#1d4ed8', checked: true, icon: '🎓' },
  { id: 'sante', label: 'Centres de santé', color: '#dc2626', checked: true, icon: '🏥' },
  { id: 'eau', label: "Points d'eau", color: '#0891b2', checked: true, icon: '💧' },
  { id: 'routes', label: 'Routes principales', color: '#d97706', checked: true, icon: '🛣️' },
  { id: 'limites', label: 'Limites des quartiers', color: '#16a34a', checked: true, icon: '🗺️' },
  { id: 'eglises', label: 'Paroisses/Églises', color: '#7c3aed', checked: false, icon: '⛪' },
]

export const THEMES = [
  { id: 'education', label: 'Éducation', icon: '🎓', color: 'blue' },
  { id: 'sante', label: 'Santé', icon: '🏥', color: 'red' },
  { id: 'eau', label: 'Eau', icon: '💧', color: 'cyan' },
  { id: 'religion', label: 'Religion', icon: '⛪', color: 'purple' },
  { id: 'infrastructure', label: 'Infrastructure', icon: '🏗️', color: 'orange' },
  { id: 'environnement', label: 'Environnement', icon: '🌿', color: 'green' },
  { id: 'population', label: 'Population', icon: '👥', color: 'indigo' },
  { id: 'securite', label: 'Sécurité', icon: '🛡️', color: 'slate' },
]

export const ATLAS_TEMPLATES: AtlasTemplate[] = [
  { id: '1', title: 'Atlas Provincial', subtitle: 'Complet', category: 'Provincial', image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=250&fit=crop', pages: 48 },
  { id: '2', title: 'Atlas Communal', subtitle: 'Complet', category: 'Communal', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=250&fit=crop', pages: 32 },
  { id: '3', title: 'Atlas Santé', subtitle: 'Infrastructures sanitaires', category: 'Thématique', image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=250&fit=crop', pages: 24 },
  { id: '4', title: 'Atlas Éducation', subtitle: 'Infrastructures scolaires', category: 'Thématique', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=250&fit=crop', pages: 28 },
  { id: '5', title: 'Atlas Eau', subtitle: "Réseau et points d'eau", category: 'Thématique', image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=250&fit=crop', pages: 20 },
  { id: '6', title: 'Atlas Paroissial', subtitle: 'Paroisses et chapelles', category: 'Religion', image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=400&h=250&fit=crop', pages: 16 },
]

export const DATA_CATALOG: DataEntry[] = [
  { id: '1', nom: 'Limites administratives', categorie: 'Administration', source: 'iGéBD', date: '2024', entites: 145, format: 'SHP' },
  { id: '2', nom: 'Écoles', categorie: 'Éducation', source: 'EDUQ-RDC', date: '2024', entites: 12438, format: 'SHP' },
  { id: '3', nom: 'Centres de santé', categorie: 'Santé', source: 'MSP RDC', date: '2024', entites: 8291, format: 'SHP' },
  { id: '4', nom: "Points d'eau", categorie: 'Eau', source: 'RDC Eau', date: '2023', entites: 5674, format: 'SHP' },
  { id: '5', nom: 'Routes principales', categorie: 'Infrastructure', source: 'OVD', date: '2024', entites: 3820, format: 'SHP' },
  { id: '6', nom: 'Paroisses', categorie: 'Religion', source: 'Diocese', date: '2024', entites: 2145, format: 'SHP' },
  { id: '7', nom: "Occupation du sol 2023", categorie: 'Environnement', source: 'FEA', date: '2023', entites: 789, format: 'TIF' },
  { id: '8', nom: 'Population par quartier', categorie: 'Population', source: 'INS', date: '2024', entites: 904, format: 'CSV' },
]

export const EXPORTS: ExportEntry[] = [
  { id: '1', nom: 'Carte Santé Kintambo', zone: 'Kintambo', theme: 'Santé', format: 'PDF', taille: '2.4 MB', date: '20/06/2026', statut: 'Terminé' },
  { id: '2', nom: 'Carte Éducation Kinshasa', zone: 'Kinshasa', theme: 'Éducation', format: 'PDF', taille: '3.1 MB', date: '18/06/2026', statut: 'Terminé' },
  { id: '3', nom: "Carte Eau Joli-Parc", zone: 'Joli-Parc', theme: 'Eau', format: 'PNG', taille: '1.8 MB', date: '17/06/2026', statut: 'Terminé' },
  { id: '4', nom: 'Carte Paroisses', zone: 'Kinshasa', theme: 'Religion', format: 'PDF', taille: '1.5 MB', date: '15/06/2026', statut: 'Terminé' },
  { id: '5', nom: 'Atlas Communal Gombe', zone: 'Gombe', theme: 'Complet', format: 'PDF', taille: '8.9 MB', date: '14/06/2026', statut: 'En cours' },
]

// ─── Administrative Boundaries ───────────────────────────────────────────────

export const PROVINCE_BOUNDS: Record<string, [number, number][]> = {
  'Kinshasa': [
    [-4.10, 15.05], [-4.08, 15.22], [-4.05, 15.42], [-4.12, 15.58],
    [-4.25, 15.63], [-4.42, 15.62], [-4.56, 15.48], [-4.54, 15.22],
    [-4.42, 15.04], [-4.28, 15.00], [-4.10, 15.05],
  ],
  'Nord-Kivu': [
    [-0.30, 29.10], [-0.30, 29.50], [-1.60, 29.50], [-1.60, 29.10], [-0.30, 29.10],
  ],
  'Katanga': [
    [-8.80, 27.00], [-8.80, 27.60], [-9.40, 27.60], [-9.40, 27.00], [-8.80, 27.00],
  ],
}

export const COMMUNE_BOUNDS: Record<string, [number, number][]> = {
  'Kintambo': [
    [-4.295, 15.290], [-4.285, 15.305], [-4.278, 15.320],
    [-4.290, 15.335], [-4.310, 15.330], [-4.325, 15.318],
    [-4.320, 15.298], [-4.305, 15.288], [-4.295, 15.290],
  ],
  'Gombe': [
    [-4.275, 15.285], [-4.272, 15.345], [-4.300, 15.352],
    [-4.315, 15.345], [-4.318, 15.285], [-4.275, 15.285],
  ],
  'Ngaliema': [
    [-4.235, 15.258], [-4.230, 15.340], [-4.260, 15.395],
    [-4.310, 15.385], [-4.345, 15.310], [-4.330, 15.255], [-4.235, 15.258],
  ],
  'Kalamu': [
    [-4.335, 15.280], [-4.330, 15.385], [-4.390, 15.390],
    [-4.400, 15.280], [-4.335, 15.280],
  ],
  'Lemba': [
    [-4.355, 15.295], [-4.350, 15.450], [-4.445, 15.455],
    [-4.450, 15.295], [-4.355, 15.295],
  ],
}

export const SECTEUR_BOUNDS: Record<string, [number, number][]> = {
  'Joli-Parc': [
    [-4.292, 15.290], [-4.288, 15.308], [-4.296, 15.328],
    [-4.308, 15.322], [-4.312, 15.300], [-4.300, 15.287], [-4.292, 15.290],
  ],
  'Centre-Ville': [
    [-4.279, 15.290], [-4.276, 15.335], [-4.295, 15.342],
    [-4.303, 15.330], [-4.300, 15.288], [-4.279, 15.290],
  ],
  'Binza Météo': [
    [-4.238, 15.262], [-4.234, 15.310], [-4.255, 15.340],
    [-4.278, 15.318], [-4.268, 15.260], [-4.238, 15.262],
  ],
}

// ─── Thematic Boundaries ─────────────────────────────────────────────────────

export interface ThematicZone {
  id: string
  name: string
  type: string
  bounds: [number, number][]
  color: string
  fillOpacity: number
}

export const HEALTH_ZONES: ThematicZone[] = [
  {
    id: 'zs-kintambo', name: 'Zone de santé de Kintambo', type: 'zone-sante',
    color: '#dc2626', fillOpacity: 0.08,
    bounds: [
      [-4.275, 15.280], [-4.270, 15.340], [-4.295, 15.355],
      [-4.330, 15.345], [-4.338, 15.282], [-4.305, 15.272], [-4.275, 15.280],
    ],
  },
  {
    id: 'zs-ngaliema', name: 'Zone de santé de Ngaliema', type: 'zone-sante',
    color: '#b91c1c', fillOpacity: 0.07,
    bounds: [
      [-4.232, 15.255], [-4.228, 15.345], [-4.265, 15.400],
      [-4.315, 15.390], [-4.350, 15.320], [-4.335, 15.252], [-4.232, 15.255],
    ],
  },
]

export const HEALTH_AREAS: ThematicZone[] = [
  {
    id: 'as-joli-parc', name: 'Aire de santé Joli-Parc', type: 'aire-sante',
    color: '#ef4444', fillOpacity: 0.10,
    bounds: [
      [-4.290, 15.288], [-4.285, 15.310], [-4.293, 15.330],
      [-4.308, 15.325], [-4.315, 15.295], [-4.302, 15.285], [-4.290, 15.288],
    ],
  },
  {
    id: 'as-mbanza', name: 'Aire de santé Mbanza-Lemba', type: 'aire-sante',
    color: '#ef4444', fillOpacity: 0.10,
    bounds: [
      [-4.278, 15.290], [-4.275, 15.318], [-4.290, 15.340],
      [-4.308, 15.330], [-4.308, 15.290], [-4.278, 15.290],
    ],
  },
  {
    id: 'as-kintambo-mag', name: 'Aire de santé Kintambo-Magasin', type: 'aire-sante',
    color: '#ef4444', fillOpacity: 0.10,
    bounds: [
      [-4.310, 15.285], [-4.308, 15.330], [-4.325, 15.340],
      [-4.335, 15.310], [-4.330, 15.282], [-4.310, 15.285],
    ],
  },
]

export const EDUCATION_ZONES: ThematicZone[] = [
  {
    id: 'proveduc-kin1', name: 'Province éducationnelle Kinshasa I', type: 'prov-education',
    color: '#1d4ed8', fillOpacity: 0.07,
    bounds: [
      [-4.225, 15.255], [-4.220, 15.395], [-4.340, 15.400],
      [-4.345, 15.255], [-4.225, 15.255],
    ],
  },
  {
    id: 'proveduc-kin2', name: 'Province éducationnelle Kinshasa II', type: 'prov-education',
    color: '#2563eb', fillOpacity: 0.07,
    bounds: [
      [-4.340, 15.255], [-4.340, 15.400], [-4.460, 15.405],
      [-4.460, 15.255], [-4.340, 15.255],
    ],
  },
]

// ─── Approximate Kintambo boundary coordinates [lat, lng] ────────────────────
export const KINTAMBO_BOUNDS: [number, number][] = [
  [-4.295, 15.290],
  [-4.285, 15.305],
  [-4.278, 15.320],
  [-4.290, 15.335],
  [-4.310, 15.330],
  [-4.325, 15.318],
  [-4.320, 15.298],
  [-4.305, 15.288],
  [-4.295, 15.290],
]

export const MOCK_MARKERS: Record<string, Array<{ lat: number; lng: number; label: string }>> = {
  ecoles: [
    { lat: -4.298, lng: 15.298, label: 'École primaire Joli-Parc' },
    { lat: -4.302, lng: 15.312, label: 'École secondaire Kintambo' },
    { lat: -4.290, lng: 15.308, label: 'Institut Ngaliema' },
    { lat: -4.310, lng: 15.302, label: 'École Catholique St-Paul' },
    { lat: -4.295, lng: 15.320, label: 'École primaire Mont-Ngafula' },
  ],
  sante: [
    { lat: -4.300, lng: 15.305, label: 'Centre de santé Kintambo' },
    { lat: -4.308, lng: 15.318, label: 'Clinique Joli-Parc' },
    { lat: -4.288, lng: 15.315, label: 'Dispensaire Ngaliema' },
  ],
  eau: [
    { lat: -4.293, lng: 15.295, label: "Forage communautaire 1" },
    { lat: -4.305, lng: 15.310, label: "Point d'eau Kintambo" },
    { lat: -4.315, lng: 15.308, label: 'Château d\'eau' },
    { lat: -4.298, lng: 15.325, label: 'Borne fontaine Est' },
  ],
  eglises: [
    { lat: -4.302, lng: 15.298, label: 'Paroisse Saint-Jean' },
    { lat: -4.292, lng: 15.318, label: 'Église Protestante' },
    { lat: -4.312, lng: 15.315, label: 'Cathédrale Kintambo' },
  ],
}
