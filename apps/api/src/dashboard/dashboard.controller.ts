import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('overview')
  overview(@Query('workspaceId') workspaceId: string) { return this.service.overview(workspaceId); }

  @Get('groups/:groupId')
  group(@Param('groupId') groupId: string) { return this.service.group(groupId); }
}
