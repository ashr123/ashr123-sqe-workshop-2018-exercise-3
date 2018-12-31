import {parseScript} from 'esprima';
import {initParams, removeUndefinedElements, substituteStatementListItem} from './simbolicSubsExp';

export const parseCode = (codeToParse, params) => {//TODO read all VariableDecleration statements and then handle the rest
    const parsedCode = parseScript(codeToParse),
        varTable = new Map(),
        verticesTable = [],
        edgesTable = [];
    initParams(params);
    for (const i in parsedCode.body) {
        substituteStatementListItem(varTable, parsedCode.body[i], verticesTable, edgesTable);
        if (parsedCode.body[i].type === 'VariableDeclaration' ||
            (parsedCode.body[i].type === 'ExpressionStatement' &&
                parsedCode.body[i].expression.type === 'AssignmentExpression'))
            delete parsedCode.body[i];
    }
    removeUndefinedElements(parsedCode.body);
    return parsedCode;
};