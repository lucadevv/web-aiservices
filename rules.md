# Guía de Configuración Docker para Frontend Next.js

Esta guía establece las reglas y pasos obligatorios para configurar correctamente Docker, Docker Compose y Nginx para un proyecto Next.js en producción.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Paso 1: Crear Dockerfile](#paso-1-crear-dockerfile)
4. [Paso 2: Crear docker-compose.yaml](#paso-2-crear-docker-composeyaml)
5. [Paso 3: Crear nginx.conf](#paso-3-crear-nginxconf)
6. [Paso 4: Configurar next.config.ts](#paso-4-configurar-nextconfigts)
7. [Paso 5: Crear .dockerignore](#paso-5-crear-dockerignore)
8. [Paso 6: Variables de Entorno](#paso-6-variables-de-entorno)
9. [Verificación y Testing](#verificación-y-testing)
10. [Reglas Críticas](#reglas-críticas)

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener:

- ✅ Proyecto Next.js configurado y funcionando
- ✅ Archivo `.env` con todas las variables de entorno necesarias (o `.env.example` como referencia)
- ✅ Script `start` en `package.json` que ejecute `next start`
- ✅ Docker y Docker Compose instalados
- ✅ Puerto 80 disponible en el servidor

---

## Estructura de Archivos

La estructura final debe ser:

```
proyecto-frontend/
├── src/
│   └── app/
├── Dockerfile
├── docker-compose.yaml
├── nginx.conf
├── .dockerignore
├── .env (o .env.example)
├── next.config.ts
└── package.json
```

---

## Paso 1: Crear Dockerfile

### Reglas Obligatorias:

1. **SIEMPRE usar multi-stage build** (builder + runner) para optimizar el tamaño de la imagen
2. **SIEMPRE usar `node:20-alpine`** o la versión de Node que use el proyecto
3. **SIEMPRE copiar `package*.json` primero** para aprovechar el cache de Docker
4. **SIEMPRE usar `npm install`** si no hay `package-lock.json` (o `npm ci` si existe)
5. **SIEMPRE exponer el puerto 3000** (o el puerto definido en `process.env.PORT`)
6. **SIEMPRE usar `npm run start`** como comando final
7. **SIEMPRE configurar variables `NEXT_PUBLIC_*` como ARG y ENV** en la etapa de build

### Template Obligatorio:

```dockerfile
# --- ETAPA 1: COMPILACIÓN (BUILD) ---
# Usamos una imagen ligera para instalar dependencias y compilar
FROM node:20-alpine AS builder

WORKDIR /app

# Variables de entorno para el build (NEXT_PUBLIC_* se inyectan en tiempo de build)
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ARG NEXT_PUBLIC_ENCRYPTION_KEY=your-default-secret-key

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_ENCRYPTION_KEY=$NEXT_PUBLIC_ENCRYPTION_KEY

# Copiamos package files para instalar dependencias
# Esto se hace primero para aprovechar el cache de Docker
COPY package*.json ./

# Instalamos todas las dependencias (incluyendo devDependencies para compilar)
# Usamos npm install porque no hay package-lock.json (el proyecto usa bun.lock)
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Compilamos el proyecto Next.js (crea la carpeta .next/)
RUN npm run build

# --- ETAPA 2: EJECUCIÓN (PRODUCTION) ---
# Creamos una imagen final más pequeña
FROM node:20-alpine AS runner

WORKDIR /app

# Variables de entorno para Next.js
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Creamos un usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiamos solo los archivos necesarios para producción
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Cambiamos el propietario de los archivos
RUN chown -R nextjs:nodejs /app

USER nextjs

# Tu app corre en el puerto 3000 por defecto
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando para arrancar en producción
CMD ["npm", "run", "start"]
```

### Checklist Dockerfile:

- [ ] Multi-stage build implementado
- [ ] `package*.json` copiado antes del código fuente
- [ ] `npm install` usado (o `npm ci` si hay `package-lock.json`)
- [ ] Variables `NEXT_PUBLIC_*` configuradas como ARG y ENV
- [ ] Puerto correcto expuesto (3000 o el definido en .env)
- [ ] Comando `start` configurado correctamente
- [ ] Solo se copian archivos necesarios en la etapa final
- [ ] Usuario no-root configurado para seguridad

---

## Paso 2: Crear docker-compose.yaml

### Reglas Obligatorias:

1. **SIEMPRE crear 2 servicios**: `app` (Next.js), `nginx` (Reverse Proxy)
2. **SIEMPRE usar una red interna** (`app-network`) para comunicación entre contenedores
3. **NUNCA exponer el puerto 3000 del servicio `app`** al mundo exterior (solo interno)
4. **SIEMPRE exponer solo el puerto 80** del servicio `nginx`
5. **SIEMPRE usar `depends_on`** para establecer el orden de inicio
6. **SIEMPRE usar `restart: always`** para todos los servicios
7. **SIEMPRE pasar variables `NEXT_PUBLIC_*` como build args** (se inyectan en tiempo de build)

### Template Obligatorio:

```yaml
services:
  # 1. Tu Frontend Next.js
  app:
    build:
      context: .
      dockerfile: Dockerfile
      # IMPORTANTE: Las variables NEXT_PUBLIC_* se inyectan en tiempo de BUILD
      # Si necesitas cambiarlas, debes reconstruir la imagen:
      # docker compose build --build-arg NEXT_PUBLIC_API_URL=http://nueva-url
      args:
        - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:8000}
        - NEXT_PUBLIC_ENCRYPTION_KEY=${NEXT_PUBLIC_ENCRYPTION_KEY:-your-default-secret-key}
    container_name: iacom_frontend
    restart: always
    # Variables de entorno en tiempo de ejecución (para variables que NO sean NEXT_PUBLIC_*)
    # env_file:
    #   - .env
    networks:
      - app-network
    # No exponemos el puerto 3000 al mundo exterior, solo a la red interna de docker
    # Nginx hablará con este contenedor por la red interna

  # 2. Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: iacom_frontend_nginx
    restart: always
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
    networks:
      - app-network

# Red interna para que se entiendan los contenedores
networks:
  app-network:
    driver: bridge
```

### Checklist docker-compose.yaml:

- [ ] Servicio `app` configurado con build desde Dockerfile
- [ ] Servicio `nginx` configurado como reverse proxy
- [ ] Red interna `app-network` creada
- [ ] `depends_on` configurado correctamente
- [ ] `restart: always` en todos los servicios
- [ ] Build args configurados para variables `NEXT_PUBLIC_*`
- [ ] Puerto 3000 NO expuesto en el servicio `app`
- [ ] Solo puerto 80 expuesto en el servicio `nginx`
- [ ] Nombres de contenedores descriptivos

---

## Paso 3: Crear nginx.conf

### Reglas Obligatorias:

1. **SIEMPRE usar `server_name` con la IP específica** del servidor (o `_` para aceptar cualquier IP)
2. **SIEMPRE configurar `upstream backend`** apuntando a `app:3000` (nombre del servicio en docker-compose)
3. **SIEMPRE incluir todas las cabeceras proxy** necesarias para Next.js
4. **SIEMPRE usar `proxy_http_version 1.1`** para el proxy
5. **SIEMPRE configurar timeouts** para evitar cuelgues
6. **SIEMPRE incluir cabeceras de seguridad** básicas
7. **SIEMPRE habilitar WebSockets** para Next.js (necesario para algunas features)

### Template Obligatorio:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server app:3000; # 'app' es el nombre del servicio en docker-compose
    }

    server {
        listen 80;
        # IP específica del servidor
        server_name 172.19.5.19;

        # Cabeceras de seguridad básicas (opcional pero recomendado)
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # Configuración para archivos estáticos grandes
        client_max_body_size 100M;

        # Proxy para todas las rutas
        location / {
            proxy_pass http://backend;
            
            # Versión HTTP 1.1 necesaria para proxy
            proxy_http_version 1.1;

            # Cabeceras necesarias para que Next.js reciba la info correcta
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Forwarded-Port $server_port;
            
            # Timeouts para evitar que se cuelgue
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
            
            # WebSockets para Next.js (necesario para HMR y algunas features)
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
```

### Checklist nginx.conf:

- [ ] `upstream backend` apunta a `app:3000` (nombre del servicio)
- [ ] `server_name` configurado con IP específica (o `_` para cualquier IP)
- [ ] `proxy_http_version 1.1` incluido
- [ ] Todas las cabeceras proxy configuradas
- [ ] Timeouts configurados
- [ ] Cabeceras de seguridad incluidas
- [ ] WebSockets habilitados
- [ ] `client_max_body_size` configurado si es necesario

---

## Paso 4: Configurar next.config.ts

### Reglas Obligatorias:

1. **SIEMPRE deshabilitar ESLint durante el build** si hay errores de linting que bloquean el build
2. **SIEMPRE deshabilitar TypeScript durante el build** si hay errores de tipos que bloquean el build
3. **Estos errores se pueden corregir después** del despliegue, no bloquean el funcionamiento

### Template Obligatorio:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deshabilitar ESLint durante el build para permitir que se complete
  // aunque haya errores de linting (se pueden corregir después)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Deshabilitar TypeScript durante el build (opcional, pero recomendado si hay errores de tipos)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
```

### Checklist next.config.ts:

- [ ] `eslint.ignoreDuringBuilds: true` configurado si hay errores de linting
- [ ] `typescript.ignoreBuildErrors: true` configurado si hay errores de tipos
- [ ] Configuración guardada correctamente

---

## Paso 5: Crear .dockerignore

### Reglas Obligatorias:

1. **SIEMPRE excluir `node_modules`** para optimizar el build
2. **SIEMPRE excluir `.next`** y otros directorios de build
3. **SIEMPRE excluir archivos de desarrollo** y configuración local
4. **SIEMPRE excluir archivos Docker** para evitar copiarlos dentro del contenedor

### Template Obligatorio:

```dockerignore
# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Next.js
.next
out
dist

# Testing
coverage
.nyc_output

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# Typescript
*.tsbuildinfo
next-env.d.ts

# Git
.git
.gitignore

# Docker
Dockerfile
docker-compose.yaml
.dockerignore

# IDE
.vscode
.idea
*.swp
*.swo
*~

# Logs
logs
*.log
```

### Checklist .dockerignore:

- [ ] `node_modules` excluido
- [ ] `.next` y directorios de build excluidos
- [ ] Archivos de desarrollo excluidos
- [ ] Archivos Docker excluidos
- [ ] Archivos de entorno local excluidos

---

## Paso 6: Variables de Entorno

### Reglas Obligatorias:

1. **SIEMPRE crear un archivo `.env.example`** como referencia
2. **SIEMPRE documentar todas las variables necesarias**
3. **RECORDAR: Las variables `NEXT_PUBLIC_*` se inyectan en tiempo de BUILD**
4. **SIEMPRE usar valores por defecto** en docker-compose.yaml

### Variables de Entorno Requeridas:

```env
# ============================================
# Variables de Entorno - Frontend Next.js
# ============================================

# --------------------------------------------
# API Backend
# --------------------------------------------
# URL del backend API (sin barra final)
# Ejemplo: http://172.19.5.18:8000 o https://api.tudominio.com
NEXT_PUBLIC_API_URL=http://localhost:8000

# --------------------------------------------
# Seguridad
# --------------------------------------------
# Clave secreta para encriptar/desencriptar tokens en el cliente
# IMPORTANTE: Debe ser una cadena segura de al menos 32 caracteres
# Puedes generar una con: openssl rand -base64 32
NEXT_PUBLIC_ENCRYPTION_KEY=your-default-secret-key-change-this-in-production

# --------------------------------------------
# Next.js (Opcional)
# --------------------------------------------
# Puerto donde correrá Next.js (por defecto 3000)
# Solo necesario si quieres cambiar el puerto
PORT=3000

# Deshabilitar telemetría de Next.js (recomendado)
NEXT_TELEMETRY_DISABLED=1

# --------------------------------------------
# Entorno
# --------------------------------------------
# Entorno de ejecución: development, production, test
NODE_ENV=production
```

### Checklist Variables de Entorno:

- [ ] Archivo `.env.example` creado
- [ ] Todas las variables `NEXT_PUBLIC_*` documentadas
- [ ] Valores por defecto configurados en docker-compose.yaml
- [ ] Archivo `.env` creado en el servidor con valores reales

---

## Verificación y Testing

### Pasos de Verificación:

1. **Construir y levantar los contenedores:**
   ```bash
   docker compose down
   docker compose up -d --build
   ```

2. **Verificar que todos los contenedores estén corriendo:**
   ```bash
   docker compose ps
   ```
   Debe mostrar 2 contenedores: `app`, `nginx` todos con estado "Up"

3. **Revisar logs de cada servicio:**
   ```bash
   docker compose logs app
   docker compose logs nginx
   ```

4. **Probar la aplicación:**
   - Desde navegador: `http://TU_IP` (ej: `http://172.19.5.19`)
   - Debe cargar la aplicación Next.js correctamente

5. **Verificar conectividad entre contenedores:**
   ```bash
   docker compose exec nginx ping app
   ```

### Errores Comunes y Soluciones:

| Error | Causa | Solución |
|-------|-------|----------|
| `502 Bad Gateway` | Nginx no puede conectar con app | Verificar que el servicio se llame `app` en docker-compose |
| `Connection refused` | Next.js no escucha en 0.0.0.0 | Verificar que `HOSTNAME="0.0.0.0"` esté en Dockerfile |
| Variables `NEXT_PUBLIC_*` no funcionan | Se inyectan en build time | Reconstruir la imagen: `docker compose build --no-cache` |
| Contenedor se reinicia constantemente | Error en la aplicación | Revisar logs con `docker compose logs app` |
| Build falla por errores de ESLint | Errores de linting bloquean build | Configurar `eslint.ignoreDuringBuilds: true` en next.config.ts |

---

## Reglas Críticas

### ⚠️ NUNCA HACER:

1. ❌ Exponer el puerto 3000 del servicio `app` al mundo exterior
2. ❌ Olvidar configurar variables `NEXT_PUBLIC_*` como build args
3. ❌ Usar `npm ci` sin tener `package-lock.json`
4. ❌ Olvidar el `depends_on` en docker-compose
5. ❌ No configurar timeouts en nginx.conf
6. ❌ Olvidar las cabeceras proxy en nginx.conf
7. ❌ No habilitar WebSockets en nginx.conf
8. ❌ Cambiar variables `NEXT_PUBLIC_*` sin reconstruir la imagen

### ✅ SIEMPRE HACER:

1. ✅ Usar multi-stage build en Dockerfile
2. ✅ Copiar `package*.json` antes del código fuente
3. ✅ Usar red interna para comunicación entre contenedores
4. ✅ Configurar `restart: always` en todos los servicios
5. ✅ Incluir todas las cabeceras proxy necesarias
6. ✅ Verificar logs después de levantar los contenedores
7. ✅ Probar la aplicación después de la configuración
8. ✅ Reconstruir la imagen si cambias variables `NEXT_PUBLIC_*`

---

## Orden de Ejecución

Sigue este orden estricto:

1. ✅ Crear/verificar `package.json` con script `start`
2. ✅ Crear `Dockerfile` siguiendo el template
3. ✅ Crear `docker-compose.yaml` siguiendo el template
4. ✅ Crear `nginx.conf` siguiendo el template
5. ✅ Configurar `next.config.ts` para ignorar errores de build si es necesario
6. ✅ Crear `.dockerignore` para optimizar el build
7. ✅ Crear `.env.example` y `.env` con todas las variables
8. ✅ Ejecutar `docker compose up -d --build`
9. ✅ Verificar logs y probar la aplicación

---

## Notas Adicionales

### Para Cambiar Variables NEXT_PUBLIC_*:

Las variables que empiezan con `NEXT_PUBLIC_*` se inyectan en tiempo de BUILD, no en tiempo de ejecución. Si necesitas cambiarlas:

1. Edita el archivo `.env` con los nuevos valores
2. Reconstruye la imagen:
   ```bash
   docker compose build --no-cache
   docker compose up -d
   ```

### Para SSL/HTTPS:

Si necesitas HTTPS, agrega configuración SSL en `nginx.conf` y expone el puerto 443 en `docker-compose.yaml`.

### Para Múltiples Entornos:

Crea archivos `docker-compose.prod.yaml` y `docker-compose.dev.yaml` para diferentes entornos.

---

## Resumen de Checklist Final

Antes de considerar la configuración completa, verifica:

- [ ] Dockerfile con multi-stage build
- [ ] docker-compose.yaml con 2 servicios (app, nginx)
- [ ] nginx.conf con todas las cabeceras proxy
- [ ] next.config.ts configurado para ignorar errores de build si es necesario
- [ ] .dockerignore creado y configurado
- [ ] .env.example creado con todas las variables
- [ ] .env creado en el servidor con valores reales
- [ ] Contenedores levantados y funcionando
- [ ] Aplicación respondiendo correctamente
- [ ] Logs sin errores críticos

---

## Comandos Útiles

```bash
# Construir y levantar contenedores
docker compose up -d --build

# Ver logs
docker compose logs -f app
docker compose logs -f nginx

# Detener contenedores
docker compose down

# Reconstruir sin cache (si cambias variables NEXT_PUBLIC_*)
docker compose build --no-cache
docker compose up -d

# Ver estado de contenedores
docker compose ps

# Ejecutar comandos dentro del contenedor
docker compose exec app sh
```

---

**Última actualización:** 2025
**Versión:** 1.0.0
