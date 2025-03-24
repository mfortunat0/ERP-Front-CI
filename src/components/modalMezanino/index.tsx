import style from "./index.module.css";
import { ChangeEvent, useState } from "react";
import { FaX } from "react-icons/fa6";
import { Product } from "@/interfaces";
import { printMezanino } from "@/utils/printMezanino";
import { Modal } from "@/components/modal";

interface ModalMezanino {
  visibility: boolean;
  selectedProduto: Product | undefined;
  setVisibility: (visibility: boolean) => void;
}

export function ModalMezanino({
  selectedProduto,
  setVisibility,
  visibility,
}: ModalMezanino) {
  const user = localStorage.getItem("user")?.split("-")[0];
  const [inputMezaninoVendedor, setInputMezaninoVendedor] = useState("");
  const [inputMezaninoQtd, setInputMezaninoQtd] = useState("");

  const onClickRequestMezanino = async (
    product: Product,
    QTD: number,
    VENDEDOR?: number
  ) => {
    printMezanino({
      QTD,
      product,
      VENDEDOR,
      user: user || "",
      onError: "Erro ao tentar enviar dados",
      onSucess: {
        render() {
          setInputMezaninoQtd("");
          setInputMezaninoVendedor("");
          setVisibility(false);
          return "Enviado com sucesso";
        },
      },
    });
  };

  const onChangeInputMezaninoVendedor = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setInputMezaninoVendedor(event.target.value);
  };

  const onChangeInputMezaninoQtd = (event: ChangeEvent<HTMLInputElement>) => {
    setInputMezaninoQtd(event.target.value);
  };

  return (
    <Modal
      visibility={visibility}
      setVisibility={setVisibility}
      viewHeight={window.innerWidth > 800 ? 44 : 45}
      viewWidth={window.innerWidth > 800 ? 24 : 60}
    >
      <button
        className="dangerButton rightButton"
        onClick={() => setVisibility(false)}
      >
        <FaX />
      </button>
      <form
        onSubmit={(event) => event.preventDefault()}
        className={style.dialogFormMezanino}
      >
        <h4>Codigo do vendedor</h4>
        <input
          type="number"
          value={inputMezaninoVendedor}
          onChange={onChangeInputMezaninoVendedor}
          placeholder="Codigo vendedor"
          autoFocus
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          aria-autocomplete="none"
        />
        <h4>Quantidade</h4>
        <input
          type="number"
          value={inputMezaninoQtd}
          onChange={onChangeInputMezaninoQtd}
          placeholder="Quantidade"
          autoFocus
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          aria-autocomplete="none"
          required
        />
        <button
          onClick={() => {
            if (selectedProduto) {
              onClickRequestMezanino(
                selectedProduto,
                Number(inputMezaninoQtd),
                Number(inputMezaninoVendedor)
              );
            }
          }}
        >
          Solicitar
        </button>
      </form>
    </Modal>
  );
}
