/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';
var aa = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
    if (a == Array.prototype || a == Object.prototype) return a;
    a[b] = c.value;
    return a
};

function ca(a) {
    a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
    for (var b = 0; b < a.length; ++b) {
        var c = a[b];
        if (c && c.Math == Math) return c
    }
    throw Error("Cannot find global object");
}
var da = ca(this);

function ea(a, b) {
    if (b) a: {
        var c = da;a = a.split(".");
        for (var d = 0; d < a.length - 1; d++) {
            var e = a[d];
            if (!(e in c)) break a;
            c = c[e]
        }
        a = a[a.length - 1];d = c[a];b = b(d);b != d && null != b && aa(c, a, {
            configurable: !0,
            writable: !0,
            value: b
        })
    }
}
ea("Object.entries", function(a) {
    return a ? a : function(b) {
        var c = [],
            d;
        for (d in b) Object.prototype.hasOwnProperty.call(b, d) && c.push([d, b[d]]);
        return c
    }
});
ea("Array.prototype.includes", function(a) {
    return a ? a : function(b, c) {
        var d = this;
        d instanceof String && (d = String(d));
        var e = d.length;
        c = c || 0;
        for (0 > c && (c = Math.max(c + e, 0)); c < e; c++) {
            var f = d[c];
            if (f === b || Object.is(f, b)) return !0
        }
        return !1
    }
});
ea("String.prototype.matchAll", function(a) {
    return a ? a : function(b) {
        if (b instanceof RegExp && !b.global) throw new TypeError("RegExp passed into String.prototype.matchAll() must have global tag.");
        var c = new RegExp(b, b instanceof RegExp ? void 0 : "g"),
            d = this,
            e = !1,
            f = {
                next: function() {
                    if (e) return {
                        value: void 0,
                        done: !0
                    };
                    var g = c.exec(d);
                    if (!g) return e = !0, {
                        value: void 0,
                        done: !0
                    };
                    "" === g[0] && (c.lastIndex += 1);
                    return {
                        value: g,
                        done: !1
                    }
                }
            };
        f[Symbol.iterator] = function() {
            return f
        };
        return f
    }
});
ea("Promise.prototype.finally", function(a) {
    return a ? a : function(b) {
        return this.then(function(c) {
            return Promise.resolve(b()).then(function() {
                return c
            })
        }, function(c) {
            return Promise.resolve(b()).then(function() {
                throw c;
            })
        })
    }
});
var p = this || self;

function q(a, b) {
    a = a.split(".");
    b = b || p;
    for (var c = 0; c < a.length; c++)
        if (b = b[a[c]], null == b) return null;
    return b
}

function fa() {}

function u(a, b) {
    a = a.split(".");
    var c = p;
    a[0] in c || "undefined" == typeof c.execScript || c.execScript("var " + a[0]);
    for (var d; a.length && (d = a.shift());) a.length || void 0 === b ? c[d] && c[d] !== Object.prototype[d] ? c = c[d] : c = c[d] = {} : c[d] = b
}

function ha(a, b) {
    function c() {}
    c.prototype = b.prototype;
    a.za = b.prototype;
    a.prototype = new c;
    a.prototype.constructor = a;
    a.Ga = function(d, e, f) {
        for (var g = Array(arguments.length - 2), h = 2; h < arguments.length; h++) g[h - 2] = arguments[h];
        return b.prototype[e].apply(d, g)
    }
};

function ia(a, b) {
    if (Error.captureStackTrace) Error.captureStackTrace(this, ia);
    else {
        const c = Error().stack;
        c && (this.stack = c)
    }
    a && (this.message = String(a));
    void 0 !== b && (this.ma = b)
}
ha(ia, Error);
ia.prototype.name = "CustomError";

function ja(a, b) {
    Array.prototype.forEach.call(a, b, void 0)
}

function ka(a, b) {
    for (let d = 1; d < arguments.length; d++) {
        const e = arguments[d];
        var c = typeof e;
        c = "object" != c ? c : e ? Array.isArray(e) ? "array" : c : "null";
        if ("array" == c || "object" == c && "number" == typeof e.length) {
            c = a.length || 0;
            const f = e.length || 0;
            a.length = c + f;
            for (let g = 0; g < f; g++) a[c + g] = e[g]
        } else a.push(e)
    }
};

function la(a) {
    if (!a || "object" !== typeof a) return a;
    if ("function" === typeof a.clone) return a.clone();
    if ("undefined" !== typeof Map && a instanceof Map) return new Map(a);
    if ("undefined" !== typeof Set && a instanceof Set) return new Set(a);
    const b = Array.isArray(a) ? [] : "function" !== typeof ArrayBuffer || "function" !== typeof ArrayBuffer.isView || !ArrayBuffer.isView(a) || a instanceof DataView ? {} : new a.constructor(a.length);
    for (const c in a) b[c] = la(a[c]);
    return b
}
const ma = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");

function na(a, b) {
    let c, d;
    for (let e = 1; e < arguments.length; e++) {
        d = arguments[e];
        for (c in d) a[c] = d[c];
        for (let f = 0; f < ma.length; f++) c = ma[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
};

function oa() {}

function x(a) {
    return new oa(pa, a)
}
var pa = {};
x("");
var qa = String.prototype.trim ? function(a) {
    return a.trim()
} : function(a) {
    return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]
};
var ra;
a: {
    var sa = p.navigator;
    if (sa) {
        var ta = sa.userAgent;
        if (ta) {
            ra = ta;
            break a
        }
    }
    ra = ""
}

function y(a) {
    return -1 != ra.indexOf(a)
};

function ua() {
    return y("Firefox") || y("FxiOS")
}

function va() {
    return (y("Chrome") || y("CriOS")) && !y("Edge")
};
var A = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");

function wa(a) {
    return a ? decodeURI(a) : a
}

function xa(a, b, c) {
    if (Array.isArray(b))
        for (var d = 0; d < b.length; d++) xa(a, String(b[d]), c);
    else null != b && c.push(a + ("" === b ? "" : "=" + encodeURIComponent(String(b))))
}

function ya(a) {
    var b = [],
        c;
    for (c in a) xa(c, a[c], b);
    return b.join("&")
};

function za(a, b) {
    b = String.fromCharCode.apply(null, b);
    return null == a ? b : a + b
}
let Aa;
const Ba = "undefined" !== typeof TextDecoder;
const Ca = "function" === typeof Uint8Array.prototype.slice;
let Da;

function Ea(a, b, c, d) {
    if (Fa.length) {
        const e = Fa.pop();
        d && (e.J = d.J);
        a && Ga(e, a, b, c);
        return e
    }
    return new Ha(a, b, c, d)
}

function Ga(a, b, c, d) {
    b = b.constructor === Uint8Array ? b : b.constructor === ArrayBuffer ? new Uint8Array(b) : b.constructor === Array ? new Uint8Array(b) : b.constructor === String ? Ia(b) : b instanceof Uint8Array ? new Uint8Array(b.buffer, b.byteOffset, b.byteLength) : new Uint8Array(0);
    a.i = b;
    a.l = void 0 !== c ? c : 0;
    a.j = void 0 !== d ? a.l + d : a.i.length;
    a.h = a.l
}

function Ka(a) {
    const b = a.i;
    let c = b[a.h + 0],
        d = c & 127;
    if (128 > c) return a.h += 1, d;
    c = b[a.h + 1];
    d |= (c & 127) << 7;
    if (128 > c) return a.h += 2, d;
    c = b[a.h + 2];
    d |= (c & 127) << 14;
    if (128 > c) return a.h += 3, d;
    c = b[a.h + 3];
    d |= (c & 127) << 21;
    if (128 > c) return a.h += 4, d;
    c = b[a.h + 4];
    d |= (c & 15) << 28;
    if (128 > c) return a.h += 5, d >>> 0;
    a.h += 5;
    128 <= b[a.h++] && 128 <= b[a.h++] && 128 <= b[a.h++] && 128 <= b[a.h++] && a.h++;
    return d
}
var Ha = class {
        constructor(a, b, c, {
            J: d = !1
        } = {}) {
            this.i = null;
            this.h = this.j = this.l = 0;
            this.m = !1;
            this.J = d;
            a && Ga(this, a, b, c)
        }
        clone() {
            return Ea(this.i, this.l, this.j - this.l)
        }
        clear() {
            this.i = null;
            this.h = this.j = this.l = 0;
            this.J = this.m = !1
        }
        reset() {
            this.h = this.l
        }
        advance(a) {
            this.h += a
        }
    },
    Fa = [];

function La(a) {
    var b = a.h;
    (b = b.h == b.j) || (b = a.j) || (b = a.h, b = b.m || 0 > b.h || b.h > b.j);
    if (b) return !1;
    a.s = a.h.h;
    b = Ka(a.h);
    const c = b & 7;
    if (0 != c && 5 != c && 1 != c && 2 != c && 3 != c && 4 != c) return a.j = !0, !1;
    a.m = b;
    a.l = b >>> 3;
    a.i = c;
    return !0
}

function B(a) {
    switch (a.i) {
        case 0:
            if (0 != a.i) B(a);
            else {
                for (a = a.h; a.i[a.h] & 128;) a.h++;
                a.h++
            }
            break;
        case 1:
            1 != a.i ? B(a) : a.h.advance(8);
            break;
        case 2:
            if (2 != a.i) B(a);
            else {
                var b = Ka(a.h);
                a.h.advance(b)
            }
            break;
        case 5:
            5 != a.i ? B(a) : a.h.advance(4);
            break;
        case 3:
            b = a.l;
            do {
                if (!La(a)) {
                    a.j = !0;
                    break
                }
                if (4 == a.i) {
                    a.l != b && (a.j = !0);
                    break
                }
                B(a)
            } while (1);
            break;
        default:
            a.j = !0
    }
}
var Ma = class {
    constructor(a) {
        var {
            J: b = !1,
            ea: c = !1
        } = {};
        this.I = {
            J: b
        };
        this.ea = c;
        this.h = Ea(a, void 0, void 0, this.I);
        this.s = this.h.h;
        this.i = this.m = this.l = -1;
        this.j = !1
    }
    reset() {
        this.h.reset();
        this.i = this.l = -1
    }
    advance(a) {
        this.h.advance(a)
    }
};
ua();
!y("Android") || va() || ua();
va();
var Na = y("Safari") && !(va() || y("Coast") || y("Opera") || y("Edge") || y("Edg/") || y("OPR") || ua() || y("Silk") || y("Android")) && !(y("iPhone") && !y("iPod") && !y("iPad") || y("iPad") || y("iPod"));
var Oa = {},
    Pa = null;

function Qa(a, b) {
    void 0 === b && (b = 0);
    Ra();
    b = Oa[b];
    const c = Array(Math.floor(a.length / 3)),
        d = b[64] || "";
    let e = 0,
        f = 0;
    for (; e < a.length - 2; e += 3) {
        var g = a[e],
            h = a[e + 1],
            k = a[e + 2],
            l = b[g >> 2];
        g = b[(g & 3) << 4 | h >> 4];
        h = b[(h & 15) << 2 | k >> 6];
        k = b[k & 63];
        c[f++] = "" + l + g + h + k
    }
    l = 0;
    k = d;
    switch (a.length - e) {
        case 2:
            l = a[e + 1], k = b[(l & 15) << 2] || d;
        case 1:
            a = a[e], c[f] = "" + b[a >> 2] + b[(a & 3) << 4 | l >> 4] + k + d
    }
    return c.join("")
}

function Ia(a) {
    var b = a.length,
        c = 3 * b / 4;
    c % 3 ? c = Math.floor(c) : -1 != "=.".indexOf(a[b - 1]) && (c = -1 != "=.".indexOf(a[b - 2]) ? c - 2 : c - 1);
    var d = new Uint8Array(c),
        e = 0;
    Sa(a, function(f) {
        d[e++] = f
    });
    return d.subarray(0, e)
}

function Sa(a, b) {
    function c(k) {
        for (; d < a.length;) {
            var l = a.charAt(d++),
                n = Pa[l];
            if (null != n) return n;
            if (!/^[\s\xa0]*$/.test(l)) throw Error("Unknown base64 encoding at char: " + l);
        }
        return k
    }
    Ra();
    for (var d = 0;;) {
        var e = c(-1),
            f = c(0),
            g = c(64),
            h = c(64);
        if (64 === h && -1 === e) break;
        b(e << 2 | f >> 4);
        64 != g && (b(f << 4 & 240 | g >> 2), 64 != h && b(g << 6 & 192 | h))
    }
}

function Ra() {
    if (!Pa) {
        Pa = {};
        for (var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""), b = ["+/=", "+/", "-_=", "-_.", "-_"], c = 0; 5 > c; c++) {
            var d = a.concat(b[c].split(""));
            Oa[c] = d;
            for (var e = 0; e < d.length; e++) {
                var f = d[e];
                void 0 === Pa[f] && (Pa[f] = e)
            }
        }
    }
};
var Ta = "function" === typeof Uint8Array;

function Ua(a) {
    return null !== a && "object" == typeof a && !Array.isArray(a) && !(Ta && a instanceof Uint8Array)
}

function Va(a) {
    return Wa(a, b => b, b => new Uint8Array(b))
}

function Xa(a, b, c) {
    return "object" === typeof a ? Ta && !Array.isArray(a) && a instanceof Uint8Array ? c(a) : Wa(a, b, c) : b(a)
}

function Wa(a, b, c) {
    if (Array.isArray(a)) {
        var d = Array(a.length);
        for (var e = 0; e < a.length; e++) {
            var f = a[e];
            null != f && (d[e] = Xa(f, b, c))
        }
        Array.isArray(a) && a.X && Ya(d);
        return d
    }
    d = {};
    for (e in a) f = a[e], null != f && (d[e] = Xa(f, b, c));
    return d
}

function Za(a) {
    return Wa(a, b => "number" === typeof b ? isFinite(b) ? b : String(b) : b, b => Qa(b))
}
const $a = {
    X: {
        value: !0,
        configurable: !0
    }
};

function Ya(a) {
    Array.isArray(a) && !Object.isFrozen(a) && Object.defineProperties(a, $a);
    return a
};
let ab;

function bb(a, b, c) {
    var d = ab;
    ab = null;
    a || (a = d);
    d = this.constructor.ga;
    a || (a = d ? [d] : []);
    this.l = d ? 0 : -1;
    this.h = null;
    this.i = a;
    a: {
        d = this.i.length;a = d - 1;
        if (d && (d = this.i[a], Ua(d))) {
            this.m = a - this.l;
            this.j = d;
            break a
        }
        void 0 !== b && -1 < b ? (this.m = Math.max(b, a + 1 - this.l), this.j = null) : this.m = Number.MAX_VALUE
    }
    if (c)
        for (b = 0; b < c.length; b++) a = c[b], a < this.m ? (a += this.l, (d = this.i[a]) ? Ya(d) : this.i[a] = cb) : (db(this), (d = this.j[a]) ? Ya(d) : this.j[a] = cb)
}
const cb = Object.freeze(Ya([]));

function db(a) {
    let b = a.m + a.l;
    a.i[b] || (a.j = a.i[b] = {})
}

function C(a, b, c = !1) {
    return -1 === b ? null : c || b >= a.m ? a.j ? a.j[b] : void 0 : a.i[b + a.l]
}

function eb(a) {
    let b = C(a, 1, !1);
    null == b && (b = cb);
    b === cb && (b = Ya([]), fb(a, b, !1));
    return b
}

function fb(a, b, c = !1) {
    c || 1 >= a.m ? (db(a), a.j[1] = b) : a.i[1 + a.l] = b
}

function gb(a, b) {
    a.h || (a.h = {});
    let c = a.h[1];
    if (!c) {
        let d = eb(a);
        c = [];
        for (let e = 0; e < d.length; e++) c[e] = new b(d[e]);
        a.h[1] = c
    }
    return c
}
bb.prototype.toJSON = function() {
    const a = hb(ib(this, !1));
    return Za(a)
};

function ib(a, b) {
    if (a.h)
        for (let c in a.h) {
            const d = a.h[c];
            if (Array.isArray(d))
                for (let e = 0; e < d.length; e++) d[e] && ib(d[e], b);
            else d && ib(d, b)
        }
    return a.i
}

function hb(a) {
    let b, c = a.length,
        d = !1;
    for (let g = a.length; g--;) {
        let h = a[g];
        if (Array.isArray(h)) {
            var e = h;
            Array.isArray(h) && h.X && !h.length ? h = null : h = hb(h);
            h != e && (d = !0)
        } else if (Ua(h)) {
            a: {
                var f = h;e = {};
                let k = !1;
                for (let l in f) {
                    let n = f[l];
                    if (Array.isArray(n)) {
                        let r = n;
                        Array.isArray(n) && n.X && !n.length ? n = null : n = hb(n);
                        n != r && (k = !0)
                    }
                    null != n ? e[l] = n : k = !0
                }
                if (k) {
                    for (let l in e) {
                        f = e;
                        break a
                    }
                    f = null
                }
            }
            f != h && (d = !0);c--;
            continue
        }
        null == h && c == g + 1 ? (d = !0, c--) : d && (b || (b = a.slice(0, c)), b[g] = h)
    }
    if (!d) return a;
    b || (b = a.slice(0, c));
    f && b.push(f);
    return b
}
bb.prototype.clone = function() {
    var a = this.constructor,
        b = Va(ib(this, !1));
    ab = b;
    a = new a(b);
    ab = null;
    return a
};

