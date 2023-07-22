/**
 * Set the focus to the first element with `autofocus` with the element or the
 * element itself.
 */
export declare function moveFocusToDialog(el: HTMLElement): void;
/**
 * Get the first and last focusable elements in a given tree.
 */
export declare function getFocusableEdges(el: HTMLElement): readonly [HTMLElement | null, HTMLElement | null];
/**
 * Get the active element, accounting for Shadow DOM subtrees.
 * @author Cory LaViska
 * @see: https://www.abeautifulsite.net/posts/finding-the-active-element-in-a-shadow-root/
 */
export declare function getActiveElement(root?: Document | ShadowRoot): Element | null;
/**
 * Trap the focus inside the given element
 */
export declare function trapTabKey(el: HTMLElement, event: KeyboardEvent): void;
