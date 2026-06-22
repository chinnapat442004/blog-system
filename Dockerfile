# Stage 1: install dependencies, generate Prisma client, build Next app
FROM node:20-slim AS build
WORKDIR /app

# Install build dependencies first
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate

# Copy source and build
COPY . .
RUN npm run build
RUN npm prune --production

# Stage 2: production image
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "start"]
