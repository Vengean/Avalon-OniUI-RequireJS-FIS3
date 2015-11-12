define(["avalon"], function(avalon) {
    if (Object.prototype.toString.call(window.JSON) === "[object JSON]") {
        return window.JSON
    } else {
        var JSON = window.JSON = {fake: true}
        function f(n) {//补零
            return n < 10 ? '0' + n : n
        }
        function toJSON(obj, type) {//序列化字符串,数字,布尔与日期
            return type === "date" ? '(new Date(' + obj.valueOf() + '))' : type === "string" ? quote(obj) : obj + "";
        }
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                gap,
                indent,
                meta = {// table of character substitutions
                    '\b': '\\b',
                    '\t': '\\t',
                    '\n': '\\n',
                    '\f': '\\f',
                    '\r': '\\r',
                    '"': '\\"',
                    '\\': '\\\\'
                },
        rep;
        function quote(string) {//为字符串两边加双引号
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
                var c = meta[a];
                return typeof c === 'string'
                        ? c
                        : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"'
        }
        //开始序列化各种数据类型
        function str(key, holder) {
            var i, // The loop counter.
                    k, // The member key.
                    v, // The member value.
                    length,
                    mind = gap,
                    partial,
                    value = holder[key];
            if (value) {
                var type = avalon.type(value);
                if (/date|string|number|boolean/i.test(type)) {
                    return toJSON(value, type);
                }
            }
            if (typeof rep === 'function') {
                value = rep.call(holder, key, value)
            }
            switch (typeof value) {
                case 'string':
                    return quote(value)
                case 'number':
                    return isFinite(value) ? String(value) : 'NaN'
                case 'boolean':
                case 'null':
                    return String(value)
                case 'object':
                    if (!value) {
                        return 'null'
                    }
                    gap += indent
                    partial = []
                    if (Array.isArray(value)) {
                        length = value.length
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null'
                        }
                        v = partial.length === 0
                                ? '[]'
                                : gap
                                ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                                : '[' + partial.join(',') + ']'
                        gap = mind
                        return v
                    }
                    if (rep && typeof rep === 'object') {
                        length = rep.length
                        for (i = 0; i < length; i += 1) {
                            if (typeof rep[i] === 'string') {
                                k = rep[i]
                                v = str(k, value)
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v)
                                }
                            }
                        }
                    } else {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }
                    v = partial.length === 0
                            ? '{}'
                            : gap
                            ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                            : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        }
        JSON.stringify = function(value, replacer, space) {
            var i;
            gap = '';
            indent = '';
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

            } else if (typeof space === 'string') {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                            typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            return str('', {'': value});
        };
        JSON.parse = function(text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return '\\u' +
                            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                            .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                j = eval('(' + text + ')');
                return typeof reviver === 'function'
                        ? walk({'': j}, '')
                        : j;
            }

            throw new SyntaxError('JSON.parse')
        };
        return window.JSON
    }
})