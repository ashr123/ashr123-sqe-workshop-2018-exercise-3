import {parseScript} from 'esprima';
import {init, substituteStatementListItem} from './simbolicSubsExp';

export const parseCode = (codeToParse, params) => {
    const parsedCode = parseScript(codeToParse),
        verticesCounter = makeCounter('vertices'),
        edgesCounter = makeCounter('edge'),
        varTable = new Map(),
        verticesTable = [],
        edgesTable = [];
    init(params);
    for (const i in parsedCode.body) { // noinspection JSUnfilteredForInLoop
        substituteStatementListItem(varTable, parsedCode.body[i], verticesTable, edgesTable);
    }
    return parsedCode;
};