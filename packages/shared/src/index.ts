import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type FlowType = 'WELCOME' | 'EXIT';
export type SessionStatus = 'CREATED' | 'QR_READY' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
export type MembershipEventType = 'JOIN' | 'LEAVE';

export interface DashboardOverview {
  groupsMonitored: number;
  membersCurrent: number;
  entriesToday: number;
  leavesToday: number;
  netGrowth: number;
}

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  JWT_SECRET: z.string(),
});
