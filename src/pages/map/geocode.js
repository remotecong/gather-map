/* global google */

//  TODO: make this less unsafe
//  as it is we just hope that the google-maps-react loaded the sdk
//  and lazy loading geocode does the trick but this isn't foolproof
//  so look into it, will ya?
let _geocode = null;

function getGeocode() {
  if (!_geocode) {
    _geocode = new google.maps.Geocoder();
  }
  return _geocode;
}

export function getAddress(coords) {
  return new Promise((resolve, reject) => {
    getGeocode().geocode({ location: coords }, function (results, status) {
      if (status !== "OK") {
        return reject(status);
      }
      if (0 === results.length) {
        return reject("no results found");
      }
      const gatherableAddress = getGatherableAddress(results[0]);
      gatherableAddress.latLng = coords;
      resolve(gatherableAddress);
    });
  });
}

function getAddressComponent(components, type, useShortName = false) {
  const match = components.find(({ types }) => types.includes(type));
  if (match) {
    return useShortName ? match.short_name : match.long_name;
  }
}

function getGatherableAddress(place) {
  if (place.address_components.length) {
    const num = getAddressComponent(place.address_components, "street_number");
    const street = getAddressComponent(place.address_components, "route", true);
    const city = getAddressComponent(
      place.address_components,
      "locality",
      true
    );
    const state = getAddressComponent(
      place.address_components,
      "administrative_area_level_1",
      true
    );
    let gatherAddress = place.formatted_address;
    if (num && street && city && state) {
      gatherAddress = `${num} ${street}, ${city}, ${state}`;
    }
    return {
      houseNumber: num,
      street,
      city,
      state,
      gatherAddress,
      toString: () => gatherAddress
    };
  }
}
