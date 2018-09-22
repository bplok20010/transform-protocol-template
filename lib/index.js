
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _xml2js = require("xml2js");

var _compileTemplate = _interopRequireDefault(require("./compileTemplate"));

var _vm = _interopRequireDefault(require("vm"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isObject(val) {
  return val != null && _typeof(val) === 'object' && Array.isArray(val) === false;
}

;

function jsonEncode(obj) {
  return JSON.stringify(obj);
}

function jsonDecode(str) {
  return JSON.parse(str);
}

function xml2obj() {
  var xml = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var result;
  (0, _xml2js.parseString)(xml, function (err, obj) {
    if (err) {
      throw err;
    }

    result = obj;
  });
  return result;
}

function obj2xml(obj) {
  var builder = new _xml2js.Builder();
  return builder.buildObject(obj);
}

function createSandbox(data) {
  var target = {
    isNaN: isNaN,
    isObject: isObject,
    Function: Function,
    Array: Array,
    Object: Object,
    JSON: JSON,
    Set: Set,
    Map: Map,
    parseInt: parseInt,
    parseFloat: parseFloat,
    Math: Math,
    String: String,
    Date: Date,
    json: jsonEncode,
    xml: obj2xml,
    jsonEncode: jsonEncode,
    jsonDecode: jsonDecode,
    xml2obj: xml2obj,
    obj2xml: obj2xml,
    $data: data
  };
  target.$self = target;
  var handler = {
    get: function get(target, name) {
      if (isObject(data) && name in data) {
        return data[name];
      }

      return target[name];
    },
    set: function set(target, name, value) {
      if (isObject(data) && name in data) {
        data[name] = value;
      } else {
        target[name] = value;
      }
    }
  };
  return new Proxy(target, handler);
}

function _default(template, data) {
  var sandbox = createSandbox(data);
  var context = new _vm.default.createContext(sandbox);
  var code = (0, _compileTemplate.default)(template);
  var script = new _vm.default.Script(code);
  script.runInContext(context);
  return context.__p;
}