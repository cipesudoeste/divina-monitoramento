import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { PrismaService } from '../common/prisma.service';

@Module({ controllers: [SessionsController], providers: [SessionsService, PrismaService] })
export class SessionsModule {}
