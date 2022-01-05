"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var getNamespace = function (arr) { return arr.slice(1).join(".") || arr[0]; };
var debounce = function (fn, threshold) {
    if (threshold === void 0) { threshold = 100; }
    var t;
    return (function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        clearTimeout(t);
        t = setTimeout(function () { return fn.apply(void 0, args); }, threshold);
    });
};
var has = function (event) {
    var _this = this;
    if (Array.isArray(event))
        return !!event.find(function (x) { return _this.has(x); });
    var arr = event.split(".");
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
    var arr = event.split(".");
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
        return cb.apply(void 0, __spreadArray([e], args, false));
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
    var arr = event.split(".");
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
var once = function (event, cb, opts) {
    var _this = this;
    on.call(this, event, function (e) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        off.call(_this, event);
        return cb.apply(void 0, __spreadArray([e], args, false));
    }, opts);
    return this;
};
window.has = document.has = Element.prototype.has = has;
window.on = document.on = Element.prototype.on = on;
window.once = document.once = Element.prototype.once = once;
window.off = document.off = Element.prototype.off = off;
