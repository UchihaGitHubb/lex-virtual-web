**Demo en vivo:** [lex-virtual-demo.vercel.app](https://lex-virtual-demo.vercel.app) — entra como docente o estudiante con datos de ejemplo, sin backend.

# 📖 Guía de Instalación - Lex Virtual Web Frontend

Esta guía te ayudará a configurar y ejecutar el frontend de Lex Virtual en otro PC.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js** (versión 18 o superior)
   - Descarga desde: https://nodejs.org/
   - Verifica la instalación: node --version
   - Verifica npm: npm --version

2. **Git** (para clonar el repositorio)
   - Descarga desde: https://git-scm.com/
   - Verifica la instalación: git --version

3. **Editor de código** (opcional pero recomendado)
   - Visual Studio Code: https://code.visualstudio.com/
   - O cualquier editor de tu preferencia

## 🚀 Pasos de Instalación

### Paso 1: Clonar el Repositorio

Abre una terminal (PowerShell, CMD, o Git Bash) y ejecuta:
bash
# Clonar el repositorio
git clone https://github.com/UchihaGitHubb/lex-virtual-web.git

# Entrar al directorio del proyecto
cd lex-virtual-web

**Nota:** Si el repositorio es privado, necesitarás autenticarte con GitHub.

### Paso 2: Instalar Dependencias
bash
# Instalar todas las dependencias del proyecto
npm install

Este proceso puede tardar varios minutos la primera vez. Verás que se descargan todos los paquetes necesarios.

### Paso 3: Configurar Variables de Entorno

Crea un archivo .env en la raíz del proyecto:
bash
# En Windows (PowerShell)
New-Item -Path .env -ItemType File

# O simplemente crea el archivo manualmente con tu editor

Agrega el siguiente contenido al archivo .env:
env
# URL del backend (ajusta según tu configuración)
VITE_API_URL=http://localhost:3000

# Opcional: Activar datos mock para desarrollo (solo si el backend no está disponible)
# VITE_USE_MOCK_DATA=false

**Importante:**
Si el backend está en otro puerto o servidor, cambia http://localhost:3000 por la URL correcta
Si el backend está en otro PC de la red, usa la IP local (ej: http://192.168.1.100:3000)

### Paso 4: Verificar la Configuración

Verifica que el archivo .env se haya creado correctamente:
bash
# En Windows (PowerShell)
Get-Content .env

# O simplemente ábrelo con tu editor

### Paso 5: Ejecutar el Proyecto
bash
# Iniciar el servidor de desarrollo
npm run dev

Deberías ver un mensaje similar a:
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose

### Paso 6: Abrir en el Navegador

Abre tu navegador y ve a:
http://localhost:5173

¡Listo! El frontend debería estar funcionando.

## 🔧 Configuración del Backend

### Backend en el mismo PC

Si el backend está corriendo en el mismo PC:

1. Asegúrate de que el backend esté corriendo en http://localhost:3000
2. El archivo .env debe tener: VITE_API_URL=http://localhost:3000

### Backend en otro PC de la red local

Si el backend está en otro PC de tu red:

1. Encuentra la IP del PC donde corre el backend:
   
bash
   # En Windows
   ipconfig
   # Busca "IPv4 Address" (ej: 192.168.1.100)
   

2. Actualiza el archivo .env:
   
env
   VITE_API_URL=http://192.168.1.100:3000
   
   (Reemplaza 192.168.1.100 con la IP real del backend)

3. Asegúrate de que el firewall permita conexiones en el puerto 3000

### Backend en producción/remoto

Si el backend está en un servidor remoto:
env
VITE_API_URL=https://tu-backend.com

## 📁 Estructura del Proyecto
lex-virtual-web/
├── app/
│   ├── components/        # Componentes reutilizables
│   ├── pages/            # Páginas principales
│   ├── routes/           # Configuración de rutas
│   ├── types/            # Tipos TypeScript
│   ├── config/           # Configuración (API, etc.)
│   └── data/             # Datos mock (solo desarrollo)
├── public/               # Archivos estáticos
├── docs/                 # Documentación
├── .env                  # Variables de entorno (crear manualmente)
├── package.json          # Dependencias del proyecto
└── README.md            # Este archivo

## 🎯 Comandos Disponibles
bash
# Desarrollo (con hot reload)
npm run dev

# Construir para producción
npm run build

# Verificar tipos TypeScript
npm run typecheck

# Ejecutar versión de producción (después de build)
npm start

## 🔐 Autenticación

El sistema usa JWT (JSON Web Tokens) para autenticación:

Los tokens se guardan en localStorage
Se envían automáticamente en las peticiones al backend
Si el token expira, se redirige al login

## 👥 Roles de Usuario

### Docente (Teacher)
Puede registrarse desde la web
Accede al Panel de Seguimiento
Ve lista de estudiantes
Puede ver métricas y dejar retroalimentaciones

### Estudiante (Student)
Se registra desde la aplicación Unity
Puede iniciar sesión en la web
Accede a su perfil con:
  - Información personal
  - Progreso por caso
  - Estadísticas generales
  - Retroalimentaciones del profesor

## 🐛 Solución de Problemas

### Error: "Cannot find module"
bash
# Elimina node_modules y reinstala
rm -rf node_modules
npm install

En Windows:
powershell
Remove-Item -Recurse -Force node_modules
npm install

### Error: "Port 5173 already in use"

El puerto 5173 está ocupado. Puedes:
1. Cerrar la otra aplicación que lo usa
2. O cambiar el puerto en vite.config.ts

### Error: "Failed to fetch" o "NetworkError"

1. Verifica que el backend esté corriendo
2. Verifica la URL en .env (VITE_API_URL)
3. Verifica que no haya problemas de firewall
4. Si el backend está en otro PC, verifica la IP

### Error: "Module not found" después de clonar
bash
# Asegúrate de haber ejecutado
npm install

### El navegador muestra página en blanco

1. Abre la consola del navegador (F12)
2. Revisa si hay errores en la consola
3. Verifica que el servidor esté corriendo (npm run dev)
4. Intenta limpiar la caché del navegador (Ctrl+Shift+R)

### No se conecta al backend

1. Verifica que el backend esté corriendo
2. Verifica la URL en .env
3. Prueba acceder a la URL del backend directamente en el navegador
4. Verifica que no haya problemas de CORS en el backend

## 📝 Notas Importantes

1. **Archivo .env**: No se sube al repositorio (está en .gitignore). Debes crearlo manualmente en cada PC.

2. **Node Modules**: No se suben al repositorio. Siempre ejecuta npm install después de clonar.

3. **Backend requerido**: El frontend necesita el backend corriendo para funcionar completamente. Sin el backend, verás errores de conexión.

4. **Puerto por defecto**: El frontend corre en el puerto 5173. Si necesitas cambiarlo, modifica vite.config.ts.

5. **Hot Reload**: Durante el desarrollo, los cambios se reflejan automáticamente en el navegador.

## 🔄 Actualizar el Proyecto

Si el proyecto se actualiza en el repositorio:
bash
# Obtener los últimos cambios
git pull

# Reinstalar dependencias (por si hay nuevas)
npm install

# Reiniciar el servidor de desarrollo
npm run dev

## 📚 Recursos Adicionales

**Documentación de React Router**: https://reactrouter.com/
**Documentación de Vite**: https://vitejs.dev/
**Documentación de TypeScript**: https://www.typescriptlang.org/

## 🆘 Soporte

Si encuentras problemas:

1. Revisa la consola del navegador (F12) para errores
2. Revisa la terminal donde corre npm run dev para errores
3. Verifica que todos los requisitos previos estén instalados
4. Verifica la configuración del .env
5. Asegúrate de que el backend esté corriendo y accesible

## ✅ Checklist de Instalación

[ ] Node.js instalado (versión 18+)
[ ] Git instalado
[ ] Repositorio clonado
[ ] Dependencias instaladas (npm install)
[ ] Archivo .env creado y configurado
[ ] Backend corriendo y accesible
[ ] Servidor de desarrollo iniciado (npm run dev)
[ ] Aplicación abierta en el navegador (http://localhost:5173)

¡Listo para desarrollar! 🚀
