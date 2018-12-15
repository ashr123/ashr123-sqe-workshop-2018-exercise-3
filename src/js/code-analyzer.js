import {parseScript} from 'esprima';
import {removeUndefinedElements, substituteStatementListItem} from './simbolicSubsExp';

export const parseCode = codeToParse => {
    const parsedCode = parseScript(codeToParse, {loc: true}),
        varTable = {};
    for (const i in parsedCode.body) {
        substituteStatementListItem(parsedCode.body[i], varTable);
        if (parsedCode.body[i].type === 'VariableDeclaration' ||
            (parsedCode.body[i].type === 'ExpressionStatement' &&
                parsedCode.body[i].expression.type === 'AssignmentExpression'))
            delete parsedCode.body[i];
    }
    removeUndefinedElements(parsedCode.body);
    return parsedCode;
};