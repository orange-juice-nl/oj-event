# Event
Adds `on`, `off` and `has` methods to the Window, Document and Element prototypes.

## Usage

### import
```typescript
import "oj-event";
```

## on
`on(event: string | string[], cb: Function, opts?: IOptions): this`
- adds the namespaced callback as an eventListener
- this will override any previous events with the same namespace
- **if event is an array** will recursively call on with each event

`htmlElement.on("click.namespace", e => { ... });`

## off
`on(event: string | string[]): this`
- removes the namespaced event
- **if event is an array** will recursively call off with each event

`htmlElement.off("click.namespace");`

## has
`on(event: string | string[]): boolean`
- returns true if the event or all events are subscribed

`htmlElement.has("click.namespace");`

## Types

### IOptions
```typescript
{ 
  preventDefault?: boolean
  stopPropagation?: boolean
  capture?: boolean
  passive?: boolean 
 }
```