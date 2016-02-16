/* global casper */

var modalID = 'my-accessible-modal';

casper.test.begin('Modal test suite', 26, function (test) {

  function testAriaHidden (isModalOpen) {
    var modal = '#' + modalID;

    test.assertExist('#main[aria-hidden="' + isModalOpen + '"]', 'Main element has `aria-hidden="' + isModalOpen + '"`');
    test.assertDoesntExist('#main[aria-hidden="' + !isModalOpen + '"]', 'Main element has `aria-hidden="' + !isModalOpen + '"`');
    test.assertExist(modal + '[aria-hidden="' + !isModalOpen + '"]', 'Modal element has `aria-hidden="' + !isModalOpen + '"`');
    test.assertDoesntExist(modal + '[aria-hidden="' + isModalOpen + '"]', 'Modal element has `aria-hidden="' + isModalOpen + '"`');
  }

  casper.start('http://edenspiekermann.github.io/accessible-modal-dialog/', function () {
    casper.page.onConsoleMessage = function (msg, lineNum, sourceId) {
      console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
    };

    casper.page.injectJs('./accessible-modal-dialog.js');
    casper.page.evaluateJavaScript('function () { window.m = new window.Modal(document.getElementById("' + modalID + '")); }');

    var modal = '#' + modalID;
    var opener = '[data-modal-show="' + modalID + '"]';
    var closer = modal + ' [data-modal-hide]';
    var overlay = modal + ' > .modal-overlay';

    casper.then(function () {
      this.echo('');
      this.echo('Test Modal shape');
      test.assertEvalEquals(function () { return typeof window.Modal; }, 'function', 'Modal constructor is being defined');
      test.assertEvalEquals(function () { return typeof m.hide; }, 'function', 'Modal instance has a `hide` method');
      test.assertEvalEquals(function () { return typeof m.show; }, 'function', 'Modal instance has a `show` method');
    });

    casper.then(function () {
      this.echo('');
      this.echo('Test initial setup');
      test.assertExist(modal, 'Modal element exists in the DOM');
      test.assertExist(opener, 'Modal opener element exists in the DOM');
      test.assertNotVisible(modal, 'Modal is hidden by default');
      testAriaHidden(false);
    });

    casper.then(function () {
      this.echo('');
      this.echo('Test modal opening');
      casper.click(opener);
      testAriaHidden(true);
    });

    casper.then(function () {
      this.echo('');
      this.echo('Test modal closing through overlay');
      casper.click(overlay);
      testAriaHidden(false);
    });

    casper.then(function () {
      this.echo('');
      this.echo('Test modal closing through closer');
      casper.click(opener);
      casper.click(closer);
      testAriaHidden(false);
    });

    casper.then(function () {
      this.echo('');
      this.echo('Test modal closing through ESCAPE key');
      casper.click(opener);
      casper.page.sendEvent('keypress', casper.page.event.key.Escape, null, null, 0);
      testAriaHidden(false);
    });

  });

  casper.run(function () {
    this.test.done();
    this.exit();
  });

});
