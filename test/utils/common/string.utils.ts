export class StringUtils {

  public static isJwtToken(value: string): boolean {
    return new RegExp(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/).test(value);
  }

  public static isBcryptPassword(value: string): boolean {
    return new RegExp(/^\$2[aby]\$.{56}$/).test(value);
  }
}
