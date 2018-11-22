/* eslint-disable no-console */
import * as esprima from 'esprima';
import {parseStatementListItem} from './parserFuncs';

// eslint-disable-next-line max-lines-per-function
export function createTable(tableData) {
    let table = document.createElement('table');
    table.border = 1;
    let tableBody = document.createElement('tbody');
    let row = document.createElement('tr');
    let titles = ['Line', 'Type', 'Name', 'Condition', 'Value'];
    titles.forEach(element => {
        let header = document.createElement('th');
        header.appendChild(document.createTextNode(element));
        row.append(header);
    });
    tableBody.append(row);
    tableData.forEach(rowData => {
        row = document.createElement('tr');
        Object.values(rowData).forEach(cell => {
            let data = document.createElement('td');
            data.appendChild(document.createTextNode(cell));
            row.append(data);
        });
        tableBody.appendChild(row);
    });
    table.appendChild(tableBody);
    document.body.appendChild(table);
}

export const parseCode = codeToParse => {
    let parsedCode = esprima.parseScript(codeToParse, {loc: true});
    let elementTable = [];
    parsedCode.body.forEach(statement => parseStatementListItem(statement, elementTable));
    console.log(elementTable);
    return {code: parsedCode, table: elementTable};
};