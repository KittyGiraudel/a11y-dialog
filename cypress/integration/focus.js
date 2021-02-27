describe('Focus', () => {
  before(() => cy.visit('/tests/base'))

  it('should focus the first element in the dialog on open', () => {
    cy.get('[data-a11y-dialog-show="my-dialog"]').click()
    cy.get('.dialog-close').should('have.focus')
  })

  it('should trap the focus within the dialog', () => {
    cy.get('.dialog-close').tab()
    cy.get('input[type="email"]')
      .should('have.focus')
      .tab({ shift: true })
      .tab({ shift: true })
    cy.get('button[type="submit"]').should('have.focus').tab()
    cy.get('.dialog-close').should('have.focus')
  })

  it('should maintain focus in the dialog', () => {
    cy.get('[data-a11y-dialog-show="my-dialog"]').focus()
    cy.get('.dialog-close').should('have.focus')
  })

  it('should restore focus to the previously focused element', () => {
    cy.get('.dialog-close').click()
    cy.get('[data-a11y-dialog-show="my-dialog"]').should('have.focus')
  })
})
