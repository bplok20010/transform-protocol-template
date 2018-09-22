
const escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

const escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
};

const escapeChar = function (match) {
    return '\\' + escapes[match];
};

const templateSettings = {
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

    const matcher = RegExp([
        settings.escape.source,
        settings.interpolate.source,
        settings.interpolate2.source,
        settings.evaluate.source
    ].join('|') + '|$', 'g');

    let index = 0;
    let source = "__p+='";
    text.replace(matcher, function (match, executor, escape, interpolate, interpolate2, evaluate, offset) {
        source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
        index = offset + match.length;

        if (escape) {
            source += `';
var executor = '${executor}' || 'json';
if (!$self[executor]) executor = 'json';
__t = ${escape} === undefined ? '' : ${escape};
__p += $self[executor](__t);\n__p+='`;
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

    source = "var __t,__p='',__j=Array.prototype.join," +
        "print=function(){__p+=__j.call(arguments,'');};\n" +
        source;

    return source;
}

export default compileTemplate;