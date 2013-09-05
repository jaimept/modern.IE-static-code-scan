/**
 * Description: Look for the presence of a tile meta tag for IE10 and Win8.
 * Note if a Retina icon for iOS devices has been specified so it can be reused.
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

var request = require('request');
var Deferred = require('promised-io').Deferred;

var check = function (website) {
    var deferred = new Deferred();

    var xml = website.$('meta[name="msapplication-config"]'),
        test = {
            testName:"pinnedxml",
            passed:false,
            data: {
                square70: false,
                square150: false,
                wide310: false,
                square310: false
            }
        };

    if (xml.length > 0) {
        // var url = window.location.href;
        // var url = request.url;
        var url = website.url;
        var path = url.substring(0, url.lastIndexOf('/') + 1);
        url = path.concat('IEconfig.xml');
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                if (body.indexOf('square70x70') !== -1) {
                    //passes the test and the square70x70 part
                    test.passed = true;
                    test.data.square70 = true;
                }
            }
            else
                test.passed = false;
        });
    }

    deferred.resolve(test);

    return deferred.promise;
};

module.exports.check = check;