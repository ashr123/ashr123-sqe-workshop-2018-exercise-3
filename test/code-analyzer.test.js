import assert from 'assert';
import * as codeAnalyzer from '../src/js/code-analyzer';
import {generate} from 'escodegen';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(codeAnalyzer.parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script","loc":{"start":{"line":0,"column":0},"end":{"line":0,"column":0}}}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(codeAnalyzer.parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":5}}},"init":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":9}}},"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":9}}}],"kind":"let","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}'
        );
    });

    it('Experiments!!!', () => {
        // console.log(generate({
        //     'type': 'VariableDeclaration',
        //     'declarations': [
        //         {
        //             'type': 'VariableDeclarator',
        //             'id': {
        //                 'type': 'Identifier',
        //                 'name': 'low',
        //                 'loc': {
        //                     'start': {
        //                         'line': 2,
        //                         'column': 8
        //                     },
        //                     'end': {
        //                         'line': 2,
        //                         'column': 11
        //                     }
        //                 }
        //             },
        //             'init': null,
        //             'loc': {
        //                 'start': {
        //                     'line': 2,
        //                     'column': 8
        //                 },
        //                 'end': {
        //                     'line': 2,
        //                     'column': 11
        //                 }
        //             }
        //         },
        //         {
        //             'type': 'VariableDeclarator',
        //             'id': {
        //                 'type': 'Identifier',
        //                 'name': 'high',
        //                 'loc': {
        //                     'start': {
        //                         'line': 2,
        //                         'column': 13
        //                     },
        //                     'end': {
        //                         'line': 2,
        //                         'column': 17
        //                     }
        //                 }
        //             },
        //             'init': null,
        //             'loc': {
        //                 'start': {
        //                     'line': 2,
        //                     'column': 13
        //                 },
        //                 'end': {
        //                     'line': 2,
        //                     'column': 17
        //                 }
        //             }
        //         },
        //         {
        //             'type': 'VariableDeclarator',
        //             'id': {
        //                 'type': 'Identifier',
        //                 'name': 'mid',
        //                 'loc': {
        //                     'start': {
        //                         'line': 2,
        //                         'column': 19
        //                     },
        //                     'end': {
        //                         'line': 2,
        //                         'column': 22
        //                     }
        //                 }
        //             },
        //             'init': null,
        //             'loc': {
        //                 'start': {
        //                     'line': 2,
        //                     'column': 19
        //                 },
        //                 'end': {
        //                     'line': 2,
        //                     'column': 22
        //                 }
        //             }
        //         }
        //     ],
        //     'kind': 'let',
        //     'loc': {
        //         'start': {
        //             'line': 2,
        //             'column': 4
        //         },
        //         'end': {
        //             'line': 2,
        //             'column': 23
        //         }
        //     }
        // }));

    });
});