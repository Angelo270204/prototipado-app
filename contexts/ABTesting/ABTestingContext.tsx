/**
 * A/B Testing Context
 * Sistema de pruebas A/B para experimentación controlada
 * 
 * Características:
 * - Asignación aleatoria de variantes (50/50)
 * - Persistencia de variantes por usuario
 * - Tracking de eventos y métricas
 * - Soporte para múltiples experimentos simultáneos
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ==================== TIPOS ====================

export type VariantType = 'A' | 'B';

export interface ExperimentConfig {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface ExperimentVariant {
  experimentId: string;
  variant: VariantType;
  assignedAt: string;
}

export interface MetricEvent {
  experimentId: string;
  variant: VariantType;
  eventType: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ExperimentMetrics {
  experimentId: string;
  variant: VariantType;
  events: MetricEvent[];
  totalEvents: number;
  uniqueSessions: number;
}

interface ABTestingContextType {
  // Obtener variante de un experimento
  getVariant: (experimentId: string) => VariantType;
  
  // Verificar si está en variante específica
  isVariant: (experimentId: string, variant: VariantType) => boolean;
  
  // Tracking de eventos
  trackEvent: (experimentId: string, eventType: string, metadata?: Record<string, any>) => void;
  
  // Obtener métricas
  getMetrics: (experimentId: string) => ExperimentMetrics | null;
  
  // Gestión de experimentos
  experiments: ExperimentConfig[];
  activeExperiments: ExperimentConfig[];
  
  // Reset (solo para testing)
  resetExperiment: (experimentId: string) => void;
  resetAllExperiments: () => void;
}

// ==================== CONFIGURACIÓN DE EXPERIMENTOS ====================

const EXPERIMENTS: ExperimentConfig[] = [
  {
    id: 'qr_button_location',
    name: 'Ubicación Botón QR - Header vs FAB',
    description: 'Comparar efectividad de botón QR en header vs FAB flotante',
    startDate: '2024-12-10',
    endDate: '2024-12-24',
    isActive: true,
  },
  // Aquí se pueden agregar más experimentos en el futuro
];

// ==================== STORAGE KEYS ====================

const STORAGE_KEYS = {
  VARIANTS: '@ab_testing_variants',
  METRICS: '@ab_testing_metrics',
  SESSION_ID: '@ab_testing_session_id',
};

// ==================== CONTEXTO ====================

const ABTestingContext = createContext<ABTestingContextType | undefined>(undefined);

// ==================== PROVIDER ====================

interface ABTestingProviderProps {
  children: ReactNode;
}

export const ABTestingProvider: React.FC<ABTestingProviderProps> = ({ children }) => {
  const [variants, setVariants] = useState<Record<string, ExperimentVariant>>({});
  const [metrics, setMetrics] = useState<Record<string, ExperimentMetrics>>({});
  const [sessionId, setSessionId] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  // ==================== INICIALIZACIÓN ====================

  const initializeABTesting = async () => {
    try {
      // Cargar variantes guardadas
      const savedVariants = await AsyncStorage.getItem(STORAGE_KEYS.VARIANTS);
      if (savedVariants) {
        setVariants(JSON.parse(savedVariants));
      }

      // Cargar métricas guardadas
      const savedMetrics = await AsyncStorage.getItem(STORAGE_KEYS.METRICS);
      if (savedMetrics) {
        setMetrics(JSON.parse(savedMetrics));
      }

      // Generar o recuperar session ID
      let storedSessionId = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_ID);
      if (!storedSessionId) {
        storedSessionId = generateSessionId();
        await AsyncStorage.setItem(STORAGE_KEYS.SESSION_ID, storedSessionId);
      }
      setSessionId(storedSessionId);

      setIsInitialized(true);
    } catch (error) {
      console.error('Error inicializando A/B Testing:', error);
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    initializeABTesting();
  }, []);

  // ==================== ASIGNACIÓN DE VARIANTES ====================

  const assignVariant = useCallback(async (experimentId: string): Promise<VariantType> => {
    // Verificar si el experimento existe y está activo
    const experiment = EXPERIMENTS.find(exp => exp.id === experimentId);
    if (!experiment || !experiment.isActive) {
      return 'A'; // Por defecto, control
    }

    // Asignar nueva variante aleatoriamente (50/50)
    const newVariant: VariantType = Math.random() < 0.5 ? 'A' : 'B';
    const experimentVariant: ExperimentVariant = {
      experimentId,
      variant: newVariant,
      assignedAt: new Date().toISOString(),
    };

    // Guardar variante
    const updatedVariants = {
      ...variants,
      [experimentId]: experimentVariant,
    };
    
    setVariants(updatedVariants);
    await AsyncStorage.setItem(STORAGE_KEYS.VARIANTS, JSON.stringify(updatedVariants));

    // Inicializar métricas para esta variante
    const key = `${experimentId}_${newVariant}`;
    if (!metrics[key]) {
      const newMetrics: ExperimentMetrics = {
        experimentId,
        variant: newVariant,
        events: [],
        totalEvents: 0,
        uniqueSessions: 0,
      };
      const updatedMetrics = {
        ...metrics,
        [key]: newMetrics,
      };
      setMetrics(updatedMetrics);
      await AsyncStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(updatedMetrics));
    }

    // Log de asignación
    console.log(`[A/B Test] Assigned variant ${newVariant} to experiment ${experimentId}`);

    return newVariant;
  }, [variants, metrics]);

  const getVariant = useCallback((experimentId: string): VariantType => {
    // Verificar si el experimento existe y está activo
    const experiment = EXPERIMENTS.find(exp => exp.id === experimentId);
    if (!experiment || !experiment.isActive) {
      return 'A'; // Por defecto, control
    }

    // Si ya tiene variante asignada, retornarla
    if (variants[experimentId]) {
      return variants[experimentId].variant;
    }

    // Si no tiene variante, retornar 'A' temporalmente
    // La asignación real se hará en useEffect del componente
    return 'A';
  }, [variants]);

  const isVariant = (experimentId: string, variant: VariantType): boolean => {
    return getVariant(experimentId) === variant;
  };

  // ==================== MÉTRICAS ====================

  const trackEvent = (
    experimentId: string,
    eventType: string,
    metadata?: Record<string, any>
  ) => {
    const variant = getVariant(experimentId);
    const key = `${experimentId}_${variant}`;

    const event: MetricEvent = {
      experimentId,
      variant,
      eventType,
      timestamp: new Date().toISOString(),
      metadata: {
        ...metadata,
        sessionId,
      },
    };

    const currentMetrics = metrics[key] || {
      experimentId,
      variant,
      events: [],
      totalEvents: 0,
      uniqueSessions: 0,
    };

    const updatedMetrics = {
      ...metrics,
      [key]: {
        ...currentMetrics,
        events: [...currentMetrics.events, event],
        totalEvents: currentMetrics.totalEvents + 1,
      },
    };

    setMetrics(updatedMetrics);
    AsyncStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(updatedMetrics));

    // Log para debugging (remover en producción)
    console.log(`[A/B Test] ${experimentId} - ${variant}: ${eventType}`, metadata);
  };

  const getMetrics = (experimentId: string): ExperimentMetrics | null => {
    const variant = getVariant(experimentId);
    const key = `${experimentId}_${variant}`;
    return metrics[key] || null;
  };

  // ==================== RESET (TESTING) ====================

  const resetExperiment = async (experimentId: string) => {
    // Eliminar variante
    const updatedVariants = { ...variants };
    delete updatedVariants[experimentId];
    setVariants(updatedVariants);
    await AsyncStorage.setItem(STORAGE_KEYS.VARIANTS, JSON.stringify(updatedVariants));

    // Eliminar métricas
    const updatedMetrics = { ...metrics };
    delete updatedMetrics[`${experimentId}_A`];
    delete updatedMetrics[`${experimentId}_B`];
    setMetrics(updatedMetrics);
    await AsyncStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(updatedMetrics));

    console.log(`[A/B Test] Reset experiment: ${experimentId}`);
  };

  const resetAllExperiments = async () => {
    setVariants({});
    setMetrics({});
    await AsyncStorage.removeItem(STORAGE_KEYS.VARIANTS);
    await AsyncStorage.removeItem(STORAGE_KEYS.METRICS);
    console.log('[A/B Test] Reset all experiments');
  };

  // ==================== HELPERS ====================

  const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const activeExperiments = EXPERIMENTS.filter(exp => exp.isActive);

  // ==================== CONTEXT VALUE ====================

  const value: ABTestingContextType = {
    getVariant,
    isVariant,
    trackEvent,
    getMetrics,
    experiments: EXPERIMENTS,
    activeExperiments,
    resetExperiment,
    resetAllExperiments,
  };

  // Exponer assignVariant internamente para componentes que lo necesiten
  (value as any).assignVariant = assignVariant;

  if (!isInitialized) {
    return null; // O un loading spinner
  }

  return (
    <ABTestingContext.Provider value={value}>
      {children}
    </ABTestingContext.Provider>
  );
};

// ==================== HOOKS ====================

export const useABTesting = (): ABTestingContextType => {
  const context = useContext(ABTestingContext);
  if (!context) {
    throw new Error('useABTesting debe usarse dentro de ABTestingProvider');
  }
  return context;
};

/**
 * Hook para obtener variante de un experimento de forma segura
 * Se encarga de asignar variante si no existe (en useEffect)
 */
