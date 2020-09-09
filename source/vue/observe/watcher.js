import { pushTarget, popTarget } from './dep'
import { nextTick } from './nextTick'

let id = 0
/**  每次产生一个watcher 都要有一个唯一的标识 */
class Watcher {
  /**
   * @param {*} vm 当前组件的实例 new Vue
   * @param {*} exprOrFn 用户可能传入的是一个表达式 也有可能传入的是一个函数
   * @param {*} cb 用户传入的回调函数 vm.$watch('msg',cb)
   * @param {*} opts 一些其他参数
  */
  constructor (vm, exprOrFn, cb = () => {}, opts = {}) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn // getter就是new Watcher传入的第二个函数
    }
    this.cb = cb
    this.deps = []
    this.depsId = new Set()
    this.opts = opts
    this.id = id++
    /**  默认创建一个watcher 会调用自身的get方法 */
    this.get()
  }
  get () {
    /** 渲染watcher Dep.target = watcher  msg变化了 需要让这个watcher重新执行 */
    pushTarget(this)
    /** 默认创建watcher 会执行此方法 */
    /** 让这个当前传入的函数执行 */
    this.getter()
    popTarget()
  }
  /** 同一个watcher 不应该重复记录dep  让watcher和dep 互相记忆 */
  addDep (dep) {
    /** msg 的dep */
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      /** 就让watcher 记住了当前的dep */
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
  update () {
    // this.get()
    /** 如果立即调用get 会导致页面刷新 异步来更新 */
    queueWatcher(this)
  }
}

/** 对重复的watcher进行过滤操作 */
function queueWatcher (watcher) {
  let id = watcher.id
  if (has[id] == null) {
    has[id] = true
    /** 相同的watcher只会存一个到queue中 */
    queue.push(watcher)
    /**
     * 异步方法会等待所有同步方法执行完毕后调用此方法
     * 延迟清空队列
     * 刷新队列
    */
    nextTick(flushQueue)
  }
}
/** 渲染使用他 计算属性也要用他 vm.watch 也用他 */
export default Watcher
