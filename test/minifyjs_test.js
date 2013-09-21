/**
 * Description: Test detection of JavaScript Minify.
 *
 * Copyright (c) Microsoft Corporation; All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * THIS CODE IS PROVIDED AS IS BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER
 * EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS
 * OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT.
 *
 * See the Apache Version 2.0 License for specific language governing permissions
 * and limitations under the License.
 */

"use strict";

var minifyjs = require('../lib/checks/check-minifyjs.js'),
    url = require('url'),
    request = require('request'),
    cheerio = require('cheerio'),
    testServer = require('../static/test-server.js'),
    testUrl = 'http://localhost:' + testServer.port + '/minifyjs-';


function checkPage(page, expected) {
    return function (test) {
        var uri = page.indexOf('http') === 0 ? page : testUrl + page,
            tests = 1;

        if (expected.data) {
            tests += Object.keys(expected.data).length;
        }


        test.expect(tests);

        request(uri, function (error, response, content) {
            var website = {
                url: url.parse(uri),
                content: content,
                $: cheerio.load(content)
            };

            minifyjs.check(website).then(function (result) {
                test.equal(result.passed, expected.passed, uri + " passed: " + result.passed + " !== " + expected.passed);
                if (expected.data) {
                    for (var key in expected.data) {
                        test.equal(result.data[key], expected.data[key], uri + " key: " + result.data[key] + " !== " + expected.data[key]);
                    }
                }
                test.done();
            });
        });
    };
}

module.exports['Minifyjs'] = {
    'JQuery no minify': checkPage('1.html', {
        passed: false,
    }),
    'jQuery minify': checkPage('2.html', {
        passed: true,
    }),
    'mootools no minify': checkPage('3.html', {
            passed: false,
     }),
    'mootools minify': checkPage('4.html', {
        passed: true,
    }),
    'JQuery UI no minify': checkPage('5.html', {
        passed: false,
    }),
    'JQuery minify': checkPage('6.html', {
        passed: true,
    }),
    'modernizr no minify': checkPage('7.html', {
        passed: false,
    }),
    'modernizr minify': checkPage('8.html', {
        passed: true,
    }),
    'JQuery no minify & modernizr minify': checkPage('9.html', {
        passed: false,
    }),
    'modernizr minify & JQuery no minify': checkPage('10.html', {
        passed: false,
    }),
};