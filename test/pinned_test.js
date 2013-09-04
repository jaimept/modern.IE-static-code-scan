/**
 * Description: Test detection of IE10 favicon meta tags.
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

var pinned = require('../lib/checks/check-pinned.js'),
    url = require('url'),
    request = require('request'),
    cheerio = require('cheerio'),
    testServer = require('../static/test-server.js'),
    testUrl = 'http://localhost:' + testServer.port + '/pinned-';


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

            pinned.check(website).then(function (result) {
                test.equal(result.passed, expected.passed, uri + " passed: " + result.passed + " !== " + expected.passed);
                if (expected.data) {
                    for(var key in expected.data){
                        test.equal(result.data[key], expected.data[key], uri + " key: " + result.data[key] + " !== " + expected.data[key]);
                    }
                }
                test.done();
            });
        });
    };
}

module.exports['Pinned'] = {
    'No Pinned': checkPage('1.html', {
        passed: false,
        data: {
            tile1: false,
            tile2: false,
            tile3: false,
            tile4: false
        }}),
    'Pinned HTML full tiled': checkPage('2.html', {
        passed: true,
        data: {
            tile1: true,
            tile2: true,
            tile3: true,
            tile4: true
        }}),
    'Pinned HTML Tile1': checkPage('3.html', {
        passed: true,
        data: {
            tile1: true,
            tile2: false,
            tile3: false,
            tile4: false
        }}),
    'Pinned HTML Tile2': checkPage('4.html', {
        passed: true,
        data: {
            tile1: false,
            tile2: true,
            tile3: false,
            tile4: false
        }}),
    'Pinned HTML Tile3': checkPage('5.html', {
        passed: true,
        data: {
            tile1: false,
            tile2: false,
            tile3: true,
            tile4: false
        }}),
    'Pinned HTML Tile4': checkPage('6.html', {
        passed: true,
        data: {
            tile1: false,
            tile2: false,
            tile3: false,
            tile4: true
        }})
};