<template>

    <div v-if="car" class="car-card-inner">
        <div v-if="car.id">
            <div class="car-image">
                <div class="car-logo"><img :src="logoSource(car.make)" /></div>
                <img src="/veiled-car-2.png" />
            </div>
            <div class="car-info">
                <div class="car-make">
                    <!-- <div class="car-logo"><img :src="logoSource(car.make)" /></div> -->
                    {{ car.year }} {{ car.make }}
                </div>
                <div class="car-model">
                    {{ car.model }}
                </div>
                <!-- <div class="car-year">
                    {{ car.year }}
                </div> -->
                <div class="car-efficiency">
                    {{ mpgTokpl(car.comb08U) }} km/litres
                </div>
                <div v-if="infoOnly">
                </div>
                <div class="car-trip-cost" v-else>
                    {{ formatAsCurrency(tripCost) }}
                    <div class="car-trip-consumption">
                        {{ roundOff(tripConsumption) }} litres
                    </div>
                </div>
            </div>
            <div class="car-card-actions">
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button v-if="'select' in controls" type="button" class="btn btn-primary btn-block" @click.stop.prevent="selectCar">Select</button>
                    <button v-if="'change' in controls" type="button" class="btn btn-primary btn-block" @click.stop.prevent="changeCar">Change</button>
                    <button v-if="'remove' in controls" type="button" class="btn btn-primary btn-block" @click.stop.prevent="removeCar">Remove</button>
                </div>
            </div>
        </div>
        <div v-else class="mt-3 d-flex justify-content-center"> 
            <div>No Car Info</div>
        </div>
    </div>
</template>

<script>
    import fuelEconomyApi from '../mixins/FuelEconomyApi.js';
    import unitConverter from '../mixins/UnitConverter.js';
    import carLogo from '../mixins/CarLogo.js';
    export default {
        props: {
            car: null,
            panelId: null,
            fuelPrice: null,
            distance: null,
            controls: {
                default(){
                    return {
                        change: true,
                        remove: true
                    }
                }
            },
            infoOnly: {
                default: false
            }
        },
        mixins: [
            fuelEconomyApi,
            unitConverter,
            carLogo
        ],
        data(){
            return {
                currencyFormatter: null
            };
        },
        mounted(){
            this.currencyFormatter = new Intl.NumberFormat('en-AU', {
                style: 'currency',
                currency: 'AUD',
            });
        },
        methods:{
            changeCar(){
                this.$emit('changeCar', {panelId: this.panelId});
            },
            removeCar(){
                this.$emit('removeCar', {panelId: this.panelId});
            },
            selectCar(){
                this.$emit('selectCar', {car: this.car});
            },
            formatAsCurrency(value){
                return this.currencyFormatter ? this.currencyFormatter.format(value) : value;
            },
            roundOff(value){
                return Math.round(value * 100) / 100
            }
        },
        computed: {
            tripConsumption(){
                // in liter
                return (this.distance / 1000) / this.mpgTokpl(this.car.comb08U);
            },
            tripCost(){
                return (this.fuelPrice / 100) * this.tripConsumption;
            }
        }
    }
</script>
<style>
    .car-card-inner{
        position: relative;
        text-align: left;
        font-weight: 500;
        height: 100%;
        padding-bottom: 40px;
    }
    .car-image{
        position: relative;
        top:-50px;
        margin:0 15px 0 15px;
        width: calc(100% - 30px);
    }
    .car-image>img{
        display: block;
        width: 100%;
    }
    .car-image .car-logo{
        height:30px;
        width:30px;
        position: absolute;
        left:50%;
        margin-left:-15px;
        top:50%;
        margin-top:-15px;
    }
    .car-image .car-logo img{
        max-height: 100%;
        max-width: 100%;
        display: block;
    }
    .car-info{
        margin-top:-30px;
        padding:0 25px;
        text-shadow: 2px 2px 2px rgba(0,0,0,0.15);
    }
    .car-model{
        font-size: 28px;
        line-height: 1em;
        margin-bottom: 10px;
          white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
    }
    .car-make{
        font-size:18px;
    }
    .car-make .car-logo{
        height: 18px;
        display: inline-block;
        margin-right:5px;
    }
    .car-make .car-logo img{
        max-height: 100%;
        max-width: 100%;
        display: block;
    }
    .car-year{
        font-size:14px;
    }
    .car-efficiency{
        font-size:16px;
    }
    .car-trip-cost{
        margin-top:30px;
        font-size: 28px;
        line-height: 1em;
    }
    .car-trip-consumption{
        font-size:13px;
    }
    .car-card-actions{
        margin-top:10px;
        text-align: center;
        position: absolute;
        bottom: 0;
        left:0;
        width:100%;
    }
    .car-card-actions .btn-group{
        width: 100%;
        border:0px none;
        border-radius: 0;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        overflow: hidden;
    }
    .car-card-actions .btn{
        padding:10px 0;
        background: rgba(255, 255, 255, 0.5);
        color:#4b0fc6;
        flex:1 1 50%;
        border:0px none;
        border-radius: 0;
        text-transform: uppercase;
        font-size: 13px;
        font-weight: bold;
    }
</style>