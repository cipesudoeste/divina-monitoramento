import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller('campaigns')
@UseGuards(JwtAuthGuard)
export class CampaignsController {
  constructor(private readonly service: CampaignsService) {}

  @Get()
  list(@Query('workspaceId') workspaceId: string) { return this.service.list(workspaceId); }

  @Post()
  create(@Body() body: any) { return this.service.create(body); }
}
