import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { GroupsModule } from './groups/groups.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { AutomationsModule } from './automations/automations.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET ?? 'supersecret', signOptions: { expiresIn: '7d' } }),
    AuthModule,
    SessionsModule,
    GroupsModule,
    DashboardModule,
    CampaignsModule,
    AutomationsModule,
    AuditModule,
  ],
})
export class AppModule {}
