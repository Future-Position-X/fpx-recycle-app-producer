<template>
    <Page actionBarHidden="true">
        <GridLayout columns="*" rows="*, *">
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
            <Button row="0" @onTap="onChangeAreaTap" text="Ändra mina områden" horizontalAlignment="left" verticalAlignment="top"/>
            <StackLayout row="1" style="margin: 5px;">
              <Label textWrap="true" text="Pantlämningar" fontWeight="bold" horizontalAlignment="center"/>
              <Label textWrap="true" text="Markera den pant som du är intresserad av att hämta." fontWeight="bold" horizontalAlignment="center"/>
              <ListView for="item in listOfItems" @itemTap="onItemTap" horizontalAlignment="center">
                <v-template>
                    <Label :text="item.text" />
                </v-template>
              </ListView>
              <Button @onTap="onSaveTap" text="Spara" horizontalAlignment="center"/>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
  import * as utils from "utils/utils";
  export default {
    data() {
      return {
        listOfItems: [
            {
                text: "Senast: kl 20.15 onsdag"
            },
            {
                text: "Senast: kl 10.52 torsdag"
            },
            {
                text: "Senast: kl 12.34 torsdag"
            },
            {
                text: "Senast: kl 14.01 fredag"
            }
        ]
      }
    },
    methods: {
        onItemTap(x) {
            console.log(Object.keys(x.object));
        },
        onSaveTap() {
            this.$navigateTo(Info);
        },
        onRetrievePositionTap() {

        },
        onChangeAreaTap() {

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
