// Better Design's read-only DOM capture; __name is a no-op replacement for its bundler helper.
export function captureSpacingSnapshot() {
  const __name = <T>(fn: T, _name: string) => fn
  const candidates = Array.from(document.querySelectorAll('body *'))
  const hiddenByAncestor = __name((element: Element) => {
    const visible = element.checkVisibility?.({ opacityProperty: true, visibilityProperty: true, contentVisibilityAuto: true })
    if (visible !== undefined) return !visible
    for (let node: Element | null = element; node; node = node.parentElement) if (Number(getComputedStyle(node).opacity) === 0) return true
    return false
  }, 'hiddenByAncestor')
  const visible = candidates.filter((element) => {
    const style = getComputedStyle(element)
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0 || hiddenByAncestor(element)) return false
    const rect = element.getBoundingClientRect()
    return rect.width > 0 || rect.height > 0
  }).slice(0, 1500)
  const ids = new Map<Element, string>()
  const selectorFor = (element: Element, index: number) => {
    const explicit = element.getAttribute('data-bd-inspect-id')
    if (explicit) return explicit
    if (element.id) return `#${element.id}`
    const tag = element.tagName.toLowerCase(); const parent = element.parentElement
    if (!parent) return `${tag}:${index + 1}`
    const siblings = Array.from(parent.children).filter((child) => child.tagName === element.tagName)
    return `${tag}:nth-of-type(${siblings.indexOf(element) + 1})@${index + 1}`
  }
  visible.forEach((element, index) => ids.set(element, selectorFor(element, index)))
  const number = (value: string) => Number.parseFloat(value) || 0
  const edges = (style: CSSStyleDeclaration, prefix: string) => ({ top: number(style.getPropertyValue(`${prefix}-top`)), right: number(style.getPropertyValue(`${prefix}-right`)), bottom: number(style.getPropertyValue(`${prefix}-bottom`)), left: number(style.getPropertyValue(`${prefix}-left`)) })
  const resolvedLength = (value: string, size: number) => {
    const trimmed = value.trim()
    if (!trimmed.startsWith('calc(') || !trimmed.endsWith(')')) return trimmed.endsWith('%') ? number(trimmed) * size / 100 : number(trimmed)
    const expression = trimmed.slice(5, -1).trim(); const term = /\s*([+-]?)\s*((?:\d+(?:\.\d*)?|\.\d+))(px|%)/gy
    let total = 0; let cursor = 0
    while (cursor < expression.length) {
      term.lastIndex = cursor; const match = term.exec(expression); if (!match) return 0
      total += (match[1] === '-' ? -1 : 1) * (match[3] === '%' ? Number(match[2]) * size / 100 : Number(match[2])); cursor = term.lastIndex
    }
    return total
  }
  const radiusComponents = (value: string) => {
    const parts: string[] = []; let depth = 0; let current = ''
    for (const character of value.trim()) {
      if (/\s/.test(character) && depth === 0) { if (current) parts.push(current); current = ''; continue }
      if (character === '(') depth += 1; if (character === ')') depth -= 1; current += character
    }
    if (current) parts.push(current); return parts
  }
  const cornerRadius = (value: string, rect: DOMRect) => {
    const [horizontal = '0', vertical = horizontal] = radiusComponents(value)
    return { horizontal: resolvedLength(horizontal, rect.width), vertical: resolvedLength(vertical, rect.height) }
  }
  const attribute = (element: Element, name: string) => element.getAttribute(name) || undefined
  const interactiveRoles = new Set(['button', 'checkbox', 'combobox', 'link', 'menuitem', 'radio', 'slider', 'switch', 'tab'])
  const interactiveTags = new Set(['a', 'button', 'input', 'select', 'summary', 'textarea'])
  const lineBoxes = (element: Element) => {
    const tops: number[] = []; let sawText = false
    const walk = (node: Node) => {
      for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === 3) {
          if (!(child.textContent || '').trim()) continue
          sawText = true; const range = document.createRange(); range.selectNodeContents(child)
          for (const box of Array.from(range.getClientRects())) if (box.width > 0 && box.height > 0 && !tops.some((top) => Math.abs(top - box.top) <= 1)) tops.push(box.top)
          continue
        }
        if (child.nodeType !== 1) continue
        const style = getComputedStyle(child as Element)
        if (['absolute', 'fixed'].includes(style.position) || style.display === 'none' || style.visibility === 'hidden' || !['inline', 'contents'].includes(style.display)) continue
        walk(child)
      }
    }
    walk(element); return sawText && tops.length ? tops.length : undefined
  }
  const elements = visible.map((element) => {
    const html = element as HTMLElement; const rect = element.getBoundingClientRect(); const style = getComputedStyle(element)
    const tag = element.tagName.toLowerCase(); const role = attribute(element, 'role')
    const interactive = interactiveTags.has(tag) || interactiveRoles.has(role || '') || html.tabIndex >= 0
    const explicitLabel = attribute(element, 'data-bd-inspect-label') || attribute(element, 'aria-label')
    const text = (explicitLabel || (interactive ? element.textContent : '') || '').replace(/\s+/g, ' ').trim().slice(0, 80)
    return {
      id: ids.get(element)!, selector: ids.get(element), tag, role, label: text || undefined,
      parentId: element.parentElement ? ids.get(element.parentElement) : undefined,
      groupId: attribute(element, 'data-bd-group'), interactive,
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      style: { display: style.display, position: style.position, flexDirection: style.flexDirection, flexWrap: style.flexWrap, alignItems: style.alignItems, justifyContent: style.justifyContent,
        rowGap: number(style.rowGap), columnGap: number(style.columnGap), padding: edges(style, 'padding'), margin: edges(style, 'margin'), overflowX: style.overflowX, overflowY: style.overflowY,
        borderRadius: { topLeft: cornerRadius(style.borderTopLeftRadius, rect), topRight: cornerRadius(style.borderTopRightRadius, rect), bottomRight: cornerRadius(style.borderBottomRightRadius, rect), bottomLeft: cornerRadius(style.borderBottomLeftRadius, rect) },
        backgroundColor: style.backgroundColor, backgroundImage: style.backgroundImage, boxShadow: style.boxShadow },
      lineCount: lineBoxes(element), clientWidth: html.clientWidth, clientHeight: html.clientHeight, scrollWidth: html.scrollWidth, scrollHeight: html.scrollHeight,
    }
  })
  return { name: `viewport-${innerWidth}`, viewport: { width: innerWidth, height: innerHeight, devicePixelRatio }, elements }
}
