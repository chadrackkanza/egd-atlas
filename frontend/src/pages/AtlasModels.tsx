import { PageLayout } from '@/components/atlas/PageLayout';
import { Button } from '@/components/ui/button';
import { Plus, Map, Heart, GraduationCap, Droplets, Church, Building2 } from 'lucide-react';

const atlasModels = [
  {
    id: 'provincial',
    title: 'Atlas Provincial',
    description: 'Complet',
    icon: Map,
    color: 'bg-blue-500',
    preview: 'Vue complète de la province avec toutes les données administratives',
  },
  {
    id: 'communal',
    title: 'Atlas Communal',
    description: 'Complet',
    icon: Building2,
    color: 'bg-indigo-500',
    preview: 'Atlas détaillé au niveau communal avec infrastructures',
  },
  {
    id: 'sante',
    title: 'Atlas Santé',
    description: 'Infrastructures sanitaires',
    icon: Heart,
    color: 'bg-red-500',
    preview: 'Cartographie des centres de santé, hôpitaux et pharmacies',
  },
  {
    id: 'education',
    title: 'Atlas Éducation',
    description: 'Infrastructures scolaires',
    icon: GraduationCap,
    color: 'bg-amber-500',
    preview: 'Réseau des écoles primaires, secondaires et universités',
  },
  {
    id: 'eau',
    title: 'Atlas Eau',
    description: 'Réseau et points d\'eau',
    icon: Droplets,
    color: 'bg-cyan-500',
    preview: 'Points d\'eau, forages, bornes-fontaines et réseau hydraulique',
  },
  {
    id: 'paroissial',
    title: 'Atlas Paroissial',
    description: 'Paroisses et chapelles',
    icon: Church,
    color: 'bg-purple-500',
    preview: 'Cartographie des lieux de culte et diocèses',
  },
];

export default function AtlasModels() {
  return (
    <PageLayout title="Atlas" subtitle="Choisissez un modèle d'atlas ou créez le vôtre">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {atlasModels.map((model) => (
          <div
            key={model.id}
            className="group relative rounded-xl border bg-card p-5 hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${model.color} text-white mb-4`}>
              <model.icon className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold mb-1">{model.title}</h3>
            <p className="text-xs text-muted-foreground mb-3">{model.description}</p>
            <p className="text-[11px] text-muted-foreground">{model.preview}</p>
            <Button
              size="sm"
              className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Sélectionner
            </Button>
          </div>
        ))}

        {/* Créer un modèle personnalisé */}
        <div className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-50/50 transition-all">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-4">
            <Plus className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold mb-1">Atlas personnalisé</h3>
          <p className="text-xs text-muted-foreground">Créer un atlas sur mesure</p>
        </div>
      </div>
    </PageLayout>
  );
}