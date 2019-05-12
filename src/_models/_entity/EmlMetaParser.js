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