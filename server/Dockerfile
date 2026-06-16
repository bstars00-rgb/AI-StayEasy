# Build from the REPO ROOT (the server imports shared modules from ../../src):
#   docker build -f server/Dockerfile -t stayeasy-api .
FROM node:20-slim

# Prisma needs OpenSSL at runtime.
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install server deps first (better layer caching).
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci

# Shared catalogue/engine + server source.
COPY src ./src
COPY server ./server

RUN cd server && npx prisma generate

WORKDIR /app/server
ENV PORT=8787
EXPOSE 8787

# Production note: set DATABASE_URL to your Postgres URL and run a one-off
# `npm run db:setup` (or `prisma migrate deploy` + seed) before/at first boot.
CMD ["npm", "run", "start"]
