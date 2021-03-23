// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/eventemitter3/index.js":[function(require,module,exports) {
'use strict';

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}

},{}],"src/plant.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var eventemitter3_1 = __importDefault(require("eventemitter3"));

var Plant =
/** @class */
function () {
  function Plant() {
    this.eventEmitter = new eventemitter3_1.default();
    this.health = 1;
    this.toughness = 0;
    this.attack = 0;
  }

  Plant.prototype.destroy = function () {
    console.log('Plant model destroy');
    this.eventEmitter.emit('destroy', this);
  };

  Plant.create = function (spec) {
    var plant = new Plant();
    plant.type = spec.type || 0;
    plant.toughness = spec.toughness || 0.5;
    plant.attack = spec.attack || 0.5;
    return plant;
  };

  return Plant;
}();

exports.default = Plant;
},{"eventemitter3":"node_modules/eventemitter3/index.js"}],"src/plant-spec.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var PlantSpec =
/** @class */
function () {
  function PlantSpec() {
    this.toughness = 0.5;
    this.attack = 0.5;
  }

  return PlantSpec;
}();

exports.default = PlantSpec;
},{}],"src/zombie.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var eventemitter3_1 = __importDefault(require("eventemitter3"));

var Zombie =
/** @class */
function () {
  function Zombie() {
    this.eventEmitter = new eventemitter3_1.default();
  }

  Object.defineProperty(Zombie.prototype, "state", {
    get: function get() {
      return this._state;
    },
    set: function set(value) {
      var oldState = this._state;
      this._state = value;
      this.eventEmitter.emit('state-change', this, oldState);
    },
    enumerable: false,
    configurable: true
  });

  Zombie.create = function (spec) {
    var zombie = new Zombie();
    zombie.type = spec.type || 0;
    zombie.progress = 0;
    zombie.health = 1;
    zombie.speed = spec.speed || 1;
    zombie.attack = spec.attack || 1;
    zombie.toughness = spec.toughness || 1;
    return zombie;
  };

  return Zombie;
}();

exports.default = Zombie;
},{"eventemitter3":"node_modules/eventemitter3/index.js"}],"src/zombie-spec.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ZombieSpec =
/** @class */
function () {
  function ZombieSpec() {
    this.attack = 0.5;
    this.toughness = 0.5;
  }

  return ZombieSpec;
}();

exports.default = ZombieSpec;
},{}],"src/entity-manager.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var plant_1 = __importDefault(require("./plant"));

var plant_spec_1 = __importDefault(require("./plant-spec"));

var zombie_1 = __importDefault(require("./zombie"));

var zombie_spec_1 = __importDefault(require("./zombie-spec"));

var EntityManager =
/** @class */
function () {
  function EntityManager() {
    this._zombieSpecs = []; // Create zombie specs here for now

    var zombie = new zombie_spec_1.default();
    zombie.type = 0;
    zombie.name = 'Normal';
    zombie.speed = 0.6;
    zombie.attack = 0.5;

    this._zombieSpecs.push(zombie);

    zombie = new zombie_spec_1.default();
    zombie.type = 1;
    zombie.name = 'Cone Head';
    zombie.speed = 0.4;
    zombie.attack = 0.9;

    this._zombieSpecs.push(zombie); // Plants


    this._plantSpecs = [];
    var plant = new plant_spec_1.default();
    plant.type = 0;
    plant.name = 'Brick';
    plant.toughness = 0.9;

    this._plantSpecs.push(plant);

    plant = new plant_spec_1.default();
    plant.type = 1;
    plant.name = 'Salad';
    plant.toughness = 0.1;

    this._plantSpecs.push(plant);

    plant = new plant_spec_1.default();
    plant.type = 2;
    plant.name = 'Chilli';
    plant.toughness = 0.8;
    plant.attack = 0.8;

    this._plantSpecs.push(plant);

    plant = new plant_spec_1.default();
    plant.type = 3;
    plant.name = 'Cherry';
    plant.toughness = 0.5;

    this._plantSpecs.push(plant);
  }

  Object.defineProperty(EntityManager.prototype, "numPlants", {
    get: function get() {
      return this._plantSpecs.length;
    },
    enumerable: false,
    configurable: true
  });

  EntityManager.prototype.createZombie = function (type) {
    var zombieSpec = this._zombieSpecs[type];
    var zombie = zombie_1.default.create(zombieSpec);
    return zombie;
  };

  EntityManager.prototype.createPlant = function (type) {
    var plantSpec = this._plantSpecs[type];
    var plant = plant_1.default.create(plantSpec);
    return plant;
  };

  return EntityManager;
}();

