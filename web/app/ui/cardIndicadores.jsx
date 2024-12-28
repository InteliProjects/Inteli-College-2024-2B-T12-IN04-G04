export default function CardIndicadores() {
  const indicadores = [
    { nome: 'MTTF', descricao: 'Mean Time To Failure', valor: 'XYZ' },
    { nome: 'MTTR', descricao: 'Mean Time To Repair', valor: 'XYZ' },
    { nome: 'TMP', descricao: 'T. Manutenção Preventiva', valor: 'XYZ' },
    { nome: 'CMM', descricao: 'Custo Médio Manutenção', valor: 'XYZ' },
    { nome: 'DDE', descricao: 'Disponibilidade Equipamento', valor: 'XYZ' },
  ];

  return (
    <div className="bg-white w-[944px] h-[246px] p-6 rounded-lg border shadow-md">
      <h2 className="text-[24px] leading-7 font-bold mb-6">Indicadores Chave</h2>
      <div className="flex justify-between items-start">
        {indicadores.map((item, index) => (
          <div key={index} className="flex flex-col items-start w-1/5 text-right">
            <h3 className="text-[16px] leading-7 font-bold">{item.nome}</h3>
            <p className="text-[12px] leading-5 text-gray-500">{item.descricao}</p>
            <span className="text-[30px] leading-7 font-bold text-black">{item.valor}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
