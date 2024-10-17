import React, { createContext, useState, useContext } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locationIsOn, setLocationIsOn] = useState(false);

  const turnOnLocation = () => setLocationIsOn(true);
  const turnOffLocation = () => setLocationIsOn(false);

  return (
    <LocationContext.Provider
      value={{
        locationIsOn,
        turnOnLocation,
        turnOffLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
