import { Modal } from "@/components/modal";
import { Product } from "@/interfaces";
import { insertIntoFalta } from "@/utils/insertFalta";
import { FaX } from "react-icons/fa6";
import style from "./index.module.css";

interface ModalInserFalta {
  visibility: boolean;
  selectedItemFalta: Product | undefined;
  listFalta: number;
  firma: string | null;
  setListFalta: (listFalta: number) => void;
  setVisibility: (visibility: boolean) => void;
}

export function ModalInserFalta({
  listFalta,
  selectedItemFalta,
  setListFalta,
  setVisibility,
  visibility,
  firma,
}: ModalInserFalta) {
  return (
    <Modal
      visibility={visibility}
      setVisibility={setVisibility}
      viewHeight={window.innerWidth > 800 ? 25 : 26}
      viewWidth={window.innerWidth > 800 ? 25 : 65}
    >
      <div>
        <button
          className="dangerButton rightButton"
          onClick={() => setVisibility(false)}
        >
          <FaX />
        </button>
      </div>
      <div className={style.modalFooter}>
        <button
          onClick={() => {
            if (selectedItemFalta) {
              insertIntoFalta({
                firma,
                product: selectedItemFalta,
                listFalta,
                falta: "S",
                saldoerr: "N",
                setListFalta,
              });
              setVisibility(false);
            }
          }}
        >
          Inserir na falta?
        </button>
        <button
          onClick={() => {
            if (selectedItemFalta) {
              insertIntoFalta({
                firma,
                product: selectedItemFalta,
                listFalta,
                falta: "S",
                saldoerr: "S",
                setListFalta,
              });
              setVisibility(false);
            }
          }}
        >
          Inserir na falta e contagem?
        </button>
      </div>
    </Modal>
  );
}
