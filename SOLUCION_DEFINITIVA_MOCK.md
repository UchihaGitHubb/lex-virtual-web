# ✅ Solución DEFINITIVA para Activar Datos Mock

El problema es que `VITE_USE_MOCK_DATA` está `undefined`. Usa esta solución que **SIEMPRE funciona**:

## 🚀 Código para Ejecutar en la Consola (F12)

Copia y pega **TODO** este código:

```javascript
// ============================================
// SOLUCIÓN DEFINITIVA - FORZAR MODO MOCK
// ============================================

// Activar modo mock forzado
localStorage.setItem("FORCE_MOCK", "true");
localStorage.setItem("USE_MOCK_DATA", "true");

console.log("✅ Modo mock FORZADO activado");
console.log("🔄 Recargando página en 1 segundo...");

setTimeout(() => {
  location.reload();
}, 1000);
```

## 📋 Después de Recargar

### Para Panel del Profesor:
```javascript
// Asegurar rol de profesor
const user = JSON.parse(localStorage.getItem("user") || '{}');
user.role = "teacher";
localStorage.setItem("user", JSON.stringify(user));
location.href = "/tracking";
```

### Para Panel del Estudiante:
```javascript
// Cambiar a estudiante
const user = JSON.parse(localStorage.getItem("user") || '{}');
user.role = "student";
localStorage.setItem("user", JSON.stringify(user));
location.href = "/student-profile";
```

## ✅ Verificación

Después de ejecutar el código, en la consola deberías ver:

```
🔍 Verificando modo mock: { envMock: false, storageMock: true, isDev: true, forceMock: true, useMock: true, ... }
📦 Cargando datos mock para Tracking/StudentProfile...
✅ Datos mock cargados: ...
```

## 🔧 Si Aún No Funciona

1. **Limpia todo el localStorage**:
```javascript
localStorage.clear();
localStorage.setItem("FORCE_MOCK", "true");
location.reload();
```

2. **Verifica que estés en desarrollo**: Debe decir `isDev: true` en los logs

3. **Cierra todas las pestañas** y abre una nueva

## 📝 Nota

- `FORCE_MOCK` es una nueva opción que siempre funciona en desarrollo
- No requiere reiniciar el servidor
- Funciona incluso si la variable de entorno no se carga

