import { createApp } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner, faRoadBridge, faCity, faRoad, faGasPump } from '@fortawesome/free-solid-svg-icons'
library.add(faSpinner, faRoadBridge, faCity, faRoad, faGasPump)

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
