<template>
    <Page actionBarHidden="true" style="margin: 5px;">
        <GridLayout rows="auto, *, auto, *, auto, *, auto, *, auto, *, auto">
          <StackLayout row="0" style="border-width: 2px; border-radius: 5 5 5 5; border-color: #c4c1c0;">
            <Label text="Håll dig uppdaterad genom pushnotifikationer" fontWeight="bold" horizontalAlignment="center"/>
            <Label textWrap="true" horizontalAlignment="center" text="Pushar är det snabbaste och smidigaste sättet att få information om när din pant hämtas och/eller när det finns annan panthämtning inbokad i ditt område."/>
            <Button @onTap="onAllowNotificationsTap" text="Tillåt pushnotifikationer"/>
          </StackLayout>
          <StackLayout row="2">
            <Label text="Hämtningar i ditt område" horizontalAlignment="center" fontWeight="bold"/>
            <Label text="Onsdag 21/11 18:00-20:00 Gävle fotboll"/>
            <Label text="Torsdag 22/11 18:00-20:00 Gävle Ridklubb"/>
          </StackLayout>
          <StackLayout row="4">
            <Label text="Bokad hämtning" horizontalAlignment="center" fontWeight="bold"/>
            <Label text="Du har ingen bokad hämtning"/>
            <Label text="Väntar på bekräftelse"/>
            <Label text="Estimerad hämtning Onsdag 21/11 18:00-20:00"/>
          </StackLayout>
          <Label row="6" text="Du har donerat pant 10 gånger" horizontalAlignment="center" fontWeight="bold"/>
          <StackLayout row="8">
            <Label text="Kontakta oss:" horizontalAlignment="center"/>
            <Label text="x@y.se" horizontalAlignment="center"/>
          </StackLayout>
          <Button @onTap="onBookNewTap" row="10" text="Boka ny hämtning"/>
        </GridLayout>
    </Page>
</template>

<script>
  import PlaceMarker from './PlaceMarker'
  import { messaging, Message } from "nativescript-plugin-firebase/messaging";

  export default {
    data() {
      return {
      }
    },
    methods: {
      onBookNewTap() {
        this.$navigateTo(PlaceMarker);
      },
      onAllowNotificationsTap() {
        console.log(`Notifications enabled? ${messaging.areNotificationsEnabled()}`);
      }
    }
  }
</script>

<style scoped>
</style>
