import * as esprima from 'esprima';
import {parseStatementListItem} from './parserFuncsExp';

export const parseCode = codeToParse => {
    const parsedCode = esprima.parseScript(codeToParse, {loc: true}),
        elementTable = [];
    for (const statement of parsedCode.body)
        parseStatementListItem(statement, elementTable);
    // console.log(elementTable);
    return {code: parsedCode, table: elementTable};
};