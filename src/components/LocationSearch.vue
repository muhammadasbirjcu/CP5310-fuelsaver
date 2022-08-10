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
            <input v-else class="form-control"
                :id="inputId" 
                :class="{'suggestions-active' : suggestionsVisible}" 
                @keyup="searchKeyUp" 
                v-model="searchQuery" type="text">
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
    import Maps from '../mixins/Maps';
    export default {
        mixins: [
            Maps
        ],
        props: {
            inputId: null,
            label: null,
            map: null,
            suggestions: null,
            controlsEnabled: {
                default: false
            }
        },
        data(){
            return {
                searchQuery: null,
                selectedAddress: null,
                keyUpTimeout: null,
                isEditing: false
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
.edit-address-btn{
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
</style>