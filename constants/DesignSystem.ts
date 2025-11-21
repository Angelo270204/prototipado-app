/**
 * DTP-AR Design System
 * Sistema de diseño para aplicación de Realidad Aumentada en manufactura
 */

// COLORES PRINCIPALES
export const Colors = {
  // Fondos
  background: {
    dark: '#1A1A1A',
    darker: '#0E0E0E',
    card: '#E8E8E8',
    cardDark: '#2A2A2A',
  },
  
  // Estados
  success: '#9FFF7A',
  error: '#FF4B4B',
  warning: '#F4FF5E',
  
  // Textos
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0B0',
    disabled: '#666666',
    onLight: '#1A1A1A',
  },
  
  // Interacción
  focus: '#4A90E2',
  selected: '#FFFFFF',
  hover: '#333333',
  
  // Prioridades (para órdenes de trabajo)
  priority: {
    high: '#FF4B4B',
    medium: '#F4FF5E',
    low: '#4A90E2',
    normal: '#9FFF7A',
  },
};

// TIPOGRAFÍA
export const Typography = {
  // Familias
  fonts: {
    primary: 'RobotoCondensed',
    secondary: 'Inter',
    fallback: 'System',
  },
  
  // Tamaños
  sizes: {
    h1: 28,
    h2: 22,
    h3: 16,
    body: 16,
    bodySmall: 14,
    caption: 12,
  },
  
  // Pesos
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Line height
  lineHeight: {
    tight: 1.4,
    normal: 1.5,
    relaxed: 1.6,
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
};

// BORDES Y ELEVACIONES
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// TAMAÑOS DE COMPONENTES
export const ComponentSizes = {
  button: {
    height: 44,
    minWidth: 88,
  },
  input: {
    height: 44,
  },
  iconButton: {
    size: 44,
  },
  avatar: {
    small: 32,
    medium: 44,
    large: 64,
  },
};

// ANIMACIONES
export const Animations = {
  duration: {
    fast: 120,
    normal: 180,
    slow: 300,
  },
  easing: {
    default: 'ease-in-out',
  },
};

// ACCESIBILIDAD
export const Accessibility = {
  minTouchTarget: 44,
  minContrastRatio: 4.5,
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
};
