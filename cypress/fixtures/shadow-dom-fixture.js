window.customElements.define(
  'fancy-button',
  class FancyButton extends HTMLElement {
    constructor() {
      super()

      this.attachShadow({
        delegatesFocus: true,
        mode: 'open',
      }).innerHTML = /* html */ `
        <style>
        *:focus-visible { outline: 2px solid #005ec2; outline-offset: 2px }
        :host { display: inline-block; }
        button {
          appareance: none;
          border: 2px solid #005ec2;
          border-radius: 4px;
          background-color: #007bff;
          color: white;
          cursor: pointer;
          display: inline-block;
          font: inherit;
          padding: 0.25em 0.75em;
        }
        </style>
        <button part="root">
          <slot></slot>
        </button>
      `
    }
  }
)
window.customElements.define(
  'fancy-card',
  class MyCard extends HTMLElement {
    constructor() {
      super()

      this.attachShadow({ mode: 'open' }).innerHTML = /* html */ `
        <style>
          :host { contain: content; margin-block: 1em; }
          .container {
            background-color: aliceblue;
            border: 1px solid skyblue;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            margin-top: 1em;
            padding: 0.5em;
          }
          .container > * + * { margin-top: 1em; }
        </style>
        <div class="container">
          <slot></slot>
          <fancy-button>I’m in the card’s Shadow DOM</fancy-button>
        </div>
      `
    }
  }
)
window.customElements.define(
  'fancy-div',
  class MyCard extends HTMLElement {
    constructor() {
      super()

      this.attachShadow({ mode: 'open' }).innerHTML = /* html */ `
        <style>
          :host { contain: content; display: inline-block; }
        </style>
        <div>
          <slot></slot>
        </div>
      `
    }
  }
)
