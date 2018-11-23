/* eslint-disable max-lines-per-function */
import assert from 'assert';
import * as codeAnalyzer from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    function pushLine(line, type, name = '', condition = '', value = '') {
        return {line: line, type: type, name: name, condition: condition, value: value};
    }

    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(codeAnalyzer.parseCode('').code),
            '{"type":"Program","body":[],"sourceType":"script","loc":{"start":{"line":0,"column":0},"end":{"line":0,"column":0}}}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(codeAnalyzer.parseCode('let a = 1;').code),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":5}}},"init":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":9}}},"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":9}}}],"kind":"let","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}'
        );
    });

    it('testing deepStrictEqual \'let a = 1;\'', () => {
        assert.deepStrictEqual(codeAnalyzer.parseCode('let a = 1;').table, [pushLine(1, 'Variable Declaration', 'a', '', '1')]);
    });

    it('testing deepStrictEqual \'b;\'', () => {
        assert.deepStrictEqual(codeAnalyzer.parseCode('b;').table, [pushLine(1, 'Identifier', 'b', '', '')]);
    });

    it('testing deepStrictEqual \'a++;\'', () => {
        assert.deepStrictEqual(codeAnalyzer.parseCode('a++;').table, [pushLine(1, 'Update Expression', 'a', '', 'a++')]);
    });

    it('testing deepStrictEqual \'\'', () => {
        assert.deepStrictEqual(codeAnalyzer.parseCode('').table, []);
    });

    it('testing deepStrictEqual \'try{}\n' +
        'catch(e){}\'', () => {
        assert.deepStrictEqual(codeAnalyzer.parseCode('try{}' +
            'catch(e){}').table, []);
    });

    it('testing deepStrictEqual \'() => {};\'', () => {
        assert.deepStrictEqual(codeAnalyzer.parseCode('() => {};').table, []);
    });

    it('testing deepStrictEqual \'function a(){\n' +
        '    if(true)\n' +
        '        return;\n' +
        '}\'', () => {
        assert.deepStrictEqual(codeAnalyzer.parseCode(
            'function a(){\n' +
            '    if(true)\n' +
            '        return;\n' +
            '}').table, [
            pushLine(1, 'Function Declaration', 'a'),
            pushLine(2, 'If Statement', '', 'true'),
            pushLine(3, 'Return Statement', '', '', null)
        ]);
    });

    it('testing deepStrictEqual \'3;\'', () => {
        assert.deepStrictEqual(codeAnalyzer.parseCode('3;').table, [pushLine(1, 'Literal', '', '', '3')]);
    });

    it('testing deepStrictEqual \'for(let a=1; a>3; a++)\n' +
        '    break;\'', () => {
        assert.deepStrictEqual(codeAnalyzer.parseCode(
            'for(let a=1; a>3; a++)\n' +
            '    break;').table, [
            pushLine(1, 'For Statement', '', 'a > 3'),
            pushLine(1, 'Variable Declaration', 'a', '', '1'),
            pushLine(1, 'Update Expression', 'a', '', 'a++'),
            pushLine(2, 'Break Statement')
        ]);
    });

    it('testing deepStrictEqual \'for(; ; )\n' +
        '    break;\'', () => {
        assert.deepStrictEqual(codeAnalyzer.parseCode('for(; ; )\n' +
            '    break;').table, [pushLine(2, 'Break Statement')]);
    });

    it('testing deepStrictEqual \'for(a; ; )\n' +
        '    break;\'', () => {
        assert.deepStrictEqual(codeAnalyzer.parseCode(
            'for(a; ; )\n' +
            '    break;').table, [
            pushLine(1, 'Identifier', 'a'),
            pushLine(2, 'Break Statement')
        ]);
    });

    it('testing deepStrictEqual \'function binarySearch(X, V, n) {\n' +
        '    let low, high, mid;\n' +
        '    low = 0;\n' +
        '    high = n - 1;\n' +
        '    while (low <= high) {\n' +
        '        mid = (low + high)/2;\n' +
        '        if (X < V[mid])\n' +
        '            high = mid - 1;\n' +
        '        else if (X > V[mid])\n' +
        '            low = mid + 1;\n' +
        '        else\n' +
        '            return mid;\n' +
        '    }\n' +
        '    return -1;\n' +
        '}\'', () => {
        assert.deepStrictEqual(codeAnalyzer.parseCode(
            'function binarySearch(X, V, n) {\n' +
            '    let low, high, mid;\n' +
            '    low = 0;\n' +
            '    high = n - 1;\n' +
            '    while (low <= high) {\n' +
            '        mid = (low + high)/2;\n' +
            '        if (X < V[mid])\n' +
            '            high = mid - 1;\n' +
            '        else if (X > V[mid])\n' +
            '            low = mid + 1;\n' +
            '        else\n' +
            '            return mid;\n' +
            '    }\n' +
            '    return -1;\n' +
            '}').table, [
            pushLine(1, 'Function Declaration', 'binarySearch'),
            pushLine(1, 'Variable Declaration', 'X'),
            pushLine(1, 'Variable Declaration', 'V'),
            pushLine(1, 'Variable Declaration', 'n'),
            pushLine(2, 'Variable Declaration', 'low', '', null),
            pushLine(2, 'Variable Declaration', 'high', '', null),
            pushLine(2, 'Variable Declaration', 'mid', '', null),
            pushLine(3, 'Assignment Expression', 'low', '', '0'),
            pushLine(4, 'Assignment Expression', 'high', '', 'n - 1'),
            pushLine(5, 'While Statement', '', 'low <= high'),
            pushLine(6, 'Assignment Expression', 'mid', '', '(low + high) / 2'),
            pushLine(7, 'If Statement', '', 'X < V[mid]'),
            pushLine(8, 'Assignment Expression', 'high', '', 'mid - 1'),
            pushLine(9, 'else'),
            pushLine(9, 'If Statement', '', 'X > V[mid]'),
            pushLine(10, 'Assignment Expression', 'low', '', 'mid + 1'),
            pushLine(12, 'Return Statement', '', '', 'mid'),
            pushLine(14, 'Return Statement', '', '', '-1'),
        ]);
    });
});