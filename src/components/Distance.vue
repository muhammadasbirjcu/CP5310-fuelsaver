<template>
    <div class="">
        <div v-if="loaded">
            <div class="mb-3">
                <LocationSearch 
                    :suggestions="fromSuggestions"
                    :map="map" 
                    @searching="searchFrom" 
                    @selected="setFrom"
                    label="From" />
            </div>
            <div class="mb-3">
                <LocationSearch 
                    :suggestions="toSuggestions"
                    :map="map" 
                    @searching="searchTo" 
                    @selected="setTo"
                    label="To" />
            </div>
            <button v-if="!busy" class="btn btn-primary" @click.stop.prevent="calculate">Get Distance</button>
            <button v-else class="btn btn-primary" disabled>Calculating..</button>
        </div>
        <div v-else class="text-center">
            Loading GoogleMaps plug-in
        </div>
        <button class="btn btn-primary" @click.stop.prevent="cancel">Cancel</button>
    </div>
</template>
<script> 
    import LocationSearch from './LocationSearch.vue';
    import Maps from '../mixins/Maps';

    export default {
        components: { 
            LocationSearch
        },
        mixins: [
            Maps
        ],
        data() {
            return {
                from: null,
                to: null,
                fromSuggestions: [],
                toSuggestions: [],
                distance: null,
                busy: false,
                map: null,
                mapId: '4d6e0bbce5ea5a83'
            }
        },
        mounted(){
            this.onMapsLoaded = () => { 
                this.map = new google.maps.Map(document.getElementById('map'), {
                    center: {
                        lat: -27.382073,
                        lng: 152.8531152
                    },
                    zoom: 11,
                    disableDefaultUI: true,
                    mapId: this.mapId
                });
            };
            this.loadMapScript();
        },
        methods: {
            calculate(){
                // google maps api is not yet loaded
                if(!this.loaded){
                    return;
                }

                this.busy = true;
                this.calculateDistance({placeId: this.from.place_id}, {placeId: this.to.place_id}).then((distances, status) => {
                    this.busy = false;
                    this.distances = distances;
                    this.$emit('distancesCalculated', { 
                        from: this.from,
                        to: this.to,
                        distances: this.distances 
                    });
                }).catch((err) => {
                    this.busy = false;
                    alert("Unable to calculate distance!");
                    console.error(err);
                })
            },
            searchFrom(query){
                this.searchLocation(query, 'from')
            },
            searchTo(query){
                this.searchLocation(query, 'to')
            },
            searchLocation(query, type){
                if(type == 'from'){
                    this.fromSuggestions.splice(0);
                }else{
                    this.toSuggestions.splice(0);
                }
                this.searchPlace(this.map, query).then((suggestions) => {
                    if(type == 'from'){
                        this.fromSuggestions = suggestions;
                    }else{
                        this.toSuggestions = suggestions;
                    }
                }).catch(() => {
                    
                })
            },
            setFrom(address){
                this.fromSuggestions.splice(0);
                this.from = address;
            },
            setTo(address){
                this.toSuggestions.splice(0);
                this.to = address;
            },
            cancel(){
                this.$emit('cancelled');
            }
        },
        watch: {
        }
    }
</script>