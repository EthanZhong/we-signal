export default class Signal<T> {
  constructor(public type: string, public data: T, public feature: string) {}
  public get info() {
    return {
      type: this.type,
      data: this.data,
      feature: this.feature,
    };
  }
}
