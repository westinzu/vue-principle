/**
 * ? 个文件形成一个闭环1 */
import Observer from './observer'
import Watcher from './watcher'
import Dep from './dep'
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

function createComputedGetter (vm, key) {
  /** 这个watcher 就是我们定义的计算属性watcher */
  let watcher = vm._watchersComputed[key]
  /** 用户取值是会执行此方法 */
  return function () {
    if (watcher) {
      /** 如果dirty 是false的话 不需要重新执行计算属性中的方法 */
      if (watcher.dirty) {
        /** 如果页面取值 ，而且dirty是true 就会去调用watcher的get方法 */
        watcher.evaluate()
      }
      /**  watcher 就是计算属性watcher dep = [firstName.dep,lastName.Dep] */
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
// watch方法 不能用在模板里，监控的逻辑都放在watch中即可
// watcher 三类 渲染watcher  用户watcher  计算属性watcher
function initComputed (vm, computed) {
  /**
  * 将计算属性的配置 放到vm上
  * 创建存储计算属性的watcher的对象
  */
  let watchers = vm._watchersComputed = Object.create(null) //

  /** {fullName:()=>this.firstName+this.lastName} */
  for (let key in computed) {
    let userDef = computed[key]
    /**
    * new Watcher此时什么都不会做 配置了lazy dirty = true
    * 计算属性watcher 默认刚开始这个方法不会执行
    */
    watchers[key] = new Watcher(vm, userDef, () => {}, { lazy: true })
    // vm.fullName
    Object.defineProperty(vm, key, {
      /** 将这个属性 定义到vm上 */
      get: createComputedGetter(vm, key)
    })
  }
}

function createWatcher (vm, key, handler, opts) {
  /** 内部最终也会使用$watch方法 */
  return vm.$watch(key, handler, opts)
}

function initWatch (vm) {
  /** 获取用户传入的watch属性 */
  let watch = vm.$options.watch
  /** msg(){} */
  for (let key in watch) {
    let userDef = watch[key]
    let handler = userDef
    if (userDef.handler) {
      handler = userDef.handler
    }
    createWatcher(vm, key, handler, { immediate: userDef.immediate })
  }
}
