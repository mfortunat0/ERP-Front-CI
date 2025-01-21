import { Product } from "@/interfaces";
import { FaX } from "react-icons/fa6";
import { Modal } from "@/components/modal";
import noPhoto from "@/assets/no-photo-available.jpg";
import style from "./index.module.css";

interface ModalLocal {
  visibility: boolean;
  selectedItem: Product | undefined;
  codfir: string | null;
  setVisibility: (visibility: boolean) => void;
}

export function ModalLocal({
  selectedItem,
  setVisibility,
  visibility,
  codfir,
}: ModalLocal) {
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
            src={`http://192.168.100.100:9060/fotos/localizacao/${codfir}/${
              selectedItem?.LOCAL
            }.jpg?v=${Date.now()}`}
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
