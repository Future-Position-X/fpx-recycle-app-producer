<template>
    <Page @loaded="onPageLoaded" actionBarHidden="true">
        <GridLayout columns="*" rows="*, auto">
            <Mapbox
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
          <Image src="~/assets/images/icon_mapmark_onmap@3x.png" stretch="none" horizontalAlignment="center" verticalAlignment="center" marginBottom="87" />
          <Image src="~/assets/images/dots.png" stretch="fill" horizontalAlignment="left" verticalAlignment="top" marginTop="30" marginLeft="25" width="25" height="25"/>
          <Image src="~/assets/images/Pantr_logo@3x.png" stretch="fill" horizontalAlignment="center" verticalAlignment="top" width="150" height="35" marginTop="25"/>
          <Image src="~/assets/images/icon_help@3x.png" @onTap="onHelpTap" stretch="fill" horizontalAlignment="right" verticalAlignment="top" marginTop="30" marginRight="25" width="25" height="25"/>
          <Button @onTap="onShowBookingsTap" text="Visa pantlämningar" verticalAlignment="bottom" horizontalAlignment="bottom" marginBottom="110" textTransform="none" background="#1f2d40" color="white" borderRadius="40" width="60%" height="57" fontSize="21"/>
          <Button @onTap="onShowRetrievalsTap" text="Visa panthämtningar" verticalAlignment="bottom" horizontalAlignment="bottom" marginBottom="39" textTransform="none" background="#1f2d40" color="white" borderRadius="40" width="60%" height="57" fontSize="21"/>
          <GridLayout v-if="showMapHelp" borderRadius="20" verticalAlignment="center" horizontalAlignment="center" background="white" androidElevation="12" margin="30" padding="30">
            <StackLayout>
              <Image src="~/assets/images/icon_mapmark@3x.png" stretch="none" horizontalAlignment="center" />
              <Label text="Markera de områden där du kan tänka dig att hämta upp pant." marginTop="10" textWrap="true" lineHeight="3" fontSize="18" class="bodyTextColor" />
              <Label text="När någon begär hämtning av pant inom de områden du valt får du information om vart panten befinner sig." marginTop="10" textWrap="true" lineHeight="3" fontSize="18" class="bodyTextColor" />
              <Label text="Du kan när som helst ändra vilka områden du vill hämta pant inom." marginTop="10" textWrap="true" lineHeight="3" fontSize="18" class="bodyTextColor" />
              <Button @onTap="onDismissHelp" text="OK, jag förstår!" verticalAlignment="bottom" marginTop="39" textTransform="none" background="#0aa67a" color="white" borderRadius="40" width="80%" height="57" fontSize="21" class="bodyTextColor"/>
              <Button @onTap="onRetrievePositionTap" text="Hämta min position" verticalAlignment="bottom" marginTop="10" textTransform="none" background="#1f2d40" color="white" borderRadius="40" width="80%" height="57" fontSize="21" class="bodyTextColor"/>
            </StackLayout>
          </GridLayout>

          <GridLayout v-show="!hideCard" height="400" @onTap="onCardTap" verticalAlignment="bottom" background="white" margin="20" padding="0" borderRadius="20" androidElevation="12">
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
                    <StackLayout orientation="horizontal" :padding="item.selected ? 5 : 8" borderBottomWidth="2" borderBottomColor="#ebeced">
                      <Image :marginRight="item.selected ? 8 : 11" :marginLeft="item.selected ? 10 : 10.5" marginTop="1" :width="item.selected ? 26 : 20" :height="item.selected ? 26 : 20" stretch="fill" horizontalAlignment="left" :src="item.image_src"/>
                      <Label class="bodyTextColor" textWrap="true" fontSize="16" :marginTop="item.selected ? 3 : 0">
                        <FormattedString>
                          <Span fontWeight="bold" text="Hämta senast: "/>
                          <Span>{{item.start_formated}}</Span>
                        </FormattedString>
                      </Label>
                    </StackLayout>
                  </v-template>
                </RadListView>
                <Button text="Anmäl intresse" @onTap="onCollectTap" marginTop="10" textTransform="none" background="#0aa67a" color="white" borderRadius="40" width="70%" height="50" fontSize="16" class="bodyTextColor"/>
              </StackLayout>

              <StackLayout v-show="showRetrievals">
                <Label text="Mina panthämtningar" fontWeight="bold" fontSize="23" class="titleColor" horizontalAlignment="center"/>
                <Label text="Markera när du har hämtat panten" textWrap="true"
                      fontSize="16" class="titleColor" marginTop="12" horizontalAlignment="center"/>
                <RadListView ref="listView"
                            for="(item, index) in displayRetrievals"
                              height="220"
                              marginTop="15">
                  <v-template>
                    <StackLayout orientation="horizontal" :padding="item.selected ? 5 : 8" borderBottomWidth="2" borderBottomColor="#ebeced">
                      <Image marginRight="8" marginLeft="10" marginTop="1" width="26" height="26" stretch="fill" horizontalAlignment="left" :src="item.image_src"/>
                      <Label class="bodyTextColor" textWrap="true" fontSize="16" marginTop="3">
                        <FormattedString>
                          <Span fontWeight="bold" text="Senast: "/>
                          <Span>{{item.start_formatted}}</Span>
                        </FormattedString>
                      </Label>
                      <Label @loaded="onLabelLoaded" @onTap="onRetrievedTap(item)" marginLeft="30" text="Hämtad" :background="item.collected ? '#0aa67a' : '#a9c2d9'" color="white" borderRadius="20" width="27%" height="30" fontSize="16" class="bodyTextColor"/>
                    </StackLayout>
                  </v-template>
                </RadListView>
                <Button text="Ändra områden" @onTap="onCollectTap" marginTop="10" textTransform="none" background="#0aa67a" color="white" borderRadius="40" width="70%" height="50" fontSize="16" class="bodyTextColor"/>
              </StackLayout>
            </GridLayout>
          </GridLayout>
        </GridLayout>
    </Page>
