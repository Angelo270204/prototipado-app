# 🔍 DEBUG DEL CHAT - INSTRUCCIONES

## CAMBIOS APLICADOS:

He agregado logs exhaustivos en TODO el flujo del chat para identificar exactamente dónde se detiene.

### Logs que deberías ver al enviar un mensaje:

```
🔴 [Chat] handleSendComment INICIADO
🔴 [Chat] newComment: [tu mensaje]
🔴 [Chat] newComment.trim(): [tu mensaje sin espacios]
🔴 [Chat] currentUser: [objeto con tu info]
🔴 [Chat] projectId: [id del proyecto]
📤 [Chat] ENVIANDO mensaje: [objeto completo]
🟢 [ChatContext] sendMessage RECIBIDO: [objeto]
🟢 [ChatContext] senderName original: [tu nombre]
🟢 [ChatContext] Nuevo mensaje creado: [mensaje completo]
🟢 [ChatContext] Estado de messages ANTES: [número]
🟢 [ChatContext] Estado de messages DESPUÉS: [número + 1]
✅ [Chat] sendMessage ejecutado exitosamente
🔴 [Chat] Input limpiado
🔴 [Chat] Scroll ejecutado
💾 [ChatContext] Mensajes guardados: [número]
🔍 [ChatContext] getProjectMessages llamado para proyecto: [id]
🔍 [ChatContext] Mensajes filtrados para proyecto: [número]
```

## PASOS PARA DEBUGGEAR:

1. **ABRE LA CONSOLA DE METRO/EXPO** (la ventana de terminal donde se ejecuta `expo start`)

2. **LIMPIA LA CONSOLA**: Presiona `Ctrl+L` o escribe `clear`

3. **LOGIN COMO RENZO**:
   - Email: renzozv@gmail.com
   - Password: r12345

4. **ABRE UN PROYECTO Y ENTRA AL CHAT**

5. **ESCRIBE UN MENSAJE Y ENVÍA**

6. **COPIA TODOS LOS LOGS** que aparezcan en la consola y pégamelos COMPLETOS

## QUÉ BUSCAR:

### Si ves "ABORTADO: mensaje vacío"
→ El input no tiene texto, verifica que estés escribiendo algo

### Si ves "ABORTADO: no hay currentUser"
→ El usuario no está autenticado correctamente
→ Verifica que veas antes: `💬 [Chat] Current User Object: {id: 'u2', name: 'Renzo Cliente', ...}`

### Si ves "ABORTADO: no hay projectId"
→ La navegación al chat no pasó el projectId correctamente
→ Verifica que veas antes: `💬 [Chat] ProjectId: p1` (o el id que sea)

### Si ves "Error al enviar mensaje"
→ Hubo una excepción en sendMessage
→ Busca el error completo arriba de ese mensaje

### Si NO VES NINGÚN LOG 🔴
→ El botón de enviar no está ejecutando `handleSendComment`
→ Verifica que el botón no esté disabled

### Si VES TODOS LOS LOGS pero el mensaje NO APARECE en la UI
→ El problema está en el render o en `getProjectMessages`
→ Busca los logs 🔍 de `getProjectMessages`

## ESCENARIOS POSIBLES:

### A) Los logs 🔴 aparecen pero NO los logs 🟢
→ `sendMessage` del contexto no se está ejecutando
→ Puede ser un problema con la importación del contexto

### B) Los logs 🟢 aparecen pero el contador de mensajes NO AUMENTA
→ `setMessages` no está actualizando el estado
→ Puede ser un problema con el estado de React

### C) Los logs 🟢 muestran que aumentó pero 🔍 dice "0 mensajes filtrados"
→ El `projectId` usado al enviar NO coincide con el usado al filtrar
→ Busca diferencias entre los dos projectId en los logs

### D) Todo funciona en los logs pero la UI no se actualiza
→ El componente no se re-renderiza cuando cambia `projectMessages`
→ Verifica que `projectMessages` se esté recalculando

## DAME ESTA INFORMACIÓN:

1. ¿Qué usuario estás usando? (Renzo, Yardy, Angelo, Stephano)
2. ¿Qué proyecto abriste? (Motor Industrial V3, Sistema Hidráulico B, u otro)
3. ¿Cuál es el projectId que aparece en los logs? (ejemplo: p1, p2, p1732...)
4. ¿Cuántos mensajes dice que hay ANTES de enviar?
5. ¿Cuántos mensajes dice que hay DESPUÉS de enviar?
6. ¿Cuántos mensajes filtrados dice `getProjectMessages`?
7. **PÉGAME TODOS LOS LOGS** completos desde que abriste el chat hasta que enviaste el mensaje

Con esa información podré identificar EXACTAMENTE dónde está fallando.

