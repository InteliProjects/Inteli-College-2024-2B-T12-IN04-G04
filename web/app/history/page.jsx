import SbInfo from "../public/sb-info.svg";
import Image from "next/image";
import CardHistory from "../ui/CardHistory";

export default function HistoryPage() {
  return (
    <div className="h-screen flex flex-col">
      {/* Corpo principal */}
      <div className="flex h-full bg-gray-100 items-center justify-center py-15">
        <div className="bg-white w-[1750px] h-[863px] p-4 rounded-lg shadow-lg">
          {/* Cabeçalho do Histórico */}
          <div className="flex items-center justify-between pl-20 pr-40 pt-10">
            <div>
              <h1 className="text-3xl font-bold">Histórico de Utilizações</h1>
              <p>873454395</p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Image src={SbInfo} alt="info" width={20} height={20} />
                <p>Número de Utilizações:</p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Image src={SbInfo} alt="info" width={20} height={20} />
                <p>Número de Manutenções:</p>
              </div>
            </div>
          </div>

          {/* Área dos Cards com Scroll */}
          <div className="py-10 h-[600px] overflow-y-auto mt-10">
            {Array.from({ length: 15 }).map((_, i) => (
              <CardHistory key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// export default function HistoryPage() {
//   return(
//     <div className="flex items-center justify-center min-h-screen">
//       <div>

//       </div>
//     </div>
//   )
// }
