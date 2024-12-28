"use client";
import React, { useState, useEffect } from "react";
import { useMachineContext } from "../../context/selectedMachine";
import DistanceChart from "./components/DistanceChart";
import PublishButton from "./components/PublishButton"; // Import the new component
import InputField from "./components/InputField";
import SubmitButton from "./components/SubmitButton"; // Import the new component
import mqtt from 'mqtt';
import { useRouter } from 'next/navigation';

const Dashboard = ({ machines }) => {
  const { selectedMachine } = useMachineContext();
  const machine = machines.find((machine) => machine.Id == selectedMachine);
  const router = useRouter();

  const [machineRunnings, setMachineRunnings] = useState([]);
  const [maximumDistance, setMaximumDistance] = useState("");
  const [maintenanceTime, setMaintenanceTime] = useState("");
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  
  useEffect(() => {
    // Fetch initial runnings data
    async function fetchInitialData() {
      try {
        const response = await fetch('http://localhost:8000/prensa');
        const data = await response.json();
        const prensaRunnings = data.PrensaRunnings;
        if (Array.isArray(prensaRunnings)) {
          setMachineRunnings(prensaRunnings);
        } else {
          console.error('Expected an array from API response');
        }
      } catch (error) {
        console.error('Error fetching machine runnings:', error);
      }
    }

    fetchInitialData();

    // Set up MQTT client
    const client = mqtt.connect('wss://915282f0a4ff4b8faac4c20cbefd5c1c.s1.eu.hivemq.cloud:8884/mqtt', {
      username: 'bemore_broker',
      password: 'Mbw38NF9CiaNtxf@',
      protocol: 'wss'
    });

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe('prensa', (err) => {
        if (err) {
          console.error('Failed to subscribe to topic prensa:', err);
        }
      });
    });

    client.on('message', (topic, message) => {
      console.log('Received message from topic:', topic);
      console.log('Message:', message.toString());
      if (topic === 'prensa') {
        if (isFirstMessage) {
          setIsFirstMessage(false);
          return;
        }
        const data = JSON.parse(message.toString());
        const now = new Date().toISOString();
        setMachineRunnings((prevRunnings) => [
          ...prevRunnings,
          {
            RunningId:
              prevRunnings.length > 0
                ? prevRunnings[prevRunnings.length - 1].RunningId + 1
                : 1,
            PrensaId: data.id,
            DistanceTraveled: data.distance,
            TimeStamp: now,
          },
        ]);
      }
    });

    // Clean up the client when the component unmounts
    return () => {
      client.end();
    };
  }, [selectedMachine]);

  // Filter the runnings for the selected machine
  const selectedMachineRunnings = machineRunnings.filter(
    (running) => running.PrensaId === selectedMachine
  );

  if (machine) {
    const maxDistanceTraveled = Math.max(
      ...selectedMachineRunnings.map((running) => running.DistanceTraveled)
    );
    const failureCount = selectedMachineRunnings.filter(
      (running) => running.DistanceTraveled > machine.MaximumDistance
    ).length;

    return (
      <>
        <div name="row-1" className="flex">
          <p className="text-[24px] font-semibold">
            {machine.Id}
          </p>
          <svg className="mt-[8px] ml-[12px]" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="8" fill="#00FF26" />
          </svg>
          {/* Convert the div to a button */}
          <button
            onClick={() => router.push('/history')}
            className="content-center text-center ml-auto w-[88px] h-[25px] flex-shrink-0 rounded-[4px] bg-[#005B92] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-white font-semibold"
          >
            Histórico
          </button>
          <PublishButton className="content-center text-center ml-[8px] px-2 h-[25px] flex-shrink-0 rounded-[4px] bg-[#005B92] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-white font-semibold" />
        </div>
        <div name="row-2" className="flex mt-[16px]">
          <div name="row-2_box-1" className="flex-col p-[24px] text-[16px] w-[233px] h-[340px] rounded-[10px] bg-white shadow-[0px_0px_8px_0px_rgba(0,0,0,0.25)]">
            <div className="flex-col mb-[24px]">
              <p>
                Quantidade de Falhas
              </p>
              <p name="failures">
                {failureCount}
              </p>
            </div>

            {machine.MaximumTemperature ?
              <div className="flex-col mb-[24px]">
                <p className="text-[16px]">
                  Temperatura Máxima
                </p>
                <p name="max_temperature">
                  {machine.MaximumTemperature}
                </p>
              </div>
              : <></>}

            {machine.MaximumVibration ?
              <div className="flex-col mb-[24px]">
                <p className="text-[16px]">
                  Vibração Máxima
                </p>
                <p name="max_vibration">
                  {machine.MaximumVibration}
                </p>
              </div> : <></>}

            {machine.MaximumDistance ?
              <div className="flex-col mb-[24px]">
                <p className="text-[16px]">
                  Distância Máxima
                </p>
                <p name="max_distance">
                  {maxDistanceTraveled}
                </p>
              </div>
              : <></>}

            <div className="flex-col mb-[24px]">
              <p className="text-[16px]">
                Última Manutenção
              </p>
              <p name="last_maintance">
                {machine?.LastMaintenance ? new Date(machine.LastMaintenance).toLocaleDateString() : null}
              </p>
            </div>

          </div>

          {/* Início do Gráfico */}
          <div name="row-2_box-2" className="flex-col p-[24px] ml-[16px] w-[695px] h-[340px] rounded-[10px] bg-white shadow-[0px_0px_8px_0px_rgba(0,0,0,0.25)]">
            <DistanceChart
              machineRunnings={selectedMachineRunnings}
              selectedMachine={selectedMachine}
            />
          </div>
          {/* Fim do Gráfico */}

        </div>
        <div name="row-3" className="mt-[24px] p-[16px] text-white w-[944px] h-[137px] flex-shrink-0 rounded-[10px] bg-[#005B92] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.25)] ali">
          <p name="title_row-3" className="text-[20px] font-bold">
            Personalizar Alarme
          </p>

          {/* Início do Formulário do Alarme Personalizado */}
          <form action="" className="mt-[12px] flex">
            <InputField label="Distancia Máxima" name="operation_time" value={maximumDistance} onChange={setMaximumDistance} />
            <InputField label="Tempo para Manutenção" name="maintenance_time" value={maintenanceTime} onChange={setMaintenanceTime} />
            <SubmitButton prensaId={selectedMachine} maximum_distance={maximumDistance} operating_time={maintenanceTime} />
          </form>
        </div>
        <div name="row-4" className="flex mt-[24px] p-[24px] w-[944px] h-[246px] rounded-[10px] bg-white shadow-[0px_0px_8px_0px_rgba(0,0,0,0.25)]">
          <div className="flex-col">
            <p className="text-[24px] mb-[12px] font-bold">
              Indicadores Chave
            </p>
            <div className="flex">
              <div className="flex-col mr-[82px]">
                <div className="flex">
                  <p className="text-[18px] font-normal">
                    MTTF
                  </p>
                  <svg className="ml-[8px]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#222222" />
                    <path d="M12.5 7.5C12.5 7.77614 12.2761 8 12 8C11.7239 8 11.5 7.77614 11.5 7.5C11.5 7.22386 11.7239 7 12 7C12.2761 7 12.5 7.22386 12.5 7.5Z" fill="#222222" />
                    <path d="M12 17V10" stroke="#222222" />
                  </svg>
                </div>

                <p className="text-[36px] font-semibold">
                  XYZ
                </p>
              </div>

              <div className="flex-col mr-[82px]">
                <div className="flex">
                  <p className="text-[18px] font-normal">
                    MTTR
                  </p>
                  <svg className="ml-[8px]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#222222" />
                    <path d="M12.5 7.5C12.5 7.77614 12.2761 8 12 8C11.7239 8 11.5 7.77614 11.5 7.5C11.5 7.22386 11.7239 7 12 7C12.2761 7 12.5 7.22386 12.5 7.5Z" fill="#222222" />
                    <path d="M12 17V10" stroke="#222222" />
                  </svg>
                </div>

                <p className="text-[36px] font-semibold">
                  XYZ
                </p>
              </div>

              <div className="flex-col mr-[82px]">
                <div className="flex">
                  <p className="text-[18px] font-normal">
                    TMP
                  </p>
                  <svg className="ml-[8px]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#222222" />
                    <path d="M12.5 7.5C12.5 7.77614 12.2761 8 12 8C11.7239 8 11.5 7.77614 11.5 7.5C11.5 7.22386 11.7239 7 12 7C12.2761 7 12.5 7.22386 12.5 7.5Z" fill="#222222" />
                    <path d="M12 17V10" stroke="#222222" />
                  </svg>
                </div>

                <p className="text-[36px] font-semibold">
                  XYZ
                </p>
              </div>

              <div className="flex-col mr-[82px]">
                <div className="flex">
                  <p className="text-[18px] font-normal">
                    MTTF
                  </p>
                  <svg className="ml-[8px]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#222222" />
                    <path d="M12.5 7.5C12.5 7.77614 12.2761 8 12 8C11.7239 8 11.5 7.77614 11.5 7.5C11.5 7.22386 11.7239 7 12 7C12.2761 7 12.5 7.22386 12.5 7.5Z" fill="#222222" />
                    <path d="M12 17V10" stroke="#222222" />
                  </svg>
                </div>

                <p className="text-[36px] font-semibold">
                  XYZ
                </p>
              </div>

              <div className="flex-col mr-[24px]">
                <div className="flex">
                  <p className="text-[18px] font-normal">
                    MTTF
                  </p>
                  <svg className="ml-[8px]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#222222" />
                    <path d="M12.5 7.5C12.5 7.77614 12.2761 8 12 8C11.7239 8 11.5 7.77614 11.5 7.5C11.5 7.22386 11.7239 7 12 7C12.2761 7 12.5 7.22386 12.5 7.5Z" fill="#222222" />
                    <path d="M12 17V10" stroke="#222222" />
                  </svg>
                </div>

                <p className="text-[36px] font-semibold">
                  XYZ
                </p>
              </div>
            </div>
          </div>
          <form action="" className="text-white  text-center p-[6px] w-[200px] h-[200px] rounded-[4px] bg-[#005B92]">
            <p className="text-[16px] mb-[4px] font-semibold">Relatório</p>
            <div className="flex mb-[8px]">
              <p className="m-auto">MTTF</p>
              <input className="m-auto" type="checkbox" />
            </div>
            <div className="flex mb-[8px]">
              <p className="m-auto">MTTF</p>
              <input className="m-auto rounded-ful" type="checkbox" />
            </div>
            <div className="flex mb-[8px]">
              <p className="m-auto">MTTF</p>
              <input className="m-auto" type="checkbox" />
            </div>
            <div className="flex mb-[8px]">
              <p className="m-auto">MTTF</p>
              <input className="m-auto" type="checkbox" />
            </div>
            <div className="flex mb-[10px]">
              <p className="m-auto">MTTF</p>
              <input className="m-auto" type="checkbox" />
            </div>
            <button className="text-black font-semibold w-[70px] h-[18px] rounded-[4px] bg-white"> Submit </button>
          </form>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div>
          <p>No machine selected</p>
        </div>
      </>
    )
  }
};

export default Dashboard;
