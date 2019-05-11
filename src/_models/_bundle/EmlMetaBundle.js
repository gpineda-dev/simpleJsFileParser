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