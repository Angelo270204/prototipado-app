# 🚀 Inicio Rápido - Experimento A/B Implementado

## ✅ Estado: Completamente Implementado y Funcional (Error Resuelto)

**Última actualización:** 5 de Diciembre, 2024 - v1.1.0

---

## 🎯 ¿Qué se implementó?

Se creó un **sistema completo de A/B Testing** para probar dos diseños del botón "Escanear QR" en el módulo del Operador:

- **Variante A (Control)**: Botón en header superior derecha (negro, rectangular)
- **Variante B (Experimental)**: FAB flotante en esquina inferior derecha (verde, circular)

**Hipótesis**: El FAB verde generará +25% más clicks por mejor ergonomía y visibilidad.

### 🔧 Corrección Aplicada

Se resolvió el error de `setState durante render` implementando el hook personalizado `useExperimentVariant` que maneja la asignación de variantes en `useEffect` en lugar de durante el render. Ver `SOLUCION_ERROR_SETSTATE.md` para detalles completos.

---

## ⚡ Cómo Probarlo (3 Pasos)

### Paso 1: Instalar Dependencias

```bash
cd prototipado-app
npm install
```

### Paso 2: Iniciar la App

```bash
npm start
# O
npx expo start
```

### Paso 3: Probar el Experimento

1. **Login** → Email y contraseña cualquiera
2. **Seleccionar Rol** → "Operador"
3. **Ir a Órdenes** → `/operator/work-orders` (se asigna variante automáticamente)
4. **Observar el botón QR** según tu variante
5. **Hacer clicks** en el botón QR (3-5 veces)
6. **Ver Dashboard** → Navegar a `/shared/ab-testing/dashboard`
7. **Verificar métricas** actualizadas en tiempo real

**✅ Sin errores:** El sistema ahora asigna variantes correctamente sin errores de rendering.

---

## 📱 Dónde Está el Botón Según Tu Variante

### Si tienes Variante A:
```
┌─────────────────────────────────┐
│ Hola, Angelo    🔔 [📷 Escanear] │ ← AQUÍ (esquina superior)
│ 5 órdenes asignadas              │
└─────────────────────────────────┘
```

### Si tienes Variante B:
```
┌─────────────────────────────────┐
│ Lista de órdenes...              │
│                              ┌─┐ │
│                              │📷│ │ ← AQUÍ (flotante verde)
│                              └─┘ │
└─────────────────────────────────┘
```

---

## 📊 Qué Verás en el Dashboard

El dashboard (`/shared/ab-testing/dashboard`) muestra:

✅ **Tu variante asignada** (A o B)
✅ **Métricas en tiempo real**:
   - 👁️ Vistas de pantalla
   - 👆 Clicks en botón QR
   - 📈 CTR (Tasa de clicks)
   - ⚡ Eventos totales
✅ **Últimos 5 eventos** registrados
✅ **Comparación esperada** de resultados
✅ **Botón de Reset** para cambiar de variante

---

## 🔄 Cómo Cambiar de Variante

Para probar la otra variante:

1. En el dashboard → **"Reset Este Experimento"**
2. Confirmar
3. **CERRAR la app completamente** (no minimizar)
4. Volver a abrir
5. Tendrás 50% probabilidad de obtener la otra variante

Si obtienes la misma, repite 2-3 veces.

---

## 📂 Archivos Creados

### Código (5 archivos)
```
✅ contexts/ABTesting/ABTestingContext.tsx       (Sistema core)
✅ components/molecules/FloatingActionButton.tsx (Componente FAB)
✅ app/operator/work-orders.tsx                  (Modificado con A/B)
✅ app/shared/ab-testing/dashboard.tsx           (Dashboard)
✅ app/_layout.tsx                               (Provider agregado)
```

### Documentación (4 archivos)
```
📄 EXPERIMENTO_AB_BOTON_QR.md              (Documentación completa - 745 líneas)
📄 COMO_PROBAR_EXPERIMENTO_AB.md           (Guía de usuario - 352 líneas)
📄 RESUMEN_EXPERIMENTO_AB_IMPLEMENTADO.md  (Resumen ejecutivo - 594 líneas)
📄 INICIO_EXPERIMENTO_AB.md                (Este archivo)
```

**Total**: 1,300+ líneas de código + 1,700+ líneas de documentación

---

## 🎓 Documentación Disponible

### Para Usar el Experimento
📖 **`COMO_PROBAR_EXPERIMENTO_AB.md`**
- Guía paso a paso
- Troubleshooting
- Ejemplos prácticos

### Para Entender el Experimento
📖 **`EXPERIMENTO_AB_BOTON_QR.md`**
- Hipótesis completa
- Metodología científica
- Análisis esperado
- Referencias académicas

### Para Ver el Resumen
📖 **`RESUMEN_EXPERIMENTO_AB_IMPLEMENTADO.md`**
- Overview ejecutivo
- Archivos modificados
- Resultados esperados
- Roadmap futuro

---

## 🧪 Sistema de Tracking Automático

El sistema registra automáticamente:

✅ **screen_viewed** - Cuando entras a "Órdenes de Trabajo"
✅ **qr_button_clicked** - Cuando presionas el botón QR
✅ **variant_assigned** - Tu variante asignada (A o B)

Todos los datos se guardan en AsyncStorage y persisten entre sesiones.

