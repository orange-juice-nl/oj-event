export interface IOptions { preventDefault?: boolean; stopPropagation?: boolean; capture?: boolean; passive?: boolean }

const getNamespace = arr => arr.slice(1).join(".") || arr[0]

const debounce = (fn: any, threshhold: number = 100, scope: any = null): any => {
  let deferTimer: number
  return function () {
    const args: any = arguments
    clearTimeout(deferTimer)
    deferTimer = setTimeout(() => fn.apply(scope, args), threshhold) as any
  }
}

const has = function (event: string | string[]) {
  if (Array.isArray(event)) return !!event.find(x => this.has(x))
  const arr = event.split('.')
  const nsp = getNamespace(arr)
  const type = arr[0]
  return this.namespaces && this.namespaces[nsp] && typeof this.namespaces[nsp][type] === "function"
}

const on = function (event: string | string[], cb: Function, opts?: IOptions) {
  if (!opts) opts === false
  if (Array.isArray(event)) {
    cb = debounce(cb, 10)
    event.forEach(e => this.on(e, cb, opts))
    return this
  }
  const arr = event.split('.')
  const nsp = getNamespace(arr)
  const type = arr[0]
  if (!this.namespaces) this.namespaces = {}
  if (!this.namespaces[nsp]) this.namespaces[nsp] = {}
  if (this.namespaces[nsp][type]) this.removeEventListener(type, this.namespaces[nsp][type])
  this.namespaces[nsp][type] = (e, ...args) => {
    if (opts && opts.preventDefault) e.preventDefault()
    if (opts && opts.stopPropagation) e.stopPropagation()
    return cb(e, ...args)
  }
  this.addEventListener(type, this.namespaces[nsp][type], opts)
  return this
}

const off = function (event: string | string[]) {
  if (Array.isArray(event)) {
    event.forEach(e => this.off(e))
    return this
  }

  const arr = event.split('.')
  const nsp = getNamespace(arr)
  const type = arr[0]

  if (!this.namespaces || !this.namespaces[nsp] || !this.namespaces[nsp][type])
    return this

  try {
    this.removeEventListener(type, this.namespaces[nsp][type])
    delete this.namespaces[nsp][type]
  } catch (err) {
    console.error(err)
  }

  return this
}

declare global {
  interface Window {
    has: (event: string | string[]) => boolean
    on: (event: string | string[], cb: Function, opts?: object) => this
    off: (event: string | string[]) => this
  }

  interface Document {
    has: (event: string | string[]) => boolean
    on: (event: string | string[], cb: Function, opts?: object) => this
    off: (event: string | string[]) => this
  }

  interface Element {
    has: (event: string | string[]) => boolean
    on: (event: string | string[], cb: Function, opts?: object) => this
    off: (event: string | string[]) => this
  }
}

window.has = document.has = Element.prototype.has = has
window.on = document.on = Element.prototype.on = on
window.off = document.off = Element.prototype.off = off