/* eslint-disable no-console,max-lines-per-function */
import * as esprima from 'esprima';
import {parseStatementListItem} from './parserFuncs';

export function createTable2(tableData) {
    let table = document.createElement('table');
    let tableBody = document.createElement('tbody');
    let row = document.createElement('tr');
    let titles= ['Line', 'Type', 'Name', 'Condition', 'Value'];
    titles.forEach(element => {
        let header=document.createElement('th');
        header.appendChild(document.createTextNode(element));
        row.append(header);
    });
    tableBody.append(row);
    tableData.forEach(line =>{
        let row = document.createElement('tr');
        console.log(Object.values(line));
        // Object.values(line).forEach(ce => {
        //     let cell = document.createElement('td');
        //     cell.appendChild(document.createTextNode(ce+''));
        //     row.append(cell);
        // });
        // tableBody.append(row);
        // let cell= document.createElement('td');
        // cell.appendChild(document.createTextNode(line.line));
        // row.append(cell);
        // cell = document.createElement('td');
        // cell.appendChild(document.createTextNode(line.type));
        // row.append(cell);
        // cell = document.createElement('td');
        // cell.appendChild(document.createTextNode(line.name));
        // row.append(cell);
        // cell = document.createElement('td');
        // cell.appendChild(document.createTextNode(line.condition));
        // row.append(cell);
        // cell = document.createElement('td');
        // cell.appendChild(document.createTextNode(line.value));
        // row.append(cell);
        let lineNum = document.createElement('td');
        lineNum.appendChild(document.createTextNode(line.line));
        row.append(lineNum);

        let typeData = document.createElement('td');
        typeData.appendChild(document.createTextNode(line.type));
        row.append(typeData);

        let nameData = document.createElement('td');
        nameData.appendChild(document.createTextNode(line.name));
        row.append(nameData);

        let conditionData = document.createElement('td');
        conditionData.appendChild(document.createTextNode(line.condition));
        row.append(conditionData);

        let valueData = document.createElement('td');
        valueData.appendChild(document.createTextNode(line.value));
        row.append(valueData);

        tableBody.append(row);
    });
    document.body.appendChild(table);
}


export function createTable(tableData) {
    let table = document.createElement('table');
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
        let row = document.createElement('tr');

        Object.values(rowData).forEach(cell => {
            let lineNum = document.createElement('td');
            lineNum.appendChild(document.createTextNode(cell));
            row.append(lineNum);
        });

        // let lineNum = document.createElement('td');
        // lineNum.appendChild(document.createTextNode(rowData.line));
        // row.append(lineNum);
        //
        // let typeData = document.createElement('td');
        // typeData.appendChild(document.createTextNode(rowData.type));
        // row.append(typeData);
        //
        // let nameData = document.createElement('td');
        // nameData.appendChild(document.createTextNode(rowData.name));
        // row.append(nameData);
        //
        // let conditionData = document.createElement('td');
        // conditionData.appendChild(document.createTextNode(rowData.condition));
        // row.append(conditionData);
        //
        // let valueData = document.createElement('td');
        // valueData.appendChild(document.createTextNode(rowData.value));
        // row.append(valueData);



        // rowData.forEach(cellData => {
        //     var cell = document.createElement('td');
        //     cell.appendChild(document.createTextNode(cellData));
        //     row.appendChild(cell);
        // });

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    document.body.appendChild(table);
    // var div = document.getElementById('div1');
    // div.appendChild(table);
}

export const parseCode = codeToParse => {
    let parsedCode = esprima.parseScript(codeToParse, {loc: true});
    let elementTable = [];
    parsedCode.body.forEach(statement => parseStatementListItem(statement, elementTable));
    console.log(elementTable);
    createTable(elementTable);
    return parsedCode;
};