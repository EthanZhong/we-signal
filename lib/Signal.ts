import type Emitter from './Emitter';
/**
 * 信号传播特性，注意信号传递方向和顺序,默认值 `exact`
 *
 * `exact`  信号精准发射，只有自身才能接受到信号，谁发射谁接受[信号->自己]
 *
 * `upward` 信号向上发射，只有自身和父祖辈才能接受到信号[信号->自己->父祖辈]
 *
 * `downward` 信号向下发射，只有自身和子孙辈才能接受到信号[信号->自己->子孙辈]
 *
 * `whole` 信号全局发射，自身及子孙父祖辈都能接受到信号[信号->自己 然后(自己->父祖辈&&自己->子孙辈)]
 */
export type SignalFeature = 'exact' | 'upward' | 'downward' | 'whole';
/** 信号特性常量类型 */
type SignalFeatureConst<T extends keyof any = SignalFeature> = {
  [K in T]: K;
};
/** 信号类 */
export default class Signal<T> {
  /** 信号特性常量 */
  static readonly Features: SignalFeatureConst = {
    exact: 'exact',
    upward: 'upward',
    downward: 'downward',
    whole: 'whole',
  };
  /**
   * 构造函数
   * @param origin 发射该信号的发射器
   * @param type 信号类型与侦听器类型匹配
   * @param data 信号数据
   * @param feature 信号特性
   */
  constructor(
    public origin: Emitter,
    public type: string,
    public data: T,
    public feature: SignalFeature = Signal.Features.exact
  ) {}
}
