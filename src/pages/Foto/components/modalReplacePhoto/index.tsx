import { Modal } from "@/components/modal";
import { Product } from "@/interfaces";
import noPhoto from "@/assets/no-photo-available.jpg";
import style from "./index.module.css";
import { FaBan, FaCheck } from "react-icons/fa6";

interface ModalReplacePhoto {
  visibility: boolean;
  productSelected: Product;
  setVisibility: (visibility: boolean) => void;
  replacePhotoServer: () => Promise<void>;
}

export function ModalReplacePhoto({
  setVisibility,
  visibility,
  productSelected,
  replacePhotoServer,
}: ModalReplacePhoto) {
  return (
    <Modal
      setVisibility={setVisibility}
      visibility={visibility}
      viewWidth={window.innerWidth > 1024 ? 30 : 90}
    >
      <div className={style.containerModal}>
        <button>Imagem ja cadastrada no sistema</button>
        <img
          src={`http://192.168.100.100:9060/fotos/P${productSelected.CODPRO.replace(
            ".",
            ""
          )}.jpg?v=${Date.now()}`}
          onError={(event) =>
            ((event.target as HTMLImageElement).src = noPhoto)
          }
          alt="imagem ja cadastrada"
        />
        <button>Deseja realmente alterar?</button>
        <div className={style.modalButtonsContainer}>
          <button onClick={replacePhotoServer}>
            <FaCheck />
          </button>
          <button className="dangerButton">
            <FaBan onClick={() => setVisibility(false)} />
          </button>
        </div>
      </div>
    </Modal>
  );
}
