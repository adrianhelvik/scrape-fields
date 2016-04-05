'use strict';
var request = require('request');
var jsdom = require('jsdom');

module.exports = function (url, cb) {
    request(url, function (err, res, html) {
        if (err)
            return cb(err);
        if (! html)
            return cb(new Error('No HTML in response with code: ' + res.statusCode));

        createDOM(null, html, cb);
    });
}

function createDOM(err, html, cb) {
    jsdom.env(html, function (err, window) {
        if (err)
            return cb(err);

        cb(null, window);
    });
}
