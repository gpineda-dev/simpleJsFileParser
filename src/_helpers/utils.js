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
 * @param {regex} pattern 
 */
function extractPattern(myString, pattern){

}