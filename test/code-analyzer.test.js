/* eslint-disable max-lines-per-function */
import assert from 'assert';
import * as codeAnalyzer from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    // function pushLine(line, type, name = '', condition = '', value = '') {
    //     return {line: line, type: type, name: name, condition: condition, value: value};
    // }

    it('testing deepStrictEqual ' +
        '\'let a=4;\n' +
        'a;\n' +
        'function foo (x, y, z) {\n' +
        '    a;\n' +
        '}\'', () => {
        assert.deepEqual(codeAnalyzer.parseCode(
            'let a=4; a;', '1, 2, 3'),


        {
            'type': 'Program',
            'body': [
                {
                    'type': 'ExpressionStatement',
                    'expression': {
                        'type': 'Literal',
                        'value': 4,
                        'raw': '4'
                    }
                }
            ],
            'sourceType': 'script'
        });
    });

    // it('testing deepStrictEqual ' +
    //     '\'let a=4;\n' +
    //     'a;\n' +
    //     'function foo (x, y, z) {\n' +
    //     '    a;\n' +
    //     '}\'', () => {
    //     assert.deepStrictEqual(codeAnalyzer.parseCode('let a=4;\n' +
    //         'a;\n' +
    //         'function foo (x, y, z) {\n' +
    //         '    a;\n' +
    //         '}', '1, 2, 3'), '4;\n' +
    //         'function foo(x, y, z) {\n' +
    //         '    4;\n' +
    //         '}');
    // });
});