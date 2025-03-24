import style from "./index.module.css";
import noPhoto from "@/assets/no-photo-available.jpg";
import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
import {
  FaEraser,
  FaMagnifyingGlass,
  FaPlus,
  FaRegRectangleList,
} from "react-icons/fa6";
import { toastError, toastPromise } from "@/utils/toast";
import { ciAxios } from "@/utils/ciAxios";
import { blurAllInputs } from "@/utils/blurInputs";
import { Firma, Product, ProductStore, Vendedor } from "@/interfaces";

interface Form {
  produtos: Product[];
  formVisualizationType: "card" | "line";
  selectedFirma: Firma | undefined;
  selectedVendedor: Vendedor | undefined;
  selectedProduto: Product | undefined;
  produtoComplementares: Product[];
  inputTextSearchRef: React.RefObject<HTMLInputElement>;
  setProdutos: (produtos: Product[]) => void;
  setSelectedProduto: (produto: Product | undefined) => void;
  onSelectedProduct: (produto: Product) => void;
  setProdutoComplementares: (produtos: Product[]) => void;
  addProductToStore: (produto: ProductStore) => void;
  setFormVisualizationType: (type: "card" | "line") => void;
}

export function Form({
  inputTextSearchRef,
  setProdutos,
  setSelectedProduto,
  setProdutoComplementares,
  onSelectedProduct,
  selectedFirma,
  selectedVendedor,
  produtos,
  selectedProduto,
  addProductToStore,
  produtoComplementares,
  formVisualizationType,
  setFormVisualizationType,
}: Form) {
  const codfir = localStorage.getItem("codfir");
  const [inputTextSearch, setInputTextSearch] = useState("");

  //@ts-expect-error: global key
  window.onkeydown = (event: KeyboardEvent<Element>) => {
    if (window.innerWidth >= 1024) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
      }
      onKeyPress(event.key);
    }
  };

  const onKeyPress = async (key: string) => {
    if (produtos.length > 0) {
      if (key === "ArrowUp") {
        const index = produtos.findIndex(
          (findProduto) => findProduto.CODPRO === selectedProduto?.CODPRO
        );

        const previousPosition = index - 1;
        if (produtos[previousPosition].CODPRO) {
          const table =
            document.querySelector("." + style.cardsContainer) ||
            document.querySelector("." + style.tableWrapper);

          const rowSelected = document.querySelector<HTMLTableRowElement>(
            "." + style.activeRow
          );

          const cardSelected = document.querySelector<HTMLTableRowElement>(
            "." + style.activeCard
          );

          if (table) {
            if (cardSelected) {
              table.scrollTop = cardSelected.offsetTop - 300;
            }
            if (rowSelected) {
              table.scrollTop = rowSelected.offsetTop - 160;
            }
          }

          onSelectedProduct(produtos[previousPosition]);
        }
      }

      if (key === "ArrowDown") {
        const index = produtos.findIndex(
          (findProduto) => findProduto.CODPRO === selectedProduto?.CODPRO
        );

        const nextPosition = index + 1;
        if (produtos[nextPosition].CODPRO) {
          const table =
            document.querySelector("." + style.cardsContainer) ||
            document.querySelector("." + style.tableWrapper);

          const rowSelected = document.querySelector<HTMLTableRowElement>(
            "." + style.activeRow
          );

          const cardSelected = document.querySelector<HTMLTableRowElement>(
            "." + style.activeCard
          );

          if (table) {
            if (cardSelected) {
              table.scrollTop = cardSelected.offsetTop - 300;
            }
            if (rowSelected) {
              table.scrollTop = rowSelected.offsetTop - 160;
            }
          }

          onSelectedProduct(produtos[nextPosition]);
        }
      }
    }
  };

  const onChangeInputTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setInputTextSearch(event.target.value);
  };

  const onSubmitProduto = async () => {
    blurAllInputs();
    setProdutos([]);
    setSelectedProduto(undefined);
    setProdutoComplementares([]);

    const { data: produtosResponse } = await toastPromise({
      asyncFunction: ciAxios.post<Product[]>(
        `${import.meta.env.VITE_SERVER_NODE_URL}/pesquisa_produtos`,
        {
          codpro: inputTextSearch,
          firm: codfir,
        }
      ),
      pendingMessage: "Buscando produtos 🔎",
    });

    if (produtosResponse.length) {
      const tableWrapper = document.querySelector("." + style.cardsContainer);

      tableWrapper?.scrollTo(0, 0);

      setProdutos(produtosResponse);
      if (produtosResponse.length > 0) {
        onSelectedProduct(produtosResponse[0]);
      }
    } else {
      toastError({
        message: `Nenhum resultado encontrado para "${inputTextSearch}"`,
      });
    }
  };

  const onChangeVizualizationType = () => {
    if (formVisualizationType === "card") {
      setFormVisualizationType("line");
    } else {
      setFormVisualizationType("card");
    }
  };

  const onClickInputQtd = (
    event: MouseEvent<HTMLDivElement>,
    produto: Product
  ) => {
    if (event.target instanceof HTMLElement) {
      if (event.target.tagName.toLocaleLowerCase() !== "input") {
        onSelectedProduct(produto);
      }
    }
  };

  return (
    <div className={style.formContainer}>
      <form onSubmit={(event: FormEvent) => event.preventDefault()}>
        <button type="button" onClick={onChangeVizualizationType}>
          <FaRegRectangleList />
        </button>
        <input
          placeholder="Pesquisar um produto..."
          type="text"
          value={inputTextSearch}
          onChange={onChangeInputTextSearch}
          ref={inputTextSearchRef}
          disabled={!(!!selectedFirma && !!selectedVendedor)}
        />
        <button onClick={onSubmitProduto}>
          <FaMagnifyingGlass />
        </button>
        <button onClick={() => setInputTextSearch("")}>
          <FaEraser />
        </button>
      </form>

      {produtos.length > 0 && formVisualizationType === "card" && (
        <div className={style.cardsContainer}>
          {produtos.map((produto, index) => {
            return (
              <div
                className={`${style.card} ${
                  selectedProduto?.CODPRO === produto.CODPRO
                    ? style.activeCard
                    : ""
                }`}
                key={produto.CODPRO + "-card-" + index}
                onClick={() => {
                  onSelectedProduct(produto);
                }}
              >
                <img
                  src={`http://192.168.100.100:9060/fotos/P${produto.CODPRO.replace(
                    ".",
                    ""
                  )}.jpg?v=${Date.now()}`}
                  onError={(event) =>
                    ((event.target as HTMLImageElement).src = noPhoto)
                  }
                  alt={"."}
                />
                <div>
                  <p className={style.descricaoProduto}>{produto.DESCR}</p>
                  <p className={style.precoProduto}>
                    <b>
                      R$
                      {produto.VRVENDA?.toFixed(2).toString().replace(".", ",")}
                    </b>{" "}
                    - R$
                    {produto.VRATAC?.toFixed(2).toString().replace(".", ",")}
                  </p>
                  <p>
                    <b>CODPRO</b>: {produto.CODPRO}
                  </p>
                  <p>
                    <b>CODUNI</b>: {produto.CODUNI}
                  </p>
                  <p>
                    {produto.SALDO || produto.PEREQUE?.SALDO ? (
                      <b>
                        {produto.SALDO
                          ? `Itaguá: ${produto.SALDO}`
                          : "Itagua: 0"}{" "}
                        {(produto.PEREQUE?.SALDO || 0) > 0
                          ? `| Pereque: ${produto.PEREQUE?.SALDO}`
                          : "| Pereque: 0"}
                      </b>
                    ) : (
                      <b>
                        {selectedProduto?.CODPRO === produto.CODPRO
                          ? "Sem estoque"
                          : ""}
                      </b>
                    )}
                  </p>
                </div>
                <form onSubmit={(event: FormEvent) => event.preventDefault()}>
                  <input
                    type="number"
                    id={`input-${index}`}
                    placeholder="Qtd: 1"
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector<HTMLInputElement>(
                        `#input-${index}`
                      );
                      const QTD = Number(input?.value) || 1;

                      if (Number(QTD)) {
                        const produtoStore = {
                          ...produto,
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
            );
          })}
        </div>
      )}

      {produtos.length > 0 && formVisualizationType === "line" && (
        <div className={style.tableContainer}>
          <div className={style.tableWrapper}>
            <table className={style.tableFixHead}>
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Descrição</th>
                  <th>Quantidade</th>
                  <th>VENDA</th>
                  <th>ATACADO</th>
                  <th>CODUNI</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto, index) => {
                  return (
                    <tr
                      key={produto.CODPRO + "-table-" + index}
                      onClick={(event) => {
                        onClickInputQtd(event, produto);
                      }}
                      className={
                        selectedProduto?.CODPRO === produto.CODPRO
                          ? style.activeRow
                          : ""
                      }
                    >
                      <td>{produto.CODPRO}</td>
                      <td>{produto.DESCR}</td>
                      <td>
                        <input
                          type="number"
                          onKeyDown={(event) => {
                            if (event.key.toLocaleLowerCase() === "enter") {
                              if (event.target instanceof HTMLInputElement) {
                                addProductToStore({
                                  ...produto,
                                  QTD: Number(event.target.value) || 1,
                                });
                                event.target.value = "";
                              }
                            }
                          }}
                        />
                      </td>
                      <td>
                        R$ {(produto.VRVENDA || 0).toFixed(2).replace(".", ",")}
                      </td>
                      <td>
                        R$ {(produto.VRATAC || 0).toFixed(2).replace(".", ",")}
                      </td>
                      <td>{produto.CODUNI}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {produtoComplementares.length > 0 && (
        <footer>
          <h4>Produtos complementares</h4>
          {produtoComplementares.map((complementar, index) => (
            <div key={complementar.CODPRO + "-complementar-" + index}>
              <img
                src={`http://192.168.100.100:9060/fotos/P${complementar.CODPRO.replace(
                  ".",
                  ""
                )}.jpg?v=${Date.now()}`}
                onError={(event) =>
                  ((event.target as HTMLImageElement).src = noPhoto)
                }
                alt=""
              />
              <p>{complementar.DESCR}</p>
              <form onClick={(event: FormEvent) => event.preventDefault()}>
                <input
                  type="number"
                  placeholder="Qtd: 1"
                  id={`input-complementar-${index}`}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector<HTMLInputElement>(
                      `#input-complementar-${index}`
                    );
                    const QTD = Number(input?.value) || 1;
                    if (Number(QTD) && complementar) {
                      const produtoStore = {
                        ...complementar,
                        QTD,
                      };
                      addProductToStore(produtoStore);
                      setProdutoComplementares([]);
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
          ))}
        </footer>
      )}
    </div>
  );
}
