import axios from 'axios';

export default {
	methods: { 
        requestCarMakes(year){
            return axios.get('https://www.fueleconomy.gov/ws/rest/vehicle/menu/make', {
                params : { 
                    year : year
                }
            })
            .then((response) => {
                if(response.data && response.status == 200){
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
            return axios.get('https://www.fueleconomy.gov/ws/rest/vehicle/menu/model', {
                params : { 
                    year : year, 
                    make: make 
                }
            })
            .then((response) => {
                if(response.data && response.status == 200){
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
            return axios.get('https://www.fueleconomy.gov/ws/rest/vehicle/menu/options', {
                params : { 
                    year : year, 
                    make: make,
                    model: model 
                }
            })
            .then((response) => {
                if(response.data && response.status == 200){
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
            return axios.get('https://www.fueleconomy.gov/ws/rest/vehicle/' + carId)
            .then((response) => {
                if(response.data && response.status == 200){
                    return Promise.resolve(response.data);
                }else{
                    return Promise.reject(response);
                }
            })
            .catch((error) => {
                return Promise.reject(response);
            });
        }
    }
}