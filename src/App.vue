<template>
    <div id="pre-loading" v-show="preloadingVisible">
        <div style="flex:0 0 50%">
            <img src="/preloading-logo.jpg" alt="FuelSaverr Logo" />
        </div>
    </div>
    <div v-if="isCarSelectorVisible" @click.stop.prevent="hideCarSelector" class="modal-backdrop fade show"></div>
    <div>

        <div class="modal" tabindex="-1" :class="{'d-block' : isCarSelectorVisible}">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        Select Car..
                    </div>
                    <div class="modal-body">
                        <CarSelector @carSelected="carSelected"
                            @cancelled="carCancelled" />
                    </div>
                </div>
            </div>
        </div>

        <div class="modal" tabindex="-1" :class="{'d-block' : isDistanceSelectorVisible}">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                        <Distance 
                            @distancesCalculated="distancesCalculated"
                            @cancelled="distanceCancelled" />
                    </div>
                </div>
            </div>
        </div>

        <div>

            <div class="distance-info-panel">
                <div class="locations-from-to">
                    <div v-if="startLocation" class="location"><span>From:</span>{{ startLocation.name }}</div>
                    <div v-if="endLocation" class="location"><span>To:</span>{{ endLocation.name }}</div>
                </div>
                <div>
                    <button class="btn btn-primary btn-xs change-route" @click.stop.prevent="changeRoute">Change Route</button>
                </div>
            </div>
        </div>

        <div>
            <div class="factors-info">
                <div class="factor-icon">
                    <font-awesome-icon icon="fa-solid fa-route" />
                </div>
                <div class="distance-factor">
                    <div class="factor-label">Distance</div>
                    <div>
                    {{ formattedDistance }} km
                    </div>
                </div>
                <div class="fuel-price-factor">
                    <div class="factor-label">Fuel Price</div>
                    {{ formattedFuelPrice }} ¢/l
                </div>
                <div class="factor-icon">
                    <font-awesome-icon icon="fa-solid fa-gas-pump" />
                </div>
            </div>
        </div>


        <div class="car-list">
            <div class="car-list-flex" :style="carCarouselStyle">
                <div class="car-card" v-for="car in cars" :key="car.panelId">
                    <CarInfo 
                        :car="car" 
                        :distance="distance"
                        :fuel-price="fuelPrice"
                        @changeCar="openCarSelector" 
                        @removeCar="removeCar"
                        :panel-id="car.panelId" />
                </div>
                <div class="car-card car-card-add" @click.stop.prevent="addCar">
                    <div class="icon">
                        <font-awesome-icon icon="fa-solid fa-circle-plus" />
                    </div>
                    <div>Add Car</div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    import CarSelector from './components/CarSelector.vue';
    import CarInfo from './components/CarInfo.vue';
    import Distance from './components/Distance.vue';
    import _ from 'lodash';
    import StorableState from './mixins/StorableState';

    export default {
        components: { 
            CarSelector,
            CarInfo,
            Distance 
        },
        mixins: [
            StorableState
        ],
        data() {
            return {
                cars: [],
                panelIdEdited: 0,
                isCarSelectorVisible: false,
                isDistanceSelectorVisible: false,
                numberFormatter: null,
                fuelPriceFormatter: null,

                fuelPrice: 220,

                startLocation: null,
                endLocation: null,
                distance: null,

                defaultStartLocation: {
                    place_id: "ChIJL8tNBh1akWsR49m_8GHtOn8",
                    formatted_address: "Ground Floor/349 Queen St, Brisbane City QLD 4000, Australia",
                    name: "James Cook University, Brisbane Campus"
                },
                defaultEndLocation: {
                    place_id: "ChIJt8LRn-EPkWsRgKbe81qjAgU",
                    formatted_address: "Surfers Paradise QLD 4217, Australia",
                    name: "Surfers Paradise"
                },
                defaultDistance: 250,
                preloadingVisible: true
            };
        },
        mounted(){
            this.numberFormatter = new Intl.NumberFormat('en-AU', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            this.fuelPriceFormatter = new Intl.NumberFormat('en-AU', { 
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            this.loadLocations();
            this.preloadDistanceData();
            this.loadSavedCars();

            setTimeout(() => {
                this.preloadingVisible = false;
            }, 1000);
        },
        methods: {
            openCarSelector(panelInfo){
                this.isCarSelectorVisible = true;
                this.panelIdEdited = panelInfo.panelId;
            },
            hideCarSelector(){
                this.isCarSelectorVisible = false;
            },
            addCar(){
                let newPanel = {
                    panelId: Math.floor(Date.now() / 1000)
                }
                this.cars.push(newPanel);
                this.openCarSelector(newPanel);
            },
            removeCar(panelInfo){
                let carPanelIndex = _.findIndex(this.cars, {panelId: panelInfo.panelId});
                if(carPanelIndex >= 0){
                    this.cars.splice(carPanelIndex, 1);
                }  
            },
            carSelected(car){
                this.hideCarSelector();
                let carPanelIndex = _.findIndex(this.cars, {panelId: this.panelIdEdited});
                if(carPanelIndex >= 0){
                    this.cars.splice(carPanelIndex, 1, _.extend({}, this.cars[carPanelIndex], car));
                    this.saveCars();
                }else{
                    console.error("not found");
                }
            },
            carCancelled(){
                this.hideCarSelector();
                let carPanelIndex = _.findIndex(this.cars, {panelId: this.panelIdEdited});
                if(carPanelIndex >= 0 && !this.cars[carPanelIndex].id){
                    this.cars.splice(carPanelIndex, 1);
                }
                this.panelIdEdited = 0;
            },
            saveCars(){
                this.saveState('cars', this.cars);
            },
            loadSavedCars(){
                this.cars = this.loadState('cars', []);
            },


            changeRoute(){
                this.isDistanceSelectorVisible = true;
            },
            preloadDistanceData(){
                if(this.startLocation == null) this.startLocation = _.extend({}, this.defaultStartLocation);
                if(this.endLocation == null) this.endLocation = _.extend({}, this.defaultEndLocation);
                if(this.distance == null) this.distance = this.defaultDistance;
            },
            distancesCalculated(result){
                this.startLocation = result.from;
                this.endLocation = result.to;
                this.distance = parseFloat(result.distances);
                this.saveLocations();
                this.isDistanceSelectorVisible = false;
            },
            distanceCancelled(){
                this.isDistanceSelectorVisible = false;
            },
            setStartLocation(location){
                this.startLocation = location;
            },
            setEndLocation(location){
                this.endLocation = location;
            },
            loadLocations(){
                this.startLocation = this.loadState('start');
                this.endLocation = this.loadState('end');
                this.distance = this.loadState('distance');
            },
            saveLocations(){
                this.saveState('start', this.startLocation);
                this.saveState('end', this.endLocation);
                this.saveState('distance', this.distance);

            }
        },
        watch: {
        },
        computed: {
            carCarouselStyle(){
                return {
                    'width': ( ((260 + 25) * (this.cars.length + 1) ) + 25 + "px")
                }
            },
            formattedDistance(){
                if(this.numberFormatter){
                    return this.distance ? this.numberFormatter.format(this.distance/1000) : this.distance;
                }else{
                    return this.distance;
                }
            },
            formattedFuelPrice(){
                if(this.fuelPriceFormatter){
                    return this.fuelPrice ? this.fuelPriceFormatter.format(this.fuelPrice) : this.fuelPrice;
                }else{
                    return this.fuelPrice;
                }
            }
        }
}
</script>
<style>
#pre-loading{
    position: fixed;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background: #0f1114;
    display: flex;
    justify-content: center;
    align-items: center;
}
    #pre-loading>div{
        flex: 0 0 50%;
    }
    #pre-loading img{
        width: 100%;
        display: block;
    }
