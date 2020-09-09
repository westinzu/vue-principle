/**
 * 1. 拦截配置:会默认先查找source 目录下的vue文件夹
 * 2. 下一个vue的构造函数
 *  */
import Vue from 'vue'
/** 2. new一个实例 */
let vm = new Vue({
  /** 表示要渲染的元素是app */
  el: '#app',
  /** 有一个实例的data是对象,咱们要拦截他 */
  data () {
    return {
      msg: 'hello',
      school: { name: 'zf', age: 10 },
      arr: [1, 2, 3]
    }
  },
  computed: {

  },
  watch: {

  }
})
// vm.msg = vm._data.msg // 代理
console.log(vm.school)
