(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @description entrypoint _helpers
 *
 */

Utils         = require('./utils');
JsonExtractor = require('./jsonExtractor')

module.exports = {
    Utils: Utils,
    JsonExtractor : JsonExtractor
}
},{"./jsonExtractor":2,"./utils":3}],2:[function(require,module,exports){
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



/**
 * @description split a JsonArray from a provided field
 * @param {Array<JSON>} json 
 * @param {string} field 
 * @return {Array<JSON>} Array<{key: valueOfKey, data: matchingArray}>
 */
function splitBy(json,field){
    let to_return = [];
    let groupedValues = [];
    json.forEach((record,index)=>{
        let key = record[field];
        if(!groupedValues.includes(key))
        {
            to_return.push({
                key: key,
                record: json.filter(v=>{
                    return v[field] == key;
                })
            })
            groupedValues.push(key);
        }
    })
    console.log(`groupedValues : ${groupedValues}`);
    return {total: json.length, data: to_return};
}


/**
 * @description order an array of jsonArray by field asc(1)/desc(-1)
 * @param {Array<JSON>} jsonArray array of Json to sort
 * @param {string} field pivot
 * @param {tinyint} order asc(1) / desc(-1), default: 1
 */
function orderBy(jsonArray=[{}],field,order=1){
    //check if field in Array !
    let _fields = Object.keys(jsonArray[0]);
    if(_fields.includes(field)) 
    {
        return jsonArray.sort((record1,record2)=>{ return order*(record1[field]-record2[field]); })
    }
    throw new Error(`orderBy : unknown field : ${field} in ${_fields}`);

}



exports.join = join;
exports.where = where;
exports.project = project;
exports.splitBy = splitBy;
exports.orderBy = orderBy;
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
const {EmlMetaParser} = require('../_entity/EmlMetaParser');
const {JsonExtractor} = require('../../_helpers/');
const EmlExchange   = require('../_entity/EmlExchange');

/**
 * @description a bundle object to handle and manage sets of EmlMeta objects
 */
class EmlMetaBundle {
    
    constructor(){
        this.sets = {};
        
    }

    hasSet(destination){
        if(typeof this.sets[destination] !== "object"){return false}
        if(!Array.isArray(this.sets[destination].EmlMeta)){return false}
        if(typeof this.sets[destination].EmlExchanges !== "object"){return false}
        if(typeof this.sets[destination].EmlExchanges.total !== "number"){return false}
        if(!Array.isArray(this.sets[destination].EmlExchanges.records)){return false}
        return true;
    }
    

    async addFromFiles(files,destination){
        console.log(`destination is .. ${destination}`);
        let temp = Array.from(files).map((file)=>{
            return EmlMetaParser.loadFromFile(file);
        });
        let resolvedTemp = await Promise.all(temp)
        this.appendToSet(resolvedTemp,destination);
        console.log(this.sets);
        return this.sets[destination].EmlMeta;
    } 
    
    appendToSet(data,destination){
        console.log(`data ${data} isArray ? ${Array.isArray(this.sets[destination])}`);
        if(!this.hasSet(destination)){this.sets[destination] = { EmlMeta:[] , EmlExchanges: {total: 0, records: []}}}
        console.log(`isArray2 ? ${Array.isArray(this.sets[destination])}`);

        this.sets[destination].EmlMeta = this.sets[destination].EmlMeta.concat(data);
        this.sets
    }

    exchangesFromSet(destination){
        if(!this.hasSet(destination)){ throw new Error(`Unknown set[${destination}]`)}
        
        if(this.sets[destination].EmlExchanges.total!=this.sets[destination].EmlMeta.length){
            console.log("calculating .. exchanges")
            let splitedEml = JsonExtractor.splitBy(this.sets[destination].EmlMeta,"parent_id");
            let { total, data } = EmlExchange.fromSplitedByParentId(splitedEml);
            
            this.sets[destination].EmlExchanges.total = total;
            this.sets[destination].EmlExchanges.records = data;
        }

        return this.sets[destination].EmlExchanges;
        

    }


}


module.exports = EmlMetaBundle;
},{"../../_helpers/":1,"../_entity/EmlExchange":5,"../_entity/EmlMetaParser":6}],5:[function(require,module,exports){
const { JsonExtractor } = require('../../_helpers/');

/**
 * @description Class for a EmlExchange Model (only entity and not Bundle of EmlMetas)
 */
class EmlExchange {

    /**
     * @description instanciate Array<EmlExchnage> from splited Eml by parentId
     * @param {splitedEmls} splitedEml {total: nbTotalEmls, data: Array<splitedEml>} 
     */
    static fromSplitedByParentId(splitedEml){
        let Exchanges = splitedEml.data.map((emlMeta)=>{ return new EmlExchange(emlMeta.record,emlMeta.key)})
        return {total: splitedEml.total, data: Exchanges};
    }

    /**
     * @description Complete eml exchange
     * @param {Array<EmlMetaParser>} EmlMetaRecords all records of this exchange
     * @param {integer} parent_id  
     */
    constructor (EmlMetaRecords,parent_id){
      
        //reuse _EmlMetaJson properties
        //Object.keys(_EmlMetaJSON).forEach((key)=>{this[key] = _EmlMetaJSON[key]})

        //add our own properties
        this.raw = JsonExtractor.orderBy(EmlMetaRecords,"date"); //metas orderedBy date asc
        this.parent_id = parent_id;
        this.delay = this.calcDelay(); //taken time to close complete exchange
        console.log("This is a new emlExchange");       
        console.log("Built object",this.raw);
    }

    /**
     * @description calculate full delay to deal with this exchange
     */
    calcDelay(){
        return (this.raw[this.raw.length-1].date-this.raw[0].date);
    }


    /**
     * @description Getter with fields _id and username
     */
    get subject(){
        return this.raw[0].subject;
    } 

    get nb(){
        return this.raw.length
    }
    /*
    get delay(){
        return this.delay;
    }    */


    /**
     * @description overload Object toString()
     */
    toString(){
        return `EmlExchange ${this.subject}, elapsed: ${this.delay}, nb: ${this.nb}`;
    }
    

    
}

module.exports = EmlExchange;
},{"../../_helpers/":1}],6:[function(require,module,exports){
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
        
        //reuse _EmlMetaJson properties
        Object.keys(_EmlMetaJSON).forEach((key)=>{this[key] = _EmlMetaJSON[key]})

        //add our own properties
        this.subject = _EmlMetaJSON.subject;
        this.content = _EmlMetaJSON.content;
        this.sender  = _EmlMetaJSON.sender;

        //this.delay   = this.parseDelay();
        console.log("This is a new _EmlMetaJSON");
        
        
        
        /*
        //extract Members / Users / Header(Meta) / lists / customFields / Cards / 
        this._EmlMetaJSON   = _EmlMetaJSON;
        */




       
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
        return Object.keys(this);
    }

    /**
     * 
     */
    toString(){
        return JSON.stringify(this._EmlMetaJSON,null,"\t");
    }
    

    
}

exports.EmlMetaParser = EmlMetaParser;
},{"../../_helpers/jsonExtractor":2,"../../_helpers/utils":3}],7:[function(require,module,exports){
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
},{"./_helpers/":1,"./_models/_bundle/EmlMetaBundle":4,"./_models/_entity/EmlExchange":5}]},{},[7]);
