import { shouldBeHidden, shouldBeVisible } from './utils'

describe('Instance', () => {
  before(() => cy.visit('/tests/instance'))

  it('should be possible to instantiate a dialog with JavaScript', () => {
    cy.window().then(win => {
      win.instance = new win.A11yDialog(
        win.document.getElementById('my-dialog'),
        'main'
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
      .its('container')
      .should('have.attr', 'id', 'my-dialog')
  })

  it('should expose the dialog element on the instance', () => {
    cy.window()
      .its('instance')
      .its('dialog')
      .should('have.attr', 'class', 'dialog-content')
  })

  it('should be possible to register/unregister events', () => {
    let logs = []

    function event(container) {
      logs.push('Should Not Fire')
    }

    cy.window()
      .its('instance')

      .invoke('on', 'show', container => {
        expect(container.id).to.eq('my-dialog')
        logs.push('Shown')
      })

      .invoke('on', 'hide', container => {
        expect(container.id).to.eq('my-dialog')
        logs.push('Hidden')
      })

      .invoke('on', 'hide', event)
      .invoke('off', 'hide', event)

      .invoke('on', 'destroy', container => {
        expect(container.id).to.eq('my-dialog')
        logs.push('Destroyed')
      })

      .invoke('show')
      .invoke('hide')
      .invoke('destroy')

    cy.wrap(logs).should('deep.equal', ['Shown', 'Hidden', 'Destroyed'])
  })

  it('should be possible to handle dialog destroy', () => {
    cy.get('[data-a11y-dialog-show="my-dialog"]').click()
    cy.get('.dialog').then(shouldBeHidden)
  })
})
