import axios from 'axios';
import QueryString from 'querystring';

export default {
	methods: { 
        requestCarMakes(year){
            const params = new URLSearchParams({
                year: year
            });
            let url = 'https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?' + params.toString();

            // check for cached result 
            let cachedData = this.fuelEconomyGetCache(url);
            if(cachedData) return Promise.resolve(JSON.parse(localStorage.getItem(url)));

            return axios.get(url)
            .then((response) => {
                if(response.data && response.status == 200){
                    this.fuelEconomySetCache(url, response.data.menuItem);
                    return Promise.resolve(response.data.menuItem);
                }else{
                    return Promise.reject(response);
                }
            })
            .catch((error) => {
                return Promise.reject(error);
            }); 
        },
        requestCarModels(year, make){
            const params = new URLSearchParams({
                year: year,
                make: make
            });
            let url = 'https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?' + params.toString();

            // check for cached result 
            let cachedData = this.fuelEconomyGetCache(url);
            if(cachedData) return Promise.resolve(JSON.parse(localStorage.getItem(url)));

            return axios.get(url)
            .then((response) => {
                if(response.data && response.status == 200){
                    this.fuelEconomySetCache(url, response.data.menuItem);
                    return Promise.resolve(response.data.menuItem);
                }else{
                    return Promise.reject(response);
                }
            })
            .catch((error) => {
                return Promise.reject(error);
            });
        },
        requestCarTrims(year, make, model){
            const params = new URLSearchParams({
                year: year,
                make: make,
                model: model
            });
            let url = 'https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?' + params.toString();

            // check for cached result 
            let cachedData = this.fuelEconomyGetCache(url);
            if(cachedData) return Promise.resolve(JSON.parse(localStorage.getItem(url)));

            return axios.get(url)
            .then((response) => {
                if(response.data && response.status == 200){
                    this.fuelEconomySetCache(url, response.data.menuItem);
                    return Promise.resolve(response.data.menuItem);
                }else{
                    return Promise.reject(response);
                }
            })
            .catch((error) => {
                return Promise.reject(response);
            });
        },
        requestCarInfo(carId){

            let url = 'https://www.fueleconomy.gov/ws/rest/vehicle/' + carId;

            // check for cached result 
            let cachedData = this.fuelEconomyGetCache(url);
            if(cachedData) return Promise.resolve(JSON.parse(localStorage.getItem(url)));

            return axios.get(url)
            .then((response) => {
                if(response.data && response.status == 200){
                    this.fuelEconomySetCache(url, response.data);
                    return Promise.resolve(response.data);
                }else{
                    return Promise.reject(response);
                }
            })
            .catch((error) => {
                return Promise.reject(response);
            });
        },
        fuelEconomyGetCache(url){
            let rawData = localStorage.getItem(url);
            return rawData ? JSON.stringify(rawData) : null;
        },
        fuelEconomySetCache(url, data){
            return localStorage.setItem(url, JSON.stringify(data));
        }
    }
}