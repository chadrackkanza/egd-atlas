import { Bell, HelpCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {children}
        <div className="hidden sm:block">
          <h2 className="text-sm font-semibold text-foreground">Tableau de bord</h2>
          <p className="text-[11px] text-muted-foreground">
            Plateforme de cartographie et génération d'atlas territoriaux en RDC
          </p>
        </div>
        <div className="sm:hidden flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500 text-white font-bold text-[10px]">
            EGD
          </div>
          <span className="text-sm font-semibold">EGD Atlas</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <HelpCircle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500" />
        </Button>
        <div className="hidden sm:flex items-center gap-2 ml-2 pl-2 border-l">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium">Prefi Waba</p>
            <Badge variant="secondary" className="h-4 text-[9px] px-1.5 bg-emerald-100 text-emerald-700">
              Premium
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}