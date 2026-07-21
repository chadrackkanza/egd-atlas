import { useState } from 'react';
import { Sidebar } from '@/components/atlas/Sidebar';
import { Header } from '@/components/atlas/Header';
import { ZoneSelector } from '@/components/atlas/ZoneSelector';
import { ThemeSelector } from '@/components/atlas/ThemeSelector';
import { LayerManager } from '@/components/atlas/LayerManager';
import { MapView } from '@/components/atlas/MapView';
import { MapTools } from '@/components/atlas/MapTools';
import { ExportPanel } from '@/components/atlas/ExportPanel';
import { StatsPanel } from '@/components/atlas/StatsPanel';
import { MobileNav } from '@/components/atlas/MobileNav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ThemeType = 'education' | 'sante' | 'eau' | 'religion' | 'infrastructure' | 'environnement' | 'population' | 'securite';

export interface ZoneSelection {
  province: string;
  territoire: string;
  quartier: string;
}

export interface LayerState {
  ecoles: boolean;
  centresSante: boolean;
  pointsEau: boolean;
  routesPrincipales: boolean;
  limitesQuartiers: boolean;
  paroisses: boolean;
}

export default function Index() {
  const [zone, setZone] = useState<ZoneSelection>({
    province: 'Kinshasa',
    territoire: 'Kintambo',
    quartier: 'Joli-Parc',
  });
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('education');
  const [layers, setLayers] = useState<LayerState>({
    ecoles: true,
    centresSante: true,
    pointsEau: true,
    routesPrincipales: false,
    limitesQuartiers: true,
    paroisses: false,
  });
  const [mobileTab, setMobileTab] = useState<'carte' | 'couches' | 'exporter'>('carte');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </Header>

        {/* Mobile Tabs */}
        <div className="flex lg:hidden border-b bg-card">
          {(['carte', 'couches', 'exporter'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                mobileTab === tab
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Configuration */}
          <div className={`w-full lg:w-80 xl:w-96 overflow-y-auto border-r bg-card p-4 space-y-5 ${
            mobileTab !== 'couches' ? 'hidden lg:block' : ''
          }`}>
            <ZoneSelector zone={zone} setZone={setZone} />
            <ThemeSelector selected={selectedTheme} onSelect={setSelectedTheme} />
            <LayerManager layers={layers} setLayers={setLayers} />
          </div>

          {/* Map + Tools Area */}
          <div className={`flex-1 flex flex-col overflow-hidden ${
            mobileTab !== 'carte' ? 'hidden lg:flex' : 'flex'
          }`}>
            {/* Map */}
            <div className="flex-1 relative">
              <MapView zone={zone} layers={layers} selectedTheme={selectedTheme} />
            </div>

            {/* Map Tools */}
            <MapTools />
          </div>

          {/* Right Panel - Export & Stats */}
          <div className={`w-full lg:w-72 xl:w-80 overflow-y-auto border-l bg-card p-4 space-y-5 ${
            mobileTab !== 'exporter' ? 'hidden lg:block' : ''
          }`}>
            <ExportPanel />
            <StatsPanel zone={zone} />
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <MobileNav />
      </div>
    </div>
  );
}