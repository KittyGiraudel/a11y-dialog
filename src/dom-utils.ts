import focusableSelectors from 'focusable-selectors'

/**
 * Set the focus to the first element with `autofocus` with the element or the
 * element itself.
 */
export function focus(el: HTMLElement) {
  ;(el.querySelector<HTMLElement>('[autofocus]') || el).focus()
}

/**
 * Get the first and last focusable elements within a given element.
 */
export function getFocusableEdges(el: HTMLElement) {
  // Check for a focusable element within the subtree of the given element.
  const firstEl = findFocusableEl(el, true)

  // Only if we find the first element do we need to look for the last one. If
  // there’s no last element, we set `lastEl` as a reference to `firstEl` so
  // that the returned array is still always of length 2.
  const lastEl = firstEl ? findFocusableEl(el, false) || firstEl : null

  return [firstEl, lastEl] as const
}

/**
 * Find the first focusable element inside the given element if `forward` is
 * truthy or the last focusable element otherwise.
 */
function findFocusableEl(
  el: HTMLElement,
  forward: boolean
): HTMLElement | null {
  // If we’re walking forward, check if this element is focusable, and return it
  // immediately if it is.
  if (forward && isFocusable(el)) return el

  // We should only search the subtree of this element if it can have focusable
  // children.
  if (canHaveFocusableChildren(el)) {
    // Start walking the DOM tree, looking for focusable elements.
    // Case 1: If this element has a shadow root, search it recursively.
    if (el.shadowRoot) {
      // Descend into this subtree.
      let next = getNextChildEl(el.shadowRoot, forward)

      // Traverse the siblings, searching the subtree of each one for focusable
      // elements.
      while (next) {
        const focusableEl = findFocusableEl(next as HTMLElement, forward)
        if (focusableEl) return focusableEl
        next = getNextSiblingEl(next as HTMLElement, forward)
      }
    }

    // Case 2: If this element is a slot for a Custom Element, search its
    // assigned elements recursively.
    else if (el.localName === 'slot') {
      const assignedElements = (el as HTMLSlotElement).assignedElements({
        flatten: true,
      }) as HTMLElement[]
      if (!forward) assignedElements.reverse()

      for (const assignedElement of assignedElements) {
        const focusableEl = findFocusableEl(assignedElement, forward)
        if (focusableEl) return focusableEl
      }
    }
    // Case 3: this is a regular Light DOM element. Search its subtree.
    else {
      // Descend into this subtree.
      let next = getNextChildEl(el, forward)

      // Traverse siblings, searching the subtree of each one
      // for focusable elements.
      while (next) {
        const focusableEl = findFocusableEl(next as HTMLElement, forward)
        if (focusableEl) return focusableEl
        next = getNextSiblingEl(next as HTMLElement, forward)
      }
    }
  }

  // If we’re walking backward, we want to check the element’s entire subtree
  // before checking the element itself. If this element is focusable, return
  // it.
  if (!forward && isFocusable(el)) return el

  return null
}

function getNextChildEl(el: ParentNode, forward: boolean) {
  return forward ? el.firstElementChild : el.lastElementChild
}

function getNextSiblingEl(el: HTMLElement, forward: boolean) {
  return forward ? el.nextElementSibling : el.previousElementSibling
}

/**
 * Determine if an element is hidden from the user.
 */
