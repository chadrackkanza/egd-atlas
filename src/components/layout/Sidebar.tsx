import type { ViewId } from '../../types'
import {
  LuLayoutDashboard, LuMap, LuSearch, LuBook, LuDatabase,
  LuChartBar, LuDownload, LuHistory, LuSettings, LuCircleHelp,
  LuChevronDown, LuChevronLeft, LuSparkles, LuPanelLeft,
} from 'react-icons/lu'

interface NavItem {
  id: ViewId
  label: string
  icon: React.ReactNode
  children?: Array<{ id: ViewId; label: string }>
}

const iconClass = 'w-5 h-5 flex-shrink-0'

export const NAV_ITEMS: NavItem[] = [
  { id: 'tableau-de-bord', label: 'Tableau de bord', icon: <LuLayoutDashboard className={iconClass} /> },
  {
    id: 'carte-interactive', label: 'Cartes', icon: <LuMap className={iconClass} />,
    children: [
      { id: 'carte-interactive', label: 'Carte interactive' },
      { id: 'carte-administrative', label: 'Carte administrative' },
      { id: 'cartes-thematiques', label: 'Cartes thématiques' },
      { id: 'mes-cartes', label: 'Mes cartes' },
    ]
  },
  { id: 'recherche', label: 'Recherche', icon: <LuSearch className={iconClass} /> },
  { id: 'atlas', label: 'Atlas', icon: <LuBook className={iconClass} /> },
  { id: 'donnees', label: 'Données', icon: <LuDatabase className={iconClass} /> },
  { id: 'analyses', label: 'Analyses', icon: <LuChartBar className={iconClass} /> },
  { id: 'mes-exports', label: 'Mes exports', icon: <LuDownload className={iconClass} /> },
  { id: 'historique', label: 'Historique', icon: <LuHistory className={iconClass} /> },
  { id: 'parametres', label: 'Paramètres', icon: <LuSettings className={iconClass} /> },
]

interface SidebarProps {
  currentView: ViewId
  onNavigate: (view: ViewId) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({ currentView, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  const isActive = (item: NavItem) =>
    item.id === currentView || item.children?.some(c => c.id === currentView)

  return (
    <aside
      className={`hidden lg:flex flex-col bg-slate-900 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} min-h-screen flex-shrink-0`}
    >
      {/* En-tête du menu */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-sm font-bold">E</div>
            <div>
              <div className="font-bold text-sm leading-tight">EGD Atlas</div>
              <div className="text-xs text-slate-400">v2.0</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-sm font-bold mx-auto">E</div>
        )}
        <button
          onClick={onToggleCollapse}
          className={`text-slate-400 hover:text-white transition-colors ${collapsed ? 'mx-auto' : ''}`}
          title={collapsed ? 'Déplier le menu' : 'Replier le menu'}
        >
          {collapsed ? <LuChevronLeft className="w-5 h-5" /> : <LuPanelLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {NAV_ITEMS.map((item) => (
          <div key={item.id}>
            <button
              data-nav={item.children ? item.children[0].id : item.id}
              onClick={() => onNavigate(item.children ? item.children[0].id : item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive(item)
                  ? 'bg-green-700 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.children && (
                <LuChevronDown className={`ml-auto w-4 h-4 flex-shrink-0 transition-transform ${isActive(item) ? 'rotate-180' : ''}`} />
              )}
            </button>
            {!collapsed && item.children && isActive(item) && (
              <div className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-3">
                {item.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => onNavigate(child.id)}
                    className={`w-full text-left px-2 py-2 rounded-md text-xs transition-all ${
                      currentView === child.id
                        ? 'text-green-400 font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Aide et accès premium */}
      {!collapsed && (
        <div className="p-4 space-y-3 border-t border-slate-700">
          <button
            data-nav="aide"
            onClick={() => onNavigate('aide')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              currentView === 'aide' ? 'bg-green-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LuCircleHelp className="w-5 h-5" />
            <span>Aide</span>
          </button>
          <div className="bg-gradient-to-br from-green-800 to-green-600 rounded-xl p-3 text-xs text-white">
            <div className="font-semibold mb-1 flex items-center gap-1.5">
              <LuSparkles className="w-3.5 h-3.5" /> Passez en Premium
            </div>
            <div className="text-green-200 mb-2">Accès illimité + exports HD</div>
            <button className="w-full bg-white text-green-800 rounded-lg py-1.5 font-semibold text-xs hover:bg-green-50 transition-colors">
              Upgrader
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
