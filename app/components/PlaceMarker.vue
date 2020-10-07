<template>
    <Page actionBarHidden="true">
        <GridLayout columns="*" rows="*, auto">
            <Mapbox
              accessToken="pk.eyJ1IjoidHJpcHRlYyIsImEiOiJja2R0d2ZtNHMwMGM5MzdxNHVwZGcyeG1xIn0.yAZW46zUKkS9RL3O7kBWaQ"
              mapStyle="mapbox://styles/mapbox/light-v9"
              latitude="60.6708058985168"
              longitude="17.14024985657789"
              hideCompass="true"
              zoomLevel="15"
              showUserLocation="false"
              disableZoom="false"
              disableRotation="false"
              disableScroll="false"
              disableTilt="false"
              @mapReady="onMapReady($event)">
          </Mapbox>
            <Button row="0" @onTap="onRetrievePositionTap" text="Hämta min position" horizontalAlignment="right" verticalAlignment="top"/>
            <StackLayout row="1" style="margin: 5px;">
              <Label textWrap="true" text="Markera områden där du kan tänka dig att hämta upp pant."/>
              <Label textWrap="true" text="När någon begär hämtning av pant inom de områden du valt får du information om vart panten befinner sig."/>
              <Button @onTap="onSaveTap" text="Spara" horizontalAlignment="center"/>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
  import Pantlamningar from './Pantlamningar'
  import * as utils from "utils/utils";
  export default {
    data() {
      return {
        
      }
    },
    methods: {
        onSaveTap() {
            this.$navigateTo(Pantlamningar);
        },
        onRetrievePositionTap() {

        },
        onMapReady(args) {
        args.map.addMarkers([
          {
            lat: 60.6708058985168,
            lng: 17.14024985657789,
            title: "Gävle, SE",
            subtitle: "Noice",
            onCalloutTap: () => {
              utils.openUrl("https://fpx.se/");
            }
          }
        ]);
      }
    }
  }
</script>

<style scoped>
</style>
