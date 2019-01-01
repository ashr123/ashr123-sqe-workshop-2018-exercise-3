/* eslint-disable max-lines-per-function */
import $ from 'jquery';
import {parseScript} from 'esprima';
// import {parseCode} from './code-analyzer';
import * as d3graphviz from 'd3-graphviz';
const esgraph = require('esgraph');

$(document).ready(() => {
    $('#codeSubmissionButton').click(() => {
        // const parsedCode = parseCode($('#codePlaceholder').val(), $('#paramInput').val());
        const cfg = esgraph(parseScript($('#codePlaceholder').val(), {range: true}).body[0].body);
        d3graphviz.graphviz('#diagram').renderDot('digraph G {' + esgraph.dot(cfg) + '}');


        // $('#myTable').empty().append(generate(parsedCode, {format: {newline: '<br>'}, verbatim: 'modifiedText'}));
        // $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));

    });
});