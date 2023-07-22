const not = {
  inert: ':not([inert]):not([inert] *)',
  negTabIndex: ':not([tabindex^="-"])',
  disabled: ':not(:disabled)',
};

var focusableSelectors = [
  `a[href]${not.inert}${not.negTabIndex}`,
  `area[href]${not.inert}${not.negTabIndex}`,
  `input:not([type="hidden"]):not([type="radio"])${not.inert}${not.negTabIndex}${not.disabled}`,
  `input[type="radio"]${not.inert}${not.negTabIndex}${not.disabled}`,
  `select${not.inert}${not.negTabIndex}${not.disabled}`,
  `textarea${not.inert}${not.negTabIndex}${not.disabled}`,
  `button${not.inert}${not.negTabIndex}${not.disabled}`,
  `details${not.inert} > summary:first-of-type${not.negTabIndex}`,
  // Discard until Firefox supports `:has()`
  // See: https://github.com/KittyGiraudel/focusable-selectors/issues/12
  // `details:not(:has(> summary))${not.inert}${not.negTabIndex}`,
  `iframe${not.inert}${not.negTabIndex}`,
  `audio[controls]${not.inert}${not.negTabIndex}`,
  `video[controls]${not.inert}${not.negTabIndex}`,
  `[contenteditable]${not.inert}${not.negTabIndex}`,
  `[tabindex]${not.inert}${not.negTabIndex}`,
];

/**
 * Set the focus to the first element with `autofocus` with the element or the
 * element itself.
 */
function moveFocusToDialog(el) {
    const focused = (el.querySelector('[autofocus]') || el);
    focused.focus();
}
/**
 * Get the first and last focusable elements in a given tree.
 */
function getFocusableEdges(el) {
    // Check for a focusable element within the subtree of `el`.
    const first = findFocusableElement(el, true);
    // Only if we find the first element do we need to look for the last one. If
    // there’s no last element, we set `last` as a reference to `first` so that
    // the returned array is always of length 2.
    const last = first ? findFocusableElement(el, false) || first : null;
    return [first, last];
}
/**
 * Find the first focusable element inside the given node if `forward` is truthy
 * or the last focusable element otherwise.
 */
function findFocusableElement(node, forward) {
    // If we’re walking forward, check if this node is focusable, and return it
    // immediately if it is.
    if (forward && isFocusable(node))
        return node;
    // We should only search the subtree of this node if it can have focusable
    // children.
    if (canHaveFocusableChildren(node)) {
        // Start walking the DOM tree, looking for focusable elements.
        // Case 1: If this node has a shadow root, search it recursively.
        if (node.shadowRoot) {
            // Descend into this subtree.
            let next = getNextChildEl(node.shadowRoot, forward);
            // Traverse siblings, searching the subtree of each one
            // for focusable elements.
            while (next) {
                const focusableEl = findFocusableElement(next, forward);
                if (focusableEl)
                    return focusableEl;
                next = getNextSiblingEl(next, forward);
            }
        }
        // Case 2: If this node is a slot for a Custom Element, search its assigned
        // nodes recursively.
        else if (node.localName === 'slot') {
            const assignedElements = node.assignedElements({
                flatten: true,
            });
            if (!forward)
                assignedElements.reverse();
            for (const assignedElement of assignedElements) {
                const focusableEl = findFocusableElement(assignedElement, forward);
                if (focusableEl)
                    return focusableEl;
            }
        }
        // Case 3: this is a regular Light DOM node. Search its subtree.
        else {
            // Descend into this subtree.
            let next = getNextChildEl(node, forward);
            // Traverse siblings, searching the subtree of each one
            // for focusable elements.
            while (next) {
                const focusableEl = findFocusableElement(next, forward);
                if (focusableEl)
                    return focusableEl;
                next = getNextSiblingEl(next, forward);
            }
        }
    }
    // If we’re walking backward, we want to check the node’s entire subtree
    // before checking the node itself. If this node is focusable, return it.
    if (!forward && isFocusable(node))
        return node;
    return null;
}
function getNextChildEl(node, forward) {
    return forward ? node.firstElementChild : node.lastElementChild;
}
function getNextSiblingEl(el, forward) {
    return forward ? el.nextElementSibling : el.previousElementSibling;
}
/**
 * Determine if an element is hidden from the user.
 */
const isHidden = (el) => {
    // Browsers hide all non-<summary> descendants of closed <details> elements
    // from user interaction, but those non-<summary> elements may still match our
    // focusable-selectors and may still have dimensions, so we need a special
    // case to ignore them.
    if (el.matches('details:not([open]) *') &&
        !el.matches('details>summary:first-of-type'))
        return true;
    // If this element has no painted dimensions, it's hidden.
    return !(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
};
/**
 * Determine if an element is focusable and has user-visible painted dimensions.
 */
const isFocusable = (el) => {
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
    if (el.shadowRoot?.delegatesFocus)
        return false;
    return el.matches(focusableSelectors.join(',')) && !isHidden(el);
};
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
function canHaveFocusableChildren(el) {
    // The browser will never send focus into a Shadow DOM if the host element
    // has a negative tabindex. This applies to both slotted Light DOM Shadow DOM
    // children
    if (el.shadowRoot && el.getAttribute('tabindex') === '-1')
        return false;
    // Elemments matching this selector are either hidden entirely from the user,
    // or are visible but unavailable for interaction. Their descentants can never
    // receive focus.
    return !el.matches(':disabled,[hidden],[inert]');
}
/**
 * Get the active element, accounting for Shadow DOM subtrees.
 * @author Cory LaViska
 * @see: https://www.abeautifulsite.net/posts/finding-the-active-element-in-a-shadow-root/
 */
function getActiveElement(root = document) {
    const activeEl = root.activeElement;
    if (!activeEl)
        return null;
    // If there’s a shadow root, recursively find the active element within it.
    // If the recursive call returns null, return the active element
    // of the top-level Document.
    if (activeEl.shadowRoot)
        return getActiveElement(activeEl.shadowRoot) || document.activeElement;
    // If not, we can just return the active element
    return activeEl;
}
/**
 * Trap the focus inside the given element
 */
function trapTabKey(el, event) {
    const [firstFocusableChild, lastFocusableChild] = getFocusableEdges(el);
    // If there are no focusable children in the dialog, prevent the user from
    // tabbing out of it
    if (!firstFocusableChild)
        return event.preventDefault();
    const activeElement = getActiveElement();
    // If the SHIFT key is pressed while tabbing (moving backwards) and the
    // currently focused item is the first one, move the focus to the last
    // focusable item from the dialog element
    if (event.shiftKey && activeElement === firstFocusableChild) {
        // @ts-ignore: we know that `lastFocusableChild` is not null here
        lastFocusableChild.focus();
        event.preventDefault();
    }
    // If the SHIFT key is not pressed (moving forwards) and the currently focused
    // item is the last one, move the focus to the first focusable item from the
    // dialog element
    else if (!event.shiftKey && activeElement === lastFocusableChild) {
        firstFocusableChild.focus();
        event.preventDefault();
    }
}

export { getActiveElement, getFocusableEdges, moveFocusToDialog, trapTabKey };
