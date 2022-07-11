export class NumberUtils {

  public static getRandomInteger(min: number = 1, max: number = 10) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
