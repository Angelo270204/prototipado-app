# 🚀 Guía Rápida: Cómo Probar el Experimento A/B

## 📱 Experimento: Botón QR - Header vs FAB

---

## ⚡ Inicio Rápido (5 minutos)

### 1. Ver Tu Variante Asignada

```bash
# En la app, navega a:
/shared/ab-testing/dashboard
```

Verás una tarjeta que indica:
- **Variante A**: 📱 Botón en Header (fondo blanco)
- **Variante B**: 🎯 FAB Flotante (fondo verde)

---

### 2. Probar la Funcionalidad

#### Paso 1: Ir a Pantalla del Operador
```
Login → Seleccionar Rol "Operador" → Órdenes de Trabajo
```

#### Paso 2: Observar el Botón QR

**Si tienes Variante A:**
```
┌─────────────────────────────────┐
│ Hola, Angelo    🔔 [📷 Escanear] │ ← Botón negro aquí
└─────────────────────────────────┘
```

**Si tienes Variante B:**
```
┌─────────────────────────────────┐
│                            ┌───┐ │
│                            │ 📷 │ │ ← Botón verde aquí
│                            └───┘ │
└─────────────────────────────────┘
```

#### Paso 3: Hacer Clicks
- Presiona el botón QR varias veces (3-5 clicks)
- Cada click se registra automáticamente
- Navega al escáner y regresa

---

### 3. Ver Resultados

Regresa al dashboard (`/shared/ab-testing/dashboard`)

Verás tus métricas:
- 👁️ **Vistas de Pantalla**: Cuántas veces entraste a la pantalla
- 👆 **Clicks en Botón QR**: Cuántas veces presionaste el botón
- 📈 **CTR**: Tasa de clicks calculada automáticamente
- ⚡ **Eventos Totales**: Todos los eventos registrados

---

### 4. Cambiar de Variante (Opcional)

Para probar la otra variante:

1. En el dashboard, presiona **"Reset Este Experimento"**
2. Confirma la acción
3. **CIERRA COMPLETAMENTE LA APP** (no solo minimizar)
4. Vuelve a abrir la app
5. Tendrás 50% probabilidad de obtener la otra variante

---

## 🎯 Qué Estamos Probando

### Variante A (Control)
- ✅ Botón "Escanear" en header superior derecha
- ✅ Diseño rectangular horizontal
- ✅ Color negro
- ✅ Ubicación tradicional

### Variante B (Experimental)
- ✅ FAB (Floating Action Button) circular
- ✅ Esquina inferior derecha
- ✅ Color verde éxito
- ✅ Siempre visible al hacer scroll
- ✅ Zona ergonómica del pulgar

---

## 📊 Hipótesis

**Creemos que** el FAB verde en la esquina inferior derecha **resultará en** un **+25% más clicks** porque:

1. 🖐️ Más fácil de alcanzar con el pulgar
2. 👀 Siempre visible (no se oculta al scrollear)
3. 🎨 Más prominente visualmente (verde + tamaño)
4. 📱 Patrón familiar de Material Design

---

## 🔍 Métricas Clave

### CTR (Click-Through Rate)
```
CTR = (Clicks en botón QR / Vistas de pantalla) × 100
```

**Ejemplo:**
- Entraste 10 veces a la pantalla
- Hiciste click en QR 8 veces
- CTR = (8/10) × 100 = **80%**

**Objetivo:** Variante B > Variante A + 20 puntos porcentuales

---

## 🧪 Tracking Automático

El sistema registra automáticamente:

✅ **Vista de pantalla** - Cuando entras a "Órdenes de Trabajo"
✅ **Click en botón QR** - Cuando presionas el botón
✅ **Variante asignada** - A o B (se mantiene persistente)
✅ **Timestamp** - Fecha y hora de cada evento
✅ **Metadata** - Contexto adicional (filtros, órdenes, etc.)

---

## 📱 Acceso al Dashboard

### Opción 1: Navegación Manual
```
/shared/ab-testing/dashboard
```

### Opción 2: Desde Código
Agrega un botón temporal en cualquier pantalla:

```typescript
<TouchableOpacity 
  onPress={() => router.push('/shared/ab-testing/dashboard')}
>
  <Text>🧪 Ver Dashboard A/B</Text>
</TouchableOpacity>
```

---

## 🛠️ Herramientas de Testing

### Reset del Experimento
- Borra tu variante asignada
- Borra todas tus métricas
- En próximo uso, te asigna nueva variante aleatoria

### Ver Eventos Recientes
- Dashboard muestra últimos 5 eventos
- Con tipo de evento y timestamp
- Indicador de variante (A o B)

### Comparación Esperada
- Dashboard muestra predicción de resultados
- Gráficos de barras comparativos
- Indicador de "ganador esperado"

---

## 📖 Ejemplo de Sesión de Prueba

### Sesión 1: Como Usuario Normal

1. ✅ Abre la app
2. ✅ Login como operador
3. ✅ Ve "Órdenes de Trabajo"
4. ✅ **Sistema te asigna variante automáticamente**
5. ✅ Observa qué botón tienes (header o FAB)
6. ✅ Haz click en el botón QR 3 veces
7. ✅ Navega al dashboard
8. ✅ Verás: 1 vista, 3 clicks, CTR = 300%

