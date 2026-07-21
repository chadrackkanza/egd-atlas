import { PageLayout } from '@/components/atlas/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Eye, Filter } from 'lucide-react';

const datasets = [
  { name: 'Limites administratives', theme: 'Administration', source: 'IGRDC', date: '2024', format: 'SHP' },
  { name: 'Écoles', theme: 'Éducation', source: 'EDUC-NC', date: '2024', format: 'SHP' },
  { name: 'Centres de santé', theme: 'Santé', source: 'MSP RDC', date: '2024', format: 'SHP' },
  { name: "Points d'eau", theme: 'Eau', source: 'RDC Eau', date: '2023', format: 'SHP' },
  { name: 'Routes principales', theme: 'Infrastructure', source: 'OVG', date: '2024', format: 'SHP' },
  { name: 'Paroisses', theme: 'Religion', source: 'Diocèse', date: '2024', format: 'SHP' },
  { name: 'Occupation du sol 2023', theme: 'Environnement', source: 'ESA', date: '2023', format: 'TIF' },
  { name: 'Population par quartier', theme: 'Population', source: 'INS', date: '2024', format: 'CSV' },
];

const themeColors: Record<string, string> = {
  Administration: 'bg-gray-100 text-gray-700',
  Éducation: 'bg-blue-100 text-blue-700',
  Santé: 'bg-red-100 text-red-700',
  Eau: 'bg-cyan-100 text-cyan-700',
  Infrastructure: 'bg-orange-100 text-orange-700',
  Religion: 'bg-purple-100 text-purple-700',
  Environnement: 'bg-green-100 text-green-700',
  Population: 'bg-amber-100 text-amber-700',
};

export default function DataCatalog() {
  return (
    <PageLayout title="Données" subtitle="Catalogue de données géographiques disponibles">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher une donnée..." className="pl-9" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtrer
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Nom de la donnée</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden sm:table-cell">Thème</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Source</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Format</th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((dataset, idx) => (
                <tr key={idx} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium">{dataset.name}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant="secondary" className={`text-[10px] ${themeColors[dataset.theme] || ''}`}>
                      {dataset.theme}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-muted-foreground">{dataset.source}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-muted-foreground">{dataset.date}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-[10px] font-mono">{dataset.format}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}