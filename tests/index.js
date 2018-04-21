/* global A11yDialog, sinon, describe, it, expect, after, before */

describe('A11yDialog', () => {
  const IS_DIALOG_SUPPORTED = 'show' in document.createElement('dialog');

  after(() => {
    document.querySelector('.test-suite').style.display = 'none';
  });

  describe('When instantiated, it…', () => {
    before(() => {
      window.scope = {};
      window.scope.spy = sinon.spy(A11yDialog.prototype, 'create');
      setup(document.querySelector('#test-CONSTRUCTOR'));
    });
    after(teardown);

    it('should save reference to dialog container', () => {
      expect(window.scope.instance.container).to.eql(window.scope.container);
    });

    it('should save reference to dialog element', () => {
      expect(window.scope.instance.dialog).to.eql(window.scope.dialog);
    });

    it('should call the `create` method', () => {
      expect(window.scope.spy.calledOnce).to.eql(true);
    });
  });

  describe('When created, it…', () => {
    before(() => {
      setup(document.querySelector('#test-CREATE'));
      window.scope.spy = sinon.spy();
      window.scope.instance.on('create', window.scope.spy);
      window.scope.returnedValue = window.scope.instance.create();
    });

    after(teardown);

    it('should set the `shown` property to the state of the DOM', () => {
      expect(window.scope.instance.shown).to.eql(false);
    });

    it('should set `data-a11y-dialog-native` to dialog element if supported', () => {
      expect(
        window.scope.container.hasAttribute('data-a11y-dialog-native')
      ).to.eql(IS_DIALOG_SUPPORTED);
    });

    if (!IS_DIALOG_SUPPORTED) {
      it('should set `role="dialog"` to the dialog element if not natively supported', () => {
        expect(window.scope.dialog.getAttribute('role')).to.eql('dialog');
      });

      it('should set `aria-hidden` to `true` to container element if <dialog> not supported', () => {
        expect(window.scope.container.getAttribute('aria-hidden')).to.eql(
          'true'
        );
      });
    } else {
      it('should not set `aria-hidden` to container element if <dialog> is supported', () => {
        expect(window.scope.container.getAttribute('aria-hidden')).to.eql(null);
      });
    }

    it('should add click listener to openers', () => {
      window.scope.opener.click();
      expect(window.scope.instance.shown).to.eql(true);
    });

    it('should add click listener to closers', () => {
      window.scope.closer.click();
      expect(window.scope.instance.shown).to.eql(false);
    });

    it('should call registered `create` event callbacks', () => {
      expect(window.scope.spy.calledOnce).to.eql(true);
    });

    it('should return the dialog instance', () => {
      expect(
        A11yDialog.prototype.isPrototypeOf(window.scope.returnedValue)
      ).to.eql(true);
    });
  });

  describe('When shown, it…', () => {
    before(() => {
      setup(document.querySelector('#test-SHOW'));
      window.scope.spy = sinon.spy();
      window.scope.instance.on('show', window.scope.spy);
      window.scope.returnedValue = window.scope.instance.show();
    });

    after(teardown);

    it('should set the `shown` property to `true`', () => {
      expect(window.scope.instance.shown).to.eql(true);
    });

    if (IS_DIALOG_SUPPORTED) {
      it('should call the `showModal` native method', () => {
        expect(window.scope.dialog.hasAttribute('open')).to.eql(true);
      });
    } else {
      it('should set the `open` attribute on the dialog element', () => {
        expect(window.scope.dialog.hasAttribute('open')).to.eql(true);
      });
    }

    it('should remove `aria-hidden` attribute from dialog element', () => {
      expect(window.scope.container.getAttribute('aria-hidden')).to.eql(null);
    });

    it('should set `aria-hidden` to `true` to targets element', () => {
      const actual = toArray(window.scope.targets).map(function(target) {
        return target.getAttribute('aria-hidden');
      });
      const expected = IS_DIALOG_SUPPORTED ? [null, null] : ['true', 'true'];
      expect(actual).to.eql(expected);
    });

    it('should set focus to first focusable element of dialog', () => {
      expect(document.activeElement).to.eql(window.scope.closer);
    });

    it('should prevent the focus from being lost', () => {
      document.body.focus();
      expect(document.activeElement).to.eql(window.scope.closer);
    });

    it('should call registered `show` event callbacks', () => {
      expect(window.scope.spy.calledOnce).to.eql(true);
    });

    it('should return the dialog instance', () => {
      expect(
        A11yDialog.prototype.isPrototypeOf(window.scope.returnedValue)
      ).to.eql(true);
    });
  });

  describe('When hidden, it…', () => {
    before(() => {
      setup(document.querySelector('#test-HIDE'));
      window.scope.spy = sinon.spy();
      window.scope.instance.on('hide', window.scope.spy);
      window.scope.returnedValue = window.scope.instance.show().hide();
    });

    after(teardown);

    it('should set the `shown` property to `false`', () => {
      expect(window.scope.instance.shown).to.eql(false);
    });

    it('should set `aria-hidden` attribute to `true` to dialog element', () => {
      expect(window.scope.container.getAttribute('aria-hidden')).to.eql(
        IS_DIALOG_SUPPORTED ? null : 'true'
      );
    });

    it('should remove `aria-hidden` attribute from targets element', () => {
      expect(window.scope.main.getAttribute('aria-hidden')).to.eql(null);
    });

    it('should restore focus to previously focused element', () => {
      expect(document.activeElement).to.eql(window.scope.opener);
    });

    it('should stop preventing the focus from being lost', () => {
      document.body.focus();
      expect(document.activeElement).to.eql(document.body);
    });

    it('should call registered `hide` event callbacks', () => {
      expect(window.scope.spy.calledOnce).to.eql(true);
    });

    it('should return the dialog instance', () => {
      expect(
        A11yDialog.prototype.isPrototypeOf(window.scope.returnedValue)
      ).to.eql(true);
    });
  });

  describe('When destroyed, it…', () => {
    before(() => {
      setup(document.querySelector('#test-DESTROY'));
      window.scope.spies = {
        hide: sinon.spy(window.scope.instance, 'hide'),
        destroy: sinon.spy()
      };
      window.scope.instance.on('destroy', window.scope.spies.destroy);
      window.scope.returnedValue = window.scope.instance.show().destroy();
    });

    after(teardown);

    it('should call the `hide` method', () => {
      expect(window.scope.spies.hide.calledOnce).to.eql(true);
      expect(window.scope.instance.shown).to.eql(false);
    });

    it('should remove click listener from openers', () => {
      window.scope.opener.click();
      expect(window.scope.instance.shown).to.eql(false);
    });

    it('should remove click listener from closers', () => {
      window.scope.closer.click();
      expect(window.scope.instance.shown).to.eql(false);
    });

    it('should call registered `destroy` event callbacks', () => {
      expect(window.scope.spies.destroy.calledOnce).to.eql(true);
    });

    it('should return the dialog instance', () => {
      expect(
        A11yDialog.prototype.isPrototypeOf(window.scope.returnedValue)
      ).to.eql(true);
    });

    it('should remove all registered listeners', () => {
      expect(window.scope.instance._listeners).to.eql({});
    });
  });

  describe('When listening to events, it…', () => {
    before(() => {
      setup(document.querySelector('#test-LISTENING_EVENTS'));
    });

    after(teardown);

    const noop = () => {};

    it('should properly register event listener', () => {
      window.scope.instance.on('show', noop);
      expect(window.scope.instance._listeners.show[0]).to.eql(noop);
    });

    it('should properly unregister event listener', () => {
      window.scope.instance.off('show', noop);
      expect(window.scope.instance._listeners.show.length).to.eql(0);
    });

    it('should silently fail to unregister an unknown event listener', () => {
      window.scope.instance.off('show', 'foobar');
      expect(window.scope.instance._listeners.show.length).to.eql(0);
    });
  });

  describe('When firing events, it…', () => {
    before(() => {
      setup(document.querySelector('#test-FIRING_EVENTS'));
    });

    after(teardown);

    it('should pass dialog element as first argument', function(done) {
      window.scope.instance
        .on('show', dialogEl => {
          expect(dialogEl).to.eql(window.scope.container);
          done();
        })
        .show()
        .hide();
    });
  });

  describe('When listening to key presses, it…', () => {
    before(() => {
      setup(document.querySelector('#test-KEY_PRESSES'));
    });

    after(teardown);

    it('should close dialog on ESC', () => {
      window.scope.instance.show();
      keydown(27);

      expect(window.scope.instance.shown).to.eql(false);
    });

    it('should trap focus on TAB', () => {
      window.scope.instance.show();
      keydown(9, true);

      expect(document.activeElement).to.eql(window.scope.closeButton);
    });
  });
});