exports.default = EntityManager;
},{"./plant":"src/plant.ts","./plant-spec":"src/plant-spec.ts","./zombie":"src/zombie.ts","./zombie-spec":"src/zombie-spec.ts"}],"src/square.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var eventemitter3_1 = __importDefault(require("eventemitter3"));

var Square =
/** @class */
function () {
  function Square(rowIndex, colIndex) {
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
    this.eventEmitter = new eventemitter3_1.default();
  }

  Square.prototype.addPlant = function (plant) {
    var _this = this;

    this.plant = plant;
    this.plant.eventEmitter.addListener('destroy', function (plant) {
      console.log('Square destroy plant ', plant);
      _this.plant = null;

      _this.eventEmitter.emit('destroy', _this);
    });
    this.eventEmitter.emit('plant-added', this);
  };

  return Square;
}();

exports.default = Square;
},{"eventemitter3":"node_modules/eventemitter3/index.js"}],"src/row.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var eventemitter3_1 = __importDefault(require("eventemitter3"));

var square_1 = __importDefault(require("./square"));

var Row =
/** @class */
function () {
  function Row(index) {
    this.index = index;
    this.squares = [];
    this.zombies = [];
    this.eventEmitter = new eventemitter3_1.default();
  }

  Row.create = function (numCols, index) {
    var row = new Row(index);

    for (var i = 0; i < numCols; i++) {
      var square = new square_1.default(index, i);
      row.squares.push(square);
      square.eventEmitter.addListener('plant-added', function (square) {
        console.log('Row plant added ', square);
        row.eventEmitter.emit('plant-added', square);
      });
      ;
    }

    return row;
  };

  Row.prototype.addZombie = function (zombie) {
    zombie.parent = this;
    this.zombies.push(zombie);
    this.eventEmitter.emit('add', zombie);
    var row = this;
    zombie.eventEmitter.addListener('remove', function (e) {
      row.removeZombie(zombie);
    });
  };

  Row.prototype.removeZombie = function (zombie) {
    var index = this.zombies.indexOf(zombie);

    if (index == -1) {
      console.log('Zombie not found');
      return;
    }

    this.zombies.splice(index, 1);
    this.eventEmitter.emit('remove', zombie);
  };

  return Row;
}();

exports.default = Row;
},{"eventemitter3":"node_modules/eventemitter3/index.js","./square":"src/square.ts"}],"src/model.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var eventemitter3_1 = __importDefault(require("eventemitter3"));

var plant_spec_1 = __importDefault(require("./plant-spec"));

var row_1 = __importDefault(require("./row"));

var Model =
/** @class */
function () {
  function Model() {
    var _this = this;

    this.numCols = 9;
    this.numRows = 5;
    this.eventEmitter = new eventemitter3_1.default();
    this.rows = [];

    for (var i = 0; i < this.numRows; i++) {
      var row = row_1.default.create(this.numCols, i);
      row.eventEmitter.addListener('plant-added', function (square) {
        console.log('model plant added ', square);

        _this.eventEmitter.emit('plant-added', square);
      });
      this.rows.push(row);
    } // Plant


    this.plants = [];

    for (var i = 0; i < 4; i++) {
      var plantSpec = new plant_spec_1.default();
      this.plants.push(plantSpec);
    }
  }

  return Model;
}();

exports.default = Model;
},{"eventemitter3":"node_modules/eventemitter3/index.js","./plant-spec":"src/plant-spec.ts","./row":"src/row.ts"}],"src/renderer.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var eventemitter3_1 = __importDefault(require("eventemitter3"));

