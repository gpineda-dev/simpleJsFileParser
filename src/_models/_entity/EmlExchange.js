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