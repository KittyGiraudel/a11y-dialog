import { shouldBeHidden, shouldBeVisible } from './utils'

describe('Nested dialogs', () => {
  before(() => {
    cy.visit('/tests/nested-dialogs')

    cy.get('[data-a11y-dialog-show="dialog-1"]').click()
    cy.get('#dialog-1').then(shouldBeVisible)
    cy.get('[data-a11y-dialog-show="dialog-2"]').click()
    cy.get('#dialog-2').then(shouldBeVisible)
    cy.get('[data-a11y-dialog-show="dialog-3"]').click()
    cy.get('#dialog-3').then(shouldBeVisible)
  })

  it('should close only the top most dialog when pressing ESC', () => {
    cy.get('body').trigger('keydown', { keyCode: 27, which: 27 })
    cy.get('#dialog-2').then(shouldBeVisible)
    cy.get('#dialog-3').then(shouldBeHidden)
  })

  it('should close only the top most dialog when clicking the backdrop', () => {
    cy.get('body').trigger('keydown', { keyCode: 27, which: 27 })
    cy.get('#dialog-2').find('.dialog-overlay').click({ force: true })
    cy.get('#dialog-1').then(shouldBeVisible)
    cy.get('#dialog-2').then(shouldBeHidden)
  })
})
