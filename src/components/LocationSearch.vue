<template>
    <div>
        <div class="">
            <label v-if="label">{{ label }}</label>
            <input v-if="selectedAddress" class="form-control" readonly type="text" :value="selectedAddress.name">
            <input v-else class="form-control" @keyup="searchKeyUp" v-model="searchQuery" type="text">
        </div>
        <div v-if="suggestions && suggestions.length > 0">
            <div v-for="suggestion in suggestions" 
                :key="suggestion.place_id"
                @click.stop.prevent="selectAddress(suggestion)">
                {{ suggestion.formatted_address }}
            </div>
        </div>
    </div>

</template>

<script>
    import Maps from '../mixins/Maps';
    export default {
        mixins: [
            Maps
        ],
        props: {
            label: null,
            map: null,
            suggestions: null
        },
        data(){
            return {
                searchQuery: null,
                selectedAddress: null,
                keyUpTimeout: null
            };
        },
        methods:{
            selectAddress(address){
                this.$emit('selected', address);
                this.selectedAddress = address;
            },
            searchKeyUp(){
                // clear timeout keyUpTimeout
                clearTimeout(this.keyUpTimeout);
                
                this.keyUpTimeout = setTimeout(() => {
                    console.log('searching for ' + this.searchQuery);
                    this.$emit('searching', this.searchQuery);
                }, 1000);
            },
        },
        computed: {
        }
    }
</script>