(function (global) {
  'use strict';

  // Helper function to check if a node is visible in the viewport
  function isVisible (node) {
    return !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length);
  }

  // Helper function to get all focusable children from a node
  function getFocusableChildren (node) {
    var focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([value="-1"])'];

    return $$(focusableElements.join(','), node).filter(function (child) {
      return isVisible(child);
    });
  }

  // Helper function to get first node in context matching selector
  function $ (selector, context) {
    return (context || document).querySelector(selector);
  }

  // Helper function to get all nodes in context matching selector as an array
  function $$ (selector, context) {
    var nodes = (context || document).querySelectorAll(selector);
    return nodes.length ? Array.prototype.slice.call(nodes) : [];
  }

  // Helper function trapping the tab key inside a node
  function trapTabKey (node, event) {
    var focusableChildren = getFocusableChildren(node);
    var focusedItem = document.activeElement;
    var focusedItemIndex = focusableChildren.indexOf(focusedItem);

    if (event.shiftKey && focusedItemIndex === 0) {
      focusableChildren[focusableChildren.length - 1].focus();
      event.preventDefault();
    } else if (!event.shiftKey && focusedItemIndex === focusableChildren.length - 1) {
      focusableChildren[0].focus();
      event.preventDefault();
    }
  }

  // Helper function to bind listeners for a Modal instance
  function bindListeners (instance) {
    instance.$openers.forEach(function ($opener) {
      $opener.addEventListener('click', function (event) {
        event.stopPropagation();
        instance.show();
      });
    });

    instance.$closers.forEach(function ($closer) {
      $closer.addEventListener('click', function (event) {
        instance.hide();
      });
    });

    document.addEventListener('keydown', function (event) {
      if (instance.shown === false) return;

      if (event.which === 27) {
        event.preventDefault();
        instance.hide();
      }

      if (event.which === 9) {
        trapTabKey(instance.$modal, event);
      }
    });

    document.body.addEventListener('focus', function (event) {
      if (instance.shown && !instance.$modal.contains(event.target)) {
        setFocusToFirstItem(instance.$modal);
      }
    }, true);

    document.addEventListener('click', function (event) {
      if (instance.shown === false) return;
      instance.hide();
    });

    instance.$modal.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }

  // Helper function to focus first focusable item in node
  function setFocusToFirstItem (node) {
    var focusableChildren = getFocusableChildren(node);
    if (focusableChildren.length) focusableChildren[0].focus();
  }

  var focusedElementBeforeModal;

  /**
   * Modal constructor
   * @param {Node} node - Modal element
   * @param {Node} main - Main element of the page
   * @param {Node} overlay - Overlay element
   */
  var Modal = function (node, main, overlay) {
    this.$main = main || $('#main');
    this.$overlay = overlay || $('#modal-overlay');

    this.$modal = node;
    this.$closers = $$('[data-modal-hide]', this.$modal);
    this.$openers = $$('[data-modal-show="' + this.$modal.id + '"]');
    this.shown = false;

    bindListeners(this);
  };

  /**
   * Method to display the modal
   */
  Modal.prototype.show = function () {
    this.shown = true;

    this.$main.setAttribute('aria-hidden', 'true');
    this.$modal.setAttribute('aria-hidden', 'false');
    this.$overlay.style.display = 'block';
    this.$modal.style.display = 'block';

    focusedElementBeforeModal = document.activeElement;
    setFocusToFirstItem(this.$modal);
  };

  /**
   * Method to hide the modal
   */
  Modal.prototype.hide = function () {
    this.shown = false;

    this.$modal.setAttribute('aria-hidden', 'true');
    this.$main.setAttribute('aria-hidden', 'false');
    this.$overlay.style.display = 'none';
    this.$modal.style.display = 'none';

    focusedElementBeforeModal.focus();
  };

  global.Modal = Modal;
}(window));
