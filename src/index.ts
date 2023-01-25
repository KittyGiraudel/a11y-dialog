import A11yDialog from './a11y-dialog'

function instantiateDialogs() {
  for (const el of document.querySelectorAll('[data-a11y-dialog]')) {
    new A11yDialog(el as HTMLElement)
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', instantiateDialogs)
  } else {
    instantiateDialogs()
  }
}

export default A11yDialog
