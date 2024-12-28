"use client"
import React, { createContext, useContext, useState } from "react";

const MachineContext = createContext();

export const MachineProvider = ({ children }) => {
  const [selectedMachine, setSelectedMachine] = useState(null);

  return (
    <MachineContext.Provider value={{ selectedMachine, setSelectedMachine }}>
      {children}
    </MachineContext.Provider>
  );
};

export const useMachineContext = () => useContext(MachineContext);
