import * as esprima from 'esprima';
import {parseStatementListItem} from './parserFuncsExp';
import {substituteStatementListItem, removeUndefinedElements} from './simbolicSubsExp';


export const parseCode = codeToParse => {
    const parsedCode = esprima.parseScript(codeToParse, {loc: true}),
        elementTable = [];
    for (const statement of parsedCode.body)
        parseStatementListItem(statement, elementTable);
    let varTable = {}, i=0;
    for (const statement of parsedCode.body){
        substituteStatementListItem(statement, varTable);
        if (statement.type === 'VariableDeclaration')
            delete parsedCode.body[i];
        i++;
    }
    removeUndefinedElements(parsedCode.body);
    // console.log(elementTable);

    return {code: parsedCode, table: elementTable};
};