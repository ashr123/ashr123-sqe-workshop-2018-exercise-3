import * as JQuery from 'jquery';
import {generate} from 'escodegen';
import {
    AssignmentExpression, BinaryExpression,
    BlockStatement,
    Expression,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    Literal,
    MemberExpression,
    ReturnStatement,
    Statement,
    VariableDeclaration,
    WhileStatement
} from './programInterfaces';

function parseBinaryExpression(table: Map<string, Expression>, right: BinaryExpression): Expression {
    return undefined;
}

function simbolicSubstitute(table: Map<string, Expression>, right: Expression): Expression {
    switch (right.type) {
        case 'Identifier':
            return parseIdentifier(table, right);
        case 'Literal':
            return right;
        case 'BinaryExpression':
            return parseBinaryExpression(table, right);
    }
}

// function pushLine(table: Map<string, Expression>, line: number,
//                   type: string,
//                   name: string = '',
//                   condition: string = '',
//                   value: string = '') {
//     table.push({line: line, type: type, name: name, condition: condition, value: value});
// }

function parseMemberExpression(table: Map<string, Expression>, member: MemberExpression): Expression {

}

function parseIdentifier(table: Map<string, Expression>, expression: Identifier): Expression {
    // pushLine(table, expression.loc.start.line, 'Identifier', expression.name);
    return table[expression.name] !== undefined ? table[expression.name] : expression;
}

// function parseLiteral(table: Map<string, Expression>, expression: Literal): Expression {
//     // pushLine(table, expression.loc.start.line, 'Literal', '', '', expression.raw);
//
// }

function parseAssignmentExpression(table: Map<string, Expression>, expression: AssignmentExpression) {
    // pushLine(table, expression.loc.start.line, 'Assignment Expression', generate(expression.left), '', generate(expression.right));
    if (expression.left.type === "Identifier")
        table[expression.left.name] = simbolicSubstitute(table, expression.right)
}

// function parseUpdateExpression(table: Map<string, Expression>, expression: UpdateExpression) {
//     pushLine(table, expression.loc.start.line, 'Update Expression', generate(expression.argument), '', generate(expression));
// }

function parseExpression(table: Map<string, Expression>, expression: Expression) { //TODO MemberExpression
    switch (expression.type) {
        case 'Identifier':
            parseIdentifier(table, expression);
            break;
        case 'Literal':
            parseLiteral(table, expression);
            break;
        case 'AssignmentExpression':
            parseAssignmentExpression(table, expression);
            break;
        case 'MemberExpression':
            return parseMemberExpression(table, expression);
        case 'BinaryExpression':
            return parseBinaryExpression(table, right);
        // case 'UpdateExpression':
        //     parseUpdateExpression(table, expression);
    }
}

function parseBlockStatement(statement: BlockStatement, table: Map<string, Expression>) { //TODO make a copy from table
    for (const expressionStatement of statement.body)
        parseStatementListItem(expressionStatement, JQuery.extend(true, {}, table))
}

function functionDeclaration(table: Map<string, Expression>, statement: FunctionDeclaration) {
    // pushLine(table, statement.loc.start.line, 'Function Declaration', statement.id.name);

    // for (const param of statement.params)
    //     pushLine(table, param.loc.start.line, 'Variable Declaration', param.name); //TODO chenge when evaluating

    parseStatementListItem(statement.body, table);
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
//             parseStatementListItem(statement.init, table) :
//             parseExpression(table, statement.init);
//     if (statement.update !== null)
//         parseExpression(table, statement.update);
//     parseStatementListItem(statement.body, table);
// }

function parseIfStatement(table: Map<string, Expression>, statement: IfStatement) { //TODO change for evaluation
    // pushLine(table, statement.loc.start.line, 'If Statement', '', generate(statement.test));
    // parseStatementListItem(statement.consequent, table);
    // if (statement.alternate !== null) {
    //     if (statement.alternate.type === 'IfStatement')
    //         pushLine(table, statement.alternate.loc.start.line, 'else');
    //     parseStatementListItem(statement.alternate, table);
    // }
}

function parseReturnStatement(table: Map<string, Expression>, statement: ReturnStatement) { //TODO change for evaluation
    // pushLine(table, statement.loc.start.line, 'Return Statement', '', '', statement.argument === null ? null : generate(statement.argument));
}

function parseWhileStatement(table: Map<string, Expression>, statement: WhileStatement) {
    // pushLine(table, statement.loc.start.line, 'While Statement', '', generate(statement.test));
    parseStatementListItem(statement.body, table);
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

export function parseStatementListItem(statement: Statement, table: Map<string, Expression>) {
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
            parseExpression(table, statement.expression);
            break;
        default:
            parseStatementListItem2(statement, table);
    }
}