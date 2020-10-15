import Vue from 'nativescript-vue'


import App from './components/App'
import Intro from './components/Intro'
import Bookings from './components/Bookings'
import VueDevtools from 'nativescript-vue-devtools'
import RadListView from 'nativescript-ui-listview/vue';

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
import store from './store'

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')
Vue.registerElement('Carousel', () => require('nativescript-carousel').Carousel);
Vue.registerElement('CarouselItem', () => require('nativescript-carousel').CarouselItem);
Vue.registerElement("DropDown", () => require("nativescript-drop-down/drop-down").DropDown);
Vue.registerElement("Mapbox", () => require("nativescript-mapbox").MapboxView)

Vue.use(RadListView);

new Vue({
  store,
  //render: h => h('frame', [h(Bookings)])
  render: h => h('frame', [h(Intro)])
}).$start()

//