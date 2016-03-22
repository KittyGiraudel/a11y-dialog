import A11yDialog from '../lib/a11y-dialog';

document.addEventListener('DOMContentLoaded', function () {
  var dialogEl = document.getElementById('my-accessible-dialog');
  var mainEl = document.getElementById('main');
  var dialog = new A11yDialog(dialogEl, mainEl);

  // To manually control the dialog:
  // dialog.show()
  // dialog.hide()
});