import {parseScript} from 'esprima';
import {generate} from 'escodegen';
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
    paramsExpression = params === '' ?
        [] :
        parseScript('[' + params + ']').body[0].expression.elements;
}

function deepClone(object: any): any {
    return JSON.parse(JSON.stringify(object));
}

export function removeUndefinedElements(arr: Statement[]): void {
    for (let i = arr.length; i--;)
        if (arr[i] === undefined)
            arr.splice(i, 1);
}

function parseBinaryExpression(table: Map<string, Expression>, expression: BinaryExpression, verticesTable, edgesTable: string[]): void {
    expression.left = parseExpression(table, deepClone(expression.left), verticesTable, edgesTable);
    expression.right = parseExpression(table, deepClone(expression.right), verticesTable, edgesTable);
}

function parseArrayExpression(table: Map<string, Expression>, expression: ArrayExpression, verticesTable: string[], edgesTable: string[]): void {
    for (let i in expression.elements)
        expression.elements[i] = parseExpression(table, expression.elements[i], verticesTable, edgesTable);
}

function parseMemberExpression(table: Map<string, Expression>, expression: MemberExpression, verticesTable: string[], edgesTable: string[]): Expression {
    expression.object = parseExpression(table, expression.object, verticesTable, edgesTable);
    expression.property = parseExpression(table, expression.property, verticesTable, edgesTable);
    return parseScript(/*eval(*/generate(expression)/*).toString()*/).body[0].expression;
}

function parseIdentifier(table: Map<string, Expression>, expression: Identifier, verticesTable: string[], edgesTable: string[]): Expression {
    return table[expression.name] !== undefined ?
        parseExpression(table, deepClone(table[expression.name]), verticesTable, edgesTable) :
        expression;
}

function parseAssignmentExpression(table: Map<string, Expression>, expression: AssignmentExpression, verticesTable: string[], edgesTable: string[]): void {
    if (expression.left.type === 'Identifier')
        table[expression.left.name] = parseExpression(table, deepClone(expression.right), verticesTable, edgesTable);
}

function parseBlockStatement(table: Map<string, Expression>, block: BlockStatement, verticesTable: string[], edgesTable: string[]): void {
    const newTable: Map<string, Expression> = deepClone(table);//TODO unite the old array and the new
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

function parseVariableDeclaration(table: Map<string, Expression>, statement: VariableDeclaration, verticesTable: string[], edgesTable: string[]): void {
    for (const decl of statement.declarations)
        table[decl.id.name] = decl.init;
}

function parseFunctionDeclaration(table: Map<string, Expression>, statement: FunctionDeclaration, verticesTable: string[], edgesTable: string[]) {
    params.clear();
    for (const i in statement.params)
        params[statement.params[i].name] = parseScript(eval(generate(paramsExpression[i])).toString()).body[0].expression;
    substituteStatementListItem(table, statement.body, verticesTable, edgesTable);
}

function parseAndColorTest(statement: IfStatement | WhileStatement, table: Map<string, Expression>, verticesTable: string[], edgesTable: string[]): void {
    statement.test = parseExpression(table, deepClone(statement.test), verticesTable, edgesTable);
    const generatedNode: string = generate(statement.test, {
        format: {semicolons: false}
    });
    statement.test['modifiedText'] =
        eval(generate(parseExpression(deepClone(params), deepClone(statement.test), verticesTable, edgesTable))) ?
            '<markLightGreen>' + generatedNode + '</markLightGreen>' :
            '<markRed>' + generatedNode + '</markRed>';
}

function parseIfStatement(table: Map<string, Expression>, statement: IfStatement, verticesTable: string[], edgesTable: string[]): void {
    parseAndColorTest(statement, table, verticesTable, edgesTable);
    substituteStatementListItem(table, statement.consequent, verticesTable, edgesTable);
    if (statement.alternate !== null)
        substituteStatementListItem(table, statement.alternate, verticesTable, edgesTable);
}

function parseReturnStatement(table: Map<string, Expression>, statement: ReturnStatement, verticesTable: string[], edgesTable: string[]): void {
    if (statement.argument !== null)
        parseExpression(table, statement.argument, verticesTable, edgesTable);
}

function parseWhileStatement(table: Map<string, Expression>, statement: WhileStatement, verticesTable: string[], edgesTable: string[]): void {
    parseAndColorTest(statement, table, verticesTable, edgesTable);
    substituteStatementListItem(table, statement.body, verticesTable, edgesTable);
}

function parseExpression2(table: Map<string, Expression>, expression: Expression, verticesTable: string[], edgesTable: string[]): Expression {
    switch (expression.type) {
        case 'BinaryExpression':
            parseBinaryExpression(table, expression, verticesTable, edgesTable);
            return expression;
        case 'ArrayExpression':
            parseArrayExpression(table, expression, verticesTable, edgesTable);
            return expression;
    }
}

function parseExpression(table: Map<string, Expression>, expression: Expression, verticesTable: string[], edgesTable: string[]): Expression {
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

function parseStatementListItem2(table: Map<string, Expression>, statement: Statement, verticesTable: string[], edgesTable: string[]): void {
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

export function substituteStatementListItem(table: Map<string, Expression>, statement: Statement, verticesTable: string[], edgesTable: string[]): void {
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