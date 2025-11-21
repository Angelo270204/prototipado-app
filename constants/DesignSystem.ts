/**
 * DTP-AR Design System
 * Paleta Oficial: "Negro + Blanco Industrial"
 * Optimizado para modo claro con contraste industrial
 */

// COLORES PRINCIPALES - PALETA NEGRO + BLANCO INDUSTRIAL
export const Colors = {
  // 1. COLORES BASE (Identidad Principal)
  base: {
    blackPrimary: '#1A1A1A',    // Negro industrial - fondos, botones, headers
    whitePrimary: '#FFFFFF',    // Blanco puro - paneles, tarjetas, inputs
  },

  // 2. GRISES NECESARIOS (Variaciones tonales)
  grays: {
    light: '#F2F2F2',           // Superficie/Paneles - panel de formularios
    medium: '#D9D9D9',          // Bordes e Inputs - bordes, separadores
    dark: '#4A4A4A',            // Textos secundarios/iconos
  },

  // 3. COLORES FUNCIONALES (Estados del sistema)
  functional: {
    success: '#9CFF2E',         // Verde neón - Aprobado, operaciones exitosas
    error: '#FF6B6B',           // Rojo suave - Pendiente Revisión, errores
    warning: '#FFE249',         // Amarillo brillante - Pendiente Revisión (alternativo)
    info: '#4A9EFF',            // Azul brillante - En Validación, información
  },

  // FONDOS
  background: {
    primary: '#1A1A1A',         // Fondo principal - negro industrial
    secondary: '#F2F2F2',       // Fondo de paneles y tarjetas
    tertiary: '#FFFFFF',        // Fondo blanco puro para contenido
    card: '#1A1A1A',            // Tarjetas oscuras
    hover: '#E8E8E8',           // Hover sobre elementos
    border: '#D9D9D9',          // Bordes sutiles
    input: '#FFFFFF',           // Fondo de inputs
  },
  
  // TEXTOS
  text: {
    primary: '#1A1A1A',         // Texto principal sobre fondos claros
    secondary: '#4A4A4A',       // Texto secundario - iconos, labels
    tertiary: '#6B7280',        // Texto terciario
    disabled: '#9CA3AF',        // Texto deshabilitado
    onDark: '#FFFFFF',          // Texto sobre fondos oscuros
    onCard: '#FFFFFF',          // Texto sobre tarjetas oscuras
    label: '#D1D1D1',           // Labels sobre fondo oscuro
  },
  
  // COLORES DE MARCA Y ACENTO
  primary: {
    main: '#1A1A1A',            // Negro industrial
    light: '#2A2A2A',           // Negro más claro
    dark: '#000000',            // Negro puro
    contrast: '#FFFFFF',        // Contraste sobre oscuro
  },
  
  // ESTADOS
  success: {
    main: '#9FFF7A',            // Verde industrial
    light: '#B5FF94',           // Verde claro
    dark: '#7FE05A',            // Verde oscuro
    background: '#E8FFE0',      // Fondo suave
  },
  
  error: {
    main: '#FF4B4B',            // Rojo alerta
    light: '#FF6B6B',           // Rojo claro
    dark: '#E03333',            // Rojo oscuro
    background: '#FFE8E8',      // Fondo suave
  },
  
  warning: {
    main: '#F4FF5E',            // Amarillo
    light: '#F7FF8A',           // Amarillo claro
    dark: '#E0EB3A',            // Amarillo oscuro
    background: '#FFFEF0',      // Fondo suave
  },
  
  info: {
    main: '#4A90E2',            // Azul funcional
    light: '#6BA5E8',           // Azul claro
    dark: '#3A7BC8',            // Azul oscuro
    background: '#E8F4FF',      // Fondo suave
  },
  
  // INTERACCIÓN
  focus: '#4A90E2',             // Color de foco - azul funcional
  selected: '#E8F4FF',          // Fondo de selección
  hover: '#E8E8E8',             // Hover genérico
  active: '#D9D9D9',            // Estado activo
  
  // PRIORIDADES (para órdenes de trabajo)
  priority: {
    urgent: '#FF4B4B',          // Urgente - rojo
    high: '#F4FF5E',            // Alta - amarillo
    medium: '#4A90E2',          // Media - azul
    low: '#4A4A4A',             // Baja - gris oscuro
    normal: '#9FFF7A',          // Normal - verde
  },
  
  // ESTADOS DE TRABAJO
  status: {
    pending: '#F4FF5E',         // Pendiente - amarillo
    inProgress: '#4A90E2',      // En progreso - azul
    completed: '#9FFF7A',       // Completado - verde
    cancelled: '#4A4A4A',       // Cancelado - gris
    review: '#4A90E2',          // En revisión - azul
  },

  // COLORES ESPECÍFICOS PARA ROLES
  roles: {
    designer: '#1A1A1A',        // Negro industrial para diseñador
    client: '#1A1A1A',          // Negro industrial para cliente
    production: '#1A1A1A',      // Negro industrial para producción
    operator: '#1A1A1A',        // Negro industrial para operador
  },

  // COLORES PARA ESTADÍSTICAS
  stats: {
    card: '#1A1A1A',            // Negro industrial para tarjetas
    text: '#FFFFFF',            // Texto blanco
    value: '#FFFFFF',           // Valores en blanco
  },
  
  // COLORES PARA LOGIN/AUTH
  auth: {
    background: '#1A1A1A',      // Fondo oscuro - negro industrial
    cardBackground: '#F2F2F2',  // Tarjeta de formulario - gris claro
    inputBackground: '#FFFFFF', // Fondo de inputs - blanco puro
    inputBorder: '#D9D9D9',     // Bordes de inputs - gris medio
    inputText: '#1A1A1A',       // Texto en inputs - negro
    inputIcon: '#4A4A4A',       // Iconos en inputs - gris oscuro
    inputLabel: '#4A4A4A',      // Labels de inputs - gris oscuro
    inputPlaceholder: '#9CA3AF',// Placeholder - gris claro
    buttonBackground: '#1A1A1A',// Fondo de botón - negro industrial
    buttonHover: '#000000',     // Hover de botón - negro puro
    buttonText: '#FFFFFF',      // Texto de botón - blanco
    title: '#FFFFFF',           // Título principal - blanco
    subtitle: '#D9D9D9',        // Subtítulo - gris medio
    linkText: '#4A4A4A',        // Texto de enlaces
  },
};

// TIPOGRAFÍA
export const Typography = {
  // Familias
  fonts: {
    primary: 'Inter',           // Fuente principal
    secondary: 'RobotoCondensed', // Fuente secundaria
    mono: 'RobotoMono',         // Fuente monoespaciada
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
  xlarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
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
  minTouchTarget: 44,         // Tamaño mínimo de toque (iOS/Android guidelines)
  minContrastRatio: 4.5,      // WCAG AA
  minContrastRatioLarge: 3,   // WCAG AA para texto grande
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