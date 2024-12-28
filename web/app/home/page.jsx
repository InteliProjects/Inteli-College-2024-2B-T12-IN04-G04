import { PrismaClient } from "@prisma/client"
import { MachineProvider } from "../context/selectedMachine";
import MachinesList from '../ui/home/machine_list'
import Dashboard from "../ui/home/dashboard";
import mqtt from 'mqtt';

const prisma = new PrismaClient();

export default async function HomePage() {
  const machines = await getMachines();
  const machinesRunnings = await getMachinesRunnigs();

  return (
    <MachineProvider>
      <div className="flex items-center justify-center mt-[44px] ml-[72px] mr-[44px] mb-[44px] text-black font-inter">
        {/* Início da Coluna 1 */}
        <div name="column-1" className="flex-col">    
          {/* início Caixa Status */}
          <div className="flex-col p-[16px] w-[288px] h-[143px] flex-shrink-0 rounded-[10px] bg-white shadow-[0px_0px_8px_0px_rgba(0,0,0,0.25)] text-[16px] font-normal leading-normal">
            <div className="flex mb-[22px]">
              <div className="w-[18px] h-[18px] flex-shrink-0 border border-[#005B92] bg-[#00BBE8]"></div>
              <p className="ml-[12px]">Ativado</p>
            </div>
            <div className="flex mb-[22px]">
              <div className="w-[18px] h-[18px] flex-shrink-0 border border-[#005B92] bg-[#00BBE8]"></div>
              <p className="ml-[12px]">Desativado</p>
            </div>
            <div className="flex mb-[22px]">
              <div className="w-[18px] h-[18px] flex-shrink-0 border border-[#005B92] bg-[#00BBE8]"></div>
              <p className="ml-[12px]">Manutenção</p>
            </div>
          {/* Fim Caixa Status */}
          </div>
          {/* Início Caixa Máquinas */}
          <div className="mt-[16px] p-[16px] w-[288px] h-[707px] flex-shrink-0 rounded-[10px] bg-white shadow-[0px_0px_8px_0px_rgba(0,0,0,0.25)]">
            <MachinesList machines={machines} />
          </div>
          {/* Fim Caixa Máquinas */}
        {/* Fim da Coluna 1 */}
        </div>
        {/* Início Coluna 2*/}
        <div name="column-2" className="flex-col ml-[16px] p-[24px] w-[992px] h-[863px] flex-shrink-0 rounded-[10px] bg-white shadow-[0px_0px_8px_0px_rgba(0,0,0,0.25)]">
          <Dashboard machines={machines} machinesRunnings={machinesRunnings}/>
        </div>  
        {/* Fim Coluna 2*/}
      </div>
    </MachineProvider>
  );
}

async function getMachines() {
  //função para coletar as máquinas existentes no banco de dados
  const prensas = await prisma.prensas.findMany();
  // const compressores = await prisma.compressors.findMany();
  // console.log('Compressores:', JSON.stringify(compressores, null, 2));
  const machines = prensas

  return machines;
}

async function getMachinesRunnigs() {
  const machinesRunnings = [];
  try {
    const response = await fetch('http://localhost:8000/prensa');
    const data = await response.json();
    const prensaRunnings = data.PrensaRunnings;
    if (Array.isArray(prensaRunnings)) {
      machinesRunnings.push(...prensaRunnings);
    } else {
      console.error('Expected an array from API response');
    }
  } catch (error) {
    console.error('Error fetching machine runnings:', error);
  }

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
    // Print the received MQTT message
    console.log('Received message from topic:', topic);
    console.log('Message:', message.toString());
    if (topic === 'prensa') {
      const data = JSON.parse(message.toString());
      const now = new Date().toISOString();
      const lastRunningId = machinesRunnings.length > 0 ? machinesRunnings[machinesRunnings.length - 1].RunningId : 0;
      const newRunning = {
        RunningId: lastRunningId + 1,
        PrensaId: data.id,
        DistanceTraveled: data.distance,
        TimeStamp: now
      };
      machinesRunnings.push(newRunning);
    }
  });

  return machinesRunnings;
}


