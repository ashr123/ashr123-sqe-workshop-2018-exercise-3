import * as esprima from 'esprima';
import {parseStatementListItem} from './parserFuncsExp';
import {substituteStatementListItem} from './simbolicSubsExp';


export const parseCode = codeToParse => {
    const parsedCode = esprima.parseScript(codeToParse, {loc: true}),
        elementTable = [];
    for (const statement of parsedCode.body)
        parseStatementListItem(statement, elementTable);
    let varTable = {};
    for (let statement of parsedCode.body)
        substituteStatementListItem(statement, varTable);
    // console.log(elementTable);

    return {code: parsedCode, table: elementTable};
};