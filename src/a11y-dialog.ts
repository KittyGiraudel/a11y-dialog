import { closest, focus, getActiveEl, trapTabKey } from './dom-utils.js'

/**
 * Names of the custom events emitted by an `A11yDialog` instance.
 *
 * Each event is dispatched as a `CustomEvent` from the dialog element. The
 * original DOM event that triggered the dialog change (for example a click or
 * key press) is exposed on `event.detail`.
 *
 * - `'show'`: fired when the dialog is requested to open
 * - `'hide'`: fired when the dialog is requested to close
 * - `'destroy'`: fired when the instance is about to be destroyed
 *
 * All events are cancelable: calling `event.preventDefault()` inside a
 * listener will prevent the default behavior (opening, closing or destroying
 * the dialog).
 */
export type A11yDialogEvent = 'show' | 'hide' | 'destroy'

/**
 * Convenience type alias for the public `A11yDialog` instance.
 *
 * Useful when you want to store or pass around a reference to an instance
 * created with `new A11yDialog(...)`.
 */
export type A11yDialogInstance = InstanceType<typeof A11yDialog>

const SCOPE = 'data-a11y-dialog'

/**
 * Controls an accessible modal dialog bound to a single DOM element.
 *
 * An instance:
 * - Initialises the dialog element with the required HTML attributes
 *   (`aria-hidden`, `aria-modal`, `role="dialog"` by default, and `tabindex`).
 * - Keeps track of the element that had focus before the dialog was opened and
 *   restores focus when the dialog is closed.
 * - Traps focus within the dialog while it is open and closes it with the ESC
 *   key (except when `role="alertdialog"` or when an opened popover is
 *   present).
 * - Delegates click handling for openers and closers declared with
 *   `[data-a11y-dialog-show]` and `[data-a11y-dialog-hide]` attributes,
 *   including elements inside Shadow DOM trees.
 *
 * The dialog starts hidden (`aria-hidden="true"`). Call `show()` or activate an
 * opener to display it.
 */
export default class A11yDialog {
  private $el: HTMLElement
  private id: string
  private previouslyFocused: HTMLElement | null

  /**
   * Whether this dialog is currently shown.
   *
   * This flag is updated by `show()` and `hide()` and should be treated as
   * read-only by consumers.
   */
  public shown: boolean

  /**
   * Create a new `A11yDialog` controller for the given dialog element.
   *
   * The element must either:
   * - have a unique `id`, or
   * - define a `data-a11y-dialog` attribute whose value is used as the
   *   instance identifier.
   *
   * That identifier is referenced by opener and closer elements using
   * `[data-a11y-dialog-show="<id>"]` and `[data-a11y-dialog-hide="<id>"]`.
   */
  constructor(element: HTMLElement) {
    this.$el = element
    this.id = this.$el.getAttribute(SCOPE) || this.$el.id
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
  public destroy() {
    // Dispatch a `destroy` event
    const destroyEvent = this.fire('destroy')

    // If the event was prevented, do not continue with the normal behavior
    if (destroyEvent.defaultPrevented) return this

    // Hide the dialog to avoid destroying an open instance
    this.hide()

    // Remove the click event delegates for our openers and closers
    document.removeEventListener('click', this.handleTriggerClicks, true)

    // Clone and replace the dialog element to prevent memory leaks caused by
    // event listeners that the author might not have cleaned up.
    this.$el.replaceWith(this.$el.cloneNode(true))

    return this
  }

  /**
   * Show the dialog.
   *
   * This:
   * - updates ARIA attributes on the dialog (`aria-hidden` is removed),
   * - remembers the previously focused element to restore it on `hide()`,
   * - moves focus into the dialog (or maintains it when opened via a focus
   *   event),
   * - starts trapping focus within the dialog, and
   * - dispatches a cancelable `'show'` `CustomEvent` from the dialog element.
   *
   * If a listener for the `'show'` event calls `event.preventDefault()`, the
   * dialog will not be opened.
   *
   * Returns the instance to allow method chaining.
   */
  public show(event?: Event) {
    // If the dialog is already open, abort
    if (this.shown) return this

    // Dispatch a `show` event
    const showEvent = this.fire('show', event)

    // If the event was prevented, do not continue with the normal behavior
    if (showEvent.defaultPrevented) return this

    // Keep a reference to the currently focused element to be able to restore
    // it later
    this.shown = true
    this.$el.removeAttribute('aria-hidden')
    this.previouslyFocused = getActiveEl() as HTMLElement

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
      this.maintainFocus()
    } else {
      focus(this.$el)
    }

    // Bind a focus event listener to the body element to make sure the focus
    // stays trapped inside the dialog while open, and start listening for some
    // specific key presses (TAB and ESC)
    document.body.addEventListener('focus', this.maintainFocus, true)
    this.$el.addEventListener('keydown', this.bindKeypress, true)

    return this
  }

