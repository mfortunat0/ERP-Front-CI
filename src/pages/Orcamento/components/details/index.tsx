import noPhoto from "@/assets/no-photo-available.jpg";
import style from "./index.module.css";
import { FaBars, FaPlus } from "react-icons/fa6";
import { Product, ProductStore } from "@/interfaces";
import { FormEvent } from "react";

interface Details {
  visibilityFichaAnalitica: boolean;
  selectedProduto: Product;
  produtoSemelhante: Product | undefined;
  setVisibilityFichaAnalitica: (visibility: boolean) => void;
  addProductToStore: (produto: ProductStore) => void;
  setVisibilityModalMezanino: (visibility: boolean) => void;
  setVisibilityModalFalta: (visibility: boolean) => void;
}

export function Details({
  visibilityFichaAnalitica,
  setVisibilityFichaAnalitica,
  selectedProduto,
  produtoSemelhante,
  addProductToStore,
  setVisibilityModalMezanino,
  setVisibilityModalFalta,
}: Details) {
  return (
    <div className={style.detailsContainer}>
      <header>
        <button
          className={style.fichaAnaliticaButton}
          onClick={() => setVisibilityFichaAnalitica(!visibilityFichaAnalitica)}
        >
          <FaBars />
        </button>
        <h2>Dados do Produto</h2>
        <img
          src={`http://192.168.100.100:9060/fotos/P${selectedProduto.CODPRO.replace(
            ".",
            ""
          )}.jpg?v=${Date.now()}`}
          onError={(event) =>
            ((event.target as HTMLImageElement).src = noPhoto)
          }
          alt={"."}
        />
        <h3>{selectedProduto.DESCR}</h3>
        <div>
          <div>
            <p>
              Venda: R${" "}
              <b>{selectedProduto.VRVENDA?.toFixed(2).replace(".", ",")}</b>
            </p>
            <p>
              Atacado:{" "}
              <b>R$ {selectedProduto.VRATAC?.toFixed(2).replace(".", ",")}</b>
            </p>
          </div>
        </div>
      </header>
      <footer>
        {visibilityFichaAnalitica && produtoSemelhante?.DESCR ? (
          <div
            className={style.produtoSemelhantesContainer}
            style={{
              display: produtoSemelhante ? "flex" : "none",
            }}
          >
            <h3>Produto Semelhante</h3>
            <img
              src={`http://192.168.100.100:9060/fotos/P${produtoSemelhante?.CODPRO.replace(
                ".",
                ""
              )}.jpg?v=${Date.now()}`}
              onError={(event) =>
                ((event.target as HTMLImageElement).src = noPhoto)
              }
              alt={"."}
            />
            <h5>{produtoSemelhante?.DESCR}</h5>
            <div
              className={`${style.dados} ${
                produtoSemelhante.VRVENDA || 0 < (selectedProduto.VRVENDA || 0)
                  ? style.barato
                  : style.caro
              }`}
            >
              <p>
                VR Venda: R${" "}
                {produtoSemelhante.VRVENDA?.toFixed(2).replace(".", ",")}
              </p>
              <p>
                VR Atac: R${" "}
                {produtoSemelhante?.VRATAC?.toFixed(2).replace(".", ",")}
              </p>
            </div>
            <form
              onSubmit={(event: FormEvent) => event.preventDefault()}
              className={style.formulario}
            >
              <input
                id={"input-semelhante"}
                type="number"
                placeholder="Qtd: 1"
              />
              <button
                onClick={() => {
                  const input =
                    document.querySelector<HTMLInputElement>(
                      `#input-semelhante`
                    );
                  const QTD = Number(input?.value) || 1;
                  if (Number(QTD) && produtoSemelhante) {
                    const produtoStore = {
                      ...produtoSemelhante,
                      QTD,
                    };
                    addProductToStore(produtoStore);
                    if (input) {
                      input.value = "";
                    }
                  }
                }}
              >
                <FaPlus />
              </button>
            </form>
          </div>
        ) : (
          <div className={style.fichaAnalitica}>
            <textarea disabled value={selectedProduto.OBS || ""} />
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Firma</th>
                    <th>Saldo</th>
                    <th>Ult. Compra</th>
                    <th>Qtd. Compra</th>
                    <th>Ult. Venda</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Itagua</td>
                    <td>{selectedProduto.SALDO}</td>
                    <td>{selectedProduto.ULT_COMPRA}</td>
                    <td>{selectedProduto.QTD_ULT_COMPRA}</td>
                    <td>{selectedProduto.VENDA_ULT_COMPRA}</td>
                  </tr>
                  <tr>
                    <td>Pereque</td>
                    <td>{selectedProduto.PEREQUE?.SALDO}</td>
                    <td>{selectedProduto.PEREQUE?.ULT_COMPRA}</td>
                    <td>{selectedProduto.PEREQUE?.QTD_ULT_COMPRA}</td>
                    <td>{selectedProduto.PEREQUE?.VENDA_ULT_COMPRA}</td>
                  </tr>
                  <tr>
                    <td>99</td>
                    <td>{selectedProduto.SALDO_PRE}</td>
                    <td>{selectedProduto.ULT_COMPRA_PRE}</td>
                    <td>----</td>
                    <td>----</td>
                  </tr>
                  <tr>
                    <td>100</td>
                    <td>{selectedProduto.PEREQUE?.SALDO_PRE}</td>
                    <td>{selectedProduto.PEREQUE?.ULT_COMPRA_PRE}</td>
                    <td>----</td>
                    <td>----</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <button onClick={() => setVisibilityModalMezanino(true)}>
                Solicitar Mezanino
              </button>
              <button
                className="dangerButton"
                onClick={() => setVisibilityModalFalta(true)}
              >
                Falta
              </button>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
