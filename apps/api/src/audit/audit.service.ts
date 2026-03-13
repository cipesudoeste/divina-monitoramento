import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}
  list(workspaceId: string) { return this.prisma.auditLog.findMany({ where: { workspaceId }, orderBy: { createdAt: 'desc' }, take: 100, include: { actorUser: true } }); }
}
