import type { ViewId } from '../../types'
import { LuMap, LuSearch, LuBookOpen, LuDownload, LuCircleUserRound } from 'react-icons/lu'

interface MobileNavProps {
  currentView: ViewId
  onNavigate: (view: ViewId) => void
}

const MOBILE_NAV = [
  { id: 'carte-interactive' as ViewId, label: 'Carte', icon: <LuMap className="w-5 h-5" /> },
  { id: 'recherche' as ViewId, label: 'Recherche', icon: <LuSearch className="w-5 h-5" /> },
  { id: 'atlas' as ViewId, label: 'Atlas', icon: <LuBookOpen className="w-5 h-5" /> },
  { id: 'mes-exports' as ViewId, label: 'Exports', icon: <LuDownload className="w-5 h-5" /> },
  { id: 'profil' as ViewId, label: 'Compte', icon: <LuCircleUserRound className="w-5 h-5" /> },
]

export function MobileNav({ currentView, onNavigate }: MobileNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {MOBILE_NAV.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${
              currentView === item.id
                ? 'text-green-700'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className={`transition-all ${currentView === item.id ? 'scale-110' : ''}`}>
              {item.icon}
            </span>
            <span className="text-xs font-medium">{item.label}</span>
            {currentView === item.id && (
              <span className="w-1 h-1 bg-green-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
