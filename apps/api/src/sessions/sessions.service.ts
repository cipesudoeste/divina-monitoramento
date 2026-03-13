import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Subject } from 'rxjs';

@Injectable()
export class SessionsService {
  private sessionEvents = new Subject<{ sessionId: string; status: string; qrCode?: string }>();

  constructor(private prisma: PrismaService) {}

  events() { return this.sessionEvents.asObservable(); }

  async list() {
    return this.prisma.whatsappSession.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(workspaceId: string, label: string) {
    const session = await this.prisma.whatsappSession.create({ data: { workspaceId, provider: 'provider-mock', label, status: 'QR_READY' } });
    this.sessionEvents.next({ sessionId: session.id, status: 'QR_READY', qrCode: `mock-qr-${session.id}` });
    setTimeout(async () => {
      await this.prisma.whatsappSession.update({ where: { id: session.id }, data: { status: 'CONNECTED', connectedAt: new Date(), phoneNumber: '+5511999999999' } });
      this.sessionEvents.next({ sessionId: session.id, status: 'CONNECTED' });
    }, 1000);
    return session;
  }

  async qr(id: string) {
    const s = await this.prisma.whatsappSession.findUnique({ where: { id } });
    if (!s) throw new NotFoundException();
    return { qrCode: `mock-qr-${id}`, status: s.status };
  }

  async reconnect(id: string) {
    return this.prisma.whatsappSession.update({ where: { id }, data: { status: 'QR_READY' } });
  }

  async disconnect(id: string) {
    return this.prisma.whatsappSession.update({ where: { id }, data: { status: 'DISCONNECTED' } });
  }
}
