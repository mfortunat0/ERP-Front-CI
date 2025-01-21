import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import style from "./index.module.css";
import noPhoto from "@/assets/no-photo-available.jpg";
import { formatDate } from "@/utils/formats";
import {
  BalanceProductResponse,
  BalanceVenda,
  Firma,
  Product,
  ProductComplementarResponse,
  Vendedor,
} from "@/interfaces";

import {
  FaAddressBook,
  FaAngleDown,
  FaAngleUp,
  FaBars,
  FaEraser,
  FaMagnifyingGlass,
  FaPlus,
  FaTrashCan,
} from "react-icons/fa6";
import { ciAxios } from "@/utils/ciAxios";
import { toastError, toastPromise, toastSuccess } from "@/utils/toast";
import { ModalFirma } from "./components/modalFirma";
import { ModalVendedor } from "./components/modalVendedor";
import { ModalMezanino } from "@/components/modalMezanino";
import { blurAllInputs } from "@/utils/blurInputs";

interface ProductStore extends Product {
  QTD: number;
}

export function Orcamento() {
  const codfir = localStorage.getItem("codfir");
  const user = localStorage.getItem("user")?.split("-")[0];
  const inputVendedorRef = useRef<HTMLInputElement>(null);
  const inputCodfirmaRef = useRef<HTMLInputElement>(null);
  const inputTextSearchRef = useRef<HTMLInputElement>(null);
  const [inputTextSearch, setInputTextSearch] = useState("");
  const [inputFrete, setInputFrete] = useState("");
  const [inputDescontoPorcentagem, setInputDescontoPorcentagem] = useState("");
  const [inputDescontoReal, setInputDescontoReal] = useState("");
  const [lockButton, setLockButton] = useState(true);
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [firmas, setFirmas] = useState<Firma[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [tempVendedores, setTempVendedores] = useState<Vendedor[]>([]);
  const [selectedVendedor, setSelectedVendedor] = useState<Vendedor>();
  const [selectedFirma, setSelectedFirma] = useState<Firma>();
  const [selectedProduto, setSelectedProduto] = useState<Product>();
  const [produtoSemelhante, setProdutoSemelhante] = useState<Product>();
  const [produtoComplementares, setProdutoComplementares] = useState<Product[]>(
    []
  );
  const [store, setStore] = useState<ProductStore[]>([]);
  const [inputTotal, setInputTotal] = useState("0.00");
  const [subTotal, setSubTotal] = useState("0.00");
  const [inputCliente, setInputCliente] = useState("");
  const [inputVendedor, setInputVendedor] = useState("");
  const [hideInformacoesExtras, setHideInformacoesExtras] = useState(true);
  const [extendCarrinho, setExtendedCarrinho] = useState(false);
  const [hideFichaAnalitica, setHideFichaAnalitica] = useState(true);
  const [visibilityModalMezanino, setVisibilityModalMezanino] = useState(false);
  const [visibilityModalFirma, setVisibilityModalFirma] = useState(false);
  const [visibilityModalVendedor, setVisibilityModalVendedor] = useState(false);

  //@ts-expect-error: global key
  window.onkeydown = (event: KeyboardEvent<Element>) => {
    if (window.innerWidth >= 1024) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
      }
      onKeyPress(event.key);
    }
  };

  useEffect(() => {
    start();
  }, []);

  const onKeyPress = async (key: string) => {
    if (produtos.length > 0) {
      if (key === "ArrowUp") {
        const index = produtos.findIndex(
          (findProduto) => findProduto.CODPRO === selectedProduto?.CODPRO
        );

        const previousPosition = index - 1;
        if (produtos[previousPosition].CODPRO) {
          const tableWrapper = document.querySelector(
            "." + style.cardsContainer
          );
          const rowSelected = document.querySelector<HTMLTableRowElement>(
            "." + style.activeRow
          );
          if (tableWrapper) {
            if (rowSelected) {
              tableWrapper.scrollTop = rowSelected.offsetTop - 300;
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
        if (produtos[nextPosition]) {
          if (produtos[nextPosition].CODPRO) {
            const tableWrapper = document.querySelector(
              "." + style.cardsContainer
            );

            const rowSelected = document.querySelector<HTMLTableRowElement>(
              "." + style.activeRow
            );

            if (tableWrapper) {
              if (rowSelected) {
                tableWrapper.scrollTop = rowSelected.offsetTop - 20;
              }
            }

            onSelectedProduct(produtos[nextPosition]);
          }
        }
      }
    }
  };

  const start = async () => {
    const urlSearch = `${import.meta.env.VITE_SERVER_NODE_URL}/cliente?firma=1`;

    const { data: firmas } = await toastPromise({
      asyncFunction: ciAxios.get<Firma[]>(urlSearch),
      pendingMessage: "Buscando 🔎",
    });

    setSelectedFirma(firmas[0]);
    setVisibilityModalFirma(false);
    setInputCliente(firmas[0].CODCLI.toString());
    if (inputVendedorRef.current) {
      inputVendedorRef.current.focus();
    }
  };

  const onChangeInputTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setInputTextSearch(event.target.value);
  };

  const onChangeInputCliente = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFirma(undefined);
    setInputCliente(event.target.value);
  };

  const onChangeInputVendedor = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedVendedor(undefined);
    setInputVendedor(event.target.value);
  };

  const onChangeInputFrete = (event: ChangeEvent<HTMLInputElement>) => {
    setInputFrete(event.target.value);
  };

  const onChangeInputDescontoPorcentagem = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setInputDescontoPorcentagem(event.target.value);
    const real =
      Number(subTotal.replace(",", ".")) *
      (Number(event.target.value.replace(",", ".")) / 100);

    setInputDescontoReal(real.toFixed(2));
  };

  const onChangeInputDescontoReal = (event: ChangeEvent<HTMLInputElement>) => {
    setInputDescontoReal(event.target.value);

    const porcentagem =
      (Number(event.target.value.replace(",", ".")) * 100) /
      Number(subTotal.replace(",", "."));
    setInputDescontoPorcentagem(porcentagem.toFixed(2));
  };

  const onChangeInputTotal = (event: ChangeEvent<HTMLInputElement>) => {
    setInputTotal(event.target.value);
  };

  const onInputTotalBlur = () => {
    if (inputDescontoPorcentagem) {
      const newReal =
        (Number(inputTotal.replace(",", ".")) *
          Number(inputDescontoPorcentagem)) /
        100;
      setInputDescontoReal(newReal.toFixed(2));
    }
  };

  const generateArrayComplementares = (
    complementares: ProductComplementarResponse[]
  ) => {
    const complementar = complementares[0];
    const arrComplementares = [];
    if (complementar.CODPRO_1) {
      arrComplementares.push({
        CODPRO: complementar.CODPRO_1,
        DESCR: complementar.DESCR_1,
        VRVENDA: complementar.VRVENDA_1,
      });
    }
    if (complementar.CODPRO_2) {
      arrComplementares.push({
        CODPRO: complementar.CODPRO_2,
        DESCR: complementar.DESCR_2,
        VRVENDA: complementar.VRVENDA_2,
      });
    }
    if (complementar.CODPRO_3) {
      arrComplementares.push({
        CODPRO: complementar.CODPRO_3,
        DESCR: complementar.DESCR_3,
        VRVENDA: complementar.VRVENDA_3,
      });
    }
    if (complementar.CODPRO_4) {
      arrComplementares.push({
        CODPRO: complementar.CODPRO_4,
        DESCR: complementar.DESCR_4,
        VRVENDA: complementar.VRVENDA_4,
      });
    }
    if (complementar.CODPRO_5) {
      arrComplementares.push({
        CODPRO: complementar.CODPRO_5,
        DESCR: complementar.DESCR_5,
        VRVENDA: complementar.VRVENDA_5,
      });
    }
    return arrComplementares;
  };

  const onSelectedProduct = async (produto: Product) => {
    const { data: balances } = await ciAxios.get<BalanceProductResponse[]>(
      `${import.meta.env.VITE_SERVER_NODE_URL}/pesquisa_produtos/${
        produto?.CODPRO
      }/saldos`
    );

    let ultCompraItagua = "";
    let ultCompraPereque = "";

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

    if (balances.length > 0) {
      balances.forEach((firmaSaldo) => {
        if (firmaSaldo.CODFIR === 1) {
          produto.SALDO = firmaSaldo.SALDO;
          produto.ULT_COMPRA =
            formatDate(firmaSaldo.ULT_COMPRA) || "--/--/----";
          ultCompraItagua = firmaSaldo.ULT_COMPRA?.substring(0, 10);
        } else if (firmaSaldo.CODFIR === 3) {
          produto.PEREQUE = {
            SALDO: firmaSaldo.SALDO || 0,
            ULT_COMPRA: formatDate(firmaSaldo.ULT_COMPRA) || "--/--/----",
          };
          ultCompraPereque =
            firmaSaldo.ULT_COMPRA?.substring(0, 10) || "--/--/----";
        }
      });

      if (ultCompraItagua) {
        const { data: saldoVendasItagua } = await ciAxios.get<BalanceVenda>(
          `${import.meta.env.VITE_SERVER_NODE_URL}/pesquisa_produtos/${
            produto.CODPRO
          }/1/${ultCompraItagua}/saldo_venda`
        );
        produto.QTD_ULT_COMPRA = saldoVendasItagua.qtd_compra || 0;
        produto.VENDA_ULT_COMPRA = saldoVendasItagua.venda || 0;
      }
      if (ultCompraPereque) {
        const { data: saldoVendasPereque } = await ciAxios.get<BalanceVenda>(
          `${import.meta.env.VITE_SERVER_NODE_URL}/pesquisa_produtos/${
            produto.CODPRO
          }/3/${ultCompraPereque}/saldo_venda`
        );
        if (produto.PEREQUE) {
          produto.PEREQUE.QTD_ULT_COMPRA = saldoVendasPereque.qtd_compra || 0;
          produto.PEREQUE.VENDA_ULT_COMPRA = saldoVendasPereque.venda || 0;
        }
      }
    }

    ciAxios
      .get<ProductComplementarResponse[]>(
        `${import.meta.env.VITE_SERVER_NODE_URL}/pesquisa_produtos/${
          produto?.CODPRO
        }/complementares`
      )
      .then((response) => {
        const complementares = response.data;
        if (complementares.length === 1) {
          setProdutoSemelhante({
            CODPRO: complementares[0].CODPRO_SEMELHANTE || "",
            DESCR: complementares[0].DESCR_S || "",
            VRVENDA: Number(complementares[0].VRVENDA_S || "0"),
            VRATAC: Number(complementares[0].VRATAC_S || "0"),
          });
          setProdutoComplementares(generateArrayComplementares(complementares));
          setHideFichaAnalitica(true);
        } else {
          setProdutoSemelhante(undefined);
          setHideFichaAnalitica(false);
          setProdutoComplementares([]);
        }
      });
    setSelectedProduto(produto);
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

      const promise = new Promise((resolve) => {
        produtosResponse.map((produto, index) => {
          ciAxios
            .get<BalanceProductResponse[]>(
              `${import.meta.env.VITE_SERVER_NODE_URL}/pesquisa_produtos/${
                produto.CODPRO
              }/saldos`
            )
            .then((response) => {
              const saldosCompras = response.data;

              if (saldosCompras.length > 0) {
                saldosCompras.forEach((firmaSaldo) => {
                  if (firmaSaldo.CODFIR === 1) {
                    produto.SALDO = firmaSaldo.SALDO;
                  } else if (firmaSaldo.CODFIR === 3) {
                    produto.PEREQUE = {
                      SALDO: firmaSaldo.SALDO,
                    };
                  }
                });
              }
              if (index + 1 === produtosResponse.length) {
                resolve(null);
              }
            });
        });
      });

      await toastPromise({
        asyncFunction: promise,
        pendingMessage: "Buscando saldos 🔎",
      });

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

  const validateFirma = async () => {
    if (inputCliente) {
      try {
        const urlSearch = `${
          import.meta.env.VITE_SERVER_NODE_URL
        }/cliente?firma=${inputCliente}`;

        const { data: firmas } = await toastPromise({
          asyncFunction: ciAxios.get<Firma[]>(urlSearch),
          pendingMessage: "Buscando 🔎",
        });

        if (firmas.length === 1) {
          setSelectedFirma(firmas[0]);
          if (inputVendedorRef.current) {
            inputVendedorRef.current.focus();
          }
        } else {
          setInputCliente("");
          toastError({ message: `Codigo "${inputCliente}" invalido` });
        }
      } catch (error) {
        if (error instanceof Error) {
          toastError({ message: error.message });
        }
      }
    }
  };

  const validateVendedor = async () => {
    if (inputVendedor) {
      try {
        const urlSearch = `${
          import.meta.env.VITE_SERVER_NODE_URL
        }/vendedor/${inputVendedor}`;

        const { data: vendedor } = await toastPromise({
          asyncFunction: ciAxios.get<Vendedor[]>(urlSearch),
          pendingMessage: "Buscando 🔎",
        });

        if (vendedor.length === 1) {
          setSelectedVendedor(vendedor[0]);
          setTimeout(() => {
            if (inputTextSearchRef.current) {
              inputTextSearchRef.current.focus();
            }
          }, 100);
        } else {
          setInputVendedor("");
          toastError({ message: `Codigo "${inputVendedor}" invalido` });
        }
      } catch (error) {
        if (error instanceof Error) {
          toastError({ message: error.message });
        }
      }
    }
  };

  const getAllVendedores = async () => {
    try {
      const urlSearch = `${import.meta.env.VITE_SERVER_NODE_URL}/vendedor`;

      const { data: vendedores } = await toastPromise({
        asyncFunction: ciAxios.get<Vendedor[]>(urlSearch),
        pendingMessage: "Buscando 🔎",
      });

      if (vendedores.length > 0) {
        setVendedores(vendedores);
        setTempVendedores(vendedores);
      } else {
        toastError({ message: "Erro ao buscar vendedores" });
      }
    } catch (error) {
      if (error instanceof Error) {
        toastError({ message: error.message });
      }
    }
  };

  const updateValues = () => {
    let subTotal = 0;

    store.forEach((produto) => {
      const totalProduto = produto.VRVENDA || 0 * produto.QTD;
      subTotal += totalProduto;
    });
    setSubTotal(subTotal.toFixed(2).replace(".", ","));

    const frete = Number(inputFrete.replace(",", "."));
    const desconto = Number(inputDescontoReal.replace(",", "."));

    if (!isNaN(frete) && !isNaN(desconto) && !isNaN(subTotal)) {
      const total = subTotal + frete - desconto;
      setTimeout(() => {
        setInputTotal(total.toFixed(2));
        const real =
          subTotal * (Number(inputDescontoPorcentagem.replace(",", ".")) / 100);
        setInputDescontoReal(real.toFixed(2));
      }, 100);
      if (total > 0) {
        setLockButton(false);
      } else {
        setLockButton(true);
      }
    } else {
      setLockButton(true);
    }
  };

  const updateQtd = (qtd: string | null, id: number) => {
    const QTD = Number(qtd);
    if (!isNaN(QTD) && QTD > 0) {
      const updatedStore = store?.map((produto, index) => {
        if (id !== index) {
          return produto;
        } else {
          produto.QTD = Number(qtd);
          return produto;
        }
      });
      setStore(updatedStore);
    }
  };

  const addProductToStore = (product: ProductStore) => {
    const productExists = store.find((item) => item.CODPRO === product.CODPRO);
    if (!productExists) {
      setTimeout(() => {
        setSelectedProduto(undefined);
      }, 100);
      setStore([...store, product]);
      blurAllInputs();
    } else {
      if (
        confirm(
          `Produto "${product.DESCR}" ja incluido na lista, Deseja realmente acrescentar?`
        )
      ) {
        setStore([...store, product]);
        blurAllInputs();
      }
    }
  };

  const removeProductToStore = (product: ProductStore) => {
    const updatedStore = store.filter((item) => item.CODPRO !== product.CODPRO);
    setStore(updatedStore);
  };

  const sendToServer = async () => {
    if (user && selectedFirma && selectedVendedor && inputTotal) {
      console.log(inputDescontoReal, inputDescontoPorcentagem || 0.0);
      const { data } = await toastPromise({
        asyncFunction: ciAxios.post(
          `${import.meta.env.VITE_SERVER_NODE_URL}/orcamento`,
          {
            CODCLI: selectedFirma.CODCLI,
            CODVEN: selectedVendedor.CODVEN,
            TOTDOC: inputTotal.replace(",", "."),
            USUARIO: user,
            OBS: "teste",
            DESC: inputDescontoPorcentagem || 0.0,
            TOTDESC: inputDescontoReal,
            PRODUTOS: store.map((produto) => ({
              CODPRO: produto.CODPRO,
              QTDADE: produto.QTD,
              VRUNIT: produto.VRVENDA,
              VRTOT: produto.VRVENDA || 0 * produto.QTD,
            })),
          }
        ),
        pendingMessage: "Gerando",
      });

      toastSuccess({ message: `OR ${data.OR} gerado com sucesso!` });
    }
  };

  useEffect(() => {
    updateValues();
  }, [store]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <section className={style.OrcamentoContainer}>
      <ModalFirma
        firmas={firmas}
        inputVendedorRef={inputVendedorRef}
        setFirmas={setFirmas}
        setSelectedFirma={setSelectedFirma}
        visibility={visibilityModalFirma}
        setVisibility={setVisibilityModalFirma}
        setInputCliente={setInputCliente}
      />
      <ModalVendedor
        inputTextSearchRef={inputTextSearchRef}
        setInputVendedor={setInputVendedor}
        setSelectedVendedor={setSelectedVendedor}
        setTempVendedores={setTempVendedores}
        setVendedores={setVendedores}
        setVisibility={setVisibilityModalVendedor}
        tempVendedores={tempVendedores}
        vendedores={vendedores}
        visibility={visibilityModalVendedor}
      />
      <ModalMezanino
        selectedProduto={selectedProduto}
        visibility={visibilityModalMezanino}
        setVisibility={setVisibilityModalMezanino}
      />
      <div className={style.left}>
        <div className={style.clienteVendedor}>
          <form onSubmit={(event: FormEvent) => event.preventDefault()}>
            <div>
              <p>Cliente: {selectedFirma?.FIRMA}</p>
              <input
                type="number"
                placeholder="_______"
                value={inputCliente}
                onChange={onChangeInputCliente}
                ref={inputCodfirmaRef}
                onBlur={validateFirma}
                autoFocus
              />
              <button type="submit" onClick={validateFirma}>
                <FaMagnifyingGlass />
              </button>
              <button
                type={"button"}
                onClick={() => setVisibilityModalFirma(true)}
              >
                <FaAddressBook />
              </button>
            </div>
          </form>
          <form
            onSubmit={(event: FormEvent) => {
              event.preventDefault();
              validateVendedor();
            }}
          >
            <div>
              <p>Vendedor: {selectedVendedor?.NOME}</p>
              <input
                type="number"
                placeholder="_______"
                ref={inputVendedorRef}
                value={inputVendedor}
                onChange={onChangeInputVendedor}
                onBlur={validateVendedor}
              />
              <button
                onClick={() => {
                  getAllVendedores();
                  setVisibilityModalVendedor(true);
                }}
                type="button"
              >
                <FaAddressBook />
              </button>
            </div>
          </form>
        </div>
        <div
          className={`${style.carrinho} ${
            extendCarrinho ? style.carrinhoLarge : ""
          }`}
        >
          <h2>Carrinho</h2>
          <ul>
            {store.map((produto, index) => (
              <li key={produto.CODPRO + "" + index}>
                <span
                  className="dangerButton"
                  onClick={() => removeProductToStore(produto)}
                >
                  <FaTrashCan />
                </span>
                <div
                  onClick={() =>
                    updateQtd(prompt("Informe a nova quantidade"), index)
                  }
                >
                  <p>{produto.DESCR}</p>
                  <div>
                    <p>
                      R$
                      {produto.VRVENDA?.toFixed(2).toString().replace(".", ",")}
                    </p>
                    <p>{produto.QTD}x</p>
                    <p>
                      <b>
                        R$
                        {(produto.VRVENDA || 0 * produto.QTD)
                          .toFixed(2)
                          .toString()
                          .replace(".", ",")}
                      </b>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <form onSubmit={(event: FormEvent) => event.preventDefault()}>
            <footer>
              <div>
                <p>Sub Total</p>
                <p>R$ {subTotal}</p>
              </div>
              <div>
                <p>Desconto</p>
                <div>
                  <p>%</p>
                  <input
                    type="number"
                    value={inputDescontoPorcentagem}
                    onChange={onChangeInputDescontoPorcentagem}
                    disabled={store.length === 0}
                    placeholder="0,00"
                    onBlur={updateValues}
                  />
                  <p> R$ </p>
                  <input
                    type="number"
                    value={inputDescontoReal.replace("%", "")}
                    onChange={onChangeInputDescontoReal}
                    placeholder="0%"
                    disabled={store.length === 0}
                    onBlur={updateValues}
                  />
                </div>
              </div>
              <div>
                <p>Frete</p>
                <div>
                  <p>R$ </p>
                  <input
                    type="number"
                    value={inputFrete}
                    onChange={onChangeInputFrete}
                    onBlur={updateValues}
                    placeholder="0,00"
                    min={0}
                    disabled={store.length === 0}
                  />
                </div>
              </div>
              <div>
                <p>Total</p>
                <div>
                  <p>R$ </p>
                  <input
                    type="number"
                    value={inputTotal}
                    onChange={onChangeInputTotal}
                    disabled={store.length === 0}
                    onBlur={onInputTotalBlur}
                  />
                </div>
              </div>
              <div className={style.buttonsContainer}>
                <button
                  type="button"
                  onClick={() =>
                    setHideInformacoesExtras(!hideInformacoesExtras)
                  }
                >
                  <FaBars />
                </button>
                <button
                  type="button"
                  onClick={() => setExtendedCarrinho(!extendCarrinho)}
                >
                  {extendCarrinho ? <FaAngleUp /> : <FaAngleDown />}
                </button>
                <button
                  className="greenButton"
                  onClick={sendToServer}
                  disabled={lockButton}
                >
                  Finalizar
                </button>
              </div>
            </footer>
          </form>
        </div>
        {selectedFirma && !hideInformacoesExtras && (
          <div className={style.informacoesExtras}>
            <h3>Firma: {selectedFirma.FIRMA}</h3>
            <h3>CNPJ: {selectedFirma.CNPJ}</h3>
            <textarea value={selectedFirma.OBS || ""} disabled></textarea>
          </div>
        )}
      </div>
      <div className={style.center}>
        <form onSubmit={(event: FormEvent) => event.preventDefault()}>
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
        <div
          className={style.cardsContainer}
          style={{
            border: produtos?.length ? "2px solid #2596be" : "none",
          }}
        >
          {produtos &&
            produtos.map((produto, index) => {
              return (
                <div
                  className={`${style.rowDesktop} ${
                    selectedProduto?.CODPRO === produto.CODPRO
                      ? style.activeRow
                      : ""
                  }`}
                  key={produto.CODPRO + "-" + index}
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
                        {produto.VRVENDA?.toFixed(2)
                          .toString()
                          .replace(".", ",")}
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
                      <b>
                        Itaguá: {produto.SALDO || 0} | Perequê:{" "}
                        {produto.PEREQUE?.SALDO || 0}
                      </b>
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
        {produtoComplementares.length > 0 && (
          <footer>
            <h4>Produtos complementares</h4>
            {produtoComplementares.map((complementar, index) => (
              <div key={complementar.CODPRO + "-" + index}>
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
      {selectedProduto && (
        <div className={style.right}>
          <header>
            <button
              className={style.fichaAnaliticaButton}
              onClick={() => setHideFichaAnalitica(!hideFichaAnalitica)}
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
                  VR Venda: R${" "}
                  {selectedProduto.VRVENDA?.toFixed(2).replace(".", ",")}
                </p>
                <p>
                  VR Atacado: R${" "}
                  {selectedProduto.VRATAC?.toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>
          </header>
          <footer>
            {hideFichaAnalitica && produtoSemelhante?.DESCR ? (
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
                    produtoSemelhante.VRVENDA ||
                    0 < (selectedProduto.VRVENDA || 0)
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
                    </tbody>
                  </table>
                </div>
                <div>
                  <button onClick={() => setVisibilityModalMezanino(true)}>
                    Solicitar Mezanino
                  </button>
                  <button className="dangerButton">Falta</button>
                </div>
              </div>
            )}
          </footer>
        </div>
      )}
    </section>
  );
}
