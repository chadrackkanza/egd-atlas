import { useState } from 'react';
import { PageLayout } from '@/components/atlas/PageLayout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight, MapPin, Palette, Layers, Eye } from 'lucide-react';
import {
  GraduationCap,
  Heart,
  Droplets,
  Church,
  Building2,
  TreePine,
  Users,
  Shield,
} from 'lucide-react';

const steps = [
  { id: 1, label: 'Zone', icon: MapPin },
  { id: 2, label: 'Thème', icon: Palette },
  { id: 3, label: 'Éléments', icon: Layers },
  { id: 4, label: 'Aperçu', icon: Eye },
];

const themes = [
  { id: 'education', label: 'Éducation', icon: GraduationCap, color: 'bg-blue-500' },
  { id: 'sante', label: 'Santé', icon: Heart, color: 'bg-red-500' },
  { id: 'eau', label: 'Eau', icon: Droplets, color: 'bg-cyan-500' },
  { id: 'religion', label: 'Religion', icon: Church, color: 'bg-purple-500' },
  { id: 'infrastructure', label: 'Infrastructure', icon: Building2, color: 'bg-orange-500' },
  { id: 'environnement', label: 'Environnement', icon: TreePine, color: 'bg-green-600' },
  { id: 'population', label: 'Population', icon: Users, color: 'bg-amber-500' },
  { id: 'securite', label: 'Sécurité', icon: Shield, color: 'bg-slate-600' },
];

const elements = [
  { id: 'centres_sante', label: 'Centres de santé', checked: true },
  { id: 'hopitaux', label: 'Hôpitaux', checked: true },
  { id: 'points_eau', label: "Points d'eau", checked: true },
  { id: 'routes', label: 'Routes principales', checked: true },
  { id: 'ecoles', label: 'Écoles', checked: false },
  { id: 'paroisses', label: 'Paroisses / Églises', checked: false },
  { id: 'limites', label: 'Limites des quartiers', checked: true },
];

export default function GenerateMap() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState('sante');
  const [selectedElements, setSelectedElements] = useState(
    elements.reduce((acc, el) => ({ ...acc, [el.id]: el.checked }), {} as Record<string, boolean>)
  );

  const toggleElement = (id: string) => {
    setSelectedElements((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <PageLayout title="Générer une carte" subtitle="Créez une carte personnalisée en 4 étapes">
      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                currentStep === step.id
                  ? 'bg-emerald-500 text-white'
                  : currentStep > step.id
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <step.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.id}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${currentStep > step.id ? 'bg-emerald-500' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto bg-card rounded-xl border p-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">1. Choisir une zone</h2>
            <p className="text-sm text-muted-foreground">Sélectionnez la zone géographique pour votre carte</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Province</label>
                <Select defaultValue="kinshasa">
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kinshasa">Kinshasa</SelectItem>
                    <SelectItem value="kongo">Kongo-Central</SelectItem>
                    <SelectItem value="kwilu">Kwilu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Territoire / Commune</label>
                <Select defaultValue="kintambo">
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kintambo">Kintambo</SelectItem>
                    <SelectItem value="ngaliema">Ngaliema</SelectItem>
                    <SelectItem value="limete">Limete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Quartier</label>
                <Select defaultValue="joli-parc">
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="joli-parc">Joli-Parc</SelectItem>
                    <SelectItem value="magasin">Kintambo Magasin</SelectItem>
                    <SelectItem value="pecheurs">Kintambo Pêcheurs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">2. Choisir un thème</h2>
            <p className="text-sm text-muted-foreground">Sélectionnez le thème principal de votre carte</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`flex flex-col items-center gap-2 rounded-xl p-4 transition-all border ${
                    selectedTheme === theme.id
                      ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                      : 'border-border hover:border-muted-foreground/30 hover:bg-muted/50'
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${theme.color} text-white`}>
                    <theme.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">3. Choisir les éléments</h2>
            <p className="text-sm text-muted-foreground">Sélectionnez les données à afficher sur votre carte</p>
            <div className="space-y-2">
              {elements.map((el) => (
                <label
                  key={el.id}
                  className="flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={selectedElements[el.id]}
                    onCheckedChange={() => toggleElement(el.id)}
                  />
                  <span className="text-sm font-medium">{el.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">4. Aperçu et génération</h2>
            <p className="text-sm text-muted-foreground">Configurez les options finales avant de générer</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Format</label>
                <Select defaultValue="a4">
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4 Paysage</SelectItem>
                    <SelectItem value="a3">A3 Paysage</SelectItem>
                    <SelectItem value="a4p">A4 Portrait</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Orientation</label>
                <Select defaultValue="paysage">
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paysage">Paysage</SelectItem>
                    <SelectItem value="portrait">Portrait</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Résolution</label>
                <Select defaultValue="high">
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Haute (300 dpi)</SelectItem>
                    <SelectItem value="medium">Moyenne (150 dpi)</SelectItem>
                    <SelectItem value="low">Basse (72 dpi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4 mt-4">
              <h4 className="text-xs font-semibold mb-2">Résumé</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span>Zone :</span><span className="font-medium text-foreground">Kintambo, Joli-Parc</span>
                <span>Thème :</span><span className="font-medium text-foreground capitalize">{selectedTheme}</span>
                <span>Éléments :</span><span className="font-medium text-foreground">{Object.values(selectedElements).filter(Boolean).length} sélectionnés</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="gap-1.5"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>
          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep((s) => Math.min(4, s + 1))}
              className="gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button className="gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white">
              Générer la carte
            </Button>
          )}
        </div>
      </div>
    </PageLayout>
  );
}