function jb(a, b) {
    if (4 == b.i) return !1;
    var c = b.s;
    B(b);
    if (!b.ea) {
        var d = b.h.i;
        b = b.h.h;
        c = c === b ? Da || (Da = new Uint8Array(0)) : Ca ? d.slice(c, b) : new Uint8Array(d.subarray(c, b));
        (d = a.s) ? d.push(c): a.s = [c]
    }
    return !0
};

function D(a, b) {
    var c = void 0;
    return new(c || (c = Promise))(function(d, e) {
        function f(k) {
            try {
                h(b.next(k))
            } catch (l) {
                e(l)
            }
        }

        function g(k) {
            try {
                h(b["throw"](k))
            } catch (l) {
                e(l)
            }
        }

        function h(k) {
            k.done ? d(k.value) : (new c(function(l) {
                l(k.value)
            })).then(f, g)
        }
        h((b = b.apply(a, void 0)).next())
    })
};
x("csi.gstatic.com");
x("googleads.g.doubleclick.net");
x("pagead2.googlesyndication.com");
x("partner.googleadservices.com");
x("pubads.g.doubleclick.net");
x("securepubads.g.doubleclick.net");
x("tpc.googlesyndication.com");

function kb(a) {
    if (!a) return "";
    a = a.split("#")[0].split("?")[0];
    a = a.toLowerCase();
    0 == a.indexOf("//") && (a = window.location.protocol + a);
    /^[\w\-]*:\/\//.test(a) || (a = window.location.href);
    var b = a.substring(a.indexOf("://") + 3),
        c = b.indexOf("/"); - 1 != c && (b = b.substring(0, c));
    c = a.substring(0, a.indexOf("://"));
    if (!c) throw Error("URI is missing protocol: " + a);
    if ("http" !== c && "https" !== c && "chrome-extension" !== c && "moz-extension" !== c && "file" !== c && "android-app" !== c && "chrome-search" !== c && "chrome-untrusted" !== c && "chrome" !==
        c && "app" !== c && "devtools" !== c) throw Error("Invalid URI scheme in origin: " + c);
    a = "";
    var d = b.indexOf(":");
    if (-1 != d) {
        var e = b.substring(d + 1);
        b = b.substring(0, d);
        if ("http" === c && "80" !== e || "https" === c && "443" !== e) a = ":" + e
    }
    return c + "://" + b + a
};
var lb = "client_dev_mss_url client_dev_regex_map client_dev_root_url expflag jsfeat jsmode client_rollout_override".split(" ");

function mb() {
    function a() {
        e[0] = 1732584193;
        e[1] = 4023233417;
        e[2] = 2562383102;
        e[3] = 271733878;
        e[4] = 3285377520;
        n = l = 0
    }

    function b(r) {
        for (var t = g, m = 0; 64 > m; m += 4) t[m / 4] = r[m] << 24 | r[m + 1] << 16 | r[m + 2] << 8 | r[m + 3];
        for (m = 16; 80 > m; m++) r = t[m - 3] ^ t[m - 8] ^ t[m - 14] ^ t[m - 16], t[m] = (r << 1 | r >>> 31) & 4294967295;
        r = e[0];
        var v = e[1],
            w = e[2],
            z = e[3],
            ba = e[4];
        for (m = 0; 80 > m; m++) {
            if (40 > m)
                if (20 > m) {
                    var N = z ^ v & (w ^ z);
                    var Ja = 1518500249
                } else N = v ^ w ^ z, Ja = 1859775393;
            else 60 > m ? (N = v & w | z & (v | w), Ja = 2400959708) : (N = v ^ w ^ z, Ja = 3395469782);
            N = ((r << 5 | r >>> 27) & 4294967295) + N + ba + Ja + t[m] & 4294967295;
            ba = z;
            z = w;
            w = (v << 30 | v >>> 2) & 4294967295;
            v = r;
            r = N
        }
        e[0] = e[0] + r & 4294967295;
        e[1] = e[1] + v & 4294967295;
        e[2] = e[2] + w & 4294967295;
        e[3] = e[3] + z & 4294967295;
        e[4] = e[4] + ba & 4294967295
    }

    function c(r, t) {
        if ("string" === typeof r) {
            r = unescape(encodeURIComponent(r));
            for (var m = [], v = 0, w = r.length; v < w; ++v) m.push(r.charCodeAt(v));
            r = m
        }
        t || (t = r.length);
        m = 0;
        if (0 == l)
            for (; m + 64 < t;) b(r.slice(m, m + 64)), m += 64, n += 64;
        for (; m < t;)
            if (f[l++] = r[m++], n++, 64 == l)
                for (l = 0, b(f); m + 64 < t;) b(r.slice(m, m + 64)), m += 64, n += 64
    }

    function d() {
        var r = [],
            t = 8 * n;
        56 > l ? c(h, 56 - l) : c(h, 64 - (l - 56));
        for (var m = 63; 56 <= m; m--) f[m] = t & 255, t >>>= 8;
        b(f);
        for (m = t = 0; 5 > m; m++)
            for (var v = 24; 0 <= v; v -= 8) r[t++] = e[m] >> v & 255;
        return r
    }
    for (var e = [], f = [], g = [], h = [128], k = 1; 64 > k; ++k) h[k] = 0;
    var l, n;
    a();
    return {
        reset: a,
        update: c,
        digest: d,
        na: function() {
            for (var r = d(), t = "", m = 0; m < r.length; m++) t += "0123456789ABCDEF".charAt(Math.floor(r[m] / 16)) + "0123456789ABCDEF".charAt(r[m] % 16);
            return t
        }
    }
};

function nb(a, b, c) {
    var d = String(p.location.href);
    return d && a && b ? [b, ob(kb(d), a, c || null)].join(" ") : null
}

function ob(a, b, c) {
    var d = [],
        e = [];
    if (1 == (Array.isArray(c) ? 2 : 1)) return e = [b, a], ja(d, function(h) {
        e.push(h)
    }), pb(e.join(" "));
    var f = [],
        g = [];
    ja(c, function(h) {
        g.push(h.key);
        f.push(h.value)
    });
    c = Math.floor((new Date).getTime() / 1E3);
    e = 0 == f.length ? [c, b, a] : [f.join(":"), c, b, a];
    ja(d, function(h) {
        e.push(h)
    });
    a = pb(e.join(" "));
    a = [c, a];
    0 == g.length || a.push(g.join(""));
    return a.join("_")
}

function pb(a) {
    var b = mb();
    b.update(a);
    return b.na().toLowerCase()
};
const qb = {};

function E() {
    this.h = document || {
        cookie: ""
    }
}
E.prototype.isEnabled = function() {
    if (!p.navigator.cookieEnabled) return !1;
    if (!this.isEmpty()) return !0;
    this.set("TESTCOOKIESENABLED", "1", {
        fa: 60
    });
    if ("1" !== this.get("TESTCOOKIESENABLED")) return !1;
    this.remove("TESTCOOKIESENABLED");
    return !0
};
E.prototype.set = function(a, b, c) {
    let d, e, f, g = !1,
        h;
    "object" === typeof c && (h = c.Na, g = c.Oa || !1, f = c.domain || void 0, e = c.path || void 0, d = c.fa);
    if (/[;=\s]/.test(a)) throw Error('Invalid cookie name "' + a + '"');
    if (/[;\r\n]/.test(b)) throw Error('Invalid cookie value "' + b + '"');
    void 0 === d && (d = -1);
    this.h.cookie = a + "=" + b + (f ? ";domain=" + f : "") + (e ? ";path=" + e : "") + (0 > d ? "" : 0 == d ? ";expires=" + (new Date(1970, 1, 1)).toUTCString() : ";expires=" + (new Date(Date.now() + 1E3 * d)).toUTCString()) + (g ? ";secure" : "") + (null != h ? ";samesite=" + h : "")
};
E.prototype.get = function(a, b) {
    const c = a + "=",
        d = (this.h.cookie || "").split(";");
    for (let e = 0, f; e < d.length; e++) {
        f = qa(d[e]);
        if (0 == f.lastIndexOf(c, 0)) return f.substr(c.length);
        if (f == a) return ""
    }
    return b
};
E.prototype.remove = function(a, b, c) {
    const d = void 0 !== this.get(a);
    this.set(a, "", {
        fa: 0,
        path: b,
        domain: c
    });
    return d
};
E.prototype.isEmpty = function() {
    return !this.h.cookie
};
E.prototype.clear = function() {
    var a = (this.h.cookie || "").split(";");
    const b = [],
        c = [];
    let d, e;
    for (let f = 0; f < a.length; f++) e = qa(a[f]), d = e.indexOf("="), -1 == d ? (b.push(""), c.push(e)) : (b.push(e.substring(0, d)), c.push(e.substring(d + 1)));
    for (a = b.length - 1; 0 <= a; a--) this.remove(b[a])
};

function rb() {
    return !!qb.FPA_SAMESITE_PHASE2_MOD || !1
}

function sb(a, b, c, d) {
    (a = p[a]) || (a = (new E).get(b));
    return a ? nb(a, c, d) : null
}

function tb() {
    var a = [],
        b = kb(String(p.location.href));
    const c = [];
    var d = p.__SAPISID || p.__APISID || p.__3PSAPISID || p.__OVERRIDE_SID;
    rb() && (d = d || p.__1PSAPISID);
    if (d) var e = !0;
    else e = new E, d = e.get("SAPISID") || e.get("APISID") || e.get("__Secure-3PAPISID") || e.get("SID"), rb() && (d = d || e.get("__Secure-1PAPISID")), e = !!d;
    e && (d = (e = b = 0 == b.indexOf("https:") || 0 == b.indexOf("chrome-extension:") || 0 == b.indexOf("moz-extension:")) ? p.__SAPISID : p.__APISID, d || (d = new E, d = d.get(e ? "SAPISID" : "APISID") || d.get("__Secure-3PAPISID")),
        (e = d ? nb(d, e ? "SAPISIDHASH" : "APISIDHASH", a) : null) && c.push(e), b && rb() && ((b = sb("__1PSAPISID", "__Secure-1PAPISID", "SAPISID1PHASH", a)) && c.push(b), (a = sb("__3PSAPISID", "__Secure-3PAPISID", "SAPISID3PHASH", a)) && c.push(a)));
    return 0 == c.length ? null : c.join(" ")
};
var ub = class {
    constructor(a, b) {
        this.j = a;
        this.l = b;
        this.i = 0;
        this.h = null
    }
    get() {
        let a;
        0 < this.i ? (this.i--, a = this.h, this.h = a.next, a.next = null) : a = this.j();
        return a
    }
    put(a) {
        this.l(a);
        100 > this.i && (this.i++, a.next = this.h, this.h = a)
    }
};

function vb(a) {
    p.setTimeout(() => {
        throw a;
    }, 0)
};
class wb {
    constructor() {
        this.i = this.h = null
    }
    add(a, b) {
        const c = xb.get();
        c.set(a, b);
        this.i ? this.i.next = c : this.h = c;
        this.i = c
    }
    remove() {
        let a = null;
        this.h && (a = this.h, this.h = this.h.next, this.h || (this.i = null), a.next = null);
        return a
    }
}
var xb = new ub(() => new yb, a => a.reset());
class yb {
    constructor() {
        this.next = this.scope = this.h = null
    }
    set(a, b) {
        this.h = a;
        this.scope = b;
        this.next = null
    }
    reset() {
        this.next = this.scope = this.h = null
    }
};

function zb(a, b) {
    Ab || Bb();
    Cb || (Ab(), Cb = !0);
    Db.add(a, b)
}
var Ab;

function Bb() {
    var a = p.Promise.resolve(void 0);
    Ab = function() {
        a.then(Eb)
    }
}
var Cb = !1,
    Db = new wb;

function Eb() {
    for (var a; a = Db.remove();) {
        try {
            a.h.call(a.scope)
        } catch (b) {
            vb(b)
        }
        xb.put(a)
    }
    Cb = !1
};

