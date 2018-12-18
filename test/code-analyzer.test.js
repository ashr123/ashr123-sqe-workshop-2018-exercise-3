/* eslint-disable max-lines-per-function */
import assert from 'assert';
import * as codeAnalyzer from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    // function pushLine(line, type, name = '', condition = '', value = '') {
    //     return {line: line, type: type, name: name, condition: condition, value: value};
    // }

    it('testing deepEqual ' +
        '\'let a=4;\n' +
        'a;\n' +
        'function foo (x, y, z) {\n' +
        '    a;\n' +
        '}\'', () => {
        assert.deepEqual(codeAnalyzer.parseCode(
            'let a=4; a;', ''),


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

    it('testing deepEqual ' +
        '\'function foo(x, y, z){\n' +
        '    let a = x + 1;\n' +
        '    let b = a + y;\n' +
        '    let c = 0;\n' +
        '    if (b < z) {\n' +
        '        c = c + 5;\n' +
        '        return x + y + z + c;\n' +
        '    } else if (b < z * 2) {\n' +
        '        c = c + x + 5;\n' +
        '        return x + y + z + c;\n' +
        '    } else {\n' +
        '        c = c + z + 5;\n' +
        '    return x + y + z + c;\n' +
        '    }\n' +
        '}\'', () => {
        assert.deepEqual(codeAnalyzer.parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    return x + y + z + c;\n' +
            '    }\n' +
            '}', '1, 2, 3'), {
            'type': 'Program',
            'body': [
                {
                    'type': 'FunctionDeclaration',
                    'id': {
                        'type': 'Identifier',
                        'name': 'foo'
                    },
                    'params': [
                        {
                            'type': 'Identifier',
                            'name': 'x'
                        },
                        {
                            'type': 'Identifier',
                            'name': 'y'
                        },
                        {
                            'type': 'Identifier',
                            'name': 'z'
                        }
                    ],
                    'body': {
                        'type': 'BlockStatement',
                        'body': [
                            {
                                'type': 'IfStatement',
                                'test': {
                                    'type': 'BinaryExpression',
                                    'operator': '<',
                                    'left': {
                                        'type': 'BinaryExpression',
                                        'operator': '+',
                                        'left': {
                                            'type': 'BinaryExpression',
                                            'operator': '+',
                                            'left': {
                                                'type': 'Identifier',
                                                'name': 'x'
                                            },
                                            'right': {
                                                'type': 'Literal',
                                                'value': 1,
                                                'raw': '1'
                                            }
                                        },
                                        'right': {
                                            'type': 'Identifier',
                                            'name': 'y'
                                        }
                                    },
                                    'right': {
                                        'type': 'Identifier',
                                        'name': 'z'
                                    },
                                    'modifiedText': '<markRed>x + 1 + y < z</markRed>'
                                },
                                'consequent': {
                                    'type': 'BlockStatement',
                                    'body': [
                                        {
                                            'type': 'ReturnStatement',
                                            'argument': {
                                                'type': 'BinaryExpression',
                                                'operator': '+',
                                                'left': {
                                                    'type': 'BinaryExpression',
                                                    'operator': '+',
                                                    'left': {
                                                        'type': 'BinaryExpression',
                                                        'operator': '+',
                                                        'left': {
                                                            'type': 'Identifier',
                                                            'name': 'x'
                                                        },
                                                        'right': {
                                                            'type': 'Identifier',
                                                            'name': 'y'
                                                        }
                                                    },
                                                    'right': {
                                                        'type': 'Identifier',
                                                        'name': 'z'
                                                    }
                                                },
                                                'right': {
                                                    'type': 'BinaryExpression',
                                                    'operator': '+',
                                                    'left': {
                                                        'type': 'Literal',
                                                        'value': 0,
                                                        'raw': '0'
                                                    },
                                                    'right': {
                                                        'type': 'Literal',
                                                        'value': 5,
                                                        'raw': '5'
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                },
                                'alternate': {
                                    'type': 'IfStatement',
                                    'test': {
                                        'type': 'BinaryExpression',
                                        'operator': '<',
                                        'left': {
                                            'type': 'BinaryExpression',
                                            'operator': '+',
                                            'left': {
                                                'type': 'BinaryExpression',
                                                'operator': '+',
                                                'left': {
                                                    'type': 'Identifier',
                                                    'name': 'x'
                                                },
                                                'right': {
                                                    'type': 'Literal',
                                                    'value': 1,
                                                    'raw': '1'
                                                }
                                            },
                                            'right': {
                                                'type': 'Identifier',
                                                'name': 'y'
                                            }
                                        },
                                        'right': {
                                            'type': 'BinaryExpression',
                                            'operator': '*',
                                            'left': {
                                                'type': 'Identifier',
                                                'name': 'z'
                                            },
                                            'right': {
                                                'type': 'Literal',
                                                'value': 2,
                                                'raw': '2'
                                            }
                                        },
                                        'modifiedText': '<markLightGreen>x + 1 + y < z * 2</markLightGreen>'
                                    },
                                    'consequent': {
                                        'type': 'BlockStatement',
                                        'body': [
                                            {
                                                'type': 'ReturnStatement',
                                                'argument': {
                                                    'type': 'BinaryExpression',
                                                    'operator': '+',
                                                    'left': {
                                                        'type': 'BinaryExpression',
                                                        'operator': '+',
                                                        'left': {
                                                            'type': 'BinaryExpression',
                                                            'operator': '+',
                                                            'left': {
                                                                'type': 'Identifier',
                                                                'name': 'x'
                                                            },
                                                            'right': {
                                                                'type': 'Identifier',
                                                                'name': 'y'
                                                            }
                                                        },
                                                        'right': {
                                                            'type': 'Identifier',
                                                            'name': 'z'
                                                        }
                                                    },
                                                    'right': {
                                                        'type': 'BinaryExpression',
                                                        'operator': '+',
                                                        'left': {
                                                            'type': 'BinaryExpression',
                                                            'operator': '+',
                                                            'left': {
                                                                'type': 'Literal',
                                                                'value': 0,
                                                                'raw': '0'
                                                            },
                                                            'right': {
                                                                'type': 'Identifier',
                                                                'name': 'x'
                                                            }
                                                        },
                                                        'right': {
                                                            'type': 'Literal',
                                                            'value': 5,
                                                            'raw': '5'
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    'alternate': {
                                        'type': 'BlockStatement',
                                        'body': [
                                            {
                                                'type': 'ReturnStatement',
                                                'argument': {
                                                    'type': 'BinaryExpression',
                                                    'operator': '+',
                                                    'left': {
                                                        'type': 'BinaryExpression',
                                                        'operator': '+',
                                                        'left': {
                                                            'type': 'BinaryExpression',
                                                            'operator': '+',
                                                            'left': {
                                                                'type': 'Identifier',
                                                                'name': 'x'
                                                            },
                                                            'right': {
                                                                'type': 'Identifier',
                                                                'name': 'y'
                                                            }
                                                        },
                                                        'right': {
                                                            'type': 'Identifier',
                                                            'name': 'z'
                                                        }
                                                    },
                                                    'right': {
                                                        'type': 'BinaryExpression',
                                                        'operator': '+',
                                                        'left': {
                                                            'type': 'BinaryExpression',
                                                            'operator': '+',
                                                            'left': {
                                                                'type': 'Literal',
                                                                'value': 0,
                                                                'raw': '0'
                                                            },
                                                            'right': {
                                                                'type': 'Identifier',
                                                                'name': 'z'
                                                            }
                                                        },
                                                        'right': {
                                                            'type': 'Literal',
                                                            'value': 5,
                                                            'raw': '5'
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    },
                    'generator': false,
                    'expression': false,
                    'async': false
                }
            ],
            'sourceType': 'script'
        });
    });

    it('testing deepEqual ' +
        '\'let x=[2, 3]\n' +
        'x[1];\n' +
        'x;\'', () => {
        assert.deepEqual(codeAnalyzer.parseCode('let x=[2, 3]\n' +
            'x[1];\n' +
            'x;', ''), {
            'type': 'Program',
            'body': [
                {
                    'type': 'ExpressionStatement',
                    'expression': {
                        'type': 'MemberExpression',
                        'computed': true,
                        'object': {
                            'type': 'ArrayExpression',
                            'elements': [
                                {
                                    'type': 'Literal',
                                    'value': 2,
                                    'raw': '2'
                                },
                                {
                                    'type': 'Literal',
                                    'value': 3,
                                    'raw': '3'
                                }
                            ]
                        },
                        'property': {
                            'type': 'Literal',
                            'value': 1,
                            'raw': '1'
                        }
                    }
                },
                {
                    'type': 'ExpressionStatement',
                    'expression': {
                        'type': 'ArrayExpression',
                        'elements': [
                            {
                                'type': 'Literal',
                                'value': 2,
                                'raw': '2'
                            },
                            {
                                'type': 'Literal',
                                'value': 3,
                                'raw': '3'
                            }
                        ]
                    }
                }
            ],
            'sourceType': 'script'
        });
    });

    it('testing deepEqual ' +
        '\'function foo(x) {\n' +
        '    while (x < 3) {\n' +
        '    }\n' +
        '}\'', () => {
        assert.deepEqual(codeAnalyzer.parseCode('function foo(x) {\n' +
            '    while (x < 3) {\n' +
            '    }\n' +
            '}', '1, 2, 3'), {
            'type': 'Program',
            'body': [
                {
                    'type': 'FunctionDeclaration',
                    'id': {
                        'type': 'Identifier',
                        'name': 'foo'
                    },
                    'params': [
                        {
                            'type': 'Identifier',
                            'name': 'x'
                        }
                    ],
                    'body': {
                        'type': 'BlockStatement',
                        'body': [
                            {
                                'type': 'WhileStatement',
                                'test': {
                                    'type': 'BinaryExpression',
                                    'operator': '<',
                                    'left': {
                                        'type': 'Identifier',
                                        'name': 'x'
                                    },
                                    'right': {
                                        'type': 'Literal',
                                        'value': 3,
                                        'raw': '3'
                                    }
                                },
                                'body': {
                                    'type': 'BlockStatement',
                                    'body': []
                                }
                            }
                        ]
                    },
                    'generator': false,
                    'expression': false,
                    'async': false
                }
            ],
            'sourceType': 'script'
        });
    });

    it('testing deepEqual ' +
        '\'[2, 3][1]=3;\'', () => {
        assert.deepEqual(codeAnalyzer.parseCode('[2, 3][1]=3;', '1, 2, 3'), {
            'type': 'Program',
            'body': [],
            'sourceType': 'script'
        });
    });

    it('testing deepEqual ' +
        '\'if (1 > 2)\n' +
        '    true;\'', () => {
        assert.deepEqual(codeAnalyzer.parseCode('if (1 > 2)\n' +
            '    true;', '1, 2, 3'), {
            'type': 'Program',
            'body': [
                {
                    'type': 'IfStatement',
                    'test': {
                        'type': 'BinaryExpression',
                        'operator': '>',
                        'left': {
                            'type': 'Literal',
                            'value': 1,
                            'raw': '1'
                        },
                        'right': {
                            'type': 'Literal',
                            'value': 2,
                            'raw': '2'
                        },
                        'modifiedText': '<markRed>1 > 2</markRed>'
                    },
                    'consequent': {
                        'type': 'ExpressionStatement',
                        'expression': {
                            'type': 'Literal',
                            'value': true,
                            'raw': 'true'
                        }
                    },
                    'alternate': null
                }
            ],
            'sourceType': 'script'
        });
    });

    it('testing deepEqual ' +
        '\'function foo() {\n' +
        '    return;\n' +
        '}\'', () => {
        assert.deepEqual(codeAnalyzer.parseCode('function foo() {\n' +
            '    return;\n' +
            '}', '1, 2, 3'), {
            'type': 'Program',
            'body': [
                {
                    'type': 'FunctionDeclaration',
                    'id': {
                        'type': 'Identifier',
                        'name': 'foo'
                    },
                    'params': [],
                    'body': {
                        'type': 'BlockStatement',
                        'body': [
                            {
                                'type': 'ReturnStatement',
                                'argument': null
                            }
                        ]
                    },
                    'generator': false,
                    'expression': false,
                    'async': false
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