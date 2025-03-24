import { Product } from "@/interfaces";
import { FaX } from "react-icons/fa6";
import { Modal } from "@/components/modal";
import noPhoto from "@/assets/no-photo-available.jpg";
import style from "./index.module.css";

interface ModalPhoto {
  visibility: boolean;
  selectedItem: Product | undefined;
  setVisibility: (visibility: boolean) => void;
}

export function ModalPhoto({
  selectedItem,
  setVisibility,
  visibility,
}: ModalPhoto) {
  return (
    <Modal
      visibility={visibility}
      setVisibility={setVisibility}
      viewHeight={94}
      viewWidth={window.innerWidth > 1029 ? 50 : 90}
    >
      <div className={style.container}>
        <button
          className="dangerButton rightButton"
          onClick={() => setVisibility(false)}
        >
          <FaX />
        </button>
        <div className={style.content}>
          <img
            src={`http://192.168.100.100:9060/fotos/P${selectedItem?.CODPRO.replace(
              ".",
              ""
            )}.jpg?v=${Date.now()}`}
            onError={(event) =>
              ((event.target as HTMLImageElement).src = noPhoto)
            }
            alt="Foto produto"
          />
        </div>
      </div>
    </Modal>
  );
}
