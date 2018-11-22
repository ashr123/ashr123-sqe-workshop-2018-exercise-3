import $ from 'jquery';
import * as codeAnalyzer from './code-analyzer';
import {createTable} from './code-analyzer';

$(document).ready(() => {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = codeAnalyzer.parseCode(codeToParse);
        createTable(parsedCode.table);
        $('#parsedCode').val(JSON.stringify(parsedCode.code, null, 2));
    });
});