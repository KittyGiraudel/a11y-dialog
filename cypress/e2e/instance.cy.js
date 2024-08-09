import { shouldBeHidden, shouldBeVisible } from './utils.js'

describe('Instance', { testIsolation: false }, () => {
  before(() => cy.visit('/instance'))

  it('should be possible to instantiate a dialog with JavaScript', () => {
    cy.window().then(win => {
      win.instance = new win.A11yDialog(
        win.document.getElementById('my-dialog')
      )
    })
  })

  it('should expose a `show` method on the instance', () => {
    cy.window().its('instance').invoke('show')
    cy.get('.dialog').then(shouldBeVisible)
  })

  it('should expose the dialog status on the instance', () => {
    cy.window().its('instance').its('shown').should('eq', true)
  })

  it('should expose a `hide` method on the instance', () => {
    cy.window().its('instance').invoke('hide')
    cy.get('.dialog').then(shouldBeHidden)
    cy.window().its('instance').its('shown').should('eq', false)
  })

  it('should expose the container on the instance', () => {
    cy.window()
      .its('instance')
      .its('$el')
      .should('have.attr', 'id', 'my-dialog')
  })

  it('should expose the dialog ID on the instance', () => {
    cy.window().its('instance').its('id').should('eq', 'my-dialog')
  })

  it('should be possible to register/unregister events', () => {
    const handlers = {
      show: event => {
        // When programmatically showing the dialog, event details are not set.
        expect(event.detail).to.eq(null)
        expect(event.target.id).to.eq('my-dialog')
      },
      showManual: event => {
        // When manually showing the dialog, event details should contain the
        // element that was interacted with. Important to note that the `target`
        // is the element that was *interacted with*, which is not always the
        // element with the `data-a11y-dialog-show` attribute (which could be an
        // ancestor).
        const target = event.detail.target

        expect(target.getAttribute('data-testid')).to.eq('inside-span')
        expect(
          target
            .closest('[data-a11y-dialog-show]')
            .getAttribute('data-a11y-dialog-show')
        ).to.eq('my-dialog')
        expect(event.target.id).to.eq('my-dialog')
      },
      showPrevented: event => event.preventDefault(),
      hide: event => {
        // When programmatically hiding the dialog, event details are not set.
        expect(event.detail).to.eq(null)
        expect(event.target.id).to.eq('my-dialog')
      },
      hideManual: event => {
        // When manually showing the dialog, event details should contain the
        // closer.
        expect(event.detail.target.hasAttribute('data-a11y-dialog-hide'))
        expect(event.target.id).to.eq('my-dialog')
      },
      hidePrevented: event => event.preventDefault(),
      hideConditionallyPrevented: event => {
        if (event.detail?.key === 'Escape') event.preventDefault()
      },
      destroy: event => {
        expect(event.target.id).to.eq('my-dialog')
      },
    }

    cy.log('Spy on handlers to know whether they’ve been called')
    cy.spy(handlers, 'show').as('show')
    cy.spy(handlers, 'hide').as('hide')
    cy.spy(handlers, 'showManual').as('showManual')
    cy.spy(handlers, 'hideManual').as('hideManual')
    cy.spy(handlers, 'showPrevented').as('showPrevented')
    cy.spy(handlers, 'hidePrevented').as('hidePrevented')
    cy.spy(handlers, 'hideConditionallyPrevented').as(
      'hideConditionallyPrevented'
    )
    cy.spy(handlers, 'destroy').as('destroy')

    cy.log(
      'Programmatically show the dialog and ensure the show handler has been called'
    )
    cy.window().its('instance').invoke('on', 'show', handlers.show)
    cy.window().its('instance').invoke('show')
    cy.get('@show').should('have.been.called')
    cy.get('.dialog').then(shouldBeVisible)
    cy.window().its('instance').invoke('off', 'show', handlers.show)

    cy.log(
      'Programmatically hide the dialog and ensure the hide handler has been called'
    )
    cy.window().its('instance').invoke('on', 'hide', handlers.hide)
    cy.window().its('instance').invoke('hide')
    cy.get('@hide').should('have.been.called')
    cy.get('.dialog').then(shouldBeHidden)
    cy.window().its('instance').invoke('off', 'hide', handlers.hide)

    cy.log(
      'Replace the show handler with one that test for a manual action, and manually show the dialog to ensure it was called properly'
    )
    cy.window().its('instance').invoke('on', 'show', handlers.showManual)
    cy.get('[data-a11y-dialog-show="my-dialog"]').click()
    cy.get('@showManual').should('have.been.called')
    cy.get('.dialog').then(shouldBeVisible)
    cy.window().its('instance').invoke('off', 'show', handlers.showManual)

    cy.log(
      'Replace the hide handler with one that test for a manual action, and manually hide the dialog to ensure it was called properly'
    )
    cy.window().its('instance').invoke('on', 'hide', handlers.hideManual)
    cy.get('[data-a11y-dialog-hide').last().click()
    cy.get('@hideManual').should('have.been.called')
    cy.get('.dialog').then(shouldBeHidden)
    cy.window().its('instance').invoke('off', 'hide', handlers.hideManual)

    cy.log(
      'Replace the show handler with one that prevents the action, and attempt to show the dialog to ensure it was called properly'
    )
    cy.window().its('instance').invoke('on', 'show', handlers.showPrevented)
    cy.get('[data-a11y-dialog-show="my-dialog"]').click()
    cy.get('@showPrevented').should('have.been.called')
    cy.get('.dialog').then(shouldBeHidden)
    cy.window().its('instance').invoke('off', 'show', handlers.showPrevented)

    cy.log(
      'Replace the hide handler with one that prevents the action, and attempt to hide the dialog to ensure it was called properly'
    )
    cy.window().its('instance').invoke('on', 'hide', handlers.hidePrevented)
    cy.get('[data-a11y-dialog-show="my-dialog"]').click()
    cy.get('.dialog').then(shouldBeVisible)
    cy.get('[data-a11y-dialog-hide').last().click()
    cy.get('@hidePrevented').should('have.been.called')
    cy.get('.dialog').then(shouldBeVisible)
    cy.window().its('instance').invoke('off', 'hide', handlers.hidePrevented)
    cy.get('[data-a11y-dialog-hide').last().click()
    cy.get('.dialog').then(shouldBeHidden)

    cy.log(
      'Replace the hide handler with one that conditionally prevents the action, and attempt to hide the dialog to ensure it was called properly'
    )
    cy.window()
      .its('instance')
      .invoke('on', 'hide', handlers.hideConditionallyPrevented)
    // Open the dialog and expect it to be visible
    cy.get('[data-a11y-dialog-show="my-dialog"]').click()
    cy.get('.dialog').then(shouldBeVisible)
    // Close it with a button and expect it to be hidden
    cy.get('[data-a11y-dialog-hide').last().click()
    cy.get('@hideConditionallyPrevented').should('have.been.called')
    cy.get('.dialog').then(shouldBeHidden)
    // Open the dialog and expect it to be visible
    cy.get('[data-a11y-dialog-show="my-dialog"]').click()
    cy.get('.dialog').then(shouldBeVisible)
    // Close it with ESC and expect it to still be visible
    cy.realPress('Escape')
    cy.get('@hideConditionallyPrevented').should('have.been.called')
    cy.get('.dialog').then(shouldBeVisible)
    // Remove the event prevention, close it with ESC and expect it to be hidden
    cy.window()
      .its('instance')
      .invoke('off', 'hide', handlers.hideConditionallyPrevented)
    cy.realPress('Escape')
    cy.get('.dialog').then(shouldBeHidden)

    cy.log('Destroy the dialog and ensure the destroy handler has been called')
    cy.window().its('instance').invoke('on', 'destroy', handlers.destroy)
    cy.window().its('instance').invoke('destroy')
    cy.get('@destroy').should('have.been.called')
    cy.window().its('instance').invoke('off', 'destroy', handlers.destroy)
  })

  it('should be possible to handle dialog destroy', () => {
    cy.get('[data-a11y-dialog-show="my-dialog"]').click()
    cy.get('.dialog').then(shouldBeHidden)
  })
})
