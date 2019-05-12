/**
 * @description entrypoint for this library
 * @advice      use browserify to build the library
 *              browserify index.js -o simpleJsFileParser.js
 */

EmlMetaBundle = require('./_models/_bundle/EmlMetaBundle');
Utils         = require('./_helpers/utils');
JsonExtractor = require('./_helpers/jsonExtractor')

module.exports = {
    EmlMetaBundle: EmlMetaBundle,
    Utils: Utils,
    JsonExtractor : JsonExtractor
}