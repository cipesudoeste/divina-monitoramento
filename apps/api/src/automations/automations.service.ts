import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { FlowType } from '@prisma/client';

@Injectable()
export class AutomationsService {
  constructor(private prisma: PrismaService) {}

  getByGroup(groupId: string) {
    return this.prisma.automationFlow.findMany({ where: { groupId }, include: { options: true } });
  }

  async updateFlow(groupId: string, flowType: FlowType, payload: any) {
    const existing = await this.prisma.automationFlow.findUnique({ where: { groupId_flowType: { groupId, flowType } } });
    const flow = existing
      ? await this.prisma.automationFlow.update({ where: { id: existing.id }, data: payload })
      : await this.prisma.automationFlow.create({ data: { groupId, flowType, ...payload } });

    if (payload.options) {
      await this.prisma.automationFlowOption.deleteMany({ where: { flowId: flow.id } });
      await this.prisma.automationFlowOption.createMany({ data: payload.options.map((o: any, idx: number) => ({ flowId: flow.id, value: o.value, label: o.label, position: idx + 1 })) });
    }
    return this.prisma.automationFlow.findUnique({ where: { id: flow.id }, include: { options: true } });
  }
}
