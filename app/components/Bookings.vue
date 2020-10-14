<template>
  <Page @loaded="onPageLoaded" actionBarHidden="true" background="#f2f2f2">
    <GridLayout>
      <GridLayout rows="2*,*" padding="0 20">
          <StackLayout row="1">
            <Label text="Pantlämningar" fontWeight="bold" fontSize="23" class="titleColor"/>
            <Label text="Markera den pant som du är intresserad av att hämta" textWrap="true" fontWeight="bold"
                   fontSize="16" class="titleColor" marginTop="12"/>
            <RadListView ref="listView"
                         for="(item, index) in bookings"
                          @itemTap="onItemTap">
              <v-template>
                <StackLayout orientation="vertical" padding="10" borderBottomWidth="1" borderBottomColor="black" :backgroundColor="item.selected ? '#eeeeee':'white'">
                  <Label class="bodyTextColor" textWrap="true" fontSize="18">
                    <FormattedString>
                      <Span>{{index}}. </Span>
                      <Span>{{item.properties.start}}</Span>
                    </FormattedString>
                  </Label>
                </StackLayout>
              </v-template>
            </RadListView>
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
      const bookings = await collection.fetchItemsByNameWithin("fpx_recycle_consumer", {
        x: center.lng,
        y: center.lat
      }, 50000);
      for (let booking of bookings) {
        booking.selected = false;
        booking.properties.start = date.format(new Date(booking.properties.start), "HH:mm dddd");
        let marker = {
          id: booking.uuid,
          lat: booking.geometry.coordinates[1],
          lng: booking.geometry.coordinates[0],
          title: booking.properties.name,
          onTap: this.onMarkerTap,
          iconPath: "assets/images/icon_mapmark_onmap_unselected.png",
        };
        this.markers.push(marker);
        this.map.addMarkers([marker]);
      }
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
      this.map.addMarkers([marker]);
    },
  }
}
</script>

<style scoped>

</style>
