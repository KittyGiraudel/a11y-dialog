import {
  getActiveElement,
  moveFocusToDialog,
  trapTabKey,
  closest,
} from './dom-utils'

export type A11yDialogEvent = 'show' | 'hide' | 'destroy'
export type A11yDialogInstance = InstanceType<typeof A11yDialog>

export default class A11yDialog {
  private $el: HTMLElement
  private id: string
  private previouslyFocused: HTMLElement | null

  public shown: boolean

  constructor(element: HTMLElement) {
    this.$el = element
    this.id = this.$el.getAttribute('data-a11y-dialog') || this.$el.id
    this.previouslyFocused = null
    this.shown = false

    this.maintainFocus = this.maintainFocus.bind(this)
    this.bindKeypress = this.bindKeypress.bind(this)
    this.handleTriggerClicks = this.handleTriggerClicks.bind(this)

    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)

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
  public destroy(): A11yDialogInstance {
    // Hide the dialog to avoid destroying an open instance
    this.hide()

    // Remove the click event delegates for our openers and closers
    document.removeEventListener('click', this.handleTriggerClicks, true)

    // Clone and replace the dialog element to prevent memory leaks caused by
    // event listeners that the author might not have cleaned up.
    this.$el.replaceWith(this.$el.cloneNode(true))

    // Dispatch a `destroy` event
    this.fire('destroy')

    return this
  }

  /**
   * Show the dialog element, trap the current focus within it, listen for some
   * specific key presses and fire all registered callbacks for `show` event
   */
  public show(event?: Event): A11yDialogInstance {
    // If the dialog is already open, abort
    if (this.shown) return this

    // Keep a reference to the currently focused element to be able to restore
    // it later
    this.shown = true
    this.$el.removeAttribute('aria-hidden')
    this.previouslyFocused = getActiveElement() as HTMLElement

    // Due to a long lasting bug in Safari, clicking an interactive element
    // (like a <button>) does *not* move the focus to that element, which means
    // `document.activeElement` is whatever element is currently focused (like
    // an <input>), or the <body> element otherwise. We can work around that
    // problem by checking whether the focused element is the <body>, and if it,
    // store the click event target.
    // See: https://bugs.webkit.org/show_bug.cgi?id=22261
    if (this.previouslyFocused?.tagName === 'BODY' && event?.target) {
      this.previouslyFocused = event.target as HTMLElement
    }

    // Set the focus to the dialog element
    // See: https://github.com/KittyGiraudel/a11y-dialog/pull/583
    if (event?.type === 'focus') {
      this.maintainFocus(event as FocusEvent)
    } else {
      moveFocusToDialog(this.$el)
    }

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
  public hide(event?: Event): A11yDialogInstance {
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
  public on(
    type: A11yDialogEvent,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): A11yDialogInstance {
    this.$el.addEventListener(type, handler, options)

    return this
  }

  /**
   * Unregister an existing callback for the given event type
   */
  public off(
    type: A11yDialogEvent,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): A11yDialogInstance {
    this.$el.removeEventListener(type, handler, options)

    return this
  }

  /**
   * Dispatch a custom event from the DOM element associated with this dialog.
   * This allows authors to listen for and respond to the events in their own
   * code
   */
  private fire(type: A11yDialogEvent, event?: Event) {
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
  private handleTriggerClicks(event: Event) {
    // This is a bit clumsy, but basically we want to account for being inside
    // a web component *and* the target being a web component itself. In the
    // 1st case, `event.target` ends up being the shadow root, so we need to use
    // `event.composedPath()[0]` to get the actual click target. However in the
    // case where the clicked element is a custom element (e.g. `<my-button>`),
    // `event.composedPath()[0]` ends up being a `<slot>` element
    // See: https://github.com/KittyGiraudel/a11y-dialog/issues/582
    const target = [event.composedPath()[0], event.target].find(
      node => (node as HTMLElement)?.tagName !== 'SLOT'
    ) as HTMLElement

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
  private bindKeypress(event: KeyboardEvent) {
    // This is an escape hatch in case there are nested open dialogs, so that
    // only the top most dialog gets interacted with (`closest` is basically
    // `Element.prototype.closest()` accounting for Shadow DOM subtrees)
    if (closest('[aria-modal="true"]', getActiveElement()) !== this.$el) {
      return
    }

    let hasOpenPopover = false
    try {
      hasOpenPopover = !!this.$el.querySelector(
        '[popover]:not([popover="manual"]):popover-open'
      )
    } catch {
      // Run that DOM query in a try/catch because not all browsers support the
      // `:popover-open` selector, which would cause the whole expression to
      // fail
      // See: https://caniuse.com/mdn-css_selectors_popover-open
      // See: https://github.com/KittyGiraudel/a11y-dialog/pull/578#discussion_r1343215149
    }

    // If the dialog is shown and the ESC key is pressed, prevent any further
    // effects from the ESC key and hide the dialog, unless:
    // - its role is `alertdialog`, which means it should be modal
    // - or it contains an open popover, in which case ESC should close it
    if (
      event.key === 'Escape' &&
      this.$el.getAttribute('role') !== 'alertdialog' &&
      !hasOpenPopover
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
  private maintainFocus(event: FocusEvent) {
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
