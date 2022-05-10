import type Emitter from './Emitter';
import Signal from './Signal';
/** 侦听器处理函数类型 */
export type ListenerHandler = <T>(signal: Signal<T>) => any;
/** 侦听器类 */
export default class Listener {
  /** 绑定上下文的侦听器处理函数 */
  private _handler: ListenerHandler;
  /**
   * 侦听器构造函数
   * @param emitter 侦听器所属发射器
   * @param type 侦听器类型需要和信号类型匹配
   * @param handler 侦听器处理函数
   * @param context 侦听器处理函数上下文
   * @param count 侦听器可处理信号的次数，默认 `-1` 无限次数
   * @param capture 是否处理向下发射的信号，默认 `false` 不处理
   * @param bubble 是否处理向上发射的信号，默认 `false` 不处理
   */
  constructor(
    public emitter: Emitter,
    public type: string,
    public handler: ListenerHandler,
    public context: unknown = null,
    public count = -1,
    public capture = false,
    public bubble = false
  ) {
    this._handler = this.handler.bind(this.context);
  }
  /** 获取当前侦听器是否还可以处理信号 */
  public get active() {
    return this.count !== 0;
  }
  /**
   * 处理信号
   * @param signal 信号
   */
  public handle<T>(signal: Signal<T>) {
    if (this.active) {
      const isSelf = this.emitter === signal.origin;
      const isWhole = signal.feature === Signal.Features.whole;
      const needHandleBubble =
        this.bubble && (isWhole || signal.feature === Signal.Features.upward);
      const needHandleCapture =
        this.capture &&
        (isWhole || signal.feature === Signal.Features.downward);
      /** 条件符合处理信号 */
      if (isSelf || needHandleBubble || needHandleCapture) {
        if (this.count > 0) --this.count;
        this._handler(signal);
      }
    }
  }
}
