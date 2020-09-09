/** TODO: 大循环:自我递归 */
import { observe } from './index'
/** TODO2: 拦截数组 原型链的方法 */
import { arrayMethods, observerArray, dependArray } from './array'
import Dep from './dep'

/**
 * 2.本段重点讲解怎么观察函数变化,并进行拦截
 * 定义响应式的数据变化
 *  */
export function defineReactive (data, key, value) { //
  /**
   * 如果value 依旧是一个对象的话 需要深度观察 {school:{name:'zf,age:10}}
   * 递归观察
   * 3.提取观察的方法
   */
  let childOb = observe(value)
  /** dep里可以收集依赖 收集的是watcher 每一个属性都增加一个dep实例 */
  let dep = new Dep()
  /** 4.给对象建立读写方法 */
  Object.defineProperty(data, key, {
    get () {
      /** 这次有值用的是渲染watcher */
      if (Dep.target) {
        /** 我们希望存入的watcher 不能重复 ，如果重复会造成更新时多次渲染 */
        /** 他像让dep 中可以存watcher，我还希望让这个watcher中也存放dep，实现一个多对多的关系 */
        dep.depend()
        /** 数组的依赖收集  [[1],2,3] */
        if (childOb) {
          /** 数组也收集了当前渲染watcher */
          childOb.dep.depend()
          /** 收集儿子的依赖 */
          dependArray(value)
        }
      }
      return value
    },
    /** 通知依赖更新 */
    set (newValue) {
      if (newValue === value) return
      /** 如果你设置的值是一个对象的话 应该在进行监控这个新增的对象 */
      observe(newValue)
      value = newValue
      dep.notify()
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
