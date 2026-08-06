export type ViewId =
  | 'tableau-de-bord'
  | 'carte-interactive'
  | 'carte-administrative'
  | 'cartes-thematiques'
  | 'mes-cartes'
  | 'recherche'
  | 'generer-carte'
  | 'atlas'
  | 'donnees'
  | 'analyses'
  | 'mes-exports'
  | 'historique'
  | 'parametres'
  | 'aide'
  | 'profil'

export interface ZoneData {
  province: string
  commune: string
  secteur: string
  ecoles: number
  sante: number
  eau: number
  population: number
  superficie: number
}

export interface MapLayer {
  id: string
  label: string
  color: string
  checked: boolean
  icon: string
}

export interface AtlasTemplate {
  id: string
  title: string
  subtitle: string
  category: string
  image: string
  pages: number
}

export interface DataEntry {
  id: string
  nom: string
  categorie: string
  source: string
  date: string
  entites: number
  format: string
}

export interface ExportEntry {
  id: string
  nom: string
  zone: string
  theme: string
  format: string
  taille: string
  date: string
  statut: 'Terminé' | 'En cours'
}
