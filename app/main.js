import Vue from 'nativescript-vue'


import App from './components/App'
import Intro from './components/Intro'
import VueDevtools from 'nativescript-vue-devtools'

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

new Vue({
  store,
  //render: h => h('frame', [h(App)])
  render: h => h('frame', [h(Intro)])
}).$start()
