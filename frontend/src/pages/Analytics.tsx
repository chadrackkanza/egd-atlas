import { PageLayout } from '@/components/atlas/PageLayout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Users, Activity, MapPin } from 'lucide-react';

const kpiCards = [
  { label: 'Total centres de santé', value: '12', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
  { label: 'Habitants', value: '125 430', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Ratio (pour 10 000 hab.)', value: '0.96', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Villages couverts', value: '68%', icon: MapPin, color: 'text-amber-500', bg: 'bg-amber-50' },
];

const barData = [
  { name: 'Joli-Parc', value: 4 },
  { name: 'Kintambo', value: 3 },
  { name: 'Ngaliema', value: 2 },
  { name: 'Lemba', value: 2 },
  { name: 'Matete', value: 1 },
];

const pieData = [
  { label: 'Hôpital Général', value: 25, color: 'bg-blue-500' },
  { label: 'Centre de Santé', value: 50, color: 'bg-emerald-500' },
  { label: 'Poste de Santé', value: 25, color: 'bg-amber-500' },
];

export default function Analytics() {
  return (
    <PageLayout title="Analyses" subtitle="Statistiques et indicateurs pour la zone sélectionnée">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-xl border bg-card">
        <span className="text-xs font-medium text-muted-foreground">Statistiques –</span>
        <span className="text-xs font-semibold">Centres de santé</span>
        <div className="flex items-center gap-2 ml-auto">
          <Select defaultValue="kintambo">
            <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="kintambo" className="text-xs">Kintambo</SelectItem>
              <SelectItem value="ngaliema" className="text-xs">Ngaliema</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="2024">
            <SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2024" className="text-xs">2024</SelectItem>
              <SelectItem value="2023" className="text-xs">2023</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="h-8 text-xs bg-emerald-500 hover:bg-emerald-600 text-white">
            Calculer
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Bar Chart */}
        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Centres de santé par quartier</h3>
          <div className="space-y-3">
            {barData.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-20 truncate">{item.name}</span>
                <div className="flex-1 h-7 bg-muted/50 rounded-md overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-md flex items-center justify-end pr-2 transition-all"
                    style={{ width: `${(item.value / 4) * 100}%` }}
                  >
                    <span className="text-[10px] font-bold text-white">{item.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Catégorie</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative h-40 w-40">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="20" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="#10b981" strokeWidth="20"
                  strokeDasharray="125.6 251.2"
                  strokeDashoffset="0"
                />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="#3b82f6" strokeWidth="20"
                  strokeDasharray="62.8 251.2"
                  strokeDashoffset="-125.6"
                />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="#f59e0b" strokeWidth="20"
                  strokeDasharray="62.8 251.2"
                  strokeDashoffset="-188.4"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            {pieData.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${item.color}`} />
                  <span className="text-xs">{item.label}</span>
                </div>
                <span className="text-xs font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}