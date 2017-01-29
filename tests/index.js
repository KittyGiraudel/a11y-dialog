function keydown (k, shift) {
  var oEvent = document.createEvent('KeyboardEvent');
  Object.defineProperty(oEvent, 'keyCode', { get: function() { return this.keyCodeVal; } });
  Object.defineProperty(oEvent, 'which', { get: function() { return this.keyCodeVal; } });     

  if (oEvent.initKeyboardEvent) {
    oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, false, false, shift, false, shift, k);
  } else {
    oEvent.initKeyEvent("keydown", true, true, document.defaultView, false, false, shift, false, k, 0);
  }

  oEvent.keyCodeVal = k;

  if (oEvent.keyCode !== k) {
    alert("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ")");
  }

  document.dispatchEvent(oEvent);
}

function toArray (collection) {
  return Array.prototype.slice.call(collection);
}

describe('A11yDialog', function () {

  after(function () {
    document.querySelector('.test-suite').style.display = 'none';
  });

  describe('when instantiated, it…', function () {
    const scope = document.querySelector('#test-0');
    const el = scope.querySelector('.dialog');
    const targets = scope.querySelectorAll('.target');
    const dialog = new A11yDialog(el, targets);

    it('should save reference to dialog element', function () {
      const actual = dialog.node;
      const expected = el;
      expect(actual).to.be.eql(expected);
    });

    it('should prepare to store registered event callbacks', function () {
      const actual = dialog._listeners;
      const expected = {};
      expect(actual).to.be.eql(expected);
    });
  });

  describe('when shown, it…', function () {
    const scope = document.querySelector('#test-1');
    const el = scope.querySelector('.dialog');
    const targets = scope.querySelectorAll('.target');
    const secondary = scope.querySelector('.secondary');
    const title = scope.querySelector('.dialog-title');
    const previous = scope.querySelector('.previous');
    const dialog = new A11yDialog(el, targets);
    let proof = 0;

    previous.focus();
    dialog.on('show', function () { proof++; })
    const result = dialog.show();

    it('should set the `shown` property to `true`', function () {
      const actual = dialog.shown;
      const expected = true;
      expect(actual).to.be.equal(expected);
    });

    it('should remove `aria-hidden` attribute from dialog element', function () {
      const actual = el.getAttribute('aria-hidden');
      const expected = null;
      expect(actual).to.be.equal(expected);
    });

    it('should set `aria-hidden` to `true` to targets element', function () {
      const actual = toArray(targets).map(function (target) {
        return target.getAttribute('aria-hidden');
      });
      const expected = ['true', 'true'];
      expect(actual).to.be.eql(expected);
    });

    it('should save original `aria-hidden` from targets element', function () {
      const actual = secondary.getAttribute('data-a11y-dialog-original');
      const expected = 'something';
      expect(actual).to.be.equal(expected);
    });

    it('should set focus to first focusable element of dialog', function () {
      const actual = document.activeElement;
      const expected = title;
      expect(actual).to.be.eql(expected);
    });

    it('should prevent the focus from being lost', function () {
      document.body.focus();
      const actual = document.activeElement;
      const expected = title;
      expect(actual).to.be.eql(expected);
    });

    it('should call registered `show` event callbacks', function () {
      const actual = proof;
      const expected = 1;
      expect(actual).to.be.equal(expected);
    });

    it('should return the dialog instance', function () {
      const actual = A11yDialog.prototype.isPrototypeOf(result);
      const expected = true;
      expect(actual).to.be.equal(expected);
    });
  });

  describe('when hidden, it…', function () {
    const scope = document.querySelector('#test-2');
    const el = scope.querySelector('.dialog');
    const targets = scope.querySelectorAll('.target');
    const main = scope.querySelector('.main');
    const secondary = scope.querySelector('.secondary');
    const title = scope.querySelector('.dialog-title');
    const previous = scope.querySelector('.previous');
    const dialog = new A11yDialog(el, targets);
    let proof = 1;

    previous.focus();
    dialog.on('hide', function () { proof--; });
    const result = dialog.show().hide();

    it('should set the `shown` property to `false`', function () {
      const actual = dialog.shown;
      const expected = false;
      expect(actual).to.be.equal(expected);
    });

    it('should set `aria-hidden` attribute to `true` to dialog element', function () {
      const actual = el.getAttribute('aria-hidden');
      const expected = 'true';
      expect(actual).to.be.equal(expected);
    });

    it('should remove `aria-hidden` attribute from targets element', function () {
      const actual = main.getAttribute('aria-hidden');
      const expected = null;
      expect(actual).to.be.eql(expected);
    });

    it('should restore original `aria-hidden` from targets element', function () {
      const actual = secondary.getAttribute('aria-hidden');
      const expected = 'something';
      expect(actual).to.be.equal(expected);
    });

    it('should restore focus to previously focused element', function () {
      const actual = document.activeElement;
      const expected = previous;
      expect(actual).to.be.eql(expected);
    });

    it('should stop preventing the focus from being lost', function () {
      document.body.focus();
      const actual = document.activeElement;
      const expected = document.body;
      expect(actual).to.be.eql(expected);
    });

    it('should call registered `hide` event callbacks', function () {
      const actual = proof;
      const expected = 0;
      expect(actual).to.be.equal(expected);
    });

    it('should return the dialog instance', function () {
      const actual = A11yDialog.prototype.isPrototypeOf(result);
      const expected = true;
      expect(actual).to.be.equal(expected);
    });
  });

  describe('when destroyed, it…', function () {
    const scope = document.querySelector('#test-3');
    const el = scope.querySelector('.dialog');
    const targets = scope.querySelectorAll('.target');
    const opener = scope.querySelector('[data-a11y-dialog-show="dialog-3"]')
    const closer = scope.querySelector('[data-a11y-dialog-hide]')
    const dialog = new A11yDialog(el, targets);
    let proof = 1;

    dialog.on('destroy', function () { proof += 2; });
    const result = dialog.show().destroy();

    it('should hide the dialog', function () {
      const actual = dialog.shown;
      const expected = false;
      expect(actual).to.be.equal(expected);
    });

    it('should remove click listener from openers', function () {
      opener.click();
      const actual = dialog.shown;
      const expected = false;
      expect(actual).to.be.equal(expected);
    });

    it('should remove click listener from closers', function () {
      closer.click();
      const actual = dialog.shown;
      const expected = false;
      expect(actual).to.be.equal(expected);
    });

    it('should call registered `destroy` event callbacks', function () {
      const actual = proof;
      const expected = 3;
      expect(actual).to.be.equal(expected);
    });

    it('should return the dialog instance', function () {
      const actual = A11yDialog.prototype.isPrototypeOf(result);
      const expected = true;
      expect(actual).to.be.equal(expected);
    });

    it('should remove all registered listeners', function () {
      const actual = dialog._listeners;
      const expected = {};
      expect(actual).to.be.eql(expected);
    });
  });

  describe('when created, it…', function () {
    const scope = document.querySelector('#test-4');
    const el = scope.querySelector('.dialog');
    const targets = scope.querySelectorAll('.target');
    const opener = scope.querySelector('[data-a11y-dialog-show="dialog-4"]')
    const closer = scope.querySelector('[data-a11y-dialog-hide]')
    const dialog = new A11yDialog(el, targets);
    let proof = 1;

    dialog.on('create', function () { proof += 4; });
    const result = dialog.create();

    it('should collect the targets', function () {
      const actual = dialog._targets;
      const expected = targets;
      expect(actual).to.be.eql(expected);
    });

    it('should set the `shown` property to `false`', function () {
      const actual = dialog.shown;
      const expected = false;
      expect(actual).to.be.equal(expected);
    });

    it('should set `aria-hidden` to `true` to dialog element', function () {
      const actual = el.getAttribute('aria-hidden');
      const expected = 'true';
      expect(actual).to.be.equal(expected);
    });

    it('should add click listener to openers', function () {
      opener.click();
      const actual = dialog.shown;
      const expected = true;
      expect(actual).to.be.equal(expected);
    });

    it('should add click listener to closers', function () {
      closer.click();
      const actual = dialog.shown;
      const expected = false;
      expect(actual).to.be.equal(expected);
    });

    it('should call registered `create` event callbacks', function () {
      const actual = proof;
      const expected = 5;
      expect(actual).to.be.equal(expected);
    });

    it('should return the dialog instance', function () {
      const actual = A11yDialog.prototype.isPrototypeOf(result);
      const expected = true;
      expect(actual).to.be.equal(expected);
    });
  });

  describe('when listening to events, it…', function () {
    const scope = document.querySelector('#test-0');
    const el = scope.querySelector('.dialog');
    const targets = scope.querySelectorAll('.target');
    const dialog = new A11yDialog(el, targets);

    const noop = function () {}

    it('should properly register event listener', function () {
      dialog.on('show', noop)
      const actual = dialog._listeners.show[0];
      const expected = noop;
      expect(actual).to.be.eql(expected);
    });

    it('should properly unregister event listener', function () {
      dialog.off('show', noop)
      const actual = dialog._listeners.show.length;
      const expected = 0;
      expect(actual).to.be.equal(expected);
    });

    it('should silently fail to unregister an unknown event listener', function () {
      dialog.off('show', 'foobar')
      const actual = dialog._listeners.show.length;
      const expected = 0;
      expect(actual).to.be.equal(expected);
    });
  });

  describe('when firing events, it…', function () {
    const scope = document.querySelector('#test-0');
    const el = scope.querySelector('.dialog');
    const dialog = new A11yDialog(el);

    it('should pass dialog element as first argument', function (done) {
      dialog.on('show', function (dialogEl) {
        const actual = dialogEl;
        const expected = el;
        expect(actual).to.be.eql(expected);
        done();
      }).show().hide();
    });
  });

  describe('when listening to key presses, it…', function () {
    const scope = document.querySelector('#test-0');
    const el = scope.querySelector('.dialog');
    const dialog = new A11yDialog(el);

    it('should close dialog on ESC', function () {
      dialog.show();
      keydown(27);

      const actual = dialog.shown;
      const expected = false;
      expect(actual).to.be.equal(expected);
    });

    it('should trap focus on TAB', function () {
      dialog.show();
      keydown(9, true);

      const actual = document.activeElement;
      const expected = scope.querySelector('.close-button');
      expect(actual).to.be.equal(expected);
    });
  });
});
