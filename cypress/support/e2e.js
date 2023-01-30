import 'cypress-real-events/support'
import '@cypress/fiddle'
import { getFocusableEdges } from '../fixtures/dom-utils'

Cypress.Commands.add(
  'aliasFocusableEdges',
  { prevSubject: true },
  (subject, { skipAliases = false } = {}) => {
    cy.wrap(subject, { log: false })
      .then(subject => getFocusableEdges(subject.get(0)))
      .as('edges')
      .should('have.length', 2)

    if (!skipAliases) {
      // We cannot use `.first()` and `.last()` here because they operate on jQuery
      // collections and not on any iterable.
      cy.get('@edges', { log: false }).its('0', { log: false }).as('first')
      cy.get('@edges', { log: false }).its('1', { log: false }).as('last')
    }
  }
)

chai.use(_chai => {
  _chai.Assertion.addMethod('element', function isElement() {
    this.assert(
      Cypress.dom.isElement(this._obj),
      `expected #{this} to be an element`,
      `expected #{this} not to be an element`
    )
  })

  _chai.Assertion.addMethod('focusable', function isFocusable() {
    this.assert(
      Cypress.dom.isFocusable(this._obj),
      `expected #{this} to be focusable`,
      `expected #{this} not to be focusable`
    )
  })

  _chai.Assertion.addMethod('withinShadowRoot', function isFocusable() {
    this.assert(
      Cypress.dom.isWithinShadowRoot(this._obj),
      `expected #{this} to be in shadow DOM`,
      `expected #{this} not to be in shadow DOM`
    )
  })

  // See: https://github.com/cypress-io/cypress/blob/develop/packages/driver/src/dom/elements/shadow.ts#L4
  _chai.Assertion.addMethod('shadowRoot', function isFocusable() {
    this.assert(
      this._obj.shadowRoot?.toString() === '[object ShadowRoot]',
      `expected #{this} to have a shadow root`,
      `expected #{this} not to have a shadow root`
    )
  })
})
