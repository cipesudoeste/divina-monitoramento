FROM node:20-alpine
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @divina/web build
CMD ["pnpm","--filter","@divina/web","start"]
