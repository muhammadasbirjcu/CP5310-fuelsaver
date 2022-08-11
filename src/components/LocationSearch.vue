<template>
    <div>
        <div class="">
            <label v-if="label" class="form-label" :for="inputId">{{ label }}</label>
            <div v-if="!isEditing && selectedAddress" class="d-flex form-control">
                <div class="selected-address">
                    {{ selectedAddress.name }}
                    <div class="loc-suggestion-address">
                        {{ selectedAddress.formatted_address }}
                    </div>
                </div>
                <button v-if="controlsEnabled" class="edit-address-btn" @click.stop.prevent="editSelectedAddress">
                    <font-awesome-icon icon="fa-solid fa-pencil" />
                </button>
            </div>
            <div v-else class="d-flex">
                <input class="form-control"
                    :id="inputId" 
                    :class="{'suggestions-active' : suggestionsVisible}" 
                    @keyup="searchKeyUp" 
                    v-model="searchQuery" type="text">
                <button 
                    @click.stop.prevent="initDevicePosition" 
                    class="current-location-btn"
                    v-if="allowDeviceLocation" style="flex:0 0 60px">
                    <font-awesome-icon v-if="ownLocationBusy" icon="fa-solid fa-spinner" spin />
                    <font-awesome-icon v-else icon="fa-solid fa-location-crosshairs" />
                </button>
            </div>
        </div>
        <div class="loc-suggestions-wrapper">
            <div v-if="suggestionsVisible" class="loc-suggestions">
                <div v-for="suggestion in suggestions" 
                    :key="suggestion.place_id"
                    @click.stop.prevent="selectAddress(suggestion)"
                    class="loc-suggestion">
                    {{ suggestion.name }}
                    <div class="loc-suggestion-address">
                        {{ suggestion.formatted_address }}
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import DeviceGPS from '../mixins/DeviceGPS';
    import Maps from '../mixins/Maps';
    export default {
        mixins: [
            DeviceGPS,
            Maps
        ],
        props: {
            inputId: null,
            label: null,
            suggestions: null,
            controlsEnabled: {
                default: false
            },
            allowDeviceLocation: {
                default: false
            }
        },
        data(){
            return {
                searchQuery: null,
                selectedAddress: null,
                keyUpTimeout: null,
                isEditing: false,
                ownLocationBusy: false
            };
        },
        methods:{
            selectAddress(address){
                this.$emit('selected', address);
                this.isEditing = false;
                this.searchQuery = address.formatted_address;
                this.selectedAddress = address;
            },
            editSelectedAddress(){
                this.isEditing = true;
            },
            searchKeyUp(){
                // clear timeout keyUpTimeout
                clearTimeout(this.keyUpTimeout);
                
                this.keyUpTimeout = setTimeout(() => {
                    this.$emit('searching', this.searchQuery);
                }, 1000);
            },
            initDevicePosition(){
                // existing request is already on-going
                if(this.ownLocationBusy){
                    return;
                }
                this.ownLocationBusy = true;
                this.getDevicePosition().then((position) => {
                    this.reverseGeolocation(position).then((response) => {
                        if(response.length > 0){
                            this.selectAddress({
                                name: "You Current Location",
                                formatted_address: response[0].formatted_address,
                                place_id: response[0].place_id
                            });
                        }
                        this.ownLocationBusy = false;
                    }).catch((error) => {
                        this.ownLocationBusy = false;
                    });
                }).catch((error) => {
                    this.ownLocationBusy = false;
                    console.log(error);
                    alert("Unable to detect your current location");
                });
            }
        },
        computed: {
            suggestionsVisible(){
                return this.suggestions && this.suggestions.length > 0
            }
        }
    }
</script>
<style>
.loc-suggestions-wrapper{
    position: relative;
}
.loc-suggestions{
    position: absolute;
    top:-1px;
    width: 100%;
    background: #fff;
    -webkit-box-shadow: 0px 11px 15px -1px rgba(0,0,0,0.35); 
box-shadow: 0px 11px 15px -1px rgba(0,0,0,0.35);
    border-bottom-left-radius:0.375rem;
    border-bottom-right-radius:0.375rem;
    z-index: 99;
}
.loc-suggestion{
    padding: 0.375rem 0.75rem;
    border: 1px solid #ced4da;
    cursor: pointer;
    text-align: left;
}
.loc-suggestion:hover{
    background: #efefef;
}
.loc-suggestion:last-child{
    border-bottom-left-radius:0.375rem;
    border-bottom-right-radius:0.375rem;
}
.loc-suggestion-address{
    font-size: 13px;
}
.form-control.suggestions-active{
    border-bottom-left-radius:0;
    border-bottom-right-radius:0;

}
.selected-address{
    flex: 1 1 100px;
}
.edit-address-btn, .current-location-btn{
    border-radius: 5px;
    flex: 0 0 60px;
    text-align: center;
    background: #0e6efd;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: -0.375em -0.75em;
    border:0px none;

}
.current-location-btn{
    margin:0;
}
</style>