# 🚀 DTP-AR - Guía de Inicio Rápido

## ¿Qué es DTP-AR?

**DTP-AR** es una aplicación móvil de Realidad Aumentada para el sector de manufactura en Áncash y Chimbote. Permite validar diseños CAD antes de fabricar, visualizar modelos 3D en RA, y guiar procesos de ensamblaje paso a paso.

---

## 📱 Ejecutar la Aplicación

### 1. Iniciar el servidor de desarrollo

```bash
npm start
```

### 2. Opciones de ejecución

- **Android**: Presiona `a` en la terminal
- **iOS**: Presiona `i` en la terminal  
- **Web**: Presiona `w` en la terminal
- **Expo Go**: Escanea el QR code con tu dispositivo

---

## 🎭 Roles de Usuario

Al iniciar la app, puedes seleccionar uno de estos 4 roles:

### 📐 Diseñador
- **Usuario mock**: Carlos Mendoza (cmendoza@siderperuana.com)
- **Funciones**: Gestionar proyectos, importar CAD, validar en RA
- **Navegación**: Proyectos → Vista RA → Perfil

### 👔 Cliente  
- **Usuario mock**: Ana Flores (aflores@minera-ancash.com)
- **Funciones**: Visualizar modelos 3D/RA, dejar comentarios, aprobar diseños
- **Navegación**: Proyectos → Vista RA → Perfil

### 🔧 Operario
- **Usuario mock**: Roberto Castillo (rcastillo@siderperuana.com)  
- **Funciones**: Guías dinámicas de ensamblaje en RA, escaneo QR
- **Navegación**: Órdenes → Escanear QR → Perfil
- **⭐ Pantalla destacada**: Assembly Guide (guía paso a paso completamente funcional)

### 📊 Producción
- **Usuario mock**: María Torres (mtorres@siderperuana.com)
- **Funciones**: Órdenes de trabajo, métricas, trazabilidad
- **Navegación**: Dashboard → Órdenes → Métricas → Perfil
- **⭐ Pantalla destacada**: Dashboard con métricas en tiempo real

---

## 🎨 Design System

### Colores Principales
- **Fondo oscuro**: `#1A1A1A` / `#0E0E0E`
- **Tarjetas**: `#E8E8E8` / `#2A2A2A`
- **Éxito**: `#9FFF7A` (verde)
- **Error**: `#FF4B4B` (rojo)
- **Advertencia**: `#F4FF5E` (amarillo)
- **Enfoque**: `#4A90E2` (azul)

### Tipografía
- **Primaria**: Roboto Condensed (títulos, botones)
- **Secundaria**: Inter (párrafos)
- **H1**: 28px | **H2**: 22px | **H3**: 16px
- **Body**: 14-16px | **Caption**: 12px

### Prioridades (Órdenes de Trabajo)
- **Alta**: Rojo `#FF4B4B`
- **Media**: Amarillo `#F4FF5E`  
- **Baja**: Azul `#4A90E2`
- **Normal**: Verde `#9FFF7A`

---

## 🧩 Componentes Principales

### Átomos
- `Button`: Variantes primary, secondary, ghost, danger
- `Input`: Con validación y estados
- `StatusBadge`: Badges de estado consistentes

### Moléculas  
- `ProjectCard`: Card de proyecto con progreso y estado
- `WorkOrderCard`: Card con borde lateral según prioridad
- `EmptyState`: Estados vacíos reutilizables

---

## 📊 Datos de Ejemplo

### Proyectos Mock
1. **Estructura de Soporte HSE-2024** - Minera Áncash (En validación)
2. **Prototipo Chute Transferencia** - Sider Perú (En progreso)
3. **Sistema de Anclaje Modular** - Construcciones del Norte (Aprobado)
4. **Bastidor de Maquinaria Pesada** - Minera Chimbote S.A. (Pendiente)

### Órdenes de Trabajo Mock
1. **WO-HSE2024-001** - Prioridad Alta, En progreso (6/10 pasos)
2. **WO-CHUTE-002** - Prioridad Media, Pendiente
3. **WO-ANCLAJE-003** - Prioridad Normal, Completada
4. **WO-BASTIDOR-004** - Prioridad Alta, Pendiente

---

## 🔄 Flujo de Navegación Completo

```
Login (Selección de Rol)
│
├── Diseñador
│   └── Lista de Proyectos → [Detalle] → [Vista RA] → [Nuevo]
│
├── Cliente
│   └── Lista de Proyectos → [Detalle] → [Vista RA]
│
├── Operario
│   └── Lista de Órdenes → Guía de Ensamblaje ⭐ → [Vista RA]
│                           │
│                           ├── Paso 1: Verificación de base
│                           ├── Paso 2: Instalación de columnas
│                           ├── Paso 3: Anclaje de vigas
│                           ├── Paso 4: Soldadura (En progreso)
│                           └── Paso 5: Arriostramiento
│
└── Producción
    └── Dashboard ⭐ → Órdenes → Métricas
```

---

## ✅ Pantallas Completas y Funcionales

### 1. LoginScreen
- Selección de rol con iconos y colores
- Navegación automática según rol
- Sin autenticación real (solo UI)

