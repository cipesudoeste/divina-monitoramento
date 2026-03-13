FROM node:20-alpine
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @divina/api build
CMD ["pnpm","--filter","@divina/api","start"]
