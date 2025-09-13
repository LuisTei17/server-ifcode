import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails'],
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    let user = await this.usersService.findOrCreateSocial({
      provider: 'facebook',
      providerId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
    });
    done(null, user);
  }
}
