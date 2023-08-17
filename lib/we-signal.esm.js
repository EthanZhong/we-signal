/** 创建信号symbol值 */
var SignalSymbol = Symbol('Signal-Create');
/** 信号类 */
var Signal = /** @class */ (function () {
    /**
     * 构造函数
     * @param type 信号类型与侦听器类型匹配
     * @param data 信号数据
     * @param origin 发射该信号的发射器
     * @param feature 信号特性
     */
    function Signal(symbol, type, data, origin, feature) {
        if (feature === void 0) { feature = Signal.Features.exact; }
        this.type = type;
        this.data = data;
        this.origin = origin;
        this.feature = feature;
        if (symbol !== SignalSymbol) {
            throw new Error('Please use [Signal.create]');
        }
    }
    /**
     * 创建信号
     * @param type 信号类型与侦听器类型匹配
     * @param data 信号数据
     * @param origin 发射该信号的发射器
     * @param feature 信号特性
     */
    Signal.create = function (type, data, origin, feature) {
        if (feature === void 0) { feature = Signal.Features.exact; }
        return new Signal(SignalSymbol, type, data, origin, feature);
    };
    /** 信号特性常量 */
    Signal.Features = {
        exact: 'exact',
        upward: 'upward',
        downward: 'downward',
        whole: 'whole',
    };
    return Signal;
}());

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

