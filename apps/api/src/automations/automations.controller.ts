import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AutomationsService } from './automations.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller('automations')
@UseGuards(JwtAuthGuard)
export class AutomationsController {
  constructor(private readonly service: AutomationsService) {}

  @Get('groups/:groupId')
  getByGroup(@Param('groupId') groupId: string) { return this.service.getByGroup(groupId); }

  @Put('groups/:groupId/welcome')
  welcome(@Param('groupId') groupId: string, @Body() body: any) {
    return this.service.updateFlow(groupId, 'WELCOME', body);
  }

  @Put('groups/:groupId/exit')
  exit(@Param('groupId') groupId: string, @Body() body: any) {
    return this.service.updateFlow(groupId, 'EXIT', body);
  }
}
