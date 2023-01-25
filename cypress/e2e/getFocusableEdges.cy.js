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
  it('Should return the same element twice if there is only one focusable element', () => {
    cy.get('#light-dom-one-el').then(container => {
      const focusableEdges = getFocusableEdges(container[0])

      expect(focusableEdges).to.have.length(2)
      expect(focusableEdges[0]).to.not.be.null
      expect(focusableEdges[1]).to.not.be.null
      expect(focusableEdges[0]).to.equal(focusableEdges[1])
    })
  })
  it('Should return null if there are no focusable elements', () => {
    cy.get('#light-dom-no-els').then(container => {
      const focusableEdges = getFocusableEdges(container[0])

      expect(focusableEdges).to.have.length(2)
      expect(focusableEdges[0]).to.be.null
      expect(focusableEdges[1]).to.be.null
    })
  })
  it('Should return Shadow DOM elements', () => {
    cy.get('#shadow-dom-two-els').then(container => {
      const focusableEdges = getFocusableEdges(container[0])

      expect(focusableEdges).to.have.length(2)
      expect(focusableEdges[0]).to.not.be.null
      expect(focusableEdges[1]).to.not.be.null
    })
  })
  it('should return elements nested in Shadow DOM subtrees', () => {
    cy.get('#shadow-dom-nested').then(container => {
      const focusableEdges = getFocusableEdges(container[0])

      expect(focusableEdges).to.have.length(2)
      expect(focusableEdges[0]).to.not.be.null
      expect(focusableEdges[1]).to.not.be.null
    })
  })
})
