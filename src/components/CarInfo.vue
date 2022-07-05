<template>

    <div class="card text-center" v-if="car">
        <div v-if="car.id" class="p-3">
            <div class="mb-3 h3">
                {{ car.make }}
                {{ car.model }}
            </div>
            <div class="border">
                <div class="h5 border-bottom py-2">
                    <font-awesome-icon icon="fa-solid fa-gas-pump" />
                    Efficiency
                </div>
                <div>
                    <div class="mb-3">
                        <font-awesome-icon icon="fa-solid fa-road-bridge" />
                        Combined: 
                        <div>
                            {{ car.comb08U }}mpg
                            or {{ mpgTokpl(car.comb08U) }}km/l
                        </div>
                    </div>
                    <div class="mb-3">
                        <font-awesome-icon icon="fa-solid fa-city" />
                        City: 
                        <div>
                            {{ car.city08U }}mpg
                            or {{ mpgTokpl(car.city08U) }}km/l
                        </div>
                    </div>
                    <div class="mb-3">
                        <font-awesome-icon icon="fa-solid fa-road" />
                        Highway: 
                        <div>
                            {{ car.highway08U }}mpg
                            or {{ mpgTokpl(car.city08U) }}km/l
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <button class="btn btn-primary" @click.stop.prevent="triggerSelectCar">Change Car</button>
            </div>
        </div>
        <div v-else class="mt-3"> 
            <button class="btn btn-primary" @click.stop.prevent="triggerSelectCar">Select Car</button>
        </div>
    </div>
</template>

<script>
    import fuelEconomyApi from '../mixins/FuelEconomyApi.js';
    import unitConverter from '../mixins/UnitConverter.js';
    export default {
        props: {
            car: null,
            panelId: null
        },
        mixins: [
            fuelEconomyApi,
            unitConverter
        ],
        data(){
            return {

            };
        },
        methods:{
            triggerSelectCar(){
                this.$emit('selectCar', {index: this.panelId});
            }
        }
    }
</script>