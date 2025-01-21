import { Modal } from "@/components/modal";
import { FaX } from "react-icons/fa6";
import { Product } from "@/interfaces";
import noPhoto from "../../assets/no-photo-available.jpg";
import style from "./index.module.css";

interface ModalSelectedProductMobile {
  visibility: boolean;
  selectedProduto: Product | undefined;
  codfir: string | null;
  setVisibility: (visibility: boolean) => void;
}

export function ModalSelectedProductMobile({
  selectedProduto,
  setVisibility,
  visibility,
  codfir,
}: ModalSelectedProductMobile) {
  return (
    <Modal setVisibility={setVisibility} visibility={visibility}>
      <div className={style.modalHeader}>
        <button onClick={() => setVisibility(false)}>
          <FaX />
        </button>
      </div>
      <footer className={style.modalConsultaProdutoFooter}>
        <div>
          <h1>Estoque</h1>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Firma</th>
                <th>Saldo</th>
                <th>Ult. Compra</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Itagua</td>
                <td>{selectedProduto?.SALDO}</td>
                <td>{selectedProduto?.ULT_COMPRA}</td>
              </tr>
              <tr>
                <td>Pereque-Mirim</td>
                <td>{selectedProduto?.PEREQUE?.SALDO}</td>
                <td>{selectedProduto?.PEREQUE?.ULT_COMPRA}</td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>Firma</th>
                <th>Quatidade Compra</th>
                <th>Quatidade Venda</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Itagua</td>
                <td>{selectedProduto?.QTD_ULT_COMPRA}</td>
                <td>{selectedProduto?.VENDA_ULT_COMPRA}</td>
              </tr>
              <tr>
                <td>Pereque-Mirim</td>
                <td>{selectedProduto?.PEREQUE?.QTD_ULT_COMPRA}</td>
                <td>{selectedProduto?.PEREQUE?.VENDA_ULT_COMPRA}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {!!selectedProduto?.LOCAL && (
          <>
            <h1>Local: {selectedProduto.LOCAL}</h1>
            <h1>Fabricante: {selectedProduto.COD_FORN}</h1>
            <div className={style.modalConsultaProdutoLocalImage}>
              <img
                src={`http://192.168.100.100:9060/fotos/localizacao/${codfir}/${selectedProduto?.LOCAL}.jpg`}
                alt="Localizacao"
                onError={(event) =>
                  ((event.target as HTMLImageElement).src = noPhoto)
                }
              />
            </div>
          </>
        )}
        <div>
          <h1>{selectedProduto?.DESCR}</h1>
          <img
            src={`http://192.168.100.100:9060/fotos/P${selectedProduto?.CODPRO.replace(
              ".",
              ""
            )}.jpg`}
            onError={(event) =>
              ((event.target as HTMLImageElement).src = noPhoto)
            }
            alt="produto"
          />
        </div>
        <button onClick={() => setVisibility(true)}>
          Solicitar ao mezanino
        </button>
      </footer>
    </Modal>
  );
}
