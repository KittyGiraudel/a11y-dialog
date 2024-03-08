import { shouldBeHidden, shouldBeVisible } from './utils.js'

describe('Web Components', () => {
  beforeEach(() => cy.visit('/web-components'))

  it('should focus the dialog container on open', () => {
    cy.get('my-dialog').shadow().find('[data-show]').click()
    cy.get('my-dialog').then(shouldBeVisible)
    cy.get('my-dialog').should('have.focus')
  })

  it('should close with ESC', () => {
    cy.get('my-dialog').shadow().find('[data-show]').click()
    cy.realPress('Escape')
    cy.get('my-dialog').then(shouldBeHidden)
  })

  it('should close with close button', () => {
    cy.get('my-dialog').shadow().find('[data-show]').click()
    cy.get('my-dialog').shadow().find('.dialog-close').click()
    cy.get('my-dialog').then(shouldBeHidden)
  })

  it('should restore focus to the previously focused element', () => {
    cy.get('my-dialog').shadow().find('[data-show]').click()
    cy.get('my-dialog').shadow().find('.dialog-close').click()
    cy.get('my-dialog').shadow().find('[data-show]').should('have.focus')
  })
})
