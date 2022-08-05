

export default {
    data() {
        return {
            distanceService: null,
            placeService: null,
            loaded: false,
            onMapsLoaded: null,
            mapsApiKey: null
        }
    },
    mounted() {
        this.mapsApiKey = window.mapsApiKey;
    },
    methods: {
        loadMapScript(){
            if(typeof google === 'undefined'){
                var script = document.createElement('script');
                script.onload = () => {
                    this.loaded = true;
                    if(this.onMapsLoaded) this.onMapsLoaded();
                }
                script.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.mapsApiKey + '&libraries=places&callback=initMap';
                document.head.appendChild(script);
            }else{
                this.loaded = true;
                if(this.onMapsLoaded) this.onMapsLoaded();
            }
        },
        calculateDistance(origin, destination){
            if(!this.loaded){
                return Promise.reject("Google Maps JS file is not yet loaded");
            }
            if(this.distanceService == null){
                this.distanceService = new google.maps.DistanceMatrixService();
            }

            return new Promise((resolve, reject) => {
                this.distanceService.getDistanceMatrix({
                    origins: [origin],
                    destinations: [destination],
                    travelMode: 'DRIVING',
                    // transitOptions: TransitOptions,
                    // drivingOptions: DrivingOptions,
                    unitSystem: google.maps.UnitSystem.METRIC,
                    avoidHighways: false,
                    avoidTolls: false,
                }, (response, status) => {

                    console.log('maps matrix resp', response);
                    if(response.rows.length < 1){
                        reject("No rows");
                    }else if(response.rows[0].elements.length < 1){
                        reject("No elements");
                    }else{
                        resolve(response.rows[0].elements[0].distance.value, status);
                    }

                });
            });
        },
        searchPlace(map, searchQuery){
            if(!this.loaded){
                return Promise.reject("Google Maps JS file is not yet loaded");
            }
            if(this.placeService == null){
                this.placeService = new google.maps.places.PlacesService(map);
            }

            return new Promise((resolve, reject) => {
                this.placeService.findPlaceFromQuery({
                    query: searchQuery,
                    fields: ['name', 'formatted_address', 'place_id', 'geometry'],
                }, (response, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        resolve(response);
                    }else{
                        reject("Error");
                    }
                });
            });
        }
    }
}