"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const escodegen_1 = require("escodegen");
function pushLine(table, line, type, name = '', condition = '', value = '') {
    table.push({ line: line, type: type, name: name, condition: condition, value: value });
}
exports.pushLine = pushLine;
function parseIdentifier(table, expression) {
    pushLine(table, expression.loc.start.line, 'Identifier', expression.name);
}
exports.parseIdentifier = parseIdentifier;
function parseLiteral(table, expression) {
    pushLine(table, expression.loc.start.line, 'Literal', '', '', expression.raw);
}
exports.parseLiteral = parseLiteral;
function parseAssignmentExpression(table, expression) {
    pushLine(table, expression.loc.start.line, 'Assignment Expression', expression.left.type === 'Identifier' ? expression.left.name : null, '', escodegen_1.generate(expression.right));
}
exports.parseAssignmentExpression = parseAssignmentExpression;
function parseUpdateExpression(table, expression) {
    pushLine(table, expression.loc.start.line, 'Update Expression', escodegen_1.generate(expression.argument), '', escodegen_1.generate(expression));
}
exports.parseUpdateExpression = parseUpdateExpression;
function parseExpression(table, expression) {
    switch (expression.type) {
        case 'Identifier':
            parseIdentifier(table, expression);
            break;
        case 'Literal':
            parseLiteral(table, expression);
            break;
        case 'AssignmentExpression':
            parseAssignmentExpression(table, expression);
            break;
        case 'UpdateExpression':
            parseUpdateExpression(table, expression);
    }
}
exports.parseExpression = parseExpression;
function parseBlockStatement(statement, table) {
    statement.body.forEach((expressionStatement) => parseStatementListItem(expressionStatement, table));
}
exports.parseBlockStatement = parseBlockStatement;
function parseFunctionDeclaration(table, statement) {
    pushLine(table, statement.loc.start.line, 'Function Declaration', statement.id.name);
    statement.params.forEach((param) => pushLine(table, param.loc.start.line, 'Variable Declaration', param.name));
    parseStatementListItem(statement.body, table);
}
exports.parseFunctionDeclaration = parseFunctionDeclaration;
function parseVariableDeclaration(statement, table) {
    statement.declarations.forEach((decl) => pushLine(table, decl.loc.start.line, 'Variable Declaration', decl.id.name, '', decl.init === null ? null : escodegen_1.generate(decl.init)));
}
exports.parseVariableDeclaration = parseVariableDeclaration;
function parseBreakStatement(table, statement) {
    pushLine(table, statement.loc.start.line, 'Break Statement');
}
exports.parseBreakStatement = parseBreakStatement;
function parseForStatement(statement, table) {
    if (statement.test !== null)
        pushLine(table, statement.loc.start.line, 'For Statement', '', escodegen_1.generate(statement.test));
    if (statement.init !== null)
        statement.init.type === 'VariableDeclaration' ?
            parseStatementListItem(statement.init, table) :
            parseExpression(table, statement.init);
    if (statement.update !== null)
        parseExpression(table, statement.update);
    parseStatementListItem(statement.body, table);
}
exports.parseForStatement = parseForStatement;
function parseIfStatement(table, statement) {
    pushLine(table, statement.loc.start.line, 'If Statement', '', escodegen_1.generate(statement.test));
    parseStatementListItem(statement.consequent, table);
    if (statement.alternate !== null) {
        pushLine(table, statement.alternate.loc.start.line, 'else');
        parseStatementListItem(statement.alternate, table);
    }
}
exports.parseIfStatement = parseIfStatement;
function parseReturnStatement(table, statement) {
    pushLine(table, statement.loc.start.line, 'Return Statement', '', '', statement.argument === null ? null : escodegen_1.generate(statement.argument));
}
exports.parseReturnStatement = parseReturnStatement;
function parseWhileStatement(table, statement) {
    pushLine(table, statement.loc.start.line, 'While Statement', '', escodegen_1.generate(statement.test));
    parseStatementListItem(statement.body, table);
}
exports.parseWhileStatement = parseWhileStatement;
function parseStatementListItem3(statement, table) {
    if (statement.type === 'WhileStatement')
        parseWhileStatement(table, statement);
}
exports.parseStatementListItem3 = parseStatementListItem3;
function parseStatementListItem2(statement, table) {
    switch (statement.type) {
        case 'BreakStatement':
            parseBreakStatement(table, statement);
            break;
        case 'ForStatement':
            parseForStatement(statement, table);
            break;
        case 'IfStatement':
            parseIfStatement(table, statement);
            break;
        case 'ReturnStatement':
            parseReturnStatement(table, statement);
            break;
        default:
            parseStatementListItem3(statement, table);
    }
}
exports.parseStatementListItem2 = parseStatementListItem2;
function parseStatementListItem(statement, table) {
    switch (statement.type) {
        case 'BlockStatement':
            parseBlockStatement(statement, table);
            break;
        case 'FunctionDeclaration':
            parseFunctionDeclaration(table, statement);
            break;
        case 'VariableDeclaration':
            parseVariableDeclaration(statement, table);
            break;
        case 'ExpressionStatement':
            parseExpression(table, statement.expression);
            break;
        default:
            parseStatementListItem2(statement, table);
    }
    return table;
}
exports.parseStatementListItem = parseStatementListItem;
/*let json1: Program = {
    'type': 'Program',
    'body': [
        {
            'type': 'FunctionDeclaration',
            'id': {
                'type': 'Identifier',
                'name': 'binarySearch',
                'loc': {
                    'start': {
                        'line': 1,
                        'column': 9
                    },
                    'end': {
                        'line': 1,
                        'column': 21
                    }
                }
            },
            'params': [
                {
                    'type': 'Identifier',
                    'name': 'X',
                    'loc': {
                        'start': {
                            'line': 1,
                            'column': 22
                        },
                        'end': {
                            'line': 1,
                            'column': 23
                        }
                    }
                },
                {
                    'type': 'Identifier',
                    'name': 'V',
                    'loc': {
                        'start': {
                            'line': 1,
                            'column': 25
                        },
                        'end': {
                            'line': 1,
                            'column': 26
                        }
                    }
                },
                {
                    'type': 'Identifier',
                    'name': 'n',
                    'loc': {
                        'start': {
                            'line': 1,
                            'column': 28
                        },
                        'end': {
                            'line': 1,
                            'column': 29
                        }
                    }
                }
            ],
            'body': {
                'type': 'BlockStatement',
                'body': [
                    {
                        'type': 'VariableDeclaration',
                        'declarations': [
                            {
                                'type': 'VariableDeclarator',
                                'id': {
                                    'type': 'Identifier',
                                    'name': 'low',
                                    'loc': {
                                        'start': {
                                            'line': 2,
                                            'column': 8
                                        },
                                        'end': {
                                            'line': 2,
                                            'column': 11
                                        }
                                    }
                                },
                                'init': null,
                                'loc': {
                                    'start': {
                                        'line': 2,
                                        'column': 8
                                    },
                                    'end': {
                                        'line': 2,
                                        'column': 11
                                    }
                                }
                            },
                            {
                                'type': 'VariableDeclarator',
                                'id': {
                                    'type': 'Identifier',
                                    'name': 'high',
                                    'loc': {
                                        'start': {
                                            'line': 2,
                                            'column': 13
                                        },
                                        'end': {
                                            'line': 2,
                                            'column': 17
                                        }
                                    }
                                },
                                'init': null,
                                'loc': {
                                    'start': {
                                        'line': 2,
                                        'column': 13
                                    },
                                    'end': {
                                        'line': 2,
                                        'column': 17
                                    }
                                }
                            },
                            {
                                'type': 'VariableDeclarator',
                                'id': {
                                    'type': 'Identifier',
                                    'name': 'mid',
                                    'loc': {
                                        'start': {
                                            'line': 2,
                                            'column': 19
                                        },
                                        'end': {
                                            'line': 2,
                                            'column': 22
                                        }
                                    }
                                },
                                'init': null,
                                'loc': {
                                    'start': {
                                        'line': 2,
                                        'column': 19
                                    },
                                    'end': {
                                        'line': 2,
                                        'column': 22
                                    }
                                }
                            }
                        ],
                        'kind': 'let',
                        'loc': {
                            'start': {
                                'line': 2,
                                'column': 4
                            },
                            'end': {
                                'line': 2,
                                'column': 23
                            }
                        }
                    },
                    {
                        'type': 'ExpressionStatement',
                        'expression': {
                            'type': 'AssignmentExpression',
                            'operator': '=',
                            'left': {
                                'type': 'Identifier',
                                'name': 'low',
                                'loc': {
                                    'start': {
                                        'line': 3,
                                        'column': 4
                                    },
                                    'end': {
                                        'line': 3,
                                        'column': 7
                                    }
                                }
                            },
                            'right': {
                                'type': 'Literal',
                                'value': 0,
                                'raw': '0',
                                'loc': {
                                    'start': {
                                        'line': 3,
                                        'column': 10
                                    },
                                    'end': {
                                        'line': 3,
                                        'column': 11
                                    }
                                }
                            },
                            'loc': {
                                'start': {
                                    'line': 3,
                                    'column': 4
                                },
                                'end': {
                                    'line': 3,
                                    'column': 11
                                }
                            }
                        },
                        'loc': {
                            'start': {
                                'line': 3,
                                'column': 4
                            },
                            'end': {
                                'line': 3,
                                'column': 12
                            }
                        }
                    },
                    {
                        'type': 'ExpressionStatement',
                        'expression': {
                            'type': 'AssignmentExpression',
                            'operator': '=',
                            'left': {
                                'type': 'Identifier',
                                'name': 'high',
                                'loc': {
                                    'start': {
                                        'line': 4,
                                        'column': 4
                                    },
                                    'end': {
                                        'line': 4,
                                        'column': 8
                                    }
                                }
                            },
                            'right': {
                                'type': 'BinaryExpression',
                                'operator': '-',
                                'left': {
                                    'type': 'Identifier',
                                    'name': 'n',
                                    'loc': {
                                        'start': {
                                            'line': 4,
                                            'column': 11
                                        },
                                        'end': {
                                            'line': 4,
                                            'column': 12
                                        }
                                    }
                                },
                                'right': {
                                    'type': 'Literal',
                                    'value': 1,
                                    'raw': '1',
                                    'loc': {
                                        'start': {
                                            'line': 4,
                                            'column': 15
                                        },
                                        'end': {
                                            'line': 4,
                                            'column': 16
                                        }
                                    }
                                },
                                'loc': {
                                    'start': {
                                        'line': 4,
                                        'column': 11
                                    },
                                    'end': {
                                        'line': 4,
                                        'column': 16
                                    }
                                }
                            },
                            'loc': {
                                'start': {
                                    'line': 4,
                                    'column': 4
                                },
                                'end': {
                                    'line': 4,
                                    'column': 16
                                }
                            }
                        },
                        'loc': {
                            'start': {
                                'line': 4,
                                'column': 4
                            },
                            'end': {
                                'line': 4,
                                'column': 17
                            }
                        }
                    },
                    {
                        'type': 'WhileStatement',
                        'test': {
                            'type': 'BinaryExpression',
                            'operator': '<=',
                            'left': {
                                'type': 'Identifier',
                                'name': 'low',
                                'loc': {
                                    'start': {
                                        'line': 5,
                                        'column': 11
                                    },
                                    'end': {
                                        'line': 5,
                                        'column': 14
                                    }
                                }
                            },
                            'right': {
                                'type': 'Identifier',
                                'name': 'high',
                                'loc': {
                                    'start': {
                                        'line': 5,
                                        'column': 18
                                    },
                                    'end': {
                                        'line': 5,
                                        'column': 22
                                    }
                                }
                            },
                            'loc': {
                                'start': {
                                    'line': 5,
                                    'column': 11
                                },
                                'end': {
                                    'line': 5,
                                    'column': 22
                                }
                            }
                        },
                        'body': {
                            'type': 'BlockStatement',
                            'body': [
                                {
                                    'type': 'ExpressionStatement',
                                    'expression': {
                                        'type': 'AssignmentExpression',
                                        'operator': '=',
                                        'left': {
                                            'type': 'Identifier',
                                            'name': 'mid',
                                            'loc': {
                                                'start': {
                                                    'line': 6,
                                                    'column': 8
                                                },
                                                'end': {
                                                    'line': 6,
                                                    'column': 11
                                                }
                                            }
                                        },
                                        'right': {
                                            'type': 'BinaryExpression',
                                            'operator': '/',
                                            'left': {
                                                'type': 'BinaryExpression',
                                                'operator': '+',
                                                'left': {
                                                    'type': 'Identifier',
                                                    'name': 'low',
                                                    'loc': {
                                                        'start': {
                                                            'line': 6,
                                                            'column': 15
                                                        },
                                                        'end': {
                                                            'line': 6,
                                                            'column': 18
                                                        }
                                                    }
                                                },
                                                'right': {
                                                    'type': 'Identifier',
                                                    'name': 'high',
                                                    'loc': {
                                                        'start': {
                                                            'line': 6,
                                                            'column': 21
                                                        },
                                                        'end': {
                                                            'line': 6,
                                                            'column': 25
                                                        }
                                                    }
                                                },
                                                'loc': {
                                                    'start': {
                                                        'line': 6,
                                                        'column': 15
                                                    },
                                                    'end': {
                                                        'line': 6,
                                                        'column': 25
                                                    }
                                                }
                                            },
                                            'right': {
                                                'type': 'Literal',
                                                'value': 2,
                                                'raw': '2',
                                                'loc': {
                                                    'start': {
                                                        'line': 6,
                                                        'column': 27
                                                    },
                                                    'end': {
                                                        'line': 6,
                                                        'column': 28
                                                    }
                                                }
                                            },
                                            'loc': {
                                                'start': {
                                                    'line': 6,
                                                    'column': 14
                                                },
                                                'end': {
                                                    'line': 6,
                                                    'column': 28
                                                }
                                            }
                                        },
                                        'loc': {
                                            'start': {
                                                'line': 6,
                                                'column': 8
                                            },
                                            'end': {
                                                'line': 6,
                                                'column': 28
                                            }
                                        }
                                    },
                                    'loc': {
                                        'start': {
                                            'line': 6,
                                            'column': 8
                                        },
                                        'end': {
                                            'line': 6,
                                            'column': 29
                                        }
                                    }
                                },
                                {
                                    'type': 'IfStatement',
                                    'test': {
                                        'type': 'BinaryExpression',
                                        'operator': '<',
                                        'left': {
                                            'type': 'Identifier',
                                            'name': 'X',
                                            'loc': {
                                                'start': {
                                                    'line': 7,
                                                    'column': 12
                                                },
                                                'end': {
                                                    'line': 7,
                                                    'column': 13
                                                }
                                            }
                                        },
                                        'right': {
                                            'type': 'MemberExpression',
                                            'computed': true,
                                            'object': {
                                                'type': 'Identifier',
                                                'name': 'V',
                                                'loc': {
                                                    'start': {
                                                        'line': 7,
                                                        'column': 16
                                                    },
                                                    'end': {
                                                        'line': 7,
                                                        'column': 17
                                                    }
                                                }
                                            },
                                            'property': {
                                                'type': 'Identifier',
                                                'name': 'mid',
                                                'loc': {
                                                    'start': {
                                                        'line': 7,
                                                        'column': 18
                                                    },
                                                    'end': {
                                                        'line': 7,
                                                        'column': 21
                                                    }
                                                }
                                            },
                                            'loc': {
                                                'start': {
                                                    'line': 7,
                                                    'column': 16
                                                },
                                                'end': {
                                                    'line': 7,
                                                    'column': 22
                                                }
                                            }
                                        },
                                        'loc': {
                                            'start': {
                                                'line': 7,
                                                'column': 12
                                            },
                                            'end': {
                                                'line': 7,
                                                'column': 22
                                            }
                                        }
                                    },
                                    'consequent': {
                                        'type': 'ExpressionStatement',
                                        'expression': {
                                            'type': 'AssignmentExpression',
                                            'operator': '=',
                                            'left': {
                                                'type': 'Identifier',
                                                'name': 'high',
                                                'loc': {
                                                    'start': {
                                                        'line': 8,
                                                        'column': 12
                                                    },
                                                    'end': {
                                                        'line': 8,
                                                        'column': 16
                                                    }
                                                }
                                            },
                                            'right': {
                                                'type': 'BinaryExpression',
                                                'operator': '-',
                                                'left': {
                                                    'type': 'Identifier',
                                                    'name': 'mid',
                                                    'loc': {
                                                        'start': {
                                                            'line': 8,
                                                            'column': 19
                                                        },
                                                        'end': {
                                                            'line': 8,
                                                            'column': 22
                                                        }
                                                    }
                                                },
                                                'right': {
                                                    'type': 'Literal',
                                                    'value': 1,
                                                    'raw': '1',
                                                    'loc': {
                                                        'start': {
                                                            'line': 8,
                                                            'column': 25
                                                        },
                                                        'end': {
                                                            'line': 8,
                                                            'column': 26
                                                        }
                                                    }
                                                },
                                                'loc': {
                                                    'start': {
                                                        'line': 8,
                                                        'column': 19
                                                    },
                                                    'end': {
                                                        'line': 8,
                                                        'column': 26
                                                    }
                                                }
                                            },
                                            'loc': {
                                                'start': {
                                                    'line': 8,
                                                    'column': 12
                                                },
                                                'end': {
                                                    'line': 8,
                                                    'column': 26
                                                }
                                            }
                                        },
                                        'loc': {
                                            'start': {
                                                'line': 8,
                                                'column': 12
                                            },
                                            'end': {
                                                'line': 8,
                                                'column': 27
                                            }
                                        }
                                    },
                                    'alternate': {
                                        'type': 'IfStatement',
                                        'test': {
                                            'type': 'BinaryExpression',
                                            'operator': '>',
                                            'left': {
                                                'type': 'Identifier',
                                                'name': 'X',
                                                'loc': {
                                                    'start': {
                                                        'line': 9,
                                                        'column': 17
                                                    },
                                                    'end': {
                                                        'line': 9,
                                                        'column': 18
                                                    }
                                                }
                                            },
                                            'right': {
                                                'type': 'MemberExpression',
                                                'computed': true,
                                                'object': {
                                                    'type': 'Identifier',
                                                    'name': 'V',
                                                    'loc': {
                                                        'start': {
                                                            'line': 9,
                                                            'column': 21
                                                        },
                                                        'end': {
                                                            'line': 9,
                                                            'column': 22
                                                        }
                                                    }
                                                },
                                                'property': {
                                                    'type': 'Identifier',
                                                    'name': 'mid',
                                                    'loc': {
                                                        'start': {
                                                            'line': 9,
                                                            'column': 23
                                                        },
                                                        'end': {
                                                            'line': 9,
                                                            'column': 26
                                                        }
                                                    }
                                                },
                                                'loc': {
                                                    'start': {
                                                        'line': 9,
                                                        'column': 21
                                                    },
                                                    'end': {
                                                        'line': 9,
                                                        'column': 27
                                                    }
                                                }
                                            },
                                            'loc': {
                                                'start': {
                                                    'line': 9,
                                                    'column': 17
                                                },
                                                'end': {
                                                    'line': 9,
                                                    'column': 27
                                                }
                                            }
                                        },
                                        'consequent': {
                                            'type': 'ExpressionStatement',
                                            'expression': {
                                                'type': 'AssignmentExpression',
                                                'operator': '=',
                                                'left': {
                                                    'type': 'Identifier',
                                                    'name': 'low',
                                                    'loc': {
                                                        'start': {
                                                            'line': 10,
                                                            'column': 12
                                                        },
                                                        'end': {
                                                            'line': 10,
                                                            'column': 15
                                                        }
                                                    }
                                                },
                                                'right': {
                                                    'type': 'BinaryExpression',
                                                    'operator': '+',
                                                    'left': {
                                                        'type': 'Identifier',
                                                        'name': 'mid',
                                                        'loc': {
                                                            'start': {
                                                                'line': 10,
                                                                'column': 18
                                                            },
                                                            'end': {
                                                                'line': 10,
                                                                'column': 21
                                                            }
                                                        }
                                                    },
                                                    'right': {
                                                        'type': 'Literal',
                                                        'value': 1,
                                                        'raw': '1',
                                                        'loc': {
                                                            'start': {
                                                                'line': 10,
                                                                'column': 24
                                                            },
                                                            'end': {
                                                                'line': 10,
                                                                'column': 25
                                                            }
                                                        }
                                                    },
                                                    'loc': {
                                                        'start': {
                                                            'line': 10,
                                                            'column': 18
                                                        },
                                                        'end': {
                                                            'line': 10,
                                                            'column': 25
                                                        }
                                                    }
                                                },
                                                'loc': {
                                                    'start': {
                                                        'line': 10,
                                                        'column': 12
                                                    },
                                                    'end': {
                                                        'line': 10,
                                                        'column': 25
                                                    }
                                                }
                                            },
                                            'loc': {
                                                'start': {
                                                    'line': 10,
                                                    'column': 12
                                                },
                                                'end': {
                                                    'line': 10,
                                                    'column': 26
                                                }
                                            }
                                        },
                                        'alternate': {
                                            'type': 'ReturnStatement',
                                            'argument': {
                                                'type': 'Identifier',
                                                'name': 'mid',
                                                'loc': {
                                                    'start': {
                                                        'line': 12,
                                                        'column': 19
                                                    },
                                                    'end': {
                                                        'line': 12,
                                                        'column': 22
                                                    }
                                                }
                                            },
                                            'loc': {
                                                'start': {
                                                    'line': 12,
                                                    'column': 12
                                                },
                                                'end': {
                                                    'line': 12,
                                                    'column': 23
                                                }
                                            }
                                        },
                                        'loc': {
                                            'start': {
                                                'line': 9,
                                                'column': 13
                                            },
                                            'end': {
                                                'line': 12,
                                                'column': 23
                                            }
                                        }
                                    },
                                    'loc': {
                                        'start': {
                                            'line': 7,
                                            'column': 8
                                        },
                                        'end': {
                                            'line': 12,
                                            'column': 23
                                        }
                                    }
                                }
                            ],
                            'loc': {
                                'start': {
                                    'line': 5,
                                    'column': 24
                                },
                                'end': {
                                    'line': 13,
                                    'column': 5
                                }
                            }
                        },
                        'loc': {
                            'start': {
                                'line': 5,
                                'column': 4
                            },
                            'end': {
                                'line': 13,
                                'column': 5
                            }
                        }
                    },
                    {
                        'type': 'ReturnStatement',
                        'argument': {
                            'type': 'UnaryExpression',
                            'operator': '-',
                            'argument': {
                                'type': 'Literal',
                                'value': 1,
                                'raw': '1',
                                'loc': {
                                    'start': {
                                        'line': 14,
                                        'column': 12
                                    },
                                    'end': {
                                        'line': 14,
                                        'column': 13
                                    }
                                }
                            },
                            'prefix': true,
                            'loc': {
                                'start': {
                                    'line': 14,
                                    'column': 11
                                },
                                'end': {
                                    'line': 14,
                                    'column': 13
                                }
                            }
                        },
                        'loc': {
                            'start': {
                                'line': 14,
                                'column': 4
                            },
                            'end': {
                                'line': 14,
                                'column': 14
                            }
                        }
                    }
                ],
                'loc': {
                    'start': {
                        'line': 1,
                        'column': 30
                    },
                    'end': {
                        'line': 15,
                        'column': 1
                    }
                }
            },
            'generator': false,
            'expression': false,
            'async': false,
            'loc': {
                'start': {
                    'line': 1,
                    'column': 0
                },
                'end': {
                    'line': 15,
                    'column': 1
                }
            }
        }
    ],
    'sourceType': 'script',
    'loc': {
        'start': {
            'line': 1,
            'column': 0
        },
        'end': {
            'line': 15,
            'column': 1
        }
    }
};*/ 
//# sourceMappingURL=parserFuncs.js.map