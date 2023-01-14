---
title: Known issues
slug: /further-reading/known-issues
---

## Focus restoration on iOS

It has been reported that the focus restoration to the formerly active element when closing the dialog does not always work properly on iOS. It is unclear what causes this or even if it happens consistently. Refer to [issue #102](https://github.com/KittyGiraudel/a11y-dialog/issues/102) as a reference.

## aria-hidden content on VoiceOver

Content with `aria-hidden` appears to be sometimes read by VoiceOver on iOS and macOS. It is unclear in which case this happens, and does not appear to be an issue directly related to the library. Refer to this [WebKit bug](https://bugs.webkit.org/show_bug.cgi?id=201887#c2) for reference.

## Shadow DOM

As reported in [issue #322](https://github.com/KittyGiraudel/a11y-dialog/issues/322), a11y-dialog fails to account for shadow DOM when trapping the focus. This can be a problem when rendering interactive web components within the dialog.

## Mobile issues

The library relies on `aria-modal`, a standardized attribute from [WAI-ARIA 1.1](https://www.w3.org/TR/wai-aria-1.1/#aria-modal). Unfortunately, the [support for this attribute](https://a11ysupport.io/tech/aria/aria-modal_attribute) is not incredible with certain mobile assistive technologies, as reported in [issue #408](https://github.com/KittyGiraudel/a11y-dialog/pull/408). If that’s an issue for you, you have two equally viable options:

- Use [version 6](/6.1.0/) of the library which did not rely on the `aria-modal` attribute. Keep in mind the setup is significantly more complex though — pay attention to the documentation.

- Use the library in conjunction with the [aria-hidden](https://github.com/theKashey/aria-hidden) package (<1kb) to combine both implementations for maximum support. Refer to [this demo](https://codesandbox.io/s/a11y-dialog-w-aria-hidden-v7-forked-u3unbr) for implementation details.