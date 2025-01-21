import { Product } from "@/interfaces";
import { FaX } from "react-icons/fa6";
import { Modal } from "@/components/modal";
import noPhoto from "@/assets/no-photo-available.jpg";
import style from "./index.module.css";

interface ModalPhotoLocal {
  visibility: boolean;
  selectedItem: Product | undefined;
  codfir: string | null;
  setVisibility: (visibility: boolean) => void;
}

export function ModalPhotoLocal({
  codfir,
  selectedItem,
  setVisibility,
  visibility,
}: ModalPhotoLocal) {
  return (
    <Modal
      visibility={visibility}
      setVisibility={setVisibility}
      viewHeight={76}
    >
      <div className={style.container}>
        <button
          className="dangerButton rightButton"
          onClick={() => setVisibility(false)}
        >
          <FaX />
        </button>
        <div className={style.content}>
          <h3>EAN: {selectedItem?.EAN}</h3>
          <h3>Local: {selectedItem?.LOCAL}</h3>
        </div>
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
          <img
            src={`http://192.168.100.100:9060/fotos/localizacao/${codfir}/${
              selectedItem?.LOCAL
            }.jpg?v=${Date.now()}`}
            alt="Local não cadastrado"
            onError={(event) =>
              ((event.target as HTMLImageElement).src = noPhoto)
            }
          />
        </div>
      </div>
    </Modal>
  );
}
