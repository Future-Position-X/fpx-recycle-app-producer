<template>
  <Page @loaded="onPageLoaded" actionBarHidden="true" background="#f2f2f2">
    <GridLayout>
      <GridLayout rows="2*,2*" padding="0 20">
          <StackLayout row="1">
            <Label text="Pantlämningar" fontWeight="bold" fontSize="23" class="titleColor"/>
            <Label text="Markera den pant som du är intresserad av att hämta" textWrap="true" fontWeight="bold"
                   fontSize="16" class="titleColor" marginTop="12"/>
            <RadListView ref="listView"
                         for="(item, index) in bookings"
                          @itemTap="onItemTap"
                          height="200">
              <v-template>
                <StackLayout orientation="vertical" padding="10" borderBottomWidth="1" borderBottomColor="black" :backgroundColor="item.selected ? '#eeeeee':'white'">
                  <Label class="bodyTextColor" textWrap="true" fontSize="18">
                    <FormattedString>
                      <Span>{{index}}. </Span>
                      <Span>{{item.properties.start_formated}}</Span>
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
/* global CONSUMERS_COLLECTION_NAME */
import date from 'date-and-time';
import collection from '../services/collection'
import session from '../services/session'

export default {
  data() {
    return {
      map: null,
      bookings: [],
      markers: [],
    }
  },
  methods: {
    async onPageLoaded() {
      const center = this.$store.state.selectedCoordinates;
      console.log(center);
      await session.create("recycleconsumer@gia.fpx.se", "test");
      this.booking_requests = await collection.fetchItemsByNameWithin(CONSUMERS_COLLECTION_NAME, {
        x: center.lng,
        y: center.lat
      }, 50000);
      let bookings = [];
      for (let booking of this.booking_requests) {
        let newBooking = Object.create(booking)
        newBooking.selected = false;
        newBooking.properties.start_formated = date.format(new Date(newBooking.properties.start), "HH:mm dddd");
        let marker = {
          id: newBooking.uuid,
          lat: newBooking.geometry.coordinates[1],
          lng: newBooking.geometry.coordinates[0],
          title: newBooking.properties.name,
          onTap: this.onMarkerTap,
          iconPath: "assets/images/icon_mapmark_onmap_unselected.png",
        };
        bookings.push(newBooking);
        this.markers.push(marker);
      }
      this.map.addMarkers(this.markers);
      this.bookings = bookings
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
    onItemTap({ item }) {
      this.toggleBooking(item.uuid)
    },
    onMarkerTap(marker) {
      this.toggleBooking(marker.id);
    },
    toggleBooking(id) {
      const booking = this.bookings.find((b) => b.uuid === id);
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
        const selectedBookingUuids = this.bookings.filter((b) => b.selected).map((b) => b.uuid);
        const selectedBookings = this.booking_requests.filter((b) => selectedBookingUuids.includes(b.uuid))
        selectedBookings.forEach((b) => {
          b.properties.origin_uuid = b.uuid;
          delete b.uuid;
        });

        console.log("fetching collections by name");
        const collections = await collection.fetchCollections();
        console.log("collections: " + JSON.stringify(collections));

        let recycleCollection = collections.find(c => c.name === CONSUMERS_COLLECTION_NAME && c.provider_uuid === session.user.provider_uuid);
        console.log("recycleCollection: " + JSON.stringify(recycleCollection));

        if (recycleCollection == null) {
          console.log("creating new collection");
          recycleCollection = await collection.create(CONSUMERS_COLLECTION_NAME, false);
          console.log("created collection: " + JSON.stringify(recycleCollection));
        }

        console.log("adding items to collection");
        for(let item of selectedBookings) {
          console.log("item:" + JSON.stringify(item))
          await collection.createItem(recycleCollection.uuid, item);
        }
    }
  }
}
</script>

<style scoped>

</style>
