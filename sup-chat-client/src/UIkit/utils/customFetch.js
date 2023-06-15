import axios from "axios";
const baseUrl = require('../../URL.json').url;

export async function customFetch(url, method, data){
    if(method === "POST" && data instanceof FormData){
        const response = await axios({
          method,
          url: `${baseUrl}/${url}`,
          data,
          headers: {
            'Content-Type': 'multipart/form-data'
          },  
        });
        return response.data;
    } else if (method === "GET"){
        const resp = await axios.get(`${baseUrl}/${url}`, {params: data});
        return resp.data;
    } else {
        const  resp = await axios({
                method,
                url: `${baseUrl}/${url}`,
                data
            });
        return resp.data;
    }
}


