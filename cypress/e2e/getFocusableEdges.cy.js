import { getFocusableEdges } from '../fixtures/dom-utils'

// Helper function to check if an element is in a Shadow DOM
function isInShadow(node) {
  while (node) {
    if (node.toString() === '[object ShadowRoot]') return true
    node = node.parentNode
  }
  return false
}

const hasShadowDOM = node => !!node.shadowRoot

// Cypress runs everything in its own iframes, so we can't assert
// .instanceOf(Element) here; we have to use its helper function.
const isElement = Cypress.dom.isElement

describe('getFocusableEdges()', { testIsolation: false }, () => {
  before(() => cy.visit('/get-focusable-edges'))

  it('should return two unique elements if multiple focusable elements are present', () => {
    cy.get('#light-dom-two-els').then(container => {
      const elems = getFocusableEdges(container[0])
      expect(elems).to.have.length(2)

      const [first, last] = elems

      expect(isElement(first)).to.be.true
      expect(isElement(last)).to.be.true
      expect(first).to.not.equal(last)
      expect(first).to.have.property('id', 'first')
      expect(last).to.have.property('id', 'last')
    })
  })
  it('should return the same element twice if there is only one focusable element', () => {
    cy.get('#light-dom-one-el').then(container => {
      const elems = getFocusableEdges(container[0])

      expect(elems).to.have.length(2)
      expect(elems[0]).to.not.be.null
      expect(elems[1]).to.not.be.null
      expect(elems[0]).to.equal(elems[1])
    })
  })
  it('should return [null, null] if there are no focusable elements', () => {
    cy.get('#light-dom-no-els').then(container => {
      const elems = getFocusableEdges(container[0])

      expect(elems).to.have.length(2)
      expect(elems[0]).to.be.null
      expect(elems[1]).to.be.null
    })
  })
  it('should return Shadow DOM elements', () => {
    cy.get('#shadow-dom-two-els').then(container => {
      const elems = getFocusableEdges(container[0])
      const [first, last] = elems

      expect(elems).to.have.length(2)
      expect(first).to.not.be.null
      expect(last).to.not.be.null
      expect(isInShadow(first)).to.be.true
      expect(isInShadow(last)).to.be.true
    })
  })
  it('should return slotted Light DOM elements and elements nested in Shadow DOM', () => {
    cy.get('#shadow-dom-mixed').then(container => {
      const elems = getFocusableEdges(container[0])

      expect(elems).to.have.length(2)

      const [first, last] = elems

      expect(first).to.not.be.null
      expect(last).to.not.be.null

      // The first focusable element is slotted, so it has no host
      expect(isInShadow(first)).to.be.false
      expect(first.id).to.equal('slotted-link')
      // The last focusable element is nested in a Shadow DOM
      expect(isInShadow(last)).to.be.true
    })
  })
  it('should return focusable Shadow DOM hosts', () => {
    cy.get('#focusable-shadow-host').then(container => {
      const elems = getFocusableEdges(container[0])
      const [first, last] = elems

      expect(elems).to.have.length(2)
      expect(first).to.not.be.null
      expect(last).to.not.be.null
      expect(hasShadowDOM(first)).to.be.true
      expect(hasShadowDOM(last)).to.be.true
    })
  })
  it('should ignore nodes in unfocusable subtrees', () => {
    cy.get('#inert-children').then(container => {
      const elems = getFocusableEdges(container[0])

      expect(elems).to.have.length(2)
      // The child of the inert div
      expect(elems[0]).to.be.null
      // The individially disabled button
      expect(elems[1]).to.be.null
    })
    cy.get('#hidden-children').then(container => {
      const elems = getFocusableEdges(container[0])

      // The only focusable element is the child of a hidden div
      expect(elems).to.have.length(2)
      expect(elems[0]).to.be.null
      expect(elems[1]).to.be.null
    })
  })
})
