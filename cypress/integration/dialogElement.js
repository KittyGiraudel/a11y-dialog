import { shouldBeVisible } from './utils'

describe('<dialog> element', () => {
  before(() => cy.visit('/tests/dialog-element'))

  it('should handle the `open` attribute', () => {
    cy.get('.dialog').then(shouldBeVisible)

    cy.get('.dialog-close').click()
    cy.get('dialog').should('not.have.attr', 'open')
  })

  it('should add the `role` attribute for compatibility', () => {
    cy.get('dialog').should('have.attr', 'role', 'dialog')
  })

  it('should add the `data-a11y-dialog-native` attribute to the container', () => {
    cy.get('.dialog').should('have.attr', 'data-a11y-dialog-native')
  })

  it('should remove the `aria-hidden` attribute from the container', () => {
    // See: https://github.com/HugoGiraudel/a11y-dialog/commit/6ba711a777aed0dbda0719a18a02f742098c64d9#commitcomment-28694166
    cy.get('.dialog').should('not.have.attr', 'aria-hidden')
  })

  it('should call the native `showModal` method', () => {
    cy.window().then(win => {
      const dialog = win.document.querySelector('dialog')
      cy.spy(dialog, 'showModal').as('showModal')
    })
    cy.get('[data-a11y-dialog-show="my-dialog"]').click()
    cy.get('@showModal').should('be.calledOnce')
  })
})
