import { parse } from "querystring";

export default {
	methods: { 
        saveState(key, value){
            localStorage.setItem(key, JSON.stringify(value));
        },
        loadState(key, defaultValue){
            if(localStorage.getItem(key)){
                var parsed = null;
                try{
                    parsed = JSON.parse(localStorage.getItem(key));
                }catch{

                }
                return parsed;
            }else{
                return defaultValue;
            }
        }
    }
}