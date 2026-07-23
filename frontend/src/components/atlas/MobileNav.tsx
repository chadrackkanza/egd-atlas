import { Home, Search, BookOpen, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Accueil', path: '/' },
  { icon: Search, label: 'Recherche', path: '/data' },
  { icon: BookOpen, label: 'Atlas', path: '/atlas' },
  { icon: Clock, label: 'Historique', path: '/history' },
  { icon: User, label: 'Compte', path: '/settings' },
];

export function MobileNav() {
  const navigate = useNavigate();

  return (
    <nav className="flex lg:hidden items-center justify-around border-t bg-card py-2 px-1">
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors text-muted-foreground`}
        >
          <item.icon className="h-5 w-5" />
          <span className="text-[9px] font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}