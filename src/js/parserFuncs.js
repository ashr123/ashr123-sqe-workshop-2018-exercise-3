import {generate} from 'escodegen';

function pushLine(table, line, type, name = '', condition = '', value = '') {
    table.push({line: line, type: type, name: name, condition: condition, value: value});
}

function parseIdentifier(table, expression) {
    pushLine(table, expression.loc.start.line, 'Identifier', expression.name);
}

function parseLiteral(table, expression) {
    pushLine(table, expression.loc.start.line, 'Literal', '', '', expression.raw);
}

function parseAssignmentExpression(table, expression) {
    pushLine(table, expression.loc.start.line, 'Assignment Expression', expression.left.name, '', generate(expression.right));
}

function parseUpdateExpression(table, expression) {
    pushLine(table, expression.loc.start.line, 'Update Expression', generate(expression.argument), '', generate(expression));
}

function parseExpression(table, expression) {
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

function parseBlockStatement(statement, table) {
    statement.body.forEach(expressionStatement => parseStatementListItem(expressionStatement, table));
}

function functionDeclaration(table, statement) {
    pushLine(table, statement.loc.start.line, 'Function Declaration', statement.id.name);
    statement.params.forEach(param => pushLine(table, param.loc.start.line, 'Variable Declaration', param.name));
    parseStatementListItem(statement.body, table);
}

function parseVariableDeclaration(statement, table) {
    statement.declarations.forEach(decl => pushLine(table, decl.loc.start.line, 'Variable Declaration', decl.id.name, '', decl.init === null ? null : generate(decl.init)));
}

function parseBreakStatement(table, statement) {
    pushLine(table, statement.loc.start.line, 'Break Statement');
}

function parseForStatement(statement, table) {
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

function parseIfStatement(table, statement) {
    pushLine(table, statement.loc.start.line, 'If Statement', '', generate(statement.test));
    parseStatementListItem(statement.consequent, table);
    if (statement.alternate !== null) {
        pushLine(table, statement.alternate.loc.start.line, 'else');
        parseStatementListItem(statement.alternate, table);
    }
}

function parseReturnStatement(table, statement) {
    pushLine(table, statement.loc.start.line, 'Return Statement', '', '', statement.argument === null ? null : generate(statement.argument));
}

function parseWhileStatement(table, statement) {
    pushLine(table, statement.loc.start.line, 'While Statement', '', generate(statement.test));
    parseStatementListItem(statement.body, table);
}

function parseStatementListItem3(statement, table) {
    if (statement.type === 'WhileStatement')
        parseWhileStatement(table, statement);
}

function parseStatementListItem2(statement, table) {
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

export function parseStatementListItem(statement, table) {
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
    return table;
}