html,body{
    position: relative;
    width: 100%;
    height: 100%;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
}
#map{
    width: 100%;
    height: 100%;

}
.btn.change-route{
    background: #000;
    border:0px none;
    font-weight: bold;
    font-size:15px;
    border-radius: 0;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    padding:8px 20px;

    border-bottom: 3px solid #303030;
    border-right: 3px solid #303030;
    border-left: 3px solid #303030;
    margin-top: -3px;
    position: relative;
    z-index: 1;
    color:#52adfc;
}
.selector-wrapper{
}
.distance-info-panel{
    color:#fff;
}
    .distance-info-panel .location{
        font-weight: bold;
    }
.car-list{
    position: fixed;
    bottom: 25px;
    left:0;
    width: 100%;
    padding-top:50px;
    overflow: auto;
}
.car-list-flex{
    display: flex;
    justify-content: center;
    margin: 0 auto;
}
.car-card:first-child{
    margin-left:25px;
}
.car-card{
    background: rgb(148,71,251);
    background: linear-gradient(360deg, rgba(148,71,251,1) 0%, rgba(48,196,252,1) 100%);
    flex:0 0 260px;
    width:260px;
    border-radius: 10px;
    height: 300px;
    margin:0 25px 0 0;
    color:#fff;
    -webkit-box-shadow: 5px 5px 9px 5px rgba(0,0,0,0.2); 
    box-shadow: 5px 5px 9px 5px rgba(0,0,0,0.2);
}
    .car-card.inactive{
        background: #062eee;
        flex:0 0 255px;
    }
    .car-card-add{
        display: flex;
        flex-direction: column;
        font-weight: bold;
        font-size:22px;
        color:#fff;
        justify-content: center;
    }
    .car-card-add .icon{
        font-size:64px;
    }
.locations-from-to{
    display: block;
    text-align: left;
    padding:18px 25px;
    background:rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 5px 5px 9px 5px rgba(0,0,0,0.2); 
    box-shadow: 5px 5px 9px 5px rgba(0,0,0,0.2);
    border-bottom:3px solid #303030;
}
    .locations-from-to .location{
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .locations-from-to .location span{
        display: inline-block;
        width: 60px;
        color:#8e8e8e;
    }
.factors-info{
    font-size: 20px;
    font-weight: bold;
    padding: 0 5px;
    margin: 20px 25px;
    background: rgb(148,71,251);
    background: linear-gradient(360deg, #708bfc 0%, rgba(48,196,252,1) 100%);
    color: #091842;
    border-radius: 120px;
    display: flex;

    align-items: center;
    text-align: center;
}
@media only screen and (min-width: 450px) {
    .factors-info{
        width:400px;
        margin-left:auto;
        margin-right:auto;
    }
}
    .factors-info>div{
        padding: 10px 0;
        flex:1 1 50%;
    }
    .factors-info>.distance-factor{
        border-right:1px solid #2b3c70;
        padding-right:10px;
        text-align: right;
    }
    .factors-info>.fuel-price-factor{
        border-left:1px solid #2b3c70;
        padding-left:10px;
        text-align: left;
    }
    .factors-info>.factor-icon{
        flex:0 0 40px;
        color:#285476;
    }
    .factors-info .factor-label{
        font-size:12px;
        color:#285476;
    }
</style>
