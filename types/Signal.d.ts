import type { Emitter } from './Emitter';
/**
 * 信号传播特性，注意信号流动方向和顺序,默认值 `exact`
 *
 * `exact`  信号精准发射，只有源发射器才能接收到信号，谁发射谁接收[信号->源发射器]
 *
 * `upward` 信号向上发射，源发射器和父祖辈发射器可以接收到信号[信号->源发射器->父祖辈发射器]
 *
 * `downward` 信号向下发射，源发射器和子孙辈发射器可以接收到信号[信号->源发射器->子孙辈发射器]
 *
 * `whole` 信号全局发射，源发射器、父祖辈发射器和子孙辈发射器都可以接收到信号[信号->源发射器(源发射器->父祖辈&&源发射器->子孙辈)]
 */
export declare type SignalFeature = 'exact' | 'upward' | 'downward' | 'whole';
/** 信号特性常量类型 */
declare type SignalFeatureConst<T extends keyof any = SignalFeature> = {
    [K in T]: K;
};
/** 创建信号symbol值 */
declare const SignalSymbol: unique symbol;
/** 信号类 */
export declare class Signal<T> {
    type: string;
    data: T;
    origin: Emitter;
    feature: SignalFeature;
    /** 信号特性常量 */
    static readonly Features: SignalFeatureConst;
    /**
     * 构造函数
     * @param type 信号类型与侦听器类型匹配
     * @param data 信号数据
     * @param origin 发射该信号的发射器
     * @param feature 信号特性
     */
    constructor(symbol: typeof SignalSymbol, type: string, data: T, origin: Emitter, feature?: SignalFeature);
    /**
     * 创建信号
     * @param type 信号类型与侦听器类型匹配
     * @param data 信号数据
     * @param origin 发射该信号的发射器
     * @param feature 信号特性
     */
    static create<U>(type: string, data: U, origin: Emitter, feature?: SignalFeature): Signal<U>;
}
export {};
