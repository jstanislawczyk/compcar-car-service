import config from 'config';

export class JwtToken {

  public sub: number;
  public exp: number;

  constructor(userId: number) {
    const jwtTtlSeconds: number = config.get('security.jwt.ttlSeconds');

    this.exp = Math.round(Date.now() / 1000) + jwtTtlSeconds;
    this.sub = userId;
  }
}
