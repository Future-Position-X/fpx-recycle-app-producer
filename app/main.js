import Vue from 'nativescript-vue'
import {BackgroundFetch} from "nativescript-background-fetch";
const appSettings = require("tns-core-modules/application-settings");
//const retriever_uuid = appSettings.getString("retriever_uuid")
const retriever_uuid = "2d7259af-01db-4cc5-b53f-495b078414a1";
/*if(!retriever_uuid) {
  appSettings.setString("retriever_uuid", "2d7259af-01db-4cc5-b53f-495b078414a1")
}*/

import App from './components/App'
import Intro from './components/Intro'
import VueDevtools from 'nativescript-vue-devtools'
import RadListView from 'nativescript-ui-listview/vue';
import collection from './services/collection';
import booking from './services/booking';
import {BookingStatus} from "./models";
import notification from './services/notification';
import session from './services/session';

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

const vue = new Vue({
  store,
  //render: h => h('frame', [h(Bookings)])
  render: h => h('frame', [h(Intro)])
});

vue.$start();

BackgroundFetch.configure({
  stopOnTerminate: false,
  minimumFetchInterval: 30,  // minutes
  stopOnTerminate: false,    // Android-only
  startOnBoot: true          // Android-only
}, async () => {
  console.log("[js] BackgroundFetch event received");
  const retriever = await collection.fetchItem("2d7259af-01db-4cc5-b53f-495b078414a1");
  await session.create("recycleconsumer@gia.fpx.se", "test");
  const bookings = await booking.findBookingsInArea(retriever.geometry.coordinates[1], retriever.geometry.coordinates[0]);

  const bookingsAvailable = bookings.some(b => b.status === BookingStatus.WAITING);

  if (bookingsAvailable) {
      notification.show("Det finns nya pantinlämningar inom ditt område!", function (n) {
      if (n.response === "yes") {
        vue.$navigateTo(App);
      }
    });
  }
  //
  // Do stuff.  You have 30s of background-time.
  //
  // When your job is complete, you must signal completion or iOS can kill your app.  Signal the nature of the fetch-event, whether you recevied:
  // FETCH_RESULT_NEW_DATA: Received new data from your server
  // FETCH_RESULT_NO_DATA:  No new data received from your server
  // FETCH_RESULT_FAILED:  Failed to receive new data.
  BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
}, (status) => {
  console.log('BackgroundFetch not supported by your OS', status);
});

//