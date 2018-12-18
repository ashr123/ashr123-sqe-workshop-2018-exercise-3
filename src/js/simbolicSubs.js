import {parseScript} from 'esprima';
import {generate} from 'escodegen';

const params = new Map();
let paramsExpression;

export function initParams(params) {
    paramsExpression = params === '' ?
        [] :
        parseScript('[' + params + ']').body[0].expression.elements;
}

function deepClone(object) {
    return JSON.parse(JSON.stringify(object));
}

export function removeUndefinedElements(arr) {
    for (let i = arr.length; i--;)
        if (arr[i] === undefined)
            arr.splice(i, 1);
}

function parseBinaryExpression(table, expression) {
    expression.left = parseExpression(table, deepClone(expression.left));
    expression.right = parseExpression(table, deepClone(expression.right));
}

function parseArrayExpression(table, expression) {
    for (let i in expression.elements)
        expression.elements[i] = parseExpression(table, expression.elements[i]);
}

function parseMemberExpression(table, expression) {
    expression.object = parseExpression(table, expression.object);
    expression.property = parseExpression(table, expression.property);
    return parseScript(/*eval(*/ generate(expression) /*).toString()*/).body[0].expression;
}

function parseIdentifier(table, expression) {
    return table[expression.name] !== undefined ?
        parseExpression(table, deepClone(table[expression.name])) :
        expression;
}

function parseAssignmentExpression(table, expression) {
    if (expression.left.type === 'Identifier')
        table[expression.left.name] = parseExpression(table, deepClone(expression.right));
}

function parseBlockStatement(table, block) {
    const newTable = deepClone(table); //TODO unite the old array and the new
    for (const i in block.body) {
        substituteStatementListItem(newTable, block.body[i]);
        if (block.body[i].type === 'VariableDeclaration' ||
            (block.body[i].type === 'ExpressionStatement' &&
                // @ts-ignore
                block.body[i].expression.type === 'AssignmentExpression'))
            delete block.body[i];
    }
    removeUndefinedElements(block.body);
}

function parseVariableDeclaration(table, statement) {
    for (const decl of statement.declarations)
        table[decl.id.name] = decl.init;
}

function parseFunctionDeclaration(table, statement) {
    params.clear();
    for (const i in statement.params)
        params[statement.params[i].name] = parseScript(eval(generate(paramsExpression[i])).toString()).body[0].expression;
    substituteStatementListItem(table, statement.body);
}

function parseAndColorTest(statement, table) {
    statement.test = parseExpression(table, deepClone(statement.test));
    const generatedNode = generate(statement.test, {
        format: {semicolons: false}
    });
    statement.test['modifiedText'] =
        eval(generate(parseExpression(deepClone(params), deepClone(statement.test)))) ?
            '<markLightGreen>' + generatedNode + '</markLightGreen>' :
            '<markRed>' + generatedNode + '</markRed>';
}

function parseIfStatement(table, statement) {
    parseAndColorTest(statement, table);
    substituteStatementListItem(table, statement.consequent);
    if (statement.alternate !== null)
        substituteStatementListItem(table, statement.alternate);
}

function parseReturnStatement(table, statement) {
    if (statement.argument !== null)
        parseExpression(table, statement.argument);
}

function parseWhileStatement(table, statement) {
    // parseAndColorTest(statement, table);
    statement.test = parseExpression(table, deepClone(statement.test));
    substituteStatementListItem(table, statement.body);
}

function parseExpression2(table, expression) {
    switch (expression.type) {
    case 'BinaryExpression':
        parseBinaryExpression(table, expression);
        return expression;
    case 'ArrayExpression':
        parseArrayExpression(table, expression);
        return expression;
    }
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
    default:
        return parseExpression2(table, expression);
    }
}

function parseStatementListItem2(table, statement) {
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

export function substituteStatementListItem(table, statement) {
    switch (statement.type) {
    case 'BlockStatement':
        parseBlockStatement(table, statement);
        break;
    case 'FunctionDeclaration':
        parseFunctionDeclaration(table, statement);
        break;
    case 'VariableDeclaration':
        parseVariableDeclaration(table, statement);
        break;
    case 'ExpressionStatement':
        statement.expression = parseExpression(table, statement.expression);
        break;
    default:
        parseStatementListItem2(table, statement);
    }
}