var Renderer =
/** @class */
function () {
  function Renderer(_model) {
    var _this = this;

    this._model = _model;
    this.debug = true;
    this._squareSize = 100;
    this.eventEmitter = new eventemitter3_1.default();
    this._zombieStartX = this._model.numCols * this._squareSize;
    this._zombiesToEl = new Map();

    this._model.eventEmitter.addListener('plant-added', function (square) {
      console.log('renderer heard model plant-added');

      _this.addPlant(square);
    });
  }

  Renderer.prototype.createPlantMenu = function () {
    var menuHolder = document.querySelector('#plant-menu');

    this._model.plants.forEach(function (plantSpec, index) {
      var plantButton = document.createElement('div');
      plantButton.innerHTML = "\n        <div class=\"plantish plant-button\" type=\"" + index + "\">\n          Plant " + index + "\n        </div>\n      ";
      menuHolder.appendChild(plantButton);
    });
  };

  Renderer.prototype.creatRow = function (row, rowIndex) {
    var _this = this;

    var el = document.createElement('div');
    el.classList.add('row'); //el.innerHTML = 'ROW';

    el.style.top = rowIndex * this._squareSize + "px"; // Add squares to row

    row.squares.forEach(function (square, colIndex) {
      var squareEl = _this.createSquare(colIndex);

      squareEl.setAttribute('row', String(rowIndex));
      squareEl.setAttribute('col', String(colIndex));
      var n = rowIndex * _this._model.numCols + colIndex;
      var styles = ['green-light', 'green-med', 'green-dark'];
      var c = 0;

      if (colIndex % 2 === 0) {
        c++;
      }

      if (rowIndex % 2 !== 0) {
        c++;
      }

      squareEl.classList.add('square');
      squareEl.classList.add(styles[c]);
      el.appendChild(squareEl);
    });
    return el;
  };

  Renderer.prototype.createSquare = function (index) {
    var el = document.createElement('div');
    el.classList.add('square'); //el.innerHTML = 'SQUARE';

    el.style.left = this._squareSize * index + "px";
    el.style.width = this._squareSize + "px";
    el.style.height = this._squareSize + "px";
    return el;
  };

  Renderer.prototype.createZombie = function (zombie) {
    var el = document.createElement('div');
    el.classList.add('zombie');
    el.setAttribute('type', zombie.type); // el.innerHTML = 'ZOMBIE';

    el.style.left = this._squareSize * this._model.numCols + "px";
    el.style.width = this._squareSize + "px";
    el.style.height = this._squareSize + "px";

    this._zombiesToEl.set(zombie, el);

    zombie.eventEmitter.addListener('state-change', function (zombie, oldState) {
      //console.log('Renderer heard Zombie state change ', zombie.state);
      el.classList.remove(oldState);

      if (zombie.state) {
        el.classList.add(zombie.state);
      }
    });

    if (this.debug) {
      this.addDebugger(el, zombie);
    }

    return el;
  };

  Renderer.prototype.removeZombie = function (zombie) {
    var el = this._zombiesToEl.get(zombie);

    if (el) {
      el.parentElement.removeChild(el);
    }
  };

  Renderer.prototype.addPlant = function (square) {
    var el = document.createElement('div');
    el.classList.add('plant');
    el.classList.add('plantish');
    -el.innerHTML;
    'PLANT' + square.plant.type;
    el.setAttribute('type', '' + square.plant.type);
    var squareEl = this.getSquareElement(square);
    squareEl.appendChild(el);
    square.eventEmitter.addListener('destroy', this.removePlantHandler.bind(this));
    return el;
  };

  Renderer.prototype.removePlantHandler = function (square) {
    console.log('renderer destroy plant');
    var squareEl = this.getSquareElement(square);
    var plantEl = squareEl.querySelector('.plant');
    squareEl.removeChild(plantEl);
  };

  Renderer.prototype.getSquareElement = function (square) {
    return document.querySelector(".square[row=\"" + square.rowIndex + "\"][col=\"" + square.colIndex + "\"]");
  };

  Renderer.prototype.addDebugger = function (el, zombie) {
    var info = document.createElement('div');
    info.classList.add('debugger');
    info.innerHTML = 'I am a debugger';
    el.appendChild(info);
  };

  Renderer.prototype.updateDebugger = function (el, zombie) {
    var debuggerEl = el.querySelector('.debugger');

    if (debuggerEl) {
      debuggerEl.innerHTML = '' + parseInt(zombie.health * 100, 10);
    }
  };

  Renderer.prototype.init = function () {
    var _this = this;

    var gameContainer = document.querySelector('#game');
    this.createPlantMenu(); // Plant Menu

    document.querySelectorAll('.plant-button').forEach(function (button) {
      button.addEventListener('click', function () {
        console.log('Select plant ' + button.getAttribute('type'));

        _this.eventEmitter.emit('plant-selected', button.getAttribute('type'));
      });
    });

    this._model.rows.forEach(function (row, index) {
      row.eventEmitter.addListener('remove', function (zombie) {
        // Remove zombie sprite
        var el = _this._zombiesToEl.get(zombie);

        el.parentElement.removeChild(el);
      });

      var rowEl = _this.creatRow(row, index); //rowEl.style.zIndex = -10000;


      gameContainer.appendChild(rowEl); // render zombies

      row.zombies.forEach(function (zombie) {
        var zombieEl = _this.createZombie(zombie);

        rowEl.appendChild(zombieEl);
      });
      row.eventEmitter.addListener('add', function (zombie) {
        var zombieEl = _this.createZombie(zombie);

        rowEl.appendChild(zombieEl);
      });
    });

    gameContainer.querySelectorAll('.square').forEach(function (square) {
      square.addEventListener('click', function () {
        console.log('Square Click!');

        _this.eventEmitter.emit('square-click', square.getAttribute('row'), square.getAttribute('col'));
      });
    });
  };

  Renderer.prototype.render = function () {
    var _this = this;

    this._model.rows.forEach(function (row, index) {
      row.zombies.forEach(function (zombie) {
        var zombieEl = _this._zombiesToEl.get(zombie);

        if (zombieEl) {
          //zombieEl.innerHTML = zombie.squareN + '';
          zombieEl.style.left = _this._zombieStartX - zombie.progress * _this._zombieStartX + "px"; // zombieEl.classList.add(zombie.state);

          if (_this.debug) {
            _this.updateDebugger(zombieEl, zombie);
          }
        }
      });
      row.squares.forEach(function (square) {
        var squareEl = _this.getSquareElement(square);

        if (square.plant) {
          var plant = squareEl.querySelector('.plant');
          plant.innerHTML = square.plant.type + " - " + square.plant.health;
        } // const zombieEl = this._zombiesToEl.get(zombie);
        // if (zombieEl) {
        //   zombieEl.innerHTML = zombie.squareN + '';
        //   zombieEl.style.left = `${this._zombieStartX - (zombie.progress * this._zombieStartX)}px`;  
        // }  

      });
    });
  };

  return Renderer;
}();

