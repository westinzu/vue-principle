
let callbacks = []
function flushCallbacks () {
  callbacks.forEach(cb => cb())
}
/** cb就是flushQueue */
export function nextTick (cb) {
  callbacks.push(cb)
  // 要异步刷新这个callbacks ，获取一个异步的方法
  //                          微任务                       宏任务
  // 异步是分执行顺序的 会先执行(promise  mutationObserver)  setImmediate  setTimeout
  let timerFunc = () => {
    flushCallbacks()
  }
  /** then方法是异步的 */
  if (Promise) {
    return Promise.resolve().then(timerFunc)
  }
  /** MutationObserver 也是一个异步方法 */
  if (MutationObserver) {
    /** H5的api */
    let observe = new MutationObserver(timerFunc)
    let textNode = document.createTextNode(1)
    observe.observe(textNode, { characterData: true })
    textNode.textContent = 2
    return
  }
  if (setImmediate) {
    return setImmediate(timerFunc)
  }
  setTimeout(timerFunc, 0)
}
