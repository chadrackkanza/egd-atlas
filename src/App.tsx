import { useEffect, useState, Suspense, lazy } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { MobileNav } from './components/layout/MobileNav'
import { GenererCarte } from './pages/GenererCarte'
import { TableauDeBord } from './pages/TableauDeBord'
import { Atlas } from './pages/Atlas'
import { Donnees } from './pages/Donnees'
import { Analyses } from './pages/Analyses'
import { Exports } from './pages/Exports'
import { Historique } from './pages/Historique'
import { Recherche } from './pages/Recherche'
import { Profil } from './pages/Profil'
import { Aide } from './pages/Aide'
import { PlaceholderPage } from './pages/PlaceholderPage'
import type { ViewId } from './types'

const CarteInteractive = lazy(() => import('./pages/CarteInteractive').then(m => ({ default: m.CarteInteractive })))

const VIEW_SEO: Record<ViewId, { title: string; description: string }> = {
  'tableau-de-bord': {
    title: 'Tableau de bord | EGD Atlas',
    description: 'Suivez les activités, les exports et les indicateurs de cartographie territoriale sur EGD Atlas.',
  },
  'carte-interactive': {
    title: 'Carte interactive | EGD Atlas',
    description: 'Explorez les cartes interactives, couches thématiques et zones administratives en République démocratique du Congo.',
  },
  'carte-administrative': {
    title: 'Carte administrative | EGD Atlas',
    description: 'Consultez les limites administratives et les découpages territoriaux sur EGD Atlas.',
  },
  'cartes-thematiques': {
    title: 'Cartes thématiques | EGD Atlas',
    description: 'Accédez aux cartes thématiques santé, éducation, eau et autres thématiques territoriales.',
  },
  'mes-cartes': {
    title: 'Mes cartes | EGD Atlas',
    description: 'Gérez et revisitez vos cartes personnalisées dans la plateforme EGD Atlas.',
  },
  recherche: {
    title: 'Recherche | EGD Atlas',
    description: 'Recherchez des lieux, des infrastructures et des zones géographiques sur EGD Atlas.',
  },
  'generer-carte': {
    title: 'Générer une carte | EGD Atlas',
    description: 'Créez des cartes multi-thématiques à partir des modèles disponibles sur EGD Atlas.',
  },
  atlas: {
    title: 'Atlas | EGD Atlas',
    description: 'Consultez des modèles d’atlas territoriaux et générez des livrables cartographiques structurés.',
  },
  donnees: {
    title: 'Données | EGD Atlas',
    description: 'Accédez au catalogue de données et gérez les ressources géospatiales de votre projet.',
  },
  analyses: {
    title: 'Analyses | EGD Atlas',
    description: 'Visualisez des analyses territoriales et des indicateurs synthétiques sur la plateforme.',
  },
  'mes-exports': {
    title: 'Mes exports | EGD Atlas',
    description: 'Retrouvez vos fichiers exportés et gérez vos livrables cartographiques.',
  },
  historique: {
    title: 'Historique | EGD Atlas',
    description: 'Consultez l’historique complet de vos actions, accès et generations d’exports sur EGD Atlas.',
  },
  parametres: {
    title: 'Paramètres | EGD Atlas',
    description: 'Configurez votre profil et les préférences de la plateforme EGD Atlas.',
  },
  aide: {
    title: 'Aide | EGD Atlas',
    description: 'Trouvez de l’aide, des réponses et des ressources utiles pour exploiter EGD Atlas.',
  },
  profil: {
    title: 'Profil | EGD Atlas',
    description: 'Gérez votre compte, vos préférences et vos paramètres d’utilisation sur EGD Atlas.',
  },
}

function CarteInteractiveFallback() {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-100">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <div className="text-sm text-slate-600 font-medium">Chargement de la carte...</div>
      </div>
    </div>
  )
}

export default function App() {
  const [currentView, setCurrentView] = useState<ViewId>('tableau-de-bord')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const seo = VIEW_SEO[currentView]
    document.title = seo.title

    let description = document.querySelector('meta[name="description"]')
    if (!description) {
      description = document.createElement('meta')
      description.setAttribute('name', 'description')
      document.head.appendChild(description)
    }
    description.setAttribute('content', seo.description)
  }, [currentView])

  const navigate = (view: ViewId) => setCurrentView(view)

  function renderView() {
    switch (currentView) {
      case 'tableau-de-bord':
        return <TableauDeBord onNavigate={navigate} />
      case 'carte-interactive':
      case 'carte-administrative':
      case 'cartes-thematiques':
      case 'mes-cartes':
        return (
          <Suspense fallback={<CarteInteractiveFallback />}>
            <CarteInteractive onNavigate={navigate} />
          </Suspense>
        )
      case 'generer-carte':
        return <GenererCarte onNavigate={navigate} />
      case 'atlas':
        return <Atlas onNavigate={navigate} />
      case 'donnees':
        return <Donnees />
      case 'analyses':
        return <Analyses />
      case 'mes-exports':
        return <Exports />
      case 'historique':
        return <Historique />
      case 'profil':
      case 'parametres':
        return <Profil />
      case 'aide':
        return <Aide />
      case 'recherche':
        return <Recherche onNavigate={navigate} />
      default:
        return (
          <PlaceholderPage
            title="En cours de développement"
            icon="🚧"
            description="Cette section sera disponible prochainement."
          />
        )
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(c => !c)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header currentView={currentView} onNavigate={navigate} />
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden" aria-label="Contenu principal de la plateforme">
          {renderView()}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav currentView={currentView} onNavigate={navigate} />
    </div>
  )
}
