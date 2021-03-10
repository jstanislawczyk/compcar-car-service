export class JwtUtils {

  public static isJwtToken(value: string): boolean {
    return new RegExp(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/).test(value);
  }
}
