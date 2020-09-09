let id = 0

/** 建立 深入的方法 */
class Dep {
  constructor () {
    this.id = id++
    this.subs = []
  }
  /** 订阅 就是将调用addSub时传入的内容保存到数组中 */
  addSub (watcher) {
    this.subs.push(watcher)
  }
  notify () {
    this.subs.forEach(watcher => watcher.update())
  }
  depend () {
    /** 为了防止直接调用depend方法 先判断一下 */
    if (Dep.target) {
      /** Dep.target是一个渲染watcher */
      /** 希望可以在watcher中互相记忆 */
      Dep.target.addDep(this)
    }
  }
}
/** 用来保存当前的watcher */
let stack = []
export function pushTarget (watcher) {
  Dep.target = watcher
  stack.push(watcher)
}
export function popTarget () {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}
/** 用来收集依赖 收集的是一个个watcher */
export default Dep
