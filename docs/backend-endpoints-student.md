# Endpoints Requeridos para el Panel del Estudiante

Este documento describe los endpoints que el backend debe implementar para que el panel del estudiante funcione correctamente.

## Autenticación

Todos los endpoints requieren autenticación JWT y deben validar que el usuario sea un estudiante.

---

## 1. GET /students/my-profile

**Descripción:** Obtiene el perfil completo del estudiante autenticado.

**Autenticación:** Requerida (JWT)

**Permisos:** Solo estudiantes

**Respuesta Exitosa (200):**
```json
{
  "studentId": "string (UUID)",
  "email": "string",
  "name": "string",
  "lastName": "string",
  "createdAt": "string (ISO 8601)",
  "totalCasesCompleted": "number",
  "averageScore": "number (opcional)",
  "totalPracticeTimeSeconds": "number (opcional)"
}
```

**Errores:**
- `401 Unauthorized`: Token inválido o expirado
- `403 Forbidden`: Usuario no es estudiante
- `404 Not Found`: Estudiante no encontrado

---

## 2. GET /students/my-cases

**Descripción:** Obtiene todos los casos del estudiante autenticado con su progreso y métricas.

**Autenticación:** Requerida (JWT)

**Permisos:** Solo estudiantes

**Respuesta Exitosa (200):**
```json
[
  {
    "caseId": "string (UUID)",
    "caseNumber": "number",
    "completedAt": "string (ISO 8601)",
    "status": "completed" | "in_progress" | "not_started",
    "totalTimeSeconds": "number",
    "performanceMetrics": {
      "caseId": "string (UUID)",
      "caseNumber": "number",
      "fillerWords": ["string"],
      "interruptionsCount": "number",
      "totalTimeSeconds": "number",
      "heartRateBpm": "number",
      "nerviosismLevel": "low" | "medium" | "high"
    },
    "nerviosismChart": {
      "caseId": "string (UUID)",
      "caseNumber": "number",
      "stages": [
        {
          "stage": "introduction" | "testimony" | "objection" | "final_argument",
          "stageName": "string (opcional)",
          "bpmValue": "number | null",
          "levelLabel": "low" | "medium" | "high",
          "timestampSeconds": "number"
        }
      ],
      "totalTimeSeconds": "number (opcional)"
    },
    "feedbacks": [
      {
        "feedbackId": "string (UUID)",
        "caseId": "string (UUID)",
        "teacherId": "string (UUID)",
        "type": "text" | "voice",
        "content": "string | null",
        "voiceUrl": "string | null",
        "voiceDurationSeconds": "number | null",
        "createdAt": "string (ISO 8601)"
      }
    ]
  }
]
```

**Notas:**
- `performanceMetrics` y `nerviosismChart` son opcionales (solo si el caso está completado)
- `feedbacks` es opcional (puede estar vacío si no hay retroalimentaciones)
- Los casos deben estar ordenados por `caseNumber` ascendente

**Errores:**
- `401 Unauthorized`: Token inválido o expirado
- `403 Forbidden`: Usuario no es estudiante

---

## 3. GET /students/my-stats

**Descripción:** Obtiene estadísticas generales del estudiante autenticado.

**Autenticación:** Requerida (JWT)

**Permisos:** Solo estudiantes

**Respuesta Exitosa (200):**
```json
{
  "totalCasesCompleted": "number",
  "totalPracticeTimeSeconds": "number",
  "averageHeartRateBpm": "number (opcional)",
  "averageNerviosismLevel": "low" | "medium" | "high (opcional)",
  "totalFillerWords": "number (opcional)",
  "totalInterruptions": "number (opcional)",
  "casesByStage": [
    {
      "stage": "introduction" | "testimony" | "objection" | "final_argument",
      "count": "number",
      "averageTimeSeconds": "number"
    }
  ]
}
```

**Notas:**
- `casesByStage` es opcional (puede estar vacío)
- Los campos opcionales pueden ser `null` o no estar presentes si no hay datos suficientes

**Errores:**
- `401 Unauthorized`: Token inválido o expirado
- `403 Forbidden`: Usuario no es estudiante

---

## 4. GET /tracking/my-feedbacks (Ya implementado)

**Descripción:** Obtiene todas las retroalimentaciones del estudiante autenticado.

**Estado:** ✅ Ya implementado según documentación previa

**Nota:** Este endpoint ya existe y funciona correctamente. Solo se menciona aquí para referencia.

---

## Consideraciones de Implementación

### Validación de Rol

Todos los endpoints deben validar que el usuario autenticado tenga el rol de `student` o `estudiante`. Si el usuario es un docente, debe retornar `403 Forbidden`.

### Manejo de Datos Opcionales

Muchos campos son opcionales porque:
- El estudiante puede no haber completado ningún caso aún
- Algunas métricas pueden no estar disponibles para casos antiguos
- Las estadísticas requieren múltiples casos para calcular promedios

### Ordenamiento

- Los casos deben estar ordenados por `caseNumber` ascendente
- Las retroalimentaciones deben estar ordenadas por `createdAt` descendente (más recientes primero)

### Formato de Fechas

Todas las fechas deben estar en formato ISO 8601 (ejemplo: `"2024-01-15T10:30:00.000Z"`).

### Formato de Tiempo

Todos los tiempos deben estar en segundos (número entero).

---

## Ejemplo de Implementación (NestJS)

```typescript
// students.controller.ts
@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  @Get('my-profile')
  @Roles('student')
  async getMyProfile(@Request() req) {
    // req.user contiene el usuario autenticado
    return this.studentsService.getProfile(req.user.id);
  }

  @Get('my-cases')
  @Roles('student')
  async getMyCases(@Request() req) {
    return this.studentsService.getCases(req.user.id);
  }

  @Get('my-stats')
  @Roles('student')
  async getMyStats(@Request() req) {
    return this.studentsService.getStats(req.user.id);
  }
}
```

---

## Testing

Se recomienda probar los siguientes escenarios:

1. **Estudiante sin casos completados:**
   - Debe retornar arrays vacíos o valores por defecto
   - No debe generar errores

2. **Estudiante con casos completados:**
   - Debe retornar todos los datos correctamente
   - Las estadísticas deben calcularse correctamente

3. **Docente intentando acceder:**
   - Debe retornar `403 Forbidden`

4. **Token inválido o expirado:**
   - Debe retornar `401 Unauthorized`

---

## Notas Finales

- El frontend está preparado para manejar campos opcionales y arrays vacíos
- Si algún endpoint no está disponible, el frontend mostrará un mensaje de error apropiado
- Los tipos TypeScript en el frontend están definidos en `app/types/tracking.ts` y deben coincidir con las respuestas del backend

