import { useState, useMemo } from 'react'
import {
  LuSearch, LuMapPin, LuFileText, LuImage, LuLayers, LuDownload,
  LuPencil, LuFilePlus, LuEye, LuTrash2, LuUpload, LuShare,
  LuChevronRight, LuFilter, LuCheck, LuClock,
} from 'react-icons/lu'

interface ActivityEntry {
  id: string
  action: string
  detail: string
  zone: string
  type: 'generation' | 'export' | 'modification' | 'visualisation' | 'import' | 'suppression' | 'partage'
  timestamp: string
  date: string
  user: string
}

const ACTIVITIES: ActivityEntry[] = [
  { id: '1', action: 'Carte générée', detail: 'Carte Santé Kintambo (PDF, A4 Paysage)', zone: 'Kintambo', type: 'generation', timestamp: '14:32', date: '27/06/2026', user: 'Utilisateur' },
  { id: '2', action: 'Export téléchargé', detail: 'Carte Éducation Kinshasa.pdf', zone: 'Kinshasa', type: 'export', timestamp: '11:08', date: '27/06/2026', user: 'Utilisateur' },
  { id: '3', action: 'Carte modifiée', detail: 'Ajout de la couche "Points d\'eau" sur Joli-Parc', zone: 'Joli-Parc', type: 'modification', timestamp: '16:45', date: '26/06/2026', user: 'Utilisateur' },
  { id: '4', action: 'Atlas créé', detail: 'Atlas Communal Gombe — 32 pages', zone: 'Gombe', type: 'generation', timestamp: '10:22', date: '26/06/2026', user: 'Utilisateur' },
  { id: '5', action: 'Données importées', detail: 'Shapefile "Limites administratives 2024" (145 entités)', zone: 'Kinshasa', type: 'import', timestamp: '09:15', date: '25/06/2026', user: 'Utilisateur' },
  { id: '6', action: 'Carte partagée', detail: 'Lien de partage envoyé à l\'équipe SIG', zone: 'Kinshasa', type: 'partage', timestamp: '17:30', date: '24/06/2026', user: 'Utilisateur' },
  { id: '7', action: 'Carte consultée', detail: 'Carte Eau Joli-Parc — 4 min de visualisation', zone: 'Joli-Parc', type: 'visualisation', timestamp: '14:12', date: '24/06/2026', user: 'Utilisateur' },
  { id: '8', action: 'Export supprimé', detail: 'Ancienne version "Carte Paroisses v1.pdf"', zone: 'Kinshasa', type: 'suppression', timestamp: '11:50', date: '23/06/2026', user: 'Utilisateur' },
  { id: '9', action: 'Carte générée', detail: 'Carte Eau Joli-Parc (PNG, Haute résolution)', zone: 'Joli-Parc', type: 'generation', timestamp: '08:40', date: '23/06/2026', user: 'Utilisateur' },
  { id: '10', action: 'Atlas créé', detail: 'Atlas Provincial Kinshasa — 48 pages', zone: 'Kinshasa', type: 'generation', timestamp: '15:20', date: '22/06/2026', user: 'Utilisateur' },
  { id: '11', action: 'Données importées', detail: 'GeoJSON "Écoles de Gombe" (62 entités)', zone: 'Gombe', type: 'import', timestamp: '10:05', date: '22/06/2026', user: 'Utilisateur' },
  { id: '12', action: 'Carte modifiée', detail: 'Changement du fond de carte vers Satellite', zone: 'Kintambo', type: 'modification', timestamp: '16:18', date: '21/06/2026', user: 'Utilisateur' },
]

const TYPE_META: Record<ActivityEntry['type'], { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  generation: { color: '#15803d', bg: 'bg-green-100', icon: <LuFilePlus className="w-4 h-4" />, label: 'Génération' },
  export: { color: '#1d4ed8', bg: 'bg-blue-100', icon: <LuDownload className="w-4 h-4" />, label: 'Export' },
  modification: { color: '#d97706', bg: 'bg-orange-100', icon: <LuPencil className="w-4 h-4" />, label: 'Modification' },
  visualisation: { color: '#0891b2', bg: 'bg-cyan-100', icon: <LuEye className="w-4 h-4" />, label: 'Consultation' },
  import: { color: '#7c3aed', bg: 'bg-purple-100', icon: <LuUpload className="w-4 h-4" />, label: 'Import' },
  suppression: { color: '#dc2626', bg: 'bg-red-100', icon: <LuTrash2 className="w-4 h-4" />, label: 'Suppression' },
  partage: { color: '#db2777', bg: 'bg-pink-100', icon: <LuShare className="w-4 h-4" />, label: 'Partage' },
}

