import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts'
import { ZONES, EXPORTS, THEMES } from '../data/mockData'
import type { ViewId } from '../types'
import {
  LuMap, LuFilePlus, LuDownload, LuDatabase, LuArrowRight,
  LuGraduationCap, LuHeartPulse, LuDroplet, LuUsers, LuRuler,
  LuTrendingUp, LuTrendingDown, LuClock, LuMapPin, LuLayers,
  LuChartBar, LuBookOpen, LuFileText, LuImage, LuActivity,
} from 'react-icons/lu'

interface TableauDeBordProps {
  onNavigate: (view: ViewId) => void
}

const MONTHLY_TREND = [
  { mois: 'Jan', cartes: 8, exports: 12 },
  { mois: 'Fév', cartes: 12, exports: 18 },
  { mois: 'Mar', cartes: 10, exports: 15 },
  { mois: 'Avr', cartes: 15, exports: 22 },
  { mois: 'Mai', cartes: 18, exports: 25 },
  { mois: 'Jun', cartes: 22, exports: 30 },
  { mois: 'Juil', cartes: 19, exports: 28 },
]

const ZONE_DISTRIBUTION = [
  { name: 'Kinshasa', value: 45, color: '#15803d' },
  { name: 'Nord-Kivu', value: 20, color: '#1d4ed8' },
  { name: 'Haut-Katanga', value: 18, color: '#d97706' },
  { name: 'Autres', value: 17, color: '#7c3aed' },
]

export function TableauDeBord({ onNavigate }: TableauDeBordProps) {
  const [selectedProvince, setSelectedProvince] = useState('Kinshasa')
  const zone = ZONES.find(z => z.province === selectedProvince && z.commune === 'Kintambo') || ZONES[0]

  const totalEcoles = ZONES.reduce((s, z) => s + z.ecoles, 0)
  const totalSante = ZONES.reduce((s, z) => s + z.sante, 0)
  const totalEau = ZONES.reduce((s, z) => s + z.eau, 0)
  const totalPop = ZONES.reduce((s, z) => s + z.population, 0)

  const recentExports = EXPORTS.slice(0, 4)

  const quickActions = [
    { label: 'Carte interactive', desc: 'Explorer la carte', icon: <LuMap className="w-5 h-5" />, view: 'carte-interactive' as ViewId, color: 'bg-green-700' },
    { label: 'Générer une carte', desc: 'Assistant de création', icon: <LuFilePlus className="w-5 h-5" />, view: 'generer-carte' as ViewId, color: 'bg-blue-700' },
    { label: 'Atlas', desc: 'Modèles d\'atlas', icon: <LuBookOpen className="w-5 h-5" />, view: 'atlas' as ViewId, color: 'bg-orange-600' },
    { label: 'Données', desc: 'Catalogue spatial', icon: <LuDatabase className="w-5 h-5" />, view: 'donnees' as ViewId, color: 'bg-purple-700' },
  ]

  const kpiCards = [
    { label: 'Écoles', value: totalEcoles.toLocaleString(), icon: <LuGraduationCap className="w-5 h-5" />, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100', trend: '+3.2%', trendUp: true },
    { label: 'Centres de santé', value: totalSante.toLocaleString(), icon: <LuHeartPulse className="w-5 h-5" />, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', trend: '+1.8%', trendUp: true },
    { label: "Points d'eau", value: totalEau.toLocaleString(), icon: <LuDroplet className="w-5 h-5" />, color: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-100', trend: '+5.1%', trendUp: true },
    { label: 'Population', value: (totalPop / 1000).toFixed(0) + 'K', icon: <LuUsers className="w-5 h-5" />, color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-100', trend: '+2.1%', trendUp: true },
  ]

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-6 pb-24 lg:pb-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-2xl p-5 lg:p-6 text-white mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold mb-1">Bonjour</h1>
            <p className="text-sm text-green-100">Voici un aperçu de votre activité cartographique en RDC</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="bg-white/15 backdrop-blur rounded-lg px-3 py-1.5 flex items-center gap-1.5">
              <LuActivity className="w-3.5 h-3.5" />
              <span className="font-medium">7 jours actifs</span>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-lg px-3 py-1.5 flex items-center gap-1.5">
              <LuMapPin className="w-3.5 h-3.5" />
              <span className="font-medium">3 provinces</span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          {quickActions.map(action => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.view)}
              className="group bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all text-left"
            >
              <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-105 transition-transform`}>
                {action.icon}
              </div>
              <div className="text-sm font-semibold text-slate-900">{action.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{action.desc}</div>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Ouvrir <LuArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          {kpiCards.map(kpi => (
            <div key={kpi.label} className={`${kpi.bg} ${kpi.border} border rounded-2xl p-4`}>
              <div className="flex items-center justify-between mb-2">
                <span className={kpi.color}>{kpi.icon}</span>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${kpi.trendUp ? 'text-green-600' : 'text-red-500'}`}>
                  {kpi.trendUp ? <LuTrendingUp className="w-3 h-3" /> : <LuTrendingDown className="w-3 h-3" />}
                  {kpi.trend}
                </span>
              </div>
              <div className={`text-xl lg:text-2xl font-bold ${kpi.color} leading-tight`}>{kpi.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
          {/* Trend chart - spans 2 */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <LuChartBar className="w-4 h-4 text-green-700" />
                  Activité mensuelle
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Cartes générées et exports (6 derniers mois)</p>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-600" /> Cartes
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Exports
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MONTHLY_TREND} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cartesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#15803d" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#15803d" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="exportsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mois" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Area type="monotone" dataKey="cartes" stroke="#15803d" strokeWidth={2} fill="url(#cartesGrad)" />
                <Area type="monotone" dataKey="exports" stroke="#1d4ed8" strokeWidth={2} fill="url(#exportsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Distribution pie */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-1">
              <LuMapPin className="w-4 h-4 text-green-700" />
              Zones couvertes
            </h3>
            <p className="text-xs text-slate-500 mb-4">Répartition par province</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={ZONE_DISTRIBUTION} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                  {ZONE_DISTRIBUTION.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v: number) => [`${v}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {ZONE_DISTRIBUTION.map(z => (
                <div key={z.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: z.color }} />
                    {z.name}
                  </span>
                  <span className="font-medium text-slate-700">{z.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row: Recent exports + Themes */}
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Recent exports */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <LuClock className="w-4 h-4 text-green-700" />
                Exports récents
              </h3>
              <button onClick={() => onNavigate('mes-exports')} className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1 transition-colors">
                Voir tout <LuArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {recentExports.map(exp => (
                <div key={exp.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    exp.format === 'PDF' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {exp.format === 'PDF' ? <LuFileText className="w-4 h-4" /> : <LuImage className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900 truncate">{exp.nom}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <LuMapPin className="w-3 h-3" />
                      {exp.zone} · {exp.taille}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                    exp.statut === 'Terminé' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {exp.statut}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Themes overview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <LuLayers className="w-4 h-4 text-green-700" />
                Thèmes disponibles
              </h3>
              <button onClick={() => onNavigate('carte-interactive')} className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1 transition-colors">
                Carte <LuArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => onNavigate('carte-interactive')}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-100 hover:border-green-200 hover:bg-green-50/50 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-base flex-shrink-0">
                    {theme.icon}
                  </div>
                  <span className="text-xs font-medium text-slate-700">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
