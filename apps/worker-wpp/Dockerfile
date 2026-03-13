FROM node:20-alpine
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @divina/worker-wpp build
CMD ["pnpm","--filter","@divina/worker-wpp","start"]
