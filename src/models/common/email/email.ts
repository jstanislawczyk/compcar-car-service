export abstract class Email {

  protected constructor(
    public readonly receiverAddress: string,
    public readonly subject: string,
    public readonly html: string,
    public readonly text: string,
  ) {
  }
}