function Fb(a) {
    var b = q("window.location.href");
    null == a && (a = 'Unknown Error of type "null/undefined"');
    if ("string" === typeof a) return {
        message: a,
        name: "Unknown error",
        lineNumber: "Not available",
        fileName: b,
        stack: "Not available"
    };
    var c = !1;
    try {
        var d = a.lineNumber || a.line || "Not available"
    } catch (g) {
        d = "Not available", c = !0
    }
    try {
        var e = a.fileName || a.filename || a.sourceURL || p.$googDebugFname || b
    } catch (g) {
        e = "Not available", c = !0
    }
    b = Gb(a);
    if (!(!c && a.lineNumber && a.fileName && a.stack && a.message && a.name)) {
        c = a.message;
        if (null ==
            c) {
            if (a.constructor && a.constructor instanceof Function) {
                if (a.constructor.name) c = a.constructor.name;
                else if (c = a.constructor, Hb[c]) c = Hb[c];
                else {
                    c = String(c);
                    if (!Hb[c]) {
                        var f = /function\s+([^\(]+)/m.exec(c);
                        Hb[c] = f ? f[1] : "[Anonymous]"
                    }
                    c = Hb[c]
                }
                c = 'Unknown Error of type "' + c + '"'
            } else c = "Unknown Error of unknown type";
            "function" === typeof a.toString && Object.prototype.toString !== a.toString && (c += ": " + a.toString())
        }
        return {
            message: c,
            name: a.name || "UnknownError",
            lineNumber: d,
            fileName: e,
            stack: b || "Not available"
        }
    }
    a.stack =
        b;
    return {
        message: a.message,
        name: a.name,
        lineNumber: a.lineNumber,
        fileName: a.fileName,
        stack: a.stack
    }
}

function Gb(a, b) {
    b || (b = {});
    b[Ib(a)] = !0;
    var c = a.stack || "";
    (a = a.ma) && !b[Ib(a)] && (c += "\nCaused by: ", a.stack && 0 == a.stack.indexOf(a.toString()) || (c += "string" === typeof a ? a : a.message + "\n"), c += Gb(a, b));
    return c
}

function Ib(a) {
    var b = "";
    "function" === typeof a.toString && (b = "" + a);
    return b + a.stack
}
var Hb = {};

function Jb() {
    this.j = this.j;
    this.l = this.l
}
Jb.prototype.j = !1;
Jb.prototype.dispose = function() {
    this.j || (this.j = !0, this.I())
};
Jb.prototype.I = function() {
    if (this.l)
        for (; this.l.length;) this.l.shift()()
};
class Kb {
    constructor() {
        this.promise = new Promise((a, b) => {
            this.resolve = a;
            this.reject = b
        })
    }
};

function F(a) {
    this.u = 0;
    this.ia = void 0;
    this.K = this.C = this.H = null;
    this.O = this.W = !1;
    if (a != fa) try {
        var b = this;
        a.call(void 0, function(c) {
            G(b, 2, c)
        }, function(c) {
            G(b, 3, c)
        })
    } catch (c) {
        G(this, 3, c)
    }
}

function Lb() {
    this.next = this.context = this.onRejected = this.i = this.h = null;
    this.j = !1
}
Lb.prototype.reset = function() {
    this.context = this.onRejected = this.i = this.h = null;
    this.j = !1
};
var Mb = new ub(function() {
    return new Lb
}, function(a) {
    a.reset()
});

function Nb(a, b, c) {
    var d = Mb.get();
    d.i = a;
    d.onRejected = b;
    d.context = c;
    return d
}

function Ob(a) {
    if (a instanceof F) return a;
    var b = new F(fa);
    G(b, 2, a);
    return b
}
F.prototype.then = function(a, b, c) {
    return Pb(this, "function" === typeof a ? a : null, "function" === typeof b ? b : null, c)
};
F.prototype.$goog_Thenable = !0;
F.prototype.cancel = function(a) {
    if (0 == this.u) {
        var b = new Qb(a);
        zb(function() {
            Rb(this, b)
        }, this)
    }
};

function Rb(a, b) {
    if (0 == a.u)
        if (a.H) {
            var c = a.H;
            if (c.C) {
                for (var d = 0, e = null, f = null, g = c.C; g && (g.j || (d++, g.h == a && (e = g), !(e && 1 < d))); g = g.next) e || (f = g);
                e && (0 == c.u && 1 == d ? Rb(c, b) : (f ? (d = f, d.next == c.K && (c.K = d), d.next = d.next.next) : Sb(c), Tb(c, e, 3, b)))
            }
            a.H = null
        } else G(a, 3, b)
}

function Ub(a, b) {
    a.C || 2 != a.u && 3 != a.u || Vb(a);
    a.K ? a.K.next = b : a.C = b;
    a.K = b
}

function Pb(a, b, c, d) {
    var e = Nb(null, null, null);
    e.h = new F(function(f, g) {
        e.i = b ? function(h) {
            try {
                var k = b.call(d, h);
                f(k)
            } catch (l) {
                g(l)
            }
        } : f;
        e.onRejected = c ? function(h) {
            try {
                var k = c.call(d, h);
                void 0 === k && h instanceof Qb ? g(h) : f(k)
            } catch (l) {
                g(l)
            }
        } : g
    });
    e.h.H = a;
    Ub(a, e);
    return e.h
}
F.prototype.Ca = function(a) {
    this.u = 0;
    G(this, 2, a)
};
F.prototype.Da = function(a) {
    this.u = 0;
    G(this, 3, a)
};

function G(a, b, c) {
    if (0 == a.u) {
        a === c && (b = 3, c = new TypeError("Promise cannot resolve to itself"));
        a.u = 1;
        a: {
            var d = c,
                e = a.Ca,
                f = a.Da;
            if (d instanceof F) {
                Ub(d, Nb(e || fa, f || null, a));
                var g = !0
            } else {
                if (d) try {
                    var h = !!d.$goog_Thenable
                } catch (l) {
                    h = !1
                } else h = !1;
                if (h) d.then(e, f, a), g = !0;
                else {
                    h = typeof d;
                    if ("object" == h && null != d || "function" == h) try {
                        var k = d.then;
                        if ("function" === typeof k) {
                            Wb(d, k, e, f, a);
                            g = !0;
                            break a
                        }
                    } catch (l) {
                        f.call(a, l);
                        g = !0;
                        break a
                    }
                    g = !1
                }
            }
        }
        g || (a.ia = c, a.u = b, a.H = null, Vb(a), 3 != b || c instanceof Qb || Xb(a, c))
    }
}

function Wb(a, b, c, d, e) {
    function f(k) {
        h || (h = !0, d.call(e, k))
    }

    function g(k) {
        h || (h = !0, c.call(e, k))
    }
    var h = !1;
    try {
        b.call(a, g, f)
    } catch (k) {
        f(k)
    }
}

function Vb(a) {
    a.W || (a.W = !0, zb(a.oa, a))
}

function Sb(a) {
    var b = null;
    a.C && (b = a.C, a.C = b.next, b.next = null);
    a.C || (a.K = null);
    return b
}
F.prototype.oa = function() {
    for (var a; a = Sb(this);) Tb(this, a, this.u, this.ia);
    this.W = !1
};

function Tb(a, b, c, d) {
    if (3 == c && b.onRejected && !b.j)
        for (; a && a.O; a = a.H) a.O = !1;
    if (b.h) b.h.H = null, Yb(b, c, d);
    else try {
        b.j ? b.i.call(b.context) : Yb(b, c, d)
    } catch (e) {
        Zb.call(null, e)
    }
    Mb.put(b)
}

function Yb(a, b, c) {
    2 == b ? a.i.call(a.context, c) : a.onRejected && a.onRejected.call(a.context, c)
}

function Xb(a, b) {
    a.O = !0;
    zb(function() {
        a.O && Zb.call(null, b)
    })
}
var Zb = vb;

function Qb(a) {
    ia.call(this, a)
}
ha(Qb, ia);
Qb.prototype.name = "cancel";

function H(a) {
    Jb.call(this);
    this.ca = 1;
    this.m = [];
    this.s = 0;
    this.h = [];
    this.i = {};
    this.ka = !!a
}
ha(H, Jb);
H.prototype.subscribe = function(a, b, c) {
    var d = this.i[a];
    d || (d = this.i[a] = []);
    var e = this.ca;
    this.h[e] = a;
    this.h[e + 1] = b;
    this.h[e + 2] = c;
    this.ca = e + 3;
    d.push(e);
    return e
};
H.prototype.ba = function(a) {
    var b = this.h[a];
    if (b) {
        var c = this.i[b];
        if (0 != this.s) this.m.push(a), this.h[a + 1] = fa;
        else {
            if (c) {
                const d = Array.prototype.indexOf.call(c, a, void 0);
                0 <= d && Array.prototype.splice.call(c, d, 1)
            }
            delete this.h[a];
            delete this.h[a + 1];
            delete this.h[a + 2]
        }
    }
    return !!b
};
H.prototype.L = function(a, b) {
    var c = this.i[a];
    if (c) {
        for (var d = Array(arguments.length - 1), e = 1, f = arguments.length; e < f; e++) d[e - 1] = arguments[e];
        if (this.ka)
            for (e = 0; e < c.length; e++) {
                var g = c[e];
                $b(this.h[g + 1], this.h[g + 2], d)
            } else {
                this.s++;
                try {
                    for (e = 0, f = c.length; e < f && !this.j; e++) g = c[e], this.h[g + 1].apply(this.h[g + 2], d)
                } finally {
                    if (this.s--, 0 < this.m.length && 0 == this.s)
                        for (; c = this.m.pop();) this.ba(c)
                }
            }
        return 0 != e
    }
    return !1
};

function $b(a, b, c) {
    zb(function() {
        a.apply(b, c)
    })
}
H.prototype.clear = function(a) {
    if (a) {
        var b = this.i[a];
        b && (b.forEach(this.ba, this), delete this.i[a])
    } else this.h.length = 0, this.i = {}
};
H.prototype.I = function() {
    H.za.I.call(this);
    this.clear();
    this.m.length = 0
};
/*

Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com
Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/
var ac = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
var bc = ["notification/convert_endpoint_to_url"],
    cc = ["notification/record_interactions"],
    dc = ["notification_registration/set_registration"];
var ec = a => self.btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(a)))).replace(/\+/g, "-").replace(/\//g, "_");
var fc = ["notifications_register", "notifications_check_registration"];
var gc = class extends Error {
    constructor(a, ...b) {
        super(a);
        this.args = [...b]
    }
};
let hc = null;

function I(a, b) {
    const c = {};
    c.key = a;
    c.value = b;
    return ic().then(d => new Promise((e, f) => {
        try {
            const g = d.transaction("swpushnotificationsstore", "readwrite").objectStore("swpushnotificationsstore").put(c);
            g.onsuccess = () => {
                e()
            };
            g.onerror = () => {
                f()
            }
        } catch (g) {
            f(g)
        }
    }))
}

function jc() {
    return I("IndexedDBCheck", "testing IndexedDB").then(() => J("IndexedDBCheck")).then(a => "testing IndexedDB" === a ? Promise.resolve() : Promise.reject()).then(() => !0).catch(() => !1)
}

function J(a) {
    const b = new gc("Error accessing DB");
    return ic().then(c => new Promise((d, e) => {
        try {
            const f = c.transaction("swpushnotificationsstore").objectStore("swpushnotificationsstore").get(a);
            f.onsuccess = () => {
                const g = f.result;
                d(g ? g.value : null)
            };
            f.onerror = () => {
                b.params = {
                    key: a,
                    source: "onerror"
                };
                e(b)
            }
        } catch (f) {
            b.params = {
                key: a,
                thrownError: String(f)
            }, e(b)
        }
    }), () => null)
}

function ic() {
    return hc ? Promise.resolve(hc) : new Promise((a, b) => {
        const c = self.indexedDB.open("swpushnotificationsdb");
        c.onerror = b;
        c.onsuccess = () => {
            const d = c.result;
            if (d.objectStoreNames.contains("swpushnotificationsstore")) hc = d, a(hc);
            else return self.indexedDB.deleteDatabase("swpushnotificationsdb"), ic()
        };
        c.onupgradeneeded = kc
    })
}

function kc(a) {
    a = a.target.result;
    a.objectStoreNames.contains("swpushnotificationsstore") && a.deleteObjectStore("swpushnotificationsstore");
    a.createObjectStore("swpushnotificationsstore", {
        keyPath: "key"
    })
};
const lc = {
    ["WEB_UNPLUGGED"]: "^unplugged/",
    ["WEB_UNPLUGGED_ONBOARDING"]: "^unplugged/",
    ["WEB_UNPLUGGED_OPS"]: "^unplugged/",
    ["WEB_UNPLUGGED_PUBLIC"]: "^unplugged/",
    ["WEB_CREATOR"]: "^creator/",
    ["WEB_KIDS"]: "^kids/",
    ["WEB_EXPERIMENTS"]: "^experiments/",
    ["WEB_MUSIC"]: "^music/",
    ["WEB_REMIX"]: "^music/",
    ["WEB_MUSIC_EMBEDDED_PLAYER"]: "^music/",
    ["WEB_MUSIC_EMBEDDED_PLAYER"]: "^main_app/|^sfv/"
};

function mc(a) {
    if (1 === a.length) return a[0];
    var b = lc.UNKNOWN_INTERFACE;
    if (b) {
        b = new RegExp(b);
        for (var c of a)
            if (b.exec(c)) return c
    }
    const d = [];
    Object.entries(lc).forEach(([e, f]) => {
        "UNKNOWN_INTERFACE" !== e && d.push(f)
    });
    c = new RegExp(d.join("|"));
    a.sort((e, f) => e.length - f.length);
    for (const e of a)
        if (!c.exec(e)) return e;
    return a[0]
}

function nc(a) {
    return `/youtubei/v1/${mc(a)}`
};
var oc = class extends bb {
    constructor(a) {
        super(a)
    }
};
var pc = class extends bb {
    constructor(a) {
        super(a)
    }
};
pc.ga = "yt.sw.adr";
var qc, rc;
const sc = p.window,
    K = (null === (qc = null === sc || void 0 === sc ? void 0 : sc.yt) || void 0 === qc ? void 0 : qc.config_) || (null === (rc = null === sc || void 0 === sc ? void 0 : sc.ytcfg) || void 0 === rc ? void 0 : rc.data_) || {};
u("yt.config_", K);

function L(...a) {
    a = arguments;
    1 < a.length ? K[a[0]] = a[1] : 1 === a.length && Object.assign(K, a[0])
}

function M(a, b) {
    return a in K ? K[a] : b
};

function O(a) {
    a = tc(a);
    return "string" === typeof a && "false" === a ? !1 : !!a
}

function uc(a, b) {
    a = tc(a);
    return void 0 === a && void 0 !== b ? b : Number(a || 0)
}

function tc(a) {
    const b = M("EXPERIMENTS_FORCED_FLAGS", {});
    return void 0 !== b[a] ? b[a] : M("EXPERIMENT_FLAGS", {})[a]
};
let vc = 0;
u("ytDomDomGetNextId", q("ytDomDomGetNextId") || (() => ++vc));
const wc = [];

function xc(a) {
    wc.forEach(b => b(a))
}

function yc(a) {
    return a && window.yterr ? function() {
        try {
            return a.apply(this, arguments)
        } catch (b) {
            zc(b)
        }
    } : a
}

function zc(a) {
    var b = q("yt.logging.errors.log");
    b ? b(a, "ERROR", void 0, void 0, void 0) : (b = M("ERRORS", []), b.push([a, "ERROR", void 0, void 0, void 0]), L("ERRORS", b));
    xc(a)
}

function Ac(a) {
    var b = q("yt.logging.errors.log");
    b ? b(a, "WARNING", void 0, void 0, void 0) : (b = M("ERRORS", []), b.push([a, "WARNING", void 0, void 0, void 0]), L("ERRORS", b))
};
u("ytEventsEventsListeners", p.ytEventsEventsListeners || {});
u("ytEventsEventsCounter", p.ytEventsEventsCounter || {
    count: 0
});

function Bc(a, b) {
    "function" === typeof a && (a = yc(a));
    return window.setTimeout(a, b)
};
var Cc = class {};
var Dc = class extends Cc {
    start() {
        const a = q("yt.scheduler.instance.start");
        a && a()
    }
};
Dc.h || (Dc.h = new Dc);
const Ec = /^[\w.]*$/,
    Fc = {
        q: !0,
        search_query: !0
    };

function Gc(a, b) {
    b = a.split(b);
    const c = {};
    for (let f = 0, g = b.length; f < g; f++) {
        const h = b[f].split("=");
        if (1 == h.length && h[0] || 2 == h.length) try {
            const k = Hc(h[0] || ""),
                l = Hc(h[1] || "");
            k in c ? Array.isArray(c[k]) ? ka(c[k], l) : c[k] = [c[k], l] : c[k] = l
        } catch (k) {
            var d = k,
                e = h[0];
            const l = String(Gc);
            d.args = [{
                key: e,
                value: h[1],
                query: a,
                method: Ic == l ? "unchanged" : l
            }];
            Fc.hasOwnProperty(e) || Ac(d)
        }
    }
    return c
}
const Ic = String(Gc);

function Jc(a) {
    "?" == a.charAt(0) && (a = a.substr(1));
    return Gc(a, "&")
}

function Kc(a, b, c) {
    var d = a.split("#", 2);
    a = d[0];
    d = 1 < d.length ? "#" + d[1] : "";
    var e = a.split("?", 2);
    a = e[0];
    e = Jc(e[1] || "");
    for (var f in b) !c && null !== e && f in e || (e[f] = b[f]);
    b = a;
    a = ya(e);
    a ? (c = b.indexOf("#"), 0 > c && (c = b.length), f = b.indexOf("?"), 0 > f || f > c ? (f = c, e = "") : e = b.substring(f + 1, c), b = [b.substr(0, f), e, b.substr(c)], c = b[1], b[1] = a ? c ? c + "&" + a : a : c, a = b[0] + (b[1] ? "?" + b[1] : "") + b[2]) : a = b;
    return a + d
}

function Lc(a) {
    if (!b) var b = window.location.href;
    const c = a.match(A)[1] || null,
        d = wa(a.match(A)[3] || null);
    c && d ? (a = a.match(A), b = b.match(A), a = a[3] == b[3] && a[1] == b[1] && a[4] == b[4]) : a = d ? wa(b.match(A)[3] || null) == d && (Number(b.match(A)[4] || null) || null) == (Number(a.match(A)[4] || null) || null) : !0;
    return a
}

function Hc(a) {
    return a && a.match(Ec) ? a : decodeURIComponent(a.replace(/\+/g, " "))
};
[...lb];
let Mc = !1;

function Nc(a, b) {
    const c = {
        method: b.method || "GET",
        credentials: "same-origin"
    };
    b.headers && (c.headers = b.headers);
    a = Oc(a, b);
    const d = Pc(a, b);
    d && (c.body = d);
    b.withCredentials && (c.credentials = "include");
    const e = b.context || p;
    let f = !1,
        g;
    fetch(a, c).then(h => {
        if (!f) {
            f = !0;
            g && window.clearTimeout(g);
            var k = h.ok,
                l = n => {
                    n = n || {};
                    k ? b.onSuccess && b.onSuccess.call(e, n, h) : b.onError && b.onError.call(e, n, h);
                    b.onFinish && b.onFinish.call(e, n, h)
                };
            "JSON" == (b.format || "JSON") && (k || 400 <= h.status && 500 > h.status) ? h.json().then(l, function() {
                l(null)
            }): l(null)
        }
    }).catch(() => {
        b.onError && b.onError.call(e, {}, {})
    });
    b.onFetchTimeout && 0 < b.timeout && (g = Bc(() => {
        f || (f = !0, window.clearTimeout(g), b.onFetchTimeout.call(b.context || p))
    }, b.timeout))
}

function Oc(a, b) {
    b.includeDomain && (a = document.location.protocol + "//" + document.location.hostname + (document.location.port ? ":" + document.location.port : "") + a);
    const c = M("XSRF_FIELD_NAME", void 0);
    if (b = b.urlParams) b[c] && delete b[c], a = Kc(a, b || {}, !0);
    return a
}

function Pc(a, b) {
    const c = M("XSRF_FIELD_NAME", void 0),
        d = M("XSRF_TOKEN", void 0);
    var e = b.postBody || "",
        f = b.postParams;
    const g = M("XSRF_FIELD_NAME", void 0);
    let h;
    b.headers && (h = b.headers["Content-Type"]);
    b.excludeXsrf || wa(a.match(A)[3] || null) && !b.withCredentials && wa(a.match(A)[3] || null) != document.location.hostname || "POST" != b.method || h && "application/x-www-form-urlencoded" != h || b.postParams && b.postParams[g] || (f || (f = {}), f[c] = d);
    f && "string" === typeof e && (e = Jc(e), na(e, f), e = b.postBodyFormat && "JSON" == b.postBodyFormat ?
        JSON.stringify(e) : ya(e));
    if (!(a = e) && (a = f)) {
        a: {
            for (const k in f) {
                f = !1;
                break a
            }
            f = !0
        }
        a = !f
    }!Mc && a && "POST" != b.method && (Mc = !0, zc(Error("AJAX request with postData should use POST")));
    return e
};
p.ytPubsubPubsubInstance || new H;
const P = window;
var Q = P.ytcsi && P.ytcsi.now ? P.ytcsi.now : P.performance && P.performance.timing && P.performance.now && P.performance.timing.navigationStart ? () => P.performance.timing.navigationStart + P.performance.now() : () => (new Date).getTime();
const Qc = uc("initial_gel_batch_timeout", 2E3),
    Rc = Math.pow(2, 16) - 1;
let R = void 0,
    Sc = 0,
    Tc = 0,
    Uc = 0,
    Vc = !0;
const Wc = p.ytLoggingTransportGELQueue_ || new Map,
    Xc = p.ytLoggingTransportTokensToCttTargetIds_ || {};

function Yc(a, b) {
    if ("log_event" === a.endpoint) {
        var c = "";
        a.N ? c = "visitorOnlyApprovedKey" : a.A && (Xc[a.A.token] = Zc(a.A), c = a.A.token);
        var d = Wc.get(c) || [];
        Wc.set(c, d);
        d.push(a.payload);
        b && (R = new b);
        a = uc("tvhtml5_logging_max_batch") || uc("web_logging_max_batch") || 100;
        b = Q();
        d.length >= a ? $c({
            writeThenSend: !0
        }, O("flush_only_full_queue") ? c : void 0) : 10 <= b - Uc && (ad(), Uc = b)
    }
}

function bd(a, b) {
    if ("log_event" === a.endpoint) {
        var c = "";
        a.N ? c = "visitorOnlyApprovedKey" : a.A && (Xc[a.A.token] = Zc(a.A), c = a.A.token);
        var d = new Map;
        d.set(c, [a.payload]);
        b && (R = new b);
        return new F(e => {
            R && R.isReady() ? cd(d, e, {
                bypassNetworkless: !0
            }) : e()
        })
    }
}

function $c(a = {}, b) {
    new F(c => {
        window.clearTimeout(Sc);
        window.clearTimeout(Tc);
        Tc = 0;
        if (R && R.isReady())
            if (void 0 !== b) {
                const d = new Map,
                    e = Wc.get(b) || [];
                d.set(b, e);
                cd(d, c, a);
                Wc.delete(b)
            } else cd(Wc, c, a), Wc.clear();
        else ad(), c()
    })
}

function ad() {
    O("web_gel_timeout_cap") && !Tc && (Tc = Bc(() => {
        $c({
            writeThenSend: !0
        })
    }, 6E4));
    window.clearTimeout(Sc);
    let a = M("LOGGING_BATCH_TIMEOUT", uc("web_gel_debounce_ms", 1E4));
    O("shorten_initial_gel_batch_timeout") && Vc && (a = Qc);
    Sc = Bc(() => {
        $c({
            writeThenSend: !0
        })
    }, a)
}

function cd(a, b, c = {}) {
    var d = R;
    const e = Math.round(Q());
    let f = a.size;
    for (const [k, l] of a) {
        var g = k,
            h = l;
        a = la({
            context: dd(d.config_ || ed())
        });
        a.events = h;
        (h = Xc[g]) && fd(a, g, h);
        delete Xc[g];
        g = "visitorOnlyApprovedKey" === g;
        gd(a, e, g);
        O("always_send_and_write") && (c.writeThenSend = !1);
        hd(d, a, {
            retry: !0,
            onSuccess: () => {
                f--;
                f || b()
            },
            onError: () => {
                f--;
                f || b()
            },
            Ja: c,
            N: g
        });
        Vc = !1
    }
}

function gd(a, b, c) {
    a.requestTimeMs = String(b);
    O("unsplit_gel_payloads_in_logs") && (a.unsplitGelPayloadsInLogs = !0);
    !c && (b = M("EVENT_ID", void 0)) && ((c = M("BATCH_CLIENT_COUNTER", void 0) || 0) || (c = Math.floor(Math.random() * Rc / 2)), c++, c > Rc && (c = 1), L("BATCH_CLIENT_COUNTER", c), a.serializedClientEventId = {
        serializedEventId: b,
        clientCounter: String(c)
    })
}

function fd(a, b, c) {
    let d;
    if (c.videoId) d = "VIDEO";
    else if (c.playlistId) d = "PLAYLIST";
    else return;
    a.credentialTransferTokenTargetId = c;
    a.context = a.context || {};
    a.context.user = a.context.user || {};
    a.context.user.credentialTransferTokens = [{
        token: b,
        scope: d
    }]
}

function Zc(a) {
    const b = {};
    a.videoId ? b.videoId = a.videoId : a.playlistId && (b.playlistId = a.playlistId);
    return b
};
const id = p.ytLoggingGelSequenceIdObj_ || {};

function jd(a, b, c, d = {}) {
    const e = {},
        f = Math.round(d.timestamp || Q());
    e.eventTimeMs = f < Number.MAX_SAFE_INTEGER ? f : 0;
    e[a] = b;
    a = q("_lact", window);
    a = null == a ? -1 : Math.max(Date.now() - a, 0);
    e.context = {
        lastActivityMs: String(d.timestamp || !isFinite(a) ? -1 : a)
    };
    O("log_sequence_info_on_gel_web") && d.ja && (a = e.context, b = d.ja, id[b] = b in id ? id[b] + 1 : 0, a.sequence = {
        index: id[b],
        groupKey: b
    }, d.Ia && delete id[d.ja]);
    (d.Pa ? bd : Yc)({
        endpoint: "log_event",
        payload: e,
        A: d.A,
        N: d.N
    }, c)
};

function kd() {
    if (!p.matchMedia) return "WEB_DISPLAY_MODE_UNKNOWN";
    try {
        return p.matchMedia("(display-mode: standalone)").matches ? "WEB_DISPLAY_MODE_STANDALONE" : p.matchMedia("(display-mode: minimal-ui)").matches ? "WEB_DISPLAY_MODE_MINIMAL_UI" : p.matchMedia("(display-mode: fullscreen)").matches ? "WEB_DISPLAY_MODE_FULLSCREEN" : p.matchMedia("(display-mode: browser)").matches ? "WEB_DISPLAY_MODE_BROWSER" : "WEB_DISPLAY_MODE_UNKNOWN"
    } catch (a) {
        return "WEB_DISPLAY_MODE_UNKNOWN"
    }
};
u("ytglobal.prefsUserPrefsPrefs_", q("ytglobal.prefsUserPrefsPrefs_") || {});
const ld = {
        bluetooth: "CONN_DISCO",
        cellular: "CONN_CELLULAR_UNKNOWN",
        ethernet: "CONN_WIFI",
        none: "CONN_NONE",
        wifi: "CONN_WIFI",
        wimax: "CONN_CELLULAR_4G",
        other: "CONN_UNKNOWN",
        unknown: "CONN_UNKNOWN",
        "slow-2g": "CONN_CELLULAR_2G",
        "2g": "CONN_CELLULAR_2G",
        "3g": "CONN_CELLULAR_3G",
        "4g": "CONN_CELLULAR_4G"
    },
    md = {
        "slow-2g": "EFFECTIVE_CONNECTION_TYPE_SLOW_2G",
        "2g": "EFFECTIVE_CONNECTION_TYPE_2G",
        "3g": "EFFECTIVE_CONNECTION_TYPE_3G",
        "4g": "EFFECTIVE_CONNECTION_TYPE_4G"
    };

function nd() {
    const a = p.navigator;
    return a ? a.connection : void 0
};

function od() {
    return "INNERTUBE_API_KEY" in K && "INNERTUBE_API_VERSION" in K
}

function ed() {
    return {
        innertubeApiKey: M("INNERTUBE_API_KEY", void 0),
        innertubeApiVersion: M("INNERTUBE_API_VERSION", void 0),
        pa: M("INNERTUBE_CONTEXT_CLIENT_CONFIG_INFO"),
        qa: M("INNERTUBE_CONTEXT_CLIENT_NAME", "WEB"),
        innertubeContextClientVersion: M("INNERTUBE_CONTEXT_CLIENT_VERSION", void 0),
        sa: M("INNERTUBE_CONTEXT_HL", void 0),
        ra: M("INNERTUBE_CONTEXT_GL", void 0),
        ta: M("INNERTUBE_HOST_OVERRIDE", void 0) || "",
        wa: !!M("INNERTUBE_USE_THIRD_PARTY_AUTH", !1),
        va: !!M("INNERTUBE_OMIT_API_KEY_WHEN_AUTH_HEADER_IS_PRESENT", !1),
        appInstallData: M("SERIALIZED_CLIENT_CONFIG_DATA", void 0)
    }
}

function dd(a) {
    const b = {
        client: {
            hl: a.sa,
            gl: a.ra,
            clientName: a.qa,
            clientVersion: a.innertubeContextClientVersion,
            configInfo: a.pa
        }
    };
    navigator.userAgent && (b.client.userAgent = String(navigator.userAgent));
    var c = p.devicePixelRatio;
    c && 1 != c && (b.client.screenDensityFloat = String(c));
    c = M("EXPERIMENTS_TOKEN", "");
    "" !== c && (b.client.experimentsToken = c);
    c = [];
    const d = M("EXPERIMENTS_FORCED_FLAGS", {});
    for (var e in d) c.push({
        key: e,
        value: String(d[e])
    });
    e = M("EXPERIMENT_FLAGS", {});
    for (var f in e) f.startsWith("force_") && void 0 ===
        d[f] && c.push({
            key: f,
            value: String(e[f])
        });
    0 < c.length && (b.request = {
        internalExperimentFlags: c
    });
    f = b.client.clientName;
    if ("WEB" === f || "MWEB" === f || 1 === f || 2 === f) {
        if (!O("web_include_display_mode_killswitch")) {
            var g;
            b.client.mainAppWebInfo = null != (g = b.client.mainAppWebInfo) ? g : {};
            b.client.mainAppWebInfo.webDisplayMode = kd()
        }
    } else if (g = b.client.clientName, ("WEB_REMIX" === g || 76 === g) && !O("music_web_display_mode_killswitch")) {
        var h;
        b.client.ha = null != (h = b.client.ha) ? h : {};
        b.client.ha.webDisplayMode = kd()
    }
    a.appInstallData &&
        (b.client.configInfo = b.client.configInfo || {}, b.client.configInfo.appInstallData = a.appInstallData);
    M("DELEGATED_SESSION_ID") && !O("pageid_as_header_web") && (b.user = {
        onBehalfOfUser: M("DELEGATED_SESSION_ID")
    });
    a: {
        if (h = nd()) {
            a = ld[h.type || "unknown"] || "CONN_UNKNOWN";
            h = ld[h.effectiveType || "unknown"] || "CONN_UNKNOWN";
            "CONN_CELLULAR_UNKNOWN" === a && "CONN_UNKNOWN" !== h && (a = h);
            if ("CONN_UNKNOWN" !== a) break a;
            if ("CONN_UNKNOWN" !== h) {
                a = h;
                break a
            }
        }
        a = void 0
    }
    a && (b.client.connectionType = a);
    O("web_log_effective_connection_type") &&
        (a = nd(), a = null !== a && void 0 !== a && a.effectiveType ? md.hasOwnProperty(a.effectiveType) ? md[a.effectiveType] : "EFFECTIVE_CONNECTION_TYPE_UNKNOWN" : void 0, a && (b.client.effectiveConnectionType = a));
    a = Object;
    h = a.assign;
    g = b.client;
    e = M("DEVICE", "");
    f = {};
    for (const [k, l] of Object.entries(Jc(e))) e = k, c = l, "cbrand" === e ? f.deviceMake = c : "cmodel" === e ? f.deviceModel = c : "cbr" === e ? f.browserName = c : "cbrver" === e ? f.browserVersion = c : "cos" === e ? f.osName = c : "cosver" === e ? f.osVersion = c : "cplatform" === e && (f.platform = c);
    b.client = h.call(a,
        g, f);
    return b
}

function pd(a, b, c) {
    c = void 0 === c ? {} : c;
    const d = {
        "X-Goog-Visitor-Id": c.visitorData || M("VISITOR_DATA", "")
    };
    if (b && b.includes("www.youtube-nocookie.com")) return d;
    (b = c.Fa || M("AUTHORIZATION")) || (a ? b = `Bearer ${q("gapi.auth.getToken")().Ea}` : b = tb());
    b && (d.Authorization = b, d["X-Goog-AuthUser"] = M("SESSION_INDEX", 0), O("pageid_as_header_web") && (d["X-Goog-PageId"] = M("DELEGATED_SESSION_ID")));
    return d
};
const qd = q("ytPubsub2Pubsub2Instance") || new H;
H.prototype.subscribe = H.prototype.subscribe;
H.prototype.unsubscribeByKey = H.prototype.ba;
H.prototype.publish = H.prototype.L;
H.prototype.clear = H.prototype.clear;
u("ytPubsub2Pubsub2Instance", qd);
u("ytPubsub2Pubsub2SubscribedKeys", q("ytPubsub2Pubsub2SubscribedKeys") || {});
u("ytPubsub2Pubsub2TopicToKeys", q("ytPubsub2Pubsub2TopicToKeys") || {});
u("ytPubsub2Pubsub2IsAsync", q("ytPubsub2Pubsub2IsAsync") || {});
u("ytPubsub2Pubsub2SkipSubKey", null);
var rd = class {
    isSupported() {
        return !0
    }
};
const S = [];
let T, sd = !1;

function td(a) {
    sd || (T ? T.handleError(a) : (S.push({
        type: "ERROR",
        payload: a
    }), 10 < S.length && S.shift()))
}

function ud(a, b) {
    sd || (T ? T.S(a, b) : (S.push({
        type: "EVENT",
        eventType: a,
        payload: b
    }), 10 < S.length && S.shift()))
};

function vd() {
    if (void 0 !== M("DATASYNC_ID", void 0)) return M("DATASYNC_ID", void 0);
    throw new gc("Datasync ID not set", "unknown");
};

function wd(a) {
    if (0 <= a.indexOf(":")) throw Error("Database name cannot contain ':'");
}

function xd(a) {
    return a.substr(0, a.indexOf(":")) || a
};
const yd = {
        ["AUTH_INVALID"]: "No user identifier specified.",
        ["EXPLICIT_ABORT"]: "Transaction was explicitly aborted.",
        ["IDB_NOT_SUPPORTED"]: "IndexedDB is not supported.",
        ["MISSING_INDEX"]: "Index not created.",
        ["MISSING_OBJECT_STORE"]: "Object store not created.",
        ["DB_DELETED_BY_MISSING_OBJECT_STORE"]: "Database is deleted because an expected object store was not created.",
        ["UNKNOWN_ABORT"]: "Transaction was aborted for unknown reasons.",
        ["QUOTA_EXCEEDED"]: "The current transaction exceeded its quota limitations.",
        ["QUOTA_MAYBE_EXCEEDED"]: "The current transaction may have failed because of exceeding quota limitations.",
        ["EXECUTE_TRANSACTION_ON_CLOSED_DB"]: "Can't start a transaction on a closed database",
        ["INCOMPATIBLE_DB_VERSION"]: "The binary is incompatible with the database version"
    },
    zd = {
        ["AUTH_INVALID"]: "ERROR",
        ["EXECUTE_TRANSACTION_ON_CLOSED_DB"]: "WARNING",
        ["EXPLICIT_ABORT"]: "IGNORED",
        ["IDB_NOT_SUPPORTED"]: "ERROR",
        ["MISSING_INDEX"]: "WARNING",
        ["MISSING_OBJECT_STORE"]: "ERROR",
        ["DB_DELETED_BY_MISSING_OBJECT_STORE"]: "WARNING",
        ["QUOTA_EXCEEDED"]: "WARNING",
        ["QUOTA_MAYBE_EXCEEDED"]: "WARNING",
        ["UNKNOWN_ABORT"]: "WARNING",
        ["INCOMPATIBLE_DB_VERSION"]: "WARNING"
    },
    Ad = {
        ["AUTH_INVALID"]: !1,
        ["EXECUTE_TRANSACTION_ON_CLOSED_DB"]: !1,
        ["EXPLICIT_ABORT"]: !1,
        ["IDB_NOT_SUPPORTED"]: !1,
        ["MISSING_INDEX"]: !1,
        ["MISSING_OBJECT_STORE"]: !1,
        ["DB_DELETED_BY_MISSING_OBJECT_STORE"]: !1,
        ["QUOTA_EXCEEDED"]: !1,
        ["QUOTA_MAYBE_EXCEEDED"]: !0,
        ["UNKNOWN_ABORT"]: !0,
        ["INCOMPATIBLE_DB_VERSION"]: !1
    };
var U = class extends gc {
        constructor(a, b = {}, c = yd[a], d = zd[a], e = Ad[a]) {
            super(c, Object.assign({
                name: "YtIdbKnownError",
                isSw: void 0 === self.document,
                isIframe: self !== self.top,
                type: a
            }, b));
            this.type = a;
            this.message = c;
            this.level = d;
            this.h = e;
            Object.setPrototypeOf(this, U.prototype)
        }
    },
    Bd = class extends U {
        constructor(a) {
            super("MISSING_OBJECT_STORE", {
                ya: a
            }, yd.MISSING_OBJECT_STORE);
            Object.setPrototypeOf(this, Bd.prototype)
        }
    },
    Cd = class extends Error {
        constructor(a, b) {
            super();
            this.index = a;
            this.objectStore = b;
            Object.setPrototypeOf(this,
                Cd.prototype)
        }
    };
const Dd = ["The database connection is closing", "Can't start a transaction on a closed database", "A mutation operation was attempted on a database that did not allow mutations"];

function Ed(a, b, c, d) {
    b = xd(b);
    let e;
    e = a instanceof Error ? a : Error(`Unexpected error: ${a}`);
    if (e instanceof U) return e;
    if ("QuotaExceededError" === e.name) return new U("QUOTA_EXCEEDED", {
        objectStoreNames: c,
        dbName: b
    });
    if (Na && "UnknownError" === e.name) return new U("QUOTA_MAYBE_EXCEEDED", {
        objectStoreNames: c,
        dbName: b
    });
    if (e instanceof Cd) return new U("MISSING_INDEX", {
        dbName: b,
        dbVersion: d,
        objectStore: e.objectStore,
        index: e.index
    });
    if ("InvalidStateError" === e.name && Dd.some(f => e.message.includes(f))) return new U("EXECUTE_TRANSACTION_ON_CLOSED_DB", {
        objectStoreNames: c,
        dbName: b
    });
    if ("AbortError" === e.name) return new U("UNKNOWN_ABORT", {
        objectStoreNames: c,
        dbName: b
    }, e.message);
    e.args = [{
        name: "IdbError",
        Ka: e.name,
        dbName: b,
        objectStoreNames: c
    }];
    e.level = "WARNING";
    return e
};

function Fd(a) {
    if (!a) throw Error();
    throw a;
}

function Gd(a) {
    return a
}
var Hd = class {
    constructor(a) {
        this.h = a
    }
};

function Id(a, b, c, d, e) {
    try {
        if ("FULFILLED" !== a.state.status) throw Error("calling handleResolve before the promise is fulfilled.");
        const f = c(a.state.value);
        f instanceof V ? Jd(a, b, f, d, e) : d(f)
    } catch (f) {
        e(f)
    }
}

function Kd(a, b, c, d, e) {
    try {
        if ("REJECTED" !== a.state.status) throw Error("calling handleReject before the promise is rejected.");
        const f = c(a.state.reason);
        f instanceof V ? Jd(a, b, f, d, e) : d(f)
    } catch (f) {
        e(f)
    }
}

function Jd(a, b, c, d, e) {
    b === c ? e(new TypeError("Circular promise chain detected.")) : c.then(f => {
        f instanceof V ? Jd(a, b, f, d, e) : d(f)
    }, f => {
        e(f)
    })
}
var V = class {
    constructor(a) {
        this.state = {
            status: "PENDING"
        };
        this.h = [];
        this.onRejected = [];
        a = a.h;
        const b = d => {
                if ("PENDING" === this.state.status) {
                    this.state = {
                        status: "FULFILLED",
                        value: d
                    };
                    for (const e of this.h) e()
                }
            },
            c = d => {
                if ("PENDING" === this.state.status) {
                    this.state = {
                        status: "REJECTED",
                        reason: d
                    };
                    for (const e of this.onRejected) e()
                }
            };
        try {
            a(b, c)
        } catch (d) {
            c(d)
        }
    }
    static all(a) {
        return new V(new Hd((b, c) => {
            const d = [];
            let e = a.length;
            0 === e && b(d);
            for (let f = 0; f < a.length; ++f) V.resolve(a[f]).then(g => {
                d[f] = g;
                e--;
                0 === e && b(d)
            }).catch(g => {
                c(g)
            })
        }))
    }
    static resolve(a) {
        return new V(new Hd((b, c) => {
            a instanceof V ? a.then(b, c) : b(a)
        }))
    }
    static reject(a) {
        return new V(new Hd((b, c) => {
            c(a)
        }))
    }
    then(a, b) {
        const c = null !== a && void 0 !== a ? a : Gd,
            d = null !== b && void 0 !== b ? b : Fd;
        return new V(new Hd((e, f) => {
            "PENDING" === this.state.status ? (this.h.push(() => {
                Id(this, this, c, e, f)
            }), this.onRejected.push(() => {
                Kd(this, this, d, e, f)
            })) : "FULFILLED" === this.state.status ? Id(this, this, c, e, f) : "REJECTED" === this.state.status && Kd(this, this, d, e, f)
        }))
    } catch (a) {
        return this.then(void 0, a)
    }
};

function Ld(a, b, c) {
    const d = () => {
            try {
                a.removeEventListener("success", e), a.removeEventListener("error", f)
            } catch (g) {}
        },
        e = () => {
            b(a.result);
            d()
        },
        f = () => {
            c(a.error);
            d()
        };
    a.addEventListener("success", e);
    a.addEventListener("error", f)
}

function Md(a) {
    return new Promise((b, c) => {
        Ld(a, b, c)
    })
}

function W(a) {
    return new V(new Hd((b, c) => {
        Ld(a, b, c)
    }))
};

function Nd(a, b) {
    return new V(new Hd((c, d) => {
        const e = () => {
            const f = a ? b(a) : null;
            f ? f.then(g => {
                a = g;
                e()
            }, d) : c()
        };
        e()
    }))
};

function X(a, b, c, d) {
    return D(a, function*() {
        const e = {
            mode: "readonly",
            D: !1,
            tag: "IDB_TRANSACTION_TAG_UNKNOWN"
        };
        "string" === typeof c ? e.mode = c : Object.assign(e, c);
        this.transactionCount++;
        const f = e.D ? 3 : 1;
        let g = 0,
            h;
        for (; !h;) {
            g++;
            const l = Math.round(Q());
            try {
                const n = this.h.transaction(b, e.mode);
                var k = d;
                const r = new Od(n),
                    t = yield Pd(r, k), m = Math.round(Q());
                Qd(this, l, m, g, void 0, b.join(), e);
                return t
            } catch (n) {
                k = Math.round(Q());
                const r = Ed(n, this.h.name, b.join(), this.h.version);
                if (r instanceof U && !r.h || g >= f) Qd(this,
                    l, k, g, r, b.join(), e), h = r
            }
        }
        return Promise.reject(h)
    })
}

function Rd(a, b, c) {
    a = a.h.createObjectStore(b, c);
    return new Sd(a)
}

function Qd(a, b, c, d, e, f, g) {
    b = c - b;
    e ? (e instanceof U && ("QUOTA_EXCEEDED" === e.type || "QUOTA_MAYBE_EXCEEDED" === e.type) && ud("QUOTA_EXCEEDED", {
        dbName: xd(a.h.name),
        objectStoreNames: f,
        transactionCount: a.transactionCount,
        transactionMode: g.mode
    }), e instanceof U && "UNKNOWN_ABORT" === e.type && (c -= a.j, 0 > c && c >= Math.pow(2, 31) && (c = 0), ud("TRANSACTION_UNEXPECTEDLY_ABORTED", {
        objectStoreNames: f,
        transactionDuration: b,
        transactionCount: a.transactionCount,
        dbDuration: c
    }), a.i = !0), Td(a, !1, d, f, b, g.tag), td(e)) : Td(a, !0, d, f, b, g.tag)
}

function Td(a, b, c, d, e, f = "IDB_TRANSACTION_TAG_UNKNOWN") {
    ud("TRANSACTION_ENDED", {
        objectStoreNames: d,
        connectionHasUnknownAbortedTransaction: a.i,
        duration: e,
        isSuccessful: b,
        tryCount: c,
        tag: f
    })
}
var Ud = class {
    constructor(a, b) {
        this.h = a;
        this.options = b;
        this.transactionCount = 0;
        this.j = Math.round(Q());
        this.i = !1
    }
    add(a, b, c) {
        return X(this, [a], {
            mode: "readwrite",
            D: !0
        }, d => d.objectStore(a).add(b, c))
    }
    clear(a) {
        return X(this, [a], {
            mode: "readwrite",
            D: !0
        }, b => b.objectStore(a).clear())
    }
    close() {
        var a;
        this.h.close();
        (null === (a = this.options) || void 0 === a ? 0 : a.closed) && this.options.closed()
    }
    count(a, b) {
        return X(this, [a], {
            mode: "readonly",
            D: !0
        }, c => c.objectStore(a).count(b))
    }
    delete(a, b) {
        return X(this, [a], {
            mode: "readwrite",
            D: !0
        }, c => c.objectStore(a).delete(b))
    }
    get(a, b) {
        return X(this, [a], {
            mode: "readonly",
            D: !0
        }, c => c.objectStore(a).get(b))
    }
    put(a, b, c) {
        return X(this, [a], {
            mode: "readwrite",
            D: !0
        }, d => d.objectStore(a).put(b, c))
    }
    objectStoreNames() {
        return Array.from(this.h.objectStoreNames)
    }
    getName() {
        return this.h.name
    }
};

function Vd(a, b, c) {
    a = a.h.openCursor(b.query, b.direction);
    return Wd(a).then(d => Nd(d, c))
}

function Xd(a, b) {
    return Vd(a, {
        query: b
    }, c => c.delete().then(() => c.continue())).then(() => {})
}
var Sd = class {
    constructor(a) {
        this.h = a
    }
    add(a, b) {
        return W(this.h.add(a, b))
    }
    autoIncrement() {
        return this.h.autoIncrement
    }
    clear() {
        return W(this.h.clear()).then(() => {})
    }
    count(a) {
        return W(this.h.count(a))
    }
    delete(a) {
        return a instanceof IDBKeyRange ? Xd(this, a) : W(this.h.delete(a))
    }
    get(a) {
        return W(this.h.get(a))
    }
    index(a) {
        try {
            return new Yd(this.h.index(a))
        } catch (b) {
            if (b instanceof Error && "NotFoundError" === b.name) throw new Cd(a, this.h.name);
            throw b;
        }
    }
    getName() {
        return this.h.name
    }
    keyPath() {
        return this.h.keyPath
    }
    put(a, b) {
        return W(this.h.put(a, b))
    }
};

function Pd(a, b) {
    const c = new Promise((d, e) => {
        try {
            b(a).then(f => {
                d(f)
            }).catch(e)
        } catch (f) {
            e(f), a.abort()
        }
    });
    return Promise.all([c, a.done]).then(([d]) => d)
}
var Od = class {
    constructor(a) {
        this.h = a;
        this.j = new Map;
        this.i = !1;
        this.done = new Promise((b, c) => {
            this.h.addEventListener("complete", () => {
                b()
            });
            this.h.addEventListener("error", d => {
                d.currentTarget === d.target && c(this.h.error)
            });
            this.h.addEventListener("abort", () => {
                var d = this.h.error;
                if (d) c(d);
                else if (!this.i) {
                    d = U;
                    var e = this.h.objectStoreNames;
                    const f = [];
                    for (let g = 0; g < e.length; g++) {
                        const h = e.item(g);
                        if (null === h) throw Error("Invariant: item in DOMStringList is null");
                        f.push(h)
                    }
                    d = new d("UNKNOWN_ABORT", {
                        objectStoreNames: f.join(),
                        dbName: this.h.db.name,
                        mode: this.h.mode
                    });
                    c(d)
                }
            })
        })
    }
    abort() {
        this.h.abort();
        this.i = !0;
        throw new U("EXPLICIT_ABORT");
    }
    objectStore(a) {
        a = this.h.objectStore(a);
        let b = this.j.get(a);
        b || (b = new Sd(a), this.j.set(a, b));
        return b
    }
};

function Zd(a, b, c) {
    const {
        query: d = null,
        direction: e = "next"
    } = b;
    a = a.h.openCursor(d, e);
    return Wd(a).then(f => Nd(f, c))
}
var Yd = class {
    constructor(a) {
        this.h = a
    }
    count(a) {
        return W(this.h.count(a))
    }
    delete(a) {
        return Zd(this, {
            query: a
        }, b => b.delete().then(() => b.continue()))
    }
    get(a) {
        return W(this.h.get(a))
    }
    getKey(a) {
        return W(this.h.getKey(a))
    }
    keyPath() {
        return this.h.keyPath
    }
    unique() {
        return this.h.unique
    }
};

function Wd(a) {
    return W(a).then(b => b ? new $d(a, b) : null)
}
var $d = class {
    constructor(a, b) {
        this.request = a;
        this.cursor = b
    }
    advance(a) {
        this.cursor.advance(a);
        return Wd(this.request)
    }
    continue (a) {
        this.cursor.continue(a);
        return Wd(this.request)
    }
    delete() {
        return W(this.cursor.delete()).then(() => {})
    }
    getKey() {
        return this.cursor.key
    }
    update(a) {
        return W(this.cursor.update(a))
    }
};

function ae(a, b, c) {
    return new Promise((d, e) => {
        let f;
        f = void 0 !== b ? self.indexedDB.open(a, b) : self.indexedDB.open(a);
        const g = c.blocked,
            h = c.blocking,
            k = c.Ba,
            l = c.upgrade,
            n = c.closed;
        let r;
        const t = () => {
            r || (r = new Ud(f.result, {
                closed: n
            }));
            return r
        };
        f.addEventListener("upgradeneeded", m => {
            try {
                if (null === m.newVersion) throw Error("Invariant: newVersion on IDbVersionChangeEvent is null");
                if (null === f.transaction) throw Error("Invariant: transaction on IDbOpenDbRequest is null");
                m.dataLoss && "none" !== m.dataLoss && ud("IDB_DATA_CORRUPTED", {
                    reason: m.dataLossMessage || "unknown reason",
                    dbName: xd(a)
                });
                const v = t(),
                    w = new Od(f.transaction);
                l && l(v, z => m.oldVersion < z && m.newVersion >= z, w);
                w.done.catch(z => {
                    e(z)
                })
            } catch (v) {
                e(v)
            }
        });
        f.addEventListener("success", () => {
            const m = f.result;
            h && m.addEventListener("versionchange", () => {
                h(t())
            });
            m.addEventListener("close", () => {
                ud("IDB_UNEXPECTEDLY_CLOSED", {
                    dbName: xd(a),
                    dbVersion: m.version
                });
                k && k()
            });
            d(t())
        });
        f.addEventListener("error", () => {
            e(f.error)
        });
        g && f.addEventListener("blocked", () => {
            g()
        })
    })
}

function be(a, b, c = {}) {
    return ae(a, b, c)
}

function ce(a, b = {}) {
    return D(this, function*() {
        const c = self.indexedDB.deleteDatabase(a),
            d = b.blocked;
        d && c.addEventListener("blocked", () => {
            d()
        });
        yield Md(c)
    })
};

function de(a, b) {
    return new U("INCOMPATIBLE_DB_VERSION", {
        dbName: a.name,
        oldVersion: a.options.version,
        newVersion: b
    })
}
var ee = class {
    constructor(a, b) {
        this.name = a;
        this.options = b;
        this.l = !0;
        this.j = !1
    }
    i(a, b, c = {}) {
        return be(a, b, c)
    }
    delete(a = {}) {
        return ce(this.name, a)
    }
    open() {
        if (!this.l) throw de(this);
        if (this.h) return this.h;
        let a;
        const b = () => {
                this.h === a && (this.h = void 0)
            },
            c = {
                blocking: e => {
                    e.close()
                },
                closed: b,
                Ba: b,
                upgrade: this.options.upgrade
            },
            d = () => D(this, function*() {
                try {
                    var e = yield this.i(this.name, this.options.version, c);
                    a: {
                        var f = e,
                            g = this.options;
                        for (const k of Object.keys(g.T)) {
                            const {
                                M: l,
                                Ma: n = Number.MAX_VALUE
                            } = g.T[k];
                            if (f.h.version >= l && !(f.h.version >= n) && !f.h.objectStoreNames.contains(k)) {
                                var h = k;
                                break a
                            }
                        }
                        h = void 0
                    }
                    if (void 0 !== h) {
                        if (!this.j) return this.j = !0, yield this.delete(), td(new U("DB_DELETED_BY_MISSING_OBJECT_STORE", {
                            dbName: this.name,
                            ya: h
                        })), d();
                        throw new Bd(h);
                    }
                    return e
                } catch (k) {
                    if (k instanceof DOMException ? "VersionError" === k.name : "DOMError" in self && k instanceof DOMError ? "VersionError" === k.name : k instanceof Object && "message" in k && "An attempt was made to open a database using a lower version than the existing version." === k.message) {
                        e = yield this.i(this.name, void 0, Object.assign(Object.assign({}, c), {
                            upgrade: void 0
                        }));
                        h = e.h.version;
                        if (void 0 !== this.options.version && h > this.options.version + 1) throw e.close(), this.l = !1, de(this, h);
                        return e
                    }
                    b();
                    throw k;
                }
            });
        return this.h = a = d()
    }
};
const fe = new ee("YtIdbMeta", {
    T: {
        databases: {
            M: 1
        }
    },
    upgrade(a, b) {
        b(1) && Rd(a, "databases", {
            keyPath: "actualName"
        })
    }
});

function ge(a) {
    return D(this, function*() {
        return X(yield fe.open(), ["databases"], {
            D: !0,
            mode: "readwrite"
        }, b => {
            const c = b.objectStore("databases");
            return c.get(a.actualName).then(d => {
                if (d ? a.actualName !== d.actualName || a.publicName !== d.publicName || a.userIdentifier !== d.userIdentifier : 1) return c.put(a).then(() => {})
            })
        })
    })
}

function he(a) {
    return D(this, function*() {
        if (a) return (yield fe.open()).delete("databases", a)
    })
};
let ie;
const je = new class {
    constructor() {}
}(new class {
    constructor() {}
});

function ke() {
    return D(this, function*() {
        return new rd
    })
}

function le() {
    if (void 0 !== ie) return ie;
    sd = !0;
    return ie = ke().then(a => {
        sd = !1;
        return a.isSupported()
    })
}

function me() {
    return le().then(a => a ? je : void 0)
};
new Kb;

function ne(a) {
    try {
        vd();
        var b = !0
    } catch (c) {
        b = !1
    }
    if (!b) throw a = new U("AUTH_INVALID", {
        dbName: a
    }), td(a), a;
    b = vd();
    return {
        actualName: `${a}:${b}`,
        publicName: a,
        userIdentifier: b
    }
}

function oe(a, b, c, d) {
    return D(this, function*() {
        if (!(yield me())) {
            var e = new U("IDB_NOT_SUPPORTED", {
                context: {
                    caller: "openDbImpl",
                    publicName: a,
                    version: b
                }
            });
            td(e);
            throw e;
        }
        wd(a);
        e = c ? {
            actualName: a,
            publicName: a,
            userIdentifier: void 0
        } : ne(a);
        try {
            return yield ge(e), yield be(e.actualName, b, d)
        } catch (f) {
            try {
                yield he(e.actualName)
            } catch (g) {}
            throw f;
        }
    })
}

function pe(a, b, c = {}) {
    return oe(a, b, !1, c)
}

function qe(a, b, c = {}) {
    return oe(a, b, !0, c)
}

function re(a, b = {}) {
    return D(this, function*() {
        if (yield me()) {
            wd(a);
            var c = ne(a);
            yield ce(c.actualName, b);
            yield he(c.actualName)
        }
    })
}

function se(a, b = {}) {
    return D(this, function*() {
        if (yield me()) wd(a), yield ce(a, b), yield he(a)
    })
};

function te(a, b) {
    let c;
    return () => {
        c || (c = new ue(a, b));
        return c
    }
}
var ue = class extends ee {
    constructor(a, b) {
        super(a, b);
        this.options = b;
        wd(a)
    }
    i(a, b, c = {}) {
        return (this.options.Z ? qe : pe)(a, b, Object.assign({}, c))
    }
    delete(a = {}) {
        return (this.options.Z ? se : re)(this.name, a)
    }
};
const ve = ["client.name", "client.version"];

function we(a) {
    if (!a.errorMetadata || !a.errorMetadata.kvPairs) return a;
    a.errorMetadata.kvPairs = a.errorMetadata.kvPairs.filter(b => b.key ? ve.includes(b.key) : !1);
    return a
};
var xe;
xe = te("ServiceWorkerLogsDatabase", {
    T: {
        ["SWHealthLog"]: {
            M: 1
        }
    },
    Z: !0,
    upgrade: (a, b) => {
        b(1) && Rd(a, "SWHealthLog", {
            keyPath: "id",
            autoIncrement: !0
        }).h.createIndex("swHealthNewRequest", ["interface", "timestamp"], {
            unique: !1
        })
    },
    version: 1
});

function ye(a) {
    return D(this, function*() {
        var b = yield xe().open(), c = b.put, d = M("INNERTUBE_CONTEXT_CLIENT_NAME", 0);
        const e = Object.assign({}, a);
        e.clientError && (e.clientError = we(e.clientError));
        e.interface = d;
        return c.call(b, "SWHealthLog", e)
    })
};
const ze = p.ytNetworklessLoggingInitializationOptions || {
    isNwlInitialized: !1,
    databaseToken: void 0,
    potentialEsfErrorCounter: 0,
    isIdbSupported: !1
};
u("ytNetworklessLoggingInitializationOptions", ze);

function hd(a, b, c) {
    !M("VISITOR_DATA") && .01 > Math.random() && Ac(new gc("Missing VISITOR_DATA when sending innertube request.", "log_event", b, c));
    if (!a.isReady()) throw a = new gc("innertube xhrclient not ready", "log_event", b, c), zc(a), a;
    const d = {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        postParams: b,
        postBodyFormat: "JSON",
        onTimeout: () => {
            c.onTimeout()
        },
        onFetchTimeout: c.onTimeout,
        onSuccess: (k, l) => {
            if (c.onSuccess) c.onSuccess(l)
        },
        onFetchSuccess: k => {
            if (c.onSuccess) c.onSuccess(k)
        },
        onError: (k, l) => {
            if (c.onError) c.onError(l)
        },
        onFetchError: k => {
            if (c.onError) c.onError(k)
        },
        timeout: c.timeout,
        withCredentials: !0
    };
    b = "";
    var e = a.config_.ta;
    e && (b = e);
    e = pd(a.config_.wa || !1, b, c);
    Object.assign(d.headers, e);
    d.headers.Authorization && !b && (d.headers["x-origin"] = window.location.origin);
    e = `/${"youtubei"}/${a.config_.innertubeApiVersion}/${"log_event"}`;
    let f = {
        alt: "json"
    };
    a.config_.va && d.headers.Authorization || (f.key = a.config_.innertubeApiKey);
    const g = Kc(`${b}${e}`, f || {}, !0),
        h = () => {
            try {
                Nc(g, d)
            } catch (k) {
                if ("InvalidAccessError" == k.name) Ac(Error("An extension is blocking network request."));
                else throw k;
            }
        };
    O("use_new_nwl") || q("ytNetworklessLoggingInitializationOptions") && ze.isNwlInitialized ? le().then(k => {
        h(k)
    }) : h(!1)
}
class Ae {
    constructor(a) {
        this.config_ = null;
        a ? this.config_ = a : od() && (this.config_ = ed())
    }
    isReady() {
        !this.config_ && od() && (this.config_ = ed());
        return !!this.config_
    }
};
let Be = Ae;

function Ce(a, b, c = {}) {
    let d = Be;
    M("ytLoggingEventsDefaultDisabled", !1) && Be == Ae && (d = null);
    jd(a, b, d, c)
};
const De = [{
    Y: a => `Cannot read property '${a.key}'`,
    U: {
        Error: [{
            o: /(Permission denied) to access property "([^']+)"/,
            groups: ["reason", "key"]
        }],
        TypeError: [{
            o: /Cannot read property '([^']+)' of (null|undefined)/,
            groups: ["key", "value"]
        }, {
            o: /\u65e0\u6cd5\u83b7\u53d6\u672a\u5b9a\u4e49\u6216 (null|undefined) \u5f15\u7528\u7684\u5c5e\u6027\u201c([^\u201d]+)\u201d/,
            groups: ["value", "key"]
        }, {
            o: /\uc815\uc758\ub418\uc9c0 \uc54a\uc74c \ub610\ub294 (null|undefined) \ucc38\uc870\uc778 '([^']+)' \uc18d\uc131\uc744 \uac00\uc838\uc62c \uc218 \uc5c6\uc2b5\ub2c8\ub2e4./,
            groups: ["value", "key"]
        }, {
            o: /No se puede obtener la propiedad '([^']+)' de referencia nula o sin definir/,
            groups: ["key"]
        }, {
            o: /Unable to get property '([^']+)' of (undefined or null) reference/,
            groups: ["key", "value"]
        }, {
            o: /(null) is not an object \(evaluating '(?:([^.]+)\.)?([^']+)'\)/,
            groups: ["value", "base", "key"]
        }]
    }
}, {
    Y: a => `Cannot call '${a.key}'`,
    U: {
        TypeError: [{
            o: /(?:([^ ]+)?\.)?([^ ]+) is not a function/,
            groups: ["base", "key"]
        }, {
            o: /([^ ]+) called on (null or undefined)/,
            groups: ["key", "value"]
        }, {
            o: /Object (.*) has no method '([^ ]+)'/,
            groups: ["base", "key"]
        }, {
            o: /Object doesn't support property or method '([^ ]+)'/,
            groups: ["key"]
        }, {
            o: /\u30aa\u30d6\u30b8\u30a7\u30af\u30c8\u306f '([^']+)' \u30d7\u30ed\u30d1\u30c6\u30a3\u307e\u305f\u306f\u30e1\u30bd\u30c3\u30c9\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u305b\u3093/,
            groups: ["key"]
        }, {
            o: /\uac1c\uccb4\uac00 '([^']+)' \uc18d\uc131\uc774\ub098 \uba54\uc11c\ub4dc\ub97c \uc9c0\uc6d0\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4./,
            groups: ["key"]
        }]
    }
}, {
    Y: a => `${a.key} is not defined`,
    U: {
        ReferenceError: [{
            o: /(.*) is not defined/,
            groups: ["key"]
        }, {
            o: /Can't find variable: (.*)/,
            groups: ["key"]
        }]
    }
}];
var Fe = {
    B: [],
    v: [{
        la: Ee,
        weight: 500
    }]
};

function Ee(a) {
    a = a.stack;
    return a.includes("chrome://") || a.includes("chrome-extension://") || a.includes("moz-extension://")
};

function Ge() {
    if (!He) {
        var a = He = new Ie;
        a.B.length = 0;
        a.v.length = 0;
        Je(a, Fe)
    }
    return He
}

function Je(a, b) {
    b.B && a.B.push.apply(a.B, b.B);
    b.v && a.v.push.apply(a.v, b.v)
}
var Ie = class {
        constructor() {
            this.v = [];
            this.B = []
        }
    },
    He;
const Ke = new H;

function Le(a) {
    const b = a.length;
    let c = 0;
    const d = () => a.charCodeAt(c++);
    do {
        var e = Me(d);
        if (Infinity === e) break;
        const f = e >> 3;
        switch (e & 7) {
            case 0:
                e = Me(d);
                if (2 === f) return e;
                break;
            case 1:
                if (2 === f) return;
                c += 8;
                break;
            case 2:
                e = Me(d);
                if (2 === f) return a.substr(c, e);
                c += e;
                break;
            case 5:
                if (2 === f) return;
                c += 4;
                break;
            default:
                return
        }
    } while (c < b)
}

function Me(a) {
    let b = a(),
        c = b & 127;
    if (128 > b) return c;
    b = a();
    c |= (b & 127) << 7;
    if (128 > b) return c;
    b = a();
    c |= (b & 127) << 14;
    if (128 > b) return c;
    b = a();
    return 128 > b ? c | (b & 127) << 21 : Infinity
};

function Ne(a, b, c, d) {
    if (a)
        if (Array.isArray(a)) {
            var e = d;
            for (d = 0; d < a.length && !(a[d] && (e += Oe(d, a[d], b, c), 500 < e)); d++);
            d = e
        } else if ("object" === typeof a)
        for (e in a) {
            if (a[e]) {
                var f = e;
                var g = a[e],
                    h = b,
                    k = c;
                f = "string" !== typeof g || "clickTrackingParams" !== f && "trackingParams" !== f ? 0 : (g = Le(atob(g.replace(/-/g, "+").replace(/_/g, "/")))) ? Oe(`${f}.ve`, g, h, k) : 0;
                d += f;
                d += Oe(e, a[e], b, c);
                if (500 < d) break
            }
        } else c[b] = Pe(a), d += c[b].length;
    else c[b] = Pe(a), d += c[b].length;
    return d
}

function Oe(a, b, c, d) {
    c += `.${a}`;
    a = Pe(b);
    d[c] = a;
    return c.length + a.length
}

function Pe(a) {
    return ("string" === typeof a ? a : String(JSON.stringify(a))).substr(0, 500)
};
var Qe = new Set,
    Re = 0,
    Se = 0,
    Te = 0,
    Ue = [];
const Ve = ["PhantomJS", "Googlebot", "TO STOP THIS SECURITY SCAN go/scan"];

function We(a) {
    Xe(a)
}

function Xe(a, b = "ERROR") {
    var c = {};
    c.name = M("INNERTUBE_CONTEXT_CLIENT_NAME", 1);
    c.version = M("INNERTUBE_CONTEXT_CLIENT_VERSION", void 0);
    Ye(a, c || {}, b)
}

function Ye(a, b, c = "ERROR") {
    if (a) {
        a.hasOwnProperty("level") && a.level && (c = a.level);
        if (O("console_log_js_exceptions")) {
            var d = [];
            d.push(`Name: ${a.name}`);
            d.push(`Message: ${a.message}`);
            a.hasOwnProperty("params") && d.push(`Error Params: ${JSON.stringify(a.params)}`);
            a.hasOwnProperty("args") && d.push(`Error args: ${JSON.stringify(a.args)}`);
            d.push(`File name: ${a.fileName}`);
            d.push(`Stacktrace: ${a.stack}`);
            window.console.log(d.join("\n"), a)
        }
        if (!(5 <= Re)) {
            var e = Fb(a);
            d = e.message || "Unknown Error";
            const v =
                e.name || "UnknownError";
            var f = e.stack || a.i || "Not available";
            if (f.startsWith(`${v}: ${d}`)) {
                var g = f.split("\n");
                g.shift();
                f = g.join("\n")
            }
            g = e.lineNumber || "Not available";
            e = e.fileName || "Not available";
            let w = 0;
            if (a.hasOwnProperty("args") && a.args && a.args.length)
                for (var h = 0; h < a.args.length && !(w = Ne(a.args[h], `params.${h}`, b, w), 500 <= w); h++);
            else if (a.hasOwnProperty("params") && a.params) {
                const z = a.params;
                if ("object" === typeof a.params)
                    for (h in z) {
                        if (!z[h]) continue;
                        const ba = `params.${h}`,
                            N = Pe(z[h]);
                        b[ba] = N;
                        w +=
                            ba.length + N.length;
                        if (500 < w) break
                    } else b.params = Pe(z)
            }
            if (Ue.length)
                for (h = 0; h < Ue.length && !(w = Ne(Ue[h], `params.context.${h}`, b, w), 500 <= w); h++);
            navigator.vendor && !b.hasOwnProperty("vendor") && (b["device.vendor"] = navigator.vendor);
            b = {
                message: d,
                name: v,
                lineNumber: g,
                fileName: e,
                stack: f,
                params: b,
                sampleWeight: 1
            };
            d = Number(a.columnNumber);
            isNaN(d) || (b.lineNumber = `${b.lineNumber}:${d}`);
            if ("IGNORED" === a.level) var k = 0;
            else a: {
                a = Ge();d = b;
                for (k of a.B)
                    if (d.message && d.message.match(k.xa)) {
                        k = k.weight;
                        break a
                    }
                for (var l of a.v)
                    if (l.la(d)) {
                        k =
                            l.weight;
                        break a
                    }
                k = 1
            }
            b.sampleWeight = k;
            k = b;
            for (var n of De)
                if (n.U[k.name]) {
                    l = n.U[k.name];
                    for (var r of l)
                        if (l = k.message.match(r.o)) {
                            k.params["params.error.original"] = l[0];
                            a = r.groups;
                            b = {};
                            for (d = 0; d < a.length; d++) b[a[d]] = l[d + 1], k.params[`params.error.${a[d]}`] = l[d + 1];
                            k.message = n.Y(b);
                            break
                        }
                }
            k.params || (k.params = {});
            n = Ge();
            k.params["params.errorServiceSignature"] = `msg=${n.B.length}&cb=${n.v.length}`;
            k.params["params.serviceWorker"] = "true";
            p.document && p.document.querySelectorAll && (k.params["params.fscripts"] =
                String(document.querySelectorAll("script:not([nonce])").length));
            x("sample").constructor !== oa && (k.params["params.fconst"] = "true");
            window.yterr && "function" === typeof window.yterr && window.yterr(k);
            if (0 !== k.sampleWeight && !Qe.has(k.message)) {
                "ERROR" === c ? (Ke.L("handleError", k), O("record_app_crashed_web") && 0 === Te && 1 === k.sampleWeight && (Te++, Ce("appCrashed", {
                    appCrashType: "APP_CRASH_TYPE_BREAKPAD"
                })), Se++) : "WARNING" === c && Ke.L("handleWarning", k);
                b: {
                    for (t of Ve)
                        if ((n = ra) && 0 <= n.toLowerCase().indexOf(t.toLowerCase())) {
                            var t = !0;
                            break b
                        }
                    t = !1
                }
                if (t) var m = void 0;
                else {
                    n = {
                        stackTrace: k.stack
                    };
                    k.fileName && (n.filename = k.fileName);
                    t = k.lineNumber && k.lineNumber.split ? k.lineNumber.split(":") : [];
                    0 !== t.length && (1 !== t.length || isNaN(Number(t[0])) ? 2 !== t.length || isNaN(Number(t[0])) || isNaN(Number(t[1])) || (n.lineNumber = Number(t[0]), n.columnNumber = Number(t[1])) : n.lineNumber = Number(t[0]));
                    t = {
                        level: "ERROR_LEVEL_UNKNOWN",
                        message: k.message,
                        errorClassName: k.name,
                        sampleWeight: k.sampleWeight
                    };
                    "ERROR" === c ? t.level = "ERROR_LEVEL_ERROR" : "WARNING" === c &&
                        (t.level = "ERROR_LEVEL_WARNNING");
                    n = {
                        isObfuscated: !0,
                        browserStackInfo: n
                    };
                    r = {
                        pageUrl: window.location.href,
                        kvPairs: []
                    };
                    M("FEXP_EXPERIMENTS") && (r.experimentIds = M("FEXP_EXPERIMENTS"));
                    if (l = k.params)
                        for (m of Object.keys(l)) r.kvPairs.push({
                            key: `client.${m}`,
                            value: String(l[m])
                        });
                    m = M("SERVER_NAME", void 0);
                    l = M("SERVER_VERSION", void 0);
                    m && l && (r.kvPairs.push({
                        key: "server.name",
                        value: m
                    }), r.kvPairs.push({
                        key: "server.version",
                        value: l
                    }));
                    m = {
                        errorMetadata: r,
                        stackTrace: n,
                        logMessage: t
                    }
                }
                m && (Ce("clientError", m), ("ERROR" ===
                    c || O("errors_flush_gel_always_killswitch")) && $c());
                try {
                    Qe.add(k.message)
                } catch (z) {}
                Re++
            }
        }
    }
};

function Ze(a) {
    return D(a, function*() {
        var b = yield p.fetch(this.i);
        if (200 !== b.status) return Promise.reject("Server error when retrieving AmbientData");
        b = yield b.text();
        if (!b.startsWith(")]}'\n")) return Promise.reject("Incorrect JSPB formatting");
        a: {
            b = JSON.parse(b.substring(5));
            for (let c = 0; c < b.length; c++)
                if (b[c][0] === (new pc).constructor.ga) {
                    b = new pc(b[c]);
                    break a
                }
            b = null
        }
        return b ? b : Promise.reject("AmbientData missing from response")
    })
}

function $e(a = !1) {
    return D(af.h, function*() {
        if (a || !this.h) this.h = Ze(this).then(this.j).catch(b => {
            delete this.h;
            Xe(b)
        });
        return this.h
    })
}
var af = class {
    constructor(a) {
        this.i = a
    }
    j(a) {
        var b;
        a.h || (a.h = {});
        a.h[2] || (b = C(a, 2, !1)) && (a.h[2] = new oc(b));
        b = a.h[2];
        if (b) {
            const c = C(b, 5);
            c && (p.__SAPISID = c);
            null != C(b, 7) && L("VISITOR_DATA", C(b, 7));
            null != C(b, 4) && L("SESSION_INDEX", String(C(b, 4)));
            null != C(b, 8) && L("DELEGATED_SESSION_ID", C(b, 8))
        }
        return a
    }
};

function bf(a) {
    const b = {};
    var c = tb();
    c && (b.Authorization = c, c = a = null === a || void 0 === a ? void 0 : a.sessionIndex, void 0 === c && (c = Number(M("SESSION_INDEX", 0)), c = isNaN(c) ? 0 : c), b["X-Goog-AuthUser"] = c, "INNERTUBE_HOST_OVERRIDE" in K || (b["X-Origin"] = window.location.origin), void 0 === a && "DELEGATED_SESSION_ID" in K && (b["X-Goog-PageId"] = M("DELEGATED_SESSION_ID")));
    return b
}
var cf = class {
    constructor() {
        this.Aa = !0
    }
};
var df = {
    identityType: "UNAUTHENTICATED_IDENTITY_TYPE_UNKNOWN"
};
let ef = Date.now().toString();
let ff = p.ytLoggingDocDocumentNonce_;
if (!ff) {
    var gf;
    a: {
        if (window.crypto && window.crypto.getRandomValues) try {
            const d = Array(16),
                e = new Uint8Array(16);
            window.crypto.getRandomValues(e);
            for (let f = 0; f < d.length; f++) d[f] = e[f];
            gf = d;
            break a
        } catch (d) {}
        const c = Array(16);
        for (let d = 0; 16 > d; d++) {
            const e = Date.now();
            for (let f = 0; f < e % 23; f++) c[d] = Math.random();
            c[d] = Math.floor(256 * Math.random())
        }
        if (ef) {
            let d = 1;
            for (let e = 0; e < ef.length; e++) c[d % 16] = c[d % 16] ^ c[(d - 1) % 16] / 4 ^ ef.charCodeAt(e), d++
        }
        gf = c
    }
    const a = gf,
        b = [];
    for (let c = 0; c < a.length; c++) b.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(a[c] &
        63));
    ff = b.join("")
};

function hf(a, b) {
    b.encryptedTokenJarContents && (a.h[b.encryptedTokenJarContents] = b, "string" === typeof b.expirationSeconds && setTimeout(() => {
        delete a.h[b.encryptedTokenJarContents]
    }, 1E3 * Number(b.expirationSeconds)))
}
var jf = class {
    constructor() {
        this.h = {}
    }
    handleResponse(a, b) {
        var c, d, e;
        b = (null === (d = null === (c = b.G.context) || void 0 === c ? void 0 : c.request) || void 0 === d ? void 0 : d.consistencyTokenJars) || [];
        if (a = null === (e = a.responseContext) || void 0 === e ? void 0 : e.consistencyTokenJar) {
            for (const f of b) delete this.h[f.encryptedTokenJarContents];
            hf(this, a)
        }
    }
};

function kf() {
    var a = M("INNERTUBE_CONTEXT");
    if (!a) return Xe(Error("Error: No InnerTubeContext shell provided in ytconfig.")), {};
    a = la(a);
    O("web_no_tracking_params_in_shell_killswitch") || delete a.clickTracking;
    a.client || (a.client = {});
    var b = a.client;
    b.utcOffsetMinutes = -Math.floor((new Date).getTimezoneOffset());
    var c = M("EXPERIMENTS_TOKEN", "");
    c ? b.experimentsToken = c : delete b.experimentsToken;
    jf.h || (jf.h = new jf);
    b = jf.h.h;
    c = [];
    let d = 0;
    for (const e in b) c[d++] = b[e];
    a.request = Object.assign(Object.assign({},
        a.request), {
        consistencyTokenJars: c
    });
    a.user = Object.assign({}, a.user);
    return a
};

function lf(a) {
    var b = a;
    if (a = M("INNERTUBE_HOST_OVERRIDE")) {
        a = String(a);
        var c = String,
            d = b.match(A);
        b = d[5];
        var e = d[6];
        d = d[7];
        var f = "";
        b && (f += b);
        e && (f += "?" + e);
        d && (f += "#" + d);
        b = a + c(f)
    }
    return b
};
var mf = class {};
const nf = {
    ["GET_DATASYNC_IDS"]: class extends mf {}
};

function of (a) {
    var b = {
        Ha: {}
    };
    cf.h || (cf.h = new cf);
    var c = cf.h;
    if (void 0 !== pf.h) {
        const d = pf.h;
        a = [b !== d.l, a !== d.j, c !== d.i, !1, !1, void 0 !== d.h];
        if (a.some(e => e)) throw new gc("InnerTubeTransportService is already initialized", a);
    } else pf.h = new pf(b, a, c)
}

function qf(a, b, c) {
    return D(a, function*() {
        var d;
        if (this.i.Aa) {
            const e = null === (d = null === b || void 0 === b ? void 0 : b.da) || void 0 === d ? void 0 : d.sessionIndex;
            d = bf({
                sessionIndex: e
            });
            d = Object.assign(Object.assign({}, rf(c)), d)
        } else d = sf(b, c);
        return d
    })
}

function tf(a, b, c) {
    var d, e;
    return D(a, function*() {
        for (var f of []) f.La(b.G.context);
        if (null === (d = this.h) || void 0 === d ? 0 : d.l(b.input, b.G)) return this.h.j(b.input, b.G);
        f = JSON.stringify(b.G);
        b.V = Object.assign(Object.assign({}, b.V), {
            headers: c
        });
        let g = Object.assign({}, b.V);
        "POST" === b.V.method && (g = Object.assign(Object.assign({}, g), {
            body: f
        }));
        f = yield this.j.fetch(b.input, g, b.config);
        !f && (null === (e = this.h) || void 0 === e ? 0 : e.h(b.input, b.G)) && (f = yield this.h.i(b.input, b.G));
        return f
    })
}

function uf(a, b, c) {
    var d = {
        da: {
            identity: df
        }
    };
    b.context || (b.context = kf());
    return new F(e => D(a, function*() {
        var f = lf(c);
        f = Lc(f) ? "same-origin" : "cors";
        f = yield qf(this, d, f);
        var g = lf(c);
        M("INNERTUBE_OMIT_API_KEY_WHEN_AUTH_HEADER_IS_PRESENT") && (null === f || void 0 === f ? 0 : f.Authorization) || (g = Kc(g, {
            key: M("INNERTUBE_API_KEY")
        }, !1));
        var h = {
            method: "POST",
            mode: Lc(g) ? "same-origin" : "cors",
            credentials: Lc(g) ? "same-origin" : "include"
        };
        e(tf(this, {
            input: g,
            V: h,
            G: b,
            config: d
        }, f))
    }))
}

function sf(a, b) {
    var c;
    a = null === (c = null === a || void 0 === a ? void 0 : a.da) || void 0 === c ? void 0 : c.sessionIndex;
    return Ob(bf({
        sessionIndex: a
    })).then(d => Promise.resolve(Object.assign(Object.assign({}, rf(b)), d)))
}

function rf(a) {
    const b = {
            "Content-Type": "application/json"
        },
        c = M("VISITOR_DATA");
    c && (b["X-Goog-Visitor-Id"] = c);
    "cors" !== a && ((a = M("INNERTUBE_CONTEXT_CLIENT_NAME")) && (b["X-Youtube-Client-Name"] = a), (a = M("INNERTUBE_CONTEXT_CLIENT_VERSION")) && (b["X-Youtube-Client-Version"] = a), (a = M("CHROME_CONNECTED_HEADER")) && (b["X-Youtube-Chrome-Connected"] = a), O("forward_domain_admin_state_on_embeds") && (a = M("DOMAIN_ADMIN_STATE")) && (b["X-Youtube-Domain-Admin-State"] = a));
    return b
}
var pf = class {
    constructor(a, b, c) {
        this.l = a;
        this.j = b;
        this.i = c;
        this.h = void 0;
        a.aa || (a.aa = {});
        a.aa = Object.assign(Object.assign({}, nf), a.aa)
    }
};
let vf;

function wf() {
    vf || ( of ({
        fetch: (a, b) => Ob(fetch(new Request(a, b)))
    }), vf = pf.h);
    return vf
};

function Y(a) {
    return D(this, function*() {
        yield xf();
        Xe(a, "WARNING")
    })
}

function yf(a) {
    D(this, function*() {
        var b = yield me();
        O("nwl_sw_health_payloads") && b ? yield ye(a): (yield $e(), b = {
            timestamp: a.timestamp
        }, b = a.appShellAssetLoadReport ? {
            payloadName: "appShellAssetLoadReport",
            payload: a.appShellAssetLoadReport,
            options: b
        } : a.clientError ? {
            payloadName: "clientError",
            payload: a.clientError,
            options: b
        } : void 0, b && Ce(b.payloadName, b.payload))
    })
}

function xf() {
    return D(this, function*() {
        try {
            yield $e()
        } catch (a) {}
    })
};
const zf = {
    granted: "GRANTED",
    denied: "DENIED",
    unknown: "UNKNOWN"
};

function Af(a) {
    var b = a.data;
    a = b.type;
    b = b.data;
    "notifications_register" === a ? (I("IDToken", b), Bf()) : "notifications_check_registration" === a && Cf(b)
}

function Df() {
    return self.clients.matchAll({
        type: "window",
        includeUncontrolled: !0
    }).then(a => {
        if (a)
            for (const b of a) b.postMessage({
                type: "update_unseen_notifications_count_signal"
            })
    })
}

function Ef(a) {
    const b = [];
    a.forEach(c => {
        b.push({
            key: c.key,
            value: c.value
        })
    });
    return b
}

function Ff(a) {
    return D(this, function*() {
        const b = Ef(a.payload.chrome.extraUrlParams),
            c = {
                recipientId: a.recipientId,
                endpoint: a.payload.chrome.endpoint,
                extraUrlParams: b
            },
            d = nc(bc);
        return Gf().then(e => uf(e, c, d).then(f => {
            f.json().then(g => {
                if (!g || !g.endpointUrl) return Promise.resolve();
                a.payload.chrome.postedEndpoint && Hf(a.payload.chrome.postedEndpoint);
                return If(a, g.endpointUrl)
            })
        }))
    })
}

function If(a, b) {
    a.deviceId && I("DeviceId", a.deviceId);
    a.timestampSec && I("TimestampLowerBound", a.timestampSec);
    const c = a.payload.chrome;
    return self.registration.showNotification(c.title, {
        body: c.body,
        icon: c.iconUrl,
        data: {
            nav: b,
            id: c.notificationId,
            attributionTag: c.attributionTag,
            clickEndpoint: c.clickEndpoint
        },
        tag: c.title + c.body + c.iconUrl,
        requireInteraction: !0
    }).then(() => {
        Jf(a.displayCap)
    }).catch(() => {})
}

function Hf(a) {
    if (!a.recordNotificationInteractionsEndpoint) return Promise.reject();
    const b = {
            serializedRecordNotificationInteractionsRequest: a.recordNotificationInteractionsEndpoint.serializedInteractionsRequest
        },
        c = nc(cc);
    return Gf().then(d => uf(d, b, c))
}

function Jf(a) {
    -1 !== a && self.registration.getNotifications().then(b => {
        for (let c = 0; c < b.length - a; c++) b[c].close()
    })
}

function Cf(a) {
    const b = [Kf(a), J("RegistrationTimestamp").then(Lf), Mf(), Nf(), Of()];
    Promise.all(b).catch(() => {
        I("IDToken", a);
        Bf();
        return Promise.resolve()
    })
}

function Lf(a) {
    return 9E7 >= Date.now() - (a || 0) ? Promise.resolve() : Promise.reject()
}

function Kf(a) {
    return J("IDToken").then(b => a === b ? Promise.resolve() : Promise.reject())
}

function Mf() {
    return J("Permission").then(a => Notification.permission === a ? Promise.resolve() : Promise.reject())
}

function Nf() {
    return J("Endpoint").then(a => Pf().then(b => a === b ? Promise.resolve() : Promise.reject()))
}

function Of() {
    return J("application_server_key").then(a => Qf().then(b => a === b ? Promise.resolve() : Promise.reject()))
}

function Rf() {
    var a = Notification.permission;
    if (zf[a]) return zf[a]
}

function Bf() {
    I("RegistrationTimestamp", 0);
    Promise.all([Pf(), Sf(), Tf(), Qf()]).then(([a, b, c, d]) => {
        b = b ? ec(b) : null;
        c = c ? ec(c) : null;
        d = d ? Qa(new Uint8Array(d), 4) : null;
        Uf(a, b, c, d)
    }).catch(() => {
        Uf()
    })
}

function Uf(a = null, b = null, c = null, d = null) {
    jc().then(e => {
        e && (I("Endpoint", a), I("P256dhKey", b), I("AuthKey", c), I("application_server_key", d), I("Permission", Notification.permission), Promise.all([J("DeviceId"), J("NotificationsDisabled")]).then(([f, g]) => {
            if (null !== f && void 0 !== f) var h = f;
            else {
                f = [];
                var k;
                h = h || ac.length;
                for (k = 0; 256 > k; k++) f[k] = ac[0 | Math.random() * h];
                h = f.join("")
            }
            Vf(h, null !== a && void 0 !== a ? a : void 0, null !== b && void 0 !== b ? b : void 0, null !== c && void 0 !== c ? c : void 0, null !== d && void 0 !== d ? d : void 0, null !==
                g && void 0 !== g ? g : void 0)
        }))
    })
}

function Vf(a, b, c, d, e, f) {
    D(this, function*() {
        const g = {
                notificationRegistration: {
                    chromeRegistration: {
                        deviceId: a,
                        pushParams: {
                            applicationServerKey: e,
                            authKey: d,
                            p256dhKey: c,
                            browserEndpoint: b
                        },
                        notificationsDisabledInApp: f,
                        permission: Rf()
                    }
                }
            },
            h = nc(dc);
        return Gf().then(k => uf(k, g, h).then(() => {
            I("DeviceId", a);
            I("RegistrationTimestamp", Date.now());
            I("TimestampLowerBound", Date.now())
        }, l => {
            Y(l)
        }))
    })
}

function Pf() {
    return self.registration.pushManager.getSubscription().then(a => a ? Promise.resolve(a.endpoint) : Promise.resolve(null))
}

function Sf() {
    return self.registration.pushManager.getSubscription().then(a => a && a.getKey ? Promise.resolve(a.getKey("p256dh")) : Promise.resolve(null))
}

function Tf() {
    return self.registration.pushManager.getSubscription().then(a => a && a.getKey ? Promise.resolve(a.getKey("auth")) : Promise.resolve(null))
}

function Qf() {
    return self.registration.pushManager.getSubscription().then(a => a ? Promise.resolve(a.options.applicationServerKey) : Promise.resolve(null))
}

function Gf() {
    return D(this, function*() {
        try {
            return yield $e(!0), wf()
        } catch (a) {
            return yield Y(a), Promise.reject(a)
        }
    })
};
let Wf = void 0;

function Xf(a) {
    return D(this, function*() {
        Wf || (Wf = yield a.open("yt-appshell-assets"));
        return Wf
    })
}

function Yf(a, b) {
    return D(this, function*() {
        const c = yield Xf(a), d = b.map(e => Zf(c, e));
        return Promise.all(d)
    })
}

function $f(a, b) {
    return D(this, function*() {
        let c;
        try {
            c = yield a.match(b, {
                cacheName: "yt-appshell-assets"
            })
        } catch (d) {}
        return c
    })
}

function ag(a, b) {
    return D(this, function*() {
        const c = yield Xf(a), d = (yield c.keys()).filter(e => !b.includes(e.url)).map(e => c.delete(e));
        return Promise.all(d)
    })
}

function bg(a, b, c) {
    return D(this, function*() {
        yield(yield Xf(a)).put(b, c)
    })
}

function cg(a, b) {
    D(this, function*() {
        yield(yield Xf(a)).delete(b)
    })
}

function Zf(a, b) {
    return D(this, function*() {
        return (yield a.match(b)) ? Promise.resolve() : a.add(b)
    })
};
var Z;
Z = te("yt-serviceworker-metadata", {
    T: {
        ["auth"]: {
            M: 1
        },
        ["resource-manifest-assets"]: {
            M: 2
        }
    },
    Z: !0,
    upgrade(a, b) {
        b(1) && Rd(a, "resource-manifest-assets");
        b(2) && Rd(a, "auth")
    },
    version: 2
});
let dg = null;

function eg() {
    return D(fg, function*() {
        const a = yield me();
        if (a) return fg.h || (fg.h = new fg(a)), fg.h
    })
}

function gg(a, b) {
    return D(a, function*() {
        yield X(yield Z().open(), ["resource-manifest-assets"], "readwrite", c => {
            const d = c.objectStore("resource-manifest-assets"),
                e = Date.now();
            return d.put(b, e).then(() => {
                dg = e;
                let f = !0;
                return Vd(d, {
                    query: IDBKeyRange.bound(0, Date.now()),
                    direction: "prev"
                }, g => f ? (f = !1, g.advance(5)) : d.delete(g.getKey()).then(() => g.continue()))
            })
        })
    })
}

function hg(a, b) {
    return D(a, function*() {
        let c = !1,
            d = 0;
        yield X(yield Z().open(), ["resource-manifest-assets"], "readonly", e => Vd(e.objectStore("resource-manifest-assets"), {
            query: IDBKeyRange.bound(0, Date.now()),
            direction: "prev"
        }, f => {
            if (f.cursor.value.includes(b)) c = !0;
            else return d += 1, f.continue()
        }));
        return c ? d : -1
    })
}

function ig(a) {
    return D(a, function*() {
        dg || (yield X(yield Z().open(), ["resource-manifest-assets"], "readonly", b => Vd(b.objectStore("resource-manifest-assets"), {
            query: IDBKeyRange.bound(0, Date.now()),
            direction: "prev"
        }, c => {
            dg = c.getKey()
        })));
        return dg
    })
}
var fg = class {
    constructor(a) {
        this.token = a
    }
};

function jg() {
    return D(kg, function*() {
        const a = yield me();
        if (a) return kg.h || (kg.h = new kg(a)), kg.h
    })
}

function lg(a, b) {
    return D(a, function*() {
        yield(yield Z().open()).put("auth", b, "shell_identifier_key")
    })
}

function mg(a) {
    return D(a, function*() {
        return (yield(yield Z().open()).get("auth", "shell_identifier_key")) || ""
    })
}

function ng(a) {
    return D(a, function*() {
        yield(yield Z().open()).clear("auth")
    })
}
var kg = class {
    constructor(a) {
        this.token = a
    }
};

function og() {
    D(this, function*() {
        const a = yield jg();
        a && (yield ng(a))
    })
};

function pg(a, b) {
    for (; La(b);) switch (b.m) {
        case 10:
            var c = b,
                d = Ka(c.h);
            c = c.h;
            var e = c.h;
            c.h += d;
            var f = c.i,
                g = d;
            if (Ba) d = f, c = e, f = g, (e = Aa) || (e = Aa = new TextDecoder("utf-8", {
                fatal: !1
            })), d = e.decode(d.subarray(c, c + f));
            else {
                var h = c = d = void 0;
                let k;
                g = e + g;
                const l = [];
                let n = null;
                for (; e < g;) k = f[e++], 128 > k ? l.push(k) : 224 > k ? e >= g ? l.push(65533) : (h = f[e++], 194 > k || 128 !== (h & 192) ? (e--, l.push(65533)) : l.push((k & 31) << 6 | h & 63)) : 240 > k ? e >= g - 1 ? l.push(65533) : (h = f[e++], 128 !== (h & 192) || 224 === k && 160 > h || 237 === k && 160 <= h || 128 !== ((c = f[e++]) & 192) ?
                    (e--, l.push(65533)) : l.push((k & 15) << 12 | (h & 63) << 6 | c & 63)) : 244 >= k ? e >= g - 2 ? l.push(65533) : (h = f[e++], 128 !== (h & 192) || 0 !== (k << 28) + (h - 144) >> 30 || 128 !== ((c = f[e++]) & 192) || 128 !== ((d = f[e++]) & 192) ? (e--, l.push(65533)) : (h = (k & 7) << 18 | (h & 63) << 12 | (c & 63) << 6 | d & 63, h -= 65536, l.push((h >> 10 & 1023) + 55296, (h & 1023) + 56320))) : l.push(65533), 8192 <= l.length && (n = za(n, l), l.length = 0);
                d = za(n, l)
            }
            fb(a, d);
            break;
        default:
            if (!jb(a, b)) return a
    }
    return a
}
var qg = class extends bb {
    constructor(a) {
        super(a)
    }
};

function rg(a) {
    a: {
        var b = new sg;
        for (a = new Ma(a); La(a);) switch (a.m) {
            case 10:
                var c = b,
                    d = a,
                    e = new qg,
                    f = pg;
                const h = d.h.j;
                var g = Ka(d.h);
                g = d.h.h + g;
                d.h.j = g;
                f(e, d);
                d.h.h = g;
                d.h.j = h;
                d = e;
                f = qg;
                e = gb(c, f);
                d = d ? d : new f;
                c = eb(c);
                e.push(d);
                c.push(ib(d, !1));
                break;
            default:
                if (!jb(b, a)) break a
        }
    }
    return b
}
var sg = class extends bb {
        constructor() {
            super(void 0, -1, tg)
        }
    },
    tg = [1];

function ug(a) {
    return D(this, function*() {
        const b = a.headers.get("X-Resource-Manifest");
        return b ? Promise.resolve(vg(b)) : Promise.reject(Error("No resource manifest header"))
    })
}

function vg(a) {
    return gb(rg(decodeURIComponent(a)), qg).reduce((b, c) => {
        (c = C(c, 1)) && b.push(c);
        return b
    }, [])
};

function wg(a) {
    return D(a, function*() {
        const b = yield $e();
        if (b && null != C(b, 3)) {
            var c = yield jg();
            c && (c = yield mg(c), C(b, 3) !== c && (cg(this.h, this.i), og()))
        }
    })
}

function xg(a) {
    return D(a, function*() {
        let b, c;
        try {
            c = yield yg(this, this.j), b = yield ug(c), yield Yf(this.h, b)
        } catch (d) {
            return Promise.reject(d)
        }
        try {
            yield zg(this), yield bg(this.h, this.i, c)
        } catch (d) {
            return Promise.reject(d)
        }
        if (b) try {
            yield Ag(this, b, this.i)
        } catch (d) {}
        return Promise.resolve()
    })
}

function Bg(a) {
    return D(a, function*() {
        yield wg(this);
        return xg(this)
    })
}

function yg(a, b) {
    return D(a, function*() {
        try {
            return yield p.fetch(new Request(b))
        } catch (c) {
            return Promise.reject(c)
        }
    })
}

function zg(a) {
    return D(a, function*() {
        var b = yield $e();
        let c;
        b && null != C(b, 3) && (c = C(b, 3));
        return c ? (b = yield jg()) ? Promise.resolve(lg(b, c)) : Promise.reject(Error("Could not get AuthMonitor instance")) : Promise.reject(Error("Could not get datasync ID"))
    })
}

function Ag(a, b, c) {
    return D(a, function*() {
        const d = yield eg();
        if (d) try {
            yield gg(d, b)
        } catch (e) {
            yield Y(e)
        }
        b.push(c);
        try {
            yield ag(this.h, b)
        } catch (e) {
            yield Y(e)
        }
        return Promise.resolve()
    })
}

function Cg(a, b) {
    return D(a, function*() {
        return $f(this.h, b)
    })
}

function Dg(a) {
    return D(a, function*() {
        return $f(this.h, this.i)
    })
}
var Eg = class {
    constructor() {
        var a = self.location.origin + "/app_shell",
            b = self.location.origin + "/app_shell_home";
        this.h = self.caches;
        this.j = a;
        this.i = b
    }
};

function Fg(a, b) {
    return D(a, function*() {
        const c = b.request,
            d = yield Cg(this.h, c.url);
        if (d) return yf({
            appShellAssetLoadReport: {
                assetPath: c.url,
                cacheHit: !0
            },
            timestamp: Q()
        }), d;
        Gg(c);
        return Hg(b)
    })
}

function Ig(a, b) {
    return D(a, function*() {
        const c = yield Jg(this, b);
        if (c.response && (c.response.ok || "opaqueredirect" === c.response.type || 429 === c.response.status || 303 === c.response.status || 300 <= c.response.status && 400 > c.response.status)) return c.response;
        const d = yield Dg(this.h);
        if (d) return Kg(this), d;
        Lg(this);
        return c.response ? c.response : Promise.reject(c.error)
    })
}

function Mg(a, b) {
    b = new URL(b);
    if (!a.i.includes(b.pathname)) return !1;
    if (!b.search) return !0;
    for (const c of a.l)
        if (a = b.searchParams.get(c.key), void 0 === c.value || a === c.value)
            if (b.searchParams.delete(c.key), !b.search) return !0;
    return !1
}

function Ng(a, b) {
    return D(a, function*() {
        const c = yield Dg(this.h);
        if (!c) return Lg(this), Hg(b);
        Kg(this);
        var d;
        a: {
            if (c.headers && (d = c.headers.get("date")) && (d = Date.parse(d), !isNaN(d))) {
                d = Math.round(Q() - d);
                break a
            }
            d = -1
        }
        if (!(-1 < d && 7 <= d / 864E5)) return c;
        d = yield Jg(this, b);
        return d.response && d.response.ok ? d.response : c
    })
}

function Hg(a) {
    return Promise.resolve(a.preloadResponse).then(b => b || p.fetch(a.request))
}

function Gg(a) {
    const b = {
        assetPath: a.url,
        cacheHit: !1
    };
    eg().then(c => {
        if (c) {
            var d = ig(c).then(e => {
                e && (b.currentAppBundleTimestampSec = String(Math.floor(e / 1E3)))
            });
            c = hg(c, a.url).then(e => {
                b.appBundleVersionDiffCount = e
            });
            Promise.all([d, c]).catch(e => {
                Y(e)
            }).finally(() => {
                yf({
                    appShellAssetLoadReport: b,
                    timestamp: Q()
                })
            })
        } else yf({
            appShellAssetLoadReport: b,
            timestamp: Q()
        })
    })
}

function Kg(a) {
    yf({
        appShellAssetLoadReport: {
            assetPath: a.h.i,
            cacheHit: !0
        },
        timestamp: Q()
    })
}

function Lg(a) {
    yf({
        appShellAssetLoadReport: {
            assetPath: a.h.i,
            cacheHit: !1
        },
        timestamp: Q()
    })
}

function Jg(a, b) {
    return D(a, function*() {
        try {
            return {
                response: yield Hg(b)
            }
        } catch (c) {
            return {
                error: c
            }
        }
    })
}
var Tg = class {
    constructor() {
        var a = Og,
            b = Pg,
            c = Qg,
            d = Rg;
        const e = [];
        e.push({
            key: "feature",
            value: "ytca"
        });
        for (var f of lb) e.push({
            key: f
        });
        f = Sg();
        this.h = a;
        this.m = b;
        this.s = c;
        this.i = d;
        this.l = e;
        this.j = f
    }
};
var Rg = ["/", "/feed/downloads"];
const Ug = [/^\/$/, /^\/feed\/downloads$/],
    Vg = [/^\/$/, /^\/feed\/\w*/, /^\/results$/, /^\/playlist$/, /^\/watch$/, /^\/channel\/\w*/];

