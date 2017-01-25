describe('A11yDialog', function () {
  var del, mel, dialog, opener, closer, actual, expected;

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

  function afterTest () {
    dialog && dialog.hide && dialog.hide();
    dialog = undefined;
    actual = undefined;
    expected = undefined;
  }

  function afterAllTests () {
    document.querySelector('.test-suite').style.display = 'none';
  }

  after(afterAllTests);
  afterEach(afterTest);

  describe('JS API', function () {
    it('Dialog should correctly open with JS API', function () {
      del = document.getElementById('dialog-0');
      mel = document.getElementById('main-0');
      dialog = new A11yDialog(del, mel);
      dialog.show();

      actual = del.getAttribute('aria-hidden');
      expected = null;
      expect(actual).to.be.equal(expected);

      actual = mel.getAttribute('aria-hidden');
      expected = 'true';
      expect(actual).to.be.equal(expected);
    });

    it('Dialog should correctly close with JS API', function () {
      del = document.getElementById('dialog-1');
      mel = document.getElementById('main-1');
      dialog = new A11yDialog(del, mel);
      dialog.show();
      dialog.hide();

      actual = del.getAttribute('aria-hidden');
      expected = 'true';
      expect(actual).to.be.equal(expected);

      actual = mel.getAttribute('aria-hidden');
      expected = null;
      expect(actual).to.be.equal(expected);
    });

    it('Dialog should correctly destroy with JS API', function () {
      del = document.getElementById('dialog-1');
      mel = document.getElementById('main-1');
      dialog = new A11yDialog(del, mel);
      dialog.show();
      dialog.destroy();

      actual = del.getAttribute('aria-hidden');
      expected = 'true';
      expect(actual).to.be.equal(expected);

      actual = mel.getAttribute('aria-hidden');
      expected = null;
      expect(actual).to.be.equal(expected);
    });
  });

  describe('DOM API', function () {
    it('Dialog should correctly open with DOM API', function () {
      del = document.getElementById('dialog-2');
      mel = document.getElementById('main-2');
      dialog = new A11yDialog(del, mel);
      opener = document.getElementById('opener-2');
      opener.click();

      actual = del.getAttribute('aria-hidden');
      expected = null;
      expect(actual).to.be.equal(expected);

      actual = mel.getAttribute('aria-hidden');
      expected = 'true';
      expect(actual).to.be.equal(expected);
    });

    it('Dialog should correctly close with DOM API', function () {
      del = document.getElementById('dialog-3');
      mel = document.getElementById('main-3');
      dialog = new A11yDialog(del, mel);
      dialog.show();
      closer = document.getElementById('closer-3');
      closer.click();

      actual = del.getAttribute('aria-hidden');
      expected = 'true';
      expect(actual).to.be.equal(expected);

      actual = mel.getAttribute('aria-hidden');
      expected = null;
      expect(actual).to.be.equal(expected);
    });

    it('Dialog should correctly close when clicking overlay', function () {
      del = document.getElementById('dialog-4');
      mel = document.getElementById('main-4');
      dialog = new A11yDialog(del, mel);
      dialog.show();
      closer = document.getElementById('closer-4');
      closer.click();

      actual = del.getAttribute('aria-hidden');
      expected = 'true';
      expect(actual).to.be.equal(expected);

      actual = mel.getAttribute('aria-hidden');
      expected = null;
      expect(actual).to.be.equal(expected);
    });
  });

  describe('Keyboard Events', function () {
    it('Dialog should correctly close with ESC', function () {
      del = document.getElementById('dialog-7');
      mel = document.getElementById('main-7');
      dialog = new A11yDialog(del, mel);
      dialog.show();
      keydown(27);

      actual = del.getAttribute('aria-hidden');
      expected = 'true';
      expect(actual).to.be.equal(expected);

      actual = mel.getAttribute('aria-hidden');
      expected = null;
      expect(actual).to.be.equal(expected);
    });
  });

  describe('Focus handling', function () {
    it('Dialog should correctly move focus to first focusable element in dialog when open', function () {
      del = document.getElementById('dialog-5');
      mel = document.getElementById('main-5');
      document.getElementById('focus-handler-5').focus();

      dialog = new A11yDialog(del, mel);
      dialog.show();
      console.log(document.activeElement);
      actual = document.activeElement.id;
      expected = 'focus-receiver-5';
      expect(actual).to.be.equal(expected);
    });

    it('Dialog should correctly move focus back to initial focus when closed', function () {
      del = document.getElementById('dialog-6');
      mel = document.getElementById('main-6');
      document.getElementById('focus-handler-6').focus();

      dialog = new A11yDialog(del, mel);
      dialog.show();
      dialog.hide();

      actual = document.activeElement.id;
      expected = 'focus-handler-6';
      expect(actual).to.be.equal(expected);
    });
  });

  describe('JS Events', function () {
    it('Dialog should emit a "show" event when shown', function (done) {
      del = document.getElementById('dialog-8');
      mel = document.getElementById('main-8');


      dialog = new A11yDialog(del, mel);
      dialog.on('show', function () {
        done();
      });
      dialog.show();
    });

    it('Dialog should emit a "hide" event when hidden', function (done) {
      del = document.getElementById('dialog-9');
      mel = document.getElementById('main-9');

      dialog = new A11yDialog(del, mel);
      dialog.on('hide', function () {
        done();
      });
      dialog.show();
      dialog.hide();
    });

    it('Dialog should emit a "destroy" event when destroyed', function (done) {
      del = document.getElementById('dialog-10');
      mel = document.getElementById('main-10');

      dialog = new A11yDialog(del, mel);
      dialog.on('destroy', function () {
        done();
      });
      dialog.destroy();
    });
  });
});
