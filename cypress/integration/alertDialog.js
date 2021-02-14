describe('Alert Dialog', () => {
  before(() => cy.visit('/tests/alert-dialog'))

  it('should prevent closing the dialog with escape', () => {
    cy.get('[data-a11y-dialog-show="my-accessible-dialog"]').first().click()
    cy.get('.dialog').should('not.have.attr', 'aria-hidden')
    cy.get('.dialog-content').should('be.visible')
    cy.get('body').trigger('keydown', { keyCode: 27, which: 27 })
    cy.get('.dialog').should('not.have.attr', 'aria-hidden')
    cy.get('.dialog-content').should('be.visible')
  })

  it('should prevent closing by clicking the backdrop', () => {
    cy.get('.dialog-overlay').click({ force: true })
    cy.get('.dialog').should('not.have.attr', 'aria-hidden')
    cy.get('.dialog-content').should('be.visible')
  })
})
