import { PrismaClient, FlowType, MembershipEventType, SessionStatus, UserRole, WorkspaceRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'workspace-demo' },
    update: {},
    create: { name: 'Divina Growth', slug: 'workspace-demo' },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@divina.local' },
    update: { passwordHash: hash },
    create: { name: 'Admin', email: 'admin@divina.local', passwordHash: hash, role: UserRole.ADMIN },
  });

  await prisma.userWorkspace.upsert({
    where: { userId_workspaceId: { userId: admin.id, workspaceId: workspace.id } },
    update: {},
    create: { userId: admin.id, workspaceId: workspace.id, role: WorkspaceRole.OWNER },
  });

  const session = await prisma.whatsappSession.create({
    data: { workspaceId: workspace.id, provider: 'provider-mock', label: 'Sessão Demo', status: SessionStatus.CONNECTED, phoneNumber: '+5511988887777', connectedAt: new Date() },
  });

  const [groupA, groupB] = await Promise.all([
    prisma.group.create({ data: { workspaceId: workspace.id, sessionId: session.id, externalGroupId: 'grp-1', name: 'Comunidade Growth' } }),
    prisma.group.create({ data: { workspaceId: workspace.id, sessionId: session.id, externalGroupId: 'grp-2', name: 'Mentoria Vendas' } }),
  ]);

  for (const group of [groupA, groupB]) {
    for (const flowType of [FlowType.WELCOME, FlowType.EXIT]) {
      const flow = await prisma.automationFlow.create({
        data: {
          groupId: group.id,
          flowType,
          enabled: true,
          title: flowType === FlowType.WELCOME ? 'Boas-vindas padrão' : 'Pesquisa de saída',
          messageText: flowType === FlowType.WELCOME
            ? 'É muito bom ter você aqui. Como conheceu a gente?\n1-Instagram\n2-Facebook\n3-Indicação\n4-Site\n5-Outro'
            : 'Posso saber por que você saiu?\n1-Excesso de postagens\n2-Conteúdo desinteressante\n3-Entrei sem querer\n4-Já consegui o que precisava\n5-Outro',
          delaySeconds: 10,
          allowFreeText: true,
        },
      });
      await prisma.automationFlowOption.createMany({
        data: [1,2,3,4,5].map((v) => ({ flowId: flow.id, value: String(v), label: `Opção ${v}`, position: v })),
      });
    }

    for (let i = 12; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const joins = Math.floor(Math.random() * 20) + 5;
      const leaves = Math.floor(Math.random() * 10) + 1;
      await prisma.dailyGroupSnapshot.create({
        data: { groupId: group.id, snapshotDate: date, memberCount: 180 + joins - leaves, joinsCount: joins, leavesCount: leaves, netGrowth: joins - leaves },
      });
      await prisma.membershipEvent.createMany({
        data: [
          { groupId: group.id, memberKey: `join-${i}`, eventType: MembershipEventType.JOIN, eventAt: date },
          { groupId: group.id, memberKey: `leave-${i}`, eventType: MembershipEventType.LEAVE, eventAt: date },
        ],
      });
    }
  }

  await prisma.auditLog.create({
    data: { workspaceId: workspace.id, actorUserId: admin.id, entityType: 'seed', entityId: workspace.id, action: 'INITIAL_SEED', payload: { ok: true } },
  });
}

main().finally(async () => prisma.$disconnect());
