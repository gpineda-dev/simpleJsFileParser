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
 * @return {Array<JSON>} Array of JSON, record = {key: valueOfKey, data: matchingArray}
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

    return to_return;
}


exports.join = join;
exports.where = where;
exports.project = project;
exports.splitBy = splitBy;