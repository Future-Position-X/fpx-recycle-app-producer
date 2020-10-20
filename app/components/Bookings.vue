<template>
  <Page @loaded="onPageLoaded" actionBarHidden="true" background="#f2f2f2">
    <GridLayout>
      <GridLayout>
          <Image row="0" src="~/assets/images/dots.png" stretch="fill" horizontalAlignment="left" verticalAlignment="top"
                marginTop="30" marginLeft="25" width="25" height="25"/>
          <Image row="0" src="~/assets/images/Pantr_logo@3x.png" stretch="fill" horizontalAlignment="center"
                verticalAlignment="top" width="150" height="35" marginTop="25"/>
          <Image row="0" src="~/assets/images/icon_help@3x.png" stretch="fill" horizontalAlignment="right"
                verticalAlignment="top" marginTop="30" marginRight="25" width="25" height="25"/>
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

          <GridLayout :height="hideCard ? 70 : 400" @onTap="onCardTap" verticalAlignment="bottom" background="white" margin="20" padding="0" borderRadius="20" androidElevation="12">
            <GridLayout margin="20 20 15">
              <StackLayout v-show="!showRetrievals">
                <Label text="Pantlämningar" fontWeight="bold" fontSize="23" class="titleColor" horizontalAlignment="center"/>
                <Label text="Markera den pant som du vill att hämta" textWrap="true"
                      fontSize="16" class="titleColor" marginTop="12" horizontalAlignment="center"/>
                <RadListView ref="listView"
                            for="(item, index) in displayBookings"
                              @itemTap="onItemTap"
                              height="220"
                              marginTop="15">
                  <v-template>
                    <GridLayout columns="auto, *" orientation="vertical" padding="5" borderBottomWidth="2" borderBottomColor="#ebeced">
                      <Image column="0" marginRight="10" :width="item.selected ? 26 : 20" :height="item.selected ? 26 : 20" stretch="fill" horizontalAlignment="left" :src="item.image_src"/>
                      <Label column="1" class="bodyTextColor" textWrap="true" fontSize="16">
                        <FormattedString>
                          <Span>{{index + 1}}. </Span>
                          <Span fontWeight="bold" text="Hämta senast: "/>
                          <Span>{{item.start_formated}}</Span>
                        </FormattedString>
                      </Label>
                    </GridLayout>
                  </v-template>
                </RadListView>
                <Button text="Hämta pant" @onTap="onCollectTap" marginTop="10" textTransform="none" background="#0aa67a" color="white" borderRadius="40" width="70%" height="50" fontSize="16" class="bodyTextColor"/>
              </StackLayout>

              <StackLayout v-show="showRetrievals">
                <Label text="Mina panthämtningar" fontWeight="bold" fontSize="23" class="titleColor" horizontalAlignment="center"/>
                <Label text="Markera när du har hämtat panten" textWrap="true"
                      fontSize="16" class="titleColor" marginTop="12" horizontalAlignment="center"/>
                <RadListView ref="listView"
                            for="(item, index) in displayRetrievals"
                              @itemTap="onItemTap"
                              height="220"
                              marginTop="15">
                  <v-template>
                    <GridLayout columns="auto, *, auto" orientation="vertical" padding="5" borderBottomWidth="2" borderBottomColor="#ebeced">
                      <Image column="0" marginRight="10" width="26" height="26" stretch="fill" horizontalAlignment="left" :src="item.image_src"/>
                      <Label column="1" verticalAlignment="center" class="bodyTextColor" textWrap="true" fontSize="16">
                        <FormattedString>
                          <Span fontWeight="bold" text="Senast: "/>
                          <Span>{{item.start_formatted}}</Span>
                        </FormattedString>
                      </Label>
                      <Label @loaded="onLabelLoaded" @onTap="onRetrievedTap(item)" column="2" text="Hämtad" background="#0aa67a" color="white" borderRadius="20" width="27%" height="30" fontSize="16" class="bodyTextColor"/>
                    </GridLayout>
                  </v-template>
                </RadListView>
                <Button text="Ändra områden" @onTap="onCollectTap" marginTop="10" textTransform="none" background="#0aa67a" color="white" borderRadius="40" width="70%" height="50" fontSize="16" class="bodyTextColor"/>
              </StackLayout>
            </GridLayout>
          </GridLayout>

      </GridLayout>
    </GridLayout>
  </Page>
