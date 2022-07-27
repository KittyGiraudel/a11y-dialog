import { shouldBeHidden, shouldBeVisible } from './utils'

describe('Instance', () => {
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

  it('should be possible to register/unregister events', () => {
    const handlers = {
      show: event => {
        // When programmatically showing the dialog, event details are not set.
        expect(event.detail).to.eq(null)
        expect(event.target.id).to.eq('my-dialog')
      },
      showManual: event => {
        // When manually showing the dialog, event details should contain the
        // opener.
        expect(
          event.detail.currentTarget.getAttribute('data-a11y-dialog-show')
        ).to.eq('my-dialog')
        expect(event.target.id).to.eq('my-dialog')
      },
      hide: event => {
        // When programmatically hiding the dialog, event details are not set.
        expect(event.detail).to.eq(null)
        expect(event.target.id).to.eq('my-dialog')
      },
      hideManual: event => {
        // When manually showing the dialog, event details should contain the
        // closeer.
        expect(event.detail.currentTarget.hasAttribute('data-a11y-dialog-hide'))
        expect(event.target.id).to.eq('my-dialog')
      },
      destroy: event => {
        expect(event.target.id).to.eq('my-dialog')
      },
    }

    // Spy on handlers to know whether they’ve been called
    cy.spy(handlers, 'show').as('show')
    cy.spy(handlers, 'hide').as('hide')
    cy.spy(handlers, 'showManual').as('showManual')
    cy.spy(handlers, 'hideManual').as('hideManual')
    cy.spy(handlers, 'destroy').as('destroy')

    // Register event listeners on show, hide and destroy events
    cy.window()
      .its('instance')
      .invoke('on', 'show', handlers.show)
      .invoke('on', 'hide', handlers.hide)
      .invoke('on', 'destroy', handlers.destroy)

    // Programmatically show the dialog and ensure the show handler has been
    // called
    cy.window().its('instance').invoke('show')
    cy.get('@show').should('have.been.called')

    // Programmatically hide the dialog and ensure the hide handler has been
    // called
    cy.window().its('instance').invoke('hide')
    cy.get('@hide').should('have.been.called')

    // Replace the show handler with one that test for a manual action, and
    // manually show the dialog to ensure it was called properly
    cy.window().its('instance').invoke('off', 'show', handlers.show)
    cy.window().its('instance').invoke('on', 'show', handlers.showManual)
    cy.get('[data-a11y-dialog-show="my-dialog"]').click()
    cy.get('@showManual').should('have.been.called')

    // Replace the hide handler with one that test for a manual action, and
    // manually hide the dialog to ensure it was called properly
    cy.window().its('instance').invoke('off', 'hide', handlers.hide)
    cy.window().its('instance').invoke('on', 'hide', handlers.hideManual)
    cy.get('[data-a11y-dialog-hide').last().click()
    cy.get('@hideManual').should('have.been.called')

    // Destroy the dialog and ensure the destroy handler has been called
    cy.window().its('instance').invoke('destroy')
    cy.get('@destroy').should('have.been.called')
  })

  it('should be possible to handle dialog destroy', () => {
    cy.get('[data-a11y-dialog-show="my-dialog"]').click()
    cy.get('.dialog').then(shouldBeHidden)
  })
})
