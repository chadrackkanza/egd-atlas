import { PageLayout } from '@/components/atlas/PageLayout';
import { Button } from '@/components/ui/button';
import { Clock, FileText, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchHistory } from '@/lib/backend';

export default function History() {
  const { data: history = [] } = useQuery({ queryKey: ['history'], queryFn: fetchHistory, staleTime: 1000 * 60 });

  return (
    <PageLayout title="Historique" subtitle="Actions et exports récents">
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="p-4">
          <ul className="space-y-3">
            {history.length === 0 && (
              <li className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" /> Aucune entrée d'historique pour le moment.
              </li>
            )}
            {history.map((h: any, idx: number) => (
              <li key={idx} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{h.title || 'Export'}</div>
                    <div className="text-[11px] text-muted-foreground">{h.meta || ''}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">{h.date}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}
