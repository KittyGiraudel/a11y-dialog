declare namespace A11yDialog {
  export type EventHandler = (node: Element, event?: Event) => void;
  export type EventType = "show" | "hide" | "destroy" | "create";
	export type ListenersRecord = Record<EventType, EventHandler[]>;

  export class A11yDialog {
    private id: string

    private $el: HTMLElement;

    private listeners: ListenersRecord;

    private openers: HTMLElement[];

    private closers: HTMLElement[];

    private previouslyFocused: null | HTMLElement;

    private shown: boolean;

    constructor(element: Element);

    create(): A11yDialog;

    show(event?: Event): A11yDialog;

    hide(event?: Event): A11yDialog;

    destroy(): A11yDialog;

    on(type: EventType, handler: EventHandler): A11yDialog;

    off(type: EventType, handler: EventHandler): A11yDialog;

    private fire(type: EventType, event: Event): void;

    private bindKeypress(event: Event): void;

    private maintainFocus(event: Event): void;
  }
}

export = A11yDialog;
