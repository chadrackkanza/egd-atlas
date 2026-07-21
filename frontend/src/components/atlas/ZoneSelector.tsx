import { MapPin, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { ZoneSelection } from '@/pages/Index';

interface ZoneSelectorProps {
  zone: ZoneSelection;
  setZone: (zone: ZoneSelection) => void;
}

const provinces = ['Kinshasa', 'Kongo-Central', 'Kwilu', 'Haut-Katanga', 'Nord-Kivu', 'Sud-Kivu'];
const territoires: Record<string, string[]> = {
  Kinshasa: ['Kintambo', 'Ngaliema', 'Limete', 'Kalamu', 'Mont Ngafula', 'Gombe', 'Barumbu'],
};
const quartiers: Record<string, string[]> = {
  Kintambo: ['Joli-Parc', 'Kintambo Magasin', 'Kintambo Pêcheurs', 'Kintambo Gare'],
  Ngaliema: ['Binza-Pigeon', 'Binza-Ozone', 'Joli-Site'],
};

export function ZoneSelector({ zone, setZone }: ZoneSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold">
          1
        </div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Choisir une zone
        </h3>
      </div>

      <div className="space-y-2.5">
        <div>
          <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Province</label>
          <Select
            value={zone.province}
            onValueChange={(val) => setZone({ ...zone, province: val })}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((p) => (
                <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Territoire / Commune</label>
          <Select
            value={zone.territoire}
            onValueChange={(val) => setZone({ ...zone, territoire: val })}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(territoires[zone.province] || territoires['Kinshasa']).map((t) => (
                <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Secteur / Quartier</label>
          <Select
            value={zone.quartier}
            onValueChange={(val) => setZone({ ...zone, quartier: val })}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(quartiers[zone.territoire] || quartiers['Kintambo']).map((q) => (
                <SelectItem key={q} value={q} className="text-xs">{q}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Rechercher un lieu..."
            className="h-9 pl-8 text-xs"
          />
        </div>
      </div>
    </div>
  );
}