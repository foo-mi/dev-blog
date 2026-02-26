FROM oven/bun:1-alpine AS base
WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile --production

COPY src/     ./src/
COPY public/  ./public/
COPY content/ ./content/
COPY tsconfig.json ./

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/posts || exit 1

CMD ["bun", "run", "src/server.ts"]
