import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groups: GroupsService) {}

  @Get()
  list() { return this.groups.list(); }

  @Get(':id')
  detail(@Param('id') id: string) { return this.groups.detail(id); }

  @Get(':id/events')
  events(@Param('id') id: string) { return this.groups.events(id); }
}
