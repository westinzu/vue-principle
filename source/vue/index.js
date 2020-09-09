/** TODO: 主入口,一个引入一个闭环 */
import { initState } from './observe'

/** 1.开始写vue构造函数 */
function Vue (options) {
  /**  调用初始化方法,并带入new的入参 */
  this._init(options)
}

/** 2.初始化方法, 主要: 初始化对象和方法 */
Vue.prototype._init = function (options) {
  /** 锁定this实例 */
  let vm = this
  /** 锁定入参对象 */
  vm.$options = options

  /** 3.对钩子数据函数: data computed watch 拦截并初始化 */
  initState(vm)
}
export default Vue
