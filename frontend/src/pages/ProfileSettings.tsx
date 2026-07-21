import { useState } from 'react';
import { PageLayout } from '@/components/atlas/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Shield, Settings, CreditCard } from 'lucide-react';

const tabs = [
  { id: 'profil', label: 'Profil', icon: User },
  { id: 'securite', label: 'Sécurité', icon: Shield },
  { id: 'preferences', label: 'Préférences', icon: Settings },
  { id: 'abonnement', label: 'Abonnement', icon: CreditCard },
];

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState('profil');

  return (
    <PageLayout title="Paramètres du compte" subtitle="Gérez vos informations personnelles et préférences">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-2xl">
        {activeTab === 'profil' && (
          <div className="rounded-xl border bg-card p-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                Changer la photo
              </Button>
            </div>

            {/* Form */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Nom complet</Label>
                <Input defaultValue="Prefi Waba" className="mt-1.5" />
              </div>
              <div>
                <Label className="text-xs">Organisation</Label>
                <Input defaultValue="EcoleMobi" className="mt-1.5" />
              </div>
              <div>
                <Label className="text-xs">Email</Label>
                <Input defaultValue="prefina.waba.egd@outlook.com" type="email" className="mt-1.5" />
              </div>
              <div>
                <Label className="text-xs">Téléphone</Label>
                <Input defaultValue="+243 81 234 5678" className="mt-1.5" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" size="sm">Annuler</Button>
              <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                Enregistrer
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'securite' && (
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <h3 className="text-sm font-semibold">Changer le mot de passe</h3>
            <div className="space-y-3 max-w-sm">
              <div>
                <Label className="text-xs">Mot de passe actuel</Label>
                <Input type="password" className="mt-1.5" />
              </div>
              <div>
                <Label className="text-xs">Nouveau mot de passe</Label>
                <Input type="password" className="mt-1.5" />
              </div>
              <div>
                <Label className="text-xs">Confirmer le mot de passe</Label>
                <Input type="password" className="mt-1.5" />
              </div>
            </div>
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white mt-4">
              Mettre à jour
            </Button>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <h3 className="text-sm font-semibold">Préférences d'affichage</h3>
            <div className="space-y-3 max-w-sm">
              <div>
                <Label className="text-xs">Langue</Label>
                <Input defaultValue="Français" className="mt-1.5" disabled />
              </div>
              <div>
                <Label className="text-xs">Région par défaut</Label>
                <Input defaultValue="Kinshasa" className="mt-1.5" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'abonnement' && (
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Plan Premium</h3>
                <p className="text-xs text-muted-foreground mt-1">Accès complet à toutes les fonctionnalités</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                Actif
              </div>
            </div>
            <div className="rounded-lg bg-muted/30 p-4 text-xs text-muted-foreground">
              <p>Prochain renouvellement : 20/07/2026</p>
              <p className="mt-1">Exports HD illimités • Données complètes • Analyses avancées</p>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}