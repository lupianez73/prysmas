'use strict';

import axios from 'axios';
import path from 'path';

const utils = {};

utils.getImages = (opts, size) => {
    var params = {
        q:'a',
        key: process.env.GOOGLE_SEARCH_API_KEY,
        rights: 'cc_publicdomain',
        // searchType:'image',
        cx: process.env.GOOGLE_SEARCH_CX
        }
       
           for(let k in opts){
                 params[k] = opts[k]
            }
        
    return axios.get('https://www.googleapis.com/customsearch/v1',{
            params,
            headers: {"type": "application/json"}
    })
}


utils.processImages = () => {
    return axios.get(path.resolve(paths.clientHost, '/images'));
}


module.exports = utils;
