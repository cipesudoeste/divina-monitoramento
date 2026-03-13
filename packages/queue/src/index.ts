import { Queue, Worker, QueueEvents, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', { maxRetriesPerRequest: null });

export const QUEUES = {
  WELCOME: 'welcome-messages',
  EXIT: 'exit-messages',
  EVENTS: 'membership-events',
};

export const getQueue = (name: string) => new Queue(name, { connection });
export const getQueueEvents = (name: string) => new QueueEvents(name, { connection });
export const createWorker = <T>(name: string, processor: Parameters<typeof Worker<T>>[1]) =>
  new Worker<T>(name, processor, { connection });

export const enqueue = async <T>(queue: string, name: string, payload: T, opts?: JobsOptions) =>
  getQueue(queue).add(name, payload, opts);
