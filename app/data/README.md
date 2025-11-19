# Datos de Ejemplo (Mock Data)

Este directorio contiene datos de ejemplo para visualizar el sistema sin necesidad de tener el backend completamente configurado.

## Cómo usar los datos de ejemplo

### Opción 1: Activar modo mock con variable de entorno

Crea un archivo `.env` en la raíz del proyecto y agrega:

```env
VITE_USE_MOCK_DATA=true
```

Luego reinicia el servidor de desarrollo:

```bash
npm run dev
```

### Opción 2: Fallback automático en desarrollo

Si no configuras la variable de entorno, el sistema intentará usar el backend primero. Si falla la conexión y estás en modo desarrollo (`npm run dev`), automáticamente usará los datos mock como fallback.

## Datos incluidos

### Estudiantes de ejemplo

1. **María González** - 3 casos completados
2. **Juan Pérez** - 5 casos completados
3. **Ana Martínez** - 2 casos completados
4. **Carlos Rodríguez** - 4 casos completados

### Casos de ejemplo

Cada estudiante tiene casos con:
- Número de caso
- Fecha de completación
- Tiempo de completación
- Métricas de desempeño (muletillas, interrupciones, ritmo cardíaco, nerviosismo)
- Gráfico de nerviosismo por etapas del juicio
- Feedback de ejemplo (texto y voz)

### Métricas de ejemplo

- **Muletillas**: "eh", "um", "este", "bueno", "entonces"
- **Interrupciones**: 1-5 por caso
- **Ritmo cardíaco**: 70-100 BPM
- **Niveles de nerviosismo**: Bajo, Medio, Alto
- **Tiempo de completación**: 16:40 - 26:40 minutos

### Gráfico de nerviosismo

Cada caso incluye datos para 4 etapas:
1. **Introducción** - Nerviosismo bajo (70-80 BPM)
2. **Testimonio** - Nerviosismo medio (80-90 BPM)
3. **Objeción** - Nerviosismo alto (90-100 BPM)
4. **Alegato final** - Nerviosismo medio (85-95 BPM)

## Navegación de ejemplo

Para probar el sistema completo:

1. Inicia sesión como docente
2. Ve al Dashboard y confirma tu rol
3. Haz clic en "Continuar" para ir al Panel de Seguimiento
4. Verás la lista de 4 estudiantes de ejemplo
5. Haz clic en cualquier estudiante para ver sus detalles
6. Selecciona diferentes casos para ver las métricas
7. Prueba el formulario de feedback (texto y voz)

## IDs de ejemplo

- **Estudiantes**: `student-001`, `student-002`, `student-003`, `student-004`
- **Casos**: `case-001`, `case-002`, `case-003`, etc.

## Notas

- Los datos mock se generan dinámicamente para cada caso
- Los tiempos y métricas varían ligeramente para simular datos reales
- El feedback de ejemplo solo aparece en algunos casos específicos
- En producción, estos datos no se usarán (solo se activan con la variable de entorno o en desarrollo)

