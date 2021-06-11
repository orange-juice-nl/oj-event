"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var getNamespace = function (arr) { return arr.slice(1).join(".") || arr[0]; };
var debounce = function (fn, threshhold, scope) {
    if (threshhold === void 0) { threshhold = 100; }
    if (scope === void 0) { scope = null; }
    var deferTimer;
    return function () {
        var args = arguments;
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () { return fn.apply(scope, args); }, threshhold);
    };
};
var has = function (event) {
    var _this = this;
    if (Array.isArray(event))
        return !!event.find(function (x) { return _this.has(x); });
    var arr = event.split('.');
    var nsp = getNamespace(arr);
    var type = arr[0];
    return this.namespaces && this.namespaces[nsp] && typeof this.namespaces[nsp][type] === "function";
};
var on = function (event, cb, opts) {
    var _this = this;
    if (!opts)
        opts === false;
    if (Array.isArray(event)) {
        cb = debounce(cb, 10);
        event.forEach(function (e) { return _this.on(e, cb, opts); });
        return this;
    }
    var arr = event.split('.');
    var nsp = getNamespace(arr);
    var type = arr[0];
    if (!this.namespaces)
        this.namespaces = {};
    if (!this.namespaces[nsp])
        this.namespaces[nsp] = {};
    if (this.namespaces[nsp][type])
        this.removeEventListener(type, this.namespaces[nsp][type]);
    this.namespaces[nsp][type] = function (e) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (opts && opts.preventDefault)
            e.preventDefault();
        if (opts && opts.stopPropagation)
            e.stopPropagation();
        return cb.apply(void 0, __spreadArray([e], args));
    };
    this.addEventListener(type, this.namespaces[nsp][type], opts);
    return this;
};
var off = function (event) {
    var _this = this;
    if (Array.isArray(event)) {
        event.forEach(function (e) { return _this.off(e); });
        return this;
    }
    var arr = event.split('.');
    var nsp = getNamespace(arr);
    var type = arr[0];
    if (!this.namespaces || !this.namespaces[nsp] || !this.namespaces[nsp][type])
        return this;
    try {
        this.removeEventListener(type, this.namespaces[nsp][type]);
        delete this.namespaces[nsp][type];
    }
    catch (err) {
        console.error(err);
    }
    return this;
};
window.has = document.has = Element.prototype.has = has;
window.on = document.on = Element.prototype.on = on;
window.off = document.off = Element.prototype.off = off;
