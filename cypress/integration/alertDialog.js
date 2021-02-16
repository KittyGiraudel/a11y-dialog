import { shouldBeHidden, shouldBeVisible } from './utils'

describe('Alert Dialog', () => {
  before(() => cy.visit('/tests/alert-dialog'))

  it('should prevent closing the dialog with ESC', () => {
    cy.get('[data-a11y-dialog-show="my-dialog"]').click()
    cy.get('.dialog').then(shouldBeVisible)

    cy.get('body').trigger('keydown', { keyCode: 27, which: 27 })
    cy.get('.dialog').then(shouldBeVisible)
  })

  it('should prevent closing by clicking the backdrop', () => {
    cy.get('.dialog-overlay').click({ force: true })
    cy.get('.dialog').then(shouldBeVisible)
  })
})
