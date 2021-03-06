/**
 * Description: Look for the presence of IE11 Live Tiles in XML meta tags.
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

var request = require('request'),
    $ = require('cheerio'),
    Deferred = require('promised-io').Deferred,
    uri_xml = '';

var check = function (website) {
    var deferred = new Deferred();

    var m = website.$('meta[name="msapplication-config"]'),
        test = {
            testName: "pinnedxml2",
            passed: false,
            data: {
                square70: false,
                square150: false,
                wide310: false,
                square310: false
            }
        };

    if (m.length > 0) {
        var content = $(m[0]).attr('content');
        // uri_xml = website.url.resolve(content);
        uri_xml = website.url.host;
        uri_xml = website.url.protocol + '//' + uri_xml + '/' + content;
        console.log('uri xml = ' + uri_xml);

    }
    else {
        // uri_xml = website.url.resolve('browserConfig.xml');
        uri_xml = website.url.host;
        uri_xml = website.url.protocol + '//' + uri_xml + '/' + 'browserConfig.xml';
        console.log('uri xml = ' + uri_xml);
    }

    request(uri_xml, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            response.on('error', function (e) {
                console.log('loading XML' + e);
            });
            if (body.indexOf('square70x70') !== -1) {
                //passes the test and the square70x70 part
                test.passed = true;
                test.data.square70 = true;
            }
            else {
                console.log('FAIL square70');
                test.data.square70 = false;
            }
            if (body.indexOf('square150x150') !== -1) {
                //passes the test and the square150x150 part
                test.passed = true;
                test.data.square150 = true;
            }
            else {
                console.log('FAIL square150');
                test.data.square150 = false;
            }
            if (body.indexOf('wide310x150') !== -1) {
                //passes the test and the wide310x150 part
                test.passed = true;
                test.data.wide310 = true;
            }
            else {
                console.log('FAIL wide310');
                test.data.wide310 = false;
            }
            if (body.indexOf('square310x310') !== -1) {
                //passes the test and the square310x310 part
                test.passed = true;
                test.data.square310 = true;
            }
            else {
                console.log('FAIL square310');
                test.data.square310 = false;
            }

            deferred.resolve(test);
        }
        else {
            console.log('ERROR = ', error);
            console.log(website.url.path, ' -> FAIL square70, square150, wide310 and square310');
            test.passed = false;
            test.data.square70 = false;
            test.data.square150 = false;
            test.data.wide310 = false;
            test.data.square310 = false;
            deferred.resolve(test);
        }
    });

    // deferred.resolve(test);

    return deferred.promise;
};

module.exports.check = check;