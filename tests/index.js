/* global casper */

var dialogID = 'my-accessible-dialog';

casper.test.begin('Dialog window test suite', 37, function (test) {

  function testAriaHidden (isDialogOpen) {
    if (isDialogOpen === true) {
      test.assertDoesntExist('#main:not([aria-hidden])');
      test.assertExist('#main[aria-hidden="true"]');
      test.assertExist('#' + dialogID + ':not([aria-hidden])');
      test.assertDoesntExist('#' + dialogID + '[aria-hidden="true"]');
    } else {
      test.assertExist('#main:not([aria-hidden])');
      test.assertDoesntExist('#main[aria-hidden="true"]');
      test.assertDoesntExist('#' + dialogID + ':not([aria-hidden])');
      test.assertExist('#' + dialogID + '[aria-hidden="true"]');
    }
  }

  casper.start('http://edenspiekermann.github.io/a11y-dialog/', function () {
    this.page.onConsoleMessage = function (msg, lineNum, sourceId) {
      console.log('CONSOLE: ' + msg);
    };

    this.page.injectJs('./a11y-dialog.js');
    this.page.evaluateJavaScript('function () { window.m = new window.A11yDialog(document.getElementById("' + dialogID + '")); }');
    this.emit('page.loaded');
  });

  casper.on('page.loaded', function () {
    var dialog = '#' + dialogID;
    var opener = '[data-a11y-dialog-show="' + dialogID + '"]';
    var closer = dialog + ' [data-a11y-dialog-hide]';
    var overlay = dialog + ' > .dialog-overlay';

    this.then(function () {
      this.echo('\nTest dialog shape');
      test.assertEvalEquals(function () { return typeof window.a11yDialog; }, 'function', 'Dialog window constructor is being defined');
      test.assertEvalEquals(function () { return typeof m.hide; }, 'function', 'Dialog window instance has a `hide` method');
      test.assertEvalEquals(function () { return typeof m.show; }, 'function', 'Dialog window instance has a `show` method');
    });

    this.then(function () {
      this.echo('\nTest initial setup');
      test.assertExist(dialog, 'Dialog window element exists in the DOM');
      test.assertExist(opener, 'Dialog window opener element exists in the DOM');
      test.assertNotVisible(dialog, 'Dialog window is hidden by default');
      testAriaHidden(false);
    });

    this.then(function () {
      this.echo('\nTest dialog window opening');
      this.click(opener);
      testAriaHidden(true);
    });

    this.then(function () {
      this.echo('\nTest dialog window closing through overlay');
      this.click(overlay);
      testAriaHidden(false);
    });

    this.then(function () {
      this.echo('\nTest dialog window closing through closer');
      this.click(opener);
      this.click(closer);
      testAriaHidden(false);
    });

    this.then(function () {
      this.echo('\nTest dialog window closing through ESCAPE key');
      this.click(opener);
      this.page.sendEvent('keypress', this.page.event.key.Escape, null, null, 0);
      testAriaHidden(false);
    });

    this.then(function () {
      this.echo('\nTest dialog window opening through JS API');
      this.page.evaluateJavaScript('function () { window.m.show(); }');
      testAriaHidden(true);
    });

    this.then(function () {
      this.echo('\nTest dialog closing through JS API');
      this.page.evaluateJavaScript('function () { window.m.hide(); }');
      testAriaHidden(false);
    });

    this.then(function () {
      this.echo('\nTest focus on dialog window opening');
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
      }, '×', 'Focus should loop inside dialog');
      this.click(closer);
    });

    this.then(function () {
      this.echo('\nTest focus on dialog window closing');
      this.page.sendEvent('keypress', this.page.event.key.Tab, null, null, 0); // Get into document
      this.page.sendEvent('keypress', this.page.event.key.Tab, null, null, 0);
      this.click(opener);
      this.click(closer);
      test.assertEvalEquals(function () {
        return document.activeElement.textContent;
      }, 'Get the code on GitHub', 'Focus should go back to where it was after dialog window closing');
    });
  });

  casper.run(function () {
    this.test.done();
    this.exit();
  });

});
