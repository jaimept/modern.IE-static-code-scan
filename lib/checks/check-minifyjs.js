/**
 * Description: Look for the presence of JavaScript Minify
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
    promised = require("promised-io/promise"),
    Deferred = require('promised-io').Deferred,
    url = require('url'),
    fs = require('fs');  /****** added ******/

function check(website) {
    var deferred = new Deferred(),
        test = {
            testName: "minifyjs",
            passed: false
        };

    var jsLinks = website.$('script');

    for (var i = 0; i < jsLinks.length; i++) {
        var jsHref = jsLinks[i].attribs.src,
            jsUrl;

        if (jsHref) {
            jsUrl = url.resolve(website.url, jsHref);
            console.log('Entrada....: ' + jsUrl);
            // var content = fs.readFileSync(jsUrl, 'utf8');  // NO FUNCIONA :-(
            // --------------------------------------------------------------------------
            var content = fs.readFileSync('static\\' + jsHref, 'utf8');
            if ((content.length / content.match(/\s+/g).length) > 30) test.passed = true;
            else {
                test.passed = false;
                break;
            }

            var lines = content.split(/\r?\n/);
            if ((content.length / lines.length) < 150) {
                test.passed = false;
                break;
            }
            console.log('C/L = ' + content.length/lines.length);
            // console.log(content);
        }
    }

    deferred.resolve(test); /****** added ******/
    return deferred.promise;
}

// module.exports.loadjsFiles = check;
module.exports.check = check;  /****** changed ******/