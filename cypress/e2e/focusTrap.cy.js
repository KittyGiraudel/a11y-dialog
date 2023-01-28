import { stripIndent, serialize } from '../support/utils'

describe('Focus trap', () => {
  it('should return two unique elements if multiple focusable elements are present', () => {
    cy.runExample({
      html: stripIndent(/* html */ `
      <div id="light-dom-two-els">
        <p>Node with two focusable Light DOM element children</p>
        <button id="first">Start</button>
        <a href="#" id="last">End</a>
      </div>
      `),
      test: serialize(() => {
        cy.get('#light-dom-two-els').aliasFocusableEdges()

        cy.get('@first').should('have.attr', 'id', 'first')
        cy.get('@last').should('have.attr', 'id', 'last')

        cy.get('@first').should('be.element')
        cy.get('@last').should('be.element')

        cy.get('@first').then(first => {
          cy.get('@last').should('not.deep.equal', first.get(0))
        })
      }),
    })
  })
})
