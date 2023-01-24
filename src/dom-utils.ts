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
export function getFocusableEdges(el: HTMLElement) {
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
  // If we're walking forward, check if this node is focusable,
  // and return it immediately if it is.
  if (forward && isFocusable(node)) {
    return node
  }

  // If this node can't have focusable children, we can't go any deeper
  // regardless of whether we're walking forward or backward.
  if (!canHaveFocusableChildren(node)) {
    return null
  }

  // Start walking the DOM tree, looking for focusable elements.
  // Case 1: If this node has a shadow root, search it recursively.
  if (node.shadowRoot) {
    const shadowRoot = node.shadowRoot
    // Descend into this subtree.
    let child = forward
      ? shadowRoot.firstElementChild
      : shadowRoot.lastElementChild
    // Traverse siblings, searching the subtree of each one
    // for focusable elements.
    while (child) {
      const focusableEl = findFocusableElement(child as HTMLElement, forward)
      if (focusableEl) return focusableEl
      child = forward ? child.nextElementSibling : child.previousElementSibling
    }
    // Case 2: If this node is a slot for a Custom Element,
    // search its assigned nodes recursively.
  } else if (node.localName === 'slot') {
    const assignedElements = (node as HTMLSlotElement).assignedElements({
      flatten: true,
    }) as HTMLElement[]
    if (!forward) assignedElements.reverse()
    for (const assignedElement of assignedElements) {
      const focusableEl = findFocusableElement(assignedElement, forward)
      if (focusableEl) return focusableEl
    }
    // Case 3: this is a regular Light DOM node. Search its subtree.
  } else {
    // Descend into this subtree.
    let child = forward ? node.firstElementChild : node.lastElementChild
    // Traverse siblings, searching the subtree of each one
    // for focusable elements.
    while (child) {
      const focusableEl = findFocusableElement(child as HTMLElement, forward)
      if (focusableEl) return focusableEl
      child = forward ? child.nextElementSibling : child.previousElementSibling
    }
  }

  // If we're walking backward, we want to check the node's entire subtree
  // before checking the node itself.
  // If this node is focusable, return it.
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

function canHaveFocusableChildren(el: HTMLElement) {
  return !(
    el.matches(
      '[hidden],[inert],:disabled,[aria-hidden="true"],[aria-disabled="true"]'
    ) && el.matches(PRESENTATIONAL_CHILDREN_SELECTOR)
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

  // If there’s a shadow root, recursively find the active element within it.
  // If the recursive call returns null, return the active element of the top-level Document.
  if (activeEl.shadowRoot)
    return getActiveElement(activeEl.shadowRoot) || document.activeElement

  // If not, we can just return the active element
  return activeEl
}
