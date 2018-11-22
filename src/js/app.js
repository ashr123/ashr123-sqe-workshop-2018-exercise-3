import $ from 'jquery';
import * as codeAnalyzer from './code-analyzer';

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
    $('#myTable').empty();
    $('#myTable').append(table);
}

$(document).ready(() => {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = codeAnalyzer.parseCode(codeToParse);
        createTable(parsedCode.table);
        $('#parsedCode').val(JSON.stringify(parsedCode.code, null, 2));
    });
});