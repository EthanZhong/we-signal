import type { Handler } from './Listener';
import Listener from './Listener';
/** 侦听器集合 */
type EmitterListeners = Record<string, Listener[]>;
/** 添加侦听处理选项参数 */
type AddListenerOption = {
  /** 是否侦听子级节点向上发射的信号
   *
   * 默认值 `true`
   */
  bubble?: boolean;
  /** 是否侦听父级节点向下发送的信号
   *
   * 默认值 `true`
   */
  capture?: boolean;
  /** 侦听器可侦听处理次数
   *
   * 默认值 `-1` 无限次数
   */
  count?: number;
};
/** 默认添加侦听处理选项参数 */
const AddListenerDefaultOption: AddListenerOption = {
  bubble: true,
  capture: true,
  count: -1,
};
/** 发射器类 */
export default class Emitter {
  /** 父级发射器 */
  private _parent: Emitter | null = null;
  /** 子级发射器 */
  private _children: Emitter[] = [];
  /** 侦听器集合 */
  private listeners: EmitterListeners = {};
  get parent() {
    return this._parent;
  }
  set parent(newParent: Emitter | null) {
    const oldParent = this._parent;
    if (newParent !== oldParent) {
      this._parent = newParent;
      if (oldParent) oldParent.removeChild(this);
      if (newParent) newParent.addChild(this);
    }
  }
  get children() {
    return this._children;
  }
  public addChild(...children: Emitter[]) {
    children.forEach((child) => {
      if (!this.hasChild(child)) {
        this._children.push(child);
        if (child.parent !== this) child.parent = this;
      }
    });
  }
  public removeChild(...children: Emitter[]) {
    children.forEach((child) => {
      const index = this.getChildIndex(child);
      if (index > -1) {
        this._children.splice(index, 1);
        if (child.parent === this) child.parent = null;
      }
    });
  }
  public hasChild(child: Emitter) {
    return this._children.includes(child);
  }
  public getChildIndex(child: Emitter) {
    return this._children.indexOf(child);
  }
  public addListener(
    type: string,
    handler: Handler,
    context?: any,
    option?: AddListenerOption
  ) {
    this.listeners[type] = this.listeners[type] || [];
    Object.assign({}, AddListenerDefaultOption, option || {});
    console.log(type, handler, context);
  }
}
