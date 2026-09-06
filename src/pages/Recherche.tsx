'use client'
import { useState, useMemo } from 'react'
import type { ViewId } from '../types'
import { OpenLayersMap } from '../components/map/OpenLayersMap'
import {
  LuSearch, LuSlidersHorizontal, LuX, LuMapPin, LuGlobe, LuCrosshair,
  LuGraduationCap, LuHeartPulse, LuDroplet, LuChurch, LuBuilding2, LuRoute,
  LuUsers, LuShield, LuLeaf, LuArrowRight, LuLayers, LuChevronDown, LuCompass,
} from 'react-icons/lu'

// DRC center approximately
const DRC_CENTER: [number, number] = [-2.5, 23.5]

// Major DRC cities / search points
interface SearchPlace {
  id: string
  name: string
  type: 'ville' | 'province' | 'territoire' | 'infrastructure'
  lat: number
  lng: number
  province: string
  category: string
  population?: string
  description: string
}

const PLACES: SearchPlace[] = [
  { id: '1', name: 'Kinshasa', type: 'ville', lat: -4.325, lng: 15.322, province: 'Kinshasa', category: 'Capitale', population: '15 628 000', description: 'Capitale de la RDC, plus grande ville du pays' },
  { id: '2', name: 'Lubumbashi', type: 'ville', lat: -11.688, lng: 27.833, province: 'Haut-Katanga', category: 'Ville', population: '2 990 000', description: 'Capitale minière du cuivre, 2e ville de RDC' },
  { id: '3', name: 'Mbuji-Mayi', type: 'ville', lat: -6.133, lng: 23.589, province: 'Kasaï-Oriental', category: 'Ville', population: '2 700 000', description: 'Centre diamantif du pays' },
  { id: '4', name: 'Goma', type: 'ville', lat: -1.679, lng: 29.223, province: 'Nord-Kivu', category: 'Ville', population: '1 100 000', description: 'Capitale du Nord-Kivu, au pied du Nyiragongo' },
  { id: '5', name: 'Bukavu', type: 'ville', lat: -2.508, lng: 28.846, province: 'Sud-Kivu', category: 'Ville', population: '1 200 000', description: 'Rives du lac Kivu, chef-lieu du Sud-Kivu' },
  { id: '6', name: 'Kisangani', type: 'ville', lat: 0.516, lng: 25.200, province: 'Tshopo', category: 'Ville', population: '1 600 000', description: 'Grand port fluvial sur le fleuve Congo' },
  { id: '7', name: 'Kananga', type: 'ville', lat: -5.896, lng: 22.415, province: 'Kasaï-Central', category: 'Ville', population: '1 500 000', description: 'Chef-lieu du Kasaï-Central' },
  { id: '8', name: 'Likasi', type: 'ville', lat: -10.982, lng: 26.833, province: 'Haut-Katanga', category: 'Ville', population: '600 000', description: 'Pôle minier du cuivre et cobalt' },
  { id: '9', name: 'Kolwezi', type: 'ville', lat: -10.717, lng: 25.467, province: 'Lualaba', category: 'Ville', population: '580 000', description: 'Centre d\'extraction du cuivre et cobalt' },
  { id: '10', name: 'Matadi', type: 'ville', lat: -5.825, lng: 13.465, province: 'Kongo-Central', category: 'Ville', population: '500 000', description: 'Principal port maritime de la RDC' },
  { id: '11', name: 'Boma', type: 'ville', lat: -5.851, lng: 13.051, province: 'Kongo-Central', category: 'Ville', population: '530 000', description: 'Ancienne capitale coloniale, port fluvial' },
  { id: '12', name: 'Beni', type: 'ville', lat: 0.491, lng: 29.473, province: 'Nord-Kivu', category: 'Ville', population: '700 000', description: 'Zone agricole et commerçante du Nord-Kivu' },
  { id: '13', name: 'Butembo', type: 'ville', lat: 0.083, lng: 29.293, province: 'Nord-Kivu', category: 'Ville', population: '900 000', description: 'Grand centre commercial du Nord-Kivu' },
  { id: '14', name: 'Uvira', type: 'ville', lat: -3.395, lng: 29.146, province: 'Sud-Kivu', category: 'Ville', population: '400 000', description: 'Port lacustre sur le lac Tanganyika' },
  { id: '15', name: 'Kindu', type: 'ville', lat: -2.950, lng: 25.900, province: 'Maniema', category: 'Ville', population: '350 000', description: 'Chef-lieu du Maniema, port fluvial' },
  { id: '16', name: 'Isiro', type: 'ville', lat: 2.773, lng: 27.627, province: 'Haut-Uele', category: 'Ville', population: '300 000', description: 'Centre agricole du nord-est' },
  { id: '17', name: 'Bunia', type: 'ville', lat: 1.559, lng: 30.252, province: 'Ituri', category: 'Ville', population: '650 000', description: 'Chef-lieu de l\'Ituri, région aurifère' },
  { id: '18', name: 'Bandundu', type: 'ville', lat: -3.317, lng: 17.367, province: 'Kwilu', category: 'Ville', population: '250 000', description: 'Chef-lieu du Kwilu' },
  { id: '19', name: 'Kikwit', type: 'ville', lat: -5.033, lng: 18.817, province: 'Kwilu', category: 'Ville', population: '1 100 000', description: 'Grand centre commercial du Kwilu' },
  { id: '20', name: 'Mbandaka', type: 'ville', lat: 0.049, lng: 18.260, province: 'Équateur', category: 'Ville', population: '350 000', description: 'Port fluvial à la confluence Congo/Ruki' },
  { id: '21', name: 'Gemena', type: 'ville', lat: 3.250, lng: 19.767, province: 'Sud-Ubangi', category: 'Ville', population: '300 000', description: 'Chef-lieu du Sud-Ubangi' },
  { id: '22', name: 'Aéroport de N\'djili', type: 'infrastructure', lat: -4.386, lng: 15.446, province: 'Kinshasa', category: 'Infrastructure', description: 'Aéroport international de Kinshasa' },
  { id: '23', name: 'Barrage d\'Inga', type: 'infrastructure', lat: -5.864, lng: 13.572, province: 'Kongo-Central', category: 'Infrastructure', description: 'Complexe hydroélectrique sur le fleuve Congo' },
  { id: '24', name: 'Port de Matadi', type: 'infrastructure', lat: -5.825, lng: 13.465, province: 'Kongo-Central', category: 'Infrastructure', description: 'Port maritime principal de la RDC' },
  { id: '25', name: 'Parc national de la Salonga', type: 'infrastructure', lat: -2.000, lng: 21.500, province: 'Tshuapa', category: 'Aire protégée', description: 'Plus grande réserve forestière tropicale d\'Afrique' },
  { id: '26', name: 'Parc des Virunga', type: 'infrastructure', lat: -1.250, lng: 29.200, province: 'Nord-Kivu', category: 'Aire protégée', description: 'Habitat des gorilles de montagne, UNESCO' },
]

