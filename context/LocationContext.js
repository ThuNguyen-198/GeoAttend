import React, { createContext, useState, useContext, useEffect } from "react";
import * as Location from "expo-location";
import { Alert, Linking } from "react-native";
const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locationIsOn, setLocationIsOn] = useState(false);
  const [location, setLocation] = useState(null);

  const turnOnLocation = async () => {
    setLocationIsOn(true);
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Location Permission Required",
        "You have previously denied location permission. Please go to your device settings to enable it.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(), // Opens the app's settings
          },
        ]
      );
      setLocationIsOn(false);
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      altitude: loc.coords.altitude,
      accuracy: loc.coords.accuracy,
      altitudeAccuracy: loc.coords.altitudeAccuracy,
      heading: loc.coords.heading,
      speed: loc.coords.speed,
      timestamp: loc.timestamp,
    });
    setLocationIsOn(true);
  };
  useEffect(() => {
    console.log(location);
  }, [location]);

  const turnOffLocation = () => {
    setLocationIsOn(false);
    setLocation(null);
  };

  return (
    <LocationContext.Provider
      value={{
        locationIsOn,
        location,
        turnOnLocation,
        turnOffLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
