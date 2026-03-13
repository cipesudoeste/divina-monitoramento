import { prisma } from '@divina/db';
import { MockProvider } from '@divina/providers';
import { QUEUES, createWorker, enqueue } from '@divina/queue';

const provider = new MockProvider();

async function bootstrap() {
  const sessions = await prisma.whatsappSession.findMany({ where: { provider: 'provider-mock' } });
  for (const session of sessions) {
    await provider.createSession(session.id);
    provider.startMockStream(session.id);
  }

  provider.onEvent(async (event) => {
    if (event.type === 'GROUP_JOIN' || event.type === 'GROUP_LEAVE') {
      const group = await prisma.group.findFirst({ where: { sessionId: event.sessionId, externalGroupId: event.groupExternalId } });
      if (!group) return;
      await prisma.membershipEvent.create({ data: { groupId: group.id, memberKey: event.memberKey, eventType: event.type === 'GROUP_JOIN' ? 'JOIN' : 'LEAVE', eventAt: new Date(), rawPayload: event as any } });
      await prisma.groupMember.upsert({
        where: { groupId_memberKey: { groupId: group.id, memberKey: event.memberKey } },
        create: { groupId: group.id, memberKey: event.memberKey, status: event.type === 'GROUP_JOIN' ? 'ACTIVE' : 'LEFT', joinedAt: new Date(), leftAt: event.type === 'GROUP_LEAVE' ? new Date() : null },
        update: { status: event.type === 'GROUP_JOIN' ? 'ACTIVE' : 'LEFT', leftAt: event.type === 'GROUP_LEAVE' ? new Date() : null },
      });

      const flowType = event.type === 'GROUP_JOIN' ? 'WELCOME' : 'EXIT';
      const flow = await prisma.automationFlow.findUnique({ where: { groupId_flowType: { groupId: group.id, flowType } }, include: { options: true } });
      if (flow?.enabled) {
        await enqueue(event.type === 'GROUP_JOIN' ? QUEUES.WELCOME : QUEUES.EXIT, 'send-flow', { groupId: group.id, memberKey: event.memberKey, flowId: flow.id }, { delay: flow.delaySeconds * 1000 });
      }
    }
  });

  createWorker<any>(QUEUES.WELCOME, async (job) => processFlow(job.data));
  createWorker<any>(QUEUES.EXIT, async (job) => processFlow(job.data));

  setInterval(() => generateResponses(), 15000);
  console.log('worker running');
}

async function processFlow(data: { groupId: string; memberKey: string; flowId: string }) {
  const flow = await prisma.automationFlow.findUnique({ where: { id: data.flowId }, include: { options: true } });
  if (!flow) return;
  await prisma.automationInteraction.create({ data: { groupId: data.groupId, memberKey: data.memberKey, flowType: flow.flowType, messageSentAt: new Date(), status: 'SENT' } });
}

async function generateResponses() {
  const pending = await prisma.automationInteraction.findMany({ where: { status: 'SENT' }, take: 10 });
  for (const i of pending) {
    const val = String(Math.floor(Math.random() * 5) + 1);
    await prisma.automationInteraction.update({ where: { id: i.id }, data: { status: 'ANSWERED', answeredAt: new Date(), answerValue: val, answerLabel: `Opção ${val}` } });
  }
}

bootstrap();
