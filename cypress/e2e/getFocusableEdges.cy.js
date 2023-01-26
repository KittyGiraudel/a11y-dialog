import { getFocusableEdges } from '../fixtures/dom-utils'
const { isElement, isFocusable: _isFocusable, isHidden } = Cypress.dom

// The types of Cypress.dom.isFocusable are wrong >:C
// It only accepts jQuery objects.
const isFocusable = element =>
  element instanceof Cypress.$
    ? _isFocusable(element)
    : _isFocusable(Cypress.$(element))

const isInShadow = element => {
  while (element) {
    if (element.toString() === '[object ShadowRoot]') return true
    element = element.parentNode
  }
  return false
}

const hasShadowDOM = element => !!element.shadowRoot

describe('getFocusableEdges()', { testIsolation: false }, () => {
  before(() => cy.visit('/get-focusable-edges'))

  it('should return two unique elements if multiple focusable elements are present', () => {
    cy.get('#light-dom-two-els').then(container => {
      const elems = getFocusableEdges(container[0])
      const [first, last] = elems

      expect(elems).to.have.length(2)
      expect(isElement(first)).to.be.true
      expect(isElement(last)).to.be.true
      expect(first).to.not.equal(last)
      expect(first).to.have.property('id', 'first')
      expect(last).to.have.property('id', 'last')
    })
  })
  it('should return *exactly* the first and last focusable elements, ignoring others', () => {
    cy.get('#light-dom-multiple-els').then(container => {
      // Get all focusable elements in this container.
      const focusableElems = container.find('[data-cy-focus-candidate]')
      // Get the first and last focusable elements,
      // according to our library.
      const [first, last] = getFocusableEdges(container[0])

      // Assert that all of these is focusable according to the browser
      focusableElems.each((_, el) => {
        expect(isFocusable(el)).to.be.true
      })

      // Assert that our library returns the correct first and last elements
      expect(focusableElems[0]).to.equal(first)
      expect(focusableElems[focusableElems.length - 1]).to.equal(last)
    })
  })
  it('should return the same element twice if there is only one focusable element', () => {
    cy.get('#light-dom-one-el').then(container => {
      const elems = getFocusableEdges(container[0])
      const [first, last] = elems

      expect(elems).to.have.length(2)
      expect(first).to.not.be.null
      expect(last).to.not.be.null
      expect(first).to.equal(last)
    })
  })
  it('should return [null, null] if there are no focusable elements', () => {
    cy.get('#light-dom-no-els').then(container => {
      const elems = getFocusableEdges(container[0])
      const [first, last] = elems

      expect(elems).to.have.length(2)
      expect(first).to.be.null
      expect(last).to.be.null
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
      const [first, last] = elems

      expect(elems).to.have.length(2)
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
      const [first, last] = elems

      const inertNode = container.find('div[inert]')
      const disabledNode = container.find('button[disabled]')
      expect(isFocusable(inertNode)).to.be.false
      expect(isFocusable(disabledNode)).to.be.false

      expect(elems).to.have.length(2)
      // The child of the inert div
      expect(first).to.be.null
      // The individially disabled button
      expect(last).to.be.null
    })
    cy.get('#hidden-children').then(container => {
      const elems = getFocusableEdges(container[0])
      const [first, last] = elems
      const hiddenNode = container.find('div[hidden]')

      expect(isHidden(hiddenNode)).to.be.true
      expect(isFocusable(hiddenNode)).to.be.false
      // The only focusable element is the child of a hidden div
      expect(elems).to.have.length(2)
      expect(first).to.be.null
      expect(last).to.be.null
    })
  })

  /**
   * A shadow host that delegates focus will never directly receive focus,
   * even when the host itself is focusable. Consider our <fancy-button> custom
   * element, which delegates focus. If we were to apply a tabindex to it, it
   * would look like this:
   *
   * <fancy-button tabindex="0">
   *  #shadow-root
   *  <button><slot></slot></button>
   * </fancy-button>
   *
   * The browser acts as as if there is only one focusable element – the shadow
   * button. Our library should behave the same way.
   */
  // TODO: This test is currently failing. We do not account for this
  // browser behavior.
  it.skip('should ignore focusable shadow hosts if they delegate focus to their shadow subtree', () => {
    cy.get('#shadow-host-delegates-focus').then(container => {
      // Get the shadow host element in this container
      const focusableShadowHostEl = container.find(
        '[data-cy-delegates-focus]'
      )[0]
      // Get the first focusable element, according to our library
      const [first] = getFocusableEdges(container[0])

      // Assert that we have a shadow host that delegates focus to its subtree
      expect(focusableShadowHostEl.shadowRoot?.delegatesFocus).to.be.true
      // Assert that the host el is *not* what our library returns
      expect(first).to.not.equal(focusableShadowHostEl)
      // Assert that our library returns the button inside the shadow subtree
      expect(isInShadow(first)).to.be.true
      expect(first).to.have.prop('localName', 'button')
    })
  })
})
