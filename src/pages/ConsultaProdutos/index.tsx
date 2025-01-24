import style from "./index.module.css";
import noPhoto from "@/assets/no-photo-available.jpg";
import copy from "copy-to-clipboard";
import {
  FaCopy,
  FaEraser,
  FaFileExport,
  FaMagnifyingGlass,
  FaX,
} from "react-icons/fa6";
import { BalanceProductResponse, Product } from "@/interfaces";
import { ChangeEvent, FormEvent, KeyboardEvent, useState } from "react";
import { formatDate } from "@/utils/formatDate";
import { Link } from "react-router-dom";
import { ciAxios } from "@/utils/ciAxios";
import { formatProductToClipBoard } from "@/utils/clipboard";
import { ModalMezanino } from "@/components/modalMezanino";
import { ModalSelectedProductMobile } from "../../components/modalSelectedProductMobile";
import { ModalPhoto } from "@/components/modalPhoto";
import { blurAllInputs } from "@/utils/blurInputs";
import { ModalInserFalta } from "@/components/modalInsertFalta";
import { CardItem } from "@/components/cardItem";
import { ModalLocal } from "@/components/modalLocal";
import {
  toastClear,
  toastError,
  toastPromise,
  toastSuccess,
} from "@/utils/toast";

export function ConsultaProdutos() {
  const user = localStorage.getItem("user")?.split("-")[0];
  const codfir = localStorage.getItem("codfir");
  const [codigoOrder, setCodigoOrder] = useState(false);
  const [descricaoOrder, setDescricaoOrder] = useState(false);
  const [familiaOrder, setFamiliarOrder] = useState(false);
  const [vrVendaOrder, setVrVendarOrder] = useState(false);
  const [vrAtacOrder, setVrAtacOrder] = useState(false);
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [listFalta, setListFalta] = useState(0);
  const [inputTextSearch, setInputTextSearch] = useState("");
  const [selectedProduto, setSelectedProduto] = useState<Product | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItemFalta, setSelectedItemFalta] = useState<Product>();
  const [modalLocalVisibility, setModalLocalVisibility] = useState(false);
  const [modalPhotoVisibility, setModalPhotoVisibility] = useState(false);
  const [modalFaltaVisibility, setModalFaltaVisibility] = useState(false);
  const [modalMezaninoVisibility, setModalMezaninoVisibility] = useState(false);
  const [modalSelectedProdutoVisibility, setModalSelectedProdutoVisibility] =
    useState(false);

  //@ts-expect-error: Global key
  window.onkeydown = (event: KeyboardEvent<Element>) => {
    if (window.innerWidth >= 1024) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
      }
      onKeyPress(event.key);
    }
  };

  const onSelectedProduct = async (produto: Product) => {
    toastClear();
    try {
      produto.SALDO = 0;
      produto.ULT_COMPRA = "--/--/----";
      produto.QTD_ULT_COMPRA = 0;
      produto.VENDA_ULT_COMPRA = 0;
      produto.PEREQUE = {
        SALDO: 0,
        ULT_COMPRA: "--/--/----",
        VENDA_ULT_COMPRA: 0,
        QTD_ULT_COMPRA: 0,
      };

      const { data: saldosCompras } = await toastPromise({
        asyncFunction: ciAxios.get<BalanceProductResponse[]>(
          `${import.meta.env.VITE_SERVER_NODE_URL}/pesquisa_produtos/${
            produto.CODPRO
          }/saldos`
        ),
        pendingMessage: "Buscando saldos 🔎",
        onError: "Erro ao buscar saldo do produto",
      });

      if (saldosCompras.length > 0) {
        let ultCompraItagua = "";
        let ultCompraPereque = "";

        saldosCompras.forEach((firmaSaldo) => {
          if (firmaSaldo.CODFIR === 1) {
            produto.SALDO = firmaSaldo.SALDO || 0;
            produto.ULT_COMPRA = formatDate(firmaSaldo.ULT_COMPRA);
            ultCompraItagua = firmaSaldo.ULT_COMPRA?.substring(0, 10);
          } else if (firmaSaldo.CODFIR === 3) {
            produto.PEREQUE = {
              SALDO: firmaSaldo.SALDO,
              ULT_COMPRA: formatDate(firmaSaldo.ULT_COMPRA),
            };
            ultCompraPereque = firmaSaldo.ULT_COMPRA?.substring(0, 10);
          }
        });

        if (ultCompraItagua) {
          const { data: saldoVendasItagua } = await toastPromise({
            asyncFunction: ciAxios.get(
              `${import.meta.env.VITE_SERVER_NODE_URL}/pesquisa_produtos/${
                produto.CODPRO
              }/1/${ultCompraItagua}/saldo_venda`
            ),
            pendingMessage: "Buscando data ultima compra itagua 🔎",
            onError: "Erro ao buscar ultima compra itagua",
          });

          produto.QTD_ULT_COMPRA = saldoVendasItagua.qtd_compra;
          produto.VENDA_ULT_COMPRA = saldoVendasItagua.venda;
        } else {
          produto.QTD_ULT_COMPRA = 0;
          produto.VENDA_ULT_COMPRA = 0;
        }

        if (ultCompraPereque) {
          const { data: saldoVendasPereque } = await toastPromise({
            asyncFunction: ciAxios.get(
              `${import.meta.env.VITE_SERVER_NODE_URL}/pesquisa_produtos/${
                produto.CODPRO
              }/3/${ultCompraPereque}/saldo_venda`
            ),
            pendingMessage: "Buscando data ultima compra itagua",
            onError: "Erro ao buscar ultima compra pereque mirim",
          });

          if (produto.PEREQUE) {
            produto.PEREQUE.QTD_ULT_COMPRA = saldoVendasPereque.qtd_compra;
            produto.PEREQUE.VENDA_ULT_COMPRA = saldoVendasPereque.venda;
          }
        } else {
          if (produto.PEREQUE) {
            produto.PEREQUE.QTD_ULT_COMPRA = 0;
            produto.PEREQUE.VENDA_ULT_COMPRA = 0;
          }
        }
      }

      setSelectedProduto(produto);

      if (window.innerWidth < 1024) {
        setModalSelectedProdutoVisibility(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        toastError({ message: error.message });
      }
    }
  };

  const onInputTextSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputTextSearch(event.target.value);
  };

  const onSubmitForm = async (event: FormEvent) => {
    try {
      if (!isLoading && inputTextSearch) {
        setIsLoading(true);
        const tableWrapper = document.querySelector("." + style.tableWrapper);
        try {
          event.preventDefault();

          const urlSearch = `${
            import.meta.env.VITE_SERVER_NODE_URL
          }/pesquisa_produtos`;

          const { data: produtos } = await toastPromise({
            asyncFunction: ciAxios.post<Product[]>(urlSearch, {
              codpro: inputTextSearch,
              firm: codfir,
            }),
            pendingMessage: "Buscando 🔎",
            onError: {
              render(error) {
                return `Falha: ${error}`;
              },
            },
          });

          if (
            produtos.length !== 0 &&
            (user === "LARISSA" || user === "ALLAN")
          ) {
            await toastPromise({
              asyncFunction: Promise.all(
                produtos.map(async (produto, index) => {
                  const { data: saldosCompras } = await ciAxios.get<
                    BalanceProductResponse[]
                  >(
                    `${
                      import.meta.env.VITE_SERVER_NODE_URL
                    }/pesquisa_produtos/${produto.CODPRO}/saldos`
                  );
                  if (saldosCompras.length > 0) {
                    saldosCompras.forEach((firmaSaldo) => {
                      if (firmaSaldo.CODFIR === 1) {
                        produtos[index].SALDO = firmaSaldo.SALDO || 0;
                      }
                    });
                  }
                })
              ),
              pendingMessage: "Buscando saldos 🔎",
              onError: "Erro ao buscar saldo do produto",
            });
            setProdutos(produtos);
            setSelectedProduto(undefined);
            blurAllInputs();
          } else if (produtos.length > 0) {
            setProdutos(produtos);
            setSelectedProduto(undefined);
            blurAllInputs();
          } else {
            toastError({
              message: `Produto "${inputTextSearch}" não cadastrado`,
            });
          }
          if (tableWrapper) {
            tableWrapper.scrollTop = 0;
          }
        } catch (error) {
          if (error instanceof Error) {
            toastError({ message: error.message });
          }
        }
        setIsLoading(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        toastError({ message: error.message });
      }
    }
  };

  const onKeyPress = (key: string) => {
    if (produtos.length > 0) {
      if (key === "ArrowUp") {
        const index = produtos.findIndex(
          (findProduto) => findProduto.CODPRO === selectedProduto?.CODPRO
        );

        const previousPosition = index - 1;
        if (produtos[previousPosition].CODPRO) {
          const tableWrapper = document.querySelector("." + style.tableWrapper);
          const rowSelected = document.querySelector<HTMLTableRowElement>(
            "." + style.consultaProdutosActiveRow
          );
          if (tableWrapper) {
            if (rowSelected) {
              tableWrapper.scrollTop = rowSelected.offsetTop - 120;
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
          const tableWrapper = document.querySelector("." + style.tableWrapper);
          const rowSelected = document.querySelector<HTMLTableRowElement>(
            "." + style.consultaProdutosActiveRow
          );
          if (tableWrapper) {
            if (rowSelected) {
              tableWrapper.scrollTop = rowSelected.offsetTop - 120;
            }
          }
          onSelectedProduct(produtos[nextPosition]);
        }
      }
    }
  };

  const sortCodigo = () => {
    const sorted = produtos.sort((a, b) => {
      if (a.CODPRO && b.CODPRO) {
        if (codigoOrder) {
          return Number(b.CODPRO.replace(".", "")) >
            Number(a.CODPRO.replace(".", ""))
            ? -1
            : 0;
        } else {
          return Number(a.CODPRO.replace(".", "")) >
            Number(b.CODPRO.replace(".", ""))
            ? -1
            : 0;
        }
      }
      return 0;
    });
    setCodigoOrder(!codigoOrder);
    setProdutos([]);
    setTimeout(() => {
      setProdutos(sorted);
    }, 50);
  };

  const sortFamily = () => {
    const sorted = produtos.sort((a, b) => {
      if (a.FAMILIA && b.FAMILIA) {
        if (familiaOrder) {
          return b.FAMILIA.localeCompare(a.FAMILIA);
        } else {
          return a.FAMILIA.localeCompare(b.FAMILIA);
        }
      }
      return 0;
    });
    setFamiliarOrder(!familiaOrder);
    setProdutos([]);
    setTimeout(() => {
      setProdutos(sorted);
    }, 50);
  };

  const sortDescricao = () => {
    const sorted = produtos.sort((a, b) => {
      if (a.DESCR && b.DESCR) {
        if (descricaoOrder) {
          return a.DESCR.localeCompare(b.DESCR);
        } else {
          return b.DESCR.localeCompare(a.DESCR);
        }
      }
      return 0;
    });
    setDescricaoOrder(!descricaoOrder);
    setProdutos([]);
    setTimeout(() => {
      setProdutos(sorted);
    }, 50);
  };

  const sortVrVenda = () => {
    const sorted = produtos.sort((a, b) => {
      if (a.VRVENDA && b.VRVENDA) {
        if (vrVendaOrder) {
          return b.VRVENDA > a.VRVENDA ? -1 : 0;
        } else {
          return a.VRVENDA > b.VRVENDA ? -1 : 0;
        }
      }
      return 0;
    });
    setVrVendarOrder(!vrVendaOrder);
    setProdutos([]);
    setTimeout(() => {
      setProdutos(sorted);
    }, 50);
  };

  const sortVrAtac = () => {
    const sorted = produtos.sort((a, b) => {
      if (a.VRATAC && b.VRATAC) {
        if (vrAtacOrder) {
          return b.VRATAC > a.VRATAC ? -1 : 0;
        } else {
          return a.VRATAC > b.VRATAC ? -1 : 0;
        }
      }
      return 0;
    });
    setVrAtacOrder(!vrAtacOrder);
    setProdutos([]);
    setTimeout(() => {
      setProdutos(sorted);
    }, 50);
  };

  return (
    <>
      {window.innerWidth < 1024 && (
        <section className={style.consultaProdutosContainerMobile}>
          <h2>Consulta Produtos</h2>
          <ModalSelectedProductMobile
            codfir={codfir}
            selectedProduto={selectedProduto}
            setVisibility={setModalSelectedProdutoVisibility}
            visibility={modalSelectedProdutoVisibility}
          />
          <ModalMezanino
            selectedProduto={selectedProduto}
            setVisibility={setModalMezaninoVisibility}
            visibility={modalMezaninoVisibility}
          />
          <form>
            <input
              type="text"
              value={inputTextSearch}
              onChange={onInputTextSearchChange}
              placeholder="Pesquisar um produto..."
              autoFocus
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              aria-autocomplete="none"
            />
            <button onClick={onSubmitForm}>
              <FaMagnifyingGlass />
            </button>

            <button type="button" onClick={() => setInputTextSearch("")}>
              <FaEraser />
            </button>
            {(user === "LARISSA" || user === "ALLAN") && (
              <Link to="/autorizacaoCompra">
                <button>
                  <FaFileExport />
                </button>
              </Link>
            )}
          </form>
          <div className={style.cardsContainer}>
            {produtos.length > 0 &&
              produtos.map((produto) => (
                <CardItem
                  key={produto.CODPRO}
                  product={produto}
                  onSelectedProduct={onSelectedProduct}
                />
              ))}
          </div>
        </section>
      )}
      {window.innerWidth >= 1024 && (
        <section className={style.consultaProdutosContainerDesktop}>
          <h2>Consulta Produtos</h2>
          <ModalInserFalta
            setVisibility={setModalFaltaVisibility}
            visibility={modalFaltaVisibility}
            firma={codfir}
            listFalta={listFalta}
            selectedItemFalta={selectedItemFalta}
            setListFalta={setListFalta}
          />
          <ModalMezanino
            selectedProduto={selectedProduto}
            setVisibility={setModalMezaninoVisibility}
            visibility={modalMezaninoVisibility}
          />
          <ModalPhoto
            selectedItem={selectedProduto}
            setVisibility={setModalPhotoVisibility}
            visibility={modalPhotoVisibility}
          />
          <ModalLocal
            codfir={codfir}
            selectedItem={selectedProduto}
            setVisibility={setModalLocalVisibility}
            visibility={modalLocalVisibility}
          />
          <form>
            <input
              type="text"
              value={inputTextSearch}
              onChange={onInputTextSearchChange}
              placeholder="Pesquisar um produto..."
            />
            <button onClick={onSubmitForm}>
              <FaMagnifyingGlass />
            </button>
            <button type="button" onClick={() => setInputTextSearch("")}>
              <FaEraser />
            </button>
            {(user === "LARISSA" || user === "ALLAN") && (
              <Link to="/autorizacaoCompra">
                <button>
                  <FaFileExport />
                </button>
              </Link>
            )}
          </form>
          {produtos.length > 0 && (
            <div className={style.tableWrapper}>
              <table className={style.tableFixHead}>
                <thead>
                  <tr>
                    <th onClick={sortCodigo}>Codigo</th>
                    <th onClick={sortDescricao}>Descricao</th>
                    {user === "LARISSA" || user === "ALLAN" ? (
                      <th>SALDO</th>
                    ) : (
                      <th onClick={sortFamily}>Familia</th>
                    )}
                    <th onClick={sortVrVenda}>VR Venda</th>
                    <th onClick={sortVrAtac}>VR Atac</th>
                    <th>CODUNI</th>
                    {user === "ESTOQUE" && <th></th>}
                    {(user === "LARISSA" || user === "ALLAN") && <th></th>}
                    {user?.includes("BALCAO") && <th></th>}
                    {(user === "GIL" || user === "PAULO") && (
                      <>
                        <th>VR Custo</th>
                        <th>Margem</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((produto) => (
                    <tr
                      key={produto.CODPRO}
                      onClick={() => {
                        if (selectedProduto !== produto) {
                          onSelectedProduct(produto);
                        }
                      }}
                      className={
                        produto.CODPRO === selectedProduto?.CODPRO
                          ? style.consultaProdutosActiveRow
                          : ""
                      }
                    >
                      <td>{produto.CODPRO}</td>
                      <td>{produto.DESCR}</td>
                      <td>
                        {user === "LARISSA" || user === "ALLAN"
                          ? produto.SALDO || 0
                          : produto.FAMILIA}
                      </td>
                      <td>
                        {"R$ " +
                          produto.VRVENDA?.toFixed(2)
                            .toString()
                            .replace(".", ",")}
                      </td>
                      <td>
                        {"R$ " +
                          produto.VRATAC?.toFixed(2)
                            .toString()
                            .replace(".", ",")}
                      </td>
                      <td>{produto.CODUNI}</td>
                      {(user === "LARISSA" || user === "ALLAN") && (
                        <td>
                          <button
                            onClick={() => {
                              toastClear();
                              copy(formatProductToClipBoard(produto));
                              toastSuccess({ message: "Copiado" });
                            }}
                            style={{
                              backgroundColor:
                                selectedProduto?.CODPRO === produto.CODPRO
                                  ? "var(--primary-white)"
                                  : "",
                              color:
                                selectedProduto?.CODPRO === produto.CODPRO
                                  ? "#2596be"
                                  : "",
                            }}
                          >
                            <FaCopy
                              fill={
                                selectedProduto?.CODPRO === produto.CODPRO
                                  ? "#2596be"
                                  : "var(--primary-white)"
                              }
                            />
                          </button>
                        </td>
                      )}
                      {user?.includes("BALCAO") && (
                        <td>
                          <button
                            onClick={() => {
                              setModalMezaninoVisibility(true);
                            }}
                            style={{
                              backgroundColor:
                                selectedProduto?.CODPRO === produto.CODPRO
                                  ? "var(--primary-white)"
                                  : "",
                              color:
                                selectedProduto?.CODPRO === produto.CODPRO
                                  ? "#2596be"
                                  : "",
                            }}
                          >
                            Solicitar
                          </button>
                        </td>
                      )}
                      {user === "ESTOQUE" && (
                        <td>
                          <button
                            className="dangerButton"
                            onClick={() => {
                              setModalFaltaVisibility(true);
                              setSelectedItemFalta(produto);
                            }}
                          >
                            <FaX />
                          </button>
                        </td>
                      )}
                      {(user === "GIL" || user === "PAULO") && (
                        <>
                          <td>
                            R${" "}
                            {produto.VRCUSTO?.toFixed(2)
                              .toString()
                              .replace(".", ",")}
                          </td>
                          <td>
                            {(
                              ((produto.VRVENDA || 0) / (produto.VRCUSTO || 0) -
                                1) *
                                100 || 0
                            ).toFixed(2)}
                            %
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {selectedProduto && (
            <footer>
              <div>
                <h1>Imagem</h1>
                <img
                  src={`http://192.168.100.100:9060/fotos/P${selectedProduto?.CODPRO.replace(
                    ".",
                    ""
                  )}.jpg?v=${Date.now()}`}
                  onError={(event) =>
                    ((event.target as HTMLImageElement).src = noPhoto)
                  }
                  alt="produto"
                  onClick={() => {
                    setModalPhotoVisibility(true);
                  }}
                />
              </div>
              <div>
                <h1>Localização </h1>

                <img
                  src={`http://192.168.100.100:9060/fotos/localizacao/${codfir}/${
                    selectedProduto?.LOCAL
                  }.jpg?v=${Date.now()}`}
                  alt="Localizacao"
                  onError={(event) =>
                    ((event.target as HTMLImageElement).src = noPhoto)
                  }
                  onClick={() => {
                    setModalLocalVisibility(true);
                  }}
                />
                <h4>{selectedProduto.LOCAL}</h4>
              </div>
              <div>
                <h1>Observacao</h1>
                <textarea value={selectedProduto?.OBS || ""} disabled />
                <p>
                  <b>Codigo Fabricante: {selectedProduto.COD_FORN}</b>
                </p>
              </div>
              <div>
                <h1>Estoque</h1>
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
              </div>
              <div>
                <h1>Analise</h1>
                <table>
                  <thead>
                    <tr>
                      <th>Firma</th>
                      <th>Qtd Compra</th>
                      <th>Ult. Venda</th>
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
            </footer>
          )}
        </section>
      )}
    </>
  );
}
