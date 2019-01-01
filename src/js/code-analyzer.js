import {parseScript} from 'esprima';
import {initParams, substituteStatementListItem} from './simbolicSubsExp';

export const parseCode = (codeToParse, params) => {
    const parsedCode = parseScript(codeToParse),
        varTable = new Map(),
        verticesTable = [],
        edgesTable = [];
    initParams(params);
    for (const i in parsedCode.body)
        { // noinspection JSUnfilteredForInLoop
            substituteStatementListItem(varTable, parsedCode.body[i], verticesTable, edgesTable);
        }
    return parsedCode;
};