import { PageLayout } from '@/components/atlas/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Map, Database, BookOpen, BarChart3, ChevronRight, MessageCircle } from 'lucide-react';

const quickGuides = [
  { icon: Map, label: 'Générer une carte', color: 'bg-blue-500' },
  { icon: Database, label: 'Importer des données', color: 'bg-emerald-500' },
  { icon: BookOpen, label: 'Créer un atlas', color: 'bg-purple-500' },
  { icon: BarChart3, label: 'Analyser des données', color: 'bg-amber-500' },
];

const articles = [
  'Comment générer une carte ?',
  'Comment exporter ma carte en PDF ?',
  'Comment ajouter mes propres données ?',
  'Comment créer un atlas ?',
  'Comment utiliser les filtres de zone ?',
  'Comment partager une carte ?',
];

export default function HelpCenter() {
  return (
    <PageLayout title="Centre d'aide" subtitle="Trouvez des réponses à vos questions">
      {/* Search */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans l'aide..."
            className="h-12 pl-12 text-sm rounded-xl"
          />
        </div>
      </div>

      {/* Quick Guides */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold mb-4">Guides rapides</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickGuides.map((guide) => (
            <button
              key={guide.label}
              className="flex flex-col items-center gap-3 rounded-xl border bg-card p-5 hover:shadow-md hover:border-emerald-200 transition-all"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${guide.color} text-white`}>
                <guide.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-center">{guide.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold mb-4">Articles populaires</h2>
        <div className="rounded-xl border bg-card divide-y">
          {articles.map((article) => (
            <button
              key={article}
              className="flex w-full items-center justify-between px-5 py-3.5 hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm">{article}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="rounded-xl border bg-card p-6 text-center max-w-md mx-auto">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 mx-auto mb-3">
          <MessageCircle className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="text-sm font-semibold mb-1">Contacter le support</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Une question ? Notre équipe est là pour vous aider.
        </p>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs">
          Envoyer une demande
        </Button>
      </div>
    </PageLayout>
  );
}