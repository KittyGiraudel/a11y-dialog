import focusableSelectors from 'focusable-selectors'

const TAB_KEY = 'Tab'
const ESCAPE_KEY = 'Escape'

export type A11yDialogEvent = 'show' | 'hide' | 'destroy' | 'create'
export type A11yDialogInstance = InstanceType<typeof A11yDialog>
export type A11yDialogEventHandler = (node: Element, event?: Event) => void

type ListenersRecord = Partial<
  Record<A11yDialogEvent, A11yDialogEventHandler[]>
>

export default class A11yDialog {
  private $el: HTMLElement
  private id: string
  private openers: HTMLElement[]
  private closers: HTMLElement[]
  private listeners: ListenersRecord = {}
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

    // Keep a collection of dialog openers, each of which will be bound a click
    // event listener to open the dialog
    this.openers = $$(`[data-a11y-dialog-show="${this.id}"]`)
    this.openers.forEach(opener => {
      opener.addEventListener('click', this.show)
    })

    // Keep a collection of dialog closers, each of which will be bound a click
    // event listener to close the dialog
    this.closers = $$(
      `[data-a11y-dialog="${this.id}"] [data-a11y-dialog-hide], #${this.id} [data-a11y-dialog-hide], [data-a11y-dialog-hide="${this.id}"]`
    )
    this.closers.forEach(closer => {
      closer.addEventListener('click', this.hide)
    })
  }

  /**
   * Destroy the current instance (after making sure the dialog has been hidden)
   * and remove all associated listeners from dialog openers and closers
   */
  public destroy = (): A11yDialogInstance => {
    // Hide the dialog to avoid destroying an open instance
    this.hide()

    // Remove the click event listener from all dialog openers
    this.openers.forEach(opener => {
      opener.removeEventListener('click', this.show)
    })

    // Remove the click event listener from all dialog closers
    this.closers.forEach(closer => {
      closer.removeEventListener('click', this.hide)
    })

    // Execute all callbacks registered for the `destroy` event
    this.fire('destroy')

    // Empty the listeners map
    this.listeners = {}

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
    this.previouslyFocused = document.activeElement as HTMLElement
    this.shown = true
    this.$el.removeAttribute('aria-hidden')

    // Set the focus to the dialog element
    moveFocusToDialog(this.$el)

    // Bind a focus event listener to the body element to make sure the focus
    // stays trapped inside the dialog while open, and start listening for some
    // specific key presses (TAB and ESC)
    document.body.addEventListener('focus', this.maintainFocus, true)
    document.addEventListener('keydown', this.bindKeypress)

    // Execute all callbacks registered for the `show` event
    this.fire('show', event)

    return this
  }

  /**
   * Hide the dialog element, restore the focus to the previously
   * active element, stop listening for some specific key presses
   * and fire all registered callbacks for `hide` event.
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
    document.removeEventListener('keydown', this.bindKeypress)

    // Execute all callbacks registered for the `hide` event
    this.fire('hide', event)

    return this
  }

  /**
   * Register a new callback for the given event type
   */
  public on = (
    type: A11yDialogEvent,
    handler: A11yDialogEventHandler
  ): A11yDialogInstance => {
    const listenersForType = this.listeners[type] || []
    listenersForType.push(handler)

    return this
  }

  /**
   * Unregister an existing callback for the given event type
   */
  public off = (
    type: A11yDialogEvent,
    handler: A11yDialogEventHandler
  ): A11yDialogInstance => {
    const listenersForType = this.listeners[type] || []
    const index = listenersForType.indexOf(handler)

    if (index > -1) listenersForType.splice(index, 1)

    return this
  }

  /**
   * Iterate over all registered handlers for given type and call them all with
   * the dialog element as first argument, event as second argument (if any).
   * Also dispatch a custom event on the DOM element itself to make it
   * possible to react to the lifecycle of auto-instantiated dialogs.
   */
  private fire = (type: A11yDialogEvent, event?: Event) => {
    const listenersForType = this.listeners[type] || []
    const domEvent = new CustomEvent(type, { detail: event })

    this.$el.dispatchEvent(domEvent)
    listenersForType.forEach(listener => listener(this.$el, event))
  }

  /**
   * Private event handler used when listening to some specific key presses
   * (namely ESC and TAB)
   */
  private bindKeypress = (event: KeyboardEvent) => {
    // This is an escape hatch in case there are nested dialogs,
    // so the keypresses are only reacted to for the most recent one
    if (!this.$el.contains(document.activeElement)) return

    // If the dialog is shown and the ESC key is pressed, prevent any further
    // effects from the ESC key and hide the dialog, unless its role is
    // `alertdialog`, which should be modal
    if (
      this.shown &&
      event.key === ESCAPE_KEY &&
      this.$el.getAttribute('role') !== 'alertdialog'
    ) {
      event.preventDefault()
      this.hide(event)
    }

    // If the dialog is shown and the TAB key is pressed, make sure the focus
    // stays trapped within the dialog element
    if (this.shown && event.key === TAB_KEY) {
      trapTabKey(this.$el, event)
    }
  }

  /**
   * If the dialog is shown and the focus is not within a dialog element
   * (either this one or another one in case of nested dialogs) or
   * attribute, move it back to the dialog container.
   * See: https://github.com/KittyGiraudel/a11y-dialog/issues/177
   */
  private maintainFocus = (event: FocusEvent) => {
    if (!this.shown) return

    const target = event.target as HTMLElement

    if (
      !target.closest('[aria-modal="true"]') &&
      !target.closest('[data-a11y-dialog-ignore-focus-trap]')
    )
      moveFocusToDialog(this.$el)
  }
}

/**
 * Query the DOM for nodes matching the given selector, scoped to context (or
 * the whole document)
 */
function $$(selector: string, context: ParentNode = document): HTMLElement[] {
  return Array.prototype.slice.call(context.querySelectorAll(selector))
}

/**
 * Set the focus to the first element with `autofocus` with the element or the
 * element itself
 */
function moveFocusToDialog(node: HTMLElement) {
  const focused = (node.querySelector('[autofocus]') || node) as HTMLElement

  focused.focus()
}

/**
 * Get the focusable children of the given element.
 */
function getFocusableChildren(node: HTMLElement): HTMLElement[] {
  return $$(focusableSelectors.join(','), node).filter(
    child =>
      !!(
        child.offsetWidth ||
        child.offsetHeight ||
        child.getClientRects().length
      )
  )
}

/**
 * Trap the focus inside the given element.
 */
function trapTabKey(node: HTMLElement, event: KeyboardEvent) {
  const focusableChildren = getFocusableChildren(node)
  const focusedItemIndex = focusableChildren.indexOf(
    document.activeElement as HTMLElement
  )

  // If the SHIFT key is pressed while tabbing (moving backwards) and the
  // currently focused item is the first one, move the focus to the last
  // focusable item from the dialog element
  if (event.shiftKey && focusedItemIndex === 0) {
    focusableChildren[focusableChildren.length - 1].focus()
    event.preventDefault()

    // If the SHIFT key is not pressed (moving forwards) and the currently
    // focused item is the last one, move the focus to the first focusable item
    // from the dialog element
  } else if (
    !event.shiftKey &&
    focusedItemIndex === focusableChildren.length - 1
  ) {
    focusableChildren[0].focus()
    event.preventDefault()
  }
}

function instantiateDialogs() {
  $$('[data-a11y-dialog]').forEach(node => new A11yDialog(node))
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', instantiateDialogs)
  } else {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(instantiateDialogs)
    } else {
      window.setTimeout(instantiateDialogs, 16)
    }
  }
}
