/**
 * A11yDialog Class
 * @param {Node} node - Dialog element
 * @param {Node} main - Main element of the page
 */
class A11yDialog {
  constructor (node, main) {
    let namespace = 'data-a11y-dialog';

    this.focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex^="-"])'];
    this.focusedBeforeDialog = null;
    this.node = node;
    this.main = main || document.querySelector('#main');
    this.shown = false;

    //since we dont hace any reference to the function that attached
    this.showBind = this.show.bind(this);
    this.hideBind = this.hide.bind(this);

    for(let opener of this._$$('[' + namespace + '-show="' + this.node.id + '"]')) {
      opener.addEventListener('click', this.showBind);
    }

    for(let closer of this._$$('[' + namespace + '-hide]', this.node).concat(this._$$('[' + namespace + '-hide="' + this.node.id + '"]'))) {
      closer.addEventListener('click', this.hideBind);
    }

    document.addEventListener('keydown', (event) => {
      if (this.shown && event.which === 27) {
        event.preventDefault();
        this.hideBind();
      }

      if (this.shown && event.which === 9) {
        this._trapTabKey(this.node, event);
      }
    });
  }

  maintainFocus (event) {
    if (this.shown && !this.node.contains(event.target)) {
      this._setFocusToFirstItem(this.node);
    }
  }

  show () {
    this.shown = true;
    this.node.removeAttribute('aria-hidden');
    this.main.setAttribute('aria-hidden', 'true');
    this.focusedBeforeDialog = document.activeElement;
    this._setFocusToFirstItem(this.node);

    this.maintainFocusBind = this.maintainFocus.bind(this);

    document.body.addEventListener('focus', this.maintainFocusBind, true);
  }

  hide () {
    this.shown = false;
    this.node.setAttribute('aria-hidden', 'true');
    this.main.removeAttribute('aria-hidden');
    this.focusedBeforeDialog && this.focusedBeforeDialog.focus();
    document.body.removeEventListener('focus', this.maintainFocusBind, true);
  }

  // Helper function to get all focusable children from a node
  _getFocusableChildren (node) {
    return this._$$(this.focusableElements.join(','), node).filter((child) => {
      return !!(child.offsetWidth || child.offsetHeight || child.getClientRects().length);
    });
  }

  // Helper function to get all nodes in context matching selector as an array
  _$$ (selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  }

  // Helper function trapping the tab key inside a node
  _trapTabKey (node, event) {
    let focusableChildren = this._getFocusableChildren(node);
    let focusedItemIndex = focusableChildren.indexOf(document.activeElement);

    if (event.shiftKey && focusedItemIndex === 0) {
      focusableChildren[focusableChildren.length - 1].focus();
      event.preventDefault();
    } else if (!event.shiftKey && focusedItemIndex === focusableChildren.length - 1) {
      focusableChildren[0].focus();
      event.preventDefault();
    }
  }

  // Helper function to focus first focusable item in node
  _setFocusToFirstItem (node) {
    let focusableChildren = this._getFocusableChildren(node);
    if (focusableChildren.length) {
      focusableChildren[0].focus();
    }
  }
}

export default A11yDialog
