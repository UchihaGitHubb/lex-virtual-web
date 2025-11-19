# 🚀 Forzar Datos Mock AHORA (Solución Definitiva)

Si los datos mock no se están mostrando, ejecuta este código en la consola del navegador (F12):

## 📋 Código Completo para Copiar y Pegar

```javascript
// ============================================
// FORZAR MODO MOCK - Copia y pega todo esto
// ============================================

// 1. Activar modo mock en localStorage
localStorage.setItem("USE_MOCK_DATA", "true");

// 2. Verificar variable de entorno (solo lectura, no se puede cambiar desde aquí)
console.log("🔍 VITE_USE_MOCK_DATA:", import.meta.env.VITE_USE_MOCK_DATA);

// 3. Mostrar estado actual
console.log("✅ Modo mock activado en localStorage");

// 4. Recargar la página
console.log("🔄 Recargando página...");
location.reload();
```

## 🎯 Para Panel del Estudiante

Si quieres ver el panel del estudiante, después de ejecutar el código anterior, ejecuta también:

```javascript
// Cambiar rol a estudiante temporalmente
const user = JSON.parse(localStorage.getItem("user") || '{}');
user.role = "student";
localStorage.setItem("user", JSON.stringify(user));
location.href = "/student-profile";
```

## 🎯 Para Panel del Profesor

Si quieres ver el panel del profesor, después de ejecutar el código anterior, ejecuta:

```javascript
// Asegurar que el rol sea profesor
const user = JSON.parse(localStorage.getItem("user") || '{}');
user.role = "teacher";
localStorage.setItem("user", JSON.stringify(user));
location.href = "/tracking";
```

## ✅ Verificación

Después de ejecutar el código, abre la consola (F12) y deberías ver:

```
🔍 Verificando modo mock: { envMock: false, storageMock: true, useMock: true, ... }
📦 Cargando datos mock para Tracking/StudentProfile...
✅ Datos mock cargados: ...
```

## 🔧 Si Aún No Funciona

1. **Limpia el caché del navegador**: Ctrl+Shift+Delete → Limpiar caché
2. **Cierra todas las pestañas** de la aplicación
3. **Abre una nueva pestaña** y ejecuta el código de nuevo
4. **Verifica que estés en modo desarrollo**: `npm run dev` (no `npm run build`)

## 📝 Nota Importante

- El código de arriba funciona **inmediatamente** sin reiniciar el servidor
- Se mantiene hasta que limpies el localStorage
- Funciona tanto para profesor como para estudiante

