export function shouldBeVisible($subject) {
  Cypress.log({
    displayName: 'visible',
    name: 'shouldBeVisible',
    message: 'The dialog should be visible',
    consoleProps: () => ({ $el: $subject }),
  })

  if ($subject[0].shadowRoot) {
    cy.wrap($subject, { log: false }).shadow().find('.dialog').as('subject')
  } else {
    cy.wrap($subject, { log: false }).as('subject')
  }

  cy.get('@subject').should('not.have.attr', 'aria-hidden')
  cy.get('@subject')
    .find('.dialog-content', { log: false })
    .should('be.visible')
}

export function shouldBeHidden($subject) {
  Cypress.log({
    displayName: 'hidden',
    name: 'shouldBeHidden',
    message: 'The dialog should be hidden',
    consoleProps: () => ({ $el: $subject }),
  })

  if ($subject[0].shadowRoot) {
    cy.wrap($subject, { log: false }).shadow().find('.dialog').as('subject')
  } else {
    cy.wrap($subject, { log: false }).as('subject')
  }

  cy.get('@subject').should('have.attr', 'aria-hidden', 'true')
  cy.get('@subject')
    .find('.dialog-overlay', { log: false })
    .should('not.be.visible')
  cy.get('@subject')
    .find('.dialog-content', { log: false })
    .should('not.be.visible')
}
