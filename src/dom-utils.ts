import focusableSelectors from 'focusable-selectors'

// Elements with these ARIA roles make their children `presentational`, which
// nullifies their semantics
// @see: https://www.w3.org/TR/wai-aria/
const PRESENTATIONAL_CHILDREN_SELECTOR = [
  'a[href]',
  'button',
  'img',
  'summary',
  '[role="button"]',
  '[role="image"]',
  '[role="link"]',
  '[role="math"]',
  '[role="presentation"]',
  '[role="progressbar"]',
  '[role="scrollbar"]',
  '[role="slider"]',
].join(',')
/**
 * Set the focus to the first element with `autofocus` with the element or the
 * element itself
 */
export function moveFocusToDialog(el: HTMLElement) {
  const focused = (el.querySelector('[autofocus]') || el) as HTMLElement

  focused.focus()
}

// Get the first and last focusable elements in a given subtree
export function getFirstAndLastFocusableChild(el: HTMLElement) {
  const first = findFocusableElement(el, true)
  let last = null
  if (first !== null) {
    last = findFocusableElement(el, false) || first
  }
  return [first, last]
}

function findFocusableElement(
  node: HTMLElement,
  forward: boolean
): HTMLElement | null {
  if (forward && isFocusable(node)) return node

  const firstChild = forward ? 'firstElementChild' : 'lastElementChild'
  const siblingDirection = forward
    ? 'nextElementSibling'
    : 'previousElementSibling'

  let focusableEl: HTMLElement | null = null

  if (node.shadowRoot) {
    let shadowRoot: ShadowRoot = node.shadowRoot
    let child = shadowRoot[firstChild]
    while (child && !focusableEl) {
      focusableEl = findFocusableElement(child as HTMLElement, forward)
      child = child[siblingDirection]
    }
  } else if (node instanceof HTMLSlotElement) {
    const assignedElements = Array.from(
      node.assignedElements({ flatten: true })
    ) as HTMLElement[]
    if (!forward) assignedElements.reverse()
    for (const assignedElement of assignedElements) {
      focusableEl = findFocusableElement(assignedElement, forward)
      if (focusableEl) return focusableEl
    }
  } else {
    let child = node[firstChild]
    while (child && !focusableEl) {
      focusableEl = findFocusableElement(child as HTMLElement, forward)
      child = child[siblingDirection]
    }
  }

  if (focusableEl) {
    return focusableEl
  }

  // Searching in reverse means we need to go deep first and only return the current element
  // if we don't find any focusable elements in its subtree.
  if (!forward && isFocusable(node)) return node

  return null
}

/**
 * Determine if an element is focusable and has user-visible painted dimensions
 */
export function isFocusable(el: HTMLElement) {
  return (
    el.matches(focusableSelectors.join(',')) &&
    !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
  )
}

// Get the active element, accounting for Shadow DOM subtrees.
// @author Cory LaViska
// @see: https://www.abeautifulsite.net/posts/finding-the-active-element-in-a-shadow-root/
export function getActiveElement(
  root: Document | ShadowRoot = document
): Element | null {
  const activeEl = root.activeElement

  if (!activeEl) return null

  // If there’s a shadow root, recursively look for the active element within it
  if (activeEl.shadowRoot) return getActiveElement(activeEl.shadowRoot)

  // If not, we can just return the active element
  return activeEl
}
