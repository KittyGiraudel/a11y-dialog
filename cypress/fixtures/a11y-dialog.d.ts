export type A11yDialogEvent = 'show' | 'hide' | 'destroy';
export type A11yDialogInstance = InstanceType<typeof A11yDialog>;
export default class A11yDialog {
    private $el;
    private id;
    private previouslyFocused;
    shown: boolean;
    constructor(element: HTMLElement);
    /**
     * Destroy the current instance (after making sure the dialog has been hidden)
     * and remove all associated listeners from dialog openers and closers
     */
    destroy(): A11yDialogInstance;
    /**
     * Show the dialog element, trap the current focus within it, listen for some
     * specific key presses and fire all registered callbacks for `show` event
     */
    show(event?: Event): A11yDialogInstance;
    /**
     * Hide the dialog element, restore the focus to the previously active
     * element, stop listening for some specific key presses and fire all
     * registered callbacks for `hide` event
     */
    hide(event?: Event): A11yDialogInstance;
    /**
     * Register a new callback for the given event type
     */
    on(type: A11yDialogEvent, handler: EventListener, options?: AddEventListenerOptions): A11yDialogInstance;
    /**
     * Unregister an existing callback for the given event type
     */
    off(type: A11yDialogEvent, handler: EventListener, options?: AddEventListenerOptions): A11yDialogInstance;
    /**
     * Dispatch a custom event from the DOM element associated with this dialog.
     * This allows authors to listen for and respond to the events in their own
     * code
     */
    private fire;
    /**
     * Add a delegated event listener for when elememts that open or close the
     * dialog are clicked, and call `show` or `hide`, respectively
     */
    private handleTriggerClicks;
    /**
     * Private event handler used when listening to some specific key presses
     * (namely ESC and TAB)
     */
    private bindKeypress;
    /**
     * If the dialog is shown and the focus is not within a dialog element (either
     * this one or another one in case of nested dialogs) or attribute, move it
     * back to the dialog container
     * See: https://github.com/KittyGiraudel/a11y-dialog/issues/177
     */
    private maintainFocus;
}
