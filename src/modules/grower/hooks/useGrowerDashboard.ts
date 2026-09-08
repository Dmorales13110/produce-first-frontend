import { useState, useEffect } from 'react';

// --- Interfaces para el tipado de negocio ---
export interface ActiveFolio {
  id: string;
  folioNumber: string;
  sector: string;
  crop: string;
  boxesCount: number;
  status: 'pending' | 'in_transit' | 'received';
}

export interface HarvestMetric {
  label: string;
  value: string;
  subtext: string;
  color: string;
}

export const useGrowerDashboard = () => {
  const [activeFolios, setActiveFolios] = useState<ActiveFolio[]>([]);
  const [metrics, setMetrics] = useState<HarvestMetric[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulación de carga de datos desde la API de Produce First
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Mock de métricas (UI en Español)
        const mockMetrics: HarvestMetric[] = [
          { label: 'Cajas Cosechadas Hoy', value: '2,450', subtext: '+12% vs ayer', color: 'green.8' },
          { label: 'Folios Activos', value: '14', subtext: '4 pendientes de escaneo', color: 'orange.8' },
          { label: 'Eficiencia de Cuadrilla', value: '94.2%', subtext: 'Meta: 90%', color: 'blue.8' },
        ];

        // Mock de folios en tránsito
        const mockFolios: ActiveFolio[] = [
          { id: 'f1', folioNumber: 'G03-10941', sector: 'Sector 2b-1', crop: 'A Choy Sum', boxesCount: 450, status: 'pending' },
          { id: 'f2', folioNumber: 'G03-10942', sector: 'Sector 2b-1', crop: 'Iceberg Lettuce', boxesCount: 320, status: 'in_transit' },
          { id: 'f3', folioNumber: 'G03-10943', sector: 'Sector 3b-1', crop: 'Gailan', boxesCount: 680, status: 'received' },
        ];

        setMetrics(mockMetrics);
        setActiveFolios(mockFolios);
      } catch (error) {
        console.error("Error loading grower dashboard metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const refreshDashboard = () => {
    // Lógica para volver a pedir datos a la API mutando los estados
    console.log("Refreshing operational dashboard data...");
  };

  return {
    metrics,
    activeFolios,
    isLoading,
    refreshDashboard,
  };
};