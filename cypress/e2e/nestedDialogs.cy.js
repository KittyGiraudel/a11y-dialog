import { shouldBeHidden, shouldBeVisible } from './utils'

describe('Nested dialogs', () => {
  before(() => {
    cy.visit('/nested-dialogs')

    cy.get('[data-a11y-dialog-show="dialog-1"]').click()
    cy.get('[data-a11y-dialog="dialog-1"]').then(shouldBeVisible)
    cy.get('[data-a11y-dialog-show="dialog-2"]').click()
    cy.get('[data-a11y-dialog="dialog-2"]').then(shouldBeVisible)
    cy.get('[data-a11y-dialog-show="dialog-3"]').click()
    cy.get('[data-a11y-dialog="dialog-3"]').then(shouldBeVisible)
  })

  it('should close only the top most dialog when pressing ESC', () => {
    cy.get('body').trigger('keydown', { key: 'Escape', keyCode: 27, which: 27 })
    cy.get('[data-a11y-dialog="dialog-2"]').then(shouldBeVisible)
    cy.get('[data-a11y-dialog="dialog-3"]').then(shouldBeHidden)
  })

  it('should close only the top most dialog when clicking the backdrop', () => {
    cy.get('body').trigger('keydown', { key: 'Escape', keyCode: 27, which: 27 })
    cy.get('[data-a11y-dialog="dialog-2"]')
      .find('.dialog-overlay')
      .click({ force: true })
    cy.get('[data-a11y-dialog="dialog-1"]').then(shouldBeVisible)
    cy.get('[data-a11y-dialog="dialog-2"]').then(shouldBeHidden)
  })
})
