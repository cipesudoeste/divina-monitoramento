import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async overview(workspaceId: string) {
    const groups = await this.prisma.group.count({ where: { workspaceId } });
    const membersCurrent = await this.prisma.groupMember.count({ where: { group: { workspaceId }, status: 'ACTIVE' } });
    const today = new Date();
    today.setHours(0,0,0,0);
    const entriesToday = await this.prisma.membershipEvent.count({ where: { group: { workspaceId }, eventType: 'JOIN', eventAt: { gte: today } } });
    const leavesToday = await this.prisma.membershipEvent.count({ where: { group: { workspaceId }, eventType: 'LEAVE', eventAt: { gte: today } } });
    const snapshots = await this.prisma.dailyGroupSnapshot.findMany({ where: { group: { workspaceId } }, orderBy: { snapshotDate: 'asc' }, take: 30 });
    const origins = await this.prisma.automationInteraction.groupBy({ by: ['answerLabel'], _count: true, where: { flowType: 'WELCOME', group: { workspaceId } } });
    const reasons = await this.prisma.automationInteraction.groupBy({ by: ['answerLabel'], _count: true, where: { flowType: 'EXIT', group: { workspaceId } } });

    return {
      cards: { groupsMonitored: groups, membersCurrent, entriesToday, leavesToday, netGrowth: entriesToday - leavesToday },
      growth: snapshots.map((s) => ({ date: s.snapshotDate, netGrowth: s.netGrowth, joins: s.joinsCount, leaves: s.leavesCount })),
      origins: origins.map((o) => ({ name: o.answerLabel ?? 'Sem resposta', value: o._count })),
      reasons: reasons.map((r) => ({ name: r.answerLabel ?? 'Sem resposta', value: r._count })),
    };
  }

  async group(groupId: string) {
    const snapshots = await this.prisma.dailyGroupSnapshot.findMany({ where: { groupId }, orderBy: { snapshotDate: 'asc' }, take: 30 });
    const events = await this.prisma.membershipEvent.findMany({ where: { groupId }, orderBy: { eventAt: 'desc' }, take: 20 });
    return { snapshots, events };
  }
}
