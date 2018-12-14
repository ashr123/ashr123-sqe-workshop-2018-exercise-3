import * as JQuery from 'jquery';
import {generate} from 'escodegen';
import {Parser} from 'expr-eval';
import {
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

export function removeUndefinedElements(arr: Statement[]): void {
    for (let i = arr.length; i--;)
        if (arr[i] === undefined)
            arr.splice(i, 1);
}

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

function parseBinaryExpression(table: Map<string, Expression>, expression: BinaryExpression): Expression {
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

function parseMemberExpression(table: Map<string, Expression>, member: MemberExpression)/*: Expression*/ {
    return undefined;
}

function parseIdentifier(table: Map<string, Expression>, expression: Identifier): Expression {
    // pushLine(table, expression.loc.start.line, 'Identifier', expression.name);
    return table[expression.name] !== undefined ? parseExpression(table, JQuery.extend(true, {}, table[expression.name])) : expression;
    // return parseExpression(table, JQuery.extend(true, {}, temp));
}

// function parseLiteral(table: Map<string, Expression>, expression: Literal): Expression {
//     // pushLine(table, expression.loc.start.line, 'Literal', '', '', expression.raw);
//
// }

function parseAssignmentExpression(table: Map<string, Expression>, expression: AssignmentExpression) { //TODO Taking care of the right side
    // pushLine(table, expression.loc.start.line, 'Assignment Expression', generate(expression.left), '', generate(expression.right));
    if (expression.left.type === "Identifier") {
        table[expression.left.name] = parseExpression(table, JQuery.extend(true, {}, expression.right)); // update table for later use
        // expression.right = table[expression.left.name];
    }
}

// function parseUpdateExpression(table: Map<string, Expression>, expression: UpdateExpression) {
//     pushLine(table, expression.loc.start.line, 'Update Expression', generate(expression.argument), '', generate(expression));
// }

function parseBlockStatement(block: BlockStatement, table: Map<string, Expression>) { //TODO make a copy from table
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

function functionDeclaration(table: Map<string, Expression>, statement: FunctionDeclaration) {
    // pushLine(table, statement.loc.start.line, 'Function Declaration', statement.id.name);

    // for (const param of statement.params)
    //     pushLine(table, param.loc.start.line, 'Variable Declaration', param.name); //TODO chenge when evaluating

    substituteStatementListItem(statement.body, table);
}

function parseVariableDeclaration(statement: VariableDeclaration, table: Map<string, Expression>) {
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

function parseIfStatement(table: Map<string, Expression>, statement: IfStatement) { //TODO change for evaluation
    // pushLine(table, statement.loc.start.line, 'If Statement', '', generate(statement.test));
    statement.test = parseExpression(table, JQuery.extend(true, {}, statement.test));

    const generatedNode: string = generate(statement.test, {
        format: {semicolons: false}
    });
    statement.test['modifiedText'] = Parser.evaluate(generatedNode, {x: 1, y: 2, z: 3/*Parameters table*/}) ?
        '<markLightGreen>' + generatedNode + '</markLightGreen>' :
        '<markRed>' + generatedNode + '</markRed>';

    substituteStatementListItem(statement.consequent, table);
    if (statement.alternate !== null)
        substituteStatementListItem(statement.alternate, table);
}

function parseReturnStatement(table: Map<string, Expression>, statement: ReturnStatement) { //TODO change for evaluation
    // pushLine(table, statement.loc.start.line, 'Return Statement', '', '', statement.argument === null ? null : generate(statement.argument));
    if (statement.argument !== null)
        parseExpression(table, statement.argument);
}

function parseWhileStatement(table: Map<string, Expression>, statement: WhileStatement) {
    // pushLine(table, statement.loc.start.line, 'While Statement', '', generate(statement.test));
    substituteStatementListItem(statement.body, table);
}

function parseExpression(table: Map<string, Expression>, expression: Expression): Expression { //TODO MemberExpression
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

function parseStatementListItem3(statement: Statement, table: Map<string, Expression>) {
    if (statement.type === 'WhileStatement')
        parseWhileStatement(table, statement);
    //TODO: Consider doing 'AssignmentPattern'
}

function parseStatementListItem2(statement: Statement, table: Map<string, Expression>) {
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

export function substituteStatementListItem(statement: Statement, table: Map<string, Expression>) {
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