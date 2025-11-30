import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { vessels } from '@/data/vessels';

const getMarkerColor = (status: string, bioScore: number) => {
  if (status === 'manutencao') return '#f59e0b';
  if (bioScore >= 70) return '#ef4444';
  if (bioScore >= 40) return '#f59e0b';
  return '#10b981';
};

const createCustomIcon = (status: string, bioScore: number) => {
  const color = getMarkerColor(status, bioScore);
  return L.divIcon({
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M20.5 10.5v.5h-2v-.5a7 7 0 0 0-14 0v.5h-2v-.5a9 9 0 0 1 18 0z"/>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="white" fill-opacity="0.9"/>
        </svg>
      </div>
    `,
    className: 'custom-vessel-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export function VesselMap() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center: [-15, -30],
      zoom: 3,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(mapRef.current);

    vessels.forEach((vessel) => {
      const marker = L.marker([vessel.latitude, vessel.longitude], {
        icon: createCustomIcon(vessel.status, vessel.bioScore),
      }).addTo(mapRef.current!);

      const statusColors: Record<string, string> = {
        navegando: '#10b981',
        atracado: '#3b82f6',
        manutencao: '#f59e0b',
      };

      const statusLabels: Record<string, string> = {
        navegando: 'Navegando',
        atracado: 'Atracado',
        manutencao: 'Em Manutenção',
      };

      marker.bindPopup(`
        <div style="min-width: 220px; font-family: 'Inter', sans-serif;">
          <h3 style="margin: 0 0 8px 0; font-weight: 600; font-size: 14px;">${vessel.name}</h3>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
            <span style="
              display: inline-block;
              padding: 2px 8px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 500;
              background: ${statusColors[vessel.status]}22;
              color: ${statusColors[vessel.status]};
            ">${statusLabels[vessel.status]}</span>
            <span style="font-size: 12px; color: #888;">${vessel.class}</span>
          </div>
          <div style="font-size: 12px; color: #666; line-height: 1.6;">
            <div><strong>Bio Score:</strong> <span style="color: ${getMarkerColor(vessel.status, vessel.bioScore)}">${vessel.bioScore}%</span></div>
            <div><strong>Velocidade:</strong> ${vessel.speed} nós</div>
            <div><strong>Consumo:</strong> ${vessel.fuelConsumption} ton/dia</div>
            <div><strong>CO₂:</strong> ${vessel.co2Emissions} ton/dia</div>
            <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #eee;">
              <strong>Última Limpeza:</strong> ${new Date(vessel.lastCleaning).toLocaleDateString('pt-BR')}
            </div>
            <div><strong>Próxima Limpeza:</strong> ${new Date(vessel.nextCleaning).toLocaleDateString('pt-BR')}</div>
          </div>
        </div>
      `, {
        className: 'custom-popup',
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-border">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border">
        <div className="text-xs font-medium mb-2 text-muted-foreground">Legenda</div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs">Bio Score Baixo (&lt;40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-xs">Bio Score Médio (40-70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs">Bio Score Alto (&gt;70%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
