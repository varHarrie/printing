import { ensureArray, loopStyles, noop, resolveImage } from './utils'

const ignoreTags = ['COLGROUP', 'COL']

export interface Options {
  beforePrint?: (el: HTMLElement, index: number) => void
  direction?: 'vertical' | 'horizontal'
}

export interface PrintFn {
  (source: HTMLElement | HTMLElement[], options?: Options): Promise<void>
  preview: (source: HTMLElement | HTMLElement[], options: Options) => void
}

// 生成html
export function generate (source: HTMLElement | HTMLElement[], options: Options = {}) {
  const sources = ensureArray(source).filter((s) => s && s.parentNode)
  const clones = sources.map((s) => s.cloneNode(true) as HTMLElement)

  const beforePrint = options.beforePrint || noop
  const direction = options.direction || 'vertical'

  const pages = sources.map((s, i) => {
    const clone = clones[i]

    // 临时插入克隆的dom到相同位置，用于获取样式
    s.parentNode!.appendChild(clone)

    // 获取样式到clone
    loopStyles(clone, ignoreTags)

    // 预处理
    beforePrint(clone, i)

    // 移除克隆dom
    s.parentNode!.removeChild(clone)

    return clone.outerHTML
  })

  // 纸张方向
  const directionStyle = direction === 'horizontal'
  ? '<style type="text/css" media="print">@page { size: landscape; }</style>'
  : ''

  // 连接分页符
  const pageBreak = '<div style="page-break-after: always;"></div>'

  return directionStyle + pages.join(pageBreak)
}

// 预览
export function preview (source: HTMLElement | HTMLElement[], options: Options = {}) {
  const win = window.open()!
  win.window.document.body.innerHTML = generate(source, options)
}

// 打印
export async function print (source: HTMLElement | HTMLElement[], options: Options = {}) {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'block'
  iframe.style.height = '0'
  iframe.style.width = '0'
  iframe.style.overflow = 'hidden'
  document.body.appendChild(iframe)

  const iframeDocument = iframe.contentDocument!
  const iframeWindow = iframe.contentWindow!
  iframeDocument.body.innerHTML = generate(source, options)

  // 等待图片加载完成
  const images: HTMLImageElement[] = Array.from(iframeDocument.querySelectorAll('img[src]'))
  await Promise.all(images.map((img) => resolveImage(img)))

  iframeWindow.print()
  document.body.removeChild(iframe)
}

const printFn: PrintFn = print as any
printFn.preview = preview

export default printFn
