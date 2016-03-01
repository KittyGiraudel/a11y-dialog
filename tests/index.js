/* global casper */

var modalID = 'my-accessible-modal';

casper.test.begin('Modal test suite', 37, function (test) {

  function testAriaHidden (isModalOpen) {
    if (isModalOpen === true) {
      test.assertDoesntExist('#main:not([aria-hidden])');
      test.assertExist('#main[aria-hidden="true"]');
      test.assertExist('#' + modalID + ':not([aria-hidden])');
      test.assertDoesntExist('#' + modalID + '[aria-hidden="true"]');
    } else {
      test.assertExist('#main:not([aria-hidden])');
      test.assertDoesntExist('#main[aria-hidden="true"]');
      test.assertDoesntExist('#' + modalID + ':not([aria-hidden])');
      test.assertExist('#' + modalID + '[aria-hidden="true"]');
    }
  }

  casper.start('http://edenspiekermann.github.io/accessible-modal-dialog/', function () {
    this.page.onConsoleMessage = function (msg, lineNum, sourceId) {
      console.log('CONSOLE: ' + msg);
    };

    this.page.injectJs('./accessible-modal-dialog.js');
    this.page.evaluateJavaScript('function () { window.m = new window.A11yDialog(document.getElementById("' + modalID + '")); }');
    this.emit('page.loaded');
  });

  casper.on('page.loaded', function () {
    var modal = '#' + modalID;
    var opener = '[data-modal-show="' + modalID + '"]';
    var closer = modal + ' [data-modal-hide]';
    var overlay = modal + ' > .modal-overlay';

    this.then(function () {
      this.echo('\nTest Modal shape');
      test.assertEvalEquals(function () { return typeof window.Modal; }, 'function', 'Modal constructor is being defined');
      test.assertEvalEquals(function () { return typeof m.hide; }, 'function', 'Modal instance has a `hide` method');
      test.assertEvalEquals(function () { return typeof m.show; }, 'function', 'Modal instance has a `show` method');
    });

    this.then(function () {
      this.echo('\nTest initial setup');
      test.assertExist(modal, 'Modal element exists in the DOM');
      test.assertExist(opener, 'Modal opener element exists in the DOM');
      test.assertNotVisible(modal, 'Modal is hidden by default');
      testAriaHidden(false);
    });

    this.then(function () {
      this.echo('\nTest modal opening');
      this.click(opener);
      testAriaHidden(true);
    });

    this.then(function () {
      this.echo('\nTest modal closing through overlay');
      this.click(overlay);
      testAriaHidden(false);
    });

    this.then(function () {
      this.echo('\nTest modal closing through closer');
      this.click(opener);
      this.click(closer);
      testAriaHidden(false);
    });

    this.then(function () {
      this.echo('\nTest modal closing through ESCAPE key');
      this.click(opener);
      this.page.sendEvent('keypress', this.page.event.key.Escape, null, null, 0);
      testAriaHidden(false);
    });

    this.then(function () {
      this.echo('\nTest modal opening through JS API');
      this.page.evaluateJavaScript('function () { window.m.show(); }');
      testAriaHidden(true);
    });

    this.then(function () {
      this.echo('\nTest modal closing through JS API');
      this.page.evaluateJavaScript('function () { window.m.hide(); }');
      testAriaHidden(false);
    });

    this.then(function () {
      this.echo('\nTest focus on modal opening');
      this.click(opener);
      test.assertEvalEquals(function () {
        return document.activeElement.name;
      }, 'EMAIL', 'First focusable element is focused');
      this.click(closer);
    });

    this.then(function () {
      this.echo('\nTest focus trap');
      this.click(opener);
      this.page.sendEvent('keypress', this.page.event.key.Tab, null, null, 0x02000000);
      test.assertEvalEquals(function () {
        return document.activeElement.textContent;
      }, '×', 'Focus should loop inside modal');
      this.click(closer);
    });

    this.then(function () {
      this.echo('\nTest focus on modal closing');
      this.page.sendEvent('keypress', this.page.event.key.Tab, null, null, 0); // Get into document
      this.page.sendEvent('keypress', this.page.event.key.Tab, null, null, 0);
      this.click(opener);
      this.click(closer);
      test.assertEvalEquals(function () {
        return document.activeElement.textContent;
      }, 'Get the code on GitHub', 'Focus should go back to where it was after modal closing');
    });
  });

  casper.run(function () {
    this.test.done();
    this.exit();
  });

});
