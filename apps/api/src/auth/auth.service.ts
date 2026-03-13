import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { userWorkspaces: true },
    });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const workspaceId = user.userWorkspaces[0]?.workspaceId;
    const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email, workspaceId });
    return { accessToken, user: { id: user.id, name: user.name, email: user.email, workspaceId } };
  }
}
