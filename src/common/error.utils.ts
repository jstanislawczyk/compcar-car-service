export class ErrorUtils {

  public static sanitizeDuplicatedIndexErrorMessage(message: string): string {
    const messageTokens: RegExpMatchArray | null = message.match(/'(.*?)'/);

    return messageTokens?.[1]
        ? `Value '${messageTokens[1]}' already exists`
        : message;
  }
}
