import { Body, Controller, Get, Param, Post, Sse, UseGuards } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { map } from 'rxjs';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessions: SessionsService) {}

  @Get()
  list() { return this.sessions.list(); }

  @Post()
  create(@Body() body: { workspaceId: string; label: string }) { return this.sessions.create(body.workspaceId, body.label); }

  @Get(':id/qr')
  qr(@Param('id') id: string) { return this.sessions.qr(id); }

  @Post(':id/reconnect')
  reconnect(@Param('id') id: string) { return this.sessions.reconnect(id); }

  @Post(':id/disconnect')
  disconnect(@Param('id') id: string) { return this.sessions.disconnect(id); }

  @Sse('events/stream')
  stream() {
    return this.sessions.events().pipe(map((data) => ({ data })));
  }
}
