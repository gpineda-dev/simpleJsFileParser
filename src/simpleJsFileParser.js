(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
 * This lib is done to apply junctions .. select on JSON .. require Jquery
 */

function project(json_tbl,fields=[]){
    return json_tbl.map(record_line => {
        let to_return = {};
        fields.forEach(_e=>{
            if(_e in record_line){
                to_return[_e] = record_line[_e];
            }
        })
        return to_return;        
    });
}

function where(json_tbl,cdt){
    console.log("in where ..",cdt)
    return json_tbl.filter(_e=>{
        let acc = true;
        cdt.forEach(cvalue=>{
            let to_return = false;

            let c_cdt   = cvalue[1];
            let c_field = cvalue[0];
            let c_value = cvalue[2];

            switch(c_cdt){
                case '=':
                    to_return = (_e[c_field]==c_value);
                break;
            }
            acc = acc && to_return;
        })
        return acc;
    })
}

function join(json1,json2,field1,field2){
    let to_return = [];
    json1.forEach(_e1 => {  
        json2.forEach(_e2=>{
            if(_e1[field1]==_e2[field2]){
                to_return.push($.extend(_e1,_e2));
            }
        }) 
    });
    return to_return;
}


exports.join = join;
exports.where = where;
exports.project = project;
},{}],2:[function(require,module,exports){
/**
 * @description extract fileContent from a File Object
 * @returns {Promise} fileContent (text) as Promise handler
 */
function loadFromFile(file){
    return new Promise((resolve,reject)=>{
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        reader.onerror = function(err){
            reject(err)
        };
    })
}

/**
 * @description extract matching words with the provided pattern
 * @param {string} myString 
 * @param {Regex} pattern 
 */
function extractPattern(myString, pattern){
    return [];
}

exports.loadFromFile = loadFromFile;
exports.extractPattern = extractPattern;
},{}],3:[function(require,module,exports){
const {EmlMetaParser} = require('../_entity/EmlMetaParser');

/**
 * @description a bundle object to handle and manage sets of EmlMeta objects
 */
class EmlMetaBundle {
    
    constructor(){
        this.sets = {};
    }

    
    async addFromFiles(files,destination){
        console.log(`destination is .. ${destination}`);
        let temp = Array.from(files).map((file)=>{
            return EmlMetaParser.loadFromFile(file);
        });
        let resolvedTemp = await Promise.all(temp)
        this.appendToSet(resolvedTemp,destination);
        console.log(this.sets);
        return this.sets[destination];
    } 
    
    appendToSet(data,destination){
        console.log(`data ${data} isArray ? ${Array.isArray(this.sets[destination])}`);
        if(!Array.isArray(this.sets[destination])){this.sets[destination] = []}
        console.log(`isArray2 ? ${Array.isArray(this.sets[destination])}`);

        this.sets[destination] = this.sets[destination].concat(data);
    }

}


module.exports = EmlMetaBundle;
},{"../_entity/EmlMetaParser":4}],4:[function(require,module,exports){
const { project, where } = require('../../_helpers/jsonExtractor');
const utils = require('../../_helpers/utils');

/**
 * @description Class for a EmlMeta Model (only entity and not Bundle of EmlMetas)
 */
class EmlMetaParser {

    /**
     * @description from a given file
     * @param {File} file File object member of Listfiles (provided by input type=file)
     */
    static async loadFromFile(file){
        let content = await utils.loadFromFile(file)
        return new EmlMetaParser(content);        
    }

    /**
     * @description instanciate a new parser from a given WekanBoard as JSON format
     * @param {JSON} _WekanJSON 
     */
    constructor (_EmlMetaJSON){
        _EmlMetaJSON = JSON.parse(_EmlMetaJSON);           //Load from a JSON file
        this.subject = _EmlMetaJSON.subject;
        this.content = _EmlMetaJSON.content;
        this.sender  = _EmlMetaJSON.sender;
        //this.delay   = this.parseDelay();
        console.log("This is a new _EmlMetaJSON");

        //extract Members / Users / Header(Meta) / lists / customFields / Cards / 
        this._EmlMetaJSON   = _EmlMetaJSON;
        
        console.log("Built object",this._EmlMetaJSON);
    }

    //internal methods to format the eml file with Meta
    parseDelay(){
        let pattern = "<TPS_([^>])+>";
        let matchingTag = utils.extractPattern(this.metadata,pattern);
        return (matchingTag.length > 0 ? matchingTag[0].split("_")[0] : null)
    }


    /**
     * @description Getter with fields _id and username
     */
    get Sender(){
        return this.sender;
    }

    get Content(){
        return this.metadata;
    }

    get Subject(){
        return this.subject;
    } 

    get delay(){
        return this.delay;
    }    

    //When initialized ..

    getKeys(category){
        return Object.keys(this[category]);
    }

    /**
     * 
     */
    toString(){
        return JSON.stringify(this._EmlMetaJSON,null,"\t");
    }
    

    
}

exports.EmlMetaParser = EmlMetaParser;
},{"../../_helpers/jsonExtractor":1,"../../_helpers/utils":2}],5:[function(require,module,exports){
/**
 * @description entrypoint for this library
 * @advice      use browserify to build the library
 *              browserify index.js -o simpleJsFileParser.js
 */

EmlMetaBundle = require('./_models/_bundle/EmlMetaBundle');
 
module.exports = {
    EmlMetaBundle: EmlMetaBundle
}
},{"./_models/_bundle/EmlMetaBundle":3}]},{},[5]);
