describe('State', () => {
  before(() => cy.visit('/tests/base'))

  it('should hide the dialog by default', () => {
    cy.get('.dialog').should('have.attr', 'aria-hidden', 'true')
    cy.get('.dialog-overlay').should('not.be.visible')
    cy.get('.dialog-content').should('not.be.visible')
  })

  it('should open when clicking an opener', () => {
    cy.get('[data-a11y-dialog-show="my-accessible-dialog"]').first().click()
    cy.get('.dialog').should('not.have.attr', 'aria-hidden')
    cy.get('.dialog-content').should('be.visible')
    cy.get('.dialog-content').should('have.attr', 'open')
  })

  it('should toggle aria-hidden on siblings/targets', () => {
    cy.get('main').should('have.attr', 'aria-hidden', 'true')
    cy.get('#pre-hidden-sibling').should(
      'have.attr',
      'data-a11y-dialog-original-aria-hidden',
      'true'
    )
  })

  it('should close when clicking a closer', () => {
    cy.get('.dialog-close').click()
    cy.get('.dialog').should('have.attr', 'aria-hidden', 'true')
    cy.get('.dialog-content').should('not.be.visible')
    cy.get('#pre-hidden-sibling').should(
      'not.have.attr',
      'data-a11y-dialog-original-aria-hidden'
    )
  })

  it('should close when pressing ESC', () => {
    cy.get('[data-a11y-dialog-show="my-accessible-dialog"]').first().click()
    cy.get('body').trigger('keydown', { keyCode: 27, which: 27 })
    cy.get('.dialog').should('have.attr', 'aria-hidden', 'true')
    cy.get('.dialog-content').should('not.be.visible')
  })

  it('should close when clicking the backdrop', () => {
    cy.get('[data-a11y-dialog-show="my-accessible-dialog"]').first().click()
    cy.get('.dialog-overlay').click({ force: true })
    cy.get('.dialog').should('have.attr', 'aria-hidden', 'true')
    cy.get('.dialog-content').should('not.be.visible')
  })
})