export const useExperimentVariant = (experimentId: string): VariantType => {
  const { getVariant } = useABTesting();
  const [variant, setVariant] = React.useState<VariantType>('A');
  const [isAssigning, setIsAssigning] = React.useState(false);

  React.useEffect(() => {
    if (!isAssigning) {
      setIsAssigning(true);
      const currentVariant = getVariant(experimentId);
      setVariant(currentVariant);
        
      // Si no tiene variante asignada, asignar una nueva
      if (!currentVariant || currentVariant === 'A') {
        // Verificar en AsyncStorage si realmente no tiene variante
        AsyncStorage.getItem('@ab_testing_variants').then(savedVariants => {
          if (savedVariants) {
            const variants = JSON.parse(savedVariants);
            if (!variants[experimentId]) {
              // No tiene variante, asignar una nueva
              const newVariant: VariantType = Math.random() < 0.5 ? 'A' : 'B';
              setVariant(newVariant);
                
              // Guardar la nueva variante
              const experimentVariant = {
                experimentId,
                variant: newVariant,
                assignedAt: new Date().toISOString(),
              };
              variants[experimentId] = experimentVariant;
              AsyncStorage.setItem('@ab_testing_variants', JSON.stringify(variants));
                
              console.log(`[A/B Test] Assigned variant ${newVariant} to ${experimentId}`);
            } else {
              setVariant(variants[experimentId].variant);
            }
          }
        });
      }
    }
  }, [experimentId, getVariant, isAssigning]);

  return variant;
};

// ==================== EXPORTS ====================

export default ABTestingContext;