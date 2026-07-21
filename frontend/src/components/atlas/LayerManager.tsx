import { Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import type { LayerState } from '@/pages/Index';

interface LayerManagerProps {
  layers: LayerState;
  setLayers: (layers: LayerState) => void;
}

const layerItems: { key: keyof LayerState; label: string; color: string }[] = [
  { key: 'ecoles', label: 'Écoles', color: 'bg-blue-500' },
  { key: 'centresSante', label: 'Centres de santé', color: 'bg-red-500' },
  { key: 'pointsEau', label: "Points d'eau", color: 'bg-cyan-500' },
  { key: 'routesPrincipales', label: 'Routes principales', color: 'bg-orange-500' },
  { key: 'limitesQuartiers', label: 'Limites des quartiers', color: 'bg-gray-500' },
  { key: 'paroisses', label: 'Paroisses / Églises', color: 'bg-purple-500' },
];

export function LayerManager({ layers, setLayers }: LayerManagerProps) {
  const toggleLayer = (key: keyof LayerState) => {
    setLayers({ ...layers, [key]: !layers[key] });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold">
          3
        </div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Éléments à afficher
        </h3>
      </div>

      <div className="space-y-1.5">
        {layerItems.map((item) => (
          <label
            key={item.key}
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/50 cursor-pointer transition-colors"
          >
            <Checkbox
              checked={layers[item.key]}
              onCheckedChange={() => toggleLayer(item.key)}
              className="h-4 w-4"
            />
            <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
            <span className="text-xs font-medium">{item.label}</span>
          </label>
        ))}
      </div>

      <Button variant="outline" size="sm" className="w-full text-xs h-8 gap-1.5">
        <Plus className="h-3.5 w-3.5" />
        Ajouter un élément
      </Button>
    </div>
  );
}