export class JwtUtils {

  public static isJwt(value: string): boolean {
    return new RegExp(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/).test(value);
  }
}
