function EthList(items) {
  var arr = [];
  arr.push.apply(arr, items);
  arr.__proto__ = EthList.prototype;
  return arr;
}
EthList.prototype = new Array();

function list() {
  return new EthList(Array.prototype.slice.call(arguments));
}

function symbol(name) {
  if (isKeyword(name)) {
    name = keywordName(name);
  }
  return '\uFEFF\'' + name;
}

function keyword(name) {
  if (isSymbol(name)) {
    name = symbolName(name);
  }
  return '\uA789' + name;
}

function string() {
  var values = Array.prototype.slice(arguments);
  return values.join('');
}

function isList(v) {
  return v instanceof EthList;
}
function isArray(v) {
  return !(v instanceof EthList) && Array.isArray(v);
}
function isObject(v) {
  return !isList(v) && !isArray(v) && v !== null && typeof v === 'object';
}
function isSymbol(v) {
  return typeof v === 'string' && v.length > 2 && v[0] === '\uFEFF' && v[1] === '\'';
}
function isKeyword(v) {
  return typeof v === 'string' && v.length > 1 && v[0] === '\uA789';
}
function isString(v) {
  return !isSymbol(v) && !isKeyword(v) && typeof v === 'string';
}
function isNumber(v) {
  return typeof v === 'number';
}
function isBoolean(v) {
  return typeof v === 'boolean';
}
function isNull(v) {
  return v === null;
}
function isUndefined(v) {
  return typeof v === 'undefined';
}
function isUnquote(v) {
  return isList(v) && isSymbol(v[0]) && v[0] === symbol('unquote');
}
function isUnquoteSplicing(v) {
  return isList(v) && isSymbol(v[0]) && v[0] === symbol('unquote-splicing');
}
function isQuote(v) {
  return isList(v) && isSymbol(v[0]) && v[0] === symbol('quote');
}
function isQuasiQuote(v) {
  return isList(v) && isSymbol(v[0]) && v[0] === symbol('quasi-quote');
}

function isSymbolList(v) {
  if (!isList(v)) {
    return false;
  }
  return v.reduce(function(a, s) { return a && isSymbol(s); }, true);
}

function symbolName(v) {
  return v.slice(2);
}

function keywordName(v) {
  return v.slice(1);
}

function name(v) {
  if (isSymbol(v)) return symbolName(v);
  if (isKeyword(v)) return keywordName(v);
  if (isString(v)) return v;
  throw new Error('name: unhandle name type, got:' + v);
}

function astMapNode(callback, node) {
  if (isList(node) || isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      node[i] = astMapNode(callback, node[i]);
    }
  }
  if (isObject(node)) {
    var keys = Object.keys(node);
    for (var i = 0; i < keys.length; i++) {
      node[keys[i]] = astMapNode(callback, node[keys[i]]);
    }
  }
  return callback(node);
}

function astMap(callback, ast) {
  return ast.map(astMapNode.bind(null, callback));
}

function gensym(prefix) {
  this.nextId = (this.nextId || 0) + 1;
  return symbol((prefix || '_gs_') + String(this.nextId));
};

var __eth__module = {
  EthList: EthList,
  list: list,
  symbol: symbol,
  keyword: keyword,
  string: string,
  isList: isList,
  isArray: isArray,
  isObject: isObject,
  isSymbol: isSymbol,
  isKeyword: isKeyword,
  isString: isString,
  isNumber: isNumber,
  isBoolean: isBoolean,
  isNull: isNull,
  isUndefined: isUndefined,
  isUnquote: isUnquote,
  isUnquoteSplicing: isUnquoteSplicing,
  isQuote: isQuote,
  isQuasiQuote: isQuasiQuote,
  isSymbolList: isSymbolList,
  symbolName: symbolName,
  keywordName: keywordName,
  name: name,
  astMapNode: astMapNode,
  astMap: astMap,
  gensym: gensym,
};

if (module && module.exports) {
  module.exports = __eth__module;
}
var __eth__global = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : undefined);
if (typeof __eth__global !== 'undefined') {
  __eth__global['eth/ast'] = __eth__module;
}
