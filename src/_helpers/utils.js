

/**
 * @description extract fileContent from a File Object
 * @returns {Promise} fileContent (text) as Promise handler
 */
function loadfromFile(file){
    return new Promise((resolve,reject)=>{
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            resolve(e.target.result);
        };
    })
}