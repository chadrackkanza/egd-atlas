import { useState } from 'react'
import { DATA_CATALOG } from '../data/mockData'
import {
  LuSearch, LuEye, LuDownload, LuMap, LuUpload, LuDatabase,
  LuFileText, LuFileSpreadsheet, LuLayers,
} from 'react-icons/lu'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Administration': <LuLayers className="w-4 h-4" />,
  'Éducation': <LuFileText className="w-4 h-4" />,
  'Santé': <LuFileText className="w-4 h-4" />,
  'Eau': <LuFileText className="w-4 h-4" />,
  'Infrastructure': <LuFileText className="w-4 h-4" />,
  'Religion': <LuFileText className="w-4 h-4" />,
  'Environnement': <LuFileText className="w-4 h-4" />,
  'Population': <LuFileText className="w-4 h-4" />,
}

const FORMAT_ICONS: Record<string, React.ReactNode> = {
  'SHP': <LuLayers className="w-3.5 h-3.5" />,
  'TIF': <LuFileText className="w-3.5 h-3.5" />,
  'CSV': <LuFileSpreadsheet className="w-3.5 h-3.5" />,
}

export function Donnees() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Tous')
  const [showImport, setShowImport] = useState(false)

  const categories = ['Tous', ...new Set(DATA_CATALOG.map(d => d.categorie))]

  const filtered = DATA_CATALOG.filter(d => {
    const matchSearch = d.nom.toLowerCase().includes(search.toLowerCase()) || d.source.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'Tous' || d.categorie === category
    return matchSearch && matchCat
  })

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-6 pb-24 lg:pb-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <LuDatabase className="w-5 h-5 text-green-700" />
              Catalogue de données
            </h1>
            <p className="text-sm text-slate-500 mt-1">Explorez et gérez les bases de données spatiales</p>
          </div>
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
          >
            <LuUpload className="w-4 h-4" />
            Importer des données
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Jeux de données', value: DATA_CATALOG.length, icon: <LuDatabase className="w-5 h-5" />, color: 'text-green-700', bg: 'bg-green-50' },
            { label: 'Entités totales', value: DATA_CATALOG.reduce((s, d) => s + d.entites, 0).toLocaleString(), icon: <LuLayers className="w-5 h-5" />, color: 'text-blue-700', bg: 'bg-blue-50' },
            { label: 'Catégories', value: categories.length - 1, icon: <LuFileText className="w-5 h-5" />, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Mises à jour 2024', value: DATA_CATALOG.filter(d => d.date === '2024').length, icon: <LuFileSpreadsheet className="w-5 h-5" />, color: 'text-purple-700', bg: 'bg-purple-50' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} rounded-xl border border-white/60 p-3 flex items-center gap-2.5`}>
              <span className={stat.color}>{stat.icon}</span>
              <div>
                <div className="text-lg font-bold text-slate-900 leading-tight">{stat.value}</div>
                <div className="text-xs text-slate-500 leading-tight">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Rechercher dans le catalogue..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 pl-10 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
              <LuSearch className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    category === cat
                      ? 'bg-green-700 text-white'
                      : 'border border-slate-200 text-slate-600 hover:border-green-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Nom</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Catégorie</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Source</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Entités</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Format</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-slate-100 group-hover:bg-green-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-green-700 transition-colors flex-shrink-0">
                          {CATEGORY_ICONS[row.categorie] || <LuFileText className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{row.nom}</div>
                          <div className="text-xs text-slate-500 sm:hidden">{row.categorie} · {row.source}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {row.categorie}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-slate-600 font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{row.source}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-slate-600">{row.date}</td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-right">
                      <span className="font-semibold text-slate-900">{row.entites.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {FORMAT_ICONS[row.format] || <LuFileText className="w-3 h-3" />}
                        {row.format}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Prévisualiser">
                          <LuEye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Télécharger">
                          <LuDownload className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="Ajouter à la carte">
                          <LuMap className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <div className="text-3xl mb-2">🔍</div>
                <div className="text-sm">Aucune donnée trouvée</div>
              </div>
            )}
          </div>
          <div className="border-t border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-500">
            <span>{filtered.length} résultat{filtered.length !== 1 ? 's' : ''} sur {DATA_CATALOG.length}</span>
            <span className="text-green-600 font-medium flex items-center gap-1">
              <LuDatabase className="w-3 h-3" />
              Données mises à jour régulièrement
            </span>
          </div>
        </div>

        {/* Import Modal */}
        {showImport && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" onClick={() => setShowImport(false)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
              <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                <LuUpload className="w-5 h-5 text-green-700" />
                Importer des données
              </h2>
              <p className="text-sm text-slate-500 mb-4">Formats supportés: SHP, GeoJSON, CSV, KML</p>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-green-400 hover:bg-green-50/50 transition-all cursor-pointer">
                <LuUpload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <div className="text-sm font-medium text-slate-700">Glissez-déposez votre fichier</div>
                <div className="text-xs text-slate-400 mt-1">ou cliquez pour parcourir</div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-green-700 hover:bg-green-600 text-white text-sm py-2.5 rounded-xl font-medium transition-colors">
                  Importer
                </button>
                <button onClick={() => setShowImport(false)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
