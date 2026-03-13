import EventEmitter from 'eventemitter3';

export type ProviderEvent =
  | { type: 'QR_READY'; sessionId: string; qrCode: string }
  | { type: 'SESSION_CONNECTED'; sessionId: string; phoneNumber: string }
  | { type: 'GROUP_JOIN'; sessionId: string; groupExternalId: string; memberKey: string }
  | { type: 'GROUP_LEAVE'; sessionId: string; groupExternalId: string; memberKey: string }
  | { type: 'SURVEY_RESPONSE'; sessionId: string; groupExternalId: string; memberKey: string; flowType: 'WELCOME' | 'EXIT'; answerValue: string; answerLabel: string; freeText?: string };

export interface WhatsappProvider {
  createSession(sessionId: string): Promise<void>;
  getQrCode(sessionId: string): Promise<string | null>;
  disconnectSession(sessionId: string): Promise<void>;
  listGroups(sessionId: string): Promise<Array<{ id: string; name: string }>>;
  sendMessage(sessionId: string, to: string, message: string): Promise<void>;
  onEvent(handler: (event: ProviderEvent) => void): void;
}

export class MockProvider implements WhatsappProvider {
  private emitter = new EventEmitter<{ event: [ProviderEvent] }>();
  private qrs = new Map<string, string>();

  onEvent(handler: (event: ProviderEvent) => void): void { this.emitter.on('event', handler); }

  async createSession(sessionId: string): Promise<void> {
    const qr = `mock-qr-${sessionId}-${Date.now()}`;
    this.qrs.set(sessionId, qr);
    setTimeout(() => this.emitter.emit('event', { type: 'QR_READY', sessionId, qrCode: qr }), 400);
    setTimeout(() => this.emitter.emit('event', { type: 'SESSION_CONNECTED', sessionId, phoneNumber: '+5511999999999' }), 1200);
  }

  async getQrCode(sessionId: string): Promise<string | null> { return this.qrs.get(sessionId) ?? null; }
  async disconnectSession(): Promise<void> {}
  async listGroups(): Promise<Array<{ id: string; name: string }>> {
    return [{ id: 'grp-1', name: 'Comunidade Growth' }, { id: 'grp-2', name: 'Time de Vendas' }];
  }
  async sendMessage(): Promise<void> {}

  startMockStream(sessionId: string) {
    setInterval(() => {
      const random = Math.random();
      const member = `member-${Math.floor(Math.random() * 200)}`;
      const groupExternalId = random > 0.5 ? 'grp-1' : 'grp-2';
      this.emitter.emit('event', {
        type: random > 0.3 ? 'GROUP_JOIN' : 'GROUP_LEAVE',
        sessionId,
        groupExternalId,
        memberKey: member,
      });
    }, 7000);
  }
}

export class BaileysProviderPlaceholder implements WhatsappProvider {
  async createSession(): Promise<void> { throw new Error('provider-baileys not implemented'); }
  async getQrCode(): Promise<string | null> { return null; }
  async disconnectSession(): Promise<void> { throw new Error('provider-baileys not implemented'); }
  async listGroups(): Promise<Array<{ id: string; name: string }>> { return []; }
  async sendMessage(): Promise<void> { throw new Error('provider-baileys not implemented'); }
  onEvent(): void {}
}

export class MetaOfficialProviderPlaceholder extends BaileysProviderPlaceholder {}
