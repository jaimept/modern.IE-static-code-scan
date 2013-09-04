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

    var tile1 = website.$('meta[name="msapplication-square70x70logo"]'),
        tile2 = website.$('meta[name="msapplication-square150x150logo"]'),
        tile3 = website.$('meta[name="msapplication-wide310x150logo"]'),
        tile4 = website.$('meta[name="msapplication-square310x310logo"]'),
        test = {
            testName:"pinned",
            passed:false,
            data: {
                tile1: false,
                tile2: false,
                tile3: false,
                tile4: false
            }

        };
    if (tile1.length > 0) {
        test.passed = true;
        test.data.tile1 = true;
    }

    if (tile2.length > 0) {
        test.passed = true;
        test.data.tile2 = true;
    }

    if (tile3.length > 0) {
        test.passed = true;
        test.data.tile3 = true;
    }

    if (tile4.length > 0) {
        test.passed = true;
        test.data.tile4 = true;
    }

    deferred.resolve(test);

    return deferred.promise;
};

module.exports.check = check;