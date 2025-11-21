# 🚀 Inicio Rápido - DTP-AR

Guía rápida para comenzar a usar la aplicación DTP-AR (Validación CAD en Realidad Aumentada).

---

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI (se instalará automáticamente)
- Dispositivo móvil con Expo Go (opcional)
- Editor de código (recomendado: VS Code)

---

## 🛠️ Instalación

### 1. Clonar o descargar el proyecto

```bash
cd protipado-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar el proyecto

```bash
npm start
```

Esto abrirá Expo DevTools en tu navegador.

---

## 📱 Ejecutar en Dispositivo

### Android

```bash
npm run android
```

O escanea el código QR con la app Expo Go.

### iOS

```bash
npm run ios
```

O escanea el código QR con la cámara del iPhone.

### Web (Modo de prueba)

```bash
npm run web
```

**Nota:** La funcionalidad AR es limitada en web.

---

## 🎨 Características Principales

### ✅ Completamente Implementado

- **Autenticación**
  - Login con email y contraseña
  - Registro de nuevos usuarios
  - Login social (Google/Microsoft - UI)
  - Recuperación de contraseña (UI)

- **Selección de Rol**
  - 4 roles: Diseñador, Cliente, Operador, Producción
  - Cambio de rol desde el perfil

- **Visualización AR (Simulada)**
  - Visor AR interactivo con controles
  - Rotación y zoom de modelos
  - Mediciones y grid de alineación
  - Captura de pantallas

- **Escáner QR (Simulado)**
  - Interfaz de escaneo
  - Códigos de ejemplo pre-configurados
  - Navegación automática a órdenes

- **Perfiles Completos**
  - Información del usuario
  - Estadísticas personales
  - Configuración (notificaciones, AR, guardado)
  - Gestión de cuenta

### 🎨 Diseño en Modo Claro

- Paleta profesional con fondos grises suaves
- Reducción de fatiga visual
- Alto contraste para accesibilidad
- Sombras sutiles y bordes definidos

---

## 🧭 Navegación en la App

### Flujo de Inicio

```
Splash Screen
    ↓
Login ← → Registro
    ↓
Selección de Rol
    ↓
    ├─→ Diseñador
    ├─→ Cliente
    ├─→ Operador
    └─→ Producción
```

### Módulo Diseñador

- **Proyectos**: Lista de proyectos CAD
- **Nuevo Proyecto**: Crear proyecto
- **Detalle**: Ver información del proyecto
- **AR Viewer**: Visualizar en realidad aumentada
- **Perfil**: Configuración y estadísticas

### Módulo Cliente

- **Proyectos**: Revisar proyectos asignados
- **Detalle**: Ver y comentar proyectos
- **AR View**: Validar en realidad aumentada
- **Perfil**: Configuración personal

### Módulo Operador

- **Órdenes de Trabajo**: Lista de tareas
- **Escáner QR**: Escanear código de orden
- **Guía de Ensamblaje**: Pasos detallados
- **AR Assembly**: Guía AR paso a paso
- **Perfil**: Configuración y estadísticas

### Módulo Producción

- **Dashboard**: Métricas y KPIs
- **Órdenes**: Gestión de órdenes
- **Métricas**: Reportes detallados
- **Perfil**: Configuración personal

---

## 🧪 Testing de Funcionalidades

### 1. Autenticación

**Login:**
```
Email: cualquiera@ejemplo.com
Contraseña: cualquier texto (mínimo 8 caracteres)
```

La validación es solo de UI, cualquier dato válido funciona.

**Registro:**
- Completar todos los campos obligatorios (*)
- La contraseña debe tener al menos 8 caracteres
- Las contraseñas deben coincidir
- Aceptar términos y condiciones

### 2. AR Viewer

**Controles disponibles:**
- 🎯 **Captura**: Tomar foto del modelo
- ↻ **Rotación**: Girar 45° izquierda/derecha
- 🔍 **Zoom**: Escala de 0.5x a 3x
- 📏 **Medidas**: Mostrar dimensiones
- 🔲 **Grid**: Cuadrícula de alineación
- 🔦 **Flash**: Activar/desactivar
- ⟲ **Reset**: Restablecer vista

### 3. Escáner QR

**Códigos de prueba:**
- WO-HSE2024-001
- WO-CHUTE-002
- WO-TOLVA-003
- WO-MARCO-004

Presiona "Simular Escaneo" para probar la funcionalidad.

### 4. Guía de Ensamblaje

- Navegar entre pasos (Anterior/Siguiente)
- Marcar pasos como completados
- Ver herramientas necesarias
- Ver advertencias de seguridad
- Abrir vista AR para el paso actual

---

## 🎨 Paleta de Colores

### Colores Principales

- **Primario**: `#2563EB` - Azul profesional
- **Success**: `#10B981` - Verde esmeralda
- **Error**: `#EF4444` - Rojo vibrante
- **Warning**: `#F59E0B` - Naranja ámbar
- **Info**: `#3B82F6` - Azul información

### Fondos

- **Principal**: `#F5F5F5` - Gris suave
- **Tarjetas**: `#FFFFFF` - Blanco
- **Secciones**: `#E8E8E8` - Gris claro

### Textos

