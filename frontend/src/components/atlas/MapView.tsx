import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { ZoneSelection, LayerState, ThemeType } from '@/pages/Index';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  zone: ZoneSelection;
  layers: LayerState;
  selectedTheme: ThemeType;
}

// Correction de l’icône par défaut du marqueur.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createIcon(color: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

// Exemples de points de données pour la zone de Kintambo.
const samplePoints = {
  ecoles: [
    { lat: -4.327, lng: 15.285, name: 'École Primaire Kintambo' },
    { lat: -4.325, lng: 15.290, name: 'Institut Technique Joli-Parc' },
    { lat: -4.330, lng: 15.282, name: 'Lycée de Kintambo' },
    { lat: -4.322, lng: 15.288, name: 'École Maternelle Soleil' },
    { lat: -4.329, lng: 15.295, name: 'Complexe Scolaire Avenir' },
  ],
  centresSante: [
    { lat: -4.326, lng: 15.292, name: 'Centre de Santé Kintambo' },
    { lat: -4.323, lng: 15.286, name: 'Clinique Joli-Parc' },
    { lat: -4.331, lng: 15.289, name: 'Dispensaire Communal' },
  ],
  pointsEau: [
    { lat: -4.328, lng: 15.287, name: "Point d'eau Kintambo 1" },
    { lat: -4.324, lng: 15.291, name: "Fontaine Joli-Parc" },
    { lat: -4.332, lng: 15.284, name: "Borne-fontaine Magasin" },
    { lat: -4.326, lng: 15.296, name: "Point d'eau Gare" },
  ],
  paroisses: [
    { lat: -4.325, lng: 15.293, name: 'Paroisse Saint-Pierre' },
    { lat: -4.329, lng: 15.280, name: 'Église Évangélique' },
  ],
};

const layerColors: Record<string, string> = {
  ecoles: '#3b82f6',
  centresSante: '#ef4444',
  pointsEau: '#06b6d4',
  paroisses: '#a855f7',
};

function MapContent({ layers }: { layers: LayerState }) {
  return (
    <>
      {layers.ecoles && samplePoints.ecoles.map((p, i) => (
        <Marker key={`ecole-${i}`} position={[p.lat, p.lng]} icon={createIcon(layerColors.ecoles)}>
          <Popup><span className="text-xs font-medium">{p.name}</span></Popup>
        </Marker>
      ))}
      {layers.centresSante && samplePoints.centresSante.map((p, i) => (
        <Marker key={`sante-${i}`} position={[p.lat, p.lng]} icon={createIcon(layerColors.centresSante)}>
          <Popup><span className="text-xs font-medium">{p.name}</span></Popup>
        </Marker>
      ))}
      {layers.pointsEau && samplePoints.pointsEau.map((p, i) => (
        <Marker key={`eau-${i}`} position={[p.lat, p.lng]} icon={createIcon(layerColors.pointsEau)}>
          <Popup><span className="text-xs font-medium">{p.name}</span></Popup>
        </Marker>
      ))}
      {layers.paroisses && samplePoints.paroisses.map((p, i) => (
        <Marker key={`paroisse-${i}`} position={[p.lat, p.lng]} icon={createIcon(layerColors.paroisses)}>
          <Popup><span className="text-xs font-medium">{p.name}</span></Popup>
        </Marker>
      ))}
    </>
  );
}

export function MapView({ zone, layers, selectedTheme }: MapViewProps) {
  const center: [number, number] = [-4.327, 15.288];

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={center}
        zoom={15}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapContent layers={layers} />
      </MapContainer>

      {/* Superposition de la légende */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Légende</h4>
        <div className="space-y-1.5">
          {layers.ecoles && (
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span className="text-[10px]">Écoles</span>
            </div>
          )}
          {layers.centresSante && (
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="text-[10px]">Centres de santé</span>
            </div>
          )}
          {layers.pointsEau && (
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
              <span className="text-[10px]">Points d'eau</span>
            </div>
          )}
          {layers.paroisses && (
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-purple-500" />
              <span className="text-[10px]">Paroisses / Églises</span>
            </div>
          )}
          {layers.routesPrincipales && (
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-5 rounded bg-orange-500" />
              <span className="text-[10px]">Routes principales</span>
            </div>
          )}
          {layers.limitesQuartiers && (
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-5 border border-dashed border-gray-500" />
              <span className="text-[10px]">Limites des quartiers</span>
            </div>
          )}
        </div>
      </div>

      {/* Barre d’échelle */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white/90 rounded px-2 py-1">
        <span className="text-[9px] text-muted-foreground">500 m</span>
      </div>
    </div>
  );
}