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
        cy.get('@first').should('be.element').and('have.attr', 'id', 'first')
        cy.get('@last').should('be.element').and('have.attr', 'id', 'last')
        cy.get('@first').then(first => {
          cy.get('@last').should('not.deep.equal', first.get(0))
        })
      }),
    })
  })

  it('should return *exactly* the first and last focusable elements, ignoring others', () => {
    cy.runExample({
      html: stripIndent(/* html */ `
        <div id="light-dom-multiple-els">
          <p>Node with multiple focusable element children</p>
          <button data-cy="first" data-cy-focus-candidate>First</button>
          <button data-cy="second" data-cy-focus-candidate>Second</button>
          <button data-cy="third" data-cy-focus-candidate>Third</button>
          <button data-cy="fourth" data-cy-focus-candidate>Fourth</button>
        </div>
      `),
      test: serialize(() => {
        cy.get('#light-dom-multiple-els').as('container').aliasFocusableEdges()
        cy.get('@container')
          .find('[data-cy-focus-candidate]')
          .as('focusable')
          .should('be.focusable')
        cy.get('@focusable')
          .first()
          .then(first => {
            cy.get('@first').should('deep.equal', first.get(0))
          })
        cy.get('@focusable')
          .last()
          .then(last => {
            cy.get('@last').should('deep.equal', last.get(0))
          })
      }),
    })
  })

  it('should return the same element twice if there is only one focusable element', () => {
    cy.runExample({
      html: stripIndent(/* html */ `
        <div id="light-dom-one-el">
          <p>Node with one focusable Light DOM element child</p>
          <button id="solo">Start</button>
        </div>
      `),
      test: serialize(() => {
        cy.get('#light-dom-one-el').aliasFocusableEdges()
        cy.get('@first')
          .should('be.element')
          .then(first => {
            cy.get('@last').should('deep.equal', first.get(0))
          })
      }),
    })
  })

  it('should return [null, null] if there are no focusable elements', () => {
    cy.runExample({
      html: stripIndent(/* html */ `
        <div id="light-dom-no-els">
          <p>Node with no focusable element children</p>
        </div>
      `),
      test: serialize(() => {
        cy.get('#light-dom-no-els').aliasFocusableEdges({ skipAliases: true })
        cy.get('@edges').its('0').should('be.null')
        cy.get('@edges').its('1').should('be.null')
      }),
    })
  })

  it('should return Shadow DOM elements', () => {
    cy.runExample({
      html: stripIndent(/* html */ `
        <div id="shadow-dom-two-els">
          <p>Node with two focusable Shadow DOM element children</p>
          <fancy-button id="start">Start</fancy-button>
          <fancy-button id="end">End</fancy-button>
        </div>
      `),
      test: serialize(() => {
        cy.get('#shadow-dom-two-els').aliasFocusableEdges()
        cy.get('@first').should('be.element').and('be.withinShadowRoot')
        cy.get('@last').should('be.element').and('be.withinShadowRoot')
      }),
    })
  })

  it('should return slotted Light DOM elements and elements nested in Shadow DOM', () => {
    cy.runExample({
      html: stripIndent(/* html */ `
      <div id="shadow-dom-mixed">
        <h2>Node with Shadow DOM and slotted element children</h2>
        <fancy-card>
          <h2>Hellaur</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            euismod, nisl nec ultricies ultricies, nunc nisl aliquam nisl, eget
            aliquam nisl nunc vel nisl.
            <a href="#" id="slotted-link">Sed</a> euismod, nisl nec ultricies.
          </p>
        </fancy-card>
      </div>
      `),
      test: serialize(() => {
        cy.get('#shadow-dom-mixed').aliasFocusableEdges()
        cy.get('@first').should('not.be.withinShadowRoot')
        cy.get('@first').invoke('attr', 'id').should('equal', 'slotted-link')
        cy.get('@last').should('be.withinShadowRoot')
      }),
    })
  })

  it('should return focusable Shadow DOM hosts', () => {
    cy.runExample({
      html: stripIndent(/* html */ `
        <div id="focusable-shadow-host">
          <p>Node with a focusable Shadow DOM host</p>
          <fancy-div tabindex="0">I'm a focusable Shadow DOM host!</fancy-div>
        </div>
      `),
      test: serialize(() => {
        cy.get('#focusable-shadow-host').aliasFocusableEdges()
        cy.get('@first').should('be.element').and('be.shadowRoot')
        cy.get('@last').should('be.element').and('be.shadowRoot')
      }),
    })
  })

  it('should ignore nodes in inert subtrees', () => {
    cy.runExample({
      html: stripIndent(/* html */ `
        <div id="inert-children">
          <p>Node with inert children</p>
          <div inert>
            <button class="link-like">Hellaur</button>
          </div>
          <button disabled>Goodbye</button>
        </div>
      `),
      test: serialize(() => {
        cy.get('#inert-children')
          .as('container')
          .aliasFocusableEdges({ skipAliases: true })
        cy.get('@container').find('div[inert]').should('not.be.focusable')
        cy.get('@container').find('button[disabled]').should('not.be.focusable')
        cy.get('@edges').its('0').should('be.null')
        cy.get('@edges').its('1').should('be.null')
      }),
    })
  })

  it('should ignore nodes in hidden subtrees', () => {
    cy.runExample({
      html: stripIndent(/* html */ `
        <div id="hidden-children">
          <p>Node with hidden children 2</p>
          <div hidden>
            <button class="link-like">Hellaur</button>
          </div>
        </div>
      `),
      test: serialize(() => {
        cy.get('#hidden-children')
          .as('container')
          .aliasFocusableEdges({ skipAliases: true })
        cy.get('@container')
          .find('div[hidden]')
          .should('be.hidden')
          .and('not.be.focusable')
        cy.get('@edges').its('0').should('be.null')
        cy.get('@edges').its('1').should('be.null')
      }),
    })
  })
})
