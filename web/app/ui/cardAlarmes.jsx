export default function CardAlarme() {
    return (
      <div className="flex bg-[#005B92] w-[944px] h-[137px] p-4 rounded-lg shadow text-white gap-5">
        <div className="">
          <h3 className="text-[20px] leading-7 font-bold mb-4">Personalizar Alarme</h3>
          <form className="gap-6 flex">
            {[
              { id: "temperatura", label: "Temperatura Máxima" },
              { id: "vibracao", label: "Vibração Máxima" },
              { id: "operacao", label: "Tempo de Operação" },
              { id: "manutencao", label: "Tempo Manutenção" },
            ].map(({ id, label }) => (
              <label key={id} className="text-sm">
                {label}
                <input
                  type="number"
                  id={id}
                  className="p-2 w-full text-black rounded-lg mt-2 px-2 py-2"
                  placeholder="Digite o valor"
                />
              </label>
            ))}
          </form>
        </div>
        <div className="justify-center flex items-end">
          <button
              type="submit"
              className="bg-white text-[#005B92] font-bold px-10 text-[10px] rounded-sm py-2"
            >
              Submit
          </button>
        </div>
      </div>
    );
  }
  
  