function Sg() {
    return new RegExp((O("kevlar_sw_app_wide_fallback") ? Vg : Ug).map(a => a.source).join("|"))
}
var Pg = /^https:\/\/[\w-]*\.?youtube\.com.*(\.css$|\.js$|\.ico$|\/ytmweb\/_\/js\/|\/ytmweb\/_\/ss\/)/,
    Qg = /^https:\/\/[\w-]*\.?youtube\.com.*(purge_shell=1|\/signin|\/logout)/;
var Wg = class {
    constructor() {
        var a = Og,
            b = new Tg;
        this.h = self;
        this.i = a;
        this.m = b;
        this.L = fc
    }
    init() {
        this.h.oninstall = this.s.bind(this);
        this.h.onactivate = this.j.bind(this);
        this.h.onfetch = this.l.bind(this);
        this.h.onmessage = this.I.bind(this)
    }
    s(a) {
        a.waitUntil(this.h.skipWaiting());
        const b = Bg(this.i).catch(c => {
            Y(c);
            return Promise.resolve()
        });
        a.waitUntil(b)
    }
    j(a) {
        const b = [this.h.clients.claim()];
        this.h.registration.navigationPreload && b.push(this.h.registration.navigationPreload.enable());
        a.waitUntil(Promise.all(b))
    }
    l(a) {
        return D(this, function*() {
            var b = this.m,
                c = !!this.h.registration.navigationPreload;
            const d = a.request;
            if (b.s.test(d.url)) af.h && (delete af.h.h, p.__SAPISID = void 0, L("VISITOR_DATA", void 0), L("SESSION_INDEX", void 0), L("DELEGATED_SESSION_ID", void 0)), c = a.respondWith, b = b.h, cg(b.h, b.i), og(), b = Hg(a), c.call(a, b);
            else if (b.m.test(d.url)) a.respondWith(Fg(b,
                a));
            else if ("navigate" === d.mode) {
                if (O("sw_nav_request_network_first")) {
                    var e = new URL(d.url);
                    e = b.j.test(e.pathname)
                } else e = !1;
                e ? a.respondWith(Ig(b, a)) : Mg(b, d.url) ? a.respondWith(Ng(b, a)) : c && a.respondWith(Hg(a))
            }
        })
    }
    I(a) {
        const b = a.data;
        this.L.includes(b.type) ? Af(a) : "refresh_shell" === b.type && xg(this.i).catch(c => {
            Y(c)
        })
    }
};

