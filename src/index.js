/**
 * @description entrypoint for this library
 * @advice      use browserify to build the library
 *              browserify index.js -o simpleJsFileParser.js
 */

EmlMetaBundle = require('./_models/_bundle/EmlMetaBundle');
EmlExchange = require('./_models/_entity/EmlExchange');
_Helpers = require('./_helpers/');

module.exports = {
    EmlMetaBundle: EmlMetaBundle,
    EmlExchange: EmlExchange,
    _Helpers : _Helpers
}