function keydown(k, shift) {
  var oEvent = document.createEvent('KeyboardEvent');
  Object.defineProperty(oEvent, 'keyCode', {
    get: function() {
      return this.keyCodeVal;
    }
  });
  Object.defineProperty(oEvent, 'which', {
    get: function() {
      return this.keyCodeVal;
    }
  });

  if (oEvent.initKeyboardEvent) {
    oEvent.initKeyboardEvent(
      'keydown',
      true,
      true,
      document.defaultView,
      false,
      false,
      shift,
      false,
      shift,
      k
    );
  } else {
    oEvent.initKeyEvent(
      'keydown',
      true,
      true,
      document.defaultView,
      false,
      false,
      shift,
      false,
      k,
      0
    );
  }

  oEvent.keyCodeVal = k;

  if (oEvent.keyCode !== k) {
    console.error(
      'keyCode mismatch ' + oEvent.keyCode + '(' + oEvent.which + ')'
    );
  }

  document.dispatchEvent(oEvent);
}

function toArray(collection) {
  return Array.prototype.slice.call(collection);
}

function setup(scope) {
  window.scope = window.scope || {};
  Object.assign(window.scope, {
    container: scope.querySelector('.dialog'),
    dialog: scope.querySelector('dialog'),
    targets: scope.querySelectorAll('.target'),
    main: scope.querySelector('.main'),
    opener: scope.querySelector('[data-a11y-dialog-show]'),
    closer: scope.querySelector('[data-a11y-dialog-hide]'),
    closeButton: scope.querySelector('.close-button')
  });
  window.scope.instance = new A11yDialog(
    window.scope.container,
    window.scope.targets
  );
}

function teardown() {
  if (window.scope.instance) window.scope.instance.destroy();
  delete window.scope;
}
