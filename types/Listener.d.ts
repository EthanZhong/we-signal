import type { Emitter } from './Emitter';
import type { SignalFeature } from './Signal';
import { Signal } from './Signal';
/** 侦听器处理函数类型 */
export declare type ListenerHandler<T = any> = (signal: Signal<T>) => unknown;
/** 创建侦听器symbol值 */
declare const ListenerSymbol: unique symbol;
/** 侦听器类 */
export declare class Listener {
    type: string;
    handler: ListenerHandler;
    emitter: Emitter;
    context: unknown;
    count: number;
    catchFeature: SignalFeature;
    /**
     * 侦听器构造函数
     * @param type 侦听器类型需要和信号类型匹配
     * @param handler 侦听器处理函数
     * @param emitter 侦听器所属发射器
     * @param context 侦听器处理函数上下文
     * @param count 侦听器可处理信号的次数，默认 `-1` 无限次数
     * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
     */
    constructor(symbol: typeof ListenerSymbol, type: string, handler: ListenerHandler, emitter: Emitter, context?: unknown, count?: number, catchFeature?: SignalFeature);
    /** 获取当前侦听器是否还可以接收处理信号 */
    get active(): boolean;
    /**
     * 处理信号
     * @param signal 信号
     */
    handle<U>(signal: Signal<U>): void;
    /**
     * 创建侦听器
     * @param type 侦听器类型需要和信号类型匹配
     * @param handler 侦听器处理函数
     * @param emitter 侦听器所属发射器
     * @param context 侦听器处理函数上下文
     * @param count 侦听器可处理信号的次数，默认 `-1` 无限次数
     * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
     */
    static create(type: string, handler: ListenerHandler, emitter: Emitter, context?: unknown, count?: number, catchFeature?: SignalFeature): Listener;
}
export {};
