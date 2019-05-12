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