# DTP-AR - Diseño, Prototipado y Validación en Realidad Aumentada

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-green)
![React Native](https://img.shields.io/badge/React_Native-0.81.5-blue)
![Expo](https://img.shields.io/badge/Expo-~54.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**Aplicación móvil de RA para manufactura en Áncash y Chimbote, Perú**

[Características](#-características) • [Instalación](#-instalación) • [Uso](#-uso) • [Arquitectura](#-arquitectura) • [Documentación](#-documentación)

</div>

---

## 📖 Descripción

**DTP-AR** es una aplicación móvil desarrollada con React Native y Expo que permite a empresas de manufactura:

- ✅ Validar diseños CAD antes de fabricar
- ✅ Visualizar modelos 3D en Realidad Aumentada
- ✅ Guiar procesos de ensamblaje paso a paso
- ✅ Gestionar órdenes de trabajo
- ✅ Monitorear métricas de producción

---

## 🎯 Características

### 🎨 Design System Completo
- Paleta de colores optimizada para entornos industriales
- Tipografía clara y legible (Roboto Condensed + Inter)
- Componentes accesibles (contraste 4.5:1, botones 44px mín.)
- Sistema de espaciado consistente

### 👥 Cuatro Roles de Usuario

#### 📐 Diseñador
- Gestión de proyectos CAD
- Validación de diseños en RA
- Importación de archivos CAD

#### 👔 Cliente
- Visualización de modelos 3D/RA
- Sistema de comentarios
- Aprobación de diseños

#### 🔧 Operario
- **Guías dinámicas de ensamblaje paso a paso** ⭐
- Escaneo de códigos QR
- Visualización en Realidad Aumentada
- Registro de progreso por paso

#### 📊 Producción
- **Dashboard con métricas en tiempo real** ⭐
- Gestión de órdenes de trabajo
- Reportes y trazabilidad
- Asignación de recursos

### 🧩 Componentes Reutilizables

**Átomos**
- `Button` - 4 variantes, 3 tamaños, estados de carga
- `Input` - Validación integrada, estados visuales
- `StatusBadge` - Badges de estado consistentes

**Moléculas**
- `ProjectCard` - Tarjetas de proyecto con progreso
- `WorkOrderCard` - Tarjetas con borde de prioridad
- `EmptyState` - Estados vacíos reutilizables

---

## 🚀 Instalación

### Requisitos Previos
- Node.js 18+
- npm o yarn
- Expo Go app (para testing en dispositivo)
- Android Studio o Xcode (opcional)

### Pasos

1. **Clonar el repositorio**
```bash
cd /trabajos/Proyectos-React/protipado-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el servidor de desarrollo**
```bash
npm start
```

4. **Ejecutar en tu plataforma**
- **Android**: Presiona `a`
- **iOS**: Presiona `i`
- **Web**: Presiona `w`
- **Dispositivo móvil**: Escanea el QR con Expo Go

---

## 💻 Uso

### Inicio de Sesión

Al abrir la app, verás 4 opciones de rol:

1. **📐 Diseñador** - Para gestionar proyectos y validar diseños
2. **👔 Cliente** - Para revisar y aprobar proyectos
3. **🔧 Operario** - Para seguir guías de ensamblaje
4. **📊 Producción** - Para gestionar órdenes y métricas

> **Nota**: Por ahora no hay autenticación real. Solo selecciona un rol para explorar.

### Flujo Recomendado de Prueba

#### Como Operario (⭐ Más completo)
1. Selecciona rol "Operario"
2. Toca la orden "WO-HSE2024-001"
3. Explora la guía paso a paso
4. Marca pasos como completados
5. Prueba la navegación Anterior/Siguiente

#### Como Producción (⭐ Dashboard completo)
1. Selecciona rol "Producción"
2. Observa las métricas del dashboard
3. Explora las acciones rápidas
4. Revisa la actividad reciente

---

## 🏗️ Arquitectura

### Estructura de Carpetas

```
protipado-app/
├── app/
│   ├── index.tsx                 # Punto de entrada
│   ├── _layout.tsx               # Navegación
│   ├── screens/                  # Pantallas generales
│   ├── designer/                 # Módulo Diseñador
│   ├── client/                   # Módulo Cliente
│   ├── operator/                 # Módulo Operario
│   └── production/               # Módulo Producción
├── components/
│   ├── atoms/                    # Componentes básicos
│   └── molecules/                # Componentes compuestos
├── constants/
│   └── DesignSystem.ts           # Sistema de diseño
├── contexts/
│   └── AppContext.tsx            # Estado global
└── data/
    └── mockData.ts               # Datos de ejemplo
```

### Stack Tecnológico

- **Framework**: React Native 0.81.5
- **Plataforma**: Expo ~54.0
- **Navegación**: Expo Router ~6.0 (file-based)
- **Lenguaje**: TypeScript ~5.9
- **Estado**: React Context API
- **Estilos**: StyleSheet (React Native)

### Patrones de Diseño

- **Atomic Design** para componentes
- **File-based routing** con Expo Router
- **Context API** para estado global
- **TypeScript strict mode**
- **Separation of Concerns**

---

## 📊 Datos Mock

### Proyectos (4)
1. Estructura de Soporte HSE-2024 (Minera Áncash)
2. Prototipo Chute Transferencia (Sider Perú)
3. Sistema de Anclaje Modular (Construcciones del Norte)
4. Bastidor de Maquinaria Pesada (Minera Chimbote)

### Órdenes de Trabajo (4)
- WO-HSE2024-001 - Alta prioridad, 6/10 pasos
- WO-CHUTE-002 - Media prioridad, pendiente
- WO-ANCLAJE-003 - Normal, completada
- WO-BASTIDOR-004 - Alta prioridad, pendiente

### Usuarios Mock (4)
- Carlos Mendoza (Diseñador)
- Ana Flores (Cliente)
- Roberto Castillo (Operario)
- María Torres (Producción)

---

## 📚 Documentación

- **[INICIO_RAPIDO.md](./INICIO_RAPIDO.md)** - Guía rápida de inicio
- **[RESUMEN_FINAL.md](./RESUMEN_FINAL.md)** - Resumen completo del proyecto
- **[ESTRUCTURA_PROYECTO.txt](./ESTRUCTURA_PROYECTO.txt)** - Estructura detallada
- **[ARCHIVOS_CREADOS.txt](./ARCHIVOS_CREADOS.txt)** - Lista de archivos

---

## 🎨 Sistema de Colores

```css
Fondo oscuro:    #1A1A1A, #0E0E0E
Tarjetas:        #E8E8E8, #2A2A2A
Éxito:           #9FFF7A (verde)
Error:           #FF4B4B (rojo)
Advertencia:     #F4FF5E (amarillo)
Enfoque:         #4A90E2 (azul)
```

### Prioridades
```css
Alta:            #FF4B4B (rojo)
Media:           #F4FF5E (amarillo)
Baja:            #4A90E2 (azul)
Normal:          #9FFF7A (verde)
```

---

## 📱 Pantallas Principales

### ✅ Completamente Funcionales
1. **LoginScreen** - Selección de rol
2. **Designer Projects** - Lista de proyectos
3. **Client Projects** - Vista de proyectos
4. **Operator Work Orders** - Lista de órdenes
5. **Assembly Guide** ⭐ - Guía paso a paso completa
6. **Production Dashboard** ⭐ - Dashboard con métricas

### ⚠️ Placeholders (Navegables)
- Detalles de proyecto
- Nuevos proyectos
- Visores RA
- Escáner QR
- Perfiles de usuario
- Métricas detalladas

---

## 🔜 Roadmap

### Fase 2 - Core Features
- [ ] Pantallas de detalle completas
- [ ] Formularios de creación
- [ ] Sistema de comentarios
- [ ] Perfiles de usuario

### Fase 3 - Realidad Aumentada
- [ ] Integración de Three.js
- [ ] Visor 3D de modelos CAD
- [ ] AR.js o React Native AR
- [ ] Guías interactivas en RA

### Fase 4 - Backend
- [ ] API REST/GraphQL
- [ ] Base de datos (PostgreSQL)
- [ ] Autenticación JWT
- [ ] Sincronización en tiempo real

### Fase 5 - Features Avanzadas
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Analytics
- [ ] Exportación de reportes PDF

---

## 🧪 Testing

```bash
# Ejecutar linter
npm run lint

# Verificar tipos TypeScript
npx tsc --noEmit
```

---

## 🤝 Contribución

Este es un proyecto en desarrollo. Si deseas contribuir:

1. Fork el proyecto
2. Crea una branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Proyecto DTP-AR**
- Sector: Manufactura
- Ubicación: Áncash y Chimbote, Perú
- Versión: 1.0.0

---

## 🙏 Agradecimientos

- Expo team por la excelente plataforma
- React Native community
- Empresas de manufactura de Áncash y Chimbote

---

<div align="center">

**Desarrollado con ❤️ para el sector manufactura peruano**

</div>
