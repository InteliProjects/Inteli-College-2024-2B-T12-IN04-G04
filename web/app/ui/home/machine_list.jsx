"use client";
import React from "react";
import { useMachineContext } from "../../context/selectedMachine"

const MachinesList = ({ machines }) => {
  const { selectedMachine, setSelectedMachine } = useMachineContext();

  const handleClick = (Id) => {
    setSelectedMachine(Id);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {machines.map((machine) => (
        <div
          key={machine.Id}
          name={selectedMachine === machine.Id ? "selectedMachine" : "Machine"}
          className={`text-[16px] w-[276px] h-[60px] rounded-[10px] p-[20px] cursor-pointer ${
            selectedMachine === machine.Id ? "bg-[#005B92] text-white" : "bg-white"
          }`}
          onClick={() => handleClick(machine.Id)}
        >
          {machine.Id}
        </div>
      ))}
    </div>
  );
};

export default MachinesList;
