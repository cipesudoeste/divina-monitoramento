import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}
  list(workspaceId: string) { return this.prisma.campaign.findMany({ where: { workspaceId }, orderBy: { createdAt: 'desc' } }); }
  create(data: any) { return this.prisma.campaign.create({ data }); }
}
