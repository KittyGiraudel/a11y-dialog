import { shouldBeHidden } from './utils.js'

describe('Focus', { testIsolation: false }, () => {
  before(() => cy.visit('/focus'))

  it('should focus the dialog container on open', () => {
    cy.get('[data-a11y-dialog-show="my-dialog"]').click()
    cy.get('[role="dialog"]').should('have.focus')
  })

  it('should trap the focus within the dialog', () => {
    // Press Tab and verify that the correct element is focused
    cy.realPress('Tab').focused().should('have.class', 'dialog-close')

    // Tab backwards and verify that we’ve looped around to the last focusable
    // element
    cy.realPress(['Shift', 'Tab'])
      .focused()
      .should('have.id', 'move-focus-outside')
  })

  it('should maintain focus on the dialog', () => {
    cy.get('[data-a11y-dialog-show="my-dialog"]').focus()
    cy.get('[role="dialog"]').should('have.focus')
  })

  it('should restore focus to the previously focused element', () => {
    cy.get('#close-my-dialog').click()
    cy.get('[data-a11y-dialog-show="my-dialog"]').should('have.focus')
  })

  it('should ignore focus trap for elements with ‘data-a11y-dialog-ignore-focus-trap’', () => {
    cy.get('[data-a11y-dialog-show="my-dialog"]').click()
    cy.get('#move-focus-outside').click()
    cy.get('#focus-me').should('have.focus')

    // Close the open dialog
    cy.get('#close-my-dialog').click()
    cy.get('.dialog').then(shouldBeHidden)
  })

  it('should properly handle focus with Shadow DOM children', () => {
    cy.get('[data-a11y-dialog-show="shadow-dialog"]').click()

    // Move focus into the dialog and ensure that the first focused element is a
    // `<fancy-button>` element.
    cy.realPress('Tab')
      .focused()
      .should('have.prop', 'tagName')
      .should('eq', 'FANCY-BUTTON')

    // Verify that focus goes backward into the `<fancy-card>` element. Within
    // that, verify that the `<fancy-button>` element is focused.
    cy.realPress(['Shift', 'Tab'])
      .focused()
      .shadow()
      .find('fancy-button')
      .should('have.focus')

    // Close the open dialog
    cy.get('#close-shadow-dialog').click()
  })

  it('should properly handle focus when the first or last child is a focusable shadow host', () => {
    cy.get('[data-a11y-dialog-show="focusable-shadow-host-dialog"]').click()

    cy.realPress('Tab').realPress(['Shift', 'Tab']).focused().as('focused')
    cy.get('@focused').should('have.prop', 'tagName').should('eq', 'FANCY-DIV')
    cy.get('@focused').should('have.attr', 'tabindex', '0')
  })
})
