const defaultRE = /\{\{((?:.|\r?\n)+?)\}\}/g
/** node 就是文档碎片 */
export function compiler (node, vm) {
  /** 只有第一层 只有儿子 没有孙子 */
  let childNodes = node.childNodes;
  /**
   * 一种是元素 一种是文本
   * 将类数组转化成数组 */
  [...childNodes].forEach(child => {
    /** 1 元素 3表示文本 */
    if (child.nodeType === 1) {
      /** 编译当前元素的孩子节点 */
      compiler(child, vm)
    } else if (child.nodeType === 3) {
      util.compilerText(child, vm)
    }
  })
}
export const util = {
  /** [msg] */
  getValue (vm, expr) {
    let keys = expr.split('.')
    /** reduce 他具备迭代的功能 */
    return keys.reduce((memo, current) => {
      /** vm.school.name */
      memo = memo[current]
      return memo
    }, vm)
  },
  /** 编译文本 替换{{school.name}} */
  compilerText (node, vm) {
    if (!node.expr) {
      /** 给节点增加了一个自定义属性 为了方便后续的更新操作 */
      node.expr = node.textContent
    }
    node.textContent = node.expr.replace(defaultRE, function (...args) {
      return util.getValue(vm, args[1])
    })
  }
}
