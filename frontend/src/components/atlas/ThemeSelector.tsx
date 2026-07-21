import {
  GraduationCap,
  Heart,
  Droplets,
  Church,
  Building2,
  TreePine,
  Users,
  Shield,
} from 'lucide-react';
import type { ThemeType } from '@/pages/Index';

interface ThemeSelectorProps {
  selected: ThemeType;
  onSelect: (theme: ThemeType) => void;
}

const themes: { id: ThemeType; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'education', label: 'Éducation', icon: GraduationCap, color: 'bg-blue-500' },
  { id: 'sante', label: 'Santé', icon: Heart, color: 'bg-red-500' },
  { id: 'eau', label: 'Eau', icon: Droplets, color: 'bg-cyan-500' },
  { id: 'religion', label: 'Religion', icon: Church, color: 'bg-purple-500' },
  { id: 'infrastructure', label: 'Infrastructure', icon: Building2, color: 'bg-orange-500' },
  { id: 'environnement', label: 'Environnement', icon: TreePine, color: 'bg-green-600' },
  { id: 'population', label: 'Population', icon: Users, color: 'bg-amber-500' },
  { id: 'securite', label: 'Sécurité', icon: Shield, color: 'bg-slate-600' },
];

export function ThemeSelector({ selected, onSelect }: ThemeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold">
          2
        </div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Choisir un thème
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onSelect(theme.id)}
            className={`flex flex-col items-center gap-1.5 rounded-lg p-2.5 transition-all ${
              selected === theme.id
                ? 'bg-emerald-50 ring-2 ring-emerald-500 shadow-sm'
                : 'bg-muted/50 hover:bg-muted'
            }`}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${theme.color} text-white`}>
              <theme.icon className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-medium text-center leading-tight">{theme.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}