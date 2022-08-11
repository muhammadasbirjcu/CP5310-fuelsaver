<template>
    <div class="text-start">
        <div  v-if="!(to && from)" class="bg-warning mb-4" style="margin:-1rem -1rem 0; padding:1rem">
            To get started please type the from and to location.
        </div>
        <div v-if="mapLoaded">
            <div class="mb-3">
                <LocationSearch 
                    :input-id="'from-location'"
                    :suggestions="fromSuggestions"
                    :controls-enabled="!busy"
                    :allow-device-location="true"
                    @searching="searchFrom" 
                    @selected="setFrom"
                    label="From" />
            </div>
            <div class="mb-3">
                <LocationSearch 
                    :input-id="'to-location'"
                    :suggestions="toSuggestions"
                    :controls-enabled="!busy"
                    @searching="searchTo" 
                    @selected="setTo"
                    label="To" />
            </div>
            <div class="d-flex justify-content-between">
                <div>
                    <div v-if="to && from">
                        <button v-if="!busy" class="btn btn-primary" @click.stop.prevent="calculate">Get Distance</button>
                        <button v-else class="btn btn-primary" disabled>Calculating..</button>
                    </div>
                    <div v-else>
                        <button class="btn btn-primary" disabled style="opacity:0.5">Get Distance</button>
                    </div>
                </div>
                <div>
                    <button class="btn btn-danger" @click.stop.prevent="cancel">Cancel</button>
                </div>
            </div>
        </div>
        <div v-else class="text-center">
            <div class="mb-3">
                Loading GoogleMaps plug-in
            </div>
            <div>
                <button class="btn btn-danger" @click.stop.prevent="cancel">Cancel</button>
            </div>
        </div>
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
                busy: false
            }
        },
        mounted(){
            this.loadMapScript();
        },
        methods: {
            calculate(){

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
                this.searchPlace(query).then((suggestions) => {
                    console.log(suggestions);
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