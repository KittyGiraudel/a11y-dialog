/* global casper */

var modalID = 'my-accessible-modal';

casper.test.begin('Modal module tests', 24, function suite (test) {

  casper.start('http://0.0.0.0:4444', function () {
    casper.page.injectJs('./accessible-modal-dialog.js');
    casper.page.onConsoleMessage = console.log.bind(console, 'DEBUG: ');
    casper.page.evaluateJavaScript('(function () { new window.Modal(document.getElementById("' + modalID + '")) }())');
    this.emit('page.loaded');
  });

  function testAriaHidden (isModalOpen) {
    var modal = '#' + modalID;

    test.assertExist('#main[aria-hidden="' + isModalOpen + '"]');
    test.assertDoesntExist('#main[aria-hidden="' + !isModalOpen + '"]');
    test.assertExist(modal + '[aria-hidden="' + !isModalOpen + '"]');
    test.assertDoesntExist(modal + '[aria-hidden="' + isModalOpen + '"]');
  }

  casper.on('page.loaded', function () {
    var modal = '#' + modalID;
    var opener = '[data-modal-show="' + modalID + '"]';
    var closer = modal + ' [data-modal-hide]';
    var overlay = modal + ' > .modal-overlay';

    // Test initial setup
    test.assertEvalEquals(function () { return typeof window.Modal; }, 'function', 'Modal is being defined');
    test.assertExist(modal, 'Modal element exists in the DOM');
    test.assertExist(opener, 'Modal opener element exists in the DOM');
    test.assertNotVisible(modal, 'Modal is hidden by default');
    testAriaHidden(false);

    // Test modal opening
    this.click(opener), testAriaHidden(true);

    // Test modal closing through overlay
    this.click(overlay), testAriaHidden(false);

    // Test modal closing through closer
    this.click(opener), this.click(closer), testAriaHidden(false);

    // Test modal closing through ESCAPE key
    this.click(opener), casper.page.sendEvent('keypress', casper.page.event.key.Escape, null, null, 0), testAriaHidden(false);
  });

  casper.run(function () {
    test.done();
  });

});
