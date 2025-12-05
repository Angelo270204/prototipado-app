# 🧪 Experimento A/B: Botón Escanear QR - Header vs FAB

**ID del Experimento:** `qr_button_location`  
**Fecha de Inicio:** 10 de Diciembre, 2024  
**Fecha de Fin:** 24 de Diciembre, 2024  
**Estado:** ✅ Activo  
**Rol de Usuario:** Operador (Angelo)

---

## 📋 Índice

1. [Definición del Experimento](#definición-del-experimento)
2. [Hipótesis](#hipótesis)
3. [Variables](#variables)
4. [Variantes](#variantes)
5. [Metodología de Prueba](#metodología-de-prueba)
6. [Métricas de Éxito](#métricas-de-éxito)
7. [Implementación Técnica](#implementación-técnica)
8. [Cómo Probar el Experimento](#cómo-probar-el-experimento)
9. [Análisis de Resultados](#análisis-de-resultados)
10. [Lecciones Esperadas](#lecciones-esperadas)

---

## 🎯 Definición del Experimento

### Contexto

En la aplicación DTP-AR, los operadores necesitan escanear códigos QR frecuentemente para acceder a órdenes de trabajo y guías de ensamblaje. La ubicación del botón de escaneo QR puede impactar significativamente en la frecuencia de uso y la experiencia del usuario.

### Objetivo

Determinar qué ubicación y diseño del botón "Escanear QR" genera mayor tasa de uso y mejor experiencia para los operadores en dispositivos móviles.

---

## 💡 Hipótesis

### Formato Estructurado

**Creemos que** mover el botón "Escanear QR" desde el header (esquina superior derecha) a un **Floating Action Button (FAB)** grande en la esquina inferior derecha **resultará en** un aumento del **25% en escaneos de QR** **para usuarios operadores** **porque** el FAB es más accesible para el pulgar en dispositivos móviles y permanece visible durante el scroll de la lista de órdenes.

### Justificación

1. **Ergonomía móvil**: La zona inferior derecha es más accesible para el pulgar en uso con una mano
2. **Visibilidad constante**: El FAB flotante permanece visible al hacer scroll, mientras que el header puede quedar fuera de vista
3. **Jerarquía visual**: El FAB destaca más como acción principal por su tamaño y color verde
4. **Patrones establecidos**: Material Design y muchas apps exitosas usan FABs para acciones principales
5. **Contexto de uso**: Los operadores trabajan en planta, a menudo con una mano ocupada

---

## 🔬 Variables

### Variable Independiente
**Lo que cambiamos:**
- Ubicación del botón "Escanear QR"
- Diseño visual del botón (horizontal vs circular)
- Tamaño del botón
- Color del botón

### Variable Dependiente
**Lo que medimos:**
- Tasa de clicks en el botón QR (% de sesiones donde se hace click)
- Número promedio de escaneos por sesión
- Tiempo hasta el primer escaneo en la sesión

### Variables de Control
**Lo que mantenemos igual:**
- Funcionalidad del escáner QR (misma)
- Lista de órdenes de trabajo (misma)
- Filtros de órdenes (mismos)
- Resto de la interfaz (sin cambios)
- Usuarios objetivo (operadores)

---

## 🅰️🅱️ Variantes

### Variante A (Control): Botón en Header

#### Descripción Visual
```
┌─────────────────────────────────┐
│ Hola, Angelo          🔔 [📷 Escanear] │ ← BOTÓN AQUÍ
│ 5 órdenes asignadas                    │
├─────────────────────────────────┤
│                                  │
│  [Todas] [Pendientes] [En Progreso]   │
│                                  │
│  ┌─────────────────────────┐    │
│  │ Orden #WO-001           │    │
│  │ Mesa Industrial X1      │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │ Orden #WO-002           │    │
│  └─────────────────────────┘    │
│                                  │
└─────────────────────────────────┘
```

#### Características
- **Ubicación**: Header superior, esquina derecha
- **Forma**: Rectangular horizontal
- **Tamaño**: 120px (ancho) x 36px (alto)
- **Color**: Negro (#1A1A1A)
- **Icono**: QR code outline (20px)
- **Texto**: "Escanear" (blanco)
- **Padding**: 12px horizontal, 8px vertical
- **Sombra**: Ninguna

#### Pros
- Ubicación estándar y familiar
- No obstruye contenido
- Consistente con otros headers

#### Contras
- Alcance difícil con el pulgar en pantallas grandes
- Puede quedar fuera de vista al hacer scroll
- Menos prominente visualmente

---

### Variante B (Experimental): FAB Flotante

#### Descripción Visual
```
┌─────────────────────────────────┐
│ Hola, Angelo          🔔         │
│ 5 órdenes asignadas              │
├─────────────────────────────────┤
│                                  │
│  [Todas] [Pendientes] [En Progreso]   │
│                                  │
│  ┌─────────────────────────┐    │
│  │ Orden #WO-001           │    │
│  │ Mesa Industrial X1      │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │ Orden #WO-002           │    │
│  └─────────────────────────┘    │
│                            ┌───┐ │
│                            │ 📷 │ │ ← FAB AQUÍ
│                            └───┘ │
└─────────────────────────────────┘
```

#### Características
- **Ubicación**: Esquina inferior derecha, flotante
- **Forma**: Circular
- **Tamaño**: 64px x 64px (thumb-friendly)
- **Color**: Verde éxito (#10B981)
- **Icono**: QR code outline (28px, blanco)
- **Posición**: 90px desde abajo, 20px desde derecha
- **Sombra**: Elevación alta (8dp)
- **Estado**: Siempre visible (position: absolute)

#### Pros
- Zona ergonómica del pulgar (thumb zone)
- Siempre visible al hacer scroll
- Mayor prominencia visual (color verde + tamaño)
- Patrón de diseño reconocido (Material Design)
- Indica claramente la acción principal

#### Contras
- Puede obstruir contenido en pantallas pequeñas
- Menos espacio para texto explicativo
- Puede confundirse con otros FABs en otras pantallas

---

## 📊 Metodología de Prueba

### 1. Configuración

#### Duración
- **Mínimo**: 10 días laborales
- **Ideal**: 14 días (2 semanas completas)
- **Razón**: Permitir que operadores usen la app en múltiples turnos y contextos

#### Muestra
- **Mínimo**: 30 operadores por variante (60 total)
- **Ideal**: 40 operadores por variante (80 total)
- **Distribución**: 50/50 aleatoria

#### Asignación de Variantes
- **Método**: Aleatorio al primer uso (Math.random() < 0.5)
- **Persistencia**: La variante se mantiene por usuario (guardado en AsyncStorage)
- **Identificador**: ID de sesión único generado

#### Criterios de Inclusión
- Usuario con rol de "Operador"
- Acceso a la pantalla de "Órdenes de Trabajo"
- Al menos 3 sesiones durante el período del experimento

### 2. Tracking de Eventos

#### Eventos Capturados

```typescript
// Evento 1: Vista de pantalla
{
  experimentId: 'qr_button_location',
  eventType: 'screen_viewed',
  variant: 'A' | 'B',
  timestamp: '2024-12-10T10:30:00.000Z',
  metadata: {
    sessionId: 'session_12345',
    filterApplied: 'all',
    ordersCount: 5
  }
}

// Evento 2: Click en botón QR
{
  experimentId: 'qr_button_location',
  eventType: 'qr_button_clicked',
  variant: 'A' | 'B',
  timestamp: '2024-12-10T10:31:15.000Z',
  metadata: {
    sessionId: 'session_12345',
    buttonType: 'header' | 'fab',
    timeOnScreen: 75 // segundos
  }
}

// Evento 3: Asignación de variante
{
  experimentId: 'qr_button_location',
  eventType: 'variant_assigned',
  variant: 'A' | 'B',
  timestamp: '2024-12-10T10:30:00.000Z',
  metadata: {
    sessionId: 'session_12345',
    variant: 'B'
  }
}
```

---

## 📈 Métricas de Éxito

### Métricas Primarias

#### 1. Tasa de Clicks (CTR)
**Definición**: Porcentaje de sesiones donde el usuario hace click en el botón QR

**Fórmula**:
```
CTR = (Sesiones con ≥1 click en QR / Total de sesiones) × 100
```

**Objetivo**: CTR de Variante B > CTR de Variante A + 20%

**Ejemplo**:
- Variante A: 65% CTR (65 de 100 sesiones)
- Variante B: 85% CTR (85 de 100 sesiones)
- Mejora: +20 puntos porcentuales (+30.8% relativo)

#### 2. Escaneos por Sesión
**Definición**: Número promedio de clicks en el botón QR por sesión

**Fórmula**:
```
Promedio = Total de clicks / Total de sesiones
```

**Objetivo**: Variante B > Variante A + 25%

**Ejemplo**:
- Variante A: 1.8 clicks/sesión
- Variante B: 2.3 clicks/sesión
- Mejora: +27.8%

### Métricas Secundarias

#### 3. Tiempo hasta Primer Click
**Definición**: Tiempo promedio (en segundos) desde que se carga la pantalla hasta el primer click en el botón QR

**Objetivo**: Menor es mejor

**Ejemplo**:
- Variante A: 45 segundos
- Variante B: 30 segundos
- Mejora: -33% (más rápido)

#### 4. Tasa de Rebote en Escáner
**Definición**: % de usuarios que entran al escáner pero regresan inmediatamente sin escanear

**Objetivo**: Menor es mejor (indica que los clicks son intencionales)

#### 5. Satisfacción Subjetiva (Opcional)
**Definición**: Encuesta NPS post-turno

**Pregunta**: "¿Qué tan fácil fue usar el botón de escaneo QR hoy?"
- Escala: 1-10
- Objetivo: Variante B > 8.0 promedio

---

## 🎯 Criterio de Éxito Estadístico

### Nivel de Confianza
- **Requerido**: 95% (p-value < 0.05)
- **Ideal**: 99% (p-value < 0.01)

### Mejora Mínima Detectable (MDE)
- **CTR**: +15% absoluto o +20% relativo
- **Clicks/sesión**: +20% relativo

### Tamaño de Efecto
- **Cohen's d**: > 0.3 (efecto pequeño-mediano)
- **Interpretación**: 
  - d < 0.2 = efecto trivial
  - 0.2 ≤ d < 0.5 = efecto pequeño
  - 0.5 ≤ d < 0.8 = efecto mediano
  - d ≥ 0.8 = efecto grande

### Criterio de Decisión

**Variante B GANA si:**
1. CTR (B) > CTR (A) + 15% **Y** p-value < 0.05
2. No hay degradación significativa en métricas secundarias
3. No hay bugs reportados críticos

**Variante A GANA si:**
1. No hay diferencia significativa (p-value > 0.05)
2. O CTR (B) < CTR (A)

**INCONCLUSO si:**
1. Muestra insuficiente (n < 30 por variante)
2. Diferencia marginal sin significancia estadística
3. Resultados contradictorios entre métricas

---

## 💻 Implementación Técnica

### Archivos Creados/Modificados

#### 1. Contexto de A/B Testing
**Archivo**: `contexts/ABTesting/ABTestingContext.tsx`

**Funcionalidades**:
- Asignación aleatoria de variantes (50/50)
- Persistencia de variantes en AsyncStorage
- Tracking de eventos con timestamps
- Gestión de múltiples experimentos simultáneos
- Cálculo de métricas en tiempo real

**Hooks disponibles**:
```typescript
const { 
  getVariant,           // Obtener variante asignada
  isVariant,            // Verificar variante específica
  trackEvent,           // Registrar evento
  getMetrics,           // Obtener métricas
  resetExperiment,      // Reset para testing
} = useABTesting();
```

#### 2. Componente FAB
**Archivo**: `components/molecules/FloatingActionButton.tsx`

**Props**:
```typescript
interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;              // Default: 'qr-code-outline'
  color?: string;             // Default: Colors.functional.success
  iconColor?: string;         // Default: Colors.base.whitePrimary
  size?: number;              // Default: 64
  iconSize?: number;          // Default: 28
  bottom?: number;            // Default: 90
  right?: number;             // Default: 20
  testID?: string;
}
```

#### 3. Pantalla de Operador Modificada
**Archivo**: `app/operator/work-orders.tsx`

**Cambios**:
- Import de `useABTesting` hook
- Detección de variante al cargar
- Renderizado condicional del botón (header vs FAB)
- Tracking de eventos `screen_viewed` y `qr_button_clicked`
- Handler unificado `handleQRScanPress` con tracking

#### 4. Dashboard de Resultados
**Archivo**: `app/shared/ab-testing/dashboard.tsx`

**Secciones**:
- Info del experimento (nombre, fechas, estado)
- Variante asignada al usuario actual
- Métricas en tiempo real (vistas, clicks, CTR)
- Últimos eventos registrados
- Comparación esperada de variantes
- Herramientas de testing (reset)
- Instrucciones de prueba

#### 5. Provider en Layout
**Archivo**: `app/_layout.tsx`

**Cambio**: Agregado `<ABTestingProvider>` al árbol de contextos

---

## 🧪 Cómo Probar el Experimento

### Paso 1: Acceder al Dashboard

```bash
# Navegar a:
app/shared/ab-testing/dashboard
```

O desde la app, navegar manualmente a esta ruta.

### Paso 2: Verificar Tu Variante

El dashboard mostrará:
- **Variante A**: "📱 Botón en Header" (fondo blanco, borde negro)
- **Variante B**: "🎯 FAB Flotante" (fondo verde claro, borde verde)

### Paso 3: Probar la Funcionalidad

1. **Navegar a Pantalla del Operador**:
   - Desde role-selection, elegir "Operador"
   - O navegar directamente a `/operator/work-orders`

2. **Observar el Botón QR**:
   - **Variante A**: Botón negro "Escanear" en header superior derecha
   - **Variante B**: Botón circular verde flotante en esquina inferior derecha

3. **Interactuar con el Botón**:
   - Hacer click varias veces (simula uso real)
   - Cada click se trackea automáticamente

4. **Verificar Tracking**:
   - Regresar al dashboard
   - Ver métricas actualizadas:
     - Vistas de pantalla
     - Clicks en botón QR
     - CTR calculado
     - Últimos eventos

### Paso 4: Cambiar de Variante (Testing)

1. En el dashboard, presionar "Reset Este Experimento"
2. Confirmar en el diálogo
3. **Cerrar completamente la app** (no solo minimizar)
4. Volver a abrir la app
5. Se te asignará una nueva variante aleatoriamente (50% A, 50% B)

### Paso 5: Simular Múltiples Usuarios

Para probar estadísticas con múltiples sesiones:

```typescript
// Opción 1: Reset y re-abrir varias veces
// (cada vez es como un "nuevo usuario")

// Opción 2: Modificar el código temporalmente
// para forzar variantes específicas:
const qrButtonVariant = 'A'; // o 'B'
```

---

## 📊 Análisis de Resultados

### Tabla Comparativa de Características

| Característica | Variante A (Header) | Variante B (FAB) | Ventaja |
|---|---|---|---|
| **Ubicación** | Superior derecha | Inferior derecha | B (ergonomía) |
| **Forma** | Rectangular horizontal | Circular | - |
| **Tamaño** | 120x36px | 64x64px | B (thumb-friendly) |
| **Color** | Negro | Verde éxito | B (visibilidad) |
| **Visibilidad al scroll** | Se oculta | Siempre visible | **B** |
| **Alcance del pulgar** | Difícil | Fácil | **B** |
| **Obstrucción de contenido** | Ninguna | Leve | **A** |
| **Patrón de diseño** | Estándar | Material Design FAB | B (familiar) |
| **Jerarquía visual** | Baja | Alta | **B** |
| **Espacio para texto** | Sí ("Escanear") | No | **A** |

**Puntuación Total**: Variante B = 6 ventajas, Variante A = 2 ventajas

---

### Resultados Esperados

#### Hipótesis: Variante B Ganará

**Predicciones**:

| Métrica | Variante A | Variante B | Mejora Esperada |
|---|---|---|---|
| **CTR** | ~65% | ~85% | **+20pp (+30.8%)** ✅ |
| **Clicks/sesión** | ~1.8 | ~2.3 | **+27.8%** ✅ |
| **Tiempo a 1er click** | ~45s | ~30s | **-33%** ✅ |
| **Satisfacción (1-10)** | ~7.2 | ~8.5 | **+18%** ✅ |

**Nivel de confianza esperado**: 95%+ (p < 0.05)

---

### Por Qué Esperamos que Gane la Variante B

#### 1. **Ergonomía Móvil**
- El 70% de usuarios móviles usan el dispositivo con una mano
- La zona inferior derecha está en el "thumb zone" natural
- Header superior requiere estirar el pulgar o usar dos manos

#### 2. **Visibilidad Persistente**
- FAB permanece visible al hacer scroll en lista de órdenes
- Header desaparece al scrollear hacia abajo
- Operadores pueden tener 10+ órdenes en lista

#### 3. **Jerarquía Visual Clara**
- Color verde indica "acción principal" (convención UX)
- Tamaño grande (64x64) más prominente
- Forma circular + sombra = affordance de "botón presionable"

#### 4. **Contexto de Uso**
- Operadores en planta industrial, ambiente ruidoso/ocupado
- A menudo una mano ocupada sosteniendo pieza o herramienta
- Necesitan acción rápida y fácil

#### 5. **Evidencia de la Industria**
- Material Design guidelines recomiendan FAB para acción principal
- Apps exitosas (WhatsApp, Gmail, Google Keep) usan FAB
- Estudios de UX muestran +20-40% CTR con FABs bien implementados

---

### Análisis en Caso de Resultados Alternativos

#### Si Gana Variante A (Header)

**Posibles Razones**:
1. **Familiaridad**: Usuarios ya entrenados con botón en header
2. **Obstrucción**: FAB tapa contenido importante en pantallas pequeñas
3. **Contexto específico**: Operadores usan tablets (pantallas grandes) donde header es accesible
4. **Preferencia cultural**: En este contexto industrial prefieren patrones tradicionales

**Aprendizajes**:
- No asumir que mejores prácticas generales aplican a todos los contextos
- La familiaridad puede superar la ergonomía
- Tamaño de dispositivo importa en decisiones de UI

#### Si Resultados Inconcluyentes

**Posibles Razones**:
1. **Muestra insuficiente**: < 30 usuarios por variante
2. **Período muy corto**: < 10 días, no captura patrones reales
3. **Variables confusoras**: Cambios en procesos de trabajo durante experimento
4. **Implementación con bugs**: Tracking no funciona correctamente

**Acción**:
- Extender duración del experimento
- Aumentar tamaño de muestra
- Agregar métricas cualitativas (entrevistas)

---

## 🎓 Lecciones Esperadas

### Aprendizajes Técnicos

1. **Sistema de A/B Testing**:
   - Implementación de asignación aleatoria persistente
   - Tracking de eventos con AsyncStorage
   - Cálculo de métricas en tiempo real
   - Manejo de múltiples experimentos simultáneos

2. **Componentes Reutilizables**:
   - FAB genérico para futuras acciones principales
   - Context API para estado global de experimentos
   - Hooks custom para consumo simple

3. **Persistencia de Datos**:
   - AsyncStorage para variantes de usuarios
   - Métricas acumuladas por sesión
   - ID de sesión único para tracking

### Aprendizajes de UX/UI

1. **Ubicación de Botones**:
   - Impacto de ergonomía móvil en CTR
   - Thumb zone vs otras zonas de la pantalla
   - Visibilidad persistente vs estática

2. **Jerarquía Visual**:
   - Color como indicador de acción principal
   - Tamaño y forma para affordance
   - Sombras para profundidad y flotación

3. **Contexto de Usuario**:
   - Uso con una mano en entornos industriales
   - Necesidad de acciones rápidas y claras
   - Balance entre prominencia y obstrucción

### Aprendizajes de Negocio

1. **Toma de Decisiones Basada en Datos**:
   - No asumir, siempre validar con experimentos
   - Métricas cuantitativas > opiniones
   - Significancia estadística antes de implementar

2. **Iteración Continua**:
   - Pequeños cambios pueden tener gran impacto
   - Testing A/B debe ser proceso continuo
   - Optimización incremental de UX

3. **ROI de Experimentación**:
   - +25% en uso de feature = más órdenes procesadas
   - Mejor UX = menor fricción operativa
   - Inversión en A/B testing paga dividendos

---

## 🚀 Próximos Pasos

### Después de Este Experimento

#### Si Gana Variante B (FAB):

1. **Implementar en Producción**:
   - Desplegar FAB como diseño definitivo
   - Remover código de variante A
   - Actualizar documentación

2. **Expandir a Otros Roles**:
   - Probar FAB para acción principal en Diseñador
   - Probar en Cliente para "Agregar Comentario"
   - Crear sistema de FABs reutilizables

3. **Optimizar Variante Ganadora**:
   - Testear posición exacta (bottom: 90px vs 80px vs 100px)
   - Testear colores alternativos (verde actual vs azul vs naranja)
   - Testear con/sin label emergente al hover

#### Nuevos Experimentos Sugeridos:

1. **Experimento #2: Color del FAB**
   - Verde actual vs Azul primario
   - Hipótesis: Verde > Azul (+10% CTR)

2. **Experimento #3: Tamaño del FAB**
   - 56px vs 64px vs 72px
   - Hipótesis: 64px es óptimo (balance tamaño/obstrucción)

3. **Experimento #4: Animación de Entrada**
   - FAB con bounce animation vs sin animación
   - Hipótesis: Animación sutil mejora descubrimiento

4. **Experimento #5: Botón "Importar CAD" (Diseñador)**
   - Azul actual vs Verde éxito
   - Hipótesis: Verde > Azul (+20% clicks)

5. **Experimento #6: Cards de Proyectos**
   - Negras actuales vs Blancas con borde
   - Hipótesis: Blancas mejoran legibilidad y CTR (+18%)

---

## 📚 Referencias

### Material Design Guidelines
- [Floating Action Button](https://material.io/components/buttons-floating-action-button)
- [Button placement](https://material.io/design/components/buttons.html#placement)

### UX Research
- Nielsen Norman Group: "Thumb Zone - Designing for Mobile Users"
- Smashing Magazine: "A/B Testing for Mobile UX"
- Google: "Material Design Metrics & Keylines"

### Estadística
- "Statistical Significance Calculator for A/B Testing"
- "Understanding Effect Size: Cohen's d"
- "Sample Size Determination for A/B Tests"

---

## 👥 Equipo

**Implementado por**: Equipo de Desarrollo DTP-AR  
**Revisado por**: UX/UI Lead  
**Aprobado por**: Product Manager  

---

## 📝 Notas Adicionales

### Consideraciones Éticas

1. **Consentimiento Implícito**: Todos los usuarios aceptan términos que incluyen experimentación para mejora del producto
2. **No Degradación**: Ambas variantes son funcionales, ninguna degrada la experiencia
3. **Privacidad**: Solo se trackean eventos de uso, no datos personales
4. **Transparencia**: Dashboard disponible para que usuarios vean su variante

### Limitaciones del Experimento

1. **Muestra Limitada**: Aplicación en fase de prototipo, usuarios limitados
2. **Contexto Simulado**: No es uso real en planta industrial
3. **Dispositivos**: Testeo principalmente en emuladores, no dispositivos físicos reales
4. **Duración**: 14 días puede ser insuficiente para patrones de largo plazo

### Mitigaciones

1. Extender experimento si muestra < 30 por variante
2. Complementar con entrevistas cualitativas
3. Validar en dispositivos físicos antes de conclusión final
4. Considerar factores estacionales/contextuales

---

## ✅ Checklist de Implementación

- [x] Crear contexto de A/B Testing (`ABTestingContext.tsx`)
- [x] Crear componente FAB (`FloatingActionButton.tsx`)
- [x] Modificar pantalla de operador (`work-orders.tsx`)
- [x] Integrar provider en layout (`_layout.tsx`)
- [x] Crear dashboard de resultados (`ab-testing/dashboard.tsx`)
- [x] Documentar experimento completo (este archivo)
- [ ] Testear ambas variantes manualmente
- [ ] Verificar tracking de eventos en consola
- [ ] Validar persistencia de variantes (AsyncStorage)
- [ ] Probar reset y reasignación
- [ ] Ejecutar experimento por 14 días
- [ ] Recolectar y analizar resultados
- [ ] Tomar decisión basada en datos
- [ ] Implementar variante ganadora en producción

---

**Última Actualización**: 10 de Diciembre, 2024  
**Versión**: 1.0.0  
**Estado del Documento**: ✅ Completo y Listo para Ejecución