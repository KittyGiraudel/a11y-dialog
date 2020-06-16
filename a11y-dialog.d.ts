declare namespace A11yDialog {
  export type Targets = NodeList | Element | string;
  export type EventHandler = (node: Element, event?: Event) => void;
  export type EventType = "show" | "hide" | "destroy" | "create";

  export class A11yDialog {
    constructor(node: Element, targets?: Targets);

    create(targets: Targets): A11yDialog;

    show(event?: Event): A11yDialog;

    hide(event?: Event): A11yDialog;

    destroy(): A11yDialog;

    on(type: EventType, handler: EventHandler): A11yDialog;

    off(type: EventType, handler: EventHandler): A11yDialog;

    private _fire(type: EventType, event: Event): void;

    private _bindKeypress(event: Event): void;

    private _maintainFocus(event: Event): void;
  }
}

export = A11yDialog;
