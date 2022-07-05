<template>
    <div v-if="isCarSelectorVisible" @click.stop.prevent="hideCarSelector" class="modal-backdrop fade show"></div>
    <div class="container mx-3">
        <div class="modal" tabindex="-1" :class="{'d-block' : isCarSelectorVisible}">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                        <CarSelector @carSelected="carSelected" />
                    </div>
                </div>
            </div>
        </div>
        <div class="selector-wrapper mx-1">
            <div class="d-flex">
                <div class="selector-wrapper mx-1" v-for="car in cars" :key="car.panelId">
                    <CarInfo :car="car" @selectCar="openCarSelector" :panel-id="car.panelId" />
                </div>
            </div>
            <div>
                <button class="btn btn-default" @click.stop.prevent="addCar">Add Car</button>
            </div>
        </div>
    </div>
</template>
<script>
    import CarSelector from './components/CarSelector.vue';
    import CarInfo from './components/CarInfo.vue';
    import _ from 'lodash';

    export default {
        components: { 
            CarSelector,
            CarInfo 
        },
        data() {
            return {
                cars: [],
                panelIdEdited: 0,
                isCarSelectorVisible: false
            };
        },
        methods: {
            openCarSelector(panelId){
                this.isCarSelectorVisible = true;
                this.panelIdEdited = panelId;
            },
            hideCarSelector(){
                this.isCarSelectorVisible = false;
            },
            addCar(){
                let newPanel = {
                    panelId: Math.floor(Date.now() / 1000)
                }
                this.cars.push(newPanel);
                this.openCarSelector(newPanel.panelId);
            },
            carSelected(car){
                console.log("cars", this.cars);
                console.log("panelIdEdited", this.panelIdEdited);
                console.log("car", car);
                this.hideCarSelector();
                let carPanelIndex = _.findIndex(this.cars, {panelId: this.panelIdEdited});
                console.log("panel id", carPanelIndex);
                if(carPanelIndex >= 0){
                    this.cars.splice(carPanelIndex, 1, _.extend({}, this.cars[carPanelIndex], car));
                }else{
                    console.error("not found");
                }
                
            }
        }
}
</script>
<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
.selector-wrapper{
    max-width: 400px;
    flex:0 0 400px;
}
</style>
