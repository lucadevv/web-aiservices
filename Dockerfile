# --- ETAPA 1: COMPILACIÓN (BUILD) ---
# Usamos una imagen ligera para instalar dependencias y compilar
FROM node:20-alpine AS builder

WORKDIR /app

# Variables de entorno para el build (NEXT_PUBLIC_* se inyectan en tiempo de build)
ARG NEXT_PUBLIC_API_URL=http://172.19.5.20:8000
ARG NEXT_PUBLIC_ENCRYPTION_KEY=your-default-secret-key

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_ENCRYPTION_KEY=$NEXT_PUBLIC_ENCRYPTION_KEY

# Copiamos package files para instalar dependencias
# Esto se hace primero para aprovechar el cache de Docker
COPY package*.json ./

# Instalamos todas las dependencias (incluyendo devDependencies para compilar)
# Usamos npm ci porque hay package-lock.json
RUN npm ci

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
