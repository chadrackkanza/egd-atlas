import { useState, useMemo, useCallback } from 'react'
import { MapContainer, TileLayer, Polygon, Marker, Popup, ZoomControl, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ATLAS_TEMPLATES, PROVINCES, COMMUNES_BY_PROVINCE, SECTEURS_BY_COMMUNE, THEMES, KINTAMBO_BOUNDS, MOCK_MARKERS, ZONES } from '../data/mockData'
import type { ViewId, MapLayer } from '../types'
import {
  LuPlus, LuEye, LuBookOpen, LuMap, LuLayers, LuDownload,
  LuSparkles, LuChevronRight, LuX, LuCheck, LuFilePlus,
  LuGraduationCap, LuHeartPulse, LuDroplet, LuRoute, LuChurch,
  LuBuilding2, LuLeaf, LuUsers, LuShield, LuMapPin, LuFilter,
  LuArrowLeft, LuFileText, LuImage, LuCircleCheck, LuLoader,
} from 'react-icons/lu'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function createColoredIcon(color: string, emoji: string) {
  return L.divIcon({
    html: `<div style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.35);font-size:10px">${emoji}</div>`,
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

const LAYER_META: Record<string, { color: string; emoji: string }> = {
  ecoles: { color: '#1d4ed8', emoji: '🎓' },
  sante: { color: '#dc2626', emoji: '🏥' },
  eau: { color: '#0891b2', emoji: '💧' },
  eglises: { color: '#7c3aed', emoji: '⛪' },
}

const THEME_ICONS: Record<string, React.ReactNode> = {
  education: <LuGraduationCap className="w-5 h-5" />,
  sante: <LuHeartPulse className="w-5 h-5" />,
  eau: <LuDroplet className="w-5 h-5" />,
  religion: <LuChurch className="w-5 h-5" />,
  infrastructure: <LuBuilding2 className="w-5 h-5" />,
  environnement: <LuLeaf className="w-5 h-5" />,
  population: <LuUsers className="w-5 h-5" />,
  securite: <LuShield className="w-5 h-5" />,
}

const ELEMENT_OPTIONS: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: 'ecoles', label: 'Écoles', icon: <LuGraduationCap className="w-4 h-4" /> },
  { id: 'sante', label: 'Centres de santé', icon: <LuHeartPulse className="w-4 h-4" /> },
  { id: 'eau', label: "Points d'eau", icon: <LuDroplet className="w-4 h-4" /> },
  { id: 'eglises', label: 'Paroisses/Églises', icon: <LuChurch className="w-4 h-4" /> },
]

const FORMATS = ['A4 Paysage', 'A4 Portrait', 'A3 Paysage', 'A3 Portrait']

function MapRecenter({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap()
  useMemo(() => { map.setView([lat, lng], zoom) }, [lat, lng, zoom, map])
  return null
}

interface AtlasProps {
  onNavigate: (view: ViewId) => void
}

export function Atlas({ onNavigate }: AtlasProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [province, setProvince] = useState('Kinshasa')
  const [commune, setCommune] = useState('Kintambo')
  const [secteur, setSecteur] = useState('Joli-Parc')
  const [activeThemes, setActiveThemes] = useState<string[]>(['education', 'sante'])
  const [activeLayers, setActiveLayers] = useState<string[]>(['ecoles', 'sante', 'eau'])
  const [baseMap, setBaseMap] = useState<'osm' | 'satellite'>('osm')
  const [format, setFormat] = useState('A4 Paysage')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  const communes = COMMUNES_BY_PROVINCE[province] || []
  const secteurs = SECTEURS_BY_COMMUNE[commune] || []

  const toggleTheme = useCallback((id: string) => {
    setActiveThemes(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  }, [])
  const toggleLayer = useCallback((id: string) => {
    setActiveLayers(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id])
  }, [])

  const tileUrl = baseMap === 'satellite'
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => { setGenerating(false); setGenerated(true) }, 2500)
  }

  const startConfig = (templateId: string) => {
    setSelectedTemplate(templateId)
    setShowConfig(true)
    setGenerated(false)
  }

  const template = ATLAS_TEMPLATES.find(t => t.id === selectedTemplate)
  const currentZone = ZONES.find(z => z.commune === commune) || ZONES[0]
  const totalMarkers = activeLayers.reduce((sum, id) => sum + (MOCK_MARKERS[id]?.length || 0), 0)

  const generatedStats = [
    ...(activeLayers.includes('ecoles') ? [{ label: 'Écoles', value: currentZone.ecoles, icon: <LuGraduationCap className="w-4 h-4" />, color: 'text-blue-700', bg: 'bg-blue-50' }] : []),
    ...(activeLayers.includes('sante') ? [{ label: 'Centres de santé', value: currentZone.sante, icon: <LuHeartPulse className="w-4 h-4" />, color: 'text-red-600', bg: 'bg-red-50' }] : []),
    ...(activeLayers.includes('eau') ? [{ label: "Points d'eau", value: currentZone.eau, icon: <LuDroplet className="w-4 h-4" />, color: 'text-cyan-600', bg: 'bg-cyan-50' }] : []),
    ...(activeLayers.includes('eglises') ? [{ label: 'Paroisses', value: MOCK_MARKERS.eglises.length, icon: <LuChurch className="w-4 h-4" />, color: 'text-purple-700', bg: 'bg-purple-50' }] : []),
    { label: 'Population', value: currentZone.population.toLocaleString(), icon: <LuUsers className="w-4 h-4" />, color: 'text-indigo-700', bg: 'bg-indigo-50' },
    { label: 'Superficie (km²)', value: currentZone.superficie, icon: <LuMapPin className="w-4 h-4" />, color: 'text-green-700', bg: 'bg-green-50' },
  ]

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-6 pb-24 lg:pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <LuBookOpen className="w-5 h-5 text-green-700" />
              Atlas & Modèles
            </h1>
            <p className="text-sm text-slate-500 mt-1">Choisissez un modèle, configurez vos couches, et générez votre atlas</p>
          </div>
          <button
            onClick={() => startConfig('2')}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
          >
            <LuPlus className="w-4 h-4" />
            Créer un atlas
          </button>
        </div>

        {/* Templates Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ATLAS_TEMPLATES.map(tpl => (
            <div key={tpl.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
              <div className="relative overflow-hidden">
                <img src={tpl.image} alt={tpl.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="bg-white/90 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">{tpl.category}</span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">{tpl.pages} pages</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900">{tpl.title}</h3>
                <p className="text-sm text-slate-500 mt-0.5 mb-4">{tpl.subtitle}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => startConfig(tpl.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-green-700 hover:bg-green-600 text-white text-sm py-2 rounded-xl font-medium transition-colors"
                  >
                    <LuFilePlus className="w-3.5 h-3.5" />
                    Configurer
                  </button>
                  <button
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
                    title="Aperçu"
                  >
                    <LuEye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Custom slot */}
          <button
            onClick={() => startConfig('2')}
            className="border-2 border-dashed border-slate-300 rounded-2xl hover:border-green-400 hover:bg-green-50/50 transition-all flex flex-col items-center justify-center p-8 gap-3 group"
            style={{ minHeight: 280 }}
          >
            <div className="w-12 h-12 bg-slate-100 group-hover:bg-green-100 rounded-full flex items-center justify-center transition-colors">
              <LuPlus className="w-6 h-6 text-slate-400 group-hover:text-green-600 transition-colors" />
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-slate-600 group-hover:text-green-700 transition-colors">Créer un modèle</div>
              <div className="text-xs text-slate-400 mt-0.5">personnalisé</div>
            </div>
          </button>
        </div>


      </div>

      {/* Detail Modal (quick preview) */}
      {selectedTemplate && !showConfig && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" onClick={() => setSelectedTemplate(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
            <img src={template?.image} alt={template?.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">{template?.category}</span>
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{template?.pages} pages</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">{template?.title}</h2>
              <p className="text-sm text-slate-500 mt-1">{template?.subtitle}</p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2"><LuMap className="w-4 h-4 text-green-600" /> Couverture: Toute la RDC</div>
                <div className="flex items-center gap-2"><LuLayers className="w-4 h-4 text-blue-600" /> Couches: Limites, infrastructures, thématiques</div>
                <div className="flex items-center gap-2"><LuSparkles className="w-4 h-4 text-purple-600" /> Mise en page professionnelle automatique</div>
              </div>
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => { setShowConfig(true); setGenerated(false) }}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  <LuFilePlus className="w-4 h-4" />
                  Configurer cet atlas
                </button>
                <button onClick={() => setSelectedTemplate(null)} className="px-5 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Configuration Panel with Live Map */}
      {showConfig && (
        <div className="fixed inset-0 z-[2000] flex flex-col bg-slate-50">
          {/* Top bar */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowConfig(false)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
                <LuArrowLeft className="w-4 h-4" />
                Retour
              </button>
              <div className="h-5 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <LuBookOpen className="w-4 h-4 text-green-700" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{template?.title || 'Atlas personnalisé'}</div>
                  <div className="text-xs text-slate-500">{template?.subtitle || 'Configuration manuelle'}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                <LuMapPin className="w-3.5 h-3.5 text-green-600" />
                {commune} · {secteur}
              </span>
              <button
                onClick={() => setShowConfig(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LuX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Split content */}
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
            {/* Left: Config panel */}
            <div className="lg:w-96 flex-shrink-0 bg-white border-r border-slate-200 overflow-y-auto p-5 space-y-6 order-2 lg:order-1 max-h-[40vh] lg:max-h-none">
              {/* Zone */}
              <div>
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <LuMapPin className="w-3.5 h-3.5 text-green-700" />
                  Zone géographique
                </h3>
                <div className="space-y-2.5">
                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1">Province</label>
                    <select value={province} onChange={e => { setProvince(e.target.value); setCommune(COMMUNES_BY_PROVINCE[e.target.value]?.[0] || '') }} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-green-500 outline-none">
                      {PROVINCES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1">Commune</label>
                    <select value={commune} onChange={e => { setCommune(e.target.value); setSecteur(SECTEURS_BY_COMMUNE[e.target.value]?.[0] || '') }} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-green-500 outline-none">
                      {communes.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1">Secteur</label>
                    <select value={secteur} onChange={e => setSecteur(e.target.value)} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-green-500 outline-none">
                      {secteurs.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Themes */}
              <div>
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <LuFilter className="w-3.5 h-3.5 text-green-700" />
                  Thèmes
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => toggleTheme(theme.id)}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 text-xs font-medium transition-all ${
                        activeThemes.includes(theme.id)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className={activeThemes.includes(theme.id) ? 'text-green-700' : 'text-slate-500'}>
                        {THEME_ICONS[theme.id]}
                      </span>
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layers */}
              <div>
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <LuLayers className="w-3.5 h-3.5 text-green-700" />
                  Couches de la carte
                </h3>
                <div className="space-y-1.5">
                  {ELEMENT_OPTIONS.map(el => {
                    const meta = LAYER_META[el.id]
                    const active = activeLayers.includes(el.id)
                    return (
                      <button
                        key={el.id}
                        onClick={() => toggleLayer(el.id)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all ${
                          active ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${active ? 'bg-green-600' : 'bg-slate-200'}`}>
                          {active && <LuCheck className="w-3 h-3 text-white" />}
                        </div>
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: meta?.color || '#666' }} />
                        <span className="text-sm text-slate-700 flex-1 text-left">{el.label}</span>
                        <span className="text-xs text-slate-400">{MOCK_MARKERS[el.id]?.length || 0}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Base map */}
              <div>
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <LuMap className="w-3.5 h-3.5 text-green-700" />
                  Fond de carte
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setBaseMap('osm')}
                    className={`text-sm py-2.5 rounded-xl border-2 font-medium transition-all ${baseMap === 'osm' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setBaseMap('satellite')}
                    className={`text-sm py-2.5 rounded-xl border-2 font-medium transition-all ${baseMap === 'satellite' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                  >
                    Satellite
                  </button>
                </div>
              </div>

              {/* Format */}
              <div>
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <LuFileText className="w-3.5 h-3.5 text-green-700" />
                  Format de sortie
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {FORMATS.map(f => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`text-xs py-2.5 rounded-lg border-2 font-medium transition-all ${format === f ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Live Map Preview */}
            <div className="flex-1 flex flex-col min-h-0 order-1 lg:order-2">
              {/* Preview header */}
              <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <LuEye className="w-4 h-4 text-green-700" />
                  <span className="text-sm font-semibold text-slate-900">Aperçu de la carte</span>
                  <span className="text-xs text-slate-400 hidden sm:inline">— {activeLayers.length} couche(s) active(s)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 hidden sm:inline">{baseMap === 'satellite' ? 'Satellite' : 'Standard'}</span>
                  <div className={`w-2 h-2 rounded-full ${generating ? 'bg-yellow-400 animate-pulse' : generated ? 'bg-green-500' : 'bg-blue-400'}`} />
                </div>
              </div>

              {/* Map */}
              <div className="flex-1 relative min-h-[300px] lg:min-h-0">
                {generated ? (
                  <div className="absolute inset-0 overflow-y-auto bg-slate-100 p-4 sm:p-6">
                    <div className="max-w-lg mx-auto">
                      {/* Success header */}
                      <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                          <LuCircleCheck className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="text-lg font-bold text-slate-900 mb-1">Atlas généré avec succès !</div>
                        <div className="text-sm text-slate-500">Atlas_{commune}_{template?.category || 'Perso'}.pdf</div>
                        <div className="text-xs text-slate-400">{format} · {template?.pages || 32} pages · 8.9 MB</div>
                      </div>

                      {/* Contextual stats */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4">
                        <div className="flex items-center gap-2 mb-4">
                          <LuMapPin className="w-4 h-4 text-green-700" />
                          <h3 className="text-sm font-semibold text-slate-900">Données de {commune} — {secteur}</h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {generatedStats.map(stat => (
                            <div key={stat.label} className={`${stat.bg} rounded-xl p-3 border border-white/60`}>
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className={stat.color}>{stat.icon}</span>
                                <span className="text-xs text-slate-500">{stat.label}</span>
                              </div>
                              <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1.5"><LuLayers className="w-3.5 h-3.5" /> {activeLayers.length} couche(s) · {totalMarkers} marqueur(s)</span>
                          <span className="flex items-center gap-1.5"><LuFilter className="w-3.5 h-3.5" /> {activeThemes.length} thème(s)</span>
                        </div>
                      </div>

                      {/* Active layers summary */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4">
                        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <LuLayers className="w-4 h-4 text-green-700" />
                          Couches incluses
                        </h3>
                        <div className="space-y-2">
                          {activeLayers.map(id => {
                            const el = ELEMENT_OPTIONS.find(e => e.id === id)
                            const meta = LAYER_META[id]
                            return (
                              <div key={id} className="flex items-center gap-3 text-sm">
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: meta?.color || '#666' }} />
                                <span className="text-slate-700 flex-1">{el?.label || id}</span>
                                <span className="text-slate-400 font-medium">{MOCK_MARKERS[id]?.length || 0} entités</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 text-white text-sm px-5 py-3 rounded-xl font-medium transition-colors">
                          <LuDownload className="w-4 h-4" />
                          Télécharger
                        </button>
                        <button
                          onClick={() => onNavigate('mes-exports')}
                          className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm px-5 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                        >
                          Voir mes exports
                          <LuChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <MapContainer
                      center={[-4.302, 15.310]}
                      zoom={14}
                      className="w-full h-full"
                      zoomControl={false}
                    >
                      <MapRecenter lat={-4.302} lng={15.310} zoom={14} />
                      <TileLayer url={tileUrl} />
                      <ZoomControl position="bottomright" />
                      <Polygon
                        positions={KINTAMBO_BOUNDS}
                        pathOptions={{ color: '#15803d', fillColor: '#15803d', fillOpacity: 0.08, weight: 2, dashArray: '6 4' }}
                      />
                      {activeLayers.map(layerId => {
                        const markers = MOCK_MARKERS[layerId]
                        if (!markers) return null
                        const meta = LAYER_META[layerId] || { color: '#666', emoji: '●' }
                        return markers.map((m, i) => (
                          <Marker key={`${layerId}-${i}`} position={[m.lat, m.lng]} icon={createColoredIcon(meta.color, meta.emoji)}>
                            <Popup>
                              <div className="text-sm font-medium">{m.label}</div>
                              <div className="text-xs text-slate-500 capitalize">{layerId}</div>
                            </Popup>
                          </Marker>
                        ))
                      })}
                    </MapContainer>

                    {/* Floating legend */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur rounded-xl shadow-lg border border-slate-200 p-3 z-[1000]">
                      <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Légende</div>
                      <div className="space-y-1.5">
                        {activeLayers.map(id => {
                          const el = ELEMENT_OPTIONS.find(e => e.id === id)
                          const meta = LAYER_META[id]
                          return (
                            <div key={id} className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: meta?.color || '#666' }} />
                              <span className="text-xs text-slate-600">{el?.label || id}</span>
                            </div>
                          )
                        })}
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                          <div className="w-2.5 h-2.5 rounded-sm border border-green-600 bg-green-100" />
                          <span className="text-xs text-slate-600">{commune}</span>
                        </div>
                      </div>
                    </div>

                    {/* Zone badge */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-full px-3 py-1.5 shadow border border-slate-200 z-[1000] flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-medium text-slate-700">{commune} — {secteur}</span>
                    </div>

                    {/* Active themes chips */}
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5 z-[1000] max-w-[60%]">
                      {activeThemes.map(id => {
                        const theme = THEMES.find(t => t.id === id)
                        if (!theme) return null
                        return (
                          <span key={id} className="bg-white/95 backdrop-blur text-xs font-medium px-2.5 py-1 rounded-full shadow border border-slate-200 flex items-center gap-1 text-slate-700">
                            {THEME_ICONS[theme.id]}
                            {theme.label}
                          </span>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Generate bar */}
              {!generated && (
                <div className="bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-between flex-shrink-0 gap-3">
                  <div className="text-xs text-slate-500 hidden sm:block">
                    {activeLayers.length} couche(s) · {activeThemes.length} thème(s) · {format}
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={generating || activeLayers.length === 0}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-green-200"
                  >
                    {generating ? (
                      <>
                        <LuLoader className="w-5 h-5 animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <LuFilePlus className="w-5 h-5" />
                        Générer l'atlas
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
