"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JQuery = require("jquery");
const escodegen_1 = require("escodegen");
const expr_eval_1 = require("expr-eval");
function removeUndefinedElements(arr) {
    for (let i = arr.length; i--;)
        if (arr[i] === undefined)
            arr.splice(i, 1);
}
exports.removeUndefinedElements = removeUndefinedElements;
function parseBinaryExpression(table, expression) {
    expression.left = parseExpression(table, JQuery.extend(true, {}, expression.left));
    expression.right = parseExpression(table, JQuery.extend(true, {}, expression.right));
    return expression;
}
function parseMemberExpression(table, member) {
    return undefined;
}
function parseIdentifier(table, expression) {
    return table[expression.name] !== undefined ?
        parseExpression(table, JQuery.extend(true, {}, table[expression.name])) :
        expression;
}
function parseAssignmentExpression(table, expression) {
    if (expression.left.type === "Identifier")
        table[expression.left.name] = parseExpression(table, JQuery.extend(true, {}, expression.right));
}
function parseBlockStatement(block, table) {
    const newTable = JQuery.extend(true, {}, table);
    let i = 0;
    for (const expressionStatement of block.body) {
        substituteStatementListItem(expressionStatement, newTable);
        if (expressionStatement.type === 'VariableDeclaration' ||
            (expressionStatement.type === 'ExpressionStatement' &&
                expressionStatement.expression.type === 'AssignmentExpression'))
            delete block.body[i];
        i++;
    }
    removeUndefinedElements(block.body);
}
function parseVariableDeclaration(statement, table) {
    for (const decl of statement.declarations)
        table[decl.id.name] = decl.init;
}
function parseAndColorTest(statement, table) {
    statement.test = parseExpression(table, JQuery.extend(true, {}, statement.test));
    const generatedNode = escodegen_1.generate(statement.test, {
        format: { semicolons: false }
    });
    statement.test['modifiedText'] = expr_eval_1.Parser.evaluate(generatedNode, { x: 1, y: 2, z: 3 /*Parameters table*/ }) ?
        '<markLightGreen>' + generatedNode + '</markLightGreen>' :
        '<markRed>' + generatedNode + '</markRed>';
}
function parseIfStatement(table, statement) {
    parseAndColorTest(statement, table);
    substituteStatementListItem(statement.consequent, table);
    if (statement.alternate !== null)
        substituteStatementListItem(statement.alternate, table);
}
function parseReturnStatement(table, statement) {
    if (statement.argument !== null)
        parseExpression(table, statement.argument);
}
function parseWhileStatement(table, statement) {
    parseAndColorTest(statement, table);
    substituteStatementListItem(statement.body, table);
}
function parseExpression(table, expression) {
    switch (expression.type) {
        case 'Identifier':
            return parseIdentifier(table, expression);
        case 'Literal':
            return expression;
        case 'AssignmentExpression':
            parseAssignmentExpression(table, expression);
            return expression;
        case 'MemberExpression':
            return parseMemberExpression(table, expression);
        case 'BinaryExpression':
            return parseBinaryExpression(table, expression);
    }
}
function parseStatementListItem3(statement, table) {
    if (statement.type === 'WhileStatement')
        parseWhileStatement(table, statement);
}
function parseStatementListItem2(statement, table) {
    switch (statement.type) {
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
            substituteStatementListItem(statement.body, table);
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