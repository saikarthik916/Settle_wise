// frontend/src/context/AreaContext.jsx
import { createContext, useContext, useState } from "react";

const AreaContext = createContext();

export const AreaProvider = ({ children }) => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [localities, setLocalities] = useState([]);

  return (
    <AreaContext.Provider
      value={{ selectedArea, setSelectedArea, localities, setLocalities }}
    >
      {children}
    </AreaContext.Provider>
  );
};

export const useArea = () => useContext(AreaContext);
