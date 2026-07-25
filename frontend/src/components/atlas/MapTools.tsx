import { MousePointer2, Ruler, PenTool, Printer, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const tools = [
  { icon: MousePointer2, label: 'Sélection' },
  { icon: Ruler, label: 'Mesurer' },
  { icon: PenTool, label: 'Annotation' },
  { icon: Printer, label: 'Imprimer' },
];

interface MapToolsProps {
  onReset?: () => void;
}

export function MapTools({ onReset }: MapToolsProps) {
  const [activeTool, setActiveTool] = useState<string>('Sélection');
  const { toast } = useToast();

  const selectTool = (label: string) => {
    setActiveTool(label);
    toast({ title: label, description: 'Outil activé', duration: 2000 });
  };

  const handleReset = () => {
    if (onReset) onReset();
    toast({ title: 'Réinitialisé', description: 'Paramètres de la carte remis par défaut', duration: 2000 });
  };

  return (
    <div className="flex items-center justify-between border-t bg-card px-4 py-2.5">
      {/* Gauche : options de carte */}
      <div className="hidden md:flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Map className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[10px] font-medium text-muted-foreground">Fond :</span>
          <Select defaultValue="osm">
            <SelectTrigger className="h-7 w-32 text-[10px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="osm" className="text-xs">OpenStreetMap</SelectItem>
              <SelectItem value="satellite" className="text-xs">Satellite</SelectItem>
              <SelectItem value="terrain" className="text-xs">Terrain</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Centre : outils */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-medium text-muted-foreground mr-2 hidden sm:inline">Outils :</span>
        {tools.map((tool) => (
          <Button
            key={tool.label}
            variant={activeTool === tool.label ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => selectTool(tool.label)}
            className="h-8 gap-1.5 text-[11px] px-2.5"
          >
            <tool.icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{tool.label}</span>
          </Button>
        ))}
      </div>

      {/* Droite : réinitialisation */}
      <Button variant="outline" size="sm" className="h-7 text-[10px] px-2.5" onClick={handleReset}>
        Réinitialiser
      </Button>
    </div>
  );
}