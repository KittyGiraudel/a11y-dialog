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

/**
 * Get focusable children by recursively traversing the subtree of the given
 * element, while accounting for Shadow DOM subtrees
 */
export function getFocusableChildren(el: ParentNode): HTMLElement[] {
  // Check for the base case of our recursion
  if (el instanceof HTMLElement) {
    // If this element is marked as inert, neither it nor any member of its
    // subtree will be focusable, therefore there are no focusable children
    if (el.inert) return []

    // If this element has no children or if it nullifies its children’s
    // semantics, there are no focusable children
    if (!el.firstElementChild || el.matches(PRESENTATIONAL_CHILDREN_SELECTOR)) {
      // If the element itself is focusable, return it otherwise return nothing
      return isFocusable(el) ? [el] : []
    }
  }

  let focusableEls: HTMLElement[] = []

  // Walk all the immediate children of this element (with some type casting
  // because `el.children` is an `HTMLCollection`)
  for (const curr of el.children as unknown as HTMLElement[]) {
    // If this element has a Shadow DOM attached, check the Shadow subtree for
    // focusable children
    if (curr.shadowRoot) {
      focusableEls = focusableEls.concat(getFocusableChildren(curr.shadowRoot))
    }

    // If this element is a slot, look for any elements assigned to it then
    // check each of those elements for focusable children
    else if (curr.localName === 'slot') {
      const assignedElements = (curr as HTMLSlotElement).assignedElements()

      for (const assignedElement of assignedElements) {
        focusableEls = focusableEls.concat(
          getFocusableChildren(assignedElement)
        )
      }
    }

    // Or else check this element’s subtree for focusable children
    else {
      focusableEls = focusableEls.concat(getFocusableChildren(curr))
    }
  }

  return focusableEls
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
