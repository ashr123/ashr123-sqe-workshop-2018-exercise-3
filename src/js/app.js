import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {generate} from 'escodegen';

// eslint-disable-next-line max-lines-per-function
// function createTable(tableData) {
//     const table = document.createElement('table'), tableBody = document.createElement('tbody');
//     let row = document.createElement('tr');
//     table.border = 1;
//     for (const element of ['Line', 'Type', 'Name', 'Condition', 'Value']) {
//         const header = document.createElement('th');
//         header.appendChild(document.createTextNode(element));
//         row.appendChild(header);
//     }
//     tableBody.appendChild(row);
//     for (const rowData of tableData) {
//         row = document.createElement('tr');
//         for (const cell of Object.values(rowData)) {
//             const data = document.createElement('td');
//             data.appendChild(document.createTextNode(cell));
//             row.appendChild(data);
//         }
//         tableBody.appendChild(row);
//     }
//     table.appendChild(tableBody);
//     $('#myTable').empty();
//     $('#myTable').append(table);
// }

$(document).ready(() => {
    $('#codeSubmissionButton').click(() => {
        const codeToParse = $('#codePlaceholder').val(),
            parsedCode = parseCode(codeToParse);
        // createTable(parsedCode.table);
        $('#myTable').append(generate(parsedCode, {format: {newline: '<br>'}, verbatim: 'modifiedText'}));
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});