function Xg() {
    let a = q("ytglobal.storage_");
    a || (a = new Yg, u("ytglobal.storage_", a));
    return a
}
var Yg = class {
    estimate() {
        var a, b;
        return D(this, function*() {
            const c = navigator;
            if (null === (a = c.storage) || void 0 === a ? 0 : a.estimate) return c.storage.estimate();
            if (null === (b = c.webkitTemporaryStorage) || void 0 === b ? 0 : b.queryUsageAndQuota) return Zg()
        })
    }
};

function Zg() {
    const a = navigator;
    return new Promise((b, c) => {
        var d;
        null !== (d = a.webkitTemporaryStorage) && void 0 !== d && d.queryUsageAndQuota ? a.webkitTemporaryStorage.queryUsageAndQuota((e, f) => {
            b({
                usage: e,
                quota: f
            })
        }, e => {
            c(e)
        }) : c(Error("webkitTemporaryStorage is not supported."))
    })
}
u("ytglobal.storageClass_", Yg);

function $g(a, b) {
    Xg().estimate().then(c => {
        c = Object.assign(Object.assign({}, b), {
            isSw: void 0 === self.document,
            isIframe: self !== self.top,
            deviceStorageUsageMbytes: ah(null === c || void 0 === c ? void 0 : c.usage),
            deviceStorageQuotaMbytes: ah(null === c || void 0 === c ? void 0 : c.quota)
        });
        a.h("idbQuotaExceeded", c)
    })
}
class bh {
    constructor() {
        var a = ch;
        this.handleError = dh;
        this.h = a;
        this.i = !1;
        void 0 === self.document || self.addEventListener("beforeunload", () => {
            this.i = !0
        });
        this.j = Math.random() <= uc("ytidb_transaction_ended_event_rate_limit", .02)
    }
    S(a, b) {
        switch (a) {
            case "IDB_DATA_CORRUPTED":
                O("idb_data_corrupted_killswitch") || this.h("idbDataCorrupted", b);
                break;
            case "IDB_UNEXPECTEDLY_CLOSED":
                this.h("idbUnexpectedlyClosed", b);
                break;
            case "IS_SUPPORTED_COMPLETED":
                O("idb_is_supported_completed_killswitch") || this.h("idbIsSupportedCompleted", b);
                break;
            case "QUOTA_EXCEEDED":
                $g(this, b);
                break;
            case "TRANSACTION_ENDED":
                this.j && this.h("idbTransactionEnded", b);
                break;
            case "TRANSACTION_UNEXPECTEDLY_ABORTED":
                a =
                    Object.assign(Object.assign({}, b), {
                        hasWindowUnloaded: this.i
                    }), this.h("idbTransactionAborted", a)
        }
    }
}

