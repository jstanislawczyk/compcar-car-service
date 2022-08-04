export class StringUtils {

  public static isJwtToken(value: string): boolean {
    return new RegExp(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/).test(value);
  }

  public static isBcryptPassword(value: string): boolean {
    return new RegExp(/^\$2[aby]\$.{56}$/).test(value);
  }

  public static isV4(value: string): boolean {
    const v4RegExp = new RegExp(/^[\dA-F]{8}-[\dA-F]{4}-4[\dA-F]{3}-[89AB][\dA-F]{3}-[\dA-F]{12}$/i);

    return v4RegExp.test(value);
  }
}
