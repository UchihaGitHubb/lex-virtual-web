# 🔧 Solución: Datos Mock No Se Muestran

Si los datos mock no se están mostrando, sigue estos pasos:

## ✅ Paso 1: Verificar el archivo .env

Asegúrate de que el archivo `.env` en la raíz del proyecto contenga:

```env
VITE_USE_MOCK_DATA=true
```

## ✅ Paso 2: Reiniciar el servidor

**IMPORTANTE**: Vite solo carga las variables de entorno al iniciar. Debes:

1. **Detener el servidor** completamente (Ctrl+C en la terminal)
2. **Reiniciar** con `npm run dev`
3. **Refrescar el navegador** (Ctrl+Shift+R o Cmd+Shift+R para limpiar caché)

## ✅ Paso 3: Verificar en la consola del navegador

Abre la consola del navegador (F12) y busca estos mensajes:

```
🔍 Modo Mock activado: true
🔍 VITE_USE_MOCK_DATA: true
📦 Cargando datos mock para StudentProfile...
✅ Datos mock cargados: ...
```

Si ves `Modo Mock activado: false`, significa que la variable no se está leyendo.

## ✅ Paso 4: Solución alternativa (Forzar Mock)

Si después de reiniciar aún no funciona, puedes forzar el modo mock desde la consola del navegador:

1. Abre la consola (F12)
2. Ejecuta:
```javascript
localStorage.setItem("USE_MOCK_DATA", "true");
location.reload();
```

Esto forzará el uso de datos mock incluso si la variable de entorno no se carga.

## ✅ Paso 5: Verificar que estás en la ruta correcta

Asegúrate de estar en:
- **Panel del Estudiante**: `/student-profile` (después de login como estudiante)
- **Retroalimentaciones**: `/my-feedbacks`
- **Panel del Profesor**: `/tracking` (después de login como profesor)

## 🐛 Debug Adicional

Si aún no funciona, verifica:

1. **¿Estás en modo desarrollo?**
   - El fallback automático solo funciona en `npm run dev`
   - No funciona en producción (`npm run build`)

2. **¿Hay errores en la consola?**
   - Revisa la consola del navegador para errores de JavaScript
   - Verifica que no haya errores de importación

3. **¿El archivo .env está en la raíz?**
   - Debe estar en: `lex-virtual-web/.env`
   - No en `lex-virtual-web/app/.env`

4. **¿Vite está leyendo el .env?**
   - Las variables de Vite deben empezar con `VITE_`
   - Solo se cargan al iniciar el servidor

## 📝 Nota Importante

Si cambias el archivo `.env`:
- **SIEMPRE** debes reiniciar el servidor de desarrollo
- Las variables de entorno se cargan solo al inicio
- Refrescar el navegador NO es suficiente

## 🚀 Solución Rápida

Si necesitas ver los datos mock AHORA:

1. Abre la consola del navegador (F12)
2. Ejecuta:
```javascript
localStorage.setItem("USE_MOCK_DATA", "true");
location.reload();
```

Esto activará el modo mock inmediatamente sin necesidad de reiniciar el servidor.

