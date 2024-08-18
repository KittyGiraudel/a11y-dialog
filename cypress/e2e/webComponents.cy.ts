import { shouldBeHidden, shouldBeVisible } from './utils.ts'

describe('Web Components', () => {
  beforeEach(() => cy.visit('/web-components'))

  it('should focus the dialog container on open', () => {
    cy.get('my-dialog').shadow().find('[data-show]').first().click()
    cy.get('my-dialog').then(shouldBeVisible)
    cy.get('my-dialog').should('have.focus')
  })

  it('should close with ESC', () => {
    cy.get('my-dialog').shadow().find('[data-show]').first().click()
    cy.realPress('Escape')
    cy.get('my-dialog').then(shouldBeHidden)
  })

  it('should close with close button', () => {
    cy.get('my-dialog').shadow().find('[data-show]').first().click()
    cy.get('my-dialog').shadow().find('.dialog-close').click()
    cy.get('my-dialog').then(shouldBeHidden)
  })

  it('should restore focus to the previously focused element', () => {
    cy.get('my-dialog').shadow().find('[data-show]').first().click()
    cy.get('my-dialog').shadow().find('.dialog-close').click()
    cy.get('my-dialog')
      .shadow()
      .find('[data-show]')
      .first()
      .should('have.focus')
  })

  it('should handle opening and closing with a custom element', () => {
    // In a custom element, the event target ends up being the shadow root which
    // is the custom dialog element in this instance
    const handlers = {
      show: event => {
        expect(event.detail.target.tagName).to.eq('MY-DIALOG')
        expect(event.detail.composedPath()[0].tagName).to.eq('FANCY-BUTTON')
      },
      hide: event => {
        expect(event.detail.target.tagName).to.eq('MY-DIALOG')
        expect(event.detail.composedPath()[0].tagName).to.eq('FANCY-BUTTON')
      },
    }

    cy.spy(handlers, 'show').as('show')
    cy.spy(handlers, 'hide').as('hide')
    cy.window().its('instance').invoke('on', 'show', handlers.show)
    cy.window().its('instance').invoke('on', 'hide', handlers.hide)
    cy.get('my-dialog').shadow().find('fancy-button').first().click()
    cy.get('@show').should('have.been.called')
    cy.get('my-dialog').then(shouldBeVisible)
    cy.get('my-dialog').shadow().find('fancy-button').last().click()
    cy.get('@hide').should('have.been.called')
    cy.get('my-dialog').then(shouldBeHidden)
    cy.window().its('instance').invoke('off', 'show', handlers.show)
    cy.window().its('instance').invoke('off', 'hide', handlers.hide)
  })
})
