export interface IOptions {
    preventDefault?: boolean;
    stopPropagation?: boolean;
    capture?: boolean;
    passive?: boolean;
}
declare global {
    interface Window {
        has: (event: string | string[]) => boolean;
        on: (event: string | string[], cb: Function, opts?: object) => this;
        off: (event: string | string[]) => this;
    }
    interface Document {
        has: (event: string | string[]) => boolean;
        on: (event: string | string[], cb: Function, opts?: object) => this;
        off: (event: string | string[]) => this;
    }
    interface Element {
        has: (event: string | string[]) => boolean;
        on: (event: string | string[], cb: Function, opts?: object) => this;
        off: (event: string | string[]) => this;
    }
}
