import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  list() { return this.prisma.group.findMany({ include: { session: true } }); }
  detail(id: string) { return this.prisma.group.findUnique({ where: { id }, include: { members: true, automationFlows: { include: { options: true } } } }); }
  events(id: string) { return this.prisma.membershipEvent.findMany({ where: { groupId: id }, orderBy: { eventAt: 'desc' }, take: 50 }); }
}
