<template>
    <Page actionBarHidden="true" style="margin: 5px;">
        <GridLayout rows="*, auto">
          <Carousel row="0" height="100%" width="100%" indicatorColor="#757575" indicatorColorUnselected="#989898" finite="true" bounce="false" showIndicator="true" android:indicatorAnimation="swap">
            <CarouselItem verticalAlignment="middle">
                <GridLayout>
                  <StackLayout horizontalAlignment="center" verticalAlignment="center">
                    <Label text="Välkommen!" fontWeight="bold"/>
                    <Label textWrap="true" text="Denna app använder du för att få information om tillgänglig pant inom ditt upphämtningsområde."/>
                    <Label textWrap="true" text="Lorem ipsum."/>
                  </StackLayout>
                </GridLayout>
            </CarouselItem>
            <CarouselItem verticalAlignment="middle">
                <GridLayout>
                  <StackLayout horizontalAlignment="center" verticalAlignment="center">
                    <Label text="Såhär fungerar det:" fontWeight="bold"/>
                    <Label textWrap="true" text="Lorem ipsum."/>
                  </StackLayout>
                </GridLayout>
            </CarouselItem>
            <CarouselItem verticalAlignment="middle">
                <GridLayout>
                  <StackLayout horizontalAlignment="center" verticalAlignment="center">
                    <Label text="Frågor och support" fontWeight="bold"/>
                    <Label textWrap="true" text="Du kan alltid kontakta oss på x@y.se om du stöter på problem, undrar över något eller vill lämna feedback."/>
                  </StackLayout>
                </GridLayout>
            </CarouselItem>
          </Carousel>
          <Button @onTap="onReadyTap" row="1" text="Jag är redo" verticalAlignment="bottom"/>
        </GridLayout>
    </Page>
</template>

<script>
  import PlaceMarker from './PlaceMarker'

  export default {
    data() {
      return {
      }
    },
    methods: {
      onReadyTap() {
        this.$navigateTo(PlaceMarker);
      }
    }
  }
</script>

<style scoped>
</style>