</template>

<script>
  import date from 'date-and-time';
  import se from 'date-and-time/locale/se';
  import session from '../services/session'
  import {isAndroid} from 'tns-core-modules/platform';
  import bookingService from '../services/booking'; 

  export default {
    data() {
      return {
        showMapHelp: true,
        displayBookings: [],
        bookingMarkers: [],
        retrievalMarkers: [],
        booking_requests: [],
        confirmations: [],
        displayRetrievals: [],
        hideCard: true,
        suppressHideCard: false,
        showRetrievals: null
      }
    },
    methods: {
        async onPageLoaded() {
          date.locale(se);
          await session.create("recycleconsumer@gia.fpx.se", "test");
        },
        async onShowBookingsTap() {
          const center = await this.map.getCenter();
          this.$store.state.selectedCoordinates = center;

          if (this.showRetrievals !== false) {
            await this.showBookings();
          }

          this.showRetrievals = false;
          this.hideCard = false;
        },
        async onShowRetrievalsTap() {
          const center = await this.map.getCenter();
          this.$store.state.selectedCoordinates = center;

          if (this.showRetrievals !== true) {
            await this.displayConfirmations();
          }

          this.showRetrievals = true;
          this.hideCard = false;
        },
        onHelpTap() {
          this.showMapHelp = true;
        },
        onDismissHelp() {
          this.showMapHelp = false;
        },
        async onRetrievePositionTap() {
          let location;

          this.showMapHelp = false;

          try {
            location = await this.map.getUserLocation();
          } catch (err) {
            console.log("retrieve pos error: ", err);
            return;
          }

          await this.map.setCenter({
            lat: location.location.lat,
            lng: location.location.lng,
            animated: true
          });

          await this.map.setZoomLevel({
            level: 16
          });
        },
        onCardTap() {
          if (this.suppressHideCard) {
            this.suppressHideCard = false;
          } else {
            this.hideCard = !this.hideCard;
          }
        },
        async showBookings() {
          const center = this.$store.state.selectedCoordinates;
          console.log(center);
          this.booking_requests = await bookingService.findBookingsInArea(center.lat, center.lng);
          this.confirmations = await bookingService.getConfirmations();
          let bookings = [];
          const markers = [];
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
              onTap: this.onMarkerTap,
              iconPath: displayBooking.selected 
                ? `assets/images/markers/selected_${index + 1}.png`
                : `assets/images/markers/unselected_${index + 1}.png`,
            };
            bookings.push(displayBooking);
            markers.push(marker);
          }
          this.markers = markers;
          this.map.removeMarkers();
          this.map.addMarkers(this.markers);
          this.displayBookings = bookings;
        },
        async displayConfirmations() {
          const confirmations = await bookingService.getConfirmations();
          const displayConfs = [];
          const markers = [];

          for (const c of confirmations) {
            const booking = await bookingService.getBookingFromConfirmation(c);
            const index = confirmations.indexOf(c);
            
            displayConfs.push({
              booking: booking,
              collected: false,
              start_formatted: date.format(new Date(booking.start), "ddd HH:mm"),
              image_src: "~/assets/images/markers/selected_big_" + (index + 1) + ".png"
            });
            
            markers.push({
              id: booking.uuid,
              lat: booking.coordinates[1],
              lng: booking.coordinates[0],
              iconPath: `assets/images/markers/selected_${index + 1}.png`
            });
          }

          this.displayRetrievals = displayConfs;
          this.markers = markers;
          this.map.removeMarkers();
          this.map.addMarkers(this.markers);
        },
        async onRetrievedTap(item) {
          this.suppressHideCard = true;
          console.log("onRetrievedTap " + JSON.stringify(item));
          item.collected = true;
          await bookingService.pickUpBooking(item.booking);
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
          /*const center = this.map.getCenter();
          await this.map.setCenter({
            lat: center.lat,
            lng: center.lng,
            animated: true
          });*/

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
            this.suppressHideCard = true;
            let selectedBookingUuids = this.displayBookings.filter((b) => b.selected).map((b) => b.uuid);
            this.displayBookings = this.displayBookings.filter((b) => !selectedBookingUuids.includes(b.uuid));
            this.map.removeMarkers(selectedBookingUuids);
            selectedBookingUuids = selectedBookingUuids.filter((uuid) => !this.confirmations.map((c) => c.booking_uuid).includes(uuid));
            const selectedBookings = this.booking_requests.filter((b) => selectedBookingUuids.includes(b.uuid))
            this.confirmations = await bookingService.confirmBookings(selectedBookings);
        }
      }
    }
</script>

<style scoped>
</style>
