/* a function that return promise object*/
import axios from 'axios'
import {message} from 'antd'
export default function ajax(url, data={}, type='GET'){
    return new Promise((resolve, reject)=>{
        let promise
        //act ajax request
        if(type==='GET'){
            promise = axios.get(url, {
                params: data
            })
        }else{
            promise = axios.post(url, data)
        }
        //if success, resolve(value)
        promise.then(response => {
            //optimize: get data 
            resolve(response.data)
        })
        //if failed, show alert message
        .catch(error => {
            message.error('Request Failed: ' + error.message)
        })
    })
    
}