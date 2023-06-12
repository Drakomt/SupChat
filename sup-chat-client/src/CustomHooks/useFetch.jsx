import axios from "axios";
import { useEffect, useState } from "react"
const baseUrl = require('../URL.json').url;
export const UseFetch = (url, method, data, dependecies = [], execute = true) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [resp, setResp] = useState(null);
    useEffect(() => {fetch()},dependecies)
    const fetch = async () => {
        console.log(`dependecies: ${dependecies}`);
        if(!data || !execute) return;  
        try {
            const resp = await axios({
                    method,
                    url: `${baseUrl}/${url}`,
                    data
                });
            setResp(resp);
        } catch (error) {
            console.log(error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }
    return [
        resp,
        isLoading,
        error
    ];
}