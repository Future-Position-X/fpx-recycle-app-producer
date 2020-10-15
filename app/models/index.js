class Retriever {
  pantr_name
}

const PropertyType = {
  HOUSE: "HOUSE",
  APARTMENT: "APARTMENT",
}

const BookingStatus = {
  WAITING: "WAITING",
  CONFIRMED: "CONFIRMED",
  DONE: "DONE",
}

class Booking {
  uuid;
  coordinates;
  property_type; // Property type,
  start; // Start of collection window
  end; // Start of collection window
  retriever_uuid; // ZERO_UUID for all available
  floor_info;
  other_info;
  status;
  to_item() {
    return {
      uuid: this.uuid,
      geometry: {
        type: "Point",
        coordinates: this.coordinates
      },
      properties: {
        pantr_property_type:  this.property_type,
        pantr_start: this.start,
        pantr_end: this.end,
        pantr_retriever_uuid: this.retriever_uuid,
        pantr_floor_info: this.floor_info,
        pantr_other_info: this.other_info,
        pantr_status: this.status,
      }
    }
  }
  static from_item(item) {
    let booking = new Booking();
    booking.uuid = item.uuid;
    booking.coordinates = item.geometry.coordinates;
    booking.property_type = item.properties.pantr_property_type;
    booking.start = item.properties.pantr_start;
    booking.end = item.properties.pantr_end;
    booking.retriever_uuid = item.properties.pantr_retriever_uuid;
    booking.floor_info = item.properties.pantr_floor_info;
    booking.other_info = item.properties.pantr_other_info;
    booking.status = item.properties.pantr_status;
    return booking;
  }
}

class Confirmation {
  uuid;
  booking_uuid; // reference to the original "pantr-consumer" item
  coordinates;

  to_item() {
    return {
      uuid: this.uuid,
      geometry: {
        type: "Point",
        coordinates: this.coordinates
      },
      properties: {
        pantr_booking_uuid: this.booking_uuid,
      }
    }
  }
  static from_item(item) {
    let confirmation = new Confirmation();
    confirmation.uuid = item.uuid;
    confirmation.coordinates = item.geometry.coordinates;
    confirmation.booking_uuid = item.properties.pantr_booking_uuid;
    return confirmation;
  }
}

export {Retriever, Booking, Confirmation, PropertyType, BookingStatus}