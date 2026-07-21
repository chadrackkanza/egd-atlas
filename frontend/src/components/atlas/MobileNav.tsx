import { Home, Search, BookOpen, Clock, User } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Accueil', active: true },
  { icon: Search, label: 'Recherche', active: false },
  { icon: BookOpen, label: 'Atlas', active: false },
  { icon: Clock, label: 'Historique', active: false },
  { icon: User, label: 'Compte', active: false },
];

export function MobileNav() {
  return (
    <nav className="flex lg:hidden items-center justify-around border-t bg-card py-2 px-1">
      {navItems.map((item) => (
        <button
          key={item.label}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
            item.active ? 'text-emerald-500' : 'text-muted-foreground'
          }`}
        >
          <item.icon className="h-5 w-5" />
          <span className="text-[9px] font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}