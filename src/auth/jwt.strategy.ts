import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

function cookieExtractor(req: any) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt']; // ajuste o nome do cookie se necessário
  }
  return token;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Accept token from cookie OR Authorization Bearer header
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: 'codefofo',
    });
  }  

async validate(payload: any) {
    // Debug: log incoming JWT payload to help diagnose 401 issues.
    // NOTE: remove this log after debugging to avoid sensitive info in logs.
    console.log('[JwtStrategy] validate payload =', JSON.stringify(payload));
    // Return fields matching the rest of the codebase (id_usuario)
    return { id_usuario: payload.sub, email: payload.email };
  }
}
