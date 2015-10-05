# The Incredible Accessible Modal Window

This page demonstrates how to make a modal window as accessible as possible to assistive technology users. Modal windows are especially problematic for screen reader users. Often times the user is able to "escape" the window and interact with other parts of the page when they should not be able to. This is partially due to the way screen reader software interacts with the Web browser.

## What's New In Version 4?

* Due to high demand, the role="document" is added back to the contents of the modal. This makes it so NVDA automatically switches into document reading mode inside of the modal. NVDA had previously let you toggle the reading mode, but since many modals contain items that require document browsing mode, I've added this back in as the default.
* There is now a check that when the modal window is open, detects any time the #mainPage or any of its contents receives focus and will redirect the focus to the modal window. This was necessary because of the modal window was open and you went to the address bar, if you started tabbing again you would interact with the main page.
* Both the documentation and the [live demo](http://gdkraus.github.io/accessible-modal-dialog/) now live on GitHub.

##Features

This example implements the following features:

1. The page is divided into three sections:
  1. <div id="mainPage></div>
  2. <div id="modal" role="dialog"></div>
  3. <div id="modalOverlay"></div>
2. When the modal dialog is displayed, an overlay is placed over top of the mainPage so it is
  1. visually grayed out in order to indicate you cannot interact with what is behind the window
  2. not clickable with the mouse
3. When the modal dialog is displayed, the mainPage is marked with aria-hidden="true" to prevent screen readers from interacting with it once the modal dialog is open. Additionally, the mainPage gets an even listener for any time it or any of its children receive focus. When they do receive focus, the user's focus is redirected to the modal window.
4. Keyboard access is limited to only interacting with the modal dialog once it is visible
  1. The tab key loops through all of the keyboard focusable items within the modal window
  2. This is determined programmatically through the DOM each time the tab key is pressed so you do not have to create an explicit list of focusable items within the modal window to keep track of
  3. The escape key is mapped to the function to close the modal window
  4. The enter key is mapped to the submit function of the modal window
5. The title of the modal dialog is identified through the aria-labelledby attribute.
6. The beginning of the modal dialog is marked with an h1
7. There are offscreen instructions that describe the modal dialog and how to interact with it
  1. The instructions are attached through the aria-describedby attribute.
  2. Only NVDA and ChromeVox automatically announce the aria-described by contents
8. The contents of the modal are wrapped in role="document". This is to aid NVDA users so they can more easily browse the contents of the modal. NVDA previously added support for fully browsing the contents of the modal, but it requires the user to switch browsing modes in NVDA. Using role="document" automatically puts the user in the mode where they can fully browse the contents.
  1. role="document" is optional and the modal window is still fully functional to all users even when this attribute is left off.
9. Configurations Tested
  1. JAWS 16.0.1925 in IE 11.0.9600.18036 in Windows 8.1: Passed - although aria-describedby is not read automatically
  2. NVDA 2015.3 in Firefox 40.0.3 in Windows 8.1: Passed
  3. Window Eyes 9.2.1.0 in 11.0.9600.18036 in Windows 8.1: Passed - although the title of the modal window and the aria-describedby is not read automatically
  4. VoiceOver in Safari 8.0.8 (9537.71) in OS X 10.10.5: Passed - although aria-describedby is not read automatically
  5. ChromeVox 45.0.2428.0 in Chrome 45.0.2454.101 in OS X 10.10.5: Passed
  6. Orca 3.10.3 in Firefox 39.0 in Ubuntu 14.04: Partial Functionality - does not support aria-hidden and does not announce the aria-describedby