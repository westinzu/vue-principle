/** TODO: 主入口,一个引入一个闭环 */
import { initState } from './observe'
import Watcher from './observe/watcher'
import { compiler } from './util'

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
  // 初始化工作 vue1.0 =>
  if (vm.$options.el) {
    vm.$mount()
  }
}
/** 渲染页面 将组件进行挂载 */
function query (el) {
  if (typeof el === 'string') {
    return document.querySelector(el)
  }
  return el
}

/**
 * ? 匹配不捕获 不捕获当前的分组
 * + 至少一个
 * ? 尽可能少匹配
 * 源码里的模板编译 也是基于正则的
 */
Vue.prototype._update = function () {
  /** 用用户传入的数据 去更新视图 */
  let vm = this
  let el = vm.$el

  /** 建立虚拟dom */
  let node = document.createDocumentFragment()
  let firstChild
  /** 每次拿到第一个元素就将这个元素放入到文档碎片中 */
  while (firstChild === el.firstChild) {
    /** 对虚拟DOM添加子节点 */
    node.appendChild(firstChild)
  }
  /**
   * ? 对文本进行替换 */
  compiler(node, vm)
  el.appendChild(node)
  /**
   * 需要匹配{{}}的方式来进行替换
   * 依赖收集 属性变化了 需要重新渲染 watcher 和 dep */
}

Vue.prototype.$mount = function () {
  let vm = this
  /** 获取元素 #app */
  let el = vm.$options.el
  /** 获取当前挂载的节点 vm.$el就是我要挂载的一个元素 */
  el = vm.$el = query(el)
  console.log('el', el)
  /**
   * 渲染时通过 watcher来渲染的
   * 渲染watcher  用于渲染的watcher
   * vue2.0 组件级别更新  new Vue 产生一个组件
   * 更新组件 、渲染的逻辑
   *  */
  let updateComponent = () => {
    /** 更新组件 */
    vm._update()
  }
  /**
   * 渲染watcher，默认会调用updateComponent这个方法
   * 我需要让每个数据 它更改了 需要重新的渲染
   *  */
  return new Watcher(vm, updateComponent)
}

Vue.prototype.$watch = function (expr, handler, opts) {
  /**  原理 创建一个watcher */
  let vm = this
  /** 用户自己定义的watch */
  return new Watcher(vm, expr, handler, { user: true, ...opts })
}

export default Vue
