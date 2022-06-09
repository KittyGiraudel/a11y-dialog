describe('Focus', () => {
  before(() => cy.visit('/base'))

  it('should focus the first element in the dialog on open', () => {
    cy.get('[data-a11y-dialog-show="my-dialog"]').click()
    cy.get('[role="dialog"]').should('have.focus')
  })

  it('should trap the focus within the dialog', () => {
    // The next line is a hack, because the `cypress-plugin-tab` library does
    // not consider elements with `tabindex="-1"` to be valid subject for the
    // `.tab()` command, which means we can’t tab from the dialog into it.
    cy.get('.dialog-close').focus()
    cy.get('.dialog-close').tab()
    cy.get('input[type="email"]')
      .should('have.focus')
      .tab({ shift: true })
      .tab({ shift: true })
    cy.get('#move-focus-outside').should('have.focus').tab()
    cy.get('.dialog-close').should('have.focus')
  })

  it('should maintain focus in the dialog', () => {
    cy.get('[data-a11y-dialog-show="my-dialog"]').focus()
    cy.get('[role="dialog"]').should('have.focus')
  })

  it('should restore focus to the previously focused element', () => {
    cy.get('.dialog-close').click()
    cy.get('[data-a11y-dialog-show="my-dialog"]').should('have.focus')
  })

  it('should ignore focus trap for elements with ‘data-a11y-dialog-ignore-focus-trap’', () => {
    cy.get('[data-a11y-dialog-show="my-dialog"]').click()
    cy.get('#move-focus-outside').click()
    cy.get('#focus-me').should('have.focus')
  })
})
