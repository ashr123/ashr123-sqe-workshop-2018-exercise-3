interface line {
    line: number,
    type: string,
    name: string,
    condition: string,
    value: string
}

export function parseStatementListItem(statement, table: line[]) {
    function pushLine(line: number,
                      type: string,
                      name: string = '',
                      condition: string = '',
                      value: string = ''): void {
        table.push({line: line, type: type, name: name, condition: condition, value: value});
    }

    switch (statement.type) {
        case 'FunctionDeclaration':
            pushLine(statement.id.loc.start.line, 'Function Declaration', statement.id.name);
            statement.params.forEach(param => pushLine(param.loc.start.line,
                'variable declaration', param.name));
            statement.body.body.forEach(expressionStatement => parseStatementListItem(expressionStatement, table));
            break;
        case 'VariableDeclaration':
            statement.declarations.forEach(decl => {

            });
            break;
    }
    return table
}