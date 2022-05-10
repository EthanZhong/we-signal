import type { ListenerHandler } from './Listener';
import type { SignalFeature } from './Signal';
import Listener from './Listener';
import Signal from './Signal';
/** 侦听器集合 */
type Listeners = Record<string, Listener[]>;
/** 发射器类 */
export default class Emitter {
  /** 父级发射器 */
  private _parent: Emitter | null = null;
  /** 子级发射器 */
  private _children: Emitter[] = [];
  /** 侦听器集合 */
  private listeners: Listeners = {};
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
  /** 添加子级发射器 */
  public addChild(...children: Emitter[]) {
    children.forEach((child) => {
      if (!this.hasChild(child)) {
        this._children.push(child);
        if (child.parent !== this) child.parent = this;
      }
    });
  }
  /** 删除子级发射器 */
  public removeChild(...children: Emitter[]) {
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
   * @param capture 是否处理向下发射的信号，默认 `false` 不处理
   * @param bubble 是否处理向上发射的信号，默认 `false` 不处理
   * @returns {boolean} 是否添加成功
   */
  public addListener(
    type: string,
    handler: ListenerHandler,
    context: unknown = null,
    count = -1,
    capture = false,
    bubble = false
  ) {
    this.listeners[type] = this.listeners[type] || [];
    const hasSameListener = this.listeners[type].some((listener) => {
      return (
        listener.handler === handler &&
        listener.context === context &&
        listener.count === count &&
        listener.capture === capture &&
        listener.bubble === bubble
      );
    });
    if (!hasSameListener)
      this.listeners[type].push(
        new Listener(this, type, handler, context, count, capture, bubble)
      );
    return !hasSameListener;
  }
  /**
   * 添加侦听器
   * @param type 侦听器类型
   * @param handler 侦听器处理函数
   * @param context 侦听器处理函数上下文
   * @param count 侦听器可处理信号的次数，默认 `-1` 无限次数
   * @param capture 是否处理向下发射的信号，默认 `false` 不处理
   * @param bubble 是否处理向上发射的信号，默认 `false` 不处理
   */
  public on(
    type: string,
    handler: ListenerHandler,
    context: unknown = null,
    count = -1,
    capture = false,
    bubble = false
  ) {
    return this.addListener(type, handler, context, count, capture, bubble);
  }
  /**
   * 添加一次性侦听器
   * @param type 侦听器类型
   * @param handler 侦听器处理函数
   * @param context 侦听器处理函数上下文
   * @param capture 是否处理向下发射的信号，默认 `false` 不处理
   * @param bubble 是否处理向上发射的信号，默认 `false` 不处理
   */
  public once(
    type: string,
    handler: ListenerHandler,
    context: unknown = null,
    capture = false,
    bubble = false
  ) {
    return this.addListener(type, handler, context, 1, capture, bubble);
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
    /** 创建本次信号 */
    const signal = new Signal<T>(this, type, data, feature);
    /** 全局发射标记 */
    const isWhole = feature === Signal.Features.whole;
    /** 信号发送给自己 */
    this.receive(signal);
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
   * 接收信号
   * @param signal 信号
   */
  public receive<T>(signal: Signal<T>) {
    if (this.listeners[signal.type]) {
      this.listeners[signal.type].forEach((listener) => {
        listener.handle(signal);
      });
      this.shakeListeners(signal.type);
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
  /**
   * 检查并删除某个类型下的无效侦听器
   * @param type 侦听器类型
   */
  private shakeListeners(type: string) {
    const listeners = this.listeners[type];
    if (listeners) {
      const total = listeners.length;
      for (let i = total - 1; i >= 0; i--) {
        if (!listeners[i].active) listeners.splice(i, 1);
      }
      if (!listeners.length) delete this.listeners[type];
    }
  }
}
