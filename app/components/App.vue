<template>
    <Page actionBarHidden="true">
        <GridLayout columns="*" rows="*, auto">
            <Mapbox
              ref="map"
              accessToken="pk.eyJ1IjoidHJpcHRlYyIsImEiOiJja2R0d2ZtNHMwMGM5MzdxNHVwZGcyeG1xIn0.yAZW46zUKkS9RL3O7kBWaQ"
              mapStyle="mapbox://styles/mapbox/light-v9"
              latitude="60.6708058985168"
              longitude="17.14024985657789"
              hideCompass="true"
              zoomLevel="4"
              showUserLocation="false"
              disableZoom="false"
              disableRotation="false"
              disableScroll="false"
              disableTilt="false"
              @mapReady="onMapReady($event)">
          </Mapbox>
          <Image src="~/assets/images/dots.png" stretch="fill" horizontalAlignment="left" verticalAlignment="top" marginTop="30" marginLeft="25" width="25" height="25"/>
          <Image src="~/assets/images/Pantr_logo@3x.png" stretch="fill" horizontalAlignment="center" verticalAlignment="top" width="150" height="35" marginTop="25"/>
          <Image src="~/assets/images/icon_help@3x.png" @onTap="onHelpTap" stretch="fill" horizontalAlignment="right" verticalAlignment="top" marginTop="30" marginRight="25" width="25" height="25"/>
          <GridLayout v-if="showMapHelp" borderRadius="20" verticalAlignment="center" horizontalAlignment="center" background="white" androidElevation="12" margin="30" padding="30">
            <StackLayout>
              <Image src="~/assets/images/icon_mapmark@3x.png" stretch="none" horizontalAlignment="center" />
              <Label text="Markera de områden där du kan tänka dig att hämta upp pant." marginTop="10" textWrap="true" lineHeight="3" fontSize="18" class="bodyTextColor" />
              <Label text="När någon begär hämtning av pant inom de områden du valt får du information om vart panten befinner sig." marginTop="10" textWrap="true" lineHeight="3" fontSize="18" class="bodyTextColor" />
              <Button @onTap="onDismissHelp" text="OK, jag förstår!" verticalAlignment="bottom" marginTop="39" textTransform="none" background="#0aa67a" color="white" borderRadius="40" width="80%" height="57" fontSize="21" class="bodyTextColor"/>
              <Button @onTap="onRetrievePositionTap" text="Hämta min position" verticalAlignment="bottom" marginTop="10" textTransform="none" background="#1f2d40" color="white" borderRadius="40" width="80%" height="57" fontSize="21" class="bodyTextColor"/>
            </StackLayout>
          </GridLayout>
        </GridLayout>
    </Page>
</template>

<script>
  export default {
    data() {
      return {
        showMapHelp: true
      }
    },
    methods: {
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
        async onMapReady(args) {
          this.map = args.map;
        }
      }
    }
</script>

<style scoped>
</style>
