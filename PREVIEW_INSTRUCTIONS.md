# 🎨 Instrucciones para Ver la Previsualización

Este documento explica cómo activar el modo de previsualización para ver cómo se vería la aplicación con datos reales del backend.

## 🚀 Activación Rápida

### Paso 1: Activar el modo mock

Crea un archivo `.env` en la raíz del proyecto (si no existe) y agrega:

```env
VITE_USE_MOCK_DATA=true
```

### Paso 2: Reiniciar el servidor

Si el servidor está corriendo, deténlo (Ctrl+C) y vuelve a iniciarlo:

```bash
npm run dev
```

### Paso 3: Acceder a la aplicación

Abre tu navegador en `http://localhost:5173` (o el puerto que te indique Vite)

## 📋 Qué Verás

### Panel del Profesor

1. **Login** → Inicia sesión con cualquier email/password
2. **Dashboard** → Confirma tu rol
3. **Panel de Seguimiento** → Verás 4 estudiantes de ejemplo:
   - María González (3 casos)
   - Juan Pérez (5 casos)
   - Ana Martínez (2 casos)
   - Carlos Rodríguez (4 casos)
4. **Detalles del Estudiante** → Haz clic en cualquier estudiante para ver:
   - Lista de casos completados
   - Métricas de rendimiento (frecuencia cardíaca, nerviosismo, muletillas, interrupciones)
   - Gráfico de nerviosismo por etapa del juicio
   - Formulario para dejar retroalimentación (texto o voz)

### Panel del Estudiante

1. **Login** → Inicia sesión como estudiante (cualquier email/password)
2. **Dashboard** → Confirma tu rol
3. **Mi Perfil** → Verás el perfil completo de María González con:

   **Pestaña Perfil:**
   - Información personal (nombre, email, fecha de registro)
   - Resumen: 5 casos completados, 1h 44m de práctica, 8.5 de puntuación promedio

   **Pestaña Progreso:**
   - 5 casos completados con detalles:
     - Caso #1: 20:00 - Nerviosismo Bajo - Con retroalimentación de texto
     - Caso #2: 22:30 - Nerviosismo Medio - Con retroalimentación de voz
     - Caso #3: 20:45 - Nerviosismo Medio - Con retroalimentación de texto
     - Caso #4: 18:20 - Nerviosismo Bajo - Sin retroalimentación
     - Caso #5: 22:35 - Nerviosismo Medio - Sin retroalimentación
   - Al hacer clic en un caso, verás:
     - Métricas detalladas (frecuencia cardíaca, muletillas, interrupciones)
     - Gráfico de nerviosismo por etapa
     - Retroalimentaciones del profesor (si las hay)

   **Pestaña Estadísticas:**
   - Total de casos completados: 5
   - Tiempo total de práctica: 1h 44m
   - Frecuencia cardíaca promedio: 82 BPM
   - Nivel de nerviosismo promedio: Medio
   - Total de palabras de relleno: 17
   - Total de interrupciones: 12
   - Estadísticas por etapa (Introducción, Testimonio, Objeción, Alegato final)

   **Pestaña Retroalimentaciones:**
   - 3 retroalimentaciones del profesor:
     - Caso #1: Retroalimentación de texto
     - Caso #2: Retroalimentación de voz (45 segundos)
     - Caso #3: Retroalimentación de texto detallada

## 🎯 Características Visuales

- **Diseño elegante y profesional** inspirado en webs de facultades de Derecho
- **Paleta de colores**: Azul oscuro, marfil, gris piedra, dorado suave
- **Tipografía**: Merriweather/Playfair Display para títulos, Open Sans/Roboto para texto
- **Componentes**: Cards con sombras suaves, botones redondeados, jerarquía visual clara
- **Responsive**: Se adapta a diferentes tamaños de pantalla

## 🔄 Desactivar el Modo Mock

Para volver a usar el backend real, simplemente:

1. Elimina o comenta la línea en `.env`:
   ```env
   # VITE_USE_MOCK_DATA=true
   ```

2. Reinicia el servidor de desarrollo

## 📝 Notas

- Los datos mock son solo para visualización
- No se guardan cambios (feedback, etc.) en modo mock
- El sistema intentará usar el backend primero, y solo usará mock si:
  - `VITE_USE_MOCK_DATA=true` está configurado, O
  - Estás en modo desarrollo y el backend no está disponible

## 🐛 Solución de Problemas

Si no ves los datos mock:

1. Verifica que el archivo `.env` existe y tiene `VITE_USE_MOCK_DATA=true`
2. Reinicia el servidor de desarrollo completamente
3. Limpia la caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)
4. Verifica en la consola del navegador si hay errores

## 📸 Vista Previa

Con el modo mock activado, podrás ver:

✅ Lista completa de estudiantes con sus casos
✅ Métricas biométricas detalladas (frecuencia cardíaca, nerviosismo)
✅ Gráficos de nerviosismo por etapa del juicio
✅ Retroalimentaciones del profesor (texto y voz)
✅ Estadísticas generales y por etapa
✅ Perfil completo del estudiante
✅ Diseño profesional y elegante

¡Todo listo para que veas cómo se verá la aplicación con datos reales!

