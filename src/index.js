/**
 * @description entrypoint for this library
 * @advice      use browserify to build the library
 *              browserify index.js -o simpleJsFileParser.js
 */

EmlMetaBundle = require('./_models/_bundle/EmlMetaBundle');
 
module.exports = {
    EmlMetaBundle: EmlMetaBundle
}