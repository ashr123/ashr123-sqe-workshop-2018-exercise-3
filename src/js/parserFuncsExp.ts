import {generate} from 'escodegen';
import {
    AssignmentExpression,
    BlockStatement,
    BreakStatement,
    Expression,
    ForStatement,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    Line,
    Literal,
    ReturnStatement,
    Statement,
    UpdateExpression,
    VariableDeclaration,
    WhileStatement
} from './programInterfaces';

function pushLine(table: Line[], line: number,
                  type: string,
                  name: string = '',
                  condition: string = '',
                  value: string = '') {
    table.push({line: line, type: type, name: name, condition: condition, value: value});
}

function parseIdentifier(table: Line[], expression: Identifier) {
    pushLine(table, expression.loc.start.line, 'Identifier', expression.name);
}

function parseLiteral(table: Line[], expression: Literal) {
    pushLine(table, expression.loc.start.line, 'Literal', '', '', expression.raw);
}

function parseAssignmentExpression(table: Line[], expression: AssignmentExpression) {
    pushLine(table, expression.loc.start.line, 'Assignment Expression', generate(expression.left), '', generate(expression.right));
}

function parseUpdateExpression(table: Line[], expression: UpdateExpression) {
    pushLine(table, expression.loc.start.line, 'Update Expression', generate(expression.argument), '', generate(expression));
}

function parseExpression(table: Line[], expression: Expression) {
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
        case 'UpdateExpression':
            parseUpdateExpression(table, expression);
    }
}

function parseBlockStatement(statement: BlockStatement, table: Line[]) {
    for (const expressionStatement of statement.body)
        parseStatementListItem(expressionStatement, table);
}

function functionDeclaration(table: Line[], statement: FunctionDeclaration) {
    pushLine(table, statement.loc.start.line, 'Function Declaration', statement.id.name);
    for (const param of statement.params)
        pushLine(table, param.loc.start.line, 'Variable Declaration', param.name);
    parseStatementListItem(statement.body, table);
}

function parseVariableDeclaration(statement: VariableDeclaration, table: Line[]) {
    for (const decl of statement.declarations)
        pushLine(table, decl.loc.start.line, 'Variable Declaration', decl.id.name, '', decl.init === null ? null : generate(decl.init));
}

function parseBreakStatement(table: Line[], statement: BreakStatement) {
    pushLine(table, statement.loc.start.line, 'Break Statement');
}

function parseForStatement(statement: ForStatement, table: Line[]) {
    if (statement.test !== null)
        pushLine(table, statement.loc.start.line, 'For Statement', '', generate(statement.test));
    if (statement.init !== null)
        statement.init.type === 'VariableDeclaration' ?
            parseStatementListItem(statement.init, table) :
            parseExpression(table, statement.init);
    if (statement.update !== null)
        parseExpression(table, statement.update);
    parseStatementListItem(statement.body, table);
}

function parseIfStatement(table: Line[], statement: IfStatement) {
    pushLine(table, statement.loc.start.line, 'If Statement', '', generate(statement.test));
    parseStatementListItem(statement.consequent, table);
    if (statement.alternate !== null) {
        if (statement.alternate.type === 'IfStatement')
            pushLine(table, statement.alternate.loc.start.line, 'else');
        parseStatementListItem(statement.alternate, table);
    }
}

function parseReturnStatement(table: Line[], statement: ReturnStatement) {
    pushLine(table, statement.loc.start.line, 'Return Statement', '', '', statement.argument === null ? null : generate(statement.argument));
}

function parseWhileStatement(table: Line[], statement: WhileStatement) {
    pushLine(table, statement.loc.start.line, 'While Statement', '', generate(statement.test));
    parseStatementListItem(statement.body, table);
}

function parseStatementListItem3(statement: Statement, table: Line[]) {
    if (statement.type === 'WhileStatement')
        parseWhileStatement(table, statement);
}

function parseStatementListItem2(statement: Statement, table: Line[]) {
    switch (statement.type) {
        case 'BreakStatement':
            parseBreakStatement(table, statement);
            break;
        case 'ForStatement':
            parseForStatement(statement, table);
            break;
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

export function parseStatementListItem(statement: Statement, table: Line[]) {
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