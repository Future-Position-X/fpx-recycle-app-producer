import { Color } from "tns-core-modules/color";
import { LocalNotifications } from "nativescript-local-notifications";

export default {
    async show(title, callback) {
        await LocalNotifications.addOnMessageReceivedCallback(
          function (n) {
            callback(n);
          }
        )

        await LocalNotifications.schedule(
            [{
              id: 1,
              title: title,
              subtitle: 'subtitle',
              body: 'body',
              bigTextStyle: false, // Allow more than 1 row of the 'body' text on Android, but setting this to true denies showing the 'image'
              color: new Color("green"),
              //image: "https://images-na.ssl-images-amazon.com/images/I/61mx-VbrS0L.jpg",
              //thumbnail: "https://2.bp.blogspot.com/-H_SZ3nAmNsI/VrJeARpbuSI/AAAAAAAABfc/szsV7_F609k/s200/emoji.jpg",
              forceShowWhenInForeground: true,
              channel: "vue-channel",
              ticker: "Special ticker text for Vue (Android only)",
              actions: [
                {
                  id: "yes",
                  type: "button",
                  title: "Yes (and launch app)",
                  launch: true
                },
                {
                  id: "no",
                  type: "button",
                  title: "No",
                  launch: false
                }
              ]
        }])
        .then(() => {
            console.log("notification scheduled");
        })
        .catch(error => console.log("doSchedule errorr: " + error));
    }
};