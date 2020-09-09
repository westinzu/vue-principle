/**
 * ? 个文件形成一个闭环1 */
import Observer from './observer'
/** 1.挟持 data computed watch 进行具体修改 */
export function initState (vm) {
  /** 拿到新的入参实例 */
  let opts = vm.$options
  if (opts.data) {
    /** ?? */
    initData(vm)
  }
  /** 如计算属性: 执行拦截的computed */
  if (opts.computed) {
    /** 初始化计算属性 */
    initComputed()
  }
  if (opts.watch) {
    /** 初始化watch */
    initWatch()
  }
}
/** 建立观察函数 */
export function observe (data) {
  if (typeof data !== 'object' || data == null) {
    /** 只对对象或者是null 执行 */
    return
  }
  /** 抽出观察函数执行内容 */
  return new Observer(data)
}

/** 代理数据的读写方法 */
function proxy (vm, source, key) {
  /** 对 实例 赋予读写方法 */
  Object.defineProperty(vm, key, {
    get () {
      return vm[source][key]
    },
    set (newValue) {
      vm[source][key] = newValue
    }
  })
}

/** 初始化initData, 赋予读写方法 */
function initData (vm) {
  /** 拿到用户传入的data */
  let data = vm.$options.data
  /** 如data是函数,通过call拿到this的属性 */
  data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}
  /** 1.拿到data的属性, 代理其读写方法 */
  for (let key in data) {
    proxy(vm, '_data', key)
  }
  /** 2. 观察数据 */
  observe(vm._data)
}

/**
 * ? 新的一篇章2 */
function initComputed () {

}
function initWatch () {

}
