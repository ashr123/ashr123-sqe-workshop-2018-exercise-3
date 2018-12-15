import {parseScript} from 'esprima';
import {generate} from 'escodegen';
import {extend} from 'jquery';
import {
    ArrayExpression,
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
    expression.left = parseExpression(table, extend(true, {}, expression.left));
    expression.right = parseExpression(table, extend(true, {}, expression.right));
    return expression;
}

function parseArrayExpression(table: Map<string, Expression>, expression: ArrayExpression) {
    for (let i in expression.elements)
        expression.elements[i] = parseExpression(table, expression.elements[i]);
}

function parseMemberExpression(table: Map<string, Expression>, member: MemberExpression): Expression {
    member.object = parseExpression(table, member.object);
    member.property = parseExpression(table, member.property);
    return parseScript(eval(generate(member)).toString()).body[0].expression;
}

function parseIdentifier(table: Map<string, Expression>, expression: Identifier): Expression {
    return table[expression.name] !== undefined ?
        parseExpression(table, extend(true, {}, table[expression.name])) :
        expression;
}

function parseAssignmentExpression(table: Map<string, Expression>, expression: AssignmentExpression): void {
    if (expression.left.type === "Identifier")
        table[expression.left.name] = parseExpression(table, extend(true, {}, expression.right));
}

function parseBlockStatement(block: BlockStatement, table: Map<string, Expression>): void {
    const newTable: Map<string, Expression> = extend(true, {}, table);
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

function parseVariableDeclaration(statement: VariableDeclaration, table: Map<string, Expression>): void {
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

function parseAndColorTest(statement: IfStatement | WhileStatement, table: Map<string, Expression>): void {
    statement.test = parseExpression(table, extend(true, {}, statement.test));
    const params = {x: '[0, 2, 1][2]', y: '2', z: '3'}; //TODO remove this
    for (const key in params) //TODO refactor extract method
        params[key] = parseScript(eval(params[key]).toString()).body[0].expression;
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

    substituteStatementListItem(statement.consequent, table);
    if (statement.alternate !== null)
        substituteStatementListItem(statement.alternate, table);
}

function parseReturnStatement(table: Map<string, Expression>, statement: ReturnStatement): void {
    if (statement.argument !== null)
        parseExpression(table, statement.argument);
}

function parseWhileStatement(table: Map<string, Expression>, statement: WhileStatement): void {
    parseAndColorTest(statement, table);
    substituteStatementListItem(statement.body, table);
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
        case 'BinaryExpression':
            return parseBinaryExpression(table, expression);
        case 'ArrayExpression':
            parseArrayExpression(table, expression);
            return expression;
    }
}

function parseStatementListItem2(statement: Statement, table: Map<string, Expression>): void {
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

export function substituteStatementListItem(statement: Statement, table: Map<string, Expression>): void {
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