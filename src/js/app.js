import $ from 'jquery';
import * as codeAnalyzer from './code-analyzer';

$(document).ready(() => {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = codeAnalyzer.parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});