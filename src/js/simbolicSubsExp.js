"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const esprima_1 = require("esprima");
const escodegen_1 = require("escodegen");
const jquery_1 = require("jquery");
function removeUndefinedElements(arr) {
    for (let i = arr.length; i--;)
        if (arr[i] === undefined)
            arr.splice(i, 1);
}
exports.removeUndefinedElements = removeUndefinedElements;
function parseBinaryExpression(table, expression) {
    expression.left = parseExpression(table, jquery_1.extend(true, {}, expression.left));
    expression.right = parseExpression(table, jquery_1.extend(true, {}, expression.right));
    return expression;
}
function parseArrayExpression(table, expression) {
    for (let i in expression.elements)
        expression.elements[i] = parseExpression(table, expression.elements[i]);
}
function parseMemberExpression(table, member) {
    member.object = parseExpression(table, member.object);
    member.property = parseExpression(table, member.property);
    return esprima_1.parseScript(/*eval(*/ escodegen_1.generate(member) /*).toString()*/).body[0].expression;
}
function parseIdentifier(table, expression) {
    return table[expression.name] !== undefined ?
        parseExpression(table, jquery_1.extend(true, {}, table[expression.name])) :
        expression;
}
function parseAssignmentExpression(table, expression) {
    if (expression.left.type === "Identifier")
        table[expression.left.name] = parseExpression(table, jquery_1.extend(true, {}, expression.right));
}
function parseBlockStatement(block, table) {
    const newTable = jquery_1.extend(true, {}, table);
    for (const i in block.body) {
        substituteStatementListItem(block.body[i], newTable);
        if (block.body[i].type === 'VariableDeclaration' ||
            (block.body[i].type === 'ExpressionStatement' &&
                // @ts-ignore
                block.body[i].expression.type === 'AssignmentExpression'))
            delete block.body[i];
    }
    removeUndefinedElements(block.body);
}
function parseVariableDeclaration(statement, table) {
    for (const decl of statement.declarations)
        table[decl.id.name] = decl.init;
}
// function foo(x, y, z) {
//     if ("moshe" === "moshe") {
//         true;
//     }
//     let a = x + 1;
//     let b = a + y;
//     let c = 4;
//
//     if (b < z) {
//         c = 5;
//         return x + y + z + c;
//     } else if (b < z * 2) {
//         c = x + 5;
//         return x + y + z + c;
//     } else {
//         //c = z + 5;
//         return x + y + z + c;
//     }
// }
function parseAndColorTest(statement, table) {
    statement.test = parseExpression(table, jquery_1.extend(true, {}, statement.test));
    const params = { x: '[0, 2, 1][2]', y: '2', z: '3' }; //TODO remove this
    for (const key in params) //TODO refactor extract method
        params[key] = esprima_1.parseScript(eval(params[key]).toString()).body[0].expression;
    const generatedNode = escodegen_1.generate(statement.test, {
        format: { semicolons: false }
    });
    statement.test['modifiedText'] =
        eval(escodegen_1.generate(parseExpression(jquery_1.extend(true, {}, params), jquery_1.extend(true, {}, statement.test)))) ?
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
        case 'ArrayExpression':
            parseArrayExpression(table, expression);
            return expression;
    }
}
function parseStatementListItem2(statement, table) {
    switch (statement.type) {
        case 'IfStatement':
            parseIfStatement(table, statement);
            break;
        case 'ReturnStatement':
            parseReturnStatement(table, statement);
            break;
        case 'WhileStatement':
            parseWhileStatement(table, statement);
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