</template>

<script>
import date from 'date-and-time';
import se from 'date-and-time/locale/se';
import collection from '../services/collection'
import session from '../services/session'
import config from "../config";
import {Booking, Confirmation, Retriever, BookingStatus} from "../models";
import {isAndroid} from 'tns-core-modules/platform';

export default {
  props: ['showRetrievals'],
  data() {
    return {
      map: null,
      displayBookings: [],
      markers: [],
      booking_requests: [],
      confirmations: [],
      displayRetrievals: [],
      hideCard: true
    }
  },
  methods: {
    async onPageLoaded() {
      date.locale(se);
      
      await session.create("recycleconsumer@gia.fpx.se", "test");
      
      if (this.showRetrievals) {
        await this.displayConfirmations();
      } else {
        await this.showBookings();
      }
    },
    onCardTap() {
      this.hideCard = !this.hideCard;
    },
    async showBookings() {
      const center = this.$store.state.selectedCoordinates;
      console.log(center);
      this.booking_requests = (await collection.fetchItemsByNameWithin(config.BOOKING_COLLECTION_NAME, {
        x: center.lng,
        y: center.lat
      }, 50000)).map((i) => Booking.from_item(i));
      this.confirmations = await this.getConfirmations();
      let bookings = [];
      for (const booking of this.booking_requests) {
        let index = this.booking_requests.indexOf(booking);
        let displayBooking = {}
        displayBooking.uuid = booking.uuid;
        displayBooking.selected = this.confirmations.map((c) => c.booking_uuid).includes(booking.uuid);
        displayBooking.start_formated = date.format(new Date(booking.start), "ddd DD/MM HH:mm");
        displayBooking.image_src = displayBooking.selected
            ? `~/assets/images/markers/selected_big_${index + 1}.png`
            : `~/assets/images/markers/unselected_${index + 1}.png`;
        
        let marker = {
          id: booking.uuid,
          lat: booking.coordinates[1],
          lng: booking.coordinates[0],
          title: booking.retriever_uuid,
          onTap: this.onMarkerTap,
          iconPath: displayBooking.selected 
            ? `assets/images/markers/selected_${index + 1}.png`
            : `assets/images/markers/unselected_${index + 1}.png`,
        };
        bookings.push(displayBooking);
        this.markers.push(marker);
      }
      this.map.addMarkers(this.markers);
      this.displayBookings = bookings
    },
    async displayConfirmations() {
      const confirmations = await this.getConfirmations();
      const displayConfs = [];

      for (const c of confirmations) {
        const item = await collection.fetchItem(c.booking_uuid);
        const index = confirmations.indexOf(c);
        
        displayConfs.push({
          booking: item,
          start_formatted: date.format(new Date(item.properties.pantr_start), "ddd HH:mm"),
          image_src: "~/assets/images/markers/selected_big_" + (index + 1) + ".png"
        });
        
        this.markers.push({
          id: item.uuid,
          lat: item.geometry.coordinates[1],
          lng: item.geometry.coordinates[0],
          iconPath: `assets/images/markers/selected_${index + 1}.png`
        });
      }

      this.displayRetrievals = displayConfs;
      this.map.addMarkers(this.markers);
    },
    async onRetrievedTap(item) {
      console.log("onRetrievedTap " + JSON.stringify(item));
      item.booking.properties.pantr_status = BookingStatus.DONE;
      await collection.updateItem(item.booking);
    },
    onLabelLoaded(args) {
      if (isAndroid) {
        args.object.nativeView.setGravity(17)
      }
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    async onMapReady(args) {
      this.map = args.map;
      await this.sleep(1000);
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
      const index = this.displayBookings.indexOf(booking);
      booking.selected = !booking.selected
      booking.image_src = booking.selected
            ? `~/assets/images/markers/selected_big_${index + 1}.png`
            : `~/assets/images/markers/unselected_${index + 1}.png`;
      marker.iconPath = booking.selected
        ? `assets/images/markers/selected_${index + 1}.png`
        : `assets/images/markers/unselected_${index + 1}.png`;
        
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
    }
  }
}
</script>

<style scoped>

</style>
