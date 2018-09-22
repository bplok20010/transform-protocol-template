import { Builder, parseString } from 'xml2js';
import compileTemplate from './compileTemplate';
import vm from 'vm';

function isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

function jsonEncode(obj) {
    return JSON.stringify(obj);
}

function jsonDecode(str) {
    return JSON.parse(str);
}

function xml2obj(xml = '') {
    let result;
    parseString(xml, function (err, obj) {
        if (err) {
            throw err;
        }
        result = obj
    });

    return result;
}

function obj2xml(obj) {
    const builder = new Builder();
    return builder.buildObject(obj);
}

function createSandbox(data) {
    const target = {
        isNaN,
        isObject,
        Function,
        Array,
        Object,
        JSON,
        Set,
        Map,
        parseInt,
        parseFloat,
        Math,
        String,
        Date,
        json: jsonEncode,
        xml: obj2xml,
        jsonEncode,
        jsonDecode,
        xml2obj,
        obj2xml,
        $data: data,
    };

    target.$self = target;

    const handler = {
        get: function (target, name) {
            if (isObject(data) && (name in data)) {
                return data[name];
            }

            return target[name];
        },
        set: function (target, name, value) {
            if (isObject(data) && (name in data)) {
                data[name] = value;
            } else {
                target[name] = value;
            }
        }
    };
    return new Proxy(target, handler);
}

export default function (template, data) {
    const sandbox = createSandbox(data);
    const context = new vm.createContext(sandbox);
    const code = compileTemplate(template);

    const script = new vm.Script(code);
    script.runInContext(context);

    return context.__p;
}