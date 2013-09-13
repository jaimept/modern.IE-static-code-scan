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
    jsPromises,
    fs = require('fs');  /****** added ******/

request = request.defaults({
    jar: false,
    headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0)'
    }
});

function downloadJS(jsUrl, jsHref, auth) {
    var jsDeferred = new Deferred(),
        parameters = {
            uri: jsUrl,
            headers: {
                'Accept': 'text/html, application/xhtml+xml, */*'
            }
        };

    if (auth) {
        parameters.auth = auth;
    }

    request(parameters, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            response.on('error', function (e) {
                console.log('loading CSS' + e);
            });
            jsDeferred.resolve({ url: url, href: jsHref, finalUrl: response.request.href, code: body });
        } else {
            jsDeferred.resolve({});
        }
    });

    return jsDeferred.promise;
}

function check(website) {
    var deferred = new Deferred(),
        test = {
            testName: "minifyjs",
            passed: false
        },
        js = [];

    var jsLinks = website.$('script');
    jsPromises = [];

    for (var i = 0; i < jsLinks.length; i++) {
        var jsHref = jsLinks[i].attribs.src,
            jsUrl;

        if (jsHref) {
            if (jsHref) {
                jsUrl = url.resolve(website.url, jsHref);
                jsPromises.push(downloadJS(jsUrl, jsHref, website.auth));
                console.log('Entrada....: ' + jsUrl);
                // -------------------------------------------------
                if (jsUrl.indexOf('min') !== -1) test.passed = true; // esto es una chorrada para que no dé fallos, se sacará cuando funcione el código de evaluación
                // -------------------------------------------------
                fs.readFile(jsUrl, 'utf8', function (err, data) {    // NO ACCEDE BIEN AL ARCHIVO, intenta ir, p.ej. a c:\...\localhost:1338\js\... 
                    // if (err) throw err;                           // mezclando lo local con la ruta, en vez de ir a c:\...\static\js\...
                    console.log('OK: ' + jsUrl);
                    if (!data) { test.passed = false };
                    if (data) {
                        console.log(data.length); // si funciona, dará éste dato
                        // ***************************************************
                        // Aquí iría todo el código de evaluación, ya previsto
                        // ***************************************************
                    }
                })
                /*request(jsUrl, function (error, response, body) {  // ESTO FUNCIONA IGUAL DE MAL Y TENDRÍA, ADEMÁS, QUE REPROGRAMAR LOS CÓDIGOS DE EVALUACIÓN
                    // if (error) throw error;
                    console.log('OK: ' + jsUrl);
                    console.log(body.length);
                })*/
            }
        } else if (jsLinks[i].children[0] && jsLinks[i].children[0].data) {
            // Some <script> tags that do not contain anything. We ignore those
            js.push({ jsUrl: 'embed', code: jsLinks[i].children[0].data });
        }
    }

    if (jsPromises.length > 0) {
        promised.all(jsPromises).then(function (array) {
            for (i = 0; i < array.length; i++) {
                if (array[i].finalUrl) {
                    js.push(array[i]);
                }
            }
            deferred.resolve(js);
        }, function () {
            deferred.reject();
        });
    } else {
        // There aren't any external JS so we resolve an empty list
        deferred.resolve(js);
    }

    deferred.resolve(test); /****** added ******/
    return deferred.promise;
}

// module.exports.loadjsFiles = check;
module.exports.check = check;  /****** changed ******/