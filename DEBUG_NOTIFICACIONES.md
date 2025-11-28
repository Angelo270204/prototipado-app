# 🐛 DEBUG - Sistema de Notificaciones

## Para verificar que las notificaciones funcionan correctamente:

### 1. Verificar el Badge
- El badge debería aparecer en la esquina superior derecha del header
- Debe mostrar un número rojo si hay notificaciones
- Si no hay notificaciones, solo aparece el ícono de campana

### 2. Verificar el Modal
- Al tocar el badge, debería abrirse un modal desde abajo
- El modal debe mostrar "Notificaciones (X)" donde X es el número de no leídas
- Si no hay notificaciones, debe mostrar un mensaje vacío

### 3. Verificar las Notificaciones
- Cada usuario debería tener al menos 1 notificación al iniciar sesión
- Las notificaciones deben tener:
  - Icono circular a la izquierda
  - Título en negrita
  - Mensaje descriptivo
  - Fecha y hora
  - Punto azul si no está leída

### 4. Verificar la Interacción
- Al tocar una notificación, debería:
  - Quitarse el fondo gris
  - Desaparecer el punto azul
  - Reducirse el contador del badge

## Posibles Problemas:

### A. El badge no aparece
**Causa:** El NotificationBadge no se está renderizando
**Solución:** Verificar que se haya importado correctamente

### B. El contador está en 0
**Causa:** No hay notificaciones o todas están leídas
**Solución:** Cerrar sesión y volver a iniciar

### C. El modal no se abre
**Causa:** El estado `showNotifications` no se actualiza
**Solución:** Verificar que el `onPress` esté configurado

### D. Las notificaciones no aparecen
**Causa:** El array está vacío o el AuthContext no está funcionando
**Solución:** Verificar el AuthContext y el login

## Verificación Manual:

1. Ir a `contexts/AuthContext.tsx`
2. Buscar la función `login`
3. Verificar que se crean notificaciones iniciales
4. Cada usuario debe tener notificaciones según su rol:
   - Cliente: project_shared
   - Diseñador: comment_added  
   - Operador: work_order_assigned
   - Producción: project_approved

## Test Rápido:

```javascript
// En el componente, agregar temporalmente:
console.log('Notifications:', notifications);
console.log('Unread count:', unreadCount);
console.log('Show modal:', showNotifications);
```

Esto ayudará a identificar en qué paso está fallando.

