<template>
  <Page @loaded="onPageLoaded" actionBarHidden="true" background="#f2f2f2">
    <GridLayout>
      <GridLayout rows="2*,2*" padding="0 20">
          <StackLayout row="1">
            <Label text="Pantlämningar" fontWeight="bold" fontSize="23" class="titleColor"/>
            <Label text="Markera den pant som du är intresserad av att hämta" textWrap="true" fontWeight="bold"
                   fontSize="16" class="titleColor" marginTop="12"/>
            <RadListView ref="listView"
                         for="(item, index) in displayBookings"
                          @itemTap="onItemTap"
                          height="200">
              <v-template>
                <StackLayout orientation="vertical" padding="10" borderBottomWidth="1" borderBottomColor="black" :backgroundColor="item.selected ? '#eeeeee':'white'">
                  <Label class="bodyTextColor" textWrap="true" fontSize="18">
                    <FormattedString>
                      <Span>{{index}}. </Span>
                      <Span>{{item.start_formated}}</Span>
                    </FormattedString>
                  </Label>
                </StackLayout>
              </v-template>
            </RadListView>
            <Button text="Hämta markerad pant" @onTap="onCollectTap" marginTop="30" textTransform="none" background="#1f2d40" color="white" borderRadius="40" width="80%" height="57" fontSize="21" class="bodyTextColor"/>
          </StackLayout>
        <Mapbox row="0"
                ref="map"
                accessToken="pk.eyJ1IjoidHJpcHRlYyIsImEiOiJja2R0d2ZtNHMwMGM5MzdxNHVwZGcyeG1xIn0.yAZW46zUKkS9RL3O7kBWaQ"
                mapStyle="mapbox://styles/mapbox/light-v9"
                latitude="60.6708058985168"
                longitude="17.14024985657789"
                hideCompass="true"
                zoomLevel="4"
                showUserLocation="true"
                disableZoom="false"
                disableRotation="false"
                disableScroll="false"
                disableTilt="false"
                @mapReady="onMapReady($event)">
        </Mapbox>
        <Image row="0" src="~/assets/images/dots.png" stretch="fill" horizontalAlignment="left" verticalAlignment="top"
               marginTop="30" marginLeft="25" width="25" height="25"/>
        <Image row="0" src="~/assets/images/Pantr_logo@3x.png" stretch="fill" horizontalAlignment="center"
               verticalAlignment="top" width="150" height="35" marginTop="25"/>
        <Image row="0" src="~/assets/images/icon_help@3x.png" stretch="fill" horizontalAlignment="right"
               verticalAlignment="top" marginTop="30" marginRight="25" width="25" height="25"/>
      </GridLayout>
    </GridLayout>
  </Page>
</template>

<script>
import date from 'date-and-time';
import collection from '../services/collection'
import session from '../services/session'
import config from "../config";
import {Booking, Confirmation, Retriever} from "../models";

export default {
  data() {
    return {
      map: null,
      displayBookings: [],
      markers: [],
      booking_requests: [],
      confirmations: [],
    }
  },
  methods: {
    async onPageLoaded() {
      const center = this.$store.state.selectedCoordinates;
      console.log(center);
      await session.create("recycleconsumer@gia.fpx.se", "test");
      this.booking_requests = (await collection.fetchItemsByNameWithin(config.BOOKING_COLLECTION_NAME, {
        x: center.lng,
        y: center.lat
      }, 50000)).map((i) => Booking.from_item(i));
      this.confirmations = await this.getConfirmations();
      let bookings = [];
      for (const booking of this.booking_requests) {
        let displayBooking = {}
        displayBooking.uuid = booking.uuid;
        displayBooking.selected = this.confirmations.map((c) => c.booking_uuid).includes(booking.uuid);
        displayBooking.start_formated = date.format(new Date(booking.start), "HH:mm dddd");
        let marker = {
          id: booking.uuid,
          lat: booking.coordinates[1],
          lng: booking.coordinates[0],
          title: booking.retriever_uuid,
          onTap: this.onMarkerTap,
          iconPath: displayBooking.selected ? "assets/images/icon_mapmark_onmap_selected.png" : "assets/images/icon_mapmark_onmap_unselected.png",
        };
        bookings.push(displayBooking);
        this.markers.push(marker);
      }
      this.map.addMarkers(this.markers);
      this.displayBookings = bookings
    },

    async onMapReady(args) {
      this.map = args.map;
      const center = this.$store.state.selectedCoordinates;
      await this.map.setCenter({
        lat: center.lat,
        lng: center.lng,
        animated: true
      });

      await this.map.setZoomLevel({
        level: 16
      });
    },

    onItemTap({ item: displayBooking }) {
      this.toggleBooking(displayBooking.uuid)
    },

    onMarkerTap(marker) {
      this.toggleBooking(marker.id);
    },

    toggleBooking(id) {
      const booking = this.displayBookings.find((b) => b.uuid === id);
      const marker = this.markers.find((m) => m.id === id);
      booking.selected = !booking.selected
      if(booking.selected) {
        marker.iconPath = "assets/images/icon_mapmark_onmap_selected.png"
      } else {
        marker.iconPath = "assets/images/icon_mapmark_onmap_unselected.png"
      }
      this.map.removeMarkers([marker.id]);
      this.map.addMarkers([marker]);
    },

    async onCollectTap() {
        let selectedBookingUuids = this.displayBookings.filter((b) => b.selected).map((b) => b.uuid);
        selectedBookingUuids = selectedBookingUuids.filter((uuid) => !this.confirmations.map((c) => c.booking_uuid).includes(uuid));
        const selectedBookings = this.booking_requests.filter((b) => selectedBookingUuids.includes(b.uuid))
        let confirmations = selectedBookings.map((b) =>  {
          const confirmation = new Confirmation();
          confirmation.coordinates = b.coordinates;
          confirmation.booking_uuid = b.uuid;
          return confirmation;
        });

        console.log("fetching collections by name");
        const collections = await collection.fetchCollections();
        console.log("collections: " + JSON.stringify(collections));

        let confirmationCollection = collections.find(c => c.name === config.CONFIRMATION_COLLECTION_NAME && c.provider_uuid === session.user.provider_uuid);
        console.log("confirmationCollection: " + JSON.stringify(confirmationCollection));

        if (confirmationCollection == null) {
          console.log("creating new collection");
          confirmationCollection = await collection.create(config.CONFIRMATION_COLLECTION_NAME, false);
          console.log("created collection: " + JSON.stringify(confirmationCollection));
        }

        console.log("adding confirmations to collection");
        for(let confirmation of confirmations) {
          console.log("confirmation:" + JSON.stringify(confirmation.to_item()))
          this.confirmations.push(confirmation);
          await collection.createItem(confirmationCollection.uuid, confirmation.to_item());
        }
    },

    async getConfirmations() {
      console.log("fetching collections by name");
      const collections = await collection.fetchCollections();
      console.log("collections: " + JSON.stringify(collections));

      let confirmationCollection = collections.find(c => c.name === config.CONFIRMATION_COLLECTION_NAME && c.provider_uuid === session.user.provider_uuid);
      console.log("confirmationCollection: " + JSON.stringify(confirmationCollection));
      let confirmations = [];
      if (confirmationCollection != null) {
        confirmations = (await collection.fetchItems(confirmationCollection.uuid)).map((i) => Confirmation.from_item(i))
      }
      return confirmations;
    },
  }
}
</script>

<style scoped>

</style>
