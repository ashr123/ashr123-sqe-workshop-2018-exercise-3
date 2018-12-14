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
    return table[expression.name] !== undefined ? parseExpression(table, JQuery.extend(true, {}, table[expression.name])) : expression;
    // return parseExpression(table, JQuery.extend(true, {}, temp));
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
    const generatedNode = escodegen_1.generate(statement.test, {
        format: { semicolons: false }
    });
    statement.test['modifiedText'] = expr_eval_1.Parser.evaluate(generatedNode, { x: 1, y: 2, z: 3 /*Parameters table*/ }) ?
        '<markLightGreen>' + generatedNode + '</markLightGreen>' :
        '<markRed>' + generatedNode + '</markRed>';
    substituteStatementListItem(statement.consequent, table);
    if (statement.alternate !== null)
        substituteStatementListItem(statement.alternate, table);
}
function parseReturnStatement(table, statement) {
    // pushLine(table, statement.loc.start.line, 'Return Statement', '', '', statement.argument === null ? null : generate(statement.argument));
    if (statement.argument !== null)
        parseExpression(table, statement.argument);
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