// 空函数
export function noop (...args: any[]) {/* */}

// 保证是数组
export function ensureArray<T> (arr: T | T[]): T[] {
  return Array.isArray(arr) ? arr : [arr]
}

// 获取并设置行列样式
export function getStyles (element: HTMLElement) {
  const printClass = element.getAttribute('data-print-class')
  if (printClass) element.classList.add(printClass)

  const printStyle = element.getAttribute('data-print-style') || ''

  const styles = window.getComputedStyle(element) as any

  let result = Object.keys(styles).reduce((r, key) => {
    const value = styles.getPropertyValue(styles[key])
    return value ? r + `${styles[key]}: ${value};` : r
  }, '') + printStyle

  return result
}

const formTags = ['INPUT', 'TEXTAREA', 'SELECT']

function isSelect (el: HTMLElement): el is HTMLSelectElement {
  return el.tagName === 'SELECT'
}

// 循环获取样式
export function loopStyles (el: HTMLElement, ignoreTags: string[] = []) {
  const style = ignoreTags.includes(el.tagName) ? '' : getStyles(el)

  if (formTags.includes(el.tagName)) {
    const pre = document.createElement('pre')

    pre.innerHTML = isSelect(el) ? el.options[el.selectedIndex].text : (el as HTMLInputElement).value
    pre.setAttribute('style', style)

    el.parentNode!.replaceChild(pre, el)
  } else {
    el.setAttribute('style', style)

    if (el.children && el.children.length) {
      const children = el.children
      const len = children.length

      for (let i = 0; i < len; i++) {
        loopStyles(children[i] as HTMLElement, ignoreTags)
      }
    }
  }
}

// 等待img标签加载
export function resolveImage (img: HTMLImageElement) {
  return new Promise((resolve) => {
    if (img.getAttribute('src')) {
      img.onerror = () => resolve()
      img.onload = () => resolve()
    } else {
      resolve()
    }
  })
}
