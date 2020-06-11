declare namespace A11yDialog {
  export type Targets = NodeList | Element | string;
  export type EventHandler = (node: Element, event?: Event) => void;

  export class A11yDialog {
    constructor(node: Element, targets?: Targets);

    create(targets: DialogTargets): A11yDialog;

    show(event: Event): A11yDialog;

    hide(event: Event): A11yDialog;

    destroy(): A11yDialog;

    on(type: string, handler: EventHandler): A11yDialog;

    off(type: string, handler: EventHandler): A11yDialog;

    private _fire(type: string, event: Event): void;

    private _bindKeypress(event: Event): void;

    private _maintainFocus(event: Event): void;
  }
}

export = A11yDialog;
