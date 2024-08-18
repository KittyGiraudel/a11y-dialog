import { shouldBeHidden, shouldBeVisible } from './utils.ts'

describe('State', { testIsolation: false }, () => {
  before(() => cy.visit('/base'))

  it('should add relevant attributes to the dialog', () => {
    cy.get('.dialog')
      .should('have.attr', 'role', 'dialog')
      .and('have.attr', 'aria-modal', 'true')
      .and('have.attr', 'tabindex', '-1')
      .and('have.attr', 'aria-hidden', 'true')
  })

  it('should hide the dialog by default', () => {
    cy.get('.dialog').then(shouldBeHidden)
  })

  it('should open the dialog when clicking an opener', () => {
    cy.get('[data-a11y-dialog-show="something-else"]').click()
    cy.get('.dialog').then(shouldBeHidden)

    cy.get('[data-a11y-dialog-show="my-dialog"]').first().click()
    cy.get('.dialog').then(shouldBeVisible)
  })

  it('should close when clicking a closer', () => {
    cy.get('.dialog-close').click()
    cy.get('.dialog').then(shouldBeHidden)
  })

  it('should open the dialog when clicking a custom element opener', () => {
    cy.get('fancy-button').click()
    cy.get('.dialog').then(shouldBeVisible)
  })

  it('should close when pressing ESC', () => {
    cy.realPress('Escape')
    cy.get('.dialog').then(shouldBeHidden)
  })

  it('should not close when pressing ESC if it contains an open popover', () => {
    cy.get('[data-a11y-dialog-show="my-dialog"]').first().click()
    cy.get('[popovertarget]').click()
    cy.get('[popover]').should('be.visible')
    cy.realPress('Escape')
    cy.get('[popover]').should('not.be.visible')
    cy.get('.dialog').then(shouldBeVisible)
    cy.realPress('Escape')
    cy.get('.dialog').then(shouldBeHidden)
  })

  it('should close when clicking the backdrop', () => {
    cy.get('[data-a11y-dialog-show="my-dialog"]').first().click()
    cy.get('.dialog-overlay').click({ force: true })
    cy.get('.dialog').then(shouldBeHidden)
  })

  it('should be possible to register DOM event listeners', () => {
    cy.get('[data-a11y-dialog]').then($node => {
      $node[0].addEventListener('show', cy.stub().as('shown'))
      $node[0].addEventListener('hide', cy.stub().as('hidden'))
    })
    cy.get('[data-a11y-dialog-show="my-dialog"]').first().click()
    cy.get('@shown').should('have.been.calledOnce')
    cy.get('.dialog-overlay').click({ force: true })
    cy.get('@hidden').should('have.been.calledOnce')
  })
})
