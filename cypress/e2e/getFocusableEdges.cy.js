import { getFocusableEdges } from '../fixtures/dom-utils'

describe('getFocusableEdges()', { testIsolation: false }, () => {
  before(() => cy.visit('/get-focusable-edges'))

  it('should return an array of focusable elements', () => {
    cy.get('#light-dom-two-els').then(container => {
      const focusableEdges = getFocusableEdges(container[0])

      expect(focusableEdges).to.have.length(2)
      expect(focusableEdges[0]).to.not.be.null
      expect(focusableEdges[1]).to.not.be.null
    })
  })
})
