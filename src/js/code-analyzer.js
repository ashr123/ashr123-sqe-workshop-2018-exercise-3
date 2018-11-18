/* eslint-disable */
import * as esprima from 'esprima';
import {parseStatementListItem} from './parserFuncsExp'

export const parseCode = codeToParse => {
    let parsedCode = esprima.parseScript(codeToParse, {loc: true});
    let ElementTable = [];
    parsedCode.body.forEach(statement => parseStatementListItem(statement, ElementTable));
    console.log(ElementTable);
    return parsedCode;
};