/** 创建侦听器symbol值 */
var ListenerSymbol = Symbol('Listener-Create');
/** 侦听器类 */
var Listener = /** @class */ (function () {
    /**
     * 侦听器构造函数
     * @param type 侦听器类型需要和信号类型匹配
     * @param handler 侦听器处理函数
     * @param emitter 侦听器所属发射器
     * @param context 侦听器处理函数上下文
     * @param count 侦听器可处理信号的次数，默认 `-1` 无限次数
     * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
     */
    function Listener(symbol, type, handler, emitter, context, count, catchFeature) {
        if (context === void 0) { context = null; }
        if (count === void 0) { count = -1; }
        if (catchFeature === void 0) { catchFeature = Signal.Features.exact; }
        this.type = type;
        this.handler = handler;
        this.emitter = emitter;
        this.context = context;
        this.count = count;
        this.catchFeature = catchFeature;
        if (symbol !== ListenerSymbol) {
            throw new Error('Please use [Listener.create]');
        }
    }
    Object.defineProperty(Listener.prototype, "active", {
        /** 获取当前侦听器是否还可以接收处理信号 */
        get: function () {
            return this.count !== 0;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 处理信号
     * @param signal 信号
     */
    Listener.prototype.handle = function (signal) {
        if (this.active && this.type === signal.type) {
            /** 侦听器是否捕获到所属发射器发射的信号 */
            var matchExact = this.emitter === signal.origin;
            /** 侦听器是否可以捕获所有特性信号 */
            var canCatchWhole = this.catchFeature === Signal.Features.whole;
            /** 侦听器是否可以捕获全局特性信号 */
            var catchWholeSignal = this.catchFeature !== Signal.Features.exact &&
                signal.feature === Signal.Features.whole;
            /** 侦听器是否捕获到对应特性信号 */
            var matchFeature = this.catchFeature === signal.feature;
            /** 条件符合处理信号 */
            if (matchExact || canCatchWhole || catchWholeSignal || matchFeature) {
                if (this.count > 0)
                    --this.count;
                this.handler.call(this.context, signal);
            }
        }
    };
    /**
     * 创建侦听器
     * @param type 侦听器类型需要和信号类型匹配
     * @param handler 侦听器处理函数
     * @param emitter 侦听器所属发射器
     * @param context 侦听器处理函数上下文
     * @param count 侦听器可处理信号的次数，默认 `-1` 无限次数
     * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
     */
    Listener.create = function (type, handler, emitter, context, count, catchFeature) {
        if (context === void 0) { context = null; }
        if (count === void 0) { count = -1; }
        if (catchFeature === void 0) { catchFeature = Signal.Features.exact; }
        return new Listener(ListenerSymbol, type, handler, emitter, context, count, catchFeature);
    };
    return Listener;
}());

/** 发射器类 */
var Emitter = /** @class */ (function () {
    function Emitter() {
        /** 父级发射器 */
        this._parent = null;
        /** 子级发射器 */
        this._children = [];
        /** 侦听器集合 */
        this._listeners = {};
    }
    Object.defineProperty(Emitter.prototype, "totalListener", {
        /** 获取侦听器总数 */
        get: function () {
            return Object.values(this._listeners).reduce(function (pre, current) { return pre + current.length; }, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Emitter.prototype, "parent", {
        /** 获取父级发射器 */
        get: function () {
            return this._parent;
        },
        /** 设置父级发射器 */
        set: function (newParent) {
            var oldParent = this._parent;
            if (newParent !== oldParent) {
                if (oldParent)
                    oldParent.removeChild(this);
                if (newParent)
                    newParent.addChild(this);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Emitter.prototype, "children", {
        /** 获取子级发射器 */
        get: function () {
            return this._children;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 添加子级发射器
     * @param children 需要被添加的子级发射器
     */
    Emitter.prototype.addChild = function () {
        var _this = this;
        var children = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            children[_i] = arguments[_i];
        }
        children.forEach(function (child) {
            if (!_this.hasChild(child)) {
                _this._children.push(child);
                child._parent = _this;
            }
        });
    };
    /**
     * 删除子级发射器
     * @param children 需要被删除的子级发射器，无参数时清空所有子级发射器
     */
    Emitter.prototype.removeChild = function () {
        var _this = this;
        var children = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            children[_i] = arguments[_i];
        }
        if (!children.length)
            children = __spreadArray([], this.children, true);
        children.forEach(function (child) {
            var index = _this.getChildIndex(child);
            if (index > -1) {
                _this._children.splice(index, 1);
                child._parent = null;
            }
        });
    };
    /**
     * 判断是否有对应的子级发射器
     * @param child 子级发射器
     * @returns
     */
    Emitter.prototype.hasChild = function (child) {
        return this._children.includes(child);
    };
    /**
     * 获取子级发射器索引值
     * @param child 子级发射器
     * @returns
     */
    Emitter.prototype.getChildIndex = function (child) {
        return this._children.indexOf(child);
    };
    /**
     * 添加侦听器
     * @param type 侦听器类型
     * @param handler 侦听器处理函数
     * @param context 侦听器处理函数上下文
     * @param count 侦听器可处理信号的次数，默认 `-1` 无限次数
     * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
     * @returns {boolean} 是否添加成功
     */
    Emitter.prototype.addListener = function (type, handler, context, count, catchFeature) {
        var _a;
        var _b;
        if (context === void 0) { context = null; }
        if (count === void 0) { count = -1; }
        if (catchFeature === void 0) { catchFeature = Signal.Features.exact; }
        if (!type || !handler || count === 0)
            return false;
        this.removeListener(type, handler, context, catchFeature);
        (_a = (_b = this._listeners)[type]) !== null && _a !== void 0 ? _a : (_b[type] = []);
        this._listeners[type].push(Listener.create(type, handler, this, context, count, catchFeature));
        return true;
    };
    /**
     * 添加侦听器
     * @param type 侦听器类型
     * @param handler 侦听器处理函数
     * @param context 侦听器处理函数上下文
     * @param count 侦听器可处理信号的次数，默认 `-1` 无限次数
     * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
     */
    Emitter.prototype.on = function (type, handler, context, count, catchFeature) {
        if (context === void 0) { context = null; }
        if (count === void 0) { count = -1; }
        if (catchFeature === void 0) { catchFeature = Signal.Features.exact; }
        return this.addListener(type, handler, context, count, catchFeature);
    };
    /**
     * 添加一次性侦听器
     * @param type 侦听器类型
     * @param handler 侦听器处理函数
     * @param context 侦听器处理函数上下文
     * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
     */
    Emitter.prototype.once = function (type, handler, context, catchFeature) {
        if (context === void 0) { context = null; }
        if (catchFeature === void 0) { catchFeature = Signal.Features.exact; }
        return this.addListener(type, handler, context, 1, catchFeature);
    };
    /**
     * 卸载侦听器
     * @param type 侦听器类型
     * @param handler 侦听器处理函数
     * @param context 侦听器处理函数上下文
     * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
     */
    Emitter.prototype.removeListener = function (type, handler, context, catchFeature) {
        if (context === void 0) { context = null; }
        if (catchFeature === void 0) { catchFeature = Signal.Features.exact; }
        if (!type) {
            this._listeners = {};
        }
        else if (!handler) {
            delete this._listeners[type];
        }
        else if (this._listeners[type]) {
            var listeners = this._listeners[type];
            var index = listeners.length - 1;
            while (index > -1) {
                var listener = listeners[index];
                if (handler === listener.handler &&
                    context === listener.context &&
                    catchFeature === listener.catchFeature)
                    listeners.splice(index, 1);
                --index;
            }
            if (!listeners.length)
                delete this._listeners[type];
        }
    };
    /**
     * 卸载侦听器
     * @param type 侦听器类型
     * @param handler 侦听器处理函数
     * @param context 侦听器处理函数上下文
     * @param catchFeature 可捕获到的信号特性，默认 `exact` 精准信号
     */
    Emitter.prototype.off = function (type, handler, context, catchFeature) {
        if (context === void 0) { context = null; }
        if (catchFeature === void 0) { catchFeature = Signal.Features.exact; }
        return this.removeListener(type, handler, context, catchFeature);
    };
    /**
     * 发射信号
     * @param type 信号类型
     * @param data 信号数据
     * @param feature 信号特性
     */
    Emitter.prototype.emit = function (type, data, feature) {
        if (data === void 0) { data = null; }
        if (feature === void 0) { feature = Signal.Features.exact; }
        /** 创建本次发射的信号 */
        var signal = Signal.create(type, data, this, feature);
        /** 发射器自身优先接收到本次信号 */
        this.receive(signal);
        /** 信号是否全局发射 */
        var isWhole = feature === Signal.Features.whole;
        /** 信号向上发射 */
        if (isWhole || feature === Signal.Features.upward) {
            this.emitUpWard(signal);
        }
        /** 信号向下发射 */
        if (isWhole || feature === Signal.Features.downward) {
            this.emitDownWard(signal);
        }
    };
    /**
     * 销毁自身
     */
    Emitter.prototype.destroy = function () {
        this.parent = null;
        this.removeChild();
        this.removeListener();
    };
    /**
     * 接收信号
     * @param signal 信号
     */
    Emitter.prototype.receive = function (signal) {
        var _this = this;
        var _a;
        var type = signal.type;
        var listeners = (_a = this._listeners[type]) !== null && _a !== void 0 ? _a : [];
        if (listeners.length) {
            var invalids_1 = [];
            listeners.forEach(function (listener) {
                listener.handle(signal);
                if (!listener.active)
                    invalids_1.push(listener);
            });
            invalids_1.forEach(function (listener) {
                _this.removeListener(type, listener.handler, listener.context, listener.catchFeature);
            });
        }
    };
    /**
     * 向上发射信号
     * @param signal 信号
     */
    Emitter.prototype.emitUpWard = function (signal) {
        var parent = this.parent;
        while (parent) {
            parent.receive(signal);
            parent = parent.parent;
        }
    };
    /**
     * 向下发射信号
     * @param signal 信号
     */
    Emitter.prototype.emitDownWard = function (signal) {
        if (this.children.length > 0) {
            this.children.forEach(function (child) {
                child.receive(signal);
                child.emitDownWard(signal);
            });
        }
    };
    return Emitter;
}());

export { Emitter, Signal };
//# sourceMappingURL=we-signal.esm.js.map
