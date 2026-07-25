import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import GenerateMap from './pages/GenerateMap';
import AtlasModels from './pages/AtlasModels';
import DataCatalog from './pages/DataCatalog';
import Analytics from './pages/Analytics';
import MyExports from './pages/MyExports';
import History from './pages/History';
import ProfileSettings from './pages/ProfileSettings';
import HelpCenter from './pages/HelpCenter';
import AuthCallback from './pages/AuthCallback';
import AuthError from './pages/AuthError';

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/generate" element={<GenerateMap />} />
    <Route path="/atlas" element={<AtlasModels />} />
    <Route path="/data" element={<DataCatalog />} />
    <Route path="/analytics" element={<Analytics />} />
    <Route path="/exports" element={<MyExports />} />
    <Route path="/history" element={<History />} />
    <Route path="/settings" element={<ProfileSettings />} />
    <Route path="/help" element={<HelpCenter />} />
    <Route path="/auth/callback" element={<AuthCallback />} />
    <Route path="/auth/error" element={<AuthError />} />
  </Routes>
);

const App = () => {
  console.log('Rendu du composant App');
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
export { AppRoutes };