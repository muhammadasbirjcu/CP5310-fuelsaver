export default {
    data(){
        return {
            isGeolocationSupported: false,
            devicePosition: {
                lat: null,
                lng: null
            }
        }
    },
	methods: { 
        getDevicePosition(){
            if (navigator && navigator.geolocation) {
                this.isGeolocationSupported = true;
                return new Promise ((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition((position) => {
                        this.devicePosition.lat = position.coords.latitude;
                        this.devicePosition.lng = position.coords.longitude;
                        resolve(this.devicePosition);
                    }, (error) => {
                        reject(error);
                    });
                });
            }else{
                this.isGeolocationSupported = false;
                return Promise.reject({ unsupported: true });
            }
        }
    },
    computed: {
        hasDevicePosition(){
            return this.devicePosition.lat != null && this.devicePosition.lng != null;
        }
    }
}