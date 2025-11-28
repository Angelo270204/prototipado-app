# 🚀 GUÍA RÁPIDA DE USO - DTP-AR

## ⚡ Inicio Rápido en 3 Pasos

### 1. Iniciar la aplicación
```bash
npm start
```

### 2. Elegir usuario
Presiona **i** (iOS) o **a** (Android) o **w** (Web)

### 3. Login con alguna credencial:

---

## 👥 CREDENCIALES

### Cliente (Probar primero) ⭐
```
Email: renzozv@gmail.com
Pass: r12345
```
**QUÉ VER:**
- Proyectos compartidos
- Botón APROBAR (verde)
- Botón RECHAZAR (rojo)
- Botón CHAT
- Badge de notificaciones 🔴

---

### Producción (Probar segundo) ⭐
```
Email: steph12@gmail.com
Pass: s12345
```
**QUÉ VER:**
- Dashboard con métricas
- Botón "Ver Proyectos"
- Filtros por estado
- Botón ASIGNAR OT
- Chat en proyectos
- Badge de notificaciones 🔴

---

### Operador
```
Email: angelo77@gmail.com
Pass: a123456
```
**QUÉ VER:**
- Órdenes de trabajo
- Badge de notificaciones 🔴
- Botón escanear QR

---

### Diseñador
```
Email: yardy12@gmail.com
Pass: 123456
```
**QUÉ VER:**
- Crear proyectos
- Importar CAD
- Visor AR
- Compartir con cliente

---

## 🧪 FLUJO DE PRUEBA RECOMENDADO

### Paso 1: Login como CLIENTE (Renzo)
1. Login: `renzozv@gmail.com` / `r12345`
2. Verás proyectos compartidos
3. Presiona **CHAT** en un proyecto
4. Escribe un mensaje de prueba
5. Presiona **APROBAR** en un proyecto
6. ¡Notificación enviada a Producción!

### Paso 2: Logout y Login como PRODUCCIÓN (Stephano)
1. Presiona el botón de logout
2. Login: `steph12@gmail.com` / `s12345`
3. Verás badge con 🔴 (1 notificación)
4. Presiona "Ver Proyectos"
5. Busca un proyecto con estado "Aprobado"
6. Presiona **ASIGNAR OT**
7. Confirma la asignación
8. ¡Notificación enviada a Operador!

### Paso 3: Logout y Login como OPERADOR (Angelo)
1. Presiona logout
2. Login: `angelo77@gmail.com` / `a123456`
3. Verás badge con 🔴 (1 notificación nueva)
4. Presiona el badge para ver notificación
5. Verás "Nueva orden asignada por Stephano"

### Paso 4: Probar el CHAT
1. Como cualquier usuario
2. Abre un proyecto
3. Presiona **CHAT**
4. Escribe mensajes
5. Los mensajes se guardan durante la sesión

---

## 💡 CARACTERÍSTICAS PRINCIPALES

### ✅ Sistema de Chat
- Chat por proyecto
- Todos los roles pueden participar
- Colores diferentes por rol
- Timestamps relativos

### ✅ Sistema de Notificaciones
- 7 tipos diferentes
- Badge con contador
- Se envían automáticamente
- Modal con lista completa

### ✅ Flujo de Aprobación
```
Cliente APRUEBA → Notificación a Producción
Cliente RECHAZA → Notificación a Diseñador
```

### ✅ Flujo de Asignación
```
Producción ASIGNA OT → Notificación + QR a Operador
Operador COMPLETA → Notificación a Producción
```

---

## 🎨 ELEMENTOS VISUALES

### Badge de Notificaciones 🔴
- Aparece en el header de cada vista
- Muestra número de no leídas
- Al presionar, abre modal de notificaciones

### Botones de Acción
- **APROBAR** → Verde ✅
- **RECHAZAR** → Rojo ❌
- **CHAT** → Negro con icono 💬
- **ASIGNAR OT** → Verde con icono ➕

### Estados de Proyecto
- **Pendiente** → Amarillo ⏳
- **En Progreso** → Azul 🔄
- **Aprobado** → Verde ✅
- **Completado** → Verde oscuro ✓

---

## 📱 NAVEGACIÓN RÁPIDA

### Como Cliente:
- Tab "Proyectos" → Ver todos
- Tab "Visor AR" → Vista AR
- Tab "Comentarios" → Dejar feedback

### Como Producción:
- Dashboard → Métricas
- Ver Proyectos → Lista completa
- Métricas → Reportes
- Órdenes de Trabajo → Gestión

### Como Operador:
- Órdenes → Lista de tareas
- Escanear QR → Iniciar trabajo
- Perfil → Config

### Como Diseñador:
- Tab "Proyectos" → Ver creados
- Tab "Importar" → Subir CAD
- Tab "Visor AR" → Validar diseño

---

## ⚠️ NOTAS IMPORTANTES

1. **Las notificaciones se pierden al recargar** (en memoria)
2. **El chat es local** durante la sesión
3. **Los datos son mock** (no hay backend real)
4. **Las credenciales están hardcodeadas** (desarrollo)

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### No aparecen notificaciones
- Asegúrate de hacer una acción (aprobar, asignar, etc.)
- Logout y login con el usuario destinatario

### No se ve el chat
- Presiona el botón "Chat" en un proyecto
- Asegúrate de estar en un proyecto específico

### No aparecen proyectos
- Los proyectos son datos mock en `/data/mockData.ts`
- Siempre hay proyectos de ejemplo

---

## 📞 RESUMEN ULTRA-RÁPIDO

```bash
# 1. Iniciar
npm start

# 2. Login como Cliente
renzozv@gmail.com / r12345

# 3. Presionar APROBAR en un proyecto

# 4. Logout y Login como Producción
steph12@gmail.com / s12345

# 5. Ver Proyectos → ASIGNAR OT

# 6. Logout y Login como Operador
angelo77@gmail.com / a123456

# 7. Ver notificación de orden asignada
```

**¡Listo! Has probado el flujo completo.** ✅

---

**Creado:** 25 Nov 2025  
**Tiempo de lectura:** 3 minutos  
**Tiempo de prueba:** 5 minutos

