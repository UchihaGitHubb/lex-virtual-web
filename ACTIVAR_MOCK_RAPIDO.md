# 🚀 Activar Datos Mock Rápidamente

Si los datos mock no se están mostrando, sigue estos pasos en orden:

## ✅ Método 1: Desde la Consola del Navegador (MÁS RÁPIDO)

1. Abre la aplicación en tu navegador
2. Abre la consola del navegador (F12 o clic derecho → Inspeccionar → Consola)
3. Ejecuta este código:

```javascript
localStorage.setItem("USE_MOCK_DATA", "true");
location.reload();
```

4. Los datos mock deberían aparecer inmediatamente

## ✅ Método 2: Verificar y Reiniciar

1. Verifica que el archivo `.env` en la raíz tenga:
   ```
   VITE_USE_MOCK_DATA=true
   ```

2. **Detén completamente el servidor** (Ctrl+C)

3. **Reinicia el servidor**:
   ```bash
   npm run dev
   ```

4. **Refresca el navegador** con Ctrl+Shift+R (o Cmd+Shift+R en Mac)

## ✅ Método 3: Verificar en la Consola

Después de cargar la página, abre la consola (F12) y busca estos mensajes:

```
🔍 Verificando modo mock: { envMock: true, storageMock: false, ... }
📦 Cargando datos mock para StudentProfile...
✅ Datos mock cargados: ...
```

Si ves `envMock: false`, significa que la variable de entorno no se está leyendo.

## 🔍 Verificar que Funciona

1. Ve a `/student-profile` (después de login como estudiante)
2. Deberías ver:
   - **Perfil**: María González, 5 casos completados
   - **Progreso**: 5 casos con métricas
   - **Estadísticas**: Métricas generales
   - **Retroalimentaciones**: 3 comentarios del profesor

## ⚠️ Si Aún No Funciona

1. Verifica que estés en modo desarrollo (`npm run dev`, no `npm run build`)
2. Verifica que no haya errores en la consola del navegador
3. Verifica que estés en la ruta correcta (`/student-profile`)
4. Intenta el Método 1 (forzar desde localStorage) - es el más confiable

## 📝 Nota

El Método 1 (localStorage) es el más rápido y confiable porque:
- No requiere reiniciar el servidor
- Funciona inmediatamente
- No depende de variables de entorno
- Se mantiene hasta que limpies el localStorage