export function Historique() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<ActivityEntry['type'] | 'all'>('all')

  const filtered = useMemo(() => {
    return ACTIVITIES.filter(a => {
      const matchSearch = !search ||
        a.action.toLowerCase().includes(search.toLowerCase()) ||
        a.detail.toLowerCase().includes(search.toLowerCase()) ||
        a.zone.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === 'all' || a.type === typeFilter
      return matchSearch && matchType
    })
  }, [search, typeFilter])

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, ActivityEntry[]> = {}
    filtered.forEach(a => {
      if (!groups[a.date]) groups[a.date] = []
      groups[a.date].push(a)
    })
    return Object.entries(groups)
  }, [filtered])

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    ACTIVITIES.forEach(a => { counts[a.type] = (counts[a.type] || 0) + 1 })
    return counts
  }, [])

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-6 pb-24 lg:pb-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Historique d'activité</h1>
          <p className="text-sm text-slate-500 mt-1">Journal complet de vos actions sur la plateforme</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Actions totales', value: ACTIVITIES.length, icon: <LuCheck className="w-4 h-4" />, color: 'text-slate-700', bg: 'bg-slate-100' },
            { label: 'Cartes générées', value: typeCounts.generation || 0, icon: <LuFilePlus className="w-4 h-4" />, color: 'text-green-700', bg: 'bg-green-100' },
            { label: 'Exports', value: typeCounts.export || 0, icon: <LuDownload className="w-4 h-4" />, color: 'text-blue-700', bg: 'bg-blue-100' },
            { label: 'Imports', value: typeCounts.import || 0, icon: <LuUpload className="w-4 h-4" />, color: 'text-purple-700', bg: 'bg-purple-100' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-3 flex items-center gap-2.5`}>
              <span className={s.color}>{s.icon}</span>
              <div>
                <div className={`text-lg font-bold ${s.color} leading-tight`}>{s.value}</div>
                <div className="text-xs text-slate-500 leading-tight">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & filter */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Rechercher dans l'historique..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 pl-10 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
              <LuSearch className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setTypeFilter('all')}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2.5 rounded-lg whitespace-nowrap transition-all ${
                  typeFilter === 'all' ? 'bg-green-700 text-white' : 'border border-slate-200 text-slate-600 hover:border-green-300'
                }`}
              >
                <LuFilter className="w-3.5 h-3.5" />
                Tout
              </button>
              {Object.entries(TYPE_META).map(([key, meta]) => (
                <button
                  key={key}
                  onClick={() => setTypeFilter(key as ActivityEntry['type'])}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2.5 rounded-lg whitespace-nowrap transition-all ${
                    typeFilter === key ? 'text-white' : 'border border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                  style={typeFilter === key ? { backgroundColor: meta.color } : {}}
                >
                  {meta.icon}
                  <span className="hidden sm:inline">{meta.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
          {grouped.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <div className="text-3xl mb-2">📭</div>
              <div className="text-sm">Aucune activité trouvée</div>
            </div>
          )}
          {grouped.map(([date, entries]) => (
            <div key={date} className="mb-6 last:mb-0">
              {/* Date header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide bg-slate-100 px-2.5 py-1 rounded-full">
                  {date}
                </div>
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-xs text-slate-400">{entries.length} action{entries.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Timeline entries */}
              <div className="relative pl-6">
                {/* Vertical line */}
                <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-slate-100" />
                {entries.map((entry, i) => {
                  const meta = TYPE_META[entry.type]
                  return (
                    <div key={entry.id} className="relative pb-4 last:pb-0">
                      {/* Dot */}
                      <div
                        className="absolute -left-6 top-1 w-4 h-4 rounded-full flex items-center justify-center text-white flex-shrink-0 ring-4 ring-white"
                        style={{ backgroundColor: meta.color }}
                      >
                        <span className="scale-75">{meta.icon}</span>
                      </div>
                      {/* Card */}
                      <div className="bg-slate-50 hover:bg-white hover:shadow-sm rounded-xl border border-slate-100 p-3 transition-all">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">{entry.action}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${meta.bg}`} style={{ color: meta.color }}>
                              {meta.label}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0">
                            <LuClock className="w-3 h-3" />
                            {entry.timestamp}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mb-1.5">{entry.detail}</div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <LuMapPin className="w-3 h-3" />
                            {entry.zone}
                          </span>
                          <span className="flex items-center gap-1">
                            <LuChevronRight className="w-3 h-3" />
                            {entry.user}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
