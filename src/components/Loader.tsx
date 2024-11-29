import Image from "next/image";
import loader from "../public/assets/icons/loader.svg";
export default function Loader() {
  return (
    <>
      <div className="loader">
        <Image
          src={loader}
          alt="loader"
          width={32}
          height={32}
          className="animate-spin"
        />
      </div>
    </>
  );
}
