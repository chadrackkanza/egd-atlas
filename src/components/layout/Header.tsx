import type { ViewId } from '../../types'
import { LuBell, LuCircleHelp, LuCircleUserRound } from 'react-icons/lu'

interface HeaderProps {
  currentView: ViewId
  onNavigate: (view: ViewId) => void
}

const VIEW_LABELS: Partial<Record<ViewId, string>> = {
  'carte-interactive': 'Carte interactive',
  'tableau-de-bord': 'Tableau de bord',
  'generer-carte': 'Générer une carte',
  atlas: 'Atlas',
  donnees: 'Données',
  analyses: 'Analyses',
  'mes-exports': 'Mes exports',
  historique: 'Historique',
  parametres: 'Paramètres',
  aide: 'Aide',
  profil: 'Profil',
  recherche: 'Recherche',
  'carte-administrative': 'Carte administrative',
  'cartes-thematiques': 'Cartes thématiques',
  'mes-cartes': 'Mes cartes',
}

export function Header({ currentView, onNavigate }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between flex-shrink-0 z-10">
      {/* Left: Logo on mobile + title on desktop */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-sm font-bold text-white">E</div>
          <div>
            <div className="font-bold text-sm text-slate-900 leading-tight">EGD Atlas</div>
            <div className="text-xs text-slate-500">Cartographie RDC</div>
          </div>
        </div>
        <div className="hidden lg:block">
          <h1 className="text-sm font-semibold text-slate-900">{VIEW_LABELS[currentView] || 'EGD Atlas'}</h1>
          <p className="text-xs text-slate-500">Plateforme de cartographie et génération d'atlas territoriaux en RDC</p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Notifications"
          aria-label="Notifications"
        >
          <LuBell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button
          onClick={() => onNavigate('aide')}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Aide"
          aria-label="Accéder à l’aide"
        >
          <LuCircleHelp className="w-5 h-5" />
        </button>
        <button
          onClick={() => onNavigate('profil')}
          className="flex items-center gap-2 hover:bg-slate-100 rounded-lg px-2 py-1.5 transition-colors"
          aria-label="Accéder au profil"
        >
          <div className="w-7 h-7 bg-green-700 rounded-full flex items-center justify-center text-white text-xs font-bold">PW</div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-tight">Compte</div>
            <div className="text-xs text-green-600 leading-tight">Premium</div>
          </div>
        </button>
      </div>
    </header>
  )
}