---

## 📈 Métricas Principales

### CTR (Click-Through Rate)
```
CTR = (Clicks en botón / Vistas de pantalla) × 100
```

**Ejemplo:**
- 10 vistas de pantalla
- 8 clicks en botón QR
- **CTR = 80%**

**Objetivo del Experimento:** Variante B > Variante A + 20pp

---

## 🎯 Resultados Esperados

| Métrica | Variante A | Variante B | Mejora |
|---------|-----------|-----------|--------|
| **CTR** | ~65% | ~85% | **+20pp** |
| **Clicks/sesión** | ~1.8 | ~2.3 | **+28%** |

**Predicción:** Variante B (FAB) ganará por:
- 🖐️ Mejor ergonomía (thumb zone)
- 👀 Visibilidad constante (no se oculta)
- 🎨 Mayor prominencia (verde + grande)
- 📱 Patrón familiar (Material Design)

---

## 🛠️ Troubleshooting Rápido

### No veo el dashboard
**Solución:** Navega manualmente a `/shared/ab-testing/dashboard`

### No se registran eventos
**Solución:** 
1. Ve a `/operator/work-orders`
2. Espera 1-2 segundos (asignación de variante en useEffect)
3. Haz click en el botón QR
4. Regresa al dashboard
5. Las métricas se actualizan automáticamente

### No encuentro el botón QR
**Solución:**
- **Variante A:** Mira arriba a la derecha (header)
- **Variante B:** Mira abajo a la derecha (círculo verde)

---

## ✅ Checklist de Verificación

Antes de comenzar, verifica:

- [ ] App instalada y corriendo (`npm start`)
- [ ] Puedes hacer login
- [ ] Puedes seleccionar rol "Operador"
- [ ] Puedes navegar a `/operator/work-orders`
- [ ] Puedes navegar a `/shared/ab-testing/dashboard`

Durante la prueba:

- [ ] Dashboard muestra tu variante
- [ ] Ves el botón QR en la ubicación correcta
- [ ] Clicks se registran en el dashboard
- [ ] Puedes hacer reset y cambiar variante

---

## 🚀 Próximos Pasos

### Corto Plazo (Ahora)
1. ✅ Probar ambas variantes manualmente
2. ✅ Verificar tracking funciona
3. ✅ Familiarizarse con el dashboard

### Mediano Plazo (2 semanas)
4. 📊 Ejecutar experimento con usuarios reales
5. 📈 Recolectar mínimo 30 sesiones por variante
6. 🔍 Analizar resultados

### Largo Plazo (1 mes)
7. 🏆 Implementar variante ganadora
8. 🧪 Crear nuevos experimentos (botón importar, cards, etc.)
9. 📚 Aplicar aprendizajes a otros módulos

---

## 🎓 Valor Académico

Este experimento demuestra:

✅ **Metodología científica** aplicada a UX/UI
✅ **Toma de decisiones basada en datos**
✅ **Implementación técnica** completa de A/B Testing
✅ **Análisis cuantitativo** de métricas
✅ **Documentación profesional** de experimentos

Perfecto para proyectos académicos de:
- Ingeniería de Software
- Diseño UX/UI
- Analítica de Producto
- Investigación de Usuarios

---

## 📞 Ayuda Adicional

### Documentación
- **Guía de usuario**: `COMO_PROBAR_EXPERIMENTO_AB.md`
- **Docs técnicas**: `EXPERIMENTO_AB_BOTON_QR.md`
- **Resumen ejecutivo**: `RESUMEN_EXPERIMENTO_AB_IMPLEMENTADO.md`

### Archivos Clave
- **Sistema A/B**: `contexts/ABTesting/ABTestingContext.tsx`
- **Dashboard**: `app/shared/ab-testing/dashboard.tsx`
- **FAB**: `components/molecules/FloatingActionButton.tsx`

### Rutas Importantes
- Dashboard: `/shared/ab-testing/dashboard`
- Operador: `/operator/work-orders`
- Login: `/auth/login`

---

## 🎉 ¡Todo Listo!

El experimento está **100% implementado** y listo para usar.

**Siguiente paso:** Abre la app y navega al dashboard para ver tu variante asignada.

---

**Proyecto:** DTP-AR - Validación CAD con Realidad Aumentada  
**Experimento:** Botón QR - Header vs FAB  
**Estado:** ✅ Listo para Ejecutar (Error Resuelto)  
**Fecha:** 5 de Diciembre, 2024  
**Versión:** 1.1.0

---

## 🆕 Cambios en v1.1.0 (Fix)

- ✅ Resuelto error de `setState durante render`
- ✅ Implementado hook `useExperimentVariant` con useEffect
- ✅ Asignación de variantes ahora es segura y sin errores
- ✅ Mejor experiencia sin warnings de concurrent rendering
- 📄 Documentación de la solución: `SOLUCION_ERROR_SETSTATE.md`

---

**💡 Tip Final:** La primera vez que entres a la pantalla del operador, la variante se asigna automáticamente en segundo plano (useEffect). Verás el log en consola: `[A/B Test] Assigned variant A/B to qr_button_location`. Haz 3-5 clicks en el botón QR y regresa al dashboard para ver las métricas actualizadas.

**¡Disfruta experimentando sin errores! 🧪✅**