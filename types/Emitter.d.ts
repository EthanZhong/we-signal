import type { ListenerHandler } from './Listener';
import type { SignalFeature } from './Signal';
/** 发射器类 */
export declare class Emitter {
    /** 父级发射器 */
    private _parent;
    /** 子级发射器 */
    private _children;
    /** 侦听器集合 */
    private listeners;
    /** 获取侦听器总数 */
    get totalListener(): number;
    /** 获取父级发射器 */
    get parent(): Emitter | null;
    /** 设置父级发射器 */
    set parent(newParent: Emitter | null);
    /** 获取子级发射器 */
    get children(): Emitter[];
    /**
     * 添加子级发射器
     * @param children 需要被添加的子级发射器
     */
    addChild(...children: Emitter[]): void;
    /**
     * 删除子级发射器
     * @param children 需要被删除的子级发射器，无参数时清空所有子级发射器
     */
    removeChild(...children: Emitter[]): void;
    /**
     * 判断是否有对应的子级发射器
     * @param child 子级发射器
     * @returns
     */
    hasChild(child: Emitter): boolean;
    /**
     * 获取子级发射器索引值
     * @param child 子级发射器
     * @returns
     */
    getChildIndex(child: Emitter): number;
    /**
     * 添加侦听器
     * @param type 侦听器类型
     * @param handler 侦听器处理函数
     * @param context 侦听器处理函数上下文
     * @param count 侦听器可处理信号的次数，默认 `-1` 无限次数
     * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
     * @returns {boolean} 是否添加成功
     */
    addListener<T = any>(type: string, handler: ListenerHandler<T>, context?: unknown, count?: number, catchFeature?: SignalFeature): boolean;
    /**
     * 添加侦听器
     * @param type 侦听器类型
     * @param handler 侦听器处理函数
     * @param context 侦听器处理函数上下文
     * @param count 侦听器可处理信号的次数，默认 `-1` 无限次数
     * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
     */
    on<T = any>(type: string, handler: ListenerHandler<T>, context?: unknown, count?: number, catchFeature?: SignalFeature): boolean;
    /**
     * 添加一次性侦听器
     * @param type 侦听器类型
     * @param handler 侦听器处理函数
     * @param context 侦听器处理函数上下文
     * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
     */
    once<T = any>(type: string, handler: ListenerHandler<T>, context?: unknown, catchFeature?: SignalFeature): boolean;
    /**
     * 卸载侦听器
     * @param type 侦听器类型
     * @param handler 侦听器处理函数
     * @param context 侦听器处理函数上下文
     * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
     */
    removeListener(type?: string, handler?: ListenerHandler, context?: unknown, catchFeature?: SignalFeature): void;
    /**
     * 卸载侦听器
     * @param type 侦听器类型
     * @param handler 侦听器处理函数
     * @param context 侦听器处理函数上下文
     * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
     */
    off(type?: string, handler?: ListenerHandler, context?: unknown, catchFeature?: SignalFeature): void;
    /**
     * 发射信号
     * @param type 信号类型
     * @param data 信号数据
     * @param feature 信号特性
     */
    emit<T>(type: string, data: T, feature?: SignalFeature): void;
    /**
     * 销毁自身
     */
    destroy(): void;
    /**
     * 接收信号
     * @param signal 信号
     */
    private receive;
    /**
     * 向上发射信号
     * @param signal 信号
     */
    private emitUpWard;
    /**
     * 向下发射信号
     * @param signal 信号
     */
    private emitDownWard;
}