- **Principal**: `#1A1A1A` - Casi negro
- **Secundario**: `#5A5A5A` - Gris medio
- **Terciario**: `#9CA3AF` - Gris claro

Ver `PALETA_COLORES.md` para detalles completos.

---

## 📁 Estructura del Proyecto

```
protipado-app/
├── app/                      # Pantallas de la aplicación
│   ├── auth/                 # Autenticación
│   │   ├── login.tsx         # Pantalla de login
│   │   └── register.tsx      # Pantalla de registro
│   ├── designer/             # Módulo diseñador
│   ├── client/               # Módulo cliente
│   ├── operator/             # Módulo operador
│   ├── production/           # Módulo producción
│   ├── role-selection.tsx    # Selección de rol
│   ├── _layout.tsx           # Layout principal
│   └── index.tsx             # Punto de entrada
├── components/               # Componentes reutilizables
│   ├── ar/                   # Componentes AR
│   │   └── ARViewer.tsx      # Visor AR simulado
│   ├── atoms/                # Componentes básicos
│   ├── molecules/            # Componentes compuestos
│   └── organisms/            # Componentes complejos
├── constants/
│   └── DesignSystem.ts       # Sistema de diseño
├── contexts/
│   └── AppContext.tsx        # Estado global
├── data/
│   └── mockData.ts           # Datos de prueba
└── hooks/                    # Custom hooks
```

---

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm start              # Iniciar Expo DevTools
npm run android        # Ejecutar en Android
npm run ios            # Ejecutar en iOS
npm run web            # Ejecutar en navegador

# Limpieza
npm run reset-project  # Limpiar caché de Expo
npx expo start -c      # Iniciar limpiando caché
```

---

## 🐛 Solución de Problemas

### El proyecto no inicia

```bash
# Limpiar caché y reinstalar
rm -rf node_modules
npm install
npx expo start -c
```

### Errores de TypeScript

Los warnings de TypeScript son normales en desarrollo. Para una build de producción, se resolverán automáticamente.

### La app no se conecta en dispositivo físico

1. Asegúrate de estar en la misma red WiFi
2. Verifica que el firewall no bloquee el puerto 19000
3. Intenta con el modo túnel: `npx expo start --tunnel`

### AR Viewer no funciona en web

El AR Viewer está diseñado para dispositivos móviles. En web solo se ve la simulación básica.

---

## 📚 Documentación Adicional

- `CAMBIOS_REALIZADOS.md` - Lista completa de cambios
- `PALETA_COLORES.md` - Guía detallada de colores
- `README-DTP-AR.md` - Documentación técnica completa

---

## 🎯 Próximos Pasos

### Para Desarrollo

1. **Backend Integration**
   - Conectar con API real
   - Implementar JWT authentication
   - Base de datos para proyectos y órdenes

2. **AR Real**
   - Integrar expo-gl o react-three-fiber
   - Cargar modelos 3D reales (.glb, .gltf)
   - Detección de superficies

3. **QR Scanner Real**
   - Implementar expo-barcode-scanner
   - Permisos de cámara
   - Validación de códigos

4. **Features Adicionales**
   - Modo offline
   - Notificaciones push
   - Reportes exportables
   - Chat entre usuarios

### Para Testing

1. Probar todas las pantallas de cada módulo
2. Verificar navegación entre pantallas
3. Probar controles AR en todos los visores
4. Verificar responsive en diferentes tamaños
5. Probar en Android e iOS

---

## 👥 Usuarios de Prueba

### Diseñador
- Nombre: Carlos Rodríguez
- Email: carlos.rodriguez@empresa.com
- Rol: Diseñador CAD

### Cliente
- Nombre: María González
- Email: maria.gonzalez@empresa.com
- Rol: Cliente

### Operador
- Nombre: José Pérez
- Email: jose.perez@empresa.com
- Rol: Operador

### Producción
- Nombre: Ana Martínez
- Email: ana.martinez@empresa.com
- Rol: Supervisor de Producción

---

## 💡 Tips de Uso

1. **Modo Claro**: Diseñado para reducir fatiga visual con fondos grises suaves
2. **AR Viewer**: Usa los controles de zoom y rotación para explorar modelos
3. **Escáner QR**: Presiona "Simular Escaneo" para testing rápido
4. **Cambio de Rol**: Puedes cambiar entre roles desde el perfil
5. **Navegación**: Usa el botón "Atrás" para volver a la pantalla anterior

---

## 📞 Soporte

Para dudas o problemas:
- Revisa la documentación en `/docs`
- Verifica los issues conocidos
- Consulta los archivos de documentación incluidos

---

## 🎓 Aprendizaje

Esta aplicación es un excelente ejemplo de:

- ✅ Arquitectura Atomic Design
- ✅ Sistema de diseño consistente
- ✅ Navegación con Expo Router
- ✅ Gestión de estado con Context API
- ✅ TypeScript en React Native
- ✅ Diseño responsive y accesible

---

## 📝 Notas Finales

- La app está **100% funcional en UI/UX**
- Todas las pantallas están implementadas
- Los datos son **mock/simulados** para pruebas
- Lista para integrar backend y AR real
- Diseñada para Chimbote, Áncash, Perú

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Proyecto**: DTP-AR - Validación CAD en Realidad Aumentada

¡Disfruta explorando la aplicación! 🚀