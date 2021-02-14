export function shouldBeVisible($subject) {
  Cypress.log({
    displayName: 'visible',
    name: 'shouldBeVisible',
    message: 'The dialog should be visible',
    consoleProps: () => ({ $el: $subject }),
  })

  cy.wrap($subject, { log: false }).should('not.have.attr', 'aria-hidden')
  cy.wrap($subject, { log: false })
    .find('.dialog-content', { log: false })
    .should('be.visible')
    .and('have.attr', 'open')
}

export function shouldBeHidden($subject) {
  Cypress.log({
    displayName: 'hidden',
    name: 'shouldBeHidden',
    message: 'The dialog should be hidden',
    consoleProps: () => ({ $el: $subject }),
  })

  cy.wrap($subject, { log: false })
    .should('have.attr', 'aria-hidden', 'true')
    .find('.dialog-overlay', { log: false })
    .should('not.be.visible')
  cy.wrap($subject, { log: false })
    .find('.dialog-content', { log: false })
    .should('not.be.visible')
}
