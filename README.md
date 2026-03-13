# Divina Monitoramento (Monorepo)

Plataforma SaaS para monitorar crescimento de grupos de WhatsApp com painel administrativo, automações e dashboard analítico.

## Stack
- Turborepo + pnpm + TypeScript
- apps/web: Next.js App Router + Tailwind + Recharts
- apps/api: NestJS + JWT + SSE
- apps/worker-wpp: worker Node para eventos mock
- packages/db: Prisma + PostgreSQL
- packages/queue: BullMQ + Redis/Upstash-compatible
- packages/providers: interface provider + provider-mock + placeholders

## Estrutura
- `apps/web`
- `apps/api`
- `apps/worker-wpp`
- `packages/ui`
- `packages/db`
- `packages/shared`
- `packages/queue`
- `packages/providers`

## Instalação local
```bash
pnpm install
cp .env.example .env
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Credenciais seed
- Email: `admin@divina.local`
- Senha: `admin123`

## Docker
```bash
docker compose up --build
```

## Endpoints principais
- `POST /auth/login`
- `GET /sessions`
- `POST /sessions`
- `GET /sessions/:id/qr`
- `POST /sessions/:id/reconnect`
- `POST /sessions/:id/disconnect`
- `GET /groups`
- `GET /groups/:id`
- `GET /groups/:id/events`
- `GET /automations/groups/:groupId`
- `PUT /automations/groups/:groupId/welcome`
- `PUT /automations/groups/:groupId/exit`
- `GET /dashboard/overview`
- `GET /dashboard/groups/:groupId`
- `GET /campaigns`
- `POST /campaigns`
- `GET /audit`

## Deploy futuro (Render/Fly/Supabase)
- Use `DATABASE_URL` do Supabase/Postgres gerenciado.
- Use Redis gerenciado compatível com Upstash.
- Apps web/api/worker podem ser implantados separadamente apontando para os mesmos serviços de dados.
