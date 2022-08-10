<template>
    <div >
        <div class="mb-3 car-selector-drilldown">
            <label for="drilldown-year" class="form-label">Year</label>
            <select id="drilldown-year" v-model="drilldown.year" class="form-control dropdown">
                <option v-for="yearItem in years" :key="yearItem" :value="yearItem">{{ yearItem }}</option>
            </select>
        </div>

        <div v-if="drilldown.year" class="mb-3">
            <div v-if="makesLoading" class="loading-section">
                <font-awesome-icon icon="fa-solid fa-spinner" spin />
                Loading car makes from {{ drilldown.year }}
            </div>
            <div v-else-if="makes" class="car-selector-drilldown">
                <label for="drilldown-makes" class="form-label">Makes</label>
                <div class="dropdown">
                    <select id="drilldown-makes" v-model="drilldown.make" class="form-control">
                        <option v-for="makeItem in makes" :key="makeItem.value" :value="makeItem.value">{{ makeItem.text }}</option>
                    </select>
                </div>
            </div>
        </div>

        <div v-if="drilldown.make" class="mb-3">
            <div v-if="modelsLoading" class="loading-section">
                <font-awesome-icon icon="fa-solid fa-spinner" spin />
                Loading car models from {{ drilldown.make }}
            </div>
            <div v-else-if="models" class="car-selector-drilldown">
                <label for="drilldown-models" class="form-label">Models</label>
                <div v-if="models" class="dropdown">
                    <select id="drilldown-models" v-model="drilldown.model" class="form-control">
                        <option v-for="makeItem in models" :key="makeItem.value" :value="makeItem.value">{{ makeItem.text }}</option>
                    </select>
                </div>
            </div>
        </div>

        <div v-if="drilldown.model" class="mb-3">
            <div v-if="trimsLoading" class="loading-section">
                Loading car trims in {{ drilldown.model }}
            </div>
            <div v-else-if="trims && trims.length > 1" class="car-selector-drilldown">
                <label for="drilldown-models" class="form-label">Trims</label>
                <div v-if="trims" class="dropdown">
                    <select id="drilldown-models" v-model="drilldown.carId" class="form-control">
                        <option v-for="trimItem in trims" :key="trimItem.value" :value="trimItem.value">{{ trimItem.text }}</option>
                    </select>
                </div>
            </div>

            <div v-if="carLoading" class="loading-section">
                <font-awesome-icon icon="fa-solid fa-spinner" spin />
                Loading  {{ drilldown.model }} information
            </div>
        </div>

        <div class="mt-3">
            <button @click.stop.prevent="cancel" class="btn btn-primary">Cancel</button>
        </div>
        <div style="position:relative">
            <div v-if="!carLoading && car" style="position:absolute; left:0; right:0; top: 85px"> 
                <div class="car-card fluid">
                    <CarInfo 
                        :car="car" 
                        :panel-id="-1"
                        :controls="{select:true}"
                        :info-only="true"
                        @selectCar="selectCar" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import fuelEconomyApi from '../mixins/FuelEconomyApi.js';
    import unitConverter from '../mixins/UnitConverter.js';
    import CarInfo from './CarInfo.vue';
    export default {
        components: { 
            CarInfo
        },
        props: {
        },
        data(){
            return {
                // array of selections
                years:[
                    2019, 2020, 2021
                ],
                makes:null,
                models:null,
                trims:null,

                // loading indicators
                makesLoading: false,
                modelsLoading: false,
                trimsLoading: false,
                carLoading: false,

                // selected drilldown
                drilldown: {
                    year: null,
                    make: null,
                    model: null,
                    carId: null,
                },
                car: null
            }
        },
        mixins: [
            fuelEconomyApi,
            unitConverter
        ],
        mounted() {
            this.populateYears();
            this.drilldown.year = new Date().getFullYear();
        }, 
        computed: {
        },
        methods : {
            populateYears(){
                const end = new Date().getFullYear();
                const start = end-10;

                for(var i = start; i <= end; i++){
                    this.years.push(i);
                }
            },
            loadMakes(){
                this.makes = null;
                // check if year is selected at all
                if(this.drilldown.year == null){
                    return;
                };

                // show loading indicator
                this.makesLoading = true;

                // retrieve the list of car makes from the API
                this.requestCarMakes(this.drilldown.year).then((makes) => {
                    // hide loading indicator
                    this.makesLoading = false;

                    // prepend default item
                    makes.unshift({ value: null, text: "Select " + this.drilldown.year + " cars.." })

                    // populate the car makes
                    this.makes = makes;
                }).catch(() => {
                    // hide loading indicator
                    this.makesLoading = false;

                    // inform user about the error
                    alert("Unable to retrieve car makes from the year " + this.drilldown.year);
                });
            },


            loadModels(){
                this.models = null;
                // check if make is selected at all
                if(this.drilldown.make == null){
                    return;
                }

                // show loading indicator
                this.modelsLoading = true;

                // retrieve the list of car models from the API
                this.requestCarModels(this.drilldown.year, this.drilldown.make).then((models) => {
                    // hide loading indicator
                    this.modelsLoading = false;

                    // prepend default item
                    models.unshift({ value: null, text: "Select " + this.drilldown.make + " models.." })

                    // populate the car models
                    this.models = models;
                }).catch(() => {
                    // hide loading indicator
                    this.modelsLoading = false;

                    // inform user about the error
                    alert("Unable to retrieve " + this.drilldown.make + " from the year " + this.drilldown.year);
                });
            },


            loadTrims(){
                // check if model is selected at all
                if(this.drilldown.model == null){
                    return;
                }

                // show loading indicator
                this.trimsLoading = true;

                // retrieve the list of model trims from the API
                this.requestCarTrims(
                    this.drilldown.year, 
                    this.drilldown.make,
                    this.drilldown.model
                ).then((trims) => {
                    // hide loading indicator
                    this.trimsLoading = false;

                    // at this point, the api returns 2 types of response
                    // 1. it returns array if the model has various trim levels
                    // 2. it returns object is the model doesn't have trim levels
                    if(Array.isArray(trims)){
                        // prepend default item
                        trims.unshift({ value: null, text: "Select " + this.drilldown.model + " trim levels.." })
                        this.trims = trims;
                    }else{
                        this.trims = [trims];
                        this.drilldown.carId = trims.value;
                    }
                    
                }).catch(() => {
                    // hide loading indicator
                    this.trimsLoading = false;

                    // inform user about the error
                    alert("Unable to retrieve " + this.drilldown.make + " from the year " + this.drilldown.year);
                });
            },
            loadCar(){
                this.vehicle = null;
                // check if vehicle is selected at all
                if(this.drilldown.carId == null){
                    return;
                }

                // show loading indicator
                this.carLoading = true;

                this.requestCarInfo(this.drilldown.carId).then((carInfo) => {
                    // hide loading indicator
                    this.carLoading = false;

                    // set car information
                    this.car = carInfo
                })
                .catch((error) => {
                    // hide loading indicator
                    this.carLoading = false;

                    // inform user about the error
                    alert("Unable to retrieve information of car id " + this.drilldown.carId);
                });
            },
            selectCar(){
                this.$emit('carSelected', this.car);
            },
            cancel(){
                this.$emit('cancelled');
            }
        },
        watch: {
            'drilldown.year'(){
                this.drilldown.make = null;
                this.loadMakes();
            },
            'drilldown.make'(){
                console.log('make changed');
                this.drilldown.model = null;
                this.loadModels();
            },
            'drilldown.model'(){
                console.log('model changed');
                this.drilldown.carId = null;
                this.car = null;
                this.loadTrims();
            },
            'drilldown.carId'(){
                this.car = null;
                console.log('car changed');
                this.loadCar();
            }
        }
        
    }
</script>

<style>
.loading-section{
    text-align: center;
}
.car-selector-drilldown{
    display: flex;
    align-items: center;
}
.car-selector-drilldown .form-label{
    flex:0 0 80px;
    text-align: left;
    margin-bottom: 0;
}
.car-selector-drilldown .dropdown{
    flex:1 1 100px;
}
</style>