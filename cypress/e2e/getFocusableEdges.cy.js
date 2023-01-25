import { getFocusableEdges } from '../fixtures/dom-utils'

describe('getFocusableEdges()', { testIsolation: false }, () => {
  before(() => cy.visit('/get-focusable-edges'))

  it('should return [HTMLElement, HTMLElement] if focusable elements are present', () => {
    cy.get('#light-dom-two-els').then(container => {
      const focusableEdges = getFocusableEdges(container[0])

      expect(focusableEdges).to.have.length(2)
      expect(focusableEdges[0]).to.not.be.null
      expect(focusableEdges[1]).to.not.be.null
    })
  })
  it('should return the same element twice if there is only one focusable element', () => {
    cy.get('#light-dom-one-el').then(container => {
      const focusableEdges = getFocusableEdges(container[0])

      expect(focusableEdges).to.have.length(2)
      expect(focusableEdges[0]).to.not.be.null
      expect(focusableEdges[1]).to.not.be.null
      expect(focusableEdges[0]).to.equal(focusableEdges[1])
    })
  })
  it('should return [null, null] if there are no focusable elements', () => {
    cy.get('#light-dom-no-els').then(container => {
      const focusableEdges = getFocusableEdges(container[0])

      expect(focusableEdges).to.have.length(2)
      expect(focusableEdges[0]).to.be.null
      expect(focusableEdges[1]).to.be.null
    })
  })
  it('should return Shadow DOM elements', () => {
    cy.get('#shadow-dom-two-els').then(container => {
      const focusableEdges = getFocusableEdges(container[0])

      expect(focusableEdges).to.have.length(2)
      expect(focusableEdges[0]).to.not.be.null
      expect(focusableEdges[1]).to.not.be.null
      expect(focusableEdges[0].host).to.not.be.null
    })
  })
  it('should return slotted Light DOM elements and elements nested in Shadow DOM', () => {
    cy.get('#shadow-dom-mixed').then(container => {
      const focusableEdges = getFocusableEdges(container[0])

      expect(focusableEdges).to.have.length(2)

      const [first, last] = focusableEdges

      expect(first).to.not.be.null
      expect(last).to.not.be.null

      // The first focusable element is slotted, so it has no host
      expect(first.host instanceof ShadowRoot).to.be.false
      expect(first.id).to.equal('slotted-link')
      // The last focusable element is nested in a Shadow DOM
      expect(last.host).to.not.be.null
    })
  })
  it('should return focusable Shadow DOM hosts', () => {
    cy.get('#focusable-shadow-host').then(container => {
      const focusableEdges = getFocusableEdges(container[0])

      expect(focusableEdges).to.have.length(2)
      expect(focusableEdges[0]).to.not.be.null
      expect(focusableEdges[1]).to.not.be.null
    })
  })
  it('should ignore nodes in unfocusable subtrees', () => {
    cy.get('#inert-children').then(container => {
      const focusableEdges = getFocusableEdges(container[0])

      expect(focusableEdges).to.have.length(2)
      // The child of the inert div
      expect(focusableEdges[0]).to.be.null
      // The individially disabled button
      expect(focusableEdges[1]).to.be.null
    })
    cy.get('#hidden-children').then(container => {
      const focusableEdges = getFocusableEdges(container[0])

      // The only focusable element is the child of a hidden div
      expect(focusableEdges).to.have.length(2)
      expect(focusableEdges[0]).to.be.null
      expect(focusableEdges[1]).to.be.null
    })
  })
})