const isHidden = (el: HTMLElement) => {
  // Browsers hide all non-<summary> descendants of closed <details> elements
  // from user interaction, but those non-<summary> elements may still match our
  // focusable-selectors and may still have dimensions, so we need a special
  // case to ignore them.
  if (
    el.matches('details:not([open]) *') &&
    !el.matches('details>summary:first-of-type')
  )
    return true

  // If this element has no painted dimensions, it's hidden.
  return !(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
}

/**
 * Determine if an element is focusable and has user-visible painted dimensions.
 */
const isFocusable = (el: HTMLElement) => {
  // A shadow host that delegates focus will never directly receive focus,
  // even with `tabindex=0`. Consider our <fancy-button> custom element, which
  // delegates focus to its shadow button:
  //
  // <fancy-button tabindex="0">
  //  #shadow-root
  //  <button><slot></slot></button>
  // </fancy-button>
  //
  // The browser acts as as if there is only one focusable element – the shadow
  // button. Our library should behave the same way.
  if (el.shadowRoot?.delegatesFocus) return false

  return el.matches(focusableSelectors.join(',')) && !isHidden(el)
}

/**
 * Determine if an element can have focusable children. Useful for bailing out
 * early when walking the DOM tree.
 * @example
 * This div is inert, so none of its children can be focused, even though they
 * meet our criteria for what is focusable. Once we check the div, we can skip
 * the rest of the subtree.
 * ```html
 * <div inert>
 *   <button>Button</button>
 *   <a href="#">Link</a>
 * </div>
 * ```
 */
function canHaveFocusableChildren(el: HTMLElement) {
  // The browser will never send focus into a Shadow DOM if the host element
  // has a negative tabindex. This applies to both slotted Light DOM Shadow DOM
  // children
  if (el.shadowRoot && el.getAttribute('tabindex') === '-1') return false

  // Elemments matching this selector are either hidden entirely from the user,
  // or are visible but unavailable for interaction. Their descentants can never
  // receive focus.
  return !el.matches(':disabled,[hidden],[inert]')
}

/**
 * Get the active element, accounting for Shadow DOM subtrees.
 * @author Cory LaViska
 * @see: https://www.abeautifulsite.net/posts/finding-the-active-element-in-a-shadow-root/
 */
export function getActiveEl(
  root: Document | ShadowRoot = document
): Element | null {
  const activeEl = root.activeElement

  if (!activeEl) return null

  // If there’s a shadow root, recursively find the active element within it.
  // If the recursive call returns null, return the active element
  // of the top-level Document.
  if (activeEl.shadowRoot)
    return getActiveEl(activeEl.shadowRoot) || document.activeElement

  // If not, we can just return the active element
  return activeEl
}

/**
 * Trap the focus inside the given element
 */
export function trapTabKey(el: HTMLElement, event: KeyboardEvent) {
  const [firstFocusableEl, lastFocusableEl] = getFocusableEdges(el)

  // If there are no focusable children in the dialog, prevent the user from
  // tabbing out of it
  if (!firstFocusableEl) return event.preventDefault()

  const activeEl = getActiveEl()

  // If the SHIFT key is pressed while tabbing (moving backwards) and the
  // currently focused item is the first one, move the focus to the last
  // focusable item from the dialog element
  if (event.shiftKey && activeEl === firstFocusableEl) {
    // @ts-ignore: we know that `lastFocusableEl` is not null here
    lastFocusableEl.focus()
    event.preventDefault()
  }

  // If the SHIFT key is not pressed (moving forwards) and the currently focused
  // item is the last one, move the focus to the first focusable item from the
  // dialog element
  else if (!event.shiftKey && activeEl === lastFocusableEl) {
    firstFocusableEl.focus()
    event.preventDefault()
  }
}

/**
 * Find the closest element to the given element matching the given selector,
 * accounting for Shadow DOM subtrees.
 * @author Louis St-Amour
 * @see: https://stackoverflow.com/a/56105394
 */
export function closest(selector: string, base: Element | null) {
  function from(el: Element | Window | Document | null): Element | null {
    if (!el || el === document || el === window) return null
    // Reading the `assignedSlot` property from the element (as suggested by the
    // aforementioned StackOverflow answer) is not enough, because it does not
    // take into consideration elements nested deeply within a <slot>. For these
    // elements, the `assignedSlot` property is `null` as it is only specified
    // for top-level elements within a <slot>. To still find the closest <slot>,
    // we walk up the tree looking for the `assignedSlot` property.
    const slot = findAssignedSlot(el as Element)
    if (slot) el = slot
    return (
      (el as Element).closest(selector) ||
      from(((el as Element).getRootNode() as ShadowRoot).host)
    )
  }

  return from(base)
}

function findAssignedSlot(node: Element): Element | null {
  return (
    node.assignedSlot ||
    (node.parentNode ? findAssignedSlot(node.parentNode as Element) : null)
  )
}