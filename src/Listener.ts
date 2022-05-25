import type { Emitter } from './Emitter';
import type { SignalFeature } from './Signal';
import { Signal } from './Signal';
/** 侦听器处理函数类型 */
export type ListenerHandler<T = any> = (signal: Signal<T>) => unknown;
/** 创建侦听器symbol值 */
const ListenerSymbol = Symbol('Listener-Create');
/** 侦听器类 */
export class Listener {
  /**
   * 侦听器构造函数
   * @param type 侦听器类型需要和信号类型匹配
   * @param handler 侦听器处理函数
   * @param emitter 侦听器所属发射器
   * @param context 侦听器处理函数上下文
   * @param count 侦听器可处理信号的次数，默认 `-1` 无限次数
   * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
   */
  constructor(
    symbol: typeof ListenerSymbol,
    public type: string,
    public handler: ListenerHandler,
    public emitter: Emitter,
    public context: unknown = null,
    public count = -1,
    public catchFeature: SignalFeature = Signal.Features.exact
  ) {
    if (symbol !== ListenerSymbol) {
      throw new Error('Please use [Listener.create]');
    }
  }
  /** 获取当前侦听器是否还可以接收处理信号 */
  public get active() {
    return this.count !== 0;
  }
  /**
   * 处理信号
   * @param signal 信号
   */
  public handle<U>(signal: Signal<U>) {
    if (this.active && this.type === signal.type) {
      /** 侦听器是否捕获到所属发射器发射的信号 */
      const matchExact = this.emitter === signal.origin;
      /** 侦听器是否可以捕获所有特性信号 */
      const canCatchWhole = this.catchFeature === Signal.Features.whole;
      /** 侦听器是否可以捕获全局特性信号 */
      const catchWholeSignal =
        this.catchFeature !== Signal.Features.exact &&
        signal.feature === Signal.Features.whole;
      /** 侦听器是否捕获到对应特性信号 */
      const matchFeature = this.catchFeature === signal.feature;
      /** 条件符合处理信号 */
      if (matchExact || canCatchWhole || catchWholeSignal || matchFeature) {
        if (this.count > 0) --this.count;
        //Reflect.apply(this.handler, this.context, [signal]);
        this.handler.call(this.context, signal);
      }
    }
  }
  /**
   * 创建侦听器
   * @param type 侦听器类型需要和信号类型匹配
   * @param handler 侦听器处理函数
   * @param emitter 侦听器所属发射器
   * @param context 侦听器处理函数上下文
   * @param count 侦听器可处理信号的次数，默认 `-1` 无限次数
   * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
   */
  public static create(
    type: string,
    handler: ListenerHandler,
    emitter: Emitter,
    context: unknown = null,
    count = -1,
    catchFeature: SignalFeature = Signal.Features.exact
  ) {
    return new Listener(
      ListenerSymbol,
      type,
      handler,
      emitter,
      context,
      count,
      catchFeature
    );
  }
}
