/** TODO: 大循环:自我递归 */
import { observe } from './index'
/** TODO2: 拦截数组 原型链的方法 */
import { arrayMethods, observerArray } from './array'

/**
 * 2.本段重点讲解怎么观察函数变化,并进行拦截
 * 定义响应式的数据变化
 *  */
export function defineReactive (data, key, value) { //
  /**
   * 如果value 依旧是一个对象的话 需要深度观察 {school:{name:'zf,age:10}}
   * 递归观察
   */
  /** 3.提取观察的方法 */
  observe(value)
  /** 4.给对象建立读写方法 */
  Object.defineProperty(data, key, {
    get () {
      console.log('获取数据')
      return value
    },
    set (newValue) {
      if (newValue === value) return
      console.log('设置数据')
      value = newValue
    }
  })
}
/** 1.建立一个Observer类 */
class Observer {
  /** data 就是我们刚才定义的vm._data */
  constructor (data) {
    /** 将用户的数据使用defineProperty重新定义 */
    if (Array.isArray(data)) { // 我需要重写 push 方法等
      /**
       * 只能拦截数组的方法 ，数组里的每一项 还需要去观测一下
       * 让数组 通过链来查找我们自己编写的原型 */
      data.__proto__ = arrayMethods
      /** 观测数据中的每一项 */
      observerArray(data)
    } else {
      this.walk(data)
    }
  }
  walk (data) {
    let keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      /** 用户传入的key */
      let key = keys[i]
      /** 用户传入的值 */
      let value = data[keys[i]]
      /** 悄悄观察起来 */
      defineReactive(data, key, value)
    }
  }
}
export default Observer
