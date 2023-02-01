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

  it('should ignore focusable shadow hosts if they delegate focus to their shadow subtree', () => {
    cy.runExample({
      html: stripIndent(/* html */ `
      <div id="shadow-host-delegates-focus">
        <p>
          Custom Elements that delegate focus
          should <i>not</i> return the host as a focusable element; only the
          focusable elements in the shadow DOM.
        </p>
        <fancy-button data-cy-delegates-focus tabindex="0">I'm in the Shadow DOM</fancy-button>
      </div>
    `),
      test: serialize(() => {
        // Get the first focusable element, according to our library
        cy.get('#shadow-host-delegates-focus')
          .as('container')
          .aliasFocusableEdges()

        // Get the shadow host in this container
        cy.get('@container').find('[data-cy-delegates-focus]').as('shadowHost')

        // Assert that we have a shadow host that delegates focus to its subtree
        cy.get('@shadowHost')
          .should('have.prop', 'localName', 'fancy-button')
          .shadow()
          .should('have.prop', 'delegatesFocus', true)

        // Assert that the shadowHost is *not* what our library returns
        cy.get('@first')
          // First check that it is a button within a shadowRoot
          .and('have.prop', 'localName', 'button')
          .and('be.withinShadowRoot')
          // then check that it is not the same as the shadow host
          .then(first => {
            cy.get('@shadowHost').its(0).should('not.deep.equal', first.get(0))
          })
      }),
    })
  })

  it('should ignore shadow hosts with a negative tabindex', () => {
    cy.runExample({
      html: /* html */ `
        <div id="shadow-host-negative-tabindex">
          <fancy-card tabindex="-1" data-cy-negative-tabindex>
            <h3>AAAA</h3>
            <p>Hello, <a href="#">link</a></p>
          </fancy-card>
        </div>
      `,
      test: serialize(() => {
        // Get the first and last focusable element, according to our library
        cy.get('#shadow-host-negative-tabindex')
          .as('container')
          .aliasFocusableEdges({ skipAliases: true })

        // Get the shadow host with a negative tabindex
        cy.get('@container')
          .find('[data-cy-negative-tabindex]')
          .as('shadowHost')

        // Assert that the shadow host has a negative tabindex
        cy.get('@shadowHost').should('have.attr', 'tabindex', '-1')
        // Asseert that the shadow DOM contains a <fancy-button>
        cy.get('@shadowHost').shadow().find('fancy-button').should('exist')

        // Assert that our library finds no focusable elements in this container
        cy.get('@edges').its('0').should('be.null')
        cy.get('@edges').its('1').should('be.null')
      }),
    })
  })

  it('should ignore non-<summary> elements in a closed <details>', () => {
    cy.runExample({
      html: stripIndent(/* html */ `
      <div id="with-details">
        <h2>With details & summary elements</h2>
        <details>
          <summary>Hellaur</summary>
          <p>What are frogs?
            <a href="#">Science</a> may one day understand.
          </p>
        </details>
      </div>
    `),
      test: serialize(() => {
        cy.get('#with-details').as('container').aliasFocusableEdges()

        // Assert that this container has a <details> element
        // and it is closed
        cy.get('@container')
          .find('details')
          .as('details')
          .should('have.prop', 'open', false)

        // Assert that there is an anchor element within the <details>
        cy.get('@details').find('a').should('exist')

        // Assert that the <summary> is the only focusable element our library
        // finds
        cy.get('@first')
          .should('be.element', 'summary')
          .then(first => {
            cy.get('@last').should('deep.equal', first.get(0))
          })
      }),
    })
  })
})
