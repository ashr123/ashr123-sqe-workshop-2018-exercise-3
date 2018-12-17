import {parseScript} from 'esprima';
import {generate} from 'escodegen';
import {extend} from 'jquery';
import {
    ArrayExpression,
    AssignmentExpression,
    BinaryExpression,
    BlockStatement,
    Expression,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    MemberExpression,
    ReturnStatement,
    Statement,
    VariableDeclaration,
    WhileStatement
} from './programInterfaces';

const params: Map<string, Expression> = new Map<string, Expression>();
let paramsExpression: Expression[];

export function initParams(params: string): void {
    paramsExpression = parseScript('(' + params + ')').body[0].expression.expressions;
}

export function removeUndefinedElements(arr: Statement[]): void {
    for (let i = arr.length; i--;)
        if (arr[i] === undefined)
            arr.splice(i, 1);
}

function parseBinaryExpression(table: Map<string, Expression>, expression: BinaryExpression): void {
    expression.left = parseExpression(table, extend(true, {}, expression.left));
    expression.right = parseExpression(table, extend(true, {}, expression.right));
}

function parseArrayExpression(table: Map<string, Expression>, expression: ArrayExpression): void {
    for (let i in expression.elements)
        expression.elements[i] = parseExpression(table, expression.elements[i]);
}

function parseMemberExpression(table: Map<string, Expression>, expression: MemberExpression): Expression {
    expression.object = parseExpression(table, expression.object);
    expression.property = parseExpression(table, expression.property);
    return parseScript(/*eval(*/generate(expression)/*).toString()*/).body[0].expression;
}

function parseIdentifier(table: Map<string, Expression>, expression: Identifier): Expression {
    return table[expression.name] !== undefined ?
        parseExpression(table, extend(true, {}, table[expression.name])) :
        expression;
}

function parseAssignmentExpression(table: Map<string, Expression>, expression: AssignmentExpression): void {
    if (expression.left.type === 'Identifier')
        table[expression.left.name] = parseExpression(table, extend(true, {}, expression.right));
}

function parseBlockStatement(table: Map<string, Expression>, block: BlockStatement): void {
    const newTable: Map<string, Expression> = extend(true, {}, table);//TODO unite the old array and the new
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

function parseVariableDeclaration(table: Map<string, Expression>, statement: VariableDeclaration): void {
    for (const decl of statement.declarations)
        table[decl.id.name] = decl.init;
}

function parseFunctionDeclaration(table: Map<string, Expression>, statement: FunctionDeclaration) {
    params.clear();
    for (const i in statement.params)
        params[statement.params[i].name] = parseScript(eval(generate(paramsExpression[i])).toString()).body[0].expression;
    substituteStatementListItem(table, statement.body);
}

function parseAndColorTest(statement: IfStatement | WhileStatement, table: Map<string, Expression>): void {
    statement.test = parseExpression(table, extend(true, {}, statement.test));
    const generatedNode: string = generate(statement.test, {
        format: {semicolons: false}
    });
    statement.test['modifiedText'] =
        eval(generate(parseExpression(extend(true, {}, params), extend(true, {}, statement.test)))) ?
            '<markLightGreen>' + generatedNode + '</markLightGreen>' :
            '<markRed>' + generatedNode + '</markRed>';
}

function parseIfStatement(table: Map<string, Expression>, statement: IfStatement): void {
    parseAndColorTest(statement, table);
    substituteStatementListItem(table, statement.consequent);
    if (statement.alternate !== null)
        substituteStatementListItem(table, statement.alternate);
}

function parseReturnStatement(table: Map<string, Expression>, statement: ReturnStatement): void {
    if (statement.argument !== null)
        parseExpression(table, statement.argument);
}

function parseWhileStatement(table: Map<string, Expression>, statement: WhileStatement): void {
    parseAndColorTest(statement, table);
    substituteStatementListItem(table, statement.body);
}

function parseExpression2(table: Map<string, Expression>, expression: Expression): Expression {
    switch (expression.type) {
        case 'BinaryExpression':
            parseBinaryExpression(table, expression);
            return expression;
        case 'ArrayExpression':
            parseArrayExpression(table, expression);
            return expression;
    }
}

function parseExpression(table: Map<string, Expression>, expression: Expression): Expression {
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

function parseStatementListItem2(table: Map<string, Expression>, statement: Statement): void {
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

export function substituteStatementListItem(table: Map<string, Expression>, statement: Statement): void {
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