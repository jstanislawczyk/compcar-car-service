export class DateUtils {

  public static getISODateWithOffset(ms: number): Date {
    return new Date(Date.now() + ms);
  }
}
