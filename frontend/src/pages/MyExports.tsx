import { PageLayout } from '@/components/atlas/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Share2, Trash2, FileText, Image } from 'lucide-react';

const exports = [
  {
    title: 'Carte Santé Kintambo',
    zone: 'Kintambo',
    theme: 'Santé',
    format: 'PDF',
    date: '20/06/2026',
  },
  {
    title: 'Carte Éducation Kinshasa',
    zone: 'Kinshasa',
    theme: 'Éducation',
    format: 'PDF',
    date: '18/06/2026',
  },
  {
    title: 'Carte Eau Joli-Parc',
    zone: 'Joli-Parc',
    theme: 'Eau',
    format: 'PNG',
    date: '17/06/2026',
  },
  {
    title: 'Carte Paroisses',
    zone: 'Kinshasa',
    theme: 'Religion',
    format: 'PDF',
    date: '15/06/2026',
  },
];

const themeColors: Record<string, string> = {
  Santé: 'bg-red-100 text-red-700',
  Éducation: 'bg-blue-100 text-blue-700',
  Eau: 'bg-cyan-100 text-cyan-700',
  Religion: 'bg-purple-100 text-purple-700',
};

export default function MyExports() {
  return (
    <PageLayout title="Mes exports" subtitle="Cartes générées et téléchargées">
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Titre</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden sm:table-cell">Zone</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Thème</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Format</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden sm:table-cell">Date</th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exports.map((item, idx) => (
                <tr key={idx} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        {item.format === 'PDF' ? (
                          <FileText className="h-4 w-4 text-red-500" />
                        ) : (
                          <Image className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs text-muted-foreground">{item.zone}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge variant="secondary" className={`text-[10px] ${themeColors[item.theme] || ''}`}>
                      {item.theme}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-[10px] font-mono">{item.format}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Share2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
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