  /**
   * Hide the dialog.
   *
   * This:
   * - sets `aria-hidden="true"` on the dialog,
   * - stops trapping focus and key listeners associated with this instance, and
   * - restores focus to the element that was active before `show()` was called
   *   (when possible).
   *
   * A cancelable `'hide'` `CustomEvent` is dispatched before closing. If a
   * listener calls `event.preventDefault()`, the dialog will remain open.
   *
   * Returns the instance to allow method chaining.
   */
  public hide(event?: Event) {
    // If the dialog is already closed, abort
    if (!this.shown) return this

    // Dispatch a `hide` event
    const hideEvent = this.fire('hide', event)

    // If the event was prevented, do not continue with the normal behavior
    if (hideEvent.defaultPrevented) return this

    this.shown = false
    this.$el.setAttribute('aria-hidden', 'true')

    // Remove the focus event listener to the body element and stop listening
    // for specific key presses
    document.body.removeEventListener('focus', this.maintainFocus, true)
    this.$el.removeEventListener('keydown', this.bindKeypress, true)

    // Ensure the previously focused element (if any) has a `focus` method
    // before attempting to call it to account for SVG elements
    // See: https://github.com/KittyGiraudel/a11y-dialog/issues/108
    this.previouslyFocused?.focus?.()

    return this
  }

  /**
   * Register a new callback for the given event type
   */
  public on(
    type: A11yDialogEvent,
    handler: EventListener,
    options?: AddEventListenerOptions
  ) {
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
  ) {
    this.$el.removeEventListener(type, handler, options)

    return this
  }

  /**
   * Dispatch and return a custom event from the DOM element associated with
   * this dialog; this allows authors to listen for and respond to the events
   * in their own code
   */
  private fire(type: A11yDialogEvent, event?: Event) {
    const customEvent = new CustomEvent(type, {
      detail: event,
      cancelable: true,
    })

    this.$el.dispatchEvent(customEvent)

    return customEvent
  }

  /**
   * Add a delegated event listener for when elememts that open or close the
   * dialog are clicked, and call `show` or `hide`, respectively
   */
  private handleTriggerClicks(event: Event) {
    // We need to retrieve the click target while accounting for Shadow DOM.
    // When within a web component, `event.target` is the shadow root (e.g.
    // `<my-dialog>`), so we need to use `event.composedPath()` to get the click
    // target
    // See: https://github.com/KittyGiraudel/a11y-dialog/issues/582
    const target = event.composedPath()[0] as HTMLElement
    const opener = closest(`[${SCOPE}-show="${this.id}"]`, target)
    const explicitCloser = closest(`[${SCOPE}-hide="${this.id}"]`, target)
    const implicitCloser =
      closest(`[${SCOPE}-hide]`, target) &&
      closest('[aria-modal="true"]', target) === this.$el

    // We use `closest(..)` (instead of `matches(..)`) so that clicking an
    // element nested within a dialog opener does cause the dialog to open, and
    // we use our custom `closest(..)` function so that it can cross shadow
    // boundaries
    // See: https://github.com/KittyGiraudel/a11y-dialog/issues/712
    if (opener) this.show(event)
    if (explicitCloser || implicitCloser) this.hide(event)
  }

  /**
   * Private event handler used when listening to some specific key presses
   * (namely ESC and TAB)
   */
  private bindKeypress(event: KeyboardEvent) {
    // This is an escape hatch in case there are nested open dialogs, so that
    // only the top most dialog gets interacted with (`closest` is basically
    // `Element.prototype.closest()` accounting for Shadow DOM subtrees)
    if (closest('[aria-modal="true"]', getActiveEl()) !== this.$el) {
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
   * this one or another one in case of nested dialogs) or an element with the
   * ignore attribute, move it back to the dialog container
   * See: https://github.com/KittyGiraudel/a11y-dialog/issues/177
   */
  private maintainFocus() {
    // We use `getActiveEl()` and not `event.target` here because the latter can
    // be a shadow root. This can happen when having a focusable element after
    // slotted content: tabbing out of it causes this focus listener to trigger
    // with the shadow root as a target event. In such a case, the focus would
    // be incorrectly moved to the dialog, which shouldn’t happen. Getting the
    // active element (while accounting for Shadow DOM) avoids that problem.
    // See: https://github.com/KittyGiraudel/a11y-dialog/issues/778
    const target = getActiveEl()

    if (!closest(`[aria-modal="true"], [${SCOPE}-ignore-focus-trap]`, target)) {
      focus(this.$el)
    }
  }
}
