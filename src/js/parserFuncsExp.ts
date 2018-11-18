// import {generate} from 'escodegen';
//
// interface Program {
//     type: 'Program';
//     sourceType: 'script';
//     body: StatementListItem[];
//     loc: SourceLocation;
// }
//
// interface Position {
//     line: number;
//     column: number;
// }
//
// interface SourceLocation {
//     start: Position;
//     end: Position;
//     source?: string | null;
// }
//
// type Expression =
//     Identifier
//     | Literal
//     // | FunctionExpression
//     | ConditionalExpression
//     | AssignmentExpression
//     | BinaryExpression
//     | MemberExpression
//     | UnaryExpression
//     | UpdateExpression;
//
// interface UpdateExpression {
//     type: 'UpdateExpression';
//     operator: '++' | '--';
//     argument: Expression;
//     prefix: boolean;
//     loc: SourceLocation;
// }
//
// interface UnaryExpression {
//     type: 'UnaryExpression';
//     operator: '+' | '-' | '~' | '!' | 'delete' | 'void' | 'typeof';
//     argument: Expression;
//     prefix: true;
//     loc: SourceLocation;
// }
//
// interface BinaryExpression {
//     type: 'BinaryExpression';
//     operator: 'instanceof' | 'in' | '+' | '-' | '*' | '/' | '%' | '**' |
//         '|' | '^' | '&' | '==' | '!=' | '===' | '!==' |
//         '<' | '>' | '<=' | '<<' | '>>' | '>>>';
//     left: Expression;
//     right: Expression;
//     loc: SourceLocation;
// }
//
// interface Identifier {
//     type: 'Identifier';
//     name: string;
//     loc: SourceLocation;
// }
//
// interface MemberExpression {
//     type: 'MemberExpression';
//     computed: boolean;
//     object: Expression;
//     property: Expression;
//     loc: SourceLocation;
// }
//
// interface Literal {
//     type: 'Literal';
//     value: boolean | number | string | RegExp | null;
//     raw: string;
//     regex?: {
//         pattern: string,
//         flags: string
//     };
//     loc: SourceLocation;
// }
//
// interface ConditionalExpression {
//     type: 'ConditionalExpression';
//     test: Expression;
//     consequent: Expression;
//     alternate: Expression;
//     loc: SourceLocation;
// }
//
// interface AssignmentExpression {
//     type: 'AssignmentExpression';
//     operator: '=' | '*=' | '**=' | '/=' | '%=' | '+=' | '-=' | '<<=' | '>>=' | '>>>=' | '&=' | '^=' | '|=';
//     left: Expression;
//     right: Expression;
//     loc: SourceLocation;
// }
//
// type Statement =
//     BlockStatement
//     | BreakStatement
//     | DoWhileStatement
//     | EmptyStatement
//     | ExpressionStatement
//     | ForStatement
//     | FunctionDeclaration
//     | IfStatement
//     | ReturnStatement
//     | VariableDeclaration
//     | WhileStatement;
//
// type Declaration = FunctionDeclaration | VariableDeclaration;
//
// type StatementListItem = Declaration | Statement;
//
// interface BlockStatement {
//     type: 'BlockStatement';
//     body: StatementListItem[];
//     loc: SourceLocation;
// }
//
// interface BreakStatement {
//     type: 'BreakStatement';
//     label: Identifier | null;
//     loc: SourceLocation;
// }
//
// // type FunctionParameter = Identifier;
//
//
// interface DoWhileStatement {
//     type: 'DoWhileStatement';
//     body: Statement;
//     test: Expression;
//     loc: SourceLocation;
// }
//
// interface Line {
//     line: number,
//     type: string,
//     name: string,
//     condition: string,
//     value: string
// }
//
// interface EmptyStatement {
//     type: 'EmptyStatement';
//     loc: SourceLocation;
// }
//
// interface ExpressionStatement {
//     type: 'ExpressionStatement';
//     expression: Expression;
//     directive?: string;
//     loc: SourceLocation;
// }
//
// interface ForStatement {
//     type: 'ForStatement';
//     init: Expression | VariableDeclaration | null;
//     test: Expression | null;
//     update: Expression | null;
//     body: Statement;
//     loc: SourceLocation;
// }
//
// // interface FunctionExpression {
// //     type: 'FunctionExpression';
// //     id: Identifier | null;
// //     params: Identifier[];
// //     body: BlockStatement;
// //     generator: boolean;
// //     async: boolean;
// //     expression: boolean;
// //     loc: SourceLocation;
// // }
//
// interface FunctionDeclaration {
//     type: 'FunctionDeclaration';
//     id: Identifier | null;
//     params: Identifier[];
//     body: BlockStatement;
//     generator: boolean;
//     async: boolean;
//     expression: false;
//     loc: SourceLocation;
// }
//
// interface IfStatement {
//     type: 'IfStatement';
//     test: Expression;
//     consequent: Statement;
//     alternate?: Statement;
//     loc: SourceLocation;
// }
//
// interface ReturnStatement {
//     type: 'ReturnStatement';
//     argument: Expression | null;
//     loc: SourceLocation;
// }
//
// interface VariableDeclaration {
//     type: 'VariableDeclaration';
//     declarations: VariableDeclarator[];
//     kind: 'var' | 'const' | 'let';
//     loc: SourceLocation;
// }
//
// interface VariableDeclarator {
//     type: 'VariableDeclarator';
//     id: Identifier;
//     init: Expression | null;
//     loc: SourceLocation;
// }
//
// interface WhileStatement {
//     type: 'WhileStatement';
//     test: Expression;
//     body: Statement;
//     loc: SourceLocation;
// }
//
// export function pushLine(table: Line[],
//                          line: number,
//                          type: string,
//                          name: string = '',
//                          condition: string = '',
//                          value: string = ''): void {
//     table.push({line: line, type: type, name: name, condition: condition, value: value});
// }
//
// export function parseIdentifier(table: Line[], expression: Identifier): void {
//     pushLine(table, expression.loc.start.line, 'Identifier', expression.name);
// }
//
// export function parseLiteral(table: Line[], expression: Literal): void {
//     pushLine(table, expression.loc.start.line, 'Literal', '', '', expression.raw);
// }
//
// export function parseAssignmentExpression(table: Line[], expression: AssignmentExpression): void {
//     pushLine(table, expression.loc.start.line,
//         'Assignment Expression',
//         expression.left.type === 'Identifier' ? expression.left.name : null,
//         '',
//         generate(expression.right));
// }
//
// export function parseUpdateExpression(table: Line[], expression: UpdateExpression): void {
//     pushLine(table, expression.loc.start.line, 'Update Expression', generate(expression.argument),
//         '', generate(expression));
// }
//
// export function parseExpression(table: Line[], expression: Expression): void {
//     switch (expression.type) {
//         case 'Identifier':
//             parseIdentifier(table, expression);
//             break;
//         case 'Literal':
//             parseLiteral(table, expression);
//             break;
//         case 'AssignmentExpression':
//             parseAssignmentExpression(table, expression);
//             break;
//         case 'UpdateExpression':
//             parseUpdateExpression(table, expression);
//     }
// }
//
// export function parseBlockStatement(statement: BlockStatement, table: Line[]): void {
//     statement.body.forEach((expressionStatement: StatementListItem) =>
//         parseStatementListItem(expressionStatement, table));
// }
//
// export function parseFunctionDeclaration(table: Line[], statement: FunctionDeclaration): void {
//     pushLine(table, statement.loc.start.line, 'Function Declaration', statement.id.name);
//     statement.params.forEach((param: Identifier) => pushLine(table, param.loc.start.line,
//         'Variable Declaration', param.name));
//     parseStatementListItem(statement.body, table);
// }
//
// export function parseVariableDeclaration(statement: VariableDeclaration, table: Line[]): void {
//     statement.declarations.forEach((decl: VariableDeclarator) =>
//         pushLine(table, decl.loc.start.line, 'Variable Declaration', decl.id.name, '',
//             decl.init === null ? null : generate(decl.init)));
// }
//
// export function parseBreakStatement(table: Line[], statement: BreakStatement): void {
//     pushLine(table, statement.loc.start.line, 'Break Statement');
// }
//
// export function parseForStatement(statement: ForStatement, table: Line[]): void {
//     if (statement.test !== null)
//         pushLine(table, statement.loc.start.line, 'For Statement', '', generate(statement.test));
//     if (statement.init !== null)
//         statement.init.type === 'VariableDeclaration' ?
//             parseStatementListItem(statement.init, table) :
//             parseExpression(table, statement.init);
//     if (statement.update !== null)
//         parseExpression(table, statement.update);
//     parseStatementListItem(statement.body, table);
// }
//
// export function parseIfStatement(table: Line[], statement: IfStatement): void {
//     pushLine(table, statement.loc.start.line, 'If Statement', '', generate(statement.test));
//     parseStatementListItem(statement.consequent, table);
//     if (statement.alternate !== null) {
//         pushLine(table, statement.alternate.loc.start.line, 'else');
//         parseStatementListItem(statement.alternate, table);
//     }
// }
//
// export function parseReturnStatement(table: Line[], statement: ReturnStatement): void {
//     pushLine(table, statement.loc.start.line, 'Return Statement', '', '',
//         statement.argument === null ? null : generate(statement.argument));
// }
//
// export function parseWhileStatement(table: Line[], statement: WhileStatement): void {
//     pushLine(table, statement.loc.start.line, 'While Statement', '', generate(statement.test));
//     parseStatementListItem(statement.body, table);
// }
//
// export function parseStatementListItem3(statement: StatementListItem, table: Line[]): void {
//     if (statement.type === 'WhileStatement')
//         parseWhileStatement(table, statement);
// }
//
// export function parseStatementListItem2(statement: StatementListItem, table: Line[]): void {
//     switch (statement.type) {
//         case 'BreakStatement':
//             parseBreakStatement(table, statement);
//             break;
//         case 'ForStatement':
//             parseForStatement(statement, table);
//             break;
//         case 'IfStatement':
//             parseIfStatement(table, statement);
//             break;
//         case 'ReturnStatement':
//             parseReturnStatement(table, statement);
//             break;
//         default:
//             parseStatementListItem3(statement, table);
//     }
// }
//
// export function parseStatementListItem(statement: StatementListItem, table: Line[]): Line[] {
//     switch (statement.type) {
//         case 'BlockStatement':
//             parseBlockStatement(statement, table);
//             break;
//         case 'FunctionDeclaration':
//             parseFunctionDeclaration(table, statement);
//             break;
//         case 'VariableDeclaration':
//             parseVariableDeclaration(statement, table);
//             break;
//         case 'ExpressionStatement':
//             parseExpression(table, statement.expression);
//             break;
//         default:
//             parseStatementListItem2(statement, table);
//     }
//     return table;
// }
//
// /*let json1: Program = {
//     'type': 'Program',
//     'body': [
//         {
//             'type': 'FunctionDeclaration',
//             'id': {
//                 'type': 'Identifier',
//                 'name': 'binarySearch',
//                 'loc': {
//                     'start': {
//                         'line': 1,
//                         'column': 9
//                     },
//                     'end': {
//                         'line': 1,
//                         'column': 21
//                     }
//                 }
//             },
//             'params': [
//                 {
//                     'type': 'Identifier',
//                     'name': 'X',
//                     'loc': {
//                         'start': {
//                             'line': 1,
//                             'column': 22
//                         },
//                         'end': {
//                             'line': 1,
//                             'column': 23
//                         }
//                     }
//                 },
//                 {
//                     'type': 'Identifier',
//                     'name': 'V',
//                     'loc': {
//                         'start': {
//                             'line': 1,
//                             'column': 25
//                         },
//                         'end': {
//                             'line': 1,
//                             'column': 26
//                         }
//                     }
//                 },
//                 {
//                     'type': 'Identifier',
//                     'name': 'n',
//                     'loc': {
//                         'start': {
//                             'line': 1,
//                             'column': 28
//                         },
//                         'end': {
//                             'line': 1,
//                             'column': 29
//                         }
//                     }
//                 }
//             ],
//             'body': {
//                 'type': 'BlockStatement',
//                 'body': [
//                     {
//                         'type': 'VariableDeclaration',
//                         'declarations': [
//                             {
//                                 'type': 'VariableDeclarator',
//                                 'id': {
//                                     'type': 'Identifier',
//                                     'name': 'low',
//                                     'loc': {
//                                         'start': {
//                                             'line': 2,
//                                             'column': 8
//                                         },
//                                         'end': {
//                                             'line': 2,
//                                             'column': 11
//                                         }
//                                     }
//                                 },
//                                 'init': null,
//                                 'loc': {
//                                     'start': {
//                                         'line': 2,
//                                         'column': 8
//                                     },
//                                     'end': {
//                                         'line': 2,
//                                         'column': 11
//                                     }
//                                 }
//                             },
//                             {
//                                 'type': 'VariableDeclarator',
//                                 'id': {
//                                     'type': 'Identifier',
//                                     'name': 'high',
//                                     'loc': {
//                                         'start': {
//                                             'line': 2,
//                                             'column': 13
//                                         },
//                                         'end': {
//                                             'line': 2,
//                                             'column': 17
//                                         }
//                                     }
//                                 },
//                                 'init': null,
//                                 'loc': {
//                                     'start': {
//                                         'line': 2,
//                                         'column': 13
//                                     },
//                                     'end': {
//                                         'line': 2,
//                                         'column': 17
//                                     }
//                                 }
//                             },
//                             {
//                                 'type': 'VariableDeclarator',
//                                 'id': {
//                                     'type': 'Identifier',
//                                     'name': 'mid',
//                                     'loc': {
//                                         'start': {
//                                             'line': 2,
//                                             'column': 19
//                                         },
//                                         'end': {
//                                             'line': 2,
//                                             'column': 22
//                                         }
//                                     }
//                                 },
//                                 'init': null,
//                                 'loc': {
//                                     'start': {
//                                         'line': 2,
//                                         'column': 19
//                                     },
//                                     'end': {
//                                         'line': 2,
//                                         'column': 22
//                                     }
//                                 }
//                             }
//                         ],
//                         'kind': 'let',
//                         'loc': {
//                             'start': {
//                                 'line': 2,
//                                 'column': 4
//                             },
//                             'end': {
//                                 'line': 2,
//                                 'column': 23
//                             }
//                         }
//                     },
//                     {
//                         'type': 'ExpressionStatement',
//                         'expression': {
//                             'type': 'AssignmentExpression',
//                             'operator': '=',
//                             'left': {
//                                 'type': 'Identifier',
//                                 'name': 'low',
//                                 'loc': {
//                                     'start': {
//                                         'line': 3,
//                                         'column': 4
//                                     },
//                                     'end': {
//                                         'line': 3,
//                                         'column': 7
//                                     }
//                                 }
//                             },
//                             'right': {
//                                 'type': 'Literal',
//                                 'value': 0,
//                                 'raw': '0',
//                                 'loc': {
//                                     'start': {
//                                         'line': 3,
//                                         'column': 10
//                                     },
//                                     'end': {
//                                         'line': 3,
//                                         'column': 11
//                                     }
//                                 }
//                             },
//                             'loc': {
//                                 'start': {
//                                     'line': 3,
//                                     'column': 4
//                                 },
//                                 'end': {
//                                     'line': 3,
//                                     'column': 11
//                                 }
//                             }
//                         },
//                         'loc': {
//                             'start': {
//                                 'line': 3,
//                                 'column': 4
//                             },
//                             'end': {
//                                 'line': 3,
//                                 'column': 12
//                             }
//                         }
//                     },
//                     {
//                         'type': 'ExpressionStatement',
//                         'expression': {
//                             'type': 'AssignmentExpression',
//                             'operator': '=',
//                             'left': {
//                                 'type': 'Identifier',
//                                 'name': 'high',
//                                 'loc': {
//                                     'start': {
//                                         'line': 4,
//                                         'column': 4
//                                     },
//                                     'end': {
//                                         'line': 4,
//                                         'column': 8
//                                     }
//                                 }
//                             },
//                             'right': {
//                                 'type': 'BinaryExpression',
//                                 'operator': '-',
//                                 'left': {
//                                     'type': 'Identifier',
//                                     'name': 'n',
//                                     'loc': {
//                                         'start': {
//                                             'line': 4,
//                                             'column': 11
//                                         },
//                                         'end': {
//                                             'line': 4,
//                                             'column': 12
//                                         }
//                                     }
//                                 },
//                                 'right': {
//                                     'type': 'Literal',
//                                     'value': 1,
//                                     'raw': '1',
//                                     'loc': {
//                                         'start': {
//                                             'line': 4,
//                                             'column': 15
//                                         },
//                                         'end': {
//                                             'line': 4,
//                                             'column': 16
//                                         }
//                                     }
//                                 },
//                                 'loc': {
//                                     'start': {
//                                         'line': 4,
//                                         'column': 11
//                                     },
//                                     'end': {
//                                         'line': 4,
//                                         'column': 16
//                                     }
//                                 }
//                             },
//                             'loc': {
//                                 'start': {
//                                     'line': 4,
//                                     'column': 4
//                                 },
//                                 'end': {
//                                     'line': 4,
//                                     'column': 16
//                                 }
//                             }
//                         },
//                         'loc': {
//                             'start': {
//                                 'line': 4,
//                                 'column': 4
//                             },
//                             'end': {
//                                 'line': 4,
//                                 'column': 17
//                             }
//                         }
//                     },
//                     {
//                         'type': 'WhileStatement',
//                         'test': {
//                             'type': 'BinaryExpression',
//                             'operator': '<=',
//                             'left': {
//                                 'type': 'Identifier',
//                                 'name': 'low',
//                                 'loc': {
//                                     'start': {
//                                         'line': 5,
//                                         'column': 11
//                                     },
//                                     'end': {
//                                         'line': 5,
//                                         'column': 14
//                                     }
//                                 }
//                             },
//                             'right': {
//                                 'type': 'Identifier',
//                                 'name': 'high',
//                                 'loc': {
//                                     'start': {
//                                         'line': 5,
//                                         'column': 18
//                                     },
//                                     'end': {
//                                         'line': 5,
//                                         'column': 22
//                                     }
//                                 }
//                             },
//                             'loc': {
//                                 'start': {
//                                     'line': 5,
//                                     'column': 11
//                                 },
//                                 'end': {
//                                     'line': 5,
//                                     'column': 22
//                                 }
//                             }
//                         },
//                         'body': {
//                             'type': 'BlockStatement',
//                             'body': [
//                                 {
//                                     'type': 'ExpressionStatement',
//                                     'expression': {
//                                         'type': 'AssignmentExpression',
//                                         'operator': '=',
//                                         'left': {
//                                             'type': 'Identifier',
//                                             'name': 'mid',
//                                             'loc': {
//                                                 'start': {
//                                                     'line': 6,
//                                                     'column': 8
//                                                 },
//                                                 'end': {
//                                                     'line': 6,
//                                                     'column': 11
//                                                 }
//                                             }
//                                         },
//                                         'right': {
//                                             'type': 'BinaryExpression',
//                                             'operator': '/',
//                                             'left': {
//                                                 'type': 'BinaryExpression',
//                                                 'operator': '+',
//                                                 'left': {
//                                                     'type': 'Identifier',
//                                                     'name': 'low',
//                                                     'loc': {
//                                                         'start': {
//                                                             'line': 6,
//                                                             'column': 15
//                                                         },
//                                                         'end': {
//                                                             'line': 6,
//                                                             'column': 18
//                                                         }
//                                                     }
//                                                 },
//                                                 'right': {
//                                                     'type': 'Identifier',
//                                                     'name': 'high',
//                                                     'loc': {
//                                                         'start': {
//                                                             'line': 6,
//                                                             'column': 21
//                                                         },
//                                                         'end': {
//                                                             'line': 6,
//                                                             'column': 25
//                                                         }
//                                                     }
//                                                 },
//                                                 'loc': {
//                                                     'start': {
//                                                         'line': 6,
//                                                         'column': 15
//                                                     },
//                                                     'end': {
//                                                         'line': 6,
//                                                         'column': 25
//                                                     }
//                                                 }
//                                             },
//                                             'right': {
//                                                 'type': 'Literal',
//                                                 'value': 2,
//                                                 'raw': '2',
//                                                 'loc': {
//                                                     'start': {
//                                                         'line': 6,
//                                                         'column': 27
//                                                     },
//                                                     'end': {
//                                                         'line': 6,
//                                                         'column': 28
//                                                     }
//                                                 }
//                                             },
//                                             'loc': {
//                                                 'start': {
//                                                     'line': 6,
//                                                     'column': 14
//                                                 },
//                                                 'end': {
//                                                     'line': 6,
//                                                     'column': 28
//                                                 }
//                                             }
//                                         },
//                                         'loc': {
//                                             'start': {
//                                                 'line': 6,
//                                                 'column': 8
//                                             },
//                                             'end': {
//                                                 'line': 6,
//                                                 'column': 28
//                                             }
//                                         }
//                                     },
//                                     'loc': {
//                                         'start': {
//                                             'line': 6,
//                                             'column': 8
//                                         },
//                                         'end': {
//                                             'line': 6,
//                                             'column': 29
//                                         }
//                                     }
//                                 },
//                                 {
//                                     'type': 'IfStatement',
//                                     'test': {
//                                         'type': 'BinaryExpression',
//                                         'operator': '<',
//                                         'left': {
//                                             'type': 'Identifier',
//                                             'name': 'X',
//                                             'loc': {
//                                                 'start': {
//                                                     'line': 7,
//                                                     'column': 12
//                                                 },
//                                                 'end': {
//                                                     'line': 7,
//                                                     'column': 13
//                                                 }
//                                             }
//                                         },
//                                         'right': {
//                                             'type': 'MemberExpression',
//                                             'computed': true,
//                                             'object': {
//                                                 'type': 'Identifier',
//                                                 'name': 'V',
//                                                 'loc': {
//                                                     'start': {
//                                                         'line': 7,
//                                                         'column': 16
//                                                     },
//                                                     'end': {
//                                                         'line': 7,
//                                                         'column': 17
//                                                     }
//                                                 }
//                                             },
//                                             'property': {
//                                                 'type': 'Identifier',
//                                                 'name': 'mid',
//                                                 'loc': {
//                                                     'start': {
//                                                         'line': 7,
//                                                         'column': 18
//                                                     },
//                                                     'end': {
//                                                         'line': 7,
//                                                         'column': 21
//                                                     }
//                                                 }
//                                             },
//                                             'loc': {
//                                                 'start': {
//                                                     'line': 7,
//                                                     'column': 16
//                                                 },
//                                                 'end': {
//                                                     'line': 7,
//                                                     'column': 22
//                                                 }
//                                             }
//                                         },
//                                         'loc': {
//                                             'start': {
//                                                 'line': 7,
//                                                 'column': 12
//                                             },
//                                             'end': {
//                                                 'line': 7,
//                                                 'column': 22
//                                             }
//                                         }
//                                     },
//                                     'consequent': {
//                                         'type': 'ExpressionStatement',
//                                         'expression': {
//                                             'type': 'AssignmentExpression',
//                                             'operator': '=',
//                                             'left': {
//                                                 'type': 'Identifier',
//                                                 'name': 'high',
//                                                 'loc': {
//                                                     'start': {
//                                                         'line': 8,
//                                                         'column': 12
//                                                     },
//                                                     'end': {
//                                                         'line': 8,
//                                                         'column': 16
//                                                     }
//                                                 }
//                                             },
//                                             'right': {
//                                                 'type': 'BinaryExpression',
//                                                 'operator': '-',
//                                                 'left': {
//                                                     'type': 'Identifier',
//                                                     'name': 'mid',
//                                                     'loc': {
//                                                         'start': {
//                                                             'line': 8,
//                                                             'column': 19
//                                                         },
//                                                         'end': {
//                                                             'line': 8,
//                                                             'column': 22
//                                                         }
//                                                     }
//                                                 },
//                                                 'right': {
//                                                     'type': 'Literal',
//                                                     'value': 1,
//                                                     'raw': '1',
//                                                     'loc': {
//                                                         'start': {
//                                                             'line': 8,
//                                                             'column': 25
//                                                         },
//                                                         'end': {
//                                                             'line': 8,
//                                                             'column': 26
//                                                         }
//                                                     }
//                                                 },
//                                                 'loc': {
//                                                     'start': {
//                                                         'line': 8,
//                                                         'column': 19
//                                                     },
//                                                     'end': {
//                                                         'line': 8,
//                                                         'column': 26
//                                                     }
//                                                 }
//                                             },
//                                             'loc': {
//                                                 'start': {
//                                                     'line': 8,
//                                                     'column': 12
//                                                 },
//                                                 'end': {
//                                                     'line': 8,
//                                                     'column': 26
//                                                 }
//                                             }
//                                         },
//                                         'loc': {
//                                             'start': {
//                                                 'line': 8,
//                                                 'column': 12
//                                             },
//                                             'end': {
//                                                 'line': 8,
//                                                 'column': 27
//                                             }
//                                         }
//                                     },
//                                     'alternate': {
//                                         'type': 'IfStatement',
//                                         'test': {
//                                             'type': 'BinaryExpression',
//                                             'operator': '>',
//                                             'left': {
//                                                 'type': 'Identifier',
//                                                 'name': 'X',
//                                                 'loc': {
//                                                     'start': {
//                                                         'line': 9,
//                                                         'column': 17
//                                                     },
//                                                     'end': {
//                                                         'line': 9,
//                                                         'column': 18
//                                                     }
//                                                 }
//                                             },
//                                             'right': {
//                                                 'type': 'MemberExpression',
//                                                 'computed': true,
//                                                 'object': {
//                                                     'type': 'Identifier',
//                                                     'name': 'V',
//                                                     'loc': {
//                                                         'start': {
//                                                             'line': 9,
//                                                             'column': 21
//                                                         },
//                                                         'end': {
//                                                             'line': 9,
//                                                             'column': 22
//                                                         }
//                                                     }
//                                                 },
//                                                 'property': {
//                                                     'type': 'Identifier',
//                                                     'name': 'mid',
//                                                     'loc': {
//                                                         'start': {
//                                                             'line': 9,
//                                                             'column': 23
//                                                         },
//                                                         'end': {
//                                                             'line': 9,
//                                                             'column': 26
//                                                         }
//                                                     }
//                                                 },
//                                                 'loc': {
//                                                     'start': {
//                                                         'line': 9,
//                                                         'column': 21
//                                                     },
//                                                     'end': {
//                                                         'line': 9,
//                                                         'column': 27
//                                                     }
//                                                 }
//                                             },
//                                             'loc': {
//                                                 'start': {
//                                                     'line': 9,
//                                                     'column': 17
//                                                 },
//                                                 'end': {
//                                                     'line': 9,
//                                                     'column': 27
//                                                 }
//                                             }
//                                         },
//                                         'consequent': {
//                                             'type': 'ExpressionStatement',
//                                             'expression': {
//                                                 'type': 'AssignmentExpression',
//                                                 'operator': '=',
//                                                 'left': {
//                                                     'type': 'Identifier',
//                                                     'name': 'low',
//                                                     'loc': {
//                                                         'start': {
//                                                             'line': 10,
//                                                             'column': 12
//                                                         },
//                                                         'end': {
//                                                             'line': 10,
//                                                             'column': 15
//                                                         }
//                                                     }
//                                                 },
//                                                 'right': {
//                                                     'type': 'BinaryExpression',
//                                                     'operator': '+',
//                                                     'left': {
//                                                         'type': 'Identifier',
//                                                         'name': 'mid',
//                                                         'loc': {
//                                                             'start': {
//                                                                 'line': 10,
//                                                                 'column': 18
//                                                             },
//                                                             'end': {
//                                                                 'line': 10,
//                                                                 'column': 21
//                                                             }
//                                                         }
//                                                     },
//                                                     'right': {
//                                                         'type': 'Literal',
//                                                         'value': 1,
//                                                         'raw': '1',
//                                                         'loc': {
//                                                             'start': {
//                                                                 'line': 10,
//                                                                 'column': 24
//                                                             },
//                                                             'end': {
//                                                                 'line': 10,
//                                                                 'column': 25
//                                                             }
//                                                         }
//                                                     },
//                                                     'loc': {
//                                                         'start': {
//                                                             'line': 10,
//                                                             'column': 18
//                                                         },
//                                                         'end': {
//                                                             'line': 10,
//                                                             'column': 25
//                                                         }
//                                                     }
//                                                 },
//                                                 'loc': {
//                                                     'start': {
//                                                         'line': 10,
//                                                         'column': 12
//                                                     },
//                                                     'end': {
//                                                         'line': 10,
//                                                         'column': 25
//                                                     }
//                                                 }
//                                             },
//                                             'loc': {
//                                                 'start': {
//                                                     'line': 10,
//                                                     'column': 12
//                                                 },
//                                                 'end': {
//                                                     'line': 10,
//                                                     'column': 26
//                                                 }
//                                             }
//                                         },
//                                         'alternate': {
//                                             'type': 'ReturnStatement',
//                                             'argument': {
//                                                 'type': 'Identifier',
//                                                 'name': 'mid',
//                                                 'loc': {
//                                                     'start': {
//                                                         'line': 12,
//                                                         'column': 19
//                                                     },
//                                                     'end': {
//                                                         'line': 12,
//                                                         'column': 22
//                                                     }
//                                                 }
//                                             },
//                                             'loc': {
//                                                 'start': {
//                                                     'line': 12,
//                                                     'column': 12
//                                                 },
//                                                 'end': {
//                                                     'line': 12,
//                                                     'column': 23
//                                                 }
//                                             }
//                                         },
//                                         'loc': {
//                                             'start': {
//                                                 'line': 9,
//                                                 'column': 13
//                                             },
//                                             'end': {
//                                                 'line': 12,
//                                                 'column': 23
//                                             }
//                                         }
//                                     },
//                                     'loc': {
//                                         'start': {
//                                             'line': 7,
//                                             'column': 8
//                                         },
//                                         'end': {
//                                             'line': 12,
//                                             'column': 23
//                                         }
//                                     }
//                                 }
//                             ],
//                             'loc': {
//                                 'start': {
//                                     'line': 5,
//                                     'column': 24
//                                 },
//                                 'end': {
//                                     'line': 13,
//                                     'column': 5
//                                 }
//                             }
//                         },
//                         'loc': {
//                             'start': {
//                                 'line': 5,
//                                 'column': 4
//                             },
//                             'end': {
//                                 'line': 13,
//                                 'column': 5
//                             }
//                         }
//                     },
//                     {
//                         'type': 'ReturnStatement',
//                         'argument': {
//                             'type': 'UnaryExpression',
//                             'operator': '-',
//                             'argument': {
//                                 'type': 'Literal',
//                                 'value': 1,
//                                 'raw': '1',
//                                 'loc': {
//                                     'start': {
//                                         'line': 14,
//                                         'column': 12
//                                     },
//                                     'end': {
//                                         'line': 14,
//                                         'column': 13
//                                     }
//                                 }
//                             },
//                             'prefix': true,
//                             'loc': {
//                                 'start': {
//                                     'line': 14,
//                                     'column': 11
//                                 },
//                                 'end': {
//                                     'line': 14,
//                                     'column': 13
//                                 }
//                             }
//                         },
//                         'loc': {
//                             'start': {
//                                 'line': 14,
//                                 'column': 4
//                             },
//                             'end': {
//                                 'line': 14,
//                                 'column': 14
//                             }
//                         }
//                     }
//                 ],
//                 'loc': {
//                     'start': {
//                         'line': 1,
//                         'column': 30
//                     },
//                     'end': {
//                         'line': 15,
//                         'column': 1
//                     }
//                 }
//             },
//             'generator': false,
//             'expression': false,
//             'async': false,
//             'loc': {
//                 'start': {
//                     'line': 1,
//                     'column': 0
//                 },
//                 'end': {
//                     'line': 15,
//                     'column': 1
//                 }
//             }
//         }
//     ],
//     'sourceType': 'script',
//     'loc': {
//         'start': {
//             'line': 1,
//             'column': 0
//         },
//         'end': {
//             'line': 15,
//             'column': 1
//         }
//     }
// };*/