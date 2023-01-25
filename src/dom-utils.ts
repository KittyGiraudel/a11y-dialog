import focusableSelectors from 'focusable-selectors'

/**
 * Set the focus to the first element with `autofocus` with the element or the
 * element itself
 */
export function moveFocusToDialog(el: HTMLElement) {
  const focused = (el.querySelector('[autofocus]') || el) as HTMLElement

  focused.focus()
}

// Get the first and last focusable elements in a given tree.
export function getFocusableEdges(el: HTMLElement) {
  // Check for a focusable element within the subtree of `el`.
  const first = findFocusableElement(el, true)
  let last = null
  // Only if we find the first element do we need to look for the last one.
  // If there's no last element, we set `last` as a reference
  // to `first` so that the returned array is always of length 2.
  if (first) {
    last = findFocusableElement(el, false) || first
  }
  return [first, last] as const
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

  // We should only search the subtree of this node
  // if it can have focusable children.
  if (canHaveFocusableChildren(node)) {
    // Start walking the DOM tree, looking for focusable elements.
    // Case 1: If this node has a shadow root, search it recursively.
    if (node.shadowRoot) {
      const shadowRoot = node.shadowRoot
      // Descend into this subtree.
      let next = getNextChildEl(shadowRoot, forward)
      // Traverse siblings, searching the subtree of each one
      // for focusable elements.
      while (next) {
        const focusableEl = findFocusableElement(next as HTMLElement, forward)
        if (focusableEl) return focusableEl
        next = getNextSiblingEl(next as HTMLElement, forward)
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
      let next = getNextChildEl(node, forward)
      // Traverse siblings, searching the subtree of each one
      // for focusable elements.
      while (next) {
        const focusableEl = findFocusableElement(next as HTMLElement, forward)
        if (focusableEl) return focusableEl
        next = getNextSiblingEl(next as HTMLElement, forward)
      }
    }
  }

  // If we're walking backward, we want to check the node's entire subtree
  // before checking the node itself.
  // If this node is focusable, return it.
  if (!forward && isFocusable(node)) return node

  return null
}

function getNextChildEl(node: ParentNode, forward: boolean) {
  return forward ? node.firstElementChild : node.lastElementChild
}

function getNextSiblingEl(el: HTMLElement, forward: boolean) {
  return forward ? el.nextElementSibling : el.previousElementSibling
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

// Elemments matching these selectors are either hidden entirely from the user,
// or are visible but unavailable for interaction.
// Neither they nor any of their descentants can ever receive focus.
const HIDDEN_FROM_USER_SELECTOR =
  ':disabled,[aria-disabled="true"],[aria-hidden="true"],[hidden],[inert]'

const cannotHaveFocusableChildrenSelector =
  PRESENTATIONAL_CHILDREN_SELECTOR + ',' + HIDDEN_FROM_USER_SELECTOR

/**
 * Determine if an element can have focusable children. Useful for bailing out
 * early when walking the DOM tree.
 * @example:
 * The following div is inert, so none of its children can be focused,
 * even though they meet our criteria for what is focusable.
 * Once we check the div, we can skip the rest of the subtree.
 * ```html
 * <div inert>
 *   <button>Button</button>
 *   <a href="#">Link</a>
 * </div>
 * ```
 * This is bad HTML. Links make their children presentaional, so
 * the nested link is not available to the user. We bail out on the
 * parent link so we don't mistakenly consider the nested link focusable.
 * ```html
 * <a href="#">
 *   Hello,
 *   <a href="#">world</a>
 * </a>
 * ```
 */
function canHaveFocusableChildren(el: HTMLElement) {
  return !el.matches(cannotHaveFocusableChildrenSelector)
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
  // If the recursive call returns null, return the active element
  // of the top-level Document.
  if (activeEl.shadowRoot)
    return getActiveElement(activeEl.shadowRoot) || document.activeElement

  // If not, we can just return the active element
  return activeEl
}
