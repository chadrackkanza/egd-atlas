import { GraduationCap, Heart, Droplets, Users, Maximize } from 'lucide-react';
import type { ZoneSelection } from '@/pages/Index';

interface StatsPanelProps {
  zone: ZoneSelection;
  stats?: {
    ecoles?: number;
    centresSante?: number;
    pointsEau?: number;
    population?: string;
    superficie?: string;
  };
}

export function StatsPanel({ zone, stats }: StatsPanelProps) {
  const displayed = [
    { icon: GraduationCap, label: 'Écoles', value: stats?.ecoles ?? 0, color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Heart, label: 'Centres de santé', value: stats?.centresSante ?? 0, color: 'text-red-500', bg: 'bg-red-50' },
    { icon: Droplets, label: "Points d'eau", value: stats?.pointsEau ?? 0, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { icon: Users, label: 'Population estimée', value: stats?.population ?? '0', color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: Maximize, label: 'Superficie', value: stats?.superficie ?? '0 km²', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Statistiques
        </h3>
        <span className="text-[10px] text-muted-foreground">{zone.territoire}</span>
      </div>

      <div className="space-y-2">
        {displayed.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground truncate">{stat.label}</p>
              <p className="text-sm font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground text-center">
        Données pour la zone sélectionnée
      </p>
    </div>
  );
}