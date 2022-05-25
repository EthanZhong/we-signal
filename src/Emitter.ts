import type { ListenerHandler } from './Listener';
import type { SignalFeature } from './Signal';
import { Listener } from './Listener';
import { Signal } from './Signal';
/** 发射器类 */
export class Emitter {
  /** 父级发射器 */
  private _parent: Emitter | null = null;
  /** 子级发射器 */
  private _children: Emitter[] = [];
  /** 侦听器集合 */
  private listeners: Record<string, Listener[]> = {};
  /** 获取侦听器总数 */
  get totalListener() {
    return Object.values(this.listeners).reduce(
      (pre, current) => pre + current.length,
      0
    );
  }
  /** 获取父级发射器 */
  get parent() {
    return this._parent;
  }
  /** 设置父级发射器 */
  set parent(newParent: Emitter | null) {
    const oldParent = this._parent;
    if (newParent !== oldParent) {
      this._parent = newParent;
      if (oldParent) oldParent.removeChild(this);
      if (newParent) newParent.addChild(this);
    }
  }
  /** 获取子级发射器 */
  get children() {
    return this._children;
  }
  /**
   * 添加子级发射器
   * @param children 需要被添加的子级发射器
   */
  public addChild(...children: Emitter[]) {
    children.forEach((child) => {
      if (!this.hasChild(child)) {
        this._children.push(child);
        if (child.parent !== this) child.parent = this;
      }
    });
  }
  /**
   * 删除子级发射器
   * @param children 需要被删除的子级发射器，无参数时清空所有子级发射器
   */
  public removeChild(...children: Emitter[]) {
    if (!children.length) children = [...this.children];
    children.forEach((child) => {
      const index = this.getChildIndex(child);
      if (index > -1) {
        this._children.splice(index, 1);
        if (child.parent === this) child.parent = null;
      }
    });
  }
  /**
   * 判断是否有对应的子级发射器
   * @param child 子级发射器
   * @returns
   */
  public hasChild(child: Emitter) {
    return this._children.includes(child);
  }
  /**
   * 获取子级发射器索引值
   * @param child 子级发射器
   * @returns
   */
  public getChildIndex(child: Emitter) {
    return this._children.indexOf(child);
  }
  /**
   * 添加侦听器
   * @param type 侦听器类型
   * @param handler 侦听器处理函数
   * @param context 侦听器处理函数上下文
   * @param count 侦听器可处理信号的次数，默认 `-1` 无限次数
   * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
   * @returns {boolean} 是否添加成功
   */
  public addListener<T = any>(
    type: string,
    handler: ListenerHandler<T>,
    context: unknown = null,
    count = -1,
    catchFeature: SignalFeature = Signal.Features.exact
  ) {
    if (!type || !handler || count === 0) return false;
    this.removeListener(type, handler, context, catchFeature);
    this.listeners[type] ??= [];
    this.listeners[type].push(
      Listener.create(type, handler, this, context, count, catchFeature)
    );
    return true;
  }
  /**
   * 添加侦听器
   * @param type 侦听器类型
   * @param handler 侦听器处理函数
   * @param context 侦听器处理函数上下文
   * @param count 侦听器可处理信号的次数，默认 `-1` 无限次数
   * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
   */
  public on<T = any>(
    type: string,
    handler: ListenerHandler<T>,
    context: unknown = null,
    count = -1,
    catchFeature: SignalFeature = Signal.Features.exact
  ) {
    return this.addListener(type, handler, context, count, catchFeature);
  }
  /**
   * 添加一次性侦听器
   * @param type 侦听器类型
   * @param handler 侦听器处理函数
   * @param context 侦听器处理函数上下文
   * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
   */
  public once<T = any>(
    type: string,
    handler: ListenerHandler<T>,
    context: unknown = null,
    catchFeature: SignalFeature = Signal.Features.exact
  ) {
    return this.addListener(type, handler, context, 1, catchFeature);
  }
  /**
   * 卸载侦听器
   * @param type 侦听器类型
   * @param handler 侦听器处理函数
   * @param context 侦听器处理函数上下文
   * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
   */
  public removeListener(
    type?: string,
    handler?: ListenerHandler,
    context: unknown = null,
    catchFeature: SignalFeature = Signal.Features.exact
  ) {
    if (!type) {
      this.listeners = {};
    } else if (!handler) {
      delete this.listeners[type];
    } else if (this.listeners[type]) {
      const listeners = this.listeners[type];
      let index = listeners.length - 1;
      while (index > -1) {
        const listener = listeners[index];
        if (
          handler === listener.handler &&
          context === listener.context &&
          catchFeature === listener.catchFeature
        )
          listeners.splice(index, 1);
        --index;
      }
      if (!listeners.length) delete this.listeners[type];
    }
  }
  /**
   * 卸载侦听器
   * @param type 侦听器类型
   * @param handler 侦听器处理函数
   * @param context 侦听器处理函数上下文
   * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
   */
  public off(
    type?: string,
    handler?: ListenerHandler,
    context: unknown = null,
    catchFeature: SignalFeature = Signal.Features.exact
  ) {
    return this.removeListener(type, handler, context, catchFeature);
  }
  /**
   * 发射信号
   * @param type 信号类型
   * @param data 信号数据
   * @param feature 信号特性
   */
  public emit<T>(
    type: string,
    data: T,
    feature: SignalFeature = Signal.Features.exact
  ) {
    /** 创建本次发射的信号 */
    const signal = Signal.create(type, data, this, feature);
    /** 发射器自身优先接收到本次信号 */
    this.receive(signal);
    /** 信号是否全局发射 */
    const isWhole = feature === Signal.Features.whole;
    /** 信号向上发射 */
    if (isWhole || feature === Signal.Features.upward) {
      this.emitUpWard(signal);
    }
    /** 信号向下发射 */
    if (isWhole || feature === Signal.Features.downward) {
      this.emitDownWard(signal);
    }
  }
  /**
   * 销毁自身
   */
  public destroy() {
    this.parent = null;
    this.removeChild();
    this.removeListener();
  }
  /**
   * 接收信号
   * @param signal 信号
   */
  private receive<T>(signal: Signal<T>) {
    const { type } = signal;
    const listeners = this.listeners[type];
    if (listeners?.length) {
      const invalids = [] as Listener[];
      listeners.forEach((listener) => {
        listener.handle(signal);
        if (!listener.active) invalids.push(listener);
      });
      invalids.forEach((listener) => {
        this.removeListener(
          type,
          listener.handler,
          listener.context,
          listener.catchFeature
        );
      });
    }
  }
  /**
   * 向上发射信号
   * @param signal 信号
   */
  private emitUpWard<T>(signal: Signal<T>) {
    let parent = this.parent;
    while (parent) {
      parent.receive(signal);
      parent = parent.parent;
    }
  }
  /**
   * 向下发射信号
   * @param signal 信号
   */
  private emitDownWard<T>(signal: Signal<T>) {
    if (this.children.length) {
      this.children.forEach((child) => {
        child.receive(signal);
        child.emitDownWard(signal);
      });
    }
  }
}
