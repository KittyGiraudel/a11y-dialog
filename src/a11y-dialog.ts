import focusableSelectors from 'focusable-selectors'

export type A11yDialogEvent = 'show' | 'hide' | 'destroy'
export type A11yDialogInstance = InstanceType<typeof A11yDialog>

export default class A11yDialog {
  private $el: HTMLElement
  private id: string
  private previouslyFocused: HTMLElement | null = null

  public shown = false

  constructor(element: HTMLElement) {
    this.$el = element
    this.id = this.$el.getAttribute('data-a11y-dialog') || this.$el.id

    this.$el.setAttribute('aria-hidden', 'true')
    this.$el.setAttribute('aria-modal', 'true')
    this.$el.setAttribute('tabindex', '-1')

    if (!this.$el.hasAttribute('role')) {
      this.$el.setAttribute('role', 'dialog')
    }

    document.addEventListener('click', this.handleTriggerClicks, true)
  }

  /**
   * Destroy the current instance (after making sure the dialog has been hidden)
   * and remove all associated listeners from dialog openers and closers
   */
  public destroy = (): A11yDialogInstance => {
    // Hide the dialog to avoid destroying an open instance
    this.hide()

    // Remove the click event delegates for our openers and closers
    document.removeEventListener('click', this.handleTriggerClicks, true)

    // Dispatch a `destroy` event
    this.fire('destroy')

    return this
  }

  /**
   * Show the dialog element, trap the current focus within it, listen for some
   * specific key presses and fire all registered callbacks for `show` event
   */
  public show = (event?: Event): A11yDialogInstance => {
    // If the dialog is already open, abort
    if (this.shown) return this

    // Keep a reference to the currently focused element to be able to restore
    // it later
    this.previouslyFocused = getActiveElement() as HTMLElement
    this.shown = true
    this.$el.removeAttribute('aria-hidden')

    // Set the focus to the dialog element
    moveFocusToDialog(this.$el)

    // Bind a focus event listener to the body element to make sure the focus
    // stays trapped inside the dialog while open, and start listening for some
    // specific key presses (TAB and ESC)
    document.body.addEventListener('focus', this.maintainFocus, true)
    this.$el.addEventListener('keydown', this.bindKeypress, true)

    // Dispatch a `show` event
    this.fire('show', event)

    return this
  }

  /**
   * Hide the dialog element, restore the focus to the previously active
   * element, stop listening for some specific key presses and fire all
   * registered callbacks for `hide` event
   */
  public hide = (event?: Event): A11yDialogInstance => {
    // If the dialog is already closed, abort
    if (!this.shown) return this

    this.shown = false
    this.$el.setAttribute('aria-hidden', 'true')
    this.previouslyFocused?.focus?.()

    // Remove the focus event listener to the body element and stop listening
    // for specific key presses
    document.body.removeEventListener('focus', this.maintainFocus, true)
    this.$el.removeEventListener('keydown', this.bindKeypress, true)

    // Dispatch a `hide` event
    this.fire('hide', event)

    return this
  }

  /**
   * Register a new callback for the given event type
   */
  public on = (
    type: A11yDialogEvent,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): A11yDialogInstance => {
    this.$el.addEventListener(type, handler, options)

    return this
  }

  /**
   * Unregister an existing callback for the given event type
   */
  public off = (
    type: A11yDialogEvent,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): A11yDialogInstance => {
    this.$el.removeEventListener(type, handler, options)

    return this
  }

  /**
   * Dispatch a custom event from the DOM element associated with this dialog.
   * This allows authors to listen for and respond to the events in their own
   * code
   */
  private fire = (type: A11yDialogEvent, event?: Event) => {
    this.$el.dispatchEvent(
      new CustomEvent(type, {
        detail: event,
        cancelable: true,
      })
    )
  }

  /**
   * Add a delegated event listener for when elememts that open or close the
   * dialog are clicked, and call `show` or `hide`, respectively
   */
  private handleTriggerClicks = (event: Event) => {
    const target = event.target as HTMLElement

    // We use `.closest(..)` and not `.matches(..)` here so that clicking
    // an element nested within a dialog opener does cause the dialog to open
    if (target.closest(`[data-a11y-dialog-show="${this.id}"]`)) {
      this.show(event)
    }

    if (
      target.closest(`[data-a11y-dialog-hide="${this.id}"]`) ||
      (target.closest('[data-a11y-dialog-hide]') &&
        target.closest('[aria-modal="true"]') === this.$el)
    ) {
      this.hide(event)
    }
  }

