const { project, where } = require('../_helpers/jsonExtractor');
const utils = require('../helpers/utils');

/**
 * @description Class for a WekanBoard Model (only entity and not Bundle of WekanBoards)
 */
class WekanParser {

    /**
     * @description from a given file
     * @param {File} file File object member of Listfiles (provided by input type=file)
     */
    async static loadfromFile(file){
        let content = await utils.loadfromFile(file)
        return new WekanParser(content);        
    }

    /**
     * @description instanciate a new parser from a given WekanBoard as JSON format
     * @param {JSON} _WekanJSON 
     */
    constructor (_WekanJSON){
        _WekanJSON = JSON.parse(_WekanJSON);           //Load from a JSON file
        console.log("This is a new WekanParser");

        //extract Members / Users / Header(Meta) / lists / customFields / Cards / 
        this._WekanJSON   = _WekanJSON;
        this.lists        = _WekanJSON.lists;
        this.customFields = _WekanJSON.customFields;
        this.users        = _WekanJSON.users;
        this.members      = _WekanJSON.members;
        this._cards        = _WekanJSON.cards;
        this.header       = {
            title: _WekanJSON.title,
            date: _WekanJSON.createdAt,
            description : _WekanJSON.description
        }    
        
        this.cards        = this.convertCards();
        console.log("Built object",this._WekanJSON);
    }

    /**
     * @description Getter with fields _id and username
     */
    get Users(){
        return project(this.users,["_id","username"]);
    }

    get CustomFields(){
        return this.customFields;
    }

    get Cards(){
        return this.cards;
    } 

    /**
     * @description Transform methode
     */
    convertCards(){
        return this._cards.map(_e=>{
            _e.customFields.forEach(__e=>{
                let _w = where(this.customFields,[["_id",'=',__e["_id"]]])[0];
                if(_w){
                    _e[_w.name] = __e.value;
                }
            })
            //_e.list = this.lists.filter(a=>{ return (a._id==_e.listId); })[0].title;
            _e.list = where(this.lists,[['_id','=',_e.listId]])[0].title;
            _e.username = where(this.users,[['_id','=',_e.userId]])[0].username;
            _e.time = (new Date(_e.endAt)-new Date(_e.receivedAt))/3600/1000;

            return _e;
        })
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
        return JSON.stringify(this._WekanJSON,null,"\t");
    }
    

    
}
