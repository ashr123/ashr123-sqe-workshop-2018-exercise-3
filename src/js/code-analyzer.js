import {parseScript} from 'esprima';
// import {parseStatementListItem} from './parserFuncsExp';
import {removeUndefinedElements, substituteStatementListItem} from './simbolicSubsExp';


export const parseCode = codeToParse => {
    const parsedCode = parseScript(codeToParse, {loc: true}),
        // elementTable = [],
        varTable = {};
    let i = 0;
    for (const statement of parsedCode.body) {
        substituteStatementListItem(statement, varTable);
        if (statement.type === 'VariableDeclaration' ||
            (statement.type === 'ExpressionStatement' &&
                statement.expression.type === 'AssignmentExpression'))
            delete parsedCode.body[i];
        i++;
    }
    removeUndefinedElements(parsedCode.body);
    // console.log(elementTable);

    return parsedCode;
};