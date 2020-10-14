<template>
    <Page @loaded="onPageLoaded" actionBarHidden="true" background="#f2f2f2">
        <GridLayout>
            <GridLayout rows="*, *" padding="0 20">
                <Mapbox
                    row="0"
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

                <Image row="0" src="~/assets/images/dots.png" stretch="fill" horizontalAlignment="left" verticalAlignment="top" marginTop="30" marginLeft="25" width="25" height="25"/>
                <Image row="0" src="~/assets/images/Pantr_logo@3x.png" stretch="fill" horizontalAlignment="center" verticalAlignment="top" width="150" height="35" marginTop="25"/>
                <Image row="0" src="~/assets/images/icon_help@3x.png" stretch="fill" horizontalAlignment="right" verticalAlignment="top" marginTop="30" marginRight="25" width="25" height="25"/>
                <ScrollView row="1" marginTop="18">
                    <StackLayout>
                        <Label text="Pantlämningar" fontWeight="bold" fontSize="23" class="titleColor" />
                        <Label text="Markera den pant som du är intresserad av att hämta" textWrap="true" fontWeight="bold" fontSize="18" class="titleColor" marginTop="22" />

                        <StackLayout marginTop="10">
                            <Label v-for="(item, index) in bookings" :key="item.id" marginLeft="30" marginTop="10">{{index + 1}}. Senast kl {{item.start}}</Label>
                        </StackLayout>
                    </StackLayout>
                </ScrollView>
                
            </GridLayout>
        </GridLayout>
    </Page>
</template>

<script>
  import date from 'date-and-time';

  export default {
    data() {
      return {
        map: null,
        bookings: [
            {
                "start": date.format(new Date(), "HH:mm dddd")
            },
            {
                "start": date.format(new Date(), "HH:mm dddd")
            },
            {
                "start": date.format(new Date(), "HH:mm dddd")
            }
        ]
      }
    },
    methods: {
        onPageLoaded() {
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
        }
    }
  }
</script>

<style scoped>
    
</style>
