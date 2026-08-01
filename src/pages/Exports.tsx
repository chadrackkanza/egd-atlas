import { useState } from 'react'
import { EXPORTS } from '../data/mockData'
import {
  LuSearch, LuDownload, LuShare, LuMapPin, LuFileText, LuImage,
  LuClock, LuCheck, LuX, LuHardDrive, LuTrash2,
} from 'react-icons/lu'

export function Exports() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Terminé' | 'En cours'>('all')

  const filtered = EXPORTS.filter(e => {
    const matchSearch = e.nom.toLowerCase().includes(search.toLowerCase()) ||
      e.zone.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || e.statut === statusFilter
    return matchSearch && matchStatus
  })

  const totalSize = EXPORTS.reduce((sum, e) => {
    const mb = parseFloat(e.taille.replace(' MB', ''))
    return sum + (isNaN(mb) ? 0 : mb)
  }, 0)

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-6 pb-24 lg:pb-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Mes exports</h1>
          <p className="text-sm text-slate-500 mt-1">Gérez et téléchargez vos fichiers de cartes exportés</p>
        </div>

        {/* Storage card */}
        <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl p-5 text-white mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <LuHardDrive className="w-5 h-5" />
              <span className="font-semibold text-sm">Stockage</span>
            </div>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">Premium</span>
          </div>
          <div className="flex items-end justify-between mb-2">
            <span className="text-2xl font-bold">{totalSize.toFixed(1)} MB</span>
            <span className="text-xs opacity-80">/ 500 MB</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${Math.min(100, (totalSize / 500) * 100)}%` }} />
          </div>
          <div className="text-xs opacity-75 mt-2">{EXPORTS.length} fichiers · {EXPORTS.filter(e => e.statut === 'Terminé').length} prêts au téléchargement</div>
        </div>

        {/* Search & filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Rechercher un export..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 pl-10 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
              <LuSearch className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
            <div className="flex gap-1.5">
              {(['all', 'Terminé', 'En cours'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`text-xs font-medium px-3 py-2.5 rounded-lg whitespace-nowrap transition-all ${
                    statusFilter === s
                      ? 'bg-green-700 text-white'
                      : 'border border-slate-200 text-slate-600 hover:border-green-300'
                  }`}
                >
                  {s === 'all' ? 'Tous' : s}
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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Nom / Zone</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Thème</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Format</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Taille</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Date</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Statut</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-900">{row.nom}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <LuMapPin className="w-3 h-3" />
                        {row.zone}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{row.theme}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${
                        row.format === 'PDF' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {row.format === 'PDF' ? <LuFileText className="w-3 h-3" /> : <LuImage className="w-3 h-3" />}
                        {row.format}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-right text-slate-600">{row.taille}</td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-slate-600 text-sm">{row.date}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        row.statut === 'Terminé'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {row.statut === 'Terminé' ? <LuCheck className="w-3 h-3" /> : <LuClock className="w-3 h-3" />}
                        {row.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        {row.statut === 'Terminé' && (
                          <button className="flex items-center gap-1 text-xs text-green-700 hover:bg-green-50 border border-green-200 px-2.5 py-1.5 rounded-lg transition-colors font-medium" title="Télécharger">
                            <LuDownload className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Télécharger</span>
                          </button>
                        )}
                        <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="Partager">
                          <LuShare className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Supprimer">
                          <LuTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <div className="text-3xl mb-2">📭</div>
                <div className="text-sm">Aucun export trouvé</div>
              </div>
            )}
          </div>
          <div className="border-t border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-500">
            <span>{filtered.length} fichier{filtered.length !== 1 ? 's' : ''}</span>
            <span className="flex items-center gap-1"><LuHardDrive className="w-3 h-3" /> {totalSize.toFixed(1)} MB utilisés</span>
          </div>
        </div>
      </div>
    </div>
  )
}
