import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts'
import { ZONES } from '../data/mockData'
import {
  LuGraduationCap, LuHeartPulse, LuDroplet, LuUsers, LuRuler,
  LuTrendingUp, LuTrendingDown, LuChartBar, LuMapPin, LuDownload,
} from 'react-icons/lu'

const SANTE_DATA = [
  { name: 'Joli-Parc', value: 12 },
  { name: 'Centre-Ville', value: 18 },
  { name: 'Binza', value: 9 },
  { name: 'Mombele', value: 15 },
  { name: 'Righini', value: 21 },
  { name: 'Katindo', value: 8 },
]

const ECOLES_DATA = [
  { name: 'Joli-Parc', value: 45 },
  { name: 'Centre-Ville', value: 62 },
  { name: 'Binza', value: 38 },
  { name: 'Mombele', value: 55 },
  { name: 'Righini', value: 71 },
  { name: 'Katindo', value: 33 },
]

const THEME_DISTRIBUTION = [
  { name: 'Éducation', value: 35, color: '#1d4ed8' },
  { name: 'Santé', value: 20, color: '#dc2626' },
  { name: 'Eau', value: 25, color: '#0891b2' },
  { name: 'Infrastructure', value: 12, color: '#d97706' },
  { name: 'Autre', value: 8, color: '#7c3aed' },
]

const COVERAGE_TREND = [
  { mois: 'Jan', couverture: 62 },
  { mois: 'Fév', couverture: 65 },
  { mois: 'Mar', couverture: 68 },
  { mois: 'Avr', couverture: 71 },
  { mois: 'Mai', couverture: 75 },
  { mois: 'Jun', couverture: 78 },
  { mois: 'Juil', couverture: 82 },
]

export function Analyses() {
  const [selectedZone, setSelectedZone] = useState('Kinshasa')
  const [chartType, setChartType] = useState<'sante' | 'ecoles'>('sante')

  const zone = ZONES.find(z => z.province === selectedZone) || ZONES[0]
  const chartData = chartType === 'sante' ? SANTE_DATA : ECOLES_DATA
  const chartColor = chartType === 'sante' ? '#dc2626' : '#1d4ed8'

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-6 pb-24 lg:pb-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <LuChartBar className="w-5 h-5 text-green-700" />
              Analyses & Statistiques
            </h1>
            <p className="text-sm text-slate-500 mt-1">Tableaux de bord et indicateurs territoriaux</p>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedZone}
              onChange={e => setSelectedZone(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-white focus:ring-2 focus:ring-green-500 outline-none"
            >
              {[...new Set(ZONES.map(z => z.province))].map(p => <option key={p}>{p}</option>)}
            </select>
            <button className="flex items-center gap-2 text-sm bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-600 hover:bg-slate-50 transition-colors">
              <LuDownload className="w-4 h-4" />
              <span className="hidden sm:inline">Exporter</span>
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 mb-6">
          {[
            { label: 'Écoles', value: zone.ecoles, icon: <LuGraduationCap className="w-5 h-5" />, color: 'text-blue-700', bg: 'bg-blue-50', trend: '+3', trendUp: true },
            { label: 'Centres de santé', value: zone.sante, icon: <LuHeartPulse className="w-5 h-5" />, color: 'text-red-600', bg: 'bg-red-50', trend: '+1', trendUp: true },
            { label: "Points d'eau", value: zone.eau, icon: <LuDroplet className="w-5 h-5" />, color: 'text-cyan-700', bg: 'bg-cyan-50', trend: '+5', trendUp: true },
            { label: 'Population', value: zone.population.toLocaleString(), icon: <LuUsers className="w-5 h-5" />, color: 'text-indigo-700', bg: 'bg-indigo-50', trend: '+2.1%', trendUp: true },
            { label: 'Superficie km²', value: zone.superficie.toString(), icon: <LuRuler className="w-5 h-5" />, color: 'text-green-700', bg: 'bg-green-50', trend: '—', trendUp: true },
          ].map(kpi => (
            <div key={kpi.label} className={`${kpi.bg} rounded-xl p-3 border border-white/60`}>
              <div className="flex items-center justify-between mb-1">
                <span className={kpi.color}>{kpi.icon}</span>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${kpi.trendUp ? 'text-green-600' : 'text-red-500'}`}>
                  {kpi.trend !== '—' && (kpi.trendUp ? <LuTrendingUp className="w-3 h-3" /> : <LuTrendingDown className="w-3 h-3" />)}
                  {kpi.trend}
                </span>
              </div>
              <div className={`text-xl font-bold ${kpi.color} leading-tight`}>{kpi.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
          {/* Bar Chart with toggle */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {chartType === 'sante' ? 'Centres de santé' : 'Écoles'} par quartier
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Répartition géographique</p>
              </div>
              <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => setChartType('sante')}
                  className={`text-xs font-medium px-2.5 py-1 rounded-md transition-all ${chartType === 'sante' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Santé
                </button>
                <button
                  onClick={() => setChartType('ecoles')}
                  className={`text-xs font-medium px-2.5 py-1 rounded-md transition-all ${chartType === 'ecoles' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                >
                  Écoles
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="value" fill={chartColor} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Répartition par thème</h3>
            <p className="text-xs text-slate-500 mb-4">Distribution des entités par catégorie</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={THEME_DISTRIBUTION} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {THEME_DISTRIBUTION.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v: number) => [`${v}%`, '']} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Coverage trend */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <LuTrendingUp className="w-4 h-4 text-green-700" />
                Taux de couverture territoriale
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Évolution sur 7 mois</p>
            </div>
            <span className="text-2xl font-bold text-green-700">82%</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={COVERAGE_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mois" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[50, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v: number) => [`${v}%`, 'Couverture']} />
              <Line type="monotone" dataKey="couverture" stroke="#15803d" strokeWidth={2.5} dot={{ fill: '#15803d', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
            <LuMapPin className="w-4 h-4 text-green-700" />
            <h3 className="text-sm font-semibold text-slate-900">Indicateurs par commune</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Commune</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Écoles</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Santé</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Eau</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Population</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">km²</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ZONES.map(z => (
                  <tr key={z.commune} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{z.commune}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{z.ecoles}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{z.sante}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{z.eau}</td>
                    <td className="px-4 py-3 text-right hidden md:table-cell text-slate-600">{z.population.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right hidden md:table-cell text-slate-600">{z.superficie}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