function ah(a) {
    return "undefined" === typeof a ? "-1" : String(Math.ceil(a / 1048576))
};
Je(Ge(), {
    B: [{
        xa: /Failed to fetch/,
        weight: 500
    }],
    v: []
});
var {
    handleError: dh = We,
    S: ch = Ce
} = {
    handleError: function(a) {
        return D(this, function*() {
            yield xf();
            Xe(a)
        })
    },
    S: function(a, b) {
        return D(this, function*() {
            yield xf();
            Ce(a, b)
        })
    }
};
for (T = new bh; 0 < S.length;) {
    const a = S.shift();
    switch (a.type) {
        case "ERROR":
            T.handleError(a.payload);
            break;
        case "EVENT":
            T.S(a.eventType, a.payload)
    }
}
af.h = new af(`${self.location.origin}/sw.js_data`);
self.onnotificationclick = function(a) {
    a.notification.close();
    const b = a.notification.data,
        c = self.clients.matchAll({
            type: "window",
            includeUncontrolled: !0
        });
    c.then(d => {
        a: {
            var e = b.nav;
            for (const f of d)
                if (f.url === e) {
                    f.focus();
                    break a
                }
            self.clients.openWindow(e)
        }
    });
    a.waitUntil(c);
    a.waitUntil(Hf(b.clickEndpoint))
};
self.onpush = function(a) {
    a.waitUntil(J("NotificationsDisabled").then(b => {
        if (b) return Promise.resolve();
        if (a.data && a.data.text().length) try {
            return Ff(a.data.json())
        } catch (c) {
            return Promise.resolve(c.message)
        }
        return Promise.resolve()
    }));
    a.waitUntil(Df())
};
self.onpushsubscriptionchange = function() {
    Bf()
};
const Og = new Eg;
(new Wg).init();