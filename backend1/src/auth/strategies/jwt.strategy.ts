import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<{ userId: string; email: string; roles: string[]; department?: string }> {
    const user = await this.userRepository.findOne({ 
      where: { id: payload.sub },
      select: ['id', 'email', 'roles', 'department']
    });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    return { 
      userId: user.id, 
      email: user.email, 
      roles: user.roles,
      department: user.department
    };
  }
}