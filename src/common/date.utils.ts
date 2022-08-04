export class DateUtils {

  public static addMillisToISODate(iSODate: string, millis: number): string {
    const date: Date = new Date(iSODate);
    const dateAsMillis = date.getTime();
    const updatedDateMillis = dateAsMillis + millis;

    return new Date(updatedDateMillis).toISOString();
  }

  public static formatISODateToReadableFormat(iSODate: string): string {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'full',
      timeStyle: 'long',
      timeZone: 'UTC',
    }).format(Date.parse(iSODate));
  }
}
