const parseTemplateToCode = require('../lib').default;

let z = null;

console.log(z + '');

let template = `
<?
    var obj = {
        z:1,b:2
    };

    print( obj2xml(obj) );
?>
<?if(1) {?>
    IF<?=Math.random()?>
<?}?> 
=============JSON=============
{
    status: <?=ret?>,
    message: <?!msg?>,
    data: {
        columns: <?!Object.keys(data.rows[0] || {})?>,
        list: <?!data.rows?>,
        total: <?=data.total?>
    }
}
==============XML=============
<?xml!data?>
==============Other===========
<?=abc?>1
<?!abc?>2
<?=isNew?>3
<?!isNew?>4
\${msg}
`;

const ret = parseTemplateToCode(template, {
    isNew: null,
    ret: 0,
    msg: "success",
    data: {
        total: 11092,
        rows: [
            { name: 'nobo1', age: 18 },
            { name: 'nobo2', age: 18 }
        ]
    }
});

console.log(ret);