exports.default = Renderer;
},{"eventemitter3":"node_modules/eventemitter3/index.js"}],"src/game.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var entity_manager_1 = __importDefault(require("./entity-manager"));

var model_1 = __importDefault(require("./model"));

var renderer_1 = __importDefault(require("./renderer"));

var Game =
/** @class */
function () {
  function Game() {
    var _this = this;

    this._currentPlant = 0; // TODO make singleton

    this._entityManager = new entity_manager_1.default();
    this._model = new model_1.default();
    this._renderer = new renderer_1.default(this._model);

    this._renderer.init();

    this._renderer.eventEmitter.addListener('square-click', function (row, col) {
      console.log('Game square-click ', row, col);

      _this.addPlantToModel(row, col, _this._currentPlant);
    });

    this._renderer.eventEmitter.addListener('plant-selected', function (id) {
      console.log('Game plant selected ' + id);
      _this._currentPlant = id;
    });

    this.startGame();
  }

  Game.prototype.gameLoop = function () {
    var _this = this;

    var renderFactor = 0.02;
    var speedFactor = 0.005;
    if (this._endGame) return;

    this._model.rows.forEach(function (row) {
      row.zombies.forEach(function (zombie) {
        // Plant detection
        var halfSquare = 1 / _this._model.numCols * 0.5;
        var squareN = _this._model.numCols - Math.ceil((zombie.progress - halfSquare) * _this._model.numCols);
        zombie.squareN = squareN;
        var zombieSquare = row.squares[squareN]; // If Zombie is eating a plant

        if (zombieSquare && zombieSquare.plant) {
          zombie.state = 'eating';
          var plant = zombieSquare.plant;
          var plantAttack = (plant.attack + plant.toughness) / 2 * renderFactor;
          var zombieAttack = (zombie.attack + zombie.toughness) / 2 * renderFactor;
          ;
          zombie.health -= plantAttack;
          plant.health -= zombieAttack;

          if (zombie.health <= 0) {
            zombie.parent.removeZombie(zombie);
          }

          if (zombieSquare.plant.health <= 0) {
            zombieSquare.plant.destroy();
            zombie.state = '';
          }
        } else {
          if (zombie.state) {
            zombie.state = '';
          }

          zombie.progress += zombie.speed * speedFactor;
        } // Destroy Zombie when reaches end 


        if (zombie.progress >= 1) {
          zombie.parent.removeZombie(zombie);
        }
      });

      if (_this.randomAdd() && row.zombies.length < 1) {
        var typeID = Math.round(Math.random());
        row.addZombie(_this._entityManager.createZombie(typeID));
      }
    });

    this._renderer.render(); //requestAnimationFrame(this.gameLoop.bind(this));

  };

  Game.prototype.randomAdd = function () {
    return Math.random() < 0.05;
  };

  Game.prototype.startGame = function () {
    setInterval(this.gameLoop.bind(this), 50);
  };

  Game.prototype.addPlantToModel = function (row, col, plantID) {
    console.log('Game.addPlant', row, col);
    var square = this._model.rows[row].squares[col];

    if (square.plant) {
      console.log('Square already has a plant');
      return;
    } //const plantID:number = Math.round(Math.random() * (this._entityManager.numPlants - 1));


    var plant = this._entityManager.createPlant(plantID);

    square.addPlant(plant);
  };

  return Game;
}();

exports.default = Game;
},{"./entity-manager":"src/entity-manager.ts","./model":"src/model.ts","./renderer":"src/renderer.ts"}],"src/index.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var game_1 = __importDefault(require("./game"));

var game = new game_1.default();
},{"./game":"src/game.ts"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50156" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.js.map