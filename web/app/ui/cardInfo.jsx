export default function CardInfo() {
    return (
        <div className="bg-white w-[233px] h-[340px] p-4 rounded-lg shadow-md">
            <div className="mb-4">
                <p className="text-[16px] font-semibold">Número de Falhas</p>
                <p className="text-[16px] text-gray-600 font-semibold">1234</p>
            </div>
            <div className="mb-4">
                <p className="text-[16px] font-semibold">Temperatura Máxima</p>
                <p className="text-[16px] text-gray-600 font-semibold">55 Graus</p>
            </div>
            <div className="mb-4">
                <p className="text-[16px] font-semibold">Vibração Máxima</p>
                <p className="text-[16px] text-gray-600 font-semibold">100 Hz</p>
            </div>
            <div>
                <p className="text-[16px] font-semibold">Última Manutenção</p>
                <p className="text-[16px] text-gray-600 font-semibold">22/04/1500</p>
            </div>
        </div>
    )
}