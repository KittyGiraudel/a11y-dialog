import 'cypress-real-events/support'
import '@cypress/fiddle'
import { getFocusableEdges } from '../fixtures/dom-utils'

Cypress.Commands.add('aliasFocusableEdges', { prevSubject: true }, subject => {
  cy.wrap(subject, { log: false })
    .then(subject => getFocusableEdges(subject[0]))
    .as('edges')
    .should('have.length', 2)

  cy.get('@edges', { log: false }).its('0', { log: false }).as('first')
  cy.get('@edges', { log: false }).its('1', { log: false }).as('last')
})

chai.use(_chai => {
  _chai.Assertion.addMethod('element', function isElement() {
    this.assert(
      Cypress.dom.isElement(this._obj),
      `expected #{this} to be an element`
    )
  })
})
