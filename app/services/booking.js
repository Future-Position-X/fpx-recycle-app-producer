import config from "../config";
import collection from "./collection"
import {Booking, BookingStatus, Confirmation} from "../models";
import session from "./session";

const RETRIEVER_UUID = "2d7259af-01db-4cc5-b53f-495b078414a1";

export default {
    async findBookingsInArea(lat, lng) {
        const bookings = await collection.fetchItemsByNameAndPropsWithin(config.BOOKING_COLLECTION_NAME, {
                pantr_status: BookingStatus.WAITING
            }, {
                x: lng,
                y: lat
            }, 50000);
        
        return bookings.map((i) => Booking.from_item(i));
    },
    async getConfirmations() {
        const confirmed_bookings = (await collection.fetchItemsByNameAndProps(config.BOOKING_COLLECTION_NAME, {pantr_status: BookingStatus.CONFIRMED, pantr_retriever_uuid: RETRIEVER_UUID})).map((i) => Booking.from_item(i))
        console.log("Confimed bookings: ", JSON.stringify(confirmed_bookings));
        console.log("fetching collections by name");
        const collections = await collection.fetchCollections();
        console.log("collections: " + JSON.stringify(collections));

        let confirmationCollection = collections.find(c => c.name === config.CONFIRMATION_COLLECTION_NAME && c.provider_uuid === session.user.provider_uuid);
        console.log("confirmationCollection: " + JSON.stringify(confirmationCollection));
        let confirmations = [];
        if (confirmationCollection != null) {
            confirmations = (await collection.fetchItems(confirmationCollection.uuid)).map((i) => Confirmation.from_item(i))
            confirmations = confirmations.filter((c) => confirmed_bookings.map((cb) => cb.uuid).includes(c.booking_uuid))
        }
        return confirmations;
    },
    async getBookingFromConfirmation(confirmation) {
        const item = await collection.fetchItem(confirmation.booking_uuid);
        const booking = Booking.from_item(item);
        return booking;
    },
    async pickUpBooking(booking) {
        booking.status = BookingStatus.DONE;
        await collection.updateItem(booking.to_item());
    },
    async confirmBookings(bookings) {
        let confirmations = bookings.map((b) =>  {
            const confirmation = new Confirmation();
            confirmation.coordinates = b.coordinates;
            confirmation.booking_uuid = b.uuid;
            confirmation.retriever_uuid = RETRIEVER_UUID;
            return confirmation;
        });

        const collections = await collection.fetchCollections();
        let confirmationCollection = collections.find(c => 
            c.name === config.CONFIRMATION_COLLECTION_NAME && c.provider_uuid === session.user.provider_uuid);

        console.log("confirmationCollection: " + JSON.stringify(confirmationCollection));

        if (confirmationCollection == null) {
            console.log("creating new collection");
            confirmationCollection = await collection.create(config.CONFIRMATION_COLLECTION_NAME, false);
            console.log("created collection: " + JSON.stringify(confirmationCollection));
        }

        console.log("adding confirmations to collection");
        console.log("RETRIEVER_UUID", RETRIEVER_UUID);
        for(let confirmation of confirmations) {
            console.log("confirmation:" + JSON.stringify(confirmation.to_item()))
            await collection.createItem(confirmationCollection.uuid, confirmation.to_item());
        }

        return confirmations;
    }
};