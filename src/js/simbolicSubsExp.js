"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const esprima_1 = require("esprima");
const escodegen_1 = require("escodegen");
const params = new Map();
let paramsExpression;
function initParams(params) {
    paramsExpression = params === '' ?
        [] :
        esprima_1.parseScript('[' + params + ']').body[0].expression.elements;
}
exports.initParams = initParams;
function deepClone(object) {
    return JSON.parse(JSON.stringify(object));
}
function removeUndefinedElements(arr) {
    for (let i = arr.length; i--;)
        if (arr[i] === undefined)
            arr.splice(i, 1);
}
exports.removeUndefinedElements = removeUndefinedElements;
function parseBinaryExpression(table, expression, verticesTable, edgesTable) {
    expression.left = parseExpression(table, deepClone(expression.left), verticesTable, edgesTable);
    expression.right = parseExpression(table, deepClone(expression.right), verticesTable, edgesTable);
}
function parseArrayExpression(table, expression, verticesTable, edgesTable) {
    for (let i in expression.elements)
        expression.elements[i] = parseExpression(table, expression.elements[i], verticesTable, edgesTable);
}
function parseMemberExpression(table, expression, verticesTable, edgesTable) {
    expression.object = parseExpression(table, expression.object, verticesTable, edgesTable);
    expression.property = parseExpression(table, expression.property, verticesTable, edgesTable);
    return esprima_1.parseScript(/*eval(*/ escodegen_1.generate(expression) /*).toString()*/).body[0].expression;
}
function parseIdentifier(table, expression, verticesTable, edgesTable) {
    return table[expression.name] !== undefined ?
        parseExpression(table, deepClone(table[expression.name]), verticesTable, edgesTable) :
        expression;
}
function parseAssignmentExpression(table, expression, verticesTable, edgesTable) {
    if (expression.left.type === 'Identifier')
        table[expression.left.name] = parseExpression(table, deepClone(expression.right), verticesTable, edgesTable);
}
function parseBlockStatement(table, block, verticesTable, edgesTable) {
    const newTable = deepClone(table); //TODO unite the old array and the new
    for (const i in block.body) {
        substituteStatementListItem(newTable, block.body[i], verticesTable, edgesTable);
        if (block.body[i].type === 'VariableDeclaration' ||
            (block.body[i].type === 'ExpressionStatement' &&
                // @ts-ignore
                block.body[i].expression.type === 'AssignmentExpression'))
            delete block.body[i];
    }
    removeUndefinedElements(block.body);
}
function parseVariableDeclaration(table, statement, verticesTable, edgesTable) {
    for (const decl of statement.declarations)
        table[decl.id.name] = decl.init;
}
function parseFunctionDeclaration(table, statement, verticesTable, edgesTable) {
    params.clear();
    for (const i in statement.params)
        params[statement.params[i].name] = esprima_1.parseScript(eval(escodegen_1.generate(paramsExpression[i])).toString()).body[0].expression;
    substituteStatementListItem(table, statement.body, verticesTable, edgesTable);
}
function parseAndColorTest(statement, table, verticesTable, edgesTable) {
    statement.test = parseExpression(table, deepClone(statement.test), verticesTable, edgesTable);
    const generatedNode = escodegen_1.generate(statement.test, {
        format: { semicolons: false }
    });
    statement.test['modifiedText'] =
        eval(escodegen_1.generate(parseExpression(deepClone(params), deepClone(statement.test), verticesTable, edgesTable))) ?
            '<markLightGreen>' + generatedNode + '</markLightGreen>' :
            '<markRed>' + generatedNode + '</markRed>';
}
function parseIfStatement(table, statement, verticesTable, edgesTable) {
    parseAndColorTest(statement, table, verticesTable, edgesTable);
    substituteStatementListItem(table, statement.consequent, verticesTable, edgesTable);
    if (statement.alternate !== null)
        substituteStatementListItem(table, statement.alternate, verticesTable, edgesTable);
}
function parseReturnStatement(table, statement, verticesTable, edgesTable) {
    if (statement.argument !== null)
        parseExpression(table, statement.argument, verticesTable, edgesTable);
}
function parseWhileStatement(table, statement, verticesTable, edgesTable) {
    parseAndColorTest(statement, table, verticesTable, edgesTable);
    substituteStatementListItem(table, statement.body, verticesTable, edgesTable);
}
function parseExpression2(table, expression, verticesTable, edgesTable) {
    switch (expression.type) {
        case 'BinaryExpression':
            parseBinaryExpression(table, expression, verticesTable, edgesTable);
            return expression;
        case 'ArrayExpression':
            parseArrayExpression(table, expression, verticesTable, edgesTable);
            return expression;
    }
}
function parseExpression(table, expression, verticesTable, edgesTable) {
    switch (expression.type) {
        case 'Identifier':
            return parseIdentifier(table, expression, verticesTable, edgesTable);
        case 'Literal': //TODO transfer ', verticesTable: string[], edgesTable: string[]'?
            return expression;
        case 'AssignmentExpression':
            parseAssignmentExpression(table, expression, verticesTable, edgesTable);
            return expression;
        case 'MemberExpression':
            return parseMemberExpression(table, expression, verticesTable, edgesTable);
        default:
            return parseExpression2(table, expression, verticesTable, edgesTable);
    }
}
function parseStatementListItem2(table, statement, verticesTable, edgesTable) {
    switch (statement.type) {
        case 'IfStatement':
            parseIfStatement(table, statement, verticesTable, edgesTable);
            break;
        case 'ReturnStatement':
            parseReturnStatement(table, statement, verticesTable, edgesTable);
            break;
        case 'WhileStatement':
            parseWhileStatement(table, statement, verticesTable, edgesTable);
    }
}
function substituteStatementListItem(table, statement, verticesTable, edgesTable) {
    switch (statement.type) {
        case 'BlockStatement':
            parseBlockStatement(table, statement, verticesTable, edgesTable);
            break;
        case 'FunctionDeclaration':
            parseFunctionDeclaration(table, statement, verticesTable, edgesTable);
            break;
        case 'VariableDeclaration':
            parseVariableDeclaration(table, statement, verticesTable, edgesTable);
            break;
        case 'ExpressionStatement':
            statement.expression = parseExpression(table, statement.expression, verticesTable, edgesTable);
            break;
        default:
            parseStatementListItem2(table, statement, verticesTable, edgesTable);
    }
}
exports.substituteStatementListItem = substituteStatementListItem;
//# sourceMappingURL=simbolicSubsExp.js.map