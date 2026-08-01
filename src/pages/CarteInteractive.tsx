'use client'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { MapContainer, TileLayer, Polygon, Marker, Popup, ZoomControl, useMap, Polyline, Circle, Tooltip as LTooltip } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MapLayer, ViewId } from '../types'
import {
  ZONES, PROVINCES, COMMUNES_BY_PROVINCE, SECTEURS_BY_COMMUNE,
  DEFAULT_LAYERS, THEMES, KINTAMBO_BOUNDS, MOCK_MARKERS,
  PROVINCE_BOUNDS, COMMUNE_BOUNDS, SECTEUR_BOUNDS,
  HEALTH_ZONES, HEALTH_AREAS, EDUCATION_ZONES,
} from '../data/mockData'
import type { ThematicZone } from '../data/mockData'
import {
  LuSearch, LuLocate, LuGraduationCap, LuHeartPulse, LuDroplet, LuChurch,
  LuBuilding2, LuLeaf, LuUsers, LuShield, LuLayers,
  LuPlus, LuCompass, LuRotateCw, LuMaximize, LuMinus,
  LuCrosshair, LuRuler, LuPenLine, LuPrinter, LuDownload,
  LuImage, LuFileText, LuEllipsis, LuEye, LuX, LuMapPin, LuFilter, LuMap,
  LuCheck, LuTrash2, LuChevronRight, LuLock, LuInfo,
} from 'react-icons/lu'
import { toaster } from '../components/ui/toaster'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function createColoredIcon(color: string, emoji: string, active = false) {
  const size = active ? 32 : 24
  const fontSize = active ? 15 : 11
  return L.divIcon({
    html: `<div style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);font-size:${fontSize}px;${active ? 'outline:3px solid #15803d;' : ''}">${emoji}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

const LAYER_META: Record<string, { color: string; emoji: string; label: string }> = {
  ecoles: { color: '#1d4ed8', emoji: '🎓', label: 'Écoles' },
  sante: { color: '#dc2626', emoji: '🏥', label: 'Centres de santé' },
  eau: { color: '#0891b2', emoji: '💧', label: "Points d'eau" },
  eglises: { color: '#7c3aed', emoji: '⛪', label: 'Paroisses' },
}

const THEME_ICONS_MAP: Record<string, React.ReactNode> = {
  education: <LuGraduationCap className="w-5 h-5" />,
  sante: <LuHeartPulse className="w-5 h-5" />,
  eau: <LuDroplet className="w-5 h-5" />,
  religion: <LuChurch className="w-5 h-5" />,
  infrastructure: <LuBuilding2 className="w-5 h-5" />,
  environnement: <LuLeaf className="w-5 h-5" />,
  population: <LuUsers className="w-5 h-5" />,
  securite: <LuShield className="w-5 h-5" />,
}

const MAP_CENTER: [number, number] = [-4.302, 15.310]

// Thematic sub-categories
const THEMATIC_CATEGORIES = {
  sante: {
    label: 'Santé',
    icon: <LuHeartPulse className="w-4 h-4" />,
    color: '#dc2626',
    subLevels: [
      { id: 'zone-sante', label: 'Zones de santé', source: HEALTH_ZONES },
      { id: 'aire-sante', label: 'Aires de santé', source: HEALTH_AREAS },
    ],
  },
  education: {
    label: 'Éducation',
    icon: <LuGraduationCap className="w-4 h-4" />,
    color: '#1d4ed8',
    subLevels: [
      { id: 'prov-education', label: 'Provinces éducationnelles', source: EDUCATION_ZONES },
    ],
  },
} as const

// Tools that are NOT functional yet → grayed out
const INACTIVE_TOOLS = new Set(['annotate'])

function haversine(a: [number, number], b: [number, number]): number {
  const R = 6371000
  const dLat = (b[0] - a[0]) * Math.PI / 180
  const dLng = (b[1] - a[1]) * Math.PI / 180
  const lat1 = a[0] * Math.PI / 180
  const lat2 = b[0] * Math.PI / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function MapController({
  mapRef, action, center, measureMode, onMapClick,
}: {
  mapRef: React.MutableRefObject<L.Map | null>
  action: string
  center: [number, number]
  measureMode: boolean
  onMapClick: (lat: number, lng: number) => void
}) {
  const map = useMap()
  mapRef.current = map

  useEffect(() => {
    if (action === 'zoom-in') map.zoomIn()
    if (action === 'zoom-out') map.zoomOut()
    if (action === 'center') map.setView(center, 14)
    if (action === 'fullscreen') {
      if (!document.fullscreenElement) {
        map.getContainer().requestFullscreen?.()
      } else {
        document.exitFullscreen?.()
      }
    }
  }, [action, map, center])

  useEffect(() => {
    if (measureMode) {
      const handler = (e: L.LeafletMouseEvent) => onMapClick(e.latlng.lat, e.latlng.lng)
      map.on('click', handler)
      return () => { map.off('click', handler) }
    }
  }, [measureMode, map, onMapClick])

  return null
}

function SectionTitle({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-1.5 mb-3">
      <span className="text-green-700">{icon}</span>
      {title}
    </h3>
  )
}

interface CarteInteractiveProps {
  onNavigate: (view: ViewId) => void
}

export function CarteInteractive({ onNavigate }: CarteInteractiveProps) {
  // Delimitation mode
  const [delimitation, setDelimitation] = useState<'administrative' | 'thematic'>('administrative')

  // Admin selections
  const [province, setProvince] = useState('Kinshasa')
  const [commune, setCommune] = useState('Kintambo')
  const [secteur, setSecteur] = useState('Joli-Parc')
  const [adminLevel, setAdminLevel] = useState<'province' | 'commune' | 'secteur'>('commune')

  // Thematic selections
  const [thematicDomain, setThematicDomain] = useState<keyof typeof THEMATIC_CATEGORIES>('sante')
  const [thematicLevels, setThematicLevels] = useState<Record<string, boolean>>({
    'zone-sante': true,
    'aire-sante': true,
    'prov-education': false,
  })

  // Map state
  const [layers, setLayers] = useState<MapLayer[]>(DEFAULT_LAYERS)
  const [activeThemes, setActiveThemes] = useState<string[]>(['education', 'sante', 'eau'])
  const [baseMap, setBaseMap] = useState<'osm' | 'satellite'>('osm')
  const [mapStyle, setMapStyle] = useState('Standard')
  const [showLegend, setShowLegend] = useState(true)
  const [leftPanelTab, setLeftPanelTab] = useState<'delimitation' | 'themes' | 'couches'>('delimitation')
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)
  const [mobilePanelTab, setMobilePanelTab] = useState<'delimitation' | 'themes' | 'couches'>('delimitation')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTool, setActiveTool] = useState<string>('select')
  const [mapAction, setMapAction] = useState<string>('')
  const [selectedMarker, setSelectedMarker] = useState<{ label: string; type: string; lat: number; lng: number } | null>(null)
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([])
  const [exportFormat, setExportFormat] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const mapRef = useRef<L.Map | null>(null)

  const currentZone = ZONES.find(z => z.commune === commune) || ZONES[0]
  const communes = COMMUNES_BY_PROVINCE[province] || []
  const secteurs = SECTEURS_BY_COMMUNE[commune] || []

  const toggleLayer = useCallback((id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, checked: !l.checked } : l))
  }, [])

  const toggleTheme = useCallback((id: string) => {
    setActiveThemes(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  }, [])

  const toggleThematicLevel = useCallback((id: string) => {
    setThematicLevels(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const triggerMapAction = useCallback((action: string) => {
    setMapAction('')
    requestAnimationFrame(() => setMapAction(action))
  }, [])

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setMeasurePoints(prev => [...prev, [lat, lng]])
  }, [])

  const tileUrl = baseMap === 'satellite'
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : mapStyle === 'Dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : mapStyle === 'Terrain'
    ? 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  const checkedLayerIds = layers.filter(l => l.checked).map(l => l.id)

  const searchLower = searchQuery.toLowerCase()
  const allVisibleMarkers = checkedLayerIds.flatMap(layerId => {
    const markers = MOCK_MARKERS[layerId]
    if (!markers) return []
    const meta = LAYER_META[layerId] || { color: '#666', emoji: '●', label: layerId }
    return markers
      .filter(m => !searchQuery || m.label.toLowerCase().includes(searchLower))
      .map((m, i) => ({ ...m, layerId, color: meta.color, emoji: meta.emoji, label: m.label, index: i }))
  })

  const measureDistance = measurePoints.length >= 2
    ? measurePoints.reduce((sum, p, i) => i === 0 ? 0 : sum + haversine(measurePoints[i - 1], p), 0)
    : 0
  const measureDisplay = measureDistance >= 1000
    ? `${(measureDistance / 1000).toFixed(2)} km`
    : `${Math.round(measureDistance)} m`

  // Active thematic zones based on selections
  const activeThematicZones: ThematicZone[] = useMemo(() => {
    if (delimitation !== 'thematic') return []
    const domain = THEMATIC_CATEGORIES[thematicDomain]
    if (!domain) return []
    return domain.subLevels.flatMap(sl => thematicLevels[sl.id] ? sl.source : [])
  }, [delimitation, thematicDomain, thematicLevels])

  // Active admin polygons
  const activeAdminBounds = useMemo(() => {
    if (delimitation !== 'administrative') return null
    if (adminLevel === 'province') return PROVINCE_BOUNDS[province]
    if (adminLevel === 'secteur') return SECTEUR_BOUNDS[secteur] || COMMUNE_BOUNDS[commune]
    return COMMUNE_BOUNDS[commune]
  }, [delimitation, adminLevel, province, commune, secteur])

  const handleExport = (fmt: string) => {
    setExportFormat(fmt)
    setExporting(true)
    setTimeout(() => {
      setExporting(false)
      setExportFormat(null)
      toaster.create({
        title: 'Export réussi',
        description: `Carte_${commune}_${secteur}.${fmt.toLowerCase()} téléchargé`,
        type: 'success',
        closable: true,
      })
    }, 2000)
  }

  const tools = [
    { id: 'select', icon: <LuCrosshair className="w-3.5 h-3.5" />, label: 'Sélection' },
    { id: 'measure', icon: <LuRuler className="w-3.5 h-3.5" />, label: 'Mesurer' },
    { id: 'annotate', icon: <LuPenLine className="w-3.5 h-3.5" />, label: 'Annoter' },
    { id: 'print', icon: <LuPrinter className="w-3.5 h-3.5" />, label: 'Imprimer' },
  ]

  const handleToolClick = (toolId: string) => {
    if (INACTIVE_TOOLS.has(toolId)) {
      toaster.create({
        title: 'Fonctionnalité à venir',
        description: "L'annotation sera disponible prochainement",
        type: 'info',
        closable: true,
      })
      return
    }
    setActiveTool(toolId)
    if (toolId === 'measure') {
      setMeasurePoints([])
    } else if (toolId === 'print') {
      triggerMapAction('fullscreen')
      toaster.create({ title: 'Impression', description: 'Utilisez Ctrl+P pour imprimer la carte', type: 'info', closable: true })
    } else if (toolId === 'select') {
      setMeasurePoints([])
    }
  }

  // ─── Delimitation Panel Content ──────────────────────────────────────────

  const delimitationPanel = (
    <>
      {/* Mode switcher */}
      <div>
        <SectionTitle title="Type de délimitation" icon={<LuMapPin className="w-3.5 h-3.5" />} />
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setDelimitation('administrative')}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-medium transition-all ${
              delimitation === 'administrative'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <LuBuilding2 className="w-5 h-5" />
            Administrative
          </button>
          <button
            onClick={() => setDelimitation('thematic')}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-medium transition-all ${
              delimitation === 'thematic'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <LuLayers className="w-5 h-5" />
            Thématique
          </button>
        </div>
      </div>

      {/* Administrative mode */}
      {delimitation === 'administrative' && (
        <div className="space-y-4">
          <div>
            <SectionTitle title="Niveau administratif" icon={<LuFilter className="w-3.5 h-3.5" />} />
            <div className="grid grid-cols-3 gap-1.5">
              {([
                { id: 'province', label: 'Province' },
                { id: 'commune', label: 'Commune' },
                { id: 'secteur', label: 'Secteur' },
              ] as const).map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => setAdminLevel(lvl.id)}
                  className={`text-xs font-medium py-2 rounded-lg border-2 transition-all ${
                    adminLevel === lvl.id
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle title="Sélection géographique" icon={<LuMap className="w-3.5 h-3.5" />} />
            <div className="space-y-2">
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">Province</label>
                <select
                  value={province}
                  onChange={e => { setProvince(e.target.value); setCommune(COMMUNES_BY_PROVINCE[e.target.value]?.[0] || '') }}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-green-500 outline-none"
                >
                  {PROVINCES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">Territoire/Commune</label>
                <select
                  value={commune}
                  onChange={e => { setCommune(e.target.value); setSecteur(SECTEURS_BY_COMMUNE[e.target.value]?.[0] || '') }}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-green-500 outline-none"
                >
                  {communes.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">Secteur/Quartier</label>
                <select
                  value={secteur}
                  onChange={e => setSecteur(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-green-500 outline-none"
                >
                  {secteurs.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thematic mode */}
      {delimitation === 'thematic' && (
        <div className="space-y-4">
          <div>
            <SectionTitle title="Domaine thématique" icon={<LuFilter className="w-3.5 h-3.5" />} />
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(THEMATIC_CATEGORIES) as (keyof typeof THEMATIC_CATEGORIES)[]).map(key => {
                const cat = THEMATIC_CATEGORIES[key]
                return (
                  <button
                    key={key}
                    onClick={() => setThematicDomain(key)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-medium transition-all ${
                      thematicDomain === key
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span style={{ color: thematicDomain === key ? cat.color : undefined }}>{cat.icon}</span>
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <SectionTitle title="Niveaux de délimitation" icon={<LuLayers className="w-3.5 h-3.5" />} />
            <div className="space-y-1.5">
              {THEMATIC_CATEGORIES[thematicDomain].subLevels.map(sl => (
                <label
                  key={sl.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-slate-100"
                >
                  <input
                    type="checkbox"
                    checked={thematicLevels[sl.id] || false}
                    onChange={() => toggleThematicLevel(sl.id)}
                    className="rounded accent-green-600 w-4 h-4"
                  />
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: THEMATIC_CATEGORIES[thematicDomain].color }} />
                  <span className="text-sm text-slate-700 flex-1">{sl.label}</span>
                  <span className="text-xs text-slate-400">{sl.source.length}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <LuInfo className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                Les délimitations thématiques sont superposées aux limites administratives. Les zones de santé et aires de santé couvrent le secteur sanitaire, tandis que les provinces éducationnelles suivent le découpage du Ministère de l'Éducation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search (shared) */}
      <div>
        <SectionTitle title="Recherche" icon={<LuSearch className="w-3.5 h-3.5" />} />
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un lieu..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 pl-8 pr-8 bg-white focus:ring-2 focus:ring-green-500 outline-none"
          />
          <LuSearch className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600">
              <LuX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {searchQuery && allVisibleMarkers.length > 0 && (
          <div className="text-xs text-green-600 font-medium bg-green-50 rounded-lg px-2 py-1.5 mt-2">
            {allVisibleMarkers.length} résultat(s) trouvé(s)
          </div>
        )}
      </div>

      {/* Map controls */}
      <div>
        <SectionTitle title="Contrôles de la carte" icon={<LuCompass className="w-3.5 h-3.5" />} />
        <div className="space-y-2">
          <div>
            <label className="text-xs text-slate-600 font-medium block mb-1">Fond de carte</label>
            <select
              value={baseMap}
              onChange={e => setBaseMap(e.target.value as 'osm' | 'satellite')}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="osm">OpenStreetMap</option>
              <option value="satellite">Satellite</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-600 font-medium block mb-1">Style de carte</label>
            <select
              value={mapStyle}
              onChange={e => setMapStyle(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {['Standard', 'Dark', 'Terrain'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button
            onClick={() => { setBaseMap('osm'); setMapStyle('Standard'); triggerMapAction('center') }}
            className="w-full flex items-center justify-center gap-2 text-sm bg-blue-700 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-medium transition-colors"
          >
            <LuRotateCw className="w-4 h-4" />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Export */}
      <div>
        <SectionTitle title="Exporter la carte" icon={<LuDownload className="w-3.5 h-3.5" />} />
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { fmt: 'PDF', icon: <LuFileText className="w-3 h-3" /> },
            { fmt: 'PNG', icon: <LuImage className="w-3 h-3" /> },
            { fmt: 'JPG', icon: <LuImage className="w-3 h-3" /> },
          ].map(({ fmt, icon }) => (
            <button
              key={fmt}
              onClick={() => handleExport(fmt)}
              disabled={exporting}
              className={`flex items-center justify-center gap-1 text-xs font-medium border px-2 py-2 rounded-lg transition-colors ${
                exportFormat === fmt
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-slate-200 hover:border-green-500 hover:text-green-700 text-slate-600'
              } disabled:opacity-50`}
            >
              {exporting && exportFormat === fmt
                ? <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                : icon}
              {fmt}
            </button>
          ))}
        </div>
        {/* Grayed out "More options" */}
        <button
          disabled
          className="mt-1.5 w-full flex items-center justify-center gap-1.5 text-xs text-slate-400 border border-slate-200 rounded-lg py-1.5 cursor-not-allowed bg-slate-50"
        >
          <LuEllipsis className="w-3.5 h-3.5" />
          Plus d'options
          <LuLock className="w-3 h-3 ml-1" />
        </button>
      </div>
    </>
  )

  const themesPanel = (
    <div>
      <SectionTitle title="Sélection du thème" icon={<LuFilter className="w-3.5 h-3.5" />} />
      <div className="grid grid-cols-2 gap-2">
        {THEMES.map(theme => (
          <button
            key={theme.id}
            onClick={() => toggleTheme(theme.id)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-medium transition-all ${
              activeThemes.includes(theme.id)
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <span className={activeThemes.includes(theme.id) ? 'text-green-700' : 'text-slate-600'}>
              {THEME_ICONS_MAP[theme.id]}
            </span>
            {theme.label}
          </button>
        ))}
      </div>
    </div>
  )

  const couchesPanel = (
    <div>
      <SectionTitle title="Gestionnaire de couches" icon={<LuLayers className="w-3.5 h-3.5" />} />
      <div className="space-y-1">
        {layers.map(layer => (
          <label
            key={layer.id}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={layer.checked}
              onChange={() => toggleLayer(layer.id)}
              className="rounded accent-green-600 w-4 h-4"
            />
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: layer.color }} />
            <span className="text-sm text-slate-700 flex-1">{layer.label}</span>
            {MOCK_MARKERS[layer.id] && (
              <span className="text-xs text-slate-400">{MOCK_MARKERS[layer.id].length}</span>
            )}
            <LuEye className={`w-3.5 h-3.5 ${layer.checked ? 'text-green-600' : 'text-slate-300'}`} />
          </label>
        ))}
      </div>
      {/* Grayed out "Add layer" */}
      <button
        disabled
        className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-slate-400 border-2 border-dashed border-slate-200 rounded-lg py-2 cursor-not-allowed bg-slate-50"
      >
        <LuPlus className="w-4 h-4" />
        Ajouter un élément
        <LuLock className="w-3 h-3 ml-1" />
      </button>
    </div>
  )

  const activePanel = leftPanelTab === 'delimitation' ? delimitationPanel : leftPanelTab === 'themes' ? themesPanel : couchesPanel
  const activeMobilePanel = mobilePanelTab === 'delimitation' ? delimitationPanel : mobilePanelTab === 'themes' ? themesPanel : couchesPanel

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-0 overflow-hidden bg-slate-50">
      {/* Desktop Left Panel */}
      <div className="hidden lg:flex lg:w-72 xl:w-80 flex-shrink-0 flex-col bg-white border-r border-slate-200 overflow-y-auto">
        <div className="flex border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
          {(['delimitation', 'themes', 'couches'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setLeftPanelTab(tab)}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                leftPanelTab === tab
                  ? 'text-green-700 border-b-2 border-green-700 bg-white'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'delimitation' ? 'Délimitation' : tab === 'themes' ? 'Thèmes' : 'Couches'}
            </button>
          ))}
        </div>
        <div className="p-4 space-y-5">
          {activePanel}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-white border-b border-slate-200 flex-shrink-0 gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {tools.map(tool => {
              const inactive = INACTIVE_TOOLS.has(tool.id)
              return (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool.id)}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                    inactive
                      ? 'text-slate-400 border-slate-200 bg-slate-50 cursor-not-allowed'
                      : activeTool === tool.id
                        ? 'bg-green-700 text-white border-green-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {tool.icon}
                  <span className="hidden sm:inline">{tool.label}</span>
                  {inactive && <LuLock className="w-3 h-3 ml-0.5" />}
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobilePanelOpen(true)}
              className="lg:hidden flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <LuFilter className="w-3.5 h-3.5" />
              Filtres
            </button>
            <button
              onClick={() => onNavigate('generer-carte')}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white text-sm px-3 sm:px-4 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              <LuDownload className="w-4 h-4" />
              <span className="hidden sm:inline">Générer l'atlas</span>
              <span className="sm:hidden">Atlas</span>
            </button>
          </div>
        </div>

        {/* Measure toolbar */}
        {activeTool === 'measure' && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3 text-xs text-blue-700">
              <LuRuler className="w-4 h-4" />
              <span className="font-medium">
                {measurePoints.length === 0
                  ? 'Cliquez sur la carte pour ajouter des points'
                  : `${measurePoints.length} point(s) · Distance: ${measureDisplay}`}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setMeasurePoints([])}
                className="flex items-center gap-1 text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
              >
                <LuTrash2 className="w-3.5 h-3.5" />
                Effacer
              </button>
              <button
                onClick={() => setActiveTool('select')}
                className="flex items-center gap-1 text-xs text-slate-600 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors"
              >
                <LuCheck className="w-3.5 h-3.5" />
                Terminer
              </button>
            </div>
          </div>
        )}

        {/* Mode indicator bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-1.5 flex items-center gap-3 flex-shrink-0 text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            {delimitation === 'administrative' ? <LuBuilding2 className="w-3.5 h-3.5 text-green-700" /> : <LuLayers className="w-3.5 h-3.5 text-green-700" />}
            {delimitation === 'administrative' ? 'Délimitation administrative' : 'Délimitation thématique'}
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500">
            {delimitation === 'administrative'
              ? adminLevel === 'province' ? province
                : adminLevel === 'commune' ? `${commune} (${province})`
                : `${secteur} (${commune})`
              : `${THEMATIC_CATEGORIES[thematicDomain].label} — ${Object.entries(thematicLevels).filter(([,v]) => v).length} niveau(x) actif(s)`
            }
          </span>
        </div>

        {/* Map */}
        <div className="flex-1 relative min-h-0">
          <MapContainer
            center={MAP_CENTER}
            zoom={14}
            className="w-full h-full"
            zoomControl={false}
          >
            <MapController
              mapRef={mapRef}
              action={mapAction}
              center={MAP_CENTER}
              measureMode={activeTool === 'measure'}
              onMapClick={handleMapClick}
            />
            <TileLayer key={tileUrl} url={tileUrl} />
            <ZoomControl position="bottomright" />

            {/* Administrative boundaries */}
            {delimitation === 'administrative' && activeAdminBounds && (
              <Polygon
                positions={activeAdminBounds}
                pathOptions={{
                  color: '#15803d',
                  fillColor: '#15803d',
                  fillOpacity: 0.08,
                  weight: 2.5,
                  dashArray: '6 4',
                }}
              >
                <LTooltip sticky>
                  <span className="text-xs font-medium">
                    {adminLevel === 'province' ? province
                      : adminLevel === 'commune' ? commune
                      : secteur}
                  </span>
                </LTooltip>
              </Polygon>
            )}

            {/* Thematic boundaries */}
            {delimitation === 'thematic' && activeThematicZones.map(zone => (
              <Polygon
                key={zone.id}
                positions={zone.bounds}
                pathOptions={{
                  color: zone.color,
                  fillColor: zone.color,
                  fillOpacity: zone.fillOpacity,
                  weight: 2,
                  dashArray: zone.type === 'zone-sante' ? '8 4' : undefined,
                }}
              >
                <LTooltip sticky>
                  <div className="text-xs">
                    <div className="font-medium">{zone.name}</div>
                    <div className="text-slate-500 capitalize">{zone.type.replace(/-/g, ' ')}</div>
                  </div>
                </LTooltip>
              </Polygon>
            ))}

            {/* Always show Kintambo reference bounds faintly */}
            {delimitation === 'thematic' && (
              <Polygon
                positions={KINTAMBO_BOUNDS}
                pathOptions={{ color: '#94a3b8', fillColor: '#94a3b8', fillOpacity: 0.03, weight: 1 }}
              />
            )}

            {/* Markers */}
            {allVisibleMarkers.map(m => (
              <Marker
                key={`${m.layerId}-${m.index}`}
                position={[m.lat, m.lng]}
                icon={createColoredIcon(m.color, m.emoji, selectedMarker?.label === m.label)}
                eventHandlers={{
                  click: () => setSelectedMarker({ label: m.label, type: m.layerId, lat: m.lat, lng: m.lng }),
                }}
              >
                <Popup>
                  <div className="text-sm font-medium">{m.label}</div>
                  <div className="text-xs text-slate-500 capitalize">{LAYER_META[m.layerId]?.label || m.layerId}</div>
                </Popup>
              </Marker>
            ))}

            {/* Measurement rendering */}
            {measurePoints.length >= 2 && (
              <Polyline
                positions={measurePoints}
                pathOptions={{ color: '#2563eb', weight: 3, dashArray: '8 4' }}
              />
            )}
            {measurePoints.map((p, i) => (
              <Circle key={i} center={p} radius={20} pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.8 }} />
            ))}
          </MapContainer>

          {/* Floating map controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-[1000]">
            <button onClick={() => triggerMapAction('zoom-in')} className="w-9 h-9 bg-white rounded-lg shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors" title="Zoom +">
              <LuPlus className="w-4 h-4" />
            </button>
            <button onClick={() => triggerMapAction('zoom-out')} className="w-9 h-9 bg-white rounded-lg shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors" title="Zoom -">
              <LuMinus className="w-4 h-4" />
            </button>
            <button onClick={() => triggerMapAction('center')} className="w-9 h-9 bg-white rounded-lg shadow-md border border-slate-200 flex items-center justify-center text-blue-700 hover:bg-blue-50 transition-colors" title="Centrer">
              <LuLocate className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setActiveTool('measure'); setMeasurePoints([]) }}
              className={`w-9 h-9 rounded-lg shadow-md border flex items-center justify-center transition-colors ${
                activeTool === 'measure' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Mesurer"
            >
              <LuRuler className="w-4 h-4" />
            </button>
            <button onClick={() => triggerMapAction('fullscreen')} className="w-9 h-9 bg-white rounded-lg shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors" title="Plein écran">
              <LuMaximize className="w-4 h-4" />
            </button>
          </div>

          {/* Selected marker detail panel */}
          {selectedMarker && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-16 sm:translate-x-0 bg-white rounded-xl shadow-lg border border-slate-200 p-4 z-[1100] min-w-[260px] max-w-[90%] animate-fade-in">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: LAYER_META[selectedMarker.type]?.color + '20' }}>
                    <span className="text-base">{LAYER_META[selectedMarker.type]?.emoji}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{selectedMarker.label}</div>
                    <div className="text-xs text-slate-500">{LAYER_META[selectedMarker.type]?.label}</div>
                  </div>
                </div>
                <button onClick={() => setSelectedMarker(null)} className="text-slate-400 hover:text-slate-600 p-1">
                  <LuX className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="bg-slate-50 rounded-lg p-2">
                  <div className="text-slate-400">Latitude</div>
                  <div className="font-mono font-medium text-slate-700">{selectedMarker.lat.toFixed(4)}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <div className="text-slate-400">Longitude</div>
 <div className="font-mono font-medium text-slate-700">{selectedMarker.lng.toFixed(4)}</div>
                </div>
              </div>
              <button
                onClick={() => { handleExport('PDF'); setSelectedMarker(null) }}
                className="mt-3 w-full flex items-center justify-center gap-2 text-xs bg-green-700 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                <LuDownload className="w-3.5 h-3.5" />
                Exporter cette carte
              </button>
            </div>
          )}

          {/* Legend */}
          {showLegend ? (
            <div className="absolute bottom-16 left-3 sm:left-4 bg-white rounded-xl shadow-lg border border-slate-200 p-3 z-[1000] min-w-[160px] max-w-[200px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Légende</span>
                <button onClick={() => setShowLegend(false)} className="text-slate-400 hover:text-slate-600 ml-2">
                  <LuX className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1.5">
                {/* Boundary legend */}
                {delimitation === 'administrative' && activeAdminBounds && (
                  <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                    <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0 border border-green-600 bg-green-100" />
                    <span className="text-xs text-slate-600">
                      {adminLevel === 'province' ? 'Province' : adminLevel === 'commune' ? 'Commune' : 'Secteur'}
                    </span>
                  </div>
                )}
                {delimitation === 'thematic' && activeThematicZones.length > 0 && (
                  <>
                    {activeThematicZones.map(zone => (
                      <div key={zone.id} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: zone.color, opacity: 0.7 }} />
                        <span className="text-xs text-slate-600 truncate">{zone.name}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-100 my-1" />
                  </>
                )}
                {/* Layer legend */}
                {layers.filter(l => l.checked).map(l => (
                  <div key={l.id} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: l.color }} />
                    <span className="text-xs text-slate-600">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowLegend(true)}
              className="absolute bottom-16 left-3 sm:left-4 bg-white rounded-lg shadow border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 z-[1000] hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <LuLayers className="w-3.5 h-3.5" />
              Légende
            </button>
          )}

          {/* Scale bar */}
          <div className="absolute bottom-7 left-3 sm:left-4 bg-white/90 backdrop-blur rounded px-2 py-1 text-xs text-slate-600 border border-slate-200 z-[1000]">
            500 m
          </div>

          {/* Zone badge */}
          <div className="absolute top-4 left-3 sm:left-1/2 sm:-translate-x-1/2 bg-white/95 backdrop-blur rounded-full px-3 sm:px-4 py-1.5 shadow border border-slate-200 z-[1000] flex items-center gap-2 max-w-[80%]">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
            <span className="text-xs font-medium text-slate-700 truncate">
              {delimitation === 'administrative'
                ? `${commune} — ${secteur}`
                : `${THEMATIC_CATEGORIES[thematicDomain].label} — ${activeThematicZones.length} zone(s)`
              }
            </span>
          </div>

          {/* Exporting overlay */}
          {exporting && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-[1200] flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-center">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <div className="text-sm font-semibold text-slate-900">Export {exportFormat} en cours...</div>
                <div className="text-xs text-slate-500 mt-1">{commune} — {secteur}</div>
              </div>
            </div>
          )}
        </div>

        {/* KPI Row */}
        <div className="bg-white border-t border-slate-200 px-3 sm:px-4 py-3 flex-shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {[
              { label: 'Écoles', value: currentZone.ecoles.toString(), icon: <LuGraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-blue-700', bg: 'bg-blue-50' },
              { label: 'Centres de santé', value: currentZone.sante.toString(), icon: <LuHeartPulse className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-red-600', bg: 'bg-red-50' },
              { label: "Points d'eau", value: currentZone.eau.toString(), icon: <LuDroplet className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-cyan-600', bg: 'bg-cyan-50' },
              { label: 'Population', value: currentZone.population.toLocaleString() + ' hab.', icon: <LuUsers className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-indigo-700', bg: 'bg-indigo-50' },
              { label: 'Superficie', value: currentZone.superficie + ' km²', icon: <LuRuler className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-green-700', bg: 'bg-green-50' },
            ].map(kpi => (
              <div key={kpi.label} className={`${kpi.bg} rounded-xl p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3`}>
                <span className={kpi.color}>{kpi.icon}</span>
                <div className="min-w-0">
                  <div className={`text-sm sm:text-base font-bold ${kpi.color} leading-tight truncate`}>{kpi.value}</div>
                  <div className="text-xs text-slate-500 leading-tight truncate">{kpi.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Filter Drawer */}
      {mobilePanelOpen && (
        <div className="lg:hidden fixed inset-0 z-[2000] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobilePanelOpen(false)} />
          <div className="relative bg-white rounded-t-2xl shadow-2xl max-h-[82vh] flex flex-col animate-slide-up">
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1.5 bg-slate-300 rounded-full" />
            </div>
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-900">Configuration de la carte</h2>
              <button onClick={() => setMobilePanelOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                <LuX className="w-5 h-5" />
              </button>
            </div>
            <div className="flex border-b border-slate-200 bg-slate-50">
              {(['delimitation', 'themes', 'couches'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setMobilePanelTab(tab)}
                  className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                    mobilePanelTab === tab
                      ? 'text-green-700 border-b-2 border-green-700 bg-white'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab === 'delimitation' ? 'Délimitation' : tab === 'themes' ? 'Thèmes' : 'Couches'}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {activeMobilePanel}
            </div>
            <div className="border-t border-slate-200 p-3 pb-6">
              <button
                onClick={() => setMobilePanelOpen(false)}
                className="w-full bg-green-700 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <LuMap className="w-4 h-4" />
                Voir la carte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