### 2. Designer Projects
- Lista de proyectos con filtros
- Cards con estado y progreso
- Bottom navigation

### 3. Client Projects  
- Vista de proyectos para aprobación
- Cards con información completa

### 4. Operator Work Orders
- Lista de órdenes con filtros
- Cards con borde de prioridad
- Botón de escaneo QR

### 5. Operator Assembly Guide ⭐
- **Navegación paso a paso**
- **Barra de progreso visual**
- **Detalles completos de cada paso**:
  - Título y descripción
  - Tiempo estimado
  - Herramientas requeridas (lista)
  - Advertencias de seguridad (destacadas en amarillo)
  - Botón para vista RA
  - Indicador de verificación requerida
- **Sistema de completado**:
  - Marcar paso como completado
  - Bloqueo hasta completar paso actual
  - Botones de navegación (Anterior/Siguiente)

### 6. Production Dashboard ⭐
- **4 métricas principales**:
  - Órdenes pendientes
  - En progreso
  - Completadas hoy
  - Proyectos activos
- **Acciones rápidas** (4 cards)
- **Actividad reciente** con indicadores visuales
- Bottom navigation de 4 tabs

---

## 📁 Estructura de Archivos Clave

```
app/
├── index.tsx                     # Punto de entrada
├── _layout.tsx                   # Navegación principal
├── screens/
│   └── LoginScreen.tsx           # Selección de rol
├── designer/
│   └── projects.tsx              # Lista proyectos diseñador
├── client/
│   └── projects.tsx              # Lista proyectos cliente
├── operator/
│   ├── work-orders.tsx           # Lista órdenes
│   └── assembly-guide.tsx ⭐      # Guía ensamblaje (completa)
└── production/
    └── dashboard.tsx ⭐           # Dashboard (completo)

components/
├── atoms/
│   ├── Button.tsx
│   ├── Input.tsx
│   └── StatusBadge.tsx
└── molecules/
    ├── ProjectCard.tsx
    ├── WorkOrderCard.tsx
    └── EmptyState.tsx

constants/
└── DesignSystem.ts               # Sistema de diseño completo

data/
└── mockData.ts                   # Datos de ejemplo

contexts/
└── AppContext.tsx                # Estado global
```

---

## 🎯 Próximos Pasos

### Corto Plazo
1. ✅ Implementar detalles de proyecto
2. ✅ Crear formulario de nuevo proyecto  
3. ✅ Integrar escáner QR real
4. ✅ Pantalla de perfil de usuario

### Mediano Plazo
5. 🔲 Integrar visor 3D real (Three.js / React Three Fiber)
6. 🔲 Implementar RA con AR.js o React Native AR
7. 🔲 Sistema de comentarios y aprobaciones
8. 🔲 Métricas y reportes detallados

### Largo Plazo
9. 🔲 Backend API (Node.js / Django)
10. 🔲 Autenticación real (JWT / OAuth)
11. 🔲 Base de datos (PostgreSQL / MongoDB)
12. 🔲 Notificaciones push
13. 🔲 Sincronización offline
14. 🔲 Analytics y tracking

---

## 🛠️ Tecnologías Utilizadas

- **React Native** 0.81.5
- **Expo** ~54.0.25
- **Expo Router** ~6.0.15 (file-based routing)
- **TypeScript** ~5.9.2
- **React Navigation** 7.x
- **React Context API** (estado global)

---

## 📝 Notas Importantes

1. **Sin autenticación real**: Por ahora solo se selecciona el rol y se navega directamente
2. **Datos mock**: Todos los datos son de ejemplo y están hardcodeados
3. **Placeholders**: Algunas pantallas son placeholders que muestran "En desarrollo"
4. **TypeScript warnings**: Hay algunos warnings de tipo en Expo Router que no afectan la funcionalidad
5. **Navegación funcional**: Todos los botones y cards navegan a las pantallas correspondientes

---

## 🎨 Ejemplos de Uso

### Probar flujo de Operario
1. Selecciona rol "Operario" en login
2. Toca cualquier orden de trabajo
3. Verás la guía paso a paso
4. Navega entre pasos
5. Marca como completado
6. Avanza al siguiente paso

### Probar flujo de Producción  
1. Selecciona rol "Producción" en login
2. Ve el dashboard con métricas
3. Toca "Crear Orden de Trabajo"
4. Toca "Ver Métricas"
5. Navega entre tabs del bottom navigation

---

## 🚨 Solución de Problemas

### La app no inicia
```bash
npm install
rm -rf node_modules
npm install
npx expo start -c
```

### Errores de TypeScript
- Los warnings de tipo en router.push() son esperados y no afectan la funcionalidad
- La app compilará y funcionará correctamente

### No se ve nada en pantalla
- Asegúrate de estar en la pantalla de login (index.tsx)
- Selecciona un rol para navegar

---

## 📞 Contacto y Soporte

- **Proyecto**: DTP-AR (Diseño, Prototipado y Validación en RA)
- **Sector**: Manufactura - Áncash y Chimbote
- **Versión**: 1.0.0

---

**¡Listo para empezar! 🚀**

Ejecuta `npm start` y explora todos los módulos de la aplicación.
