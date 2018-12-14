import * as JQuery from 'jquery';
import {generate} from 'escodegen';
import {Parser} from 'expr-eval';
import {
    AssignmentExpression,
    BinaryExpression,
    BlockStatement,
    Expression,
    Identifier,
    IfStatement,
    MemberExpression,
    ReturnStatement,
    Statement,
    VariableDeclaration,
    WhileStatement
} from './programInterfaces';

export function removeUndefinedElements(arr: Statement[]): void {
    for (let i = arr.length; i--;)
        if (arr[i] === undefined)
            arr.splice(i, 1);
}

function parseBinaryExpression(table: Map<string, Expression>, expression: BinaryExpression): Expression {
    expression.left = parseExpression(table, JQuery.extend(true, {}, expression.left));
    expression.right = parseExpression(table, JQuery.extend(true, {}, expression.right));
    return expression;
}

function parseMemberExpression(table: Map<string, Expression>, member: MemberExpression)/*: Expression*/ {
    return undefined;
}

function parseIdentifier(table: Map<string, Expression>, expression: Identifier): Expression {
    return table[expression.name] !== undefined ?
        parseExpression(table, JQuery.extend(true, {}, table[expression.name])) :
        expression;
}

function parseAssignmentExpression(table: Map<string, Expression>, expression: AssignmentExpression) {
    if (expression.left.type === "Identifier")
        table[expression.left.name] = parseExpression(table, JQuery.extend(true, {}, expression.right));
}

function parseBlockStatement(block: BlockStatement, table: Map<string, Expression>) {
    const newTable: Map<string, Expression> = JQuery.extend(true, {}, table);
    let i: number = 0;
    for (const expressionStatement of block.body) {
        substituteStatementListItem(expressionStatement, newTable);
        if (expressionStatement.type === 'VariableDeclaration' ||
            (expressionStatement.type === 'ExpressionStatement' &&
                expressionStatement.expression.type === 'AssignmentExpression'))
            delete block.body[i];
        i++
    }
    removeUndefinedElements(block.body);
}

function parseVariableDeclaration(statement: VariableDeclaration, table: Map<string, Expression>) {
    for (const decl of statement.declarations)
        table[decl.id.name] = decl.init;
}

function parseAndColorTest(statement: IfStatement | WhileStatement, table: Map<string, Expression>) {
    statement.test = parseExpression(table, JQuery.extend(true, {}, statement.test));

    const generatedNode: string = generate(statement.test, {
        format: {semicolons: false}
    });
    statement.test['modifiedText'] = Parser.evaluate(generatedNode, {x: 1, y: 2, z: 3/*Parameters table*/}) ?
        '<markLightGreen>' + generatedNode + '</markLightGreen>' :
        '<markRed>' + generatedNode + '</markRed>';
}

function parseIfStatement(table: Map<string, Expression>, statement: IfStatement) {
    parseAndColorTest(statement, table);

    substituteStatementListItem(statement.consequent, table);
    if (statement.alternate !== null)
        substituteStatementListItem(statement.alternate, table);
}

function parseReturnStatement(table: Map<string, Expression>, statement: ReturnStatement) {
    if (statement.argument !== null)
        parseExpression(table, statement.argument);
}

function parseWhileStatement(table: Map<string, Expression>, statement: WhileStatement) {
    parseAndColorTest(statement, table);
    substituteStatementListItem(statement.body, table);
}

function parseExpression(table: Map<string, Expression>, expression: Expression): Expression { //TODO MemberExpression
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

function parseStatementListItem3(statement: Statement, table: Map<string, Expression>) {
    if (statement.type === 'WhileStatement')
        parseWhileStatement(table, statement);
}

function parseStatementListItem2(statement: Statement, table: Map<string, Expression>) {
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

export function substituteStatementListItem(statement: Statement, table: Map<string, Expression>) {
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