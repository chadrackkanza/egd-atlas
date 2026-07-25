import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function PageLayout({ children, title, subtitle }: PageLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Barre latérale desktop */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Contenu principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
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

        {/* Contenu de la page */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && <h1 className="text-xl font-bold text-foreground">{title}</h1>}
              {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>

        {/* Navigation mobile inférieure */}
        <MobileNav />
      </div>
    </div>
  );
}