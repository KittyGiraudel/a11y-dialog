import { shouldBeHidden, shouldBeVisible } from './utils.js'

describe('Nested dialogs', { testIsolation: false }, () => {
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
    cy.realPress('Escape')
    cy.get('[data-a11y-dialog="dialog-2"]').then(shouldBeVisible)
    cy.get('[data-a11y-dialog="dialog-3"]').then(shouldBeHidden)
  })

  it('should close only the top most dialog when clicking the backdrop', () => {
    cy.get('[data-a11y-dialog="dialog-2"]')
      .find('.dialog-overlay')
      .first()
      .click({ force: true })
    cy.get('[data-a11y-dialog="dialog-1"]').then(shouldBeVisible)
    cy.get('[data-a11y-dialog="dialog-2"]').then(shouldBeHidden)
  })
})