const TYPE_STYLES: Record<SearchPlace['type'], { color: string; label: string }> = {
  ville: { color: '#1d4ed8', label: 'Ville' },
  province: { color: '#15803d', label: 'Province' },
  territoire: { color: '#d97706', label: 'Territoire' },
  infrastructure: { color: '#7c3aed', label: 'Infrastructure' },
}

const CATEGORY_FILTERS = [
  { id: 'all', label: 'Tout', icon: <LuGlobe className="w-3.5 h-3.5" /> },
  { id: 'ville', label: 'Villes', icon: <LuMapPin className="w-3.5 h-3.5" /> },
  { id: 'infrastructure', label: 'Infrastructures', icon: <LuBuilding2 className="w-3.5 h-3.5" /> },
]

interface RechercheProps {
  onNavigate: (view: ViewId) => void
}

export function Recherche({ onNavigate }: RechercheProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [selectedPlace, setSelectedPlace] = useState<SearchPlace | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return PLACES.filter(p => {
      const matchQuery = !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.province.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      const matchCat = category === 'all' || p.type === category
      return matchQuery && matchCat
    })
  }, [query, category])

  const handleSelectPlace = (place: SearchPlace) => {
    setSelectedPlace(place)
  }
  const mapPoints = filtered.map((place) => ({
    id: place.id,
    lat: place.lat,
    lng: place.lng,
    color: TYPE_STYLES[place.type].color,
    label: place.name,
    active: selectedPlace?.id === place.id,
    payload: place,
  }))

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-0 overflow-hidden bg-slate-50">
      {/* Search Panel */}
      <div className="lg:w-96 xl:w-[420px] flex-shrink-0 flex flex-col bg-white border-r border-slate-200 overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
            <LuSearch className="w-5 h-5 text-green-700" />
            Recherche géospatiale
          </h1>
          <p className="text-xs text-slate-500 mb-3">Lieux, données et informations sur toute la RDC</p>
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un lieu, une ville, une infrastructure..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 pl-10 pr-10 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
            <LuSearch className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                <LuX className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Category filters */}
          <div className="flex gap-1.5 mt-3">
            {CATEGORY_FILTERS.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
                  category === cat.id
                    ? 'bg-green-700 text-white border-green-700'
                    : 'border-slate-200 text-slate-600 hover:border-green-300 hover:text-green-700'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
            <button
              onClick={() => setShowFilters(s => !s)}
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all ml-auto ${
                showFilters ? 'bg-blue-700 text-white border-blue-700' : 'border-slate-200 text-slate-600 hover:border-blue-300'
              }`}
            >
              <LuSlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filtres</span>
            </button>
          </div>
          {/* Advanced filters */}
          {showFilters && (
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-fade-in">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Province</label>
                <select className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white focus:ring-2 focus:ring-green-500 outline-none">
                  <option>Toutes les provinces</option>
                  <option>Kinshasa</option>
                  <option>Haut-Katanga</option>
                  <option>Nord-Kivu</option>
                  <option>Sud-Kivu</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Type de lieu</label>
                <select className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white focus:ring-2 focus:ring-green-500 outline-none">
                  <option>Tous les types</option>
                  <option>Ville</option>
                  <option>Infrastructure</option>
                  <option>Aire protégée</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-2 text-xs text-slate-500 font-medium sticky top-0 bg-white border-b border-slate-100">
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
          </div>
          {filtered.map(place => {
            const style = TYPE_STYLES[place.type]
            const isSelected = selectedPlace?.id === place.id
            return (
              <button
                key={place.id}
                onClick={() => handleSelectPlace(place)}
                className={`w-full text-left p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                  isSelected ? 'bg-green-50 border-l-4 border-l-green-600' : ''
                }`}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                  style={{ backgroundColor: style.color }}
                >
                  {place.type === 'ville' ? <LuMapPin className="w-4 h-4" /> :
                   place.type === 'infrastructure' ? <LuBuilding2 className="w-4 h-4" /> :
                   <LuGlobe className="w-4 h-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 truncate">{place.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0" style={{ backgroundColor: `${style.color}15`, color: style.color }}>
                      {style.label}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate">{place.province}</div>
                  <div className="text-xs text-slate-400 mt-0.5 line-clamp-2">{place.description}</div>
                  {place.population && (
                    <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                      <LuUsers className="w-3 h-3" />
                      {place.population} hab.
                    </div>
                  )}
                </div>
                <LuArrowRight className={`w-4 h-4 text-slate-300 flex-shrink-0 mt-1 transition-all ${isSelected ? 'text-green-600 translate-x-0.5' : ''}`} />
              </button>
            )
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <div className="text-3xl mb-2">🔍</div>
              <div className="text-sm">Aucun résultat trouvé</div>
              <div className="text-xs mt-1">Essayez un autre terme de recherche</div>
            </div>
          )}
        </div>

        {/* Selected place detail */}
        {selectedPlace && (
          <div className="border-t border-slate-200 p-4 bg-slate-50">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">{selectedPlace.name}</h3>
              <button onClick={() => setSelectedPlace(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <LuX className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 mb-3">{selectedPlace.description}</div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-white rounded-lg p-2 border border-slate-200">
                <div className="text-slate-400 text-[10px] uppercase">Province</div>
                <div className="font-medium text-slate-700">{selectedPlace.province}</div>
              </div>
              <div className="bg-white rounded-lg p-2 border border-slate-200">
                <div className="text-slate-400 text-[10px] uppercase">Coordonnées</div>
                <div className="font-medium text-slate-700 font-mono text-[11px]">{selectedPlace.lat.toFixed(3)}, {selectedPlace.lng.toFixed(3)}</div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('carte-interactive')}
              className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 text-white text-sm py-2.5 rounded-xl font-medium transition-colors"
            >
              <LuLayers className="w-4 h-4" />
              Ouvrir sur la carte interactive
            </button>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <OpenLayersMap
          center={selectedPlace ? [selectedPlace.lat, selectedPlace.lng] : DRC_CENTER}
          zoom={selectedPlace ? 10 : 5}
          animateView={Boolean(selectedPlace)}
          className="w-full h-full"
          tileUrl="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          points={mapPoints}
          onPointClick={(point) => handleSelectPlace(point.payload as SearchPlace)}
        />

        {/* Floating legend */}
        <div className="absolute bottom-8 left-3 sm:left-4 bg-white rounded-xl shadow-lg border border-slate-200 p-3 z-[1000]">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Types de lieux</div>
          <div className="space-y-1.5">
            {Object.entries(TYPE_STYLES).map(([key, style]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: style.color }} />
                <span className="text-xs text-slate-600">{style.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DRC badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur rounded-full px-4 py-1.5 shadow border border-slate-200 z-[1000] flex items-center gap-2">
          <LuGlobe className="w-4 h-4 text-green-700" />
          <span className="text-xs font-medium text-slate-700">République Démocratique du Congo</span>
        </div>
      </div>
    </div>
  )
}
