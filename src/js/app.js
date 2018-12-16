import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {generate} from 'escodegen';

$(document).ready(() => {
    $('#codeSubmissionButton').click(() => {
        const parsedCode = parseCode($('#codePlaceholder').val(), $('#paramInput').val());
        $('#myTable').empty().append(generate(parsedCode, {format: {newline: '<br>'}, verbatim: 'modifiedText'}));
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});