"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JQuery = require("jquery");
function removeUndefinedElements(arr) {
    for (let i = arr.length; i--;)
        if (arr[i] === undefined)
            arr.splice(i, 1);
}
exports.removeUndefinedElements = removeUndefinedElements;
// function simbolicSubstitute(table: Map<string, Expression>, right: Expression): Expression {
//     switch (right.type) {
//         case 'Identifier':
//             return parseIdentifier(table, right);
//         case 'Literal':
//             return right;
//         case 'BinaryExpression':
//             return parseBinaryExpression(table, right);
//     }
// }
function parseBinaryExpression(table, expression) {
    expression.left = parseExpression(table, JQuery.extend(true, {}, expression.left));
    expression.right = parseExpression(table, JQuery.extend(true, {}, expression.right));
    return expression;
}
// function pushLine(table: Map<string, Expression>, line: number,
//                   type: string,
//                   name: string = '',
//                   condition: string = '',
//                   value: string = '') {
//     table.push({line: line, type: type, name: name, condition: condition, value: value});
// }
function parseMemberExpression(table, member) {
    return undefined;
}
function parseIdentifier(table, expression) {
    // pushLine(table, expression.loc.start.line, 'Identifier', expression.name);
    let temp = table[expression.name] !== undefined ? table[expression.name] : expression;
    return parseExpression(table, JQuery.extend(true, {}, temp));
}
// function parseLiteral(table: Map<string, Expression>, expression: Literal): Expression {
//     // pushLine(table, expression.loc.start.line, 'Literal', '', '', expression.raw);
//
// }
function parseAssignmentExpression(table, expression) {
    // pushLine(table, expression.loc.start.line, 'Assignment Expression', generate(expression.left), '', generate(expression.right));
    if (expression.left.type === "Identifier") {
        table[expression.left.name] = parseExpression(table, JQuery.extend(true, {}, expression.right)); // update table for later use
        // expression.right = table[expression.left.name];
    }
}
// function parseUpdateExpression(table: Map<string, Expression>, expression: UpdateExpression) {
//     pushLine(table, expression.loc.start.line, 'Update Expression', generate(expression.argument), '', generate(expression));
// }
function parseBlockStatement(statement, table) {
    let i = 0;
    for (const expressionStatement of statement.body) {
        substituteStatementListItem(expressionStatement, JQuery.extend(true, {}, table));
        if (expressionStatement.type === 'VariableDeclaration')
            delete statement.body[i];
        i++;
    }
    removeUndefinedElements(statement.body);
}
function functionDeclaration(table, statement) {
    // pushLine(table, statement.loc.start.line, 'Function Declaration', statement.id.name);
    // for (const param of statement.params)
    //     pushLine(table, param.loc.start.line, 'Variable Declaration', param.name); //TODO chenge when evaluating
    substituteStatementListItem(statement.body, table);
}
function parseVariableDeclaration(statement, table) {
    for (const decl of statement.declarations)
        table[decl.id.name] = decl.init;
}
// function parseBreakStatement(table: Map<string, Expression>, statement: BreakStatement) {
//     pushLine(table, statement.loc.start.line, 'Break Statement');
// }
// function parseForStatement(statement: ForStatement, table: Map<string, Expression>) {
//     if (statement.test !== null)
//         pushLine(table, statement.loc.start.line, 'For Statement', '', generate(statement.test));
//     if (statement.init !== null)
//         statement.init.type === 'VariableDeclaration' ?
//             substituteStatementListItem(statement.init, table) :
//             parseExpression(table, statement.init);
//     if (statement.update !== null)
//         parseExpression(table, statement.update);
//     substituteStatementListItem(statement.body, table);
// }
function parseIfStatement(table, statement) {
    // pushLine(table, statement.loc.start.line, 'If Statement', '', generate(statement.test));
    statement.test = parseExpression(table, JQuery.extend(true, {}, statement.test));
    // if statement.test is true then add property dfdf to statement.test
    substituteStatementListItem(statement.consequent, table);
    if (statement.alternate !== null) {
        if (statement.alternate.type === 'IfStatement')
            // pushLine(table, statement.alternate.loc.start.line, 'else');
            substituteStatementListItem(statement.alternate, table);
    }
}
function parseReturnStatement(table, statement) {
    // pushLine(table, statement.loc.start.line, 'Return Statement', '', '', statement.argument === null ? null : generate(statement.argument));
}
function parseWhileStatement(table, statement) {
    // pushLine(table, statement.loc.start.line, 'While Statement', '', generate(statement.test));
    substituteStatementListItem(statement.body, table);
}
function parseExpression(table, expression) {
    switch (expression.type) {
        case 'Identifier':
            return parseIdentifier(table, expression);
        // break;
        case 'Literal':
            return expression;
        case 'AssignmentExpression':
            parseAssignmentExpression(table, expression);
            return expression;
        // break;
        case 'MemberExpression':
            return parseMemberExpression(table, expression);
        case 'BinaryExpression':
            return parseBinaryExpression(table, expression);
        // case 'UpdateExpression':
        //     parseUpdateExpression(table, expression);
    }
}
function parseStatementListItem3(statement, table) {
    if (statement.type === 'WhileStatement')
        parseWhileStatement(table, statement);
    //TODO: Consider doing 'AssignmentPattern'
}
function parseStatementListItem2(statement, table) {
    switch (statement.type) {
        // case 'BreakStatement':
        //     parseBreakStatement(table, statement);
        //     break;
        // case 'ForStatement':
        //     parseForStatement(statement, table);
        //     break;
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
function substituteStatementListItem(statement, table) {
    switch (statement.type) {
        case 'BlockStatement':
            parseBlockStatement(statement, table);
            break;
        case 'FunctionDeclaration':
            functionDeclaration(table, statement);
            break;
        case 'VariableDeclaration':
            parseVariableDeclaration(statement, table);
            break;
        case 'ExpressionStatement':
            statement.expression = parseExpression(table, statement.expression);
            break;
        default:
            parseStatementListItem2(statement, table);
    }
}
exports.substituteStatementListItem = substituteStatementListItem;
//# sourceMappingURL=simbolicSubsExp.js.map