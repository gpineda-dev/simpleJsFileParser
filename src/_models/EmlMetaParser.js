const { project, where } = require('../_helpers/jsonExtractor');
const utils = require('../helpers/utils');

/**
 * @description Class for a EmlMeta Model (only entity and not Bundle of EmlMetas)
 */
class EmlMetaParser {

    /**
     * @description from a given file
     * @param {File} file File object member of Listfiles (provided by input type=file)
     */
    async static loadfromFile(file){
        let content = await utils.loadfromFile(file)
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
        console.log("This is a new _EmlMetaJSON");

        //extract Members / Users / Header(Meta) / lists / customFields / Cards / 
        this._EmlMetaJSON   = _EmlMetaJSON;
        
        console.log("Built object",this._EmlMetaJSON);
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
        return 0; //will returned correction time from a specific tag
    }    

    //When initialized ..
    getTitles(category){
        console.log("getTitles of : ",category)
            return project(this[category],["title"]);
    }

    getKeys(category){
        return Object.keys(this[category]);
    }

    /**
     * @description return all cards made by <username>
     * @param {string} username 
     */
    CardsfromUser(username){
        console.log("searching cards from .. ",username);
        let uid = where(this.users,[["username","=",username]])[0]._id;
        let madebyUid = where(this.cards,[['userId','=',uid]]);
        return madebyUid;
    }

    /**
     * 
     */
    toString(){
        return JSON.stringify(this._EmlMetaJSON,null,"\t");
    }
    

    
}
