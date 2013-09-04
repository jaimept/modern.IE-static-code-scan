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

var Deferred = require('promised-io').Deferred;
var check = function (website) {
    var deferred = new Deferred();

    var preload1 = website.$('link[rel="prefetch"]'),
        preload2 = website.$('link[rel="dns-prefetch"]'),
        preload3 = website.$('link[rel="prerender"]'),
        test = {
            testName: "prefetch",
            passed: false,
            data: {
                preload1: false,
                preload2: false,
                preload3: false
            }

        };
    if (preload1.length > 0) {
        test.passed = true;
        test.data.preload1 = true;
    }

    if (preload2.length > 0) {
        test.passed = true;
        test.data.preload2 = true;
    }

    if (preload3.length > 0) {
        test.passed = true;
        test.data.preload3 = true;
    }

    deferred.resolve(test);

    return deferred.promise;
};

module.exports.check = check;