describe('Instance', () => {
  before(() => cy.visit('/tests/instance'))

  it('should be possible to instantiate a dialog with JavaScript', () => {
    cy.window().then(win => {
      win.instance = new win.A11yDialog(
        win.document.getElementById('my-accessible-dialog'),
        'main'
      )
    })
  })

  it('should expose a show method on the instance', () => {
    cy.window().its('instance').invoke('show')
    cy.get('.dialog').should('not.have.attr', 'aria-hidden')
    cy.get('.dialog-content').should('be.visible')
  })

  it('should expose status on the instance', () => {
    cy.window().its('instance').its('shown').should('eq', true)
  })

  it('should expose a hide method on the instance', () => {
    cy.window().its('instance').invoke('hide')
    cy.get('.dialog').should('have.attr', 'aria-hidden', 'true')
    cy.get('.dialog-overlay').should('not.be.visible')
    cy.window().its('instance').its('shown').should('eq', false)
  })

  it('should expose the container on the instance', () => {
    cy.window()
      .its('instance')
      .its('container')
      .should('have.attr', 'id', 'my-accessible-dialog')
  })

  it('should expose the dialog element on the instance', () => {
    cy.window()
      .its('instance')
      .its('dialog')
      .should('have.attr', 'class', 'dialog-content')
  })

  it('should be possible to register events', () => {
    let logs = []

    cy.window()
      .its('instance')

      .invoke('on', 'show', container => {
        expect(container.id).to.eq('my-accessible-dialog')
        logs.push('Shown')
      })

      .invoke('on', 'hide', container => {
        expect(container.id).to.eq('my-accessible-dialog')
        logs.push('Hidden')
      })

      .invoke('on', 'destroy', container => {
        expect(container.id).to.eq('my-accessible-dialog')
        logs.push('Destroyed')
      })
      .invoke('show')
      .invoke('hide')
      .invoke('destroy')

    cy.wrap(logs).should('deep.equal', ['Shown', 'Hidden', 'Destroyed'])
  })

  it('should be possible to handle dialog destroy', () => {
    cy.get('[data-a11y-dialog-show="my-accessible-dialog"]').click()
    cy.get('.dialog').should('have.attr', 'aria-hidden', 'true')
    cy.get('.dialog-overlay').should('not.be.visible')
  })
})
