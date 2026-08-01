import { useState } from 'react'
import {
  LuCamera, LuCheck, LuSave, LuKey, LuLogOut, LuChevronRight,
  LuBell, LuGlobe, LuShield, LuSparkles, LuUser,
} from 'react-icons/lu'

export function Profil() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    nom: 'waba',
    prenom: 'Prefi',
    email: 'prefi.waba@egdatlas.cd',
    telephone: '+243 81 234 5678',
    langue: 'fr',
    province: 'Kinshasa',
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-6 pb-24 lg:pb-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Profil & Paramètres</h1>
          <p className="text-sm text-slate-500 mt-1">Gérez votre compte et vos préférences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-400 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                U
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-700 rounded-full flex items-center justify-center shadow hover:bg-blue-600 transition-colors" title="Changer la photo">
                <LuCamera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{form.prenom} {form.nom}</h2>
              <p className="text-sm text-slate-500">{form.email}</p>
              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium mt-1">
                <LuSparkles className="w-3 h-3" /> Formule Premium
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Nom', key: 'nom' },
              { label: 'Prénom', key: 'prenom' },
              { label: 'Email', key: 'email', type: 'email' },
              { label: 'Téléphone', key: 'telephone', type: 'tel' },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  value={form[field.key as keyof typeof form]}
                  onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">Langue préférée</label>
              <select
                value={form.langue}
                onChange={e => setForm(prev => ({ ...prev, langue: e.target.value }))}
                className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-white focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="sw">Swahili</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">Province par défaut</label>
              <select
                value={form.province}
                onChange={e => setForm(prev => ({ ...prev, province: e.target.value }))}
                className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-white focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option>Kinshasa</option>
                <option>Nord-Kivu</option>
                <option>Katanga</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
            >
              {saved ? <><LuCheck className="w-4 h-4" /> Enregistré !</> : <><LuSave className="w-4 h-4" /> Sauvegarder</>}
            </button>
            <button className="px-5 py-2.5 border border-slate-200 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              Annuler
            </button>
          </div>
        </div>

        {/* Subscription Card */}
        <div className="bg-gradient-to-br from-green-700 to-green-500 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs font-semibold opacity-80 uppercase tracking-wide">Abonnement actuel</div>
              <div className="text-xl font-bold mt-0.5">Formule Premium</div>
            </div>
            <span className="bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">Actif</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4 text-center">
            {[
              { label: 'Exports / mois', value: 'Illimités' },
              { label: 'Résolution max', value: '300 dpi' },
              { label: 'Stockage', value: '500 MB' },
            ].map(item => (
              <div key={item.label} className="bg-white/15 rounded-xl py-2 px-1">
                <div className="font-semibold text-sm">{item.value}</div>
                <div className="text-xs opacity-75 mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="text-xs opacity-75">Renouvellement le 27/07/2027 · 15 USD/mois</div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Sécurité & Compte</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                  <LuKey className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-sm text-slate-700">Changer le mot de passe</span>
              </div>
              <LuChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                  <LuBell className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-sm text-slate-700">Notifications</span>
              </div>
              <LuChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                  <LuShield className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-sm text-slate-700">Confidentialité des données</span>
              </div>
              <LuChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 border border-slate-100 hover:border-red-200 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                  <LuLogOut className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-sm text-red-600">Se déconnecter</span>
              </div>
              <LuChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
