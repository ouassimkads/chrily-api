import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client'; // إذا كنت تستخدم Prisma
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string, phone: string) {
    // Hash the password
    const hashed = await bcrypt.hash(password, 10);

    //! Create User
    const user = await this.prisma.user.create({
      data: { email, password: hashed, name, phone, role: 'USER' },
    });

    //! Create JWT
    const token = this.jwtService.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    return { user, token };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    return user;
  }
  //! Login
  login(user: User) {
    const payload = { userId: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