### Sesión 2: Cambiar de Variante

1. ✅ En dashboard, presiona "Reset"
2. ✅ Confirma
3. ✅ **Cierra la app completamente**
4. ✅ Vuelve a abrir
5. ✅ Repite pasos de Sesión 1
6. ✅ Ahora podrías tener la otra variante

### Sesión 3: Simular Múltiples Usuarios

1. ✅ Repite "Sesión 2" varias veces
2. ✅ Cada reset = nuevo "usuario virtual"
3. ✅ Acumula datos de ambas variantes
4. ✅ Compara resultados en dashboard

---

## 🎓 Interpretación de Resultados

### CTR Alto (> 80%)
✅ **Bueno** - El botón es fácil de encontrar y usar
✅ Los usuarios escanean QR frecuentemente

### CTR Bajo (< 50%)
⚠️ **Atención** - El botón puede ser difícil de encontrar
⚠️ O no es necesario escanear tanto

### Comparación A vs B

**Si Variante B tiene CTR +20% mayor:**
🏆 **FAB GANA** - Implementar en producción

**Si Variante A tiene CTR similar o mayor:**
🏆 **Header GANA** - Mantener diseño actual

**Si diferencia < 10%:**
🤷 **Inconcluso** - Necesitamos más datos o son equivalentes

---

## ⚠️ Troubleshooting

### No veo mis métricas
**Problema:** Dashboard muestra 0 eventos
**Solución:** 
1. Asegúrate de haber visitado la pantalla del operador
2. Verifica que hiciste click en el botón QR
3. Regresa al dashboard y refresca (cierra/abre)

### Siempre tengo la misma variante
**Problema:** Después de reset, tengo la misma variante
**Solución:**
1. La asignación es aleatoria (50/50)
2. Tienes 50% probabilidad de misma variante
3. Intenta resetear 2-3 veces hasta obtener la otra

### No encuentro el botón QR
**Problema:** No veo el botón en la pantalla
**Solución:**
1. **Variante A:** Mira esquina superior derecha del header
2. **Variante B:** Mira esquina inferior derecha (flotante)
3. Si aún no lo ves, verifica que estás en `/operator/work-orders`

### El dashboard no carga
**Problema:** Error al abrir dashboard
**Solución:**
1. Verifica que el provider está en `_layout.tsx`
2. Asegúrate de que AsyncStorage tiene permisos
3. Revisa la consola por errores

---

## 📊 Datos de Ejemplo

### Ejemplo Real de Métricas

```
Tu Variante: B (FAB Flotante)

Métricas:
- Vistas de Pantalla: 12
- Clicks en Botón QR: 10
- CTR: 83.33%
- Eventos Totales: 23

Últimos Eventos:
1. qr_button_clicked - 10:45:32
2. screen_viewed - 10:45:15
3. qr_button_clicked - 10:42:18
4. qr_button_clicked - 10:41:55
5. screen_viewed - 10:41:50
```

---

## 🎯 Objetivos de la Prueba

### Para Ti (Usuario/Tester)
✅ Entender cómo funciona el A/B testing
✅ Experimentar con ambas variantes
✅ Ver tracking en tiempo real
✅ Aprender a interpretar métricas

### Para el Proyecto
✅ Validar cuál diseño de botón es más efectivo
✅ Tomar decisiones basadas en datos
✅ Mejorar la experiencia del operador
✅ Aplicar aprendizajes a otros módulos

---

## 🚀 Próximos Experimentos

Después de este experimento, podríamos probar:

1. **Color del botón "Importar CAD"** (Diseñador)
   - Azul actual vs Verde éxito

2. **Layout de cards de proyectos** (Diseñador)
   - Negras actuales vs Blancas con borde

3. **Tamaño del FAB** (si B gana)
   - 56px vs 64px vs 72px

4. **Posición exacta del FAB**
   - bottom: 80px vs 90px vs 100px

---

## 📞 Soporte

Si tienes problemas o preguntas:

1. 🔍 Revisa la consola del navegador/emulador
2. 📖 Lee la documentación completa: `EXPERIMENTO_AB_BOTON_QR.md`
3. 🐛 Reporta bugs con detalles:
   - Variante asignada
   - Pasos para reproducir
   - Screenshots

---

## ✅ Checklist de Prueba

- [ ] Abrir la app y hacer login
- [ ] Acceder al dashboard A/B
- [ ] Verificar qué variante tengo asignada
- [ ] Ir a pantalla del operador
- [ ] Observar ubicación del botón QR
- [ ] Hacer click en el botón 3-5 veces
- [ ] Regresar al dashboard
- [ ] Verificar que métricas se actualizaron
- [ ] Ver eventos recientes
- [ ] Probar función de reset
- [ ] Cerrar y reabrir app
- [ ] Verificar si cambió de variante
- [ ] Repetir proceso con nueva variante

---

**🎉 ¡Listo para probar!**

Recuerda: Cada click cuenta. El sistema trackea todo automáticamente.

**Versión**: 1.0  
**Última actualización**: 10 de Diciembre, 2024