import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/usuarios.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private usersService: UsersService, private config: ConfigService) {
    const callback =
      config.get('GOOGLE_CALLBACK_URL') || 'http://localhost:4000/auth/google/callback';
    const clientId = config.get('GOOGLE_CLIENT_ID') || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = config.get('GOOGLE_CLIENT_SECRET') || process.env.GOOGLE_CLIENT_SECRET;
    // Log the callback URL at startup to make redirect_uri issues easier to debug
    console.log('[GoogleStrategy] callbackURL =', callback);
    super({
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: callback,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  // When passReqToCallback is true, passport will call validate(req, accessToken, refreshToken, profile, done)
  async validate(req: any, accessToken: string, refreshToken: string, profile: any, done: Function) {
    // The app can send a `state` query parameter with the cod_tip_usuario encoded.
    // For example: /auth/google?state=2
    let tipoUsuario: number | undefined = undefined;
    try {
      if (req && req.query && req.query.state) {
        const parsed = parseInt(req.query.state, 10);
        if (!isNaN(parsed)) tipoUsuario = parsed;
      }
    } catch (e) {
      // ignore
    }

    const userData: any = {
      provider: 'google',
      providerId: profile.id,
      nome_usuario: profile.displayName,
      email_usuario: profile.emails[0].value,
    };
    if (tipoUsuario) userData.cod_tip_usuario = tipoUsuario;

    let user = await this.usersService.findOrCreateSocial(userData);
    done(null, user);
  }
}
