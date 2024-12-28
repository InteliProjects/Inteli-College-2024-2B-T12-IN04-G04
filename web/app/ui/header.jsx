import LogoIpt from "../public/logoIPT.png";
import Image from 'next/image';

export default function Header() {
    return (
        <div className="bg-[#005B92] text-white flex items-center">
          <a href="/home"><Image src={LogoIpt} alt="Computer" className="w-[4vw] h-[4vw]"/></a>
      </div>
    );
}
