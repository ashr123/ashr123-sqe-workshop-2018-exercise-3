/* eslint-disable max-lines-per-function */
import $ from 'jquery';
// import {parseCode} from './code-analyzer';
import * as flowchart from 'flowchart.js';

$(document).ready(() => {
    $('#codeSubmissionButton').click(() => {
        // const parsedCode = parseCode($('#codePlaceholder').val(), $('#paramInput').val());


        const diagram = flowchart.parse($('#codePlaceholder').val());
        diagram.drawSVG('diagram');

        // you can also try to pass options:

        diagram.drawSVG('diagram', {
            'x': 0,
            'y': 0,
            'line-width': 3,
            'line-length': 50,
            'text-margin': 10,
            'font-size': 14,
            'font-color': 'black',
            'line-color': 'black',
            'element-color': 'black',
            'fill': 'white',
            'yes-text': 'yes',
            'no-text': 'no',
            'arrow-end': 'block',
            'scale': 1,
            // style symbol types
            'symbols': {
                'start': {
                    'font-color': 'red',
                    'element-color': 'green',
                    'fill': 'yellow'
                },
                'end': {
                    'class': 'end-element'
                }
            },
            // even flowstate support ;-)
            'flowstate': {
                'past': {'fill': '#CCCCCC', 'font-size': 12},
                'current': {'fill': 'yellow', 'font-color': 'red', 'font-weight': 'bold'},
                'future': {'fill': '#FFFF99'},
                'request': {'fill': 'blue'},
                'invalid': {'fill': '#444444'},
                'approved': {'fill': '#58C4A3', 'font-size': 12, 'yes-text': 'APPROVED', 'no-text': 'n/a'},
                'rejected': {'fill': '#C45879', 'font-size': 12, 'yes-text': 'n/a', 'no-text': 'REJECTED'}
            }
        });


        // $('#myTable').empty().append(generate(parsedCode, {format: {newline: '<br>'}, verbatim: 'modifiedText'}));
        // $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));

    });
});