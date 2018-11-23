import $ from 'jquery';
import * as codeAnalyzer from './code-analyzer';

function createTable(tableData) {
    let table = document.createElement('table'), tableBody = document.createElement('tbody'), row = document.createElement('tr'), titles = ['Line', 'Type', 'Name', 'Condition', 'Value'];
    table.border = 1;
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
    table.appendChild(tableBody); $('#myTable').empty(); $('#myTable').append(table);
}

$(document).ready(() => {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = codeAnalyzer.parseCode(codeToParse);
        createTable(parsedCode.table);
        $('#parsedCode').val(JSON.stringify(parsedCode.code, null, 2));
    });
});