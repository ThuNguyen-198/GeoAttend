import * as Location from "expo-location";

const getAddressFromCoordinates = async (longitude, latitude) => {
  try {
    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    if (reverseGeocode.length > 0) {
      const { name, street, city, region, country, postalCode } =
        reverseGeocode[0];
      return {
        name,
        street,
        city,
        region,
        country,
        postalCode,
      };
    } else {
      throw new Error("Address not found for the provided coordinates.");
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
};

export default getAddressFromCoordinates;
