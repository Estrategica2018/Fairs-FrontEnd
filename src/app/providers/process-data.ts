export function processData(obj){
    
    if(typeof obj == 'object' && obj.length > 0) {
        for(let item of obj) {
            item = processData(item);
        }
    }
    else if(typeof obj == 'object') {
        
        if(obj.resources && typeof obj.resources == 'string') {
          obj.resources = JSON.parse(obj.resources );
        }
        let objItem = null;
        for (let key of Object.keys(obj)) {
            if(obj[key]) {
               processData(obj[key]);
            }
        }
        
    }
    return obj;
}

export function processDataToString(obj){
    
    if(typeof obj == 'object' && obj.length > 0) {
        for(let item of obj) {
            item = processDataToString(item);
        }
    }
    else if(typeof obj == 'object') {
        
        if(obj.resources && typeof obj.resources == 'object') {
          obj.resources = JSON.stringify(obj.resources);
        }
        
        let objItem = null;
        for (let key of Object.keys(obj)) {
           if(obj[key]) {
              processDataToString(obj[key]);
           }
        }
        
    }
    return obj;
}