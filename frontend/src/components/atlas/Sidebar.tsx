import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Search,
  BookOpen,
  Database,
  BarChart3,
  Download,
  Clock,
  Settings,
  Crown,
  HelpCircle,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', path: '/' },
  { icon: Map, label: 'Cartes', path: '/generate' },
  { icon: Search, label: 'Recherche', path: '/' },
  { icon: BookOpen, label: 'Atlas', path: '/atlas' },
  { icon: Database, label: 'Données', path: '/data' },
  { icon: BarChart3, label: 'Analyses', path: '/analytics' },
  { icon: Download, label: 'Mes exports', path: '/exports' },
  { icon: Clock, label: 'Historique', path: '/exports' },
  { icon: Settings, label: 'Paramètres', path: '/settings' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="flex h-full w-60 flex-col bg-[hsl(220,40%,16%)] text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold text-sm">
          EGD
        </div>
        <div>
          <h1 className="text-sm font-bold leading-tight">EGD Atlas</h1>
          <p className="text-[10px] text-white/60">Cartographie & Intelligence Territoriale</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </button>
          );
        })}
        <button
          onClick={() => navigate('/help')}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            location.pathname === '/help'
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <HelpCircle className="h-[18px] w-[18px]" />
          Aide
        </button>
      </nav>

      {/* Premium CTA */}
      <div className="mx-3 mb-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-300">Passez en Premium</span>
        </div>
        <p className="text-[11px] text-white/60 mb-3">
          Accédez à plus de données, d'analyses et d'exports HD.
        </p>
        <button className="w-full rounded-lg bg-emerald-500 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors">
          Voir les offres
        </button>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/10">
        <p className="text-[10px] text-white/40">© 2026 ECOGEODATA SARL-U</p>
      </div>
    </aside>
  );
}