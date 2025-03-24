import { ChangeEvent, FormEvent, useState } from "react";
import { FaMagnifyingGlass, FaX } from "react-icons/fa6";
import { Vendedor } from "@/interfaces";
import { Modal } from "@/components/modal";
import style from "./index.module.css";

interface ModalVendedorProps {
  visibility: boolean;
  vendedores: Vendedor[];
  inputTextSearchRef: React.RefObject<HTMLInputElement>;
  tempVendedores: Vendedor[];
  setVisibility: (visibility: boolean) => void;
  setVendedores: (vendedores: Vendedor[]) => void;
  setTempVendedores: (vendedores: Vendedor[]) => void;
  setSelectedVendedor: (vendedor: Vendedor) => void;
  setInputVendedor: (vendedor: string) => void;
}

export function ModalVendedor({
  setVisibility,
  visibility,
  setVendedores,
  setSelectedVendedor,
  setInputVendedor,
  vendedores,
  inputTextSearchRef,
  tempVendedores,
  setTempVendedores,
}: ModalVendedorProps) {
  const [inputModalVendedor, setInputModalVendedor] = useState("");

  const onSelectedVendedor = (vendedor: Vendedor) => {
    setVendedores([]);
    setSelectedVendedor(vendedor);
    setVisibility(false);
    setTimeout(() => {
      if (inputTextSearchRef.current) {
        inputTextSearchRef.current.focus();
      }
    }, 100);
  };

  const onChangeInputModalVendedor = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    const filterVendedor = vendedores.filter((vendedor) =>
      vendedor.NOME.includes(text.toUpperCase())
    );
    setTempVendedores(filterVendedor);
    setInputModalVendedor(text);
  };

  return (
    <Modal
      visibility={visibility}
      setVisibility={setVisibility}
      viewWidth={30}
      viewHeight={60}
    >
      <button
        className="dangerButton rightButton"
        onClick={() => setVisibility(false)}
      >
        <FaX />
      </button>

      <form
        className={style.modalForm}
        onSubmit={(event: FormEvent) => event.preventDefault()}
      >
        <input
          type="text"
          value={inputModalVendedor}
          onChange={onChangeInputModalVendedor}
        />
        <button>
          <FaMagnifyingGlass />
        </button>
      </form>

      <div className={style.tableWrapper}>
        <table className={style.tableFixHead}>
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Nome</th>
            </tr>
          </thead>
          <tbody>
            {tempVendedores.map((vendedor) => (
              <tr
                key={vendedor.CODVEN}
                onClick={() => {
                  setTimeout(() => {
                    setInputVendedor(vendedor.CODVEN.toString());
                  }, 100);
                  onSelectedVendedor(vendedor);
                  setVisibility(false);
                }}
              >
                <td>{vendedor.CODVEN}</td>
                <td>{vendedor.NOME}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
