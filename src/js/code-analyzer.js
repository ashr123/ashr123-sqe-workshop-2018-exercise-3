/* eslint-disable no-console */
import * as esprima from 'esprima';
import {parseStatementListItem} from './parserFuncs';

export const parseCode = codeToParse => {
    let parsedCode = esprima.parseScript(codeToParse, {loc: true});
    let elementTable = [];
    parsedCode.body.forEach(statement => parseStatementListItem(statement, elementTable));
    console.log(elementTable);
    return {code: parsedCode, table: elementTable};
};