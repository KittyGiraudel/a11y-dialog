const test = fn => {
  const string = fn.toString()
  const openingBrace = string.indexOf('{')
  const closingBrace = string.lastIndexOf('}')

  return string.slice(openingBrace + 1, closingBrace)
}

describe('Focus trap', () => {
  it('should return two unique elements if multiple focusable elements are present', () => {
    cy.runExample({
      html: `
      <div id="light-dom-two-els">
        <h2>Node with two focusable Light DOM element children</h2>
        <button id="first">Start</button>
        <a href="#" id="last">End</a>
      </div>
      `,
      test: test(() => {
        cy.get('#light-dom-two-els').getFocusableEdges()

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
