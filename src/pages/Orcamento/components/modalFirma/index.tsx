import { ChangeEvent, FormEvent, useState } from "react";
import { FaMagnifyingGlass, FaX } from "react-icons/fa6";
import { Firma } from "@/interfaces";
import { toastError, toastPromise } from "@/utils/toast";
import { ciAxios } from "@/utils/ciAxios";
import style from "./index.module.css";
import { Modal } from "@/components/modal";

interface ModalFirmaProps {
  visibility: boolean;
  firmas: Firma[];
  inputVendedorRef: React.RefObject<HTMLInputElement>;
  setVisibility: (visibility: boolean) => void;
  setSelectedFirma: (firma: Firma) => void;
  setFirmas: (firmas: Firma[]) => void;
  setInputCliente: (firma: string) => void;
}

export function ModalFirma({
  inputVendedorRef,
  setVisibility,
  setSelectedFirma,
  setInputCliente,
  visibility,
  setFirmas,
  firmas,
}: ModalFirmaProps) {
  const [inputModalSearchFirma, setInputModalSearchFirma] = useState("");

  const onSubmitSearchFirma = async () => {
    if (inputModalSearchFirma) {
      try {
        const URL = `${
          import.meta.env.VITE_SERVER_NODE_URL
        }/cliente?firma=${inputModalSearchFirma}`;

        const { data: firmas } = await toastPromise({
          asyncFunction: ciAxios.get<Firma[]>(URL),
          pendingMessage: "Buscando 🔎",
        });

        if (firmas.length > 0) {
          if (firmas.length === 1) {
            setSelectedFirma(firmas[0]);
            setVisibility(false);
            setInputModalSearchFirma("");
            if (inputVendedorRef.current) {
              inputVendedorRef.current.focus();
            }
          } else {
            setFirmas(firmas);
          }
        } else {
          toastError({
            message: `Nenhum resultado encontrado para "${inputModalSearchFirma}"`,
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          toastError({ message: error.message });
        }
      }
    }
  };

  const onSelectedFirma = (firma: Firma) => {
    setFirmas([]);
    setSelectedFirma(firma);
    setVisibility(false);
    setInputModalSearchFirma("");
    setTimeout(() => {
      if (inputVendedorRef.current) {
        inputVendedorRef.current.focus();
      }
    }, 100);
  };

  const onChangeInputModalSearchFirma = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setInputModalSearchFirma(event.target.value);
  };

  return (
    <Modal visibility={visibility} setVisibility={setVisibility}>
      <button
        className="dangerButton rightButton"
        onClick={() => setVisibility(false)}
      >
        <FaX />
      </button>
      <form
        onSubmit={(event: FormEvent) => event.preventDefault()}
        className={style.formContainer}
      >
        <input
          type="text"
          autoFocus
          placeholder="Pesquisar um firma..."
          value={inputModalSearchFirma}
          onChange={onChangeInputModalSearchFirma}
        />
        <button onClick={onSubmitSearchFirma}>
          <FaMagnifyingGlass />
        </button>
      </form>
      {firmas.length > 0 && (
        <div className={style.tableWrapper}>
          <table className={style.tableFixHead}>
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Firma</th>
                <th>Fantasia</th>
                <th>CNPJ</th>
              </tr>
            </thead>
            <tbody>
              {firmas.map((firma) => (
                <tr
                  key={firma.CODCLI}
                  onClick={() => {
                    onSelectedFirma(firma);
                    setTimeout(() => {
                      setInputCliente(firma.CODCLI.toString());
                    }, 50);
                  }}
                >
                  <td>{firma.CODCLI}</td>
                  <td>{firma.FIRMA}</td>
                  <td>{firma.FANTASIA}</td>
                  <td>{firma.CNPJ}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}
