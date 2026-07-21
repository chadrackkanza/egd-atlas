import { FileText, Image, ImageIcon, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

const exportFormats = [
  { icon: FileText, label: 'PDF', desc: 'Document imprimable' },
  { icon: Image, label: 'PNG', desc: 'Image haute qualité' },
  { icon: ImageIcon, label: 'JPG', desc: 'Image compressée' },
];

export function ExportPanel() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold">
          5
        </div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Exporter la carte
        </h3>
      </div>

      <div className="space-y-2">
        {exportFormats.map((format) => (
          <button
            key={format.label}
            className="flex w-full items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <format.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold">{format.label}</p>
              <p className="text-[10px] text-muted-foreground">{format.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <Button variant="ghost" size="sm" className="w-full text-xs h-8 gap-1.5 text-muted-foreground">
        <MoreHorizontal className="h-3.5 w-3.5" />
        Plus d'options
      </Button>
    </div>
  );
}