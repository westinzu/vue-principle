import { observe } from '.'

/**
 * 主要要做的事就是拦截用户调用的 push shift unshift pop reverse sort splice concat ...
 */

// 先获取老的数组的方法 只改写这7个方法
let oldArrayProtoMethods = Array.prototype

// 拷贝的一个新的对象 可以查找到 老的方法
export let arrayMethods = Object.create(oldArrayProtoMethods)

// 原型链 prototype  __proto__
let methods = [
  'push',
  'shift',
  'pop',
  'unshift',
  'reverse',
  'sort',
  'splice'
]
// {arr:[{a:1}]}
/** 要循环数组一次对数组中没一项进行观测 */
export function observerArray (inserted) {
  for (let i = 0; i < inserted.length; i++) {
    /** 没有 对数组的索引进行监控 */
    observe(inserted[i])
  }
}
/** arr.push(1,2,3)  args=[1,2,3] */
methods.forEach(method => {
  /** TODO: 函数劫持  切片编程 */
  arrayMethods[method] = function (...args) {
    // call apply bind的用法
    let r = oldArrayProtoMethods[method].apply(this, args)
    /** todo */
    let inserted
    /** 只对 新增的属性 再次进行观察 其他方法没有新增属性 */
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        /**  获取splice 新增的内容 */
        inserted = args.slice(2)
        break
      default:
    }
    /** TODO: 这里为什么要递归呢? */
    if (inserted) observerArray(inserted)
    console.log('调用了数组更新的方法了  -- 更新视图')
    return r
  }
})
