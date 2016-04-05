'use strict';
var domRequest = require('./dom-request');
var htmlToText = require('html-to-text');
var clone = require('clone');

module.exports = function (url, fields, cb) {
    domRequest(url, function (err, window) {
        if (err)
            return cb(err);

        findData(null, clone(fields), window.document, function (err, data) {
            if (err)
                return cb(err);

            cb(null, data);
        });
    });
}

function findData(err, fields, baseNode, cb) {
    if (err)
        return cb(err);

    var result = {};
    if (fields.SELECTOR) {
        var baseNodes = baseNode.querySelectorAll(fields['SELECTOR']);
        delete fields.SELECTOR;

        result = [];

        if (! baseNodes.length)
            return cb(null, null);

        return Array.from(baseNodes).forEach(matchingNode => {
            process.nextTick(function () {
                findData(err, fields, matchingNode, function (err, childResult) {
                    if (err)
                        return cb(err);

                    result.push(childResult);

                    if (result.length === baseNodes.length)
                        return cb(null, result);
                });
            });
        });
    }

    var isComplete = false;

    Object.keys(fields).forEach(field => {
        parseField(null, fields, field, baseNode, (err, parsed) => {
            if (isComplete)
                return;
            if (err) {
                isComplete = true;
                return cb(err);
            }

            result[field] = parsed;

            if (Object.keys(result).length === Object.keys(fields).length) {
                isComplete = true;
                return cb(null, result);
            }
        });
    });
}

function parseField(err, fields, field, baseNode, cb) {
    process.nextTick(function () {
        if (err)
            return cb(err);

        if (typeof fields[field] == 'string')
            return cb(null, parseHTML(baseNode.querySelector(fields[field])));

        if (! fields[field])
            return cb(null, null);

        if (typeof fields[field] == 'function')
            return cb(new Error(`Function not supported. Field ${field} was a function`));

        if (typeof fields[field] == 'object') {
            return findData(null, fields[field], baseNode, function (err, result) {
                if (err)
                    return cb(err);
                return cb(null, result);
            });
        }

        return cb(new Error(`Could not parse field ${field} in ${fields}. ${typeof fields[field]} not supported.`));
    });
}

function parseHTML(htmlObject) {
    if (! htmlObject)
        return null;
    if (htmlObject.innerHTML)
        return htmlToText.fromString(htmlObject.innerHTML);
    return htmlToText.fromString(htmlObject);
}