  /**
   * Private event handler used when listening to some specific key presses
   * (namely ESC and TAB)
   */
  private bindKeypress = (event: KeyboardEvent) => {
    // This is an escape hatch in case there are nested open dialogs, so that
    // only the top most dialog gets interacted with
    if (document.activeElement?.closest('[aria-modal="true"]') !== this.$el) {
      return
    }

    // If the dialog is shown and the ESC key is pressed, prevent any further
    // effects from the ESC key and hide the dialog, unless its role is
    // `alertdialog`, which should be modal
    if (
      event.key === 'Escape' &&
      this.$el.getAttribute('role') !== 'alertdialog'
    ) {
      event.preventDefault()
      this.hide(event)
    }

    // If the dialog is shown and the TAB key is pressed, make sure the focus
    // stays trapped within the dialog element
    if (event.key === 'Tab') {
      trapTabKey(this.$el, event)
    }
  }

  /**
   * If the dialog is shown and the focus is not within a dialog element (either
   * this one or another one in case of nested dialogs) or attribute, move it
   * back to the dialog container
   * See: https://github.com/KittyGiraudel/a11y-dialog/issues/177
   */
  private maintainFocus = (event: FocusEvent) => {
    const target = event.target as HTMLElement

    if (
      !target.closest(
        '[aria-modal="true"], [data-a11y-dialog-ignore-focus-trap]'
      )
    ) {
      moveFocusToDialog(this.$el)
    }
  }
}

/**
 * Query the DOM for elements matching the given selector, scoped to context (or
 * the whole document)
 */
function $$(selector: string, context: ParentNode = document): HTMLElement[] {
  return Array.prototype.slice.call(context.querySelectorAll(selector))
}

/**
 * Set the focus to the first element with `autofocus` with the element or the
 * element itself
 */
function moveFocusToDialog(el: HTMLElement) {
  const focused = (el.querySelector('[autofocus]') || el) as HTMLElement

  focused.focus()
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

/**
 * Get focusable children by recursively traversing the subtree of the given
 * element, while accounting for Shadow DOM subtrees
 */
function getFocusableChildren(el: ParentNode): HTMLElement[] {
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
function isFocusable(el: HTMLElement) {
  return (
    el.matches(focusableSelectors.join(',')) &&
    !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
  )
}

/**
 * Trap the focus inside the given element
 */
function trapTabKey(el: HTMLElement, event: KeyboardEvent) {
  const focusableChildren = getFocusableChildren(el)
  const firstFocusableChild = focusableChildren[0]
  const lastFocusableChild = focusableChildren[focusableChildren.length - 1]

  const activeElement = getActiveElement()

  // If the SHIFT key is pressed while tabbing (moving backwards) and the
  // currently focused item is the first one, move the focus to the last
  // focusable item from the dialog element
  if (event.shiftKey && activeElement === firstFocusableChild) {
    lastFocusableChild.focus()
    event.preventDefault()
  }

  // If the SHIFT key is not pressed (moving forwards) and the currently focused
  // item is the last one, move the focus to the first focusable item from the
  // dialog element
  else if (!event.shiftKey && activeElement === lastFocusableChild) {
    firstFocusableChild.focus()
    event.preventDefault()
  }
}

// Get the active element, accounting for Shadow DOM subtrees.
// Credit to Cory LaViska for this implementation
// @see: https://www.abeautifulsite.net/posts/finding-the-active-element-in-a-shadow-root/
function getActiveElement(
  root: Document | ShadowRoot = document
): Element | null {
  const activeEl = root.activeElement

  if (!activeEl) {
    return null
  }

  // If there's a shadow root, recursively look for the active element within it
  if (activeEl.shadowRoot) {
    return getActiveElement(activeEl.shadowRoot)
    // If not, we can just return the active element
  } else {
    return activeEl
  }
}

function instantiateDialogs() {
  $$('[data-a11y-dialog]').forEach(el => new A11yDialog(el))
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', instantiateDialogs)
  } else {
    instantiateDialogs()
  }
}

// TypeScript doesn’t know about the `inert` attribute/property yet; this
// declaration extends the `HTMLElement` interface to include it
declare global {
  interface HTMLElement {
    inert: boolean
  }
}
