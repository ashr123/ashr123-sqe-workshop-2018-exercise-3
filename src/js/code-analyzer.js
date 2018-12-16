import {parseScript} from 'esprima';
import {initParams, removeUndefinedElements, substituteStatementListItem} from './simbolicSubsExp';

export const parseCode = (codeToParse, params) => {
    const parsedCode = parseScript(codeToParse, {loc: true}),
        varTable = {};
    initParams(params);
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