/**
 * DTP-AR Design System
 * Sistema de diseño para aplicación de Realidad Aumentada en manufactura
 * Modo Claro - Optimizado para reducir fatiga visual
 */

// COLORES PRINCIPALES - MODO CLARO
export const Colors = {
  // Fondos
  background: {
    primary: '#F5F5F5',      // Fondo principal - gris muy claro
    secondary: '#FFFFFF',     // Fondo de tarjetas - blanco
    tertiary: '#E8E8E8',      // Fondo de secciones - gris claro
    hover: '#ECECEC',         // Hover sobre elementos
    border: '#D1D5DB',        // Bordes sutiles
  },
  
  // Textos
  text: {
    primary: '#1A1A1A',       // Texto principal - casi negro
    secondary: '#5A5A5A',     // Texto secundario - gris medio
    tertiary: '#9CA3AF',      // Texto terciario - gris claro
    disabled: '#D1D5DB',      // Texto deshabilitado
    onPrimary: '#FFFFFF',     // Texto sobre colores primarios
  },
  
  // Colores de marca y acento
  primary: {
    main: '#2563EB',          // Azul profesional
    light: '#3B82F6',         // Azul claro
    dark: '#1E40AF',          // Azul oscuro
    contrast: '#FFFFFF',      // Texto sobre primario
  },
  
  // Estados
  success: {
    main: '#10B981',          // Verde éxito
    light: '#34D399',         // Verde claro
    dark: '#059669',          // Verde oscuro
    background: '#D1FAE5',    // Fondo suave
  },
  
  error: {
    main: '#EF4444',          // Rojo error
    light: '#F87171',         // Rojo claro
    dark: '#DC2626',          // Rojo oscuro
    background: '#FEE2E2',    // Fondo suave
  },
  
  warning: {
    main: '#F59E0B',          // Naranja advertencia
    light: '#FBBF24',         // Naranja claro
    dark: '#D97706',          // Naranja oscuro
    background: '#FEF3C7',    // Fondo suave
  },
  
  info: {
    main: '#3B82F6',          // Azul información
    light: '#60A5FA',         // Azul claro
    dark: '#2563EB',          // Azul oscuro
    background: '#DBEAFE',    // Fondo suave
  },
  
  // Interacción
  focus: '#2563EB',           // Color de foco
  selected: '#EFF6FF',        // Fondo de selección
  hover: '#F3F4F6',           // Hover genérico
  active: '#E5E7EB',          // Estado activo
  
  // Prioridades (para órdenes de trabajo)
  priority: {
    urgent: '#EF4444',        // Urgente - rojo
    high: '#F59E0B',          // Alta - naranja
    medium: '#3B82F6',        // Media - azul
    low: '#6B7280',           // Baja - gris
    normal: '#10B981',        // Normal - verde
  },
  
  // Estados de trabajo
  status: {
    pending: '#F59E0B',       // Pendiente
    inProgress: '#3B82F6',    // En progreso
    completed: '#10B981',     // Completado
    cancelled: '#6B7280',     // Cancelado
    review: '#8B5CF6',        // En revisión
  },
};

// TIPOGRAFÍA
export const Typography = {
  // Familias
  fonts: {
    primary: 'Inter',         // Fuente principal
    secondary: 'RobotoCondensed', // Fuente secundaria
    mono: 'RobotoMono',       // Fuente monoespaciada
    fallback: 'System',
  },
  
  // Tamaños
  sizes: {
    h1: 32,
    h2: 24,
    h3: 20,
    h4: 18,
    body: 16,
    bodySmall: 14,
    caption: 12,
    tiny: 10,
  },
  
  // Pesos
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Line height
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// ESPACIADO
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// BORDES Y ELEVACIONES
export const BorderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 999,
};

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xlarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};

// TAMAÑOS DE COMPONENTES
export const ComponentSizes = {
  button: {
    small: 36,
    medium: 44,
    large: 52,
    minWidth: 88,
  },
  input: {
    small: 36,
    medium: 44,
    large: 52,
  },
  iconButton: {
    small: 36,
    medium: 44,
    large: 52,
  },
  avatar: {
    xs: 24,
    small: 32,
    medium: 44,
    large: 64,
    xl: 80,
  },
  icon: {
    xs: 16,
    small: 20,
    medium: 24,
    large: 32,
    xl: 40,
  },
};

// ANIMACIONES
export const Animations = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 250,
    slow: 350,
    verySlow: 500,
  },
  easing: {
    default: 'ease-in-out',
    in: 'ease-in',
    out: 'ease-out',
    linear: 'linear',
  },
};

// ACCESIBILIDAD
export const Accessibility = {
  minTouchTarget: 44,       // Tamaño mínimo de toque (iOS/Android guidelines)
  minContrastRatio: 4.5,    // WCAG AA
  minContrastRatioLarge: 3, // WCAG AA para texto grande
};

// BREAKPOINTS (para diseño responsive)
export const Breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};

// Z-INDEX (para capas de UI)
export const ZIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
};

export default {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  ComponentSizes,
  Animations,
  Accessibility,
  Breakpoints,
  ZIndex,
};