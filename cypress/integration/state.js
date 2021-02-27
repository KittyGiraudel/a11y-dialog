import { shouldBeHidden, shouldBeVisible } from './utils'

describe('State', () => {
  before(() => cy.visit('/tests/base'))

  it('should hide the dialog by default', () => {
    cy.get('.dialog').then(shouldBeHidden)
  })

  it('should open the dialog when clicking an opener', () => {
    cy.get('[data-a11y-dialog-show="something-else"]').click()
    cy.get('.dialog').then(shouldBeHidden)

    cy.get('[data-a11y-dialog-show="my-dialog"]').click()
    cy.get('.dialog').then(shouldBeVisible)
  })

  it('should toggle the `aria-hidden` attribute on siblings/targets', () => {
    cy.get('main').should('have.attr', 'aria-hidden', 'true')
    cy.get('#pre-hidden-sibling').should(
      'have.attr',
      'data-a11y-dialog-original-aria-hidden',
      'true'
    )
  })

  it('should close when clicking a closer', () => {
    cy.get('.dialog-close').click()
    cy.get('.dialog').then(shouldBeHidden)
    cy.get('#pre-hidden-sibling').should(
      'not.have.attr',
      'data-a11y-dialog-original-aria-hidden'
    )
  })

  it('should close when pressing ESC', () => {
    cy.get('[data-a11y-dialog-show="my-dialog"]').click()
    cy.get('body').trigger('keydown', { keyCode: 27, which: 27 })
    cy.get('.dialog').then(shouldBeHidden)
  })

  it('should close when clicking the backdrop', () => {
    cy.get('[data-a11y-dialog-show="my-dialog"]').click()
    cy.get('.dialog-overlay').click({ force: true })
    cy.get('.dialog').then(shouldBeHidden)
  })
})
