/**
 * Description: Look for the presence of IE11 Live Tiles meta tags.
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

var // request = require('request'),
    Deferred = require('promised-io').Deferred;

var check = function (website) {
    var deferred = new Deferred();

    var test = {
            testName:"spritedcss",
            passed:false,
            data: {
            }
    };
    var cssTags = website.$('style');

    // console.log(website.$('style'));
    // console.log(website.$('head'));
    // console.log(cssTags[0].children[0]);
    for (var i = 0; i < cssTags.length; i++) {
        if (cssTags[i].children[0].data.match(/color/g).length) {
            // console.log(cssTags[i]);
            console.log("PASSED");
            test.passed = true; // ésto es temporalmente
        }
    }

    deferred.resolve(test);

    return deferred.promise;
};

module.exports.check = check;