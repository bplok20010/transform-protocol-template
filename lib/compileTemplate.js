
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
var escapes = {
  "'": "'",
  '\\': '\\',
  '\r': 'r',
  '\n': 'n',
  "\u2028": 'u2028',
  "\u2029": 'u2029'
};

var escapeChar = function escapeChar(match) {
  return '\\' + escapes[match];
};

var templateSettings = {
  evaluate: /<\?([\s\S]+?)\?>/g,
  interpolate: /<\?=([\s\S]+?)\?>/g,
  interpolate2: /\$\{([\s\S]+?)\}/g,
  escape: /<\?([a-zA-Z_0-9]*?)!([\s\S]+?)\?>/g
};
/**
 * template examples: 
 * `
 * ${name}
 * <?=data?>
 * <?!data?>
 * <?xml!data?>
 * <? if(1) { print(1) } ?>
 * <?if(1) {?>
 *  true
 * <?}?>
 * `
 */

function compileTemplate(text, settings) {
  settings = Object.assign({}, settings, templateSettings);
  var matcher = RegExp([settings.escape.source, settings.interpolate.source, settings.interpolate2.source, settings.evaluate.source].join('|') + '|$', 'g');
  var index = 0;
  var source = "__p+='";
  text.replace(matcher, function (match, executor, escape, interpolate, interpolate2, evaluate, offset) {
    source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
    index = offset + match.length;

    if (escape) {
      source += "';\nvar executor = '".concat(executor, "' || 'json';\nif (!$self[executor]) executor = 'json';\n__t = ").concat(escape, " === undefined ? '' : ").concat(escape, ";\n__p += $self[executor](__t);\n__p+='");
    } else if (interpolate) {
      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
    } else if (interpolate2) {
      source += "'+\n((__t=(" + interpolate2 + "))==null?'':__t)+\n'";
    } else if (evaluate) {
      source += "';\n" + evaluate + "\n__p+='";
    }

    return match;
  });
  source += "';\n";
  source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source;
  return source;
}

var _default = compileTemplate;
exports.default = _default;