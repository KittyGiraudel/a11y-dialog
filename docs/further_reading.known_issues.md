---
title: Known issues
slug: /further-reading/known-issues
---



## Focus restoration on iOS

It has been reported that the focus restoration to the formerly active element when closing the dialog does not always work properly on iOS. It is unclear what causes this or even if it happens consistently. Refer to [issue #102](https://github.com/KittyGiraudel/a11y-dialog/issues/102) as a reference.

## aria-hidden content on VoiceOver

Content with `aria-hidden` appears to be sometimes read by VoiceOver on iOS and macOS. It is unclear in which case this happens, and does not appear to be an issue directly related to the library. Refer to this [WebKit bug](https://bugs.webkit.org/show_bug.cgi?id=201887#c2) for reference.

## Shadow DOM

The algorithm to trap the focus within the dialog does not take into account shadow DOM trees. This can be an issue when the first or lass focusable element within the dialog is a web component. Refer to [issue #322](https://github.com/KittyGiraudel/a11y-dialog/issues/322) as a reference.
