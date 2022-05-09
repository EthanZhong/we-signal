export type Handler = (data: any) => void;
export default class Listener {
  constructor(
    public type: string,
    public handler: Handler,
    public context: any = null
  ) {}
  public execute(data: any) {
    this.handler.call(this.context, data);
  }
}
