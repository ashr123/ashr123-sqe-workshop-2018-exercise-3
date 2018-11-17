"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseStatementListItem(statement, table) {
    function pushLine(line, type, name = '', condition = '', value = '') {
        table.push({ line: line, type: type, name: name, condition: condition, value: value });
    }
    switch (statement.type) {
        case 'FunctionDeclaration':
            pushLine(statement.id.loc.start.line, 'Function Declaration', statement.id.name);
            statement.params.forEach(param => pushLine(param.loc.start.line, 'variable declaration', param.name));
            statement.body.body.forEach(expressionStatement => parseStatementListItem(expressionStatement, table));
            break;
        case 'VariableDeclaration':
            statement.declarations.forEach(decl => {
            });
            break;
    }
    return table;
}
exports.parseStatementListItem = parseStatementListItem;
//# sourceMappingURL=parserFuncs.js.map