export default function HistoryGraphPage() {
    return (
        <div className="flex items-center justify-center min-h-screen py-[4.19921875vh]">
            <div className="w-[68.8888889vw] h-[84.27734375vh] flex-shrink-0 rounded-[0.69444444vw] bg-white shadow-[0_0_0.55555556vw_0_rgba(0,0,0,0.25)] border">
                <div className="flex items-start mt-[2.34375vh] ml-[1.66666667vw]">
                    <p className="text-black font-poppins text-[1.66666667vw] font-semibold">
                        873454395
                    </p>
                    <div className="w-[1.5625vh] h-[1.5625vh] flex-shrink-0 bg-[#00FF26] rounded-full ml-[0.83333333vw] mt-[1.65vh]"></div>
                    <div className="ml-auto mr-[1.66666667vw]">
                        <p className="text-black font-poppins text-[1.66666667vw] font-semibold">
                            22/12/2024
                        </p>
                    </div>
                </div>
                <div className="ml-[2.01388889vw] mt-[0.78125vh]">
                    <p className="text-black font-poppins text-[0.97222222vw] font-semibold">
                        Duração: 00h00 - 00h00 
                    </p>
                </div>
                <div name="Info" className="flex mt-[1.5625vh] ml-[1.66666667vw]">
                    <div className="w-[16.1805556vw] h-[33.203125vh] rounded-[0.69444444vw] shadow-[0_0_0.55555556vw_0_rgba(0,0,0,0.25)] p-[1.11111111vw]">
                            {/*  */}
                            <p className="text-black font-poppins text-[1.11111111vw] font-semibold">
                                Temperatura Máxima
                            </p>
                            <p className="text-black font-poppins text-[0.97222222vw] font-medium leading-none">
                                Temperatura Máxima
                            </p>
                            
                            {/*  */}
                            <p className="text-black font-poppins text-[1.11111111vw] font-semibold mt-[2.34375vh]">
                                Temperatura Mínima
                            </p>
                            <p className="text-black font-poppins text-[0.97222222vw] font-medium leading-none">
                                Temperatura Mínima
                            </p>
                            
                            {/*  */}
                            <p className="text-black font-poppins text-[1.11111111vw] font-semibold mt-[2.34375vh]">
                                Temperatura Média
                            </p>
                            <p className="text-black font-poppins text-[0.97222222vw] font-medium leading-none">
                                Temperatura Média
                            </p>
                    </div>
                    <div className="w-[48.2638889vw] h-[33.203125vh] flex-shrink-0 rounded-[0.69444444vw] bg-white shadow-[0_0_0.55555556vw_0_rgba(0,0,0,0.25)] ml-[1.11111111vw]">
                        <div className="w-[8.61111111vw] h-[2.34375vh] flex-shrink-0 rounded-[0.69444444vw] bg-[#005B92] shadow-[0_0_0.55555556vw_0_rgba(0,0,0,0.25)] m-auto mt-[1.5625vh] text-center content-center">
                            <p className="text-white font-poppins text-[0.83333333vw] font-medium">
                                Temperatura
                            </p>
                        </div>
                    </div>
                </div>
                <div name="Info" className="flex mt-[1.5625vh] ml-[1.66666667vw]">
                    <div className="w-[16.1805556vw] h-[33.203125vh] rounded-[0.69444444vw] shadow-[0_0_0.55555556vw_0_rgba(0,0,0,0.25)] p-[1.11111111vw]">
                            {/*  */}
                            <p className="text-black font-poppins text-[1.11111111vw] font-semibold">
                                Vibração Máxima
                            </p>
                            <p className="text-black font-poppins text-[0.97222222vw] font-medium leading-none">
                                Vibração Máxima
                            </p>
                            
                            {/*  */}
                            <p className="text-black font-poppins text-[1.11111111vw] font-semibold mt-[2.34375vh]">
                                Vibração Mínima
                            </p>
                            <p className="text-black font-poppins text-[0.97222222vw] font-medium leading-none">
                                Vibração Mínima
                            </p>
    
                            {/*  */}
                            <p className="text-black font-poppins text-[1.11111111vw] font-semibold mt-[2.34375vh]">
                                Vibração Média
                            </p>
                            <p className="text-black font-poppins text-[0.97222222vw] font-medium leading-none">
                                Vibração Média
                            </p>
                    </div>
                    <div className="w-[48.2638889vw] h-[33.203125vh] flex-shrink-0 rounded-[0.69444444vw] bg-white shadow-[0_0_0.55555556vw_0_rgba(0,0,0,0.25)] ml-[1.11111111vw]">
                        <div className="w-[8.61111111vw] h-[2.34375vh] flex-shrink-0 rounded-[0.69444444vw] bg-[#005B92] shadow-[0_0_0.55555556vw_0_rgba(0,0,0,0.25)] m-auto mt-[1.5625vh] text-center content-center">
                            <p className="text-white font-poppins text-[0.83333333vw] font-medium">
                                Vibração
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
