import style from "./index.module.css";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { ModalVendedor } from "../modalVendedor";
import { ModalFirma } from "../modalFirma";
import { toastError, toastPromise, toastSuccess } from "@/utils/toast";
import { ciAxios } from "@/utils/ciAxios";
import {
  Firma,
  OrcamentoGenerateResponse,
  OrcamentoProductsCabecalhoResponse,
  ProductStore,
  Vendedor,
} from "@/interfaces";
import {
  FaAddressBook,
  FaAngleDown,
  FaAngleUp,
  FaBars,
  FaCaretLeft,
  FaCaretRight,
  FaTrashCan,
} from "react-icons/fa6";

interface Header {
  store: ProductStore[];
  inputVendedor: string;
  inputTextSearchRef: React.RefObject<HTMLInputElement>;
  storeListRef: React.RefObject<HTMLUListElement>;
  inputCliente: string;
  selectedFirma: Firma | undefined;
  selectedVendedor: Vendedor | undefined;
  setStore: (productStore: ProductStore[]) => void;
  setInputVendedor: (vendedor: string) => void;
  setInputCliente: (cliente: string) => void;
  setSelectedFirma: (firma: Firma | undefined) => void;
  setSelectedVendedor: (vendedor: Vendedor | undefined) => void;
  addProductToStore: (productStore: ProductStore) => void;
}

export function Header({
  inputTextSearchRef,
  setStore,
  store,
  inputVendedor,
  setInputVendedor,
  inputCliente,
  setSelectedFirma,
  setSelectedVendedor,
  setInputCliente,
  selectedFirma,
  selectedVendedor,
  storeListRef,
  addProductToStore,
}: Header) {
  const user = localStorage.getItem("user")?.split("-")[0];
  const [hideInformacoesExtras, setHideInformacoesExtras] = useState(true);
  const [extendCarrinho, setExtendedCarrinho] = useState(false);
  const inputCodfirmaRef = useRef<HTMLInputElement>(null);
  const inputVendedorRef = useRef<HTMLInputElement>(null);
  const [subTotal, setSubTotal] = useState("0.00");
  const [inputFrete, setInputFrete] = useState("");
  const [inputDescontoPorcentagem, setInputDescontoPorcentagem] = useState("");
  const [inputTotal, setInputTotal] = useState("0.00");
  const [inputDescontoReal, setInputDescontoReal] = useState("");
  const [lockButton, setLockButton] = useState(true);
  const [register, setRegister] = useState(0);
  const [savedOR, setSavedOr] = useState(false);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [tempVendedores, setTempVendedores] = useState<Vendedor[]>([]);
  const [visibilityModalVendedor, setVisibilityModalVendedor] = useState(false);
  const [firmas, setFirmas] = useState<Firma[]>([]);
  const [visibilityModalFirma, setVisibilityModalFirma] = useState(false);

  //@ts-expect-error: global key
  window.onkeydown = (event: KeyboardEvent<Element>) => {
    if (window.innerWidth >= 1024) {
      if (
        event.key === "F5" ||
        event.key === "F6" ||
        event.key === "F9" ||
        event.key === "F10"
      ) {
        event.preventDefault();
      }
      onKeyPress(event.key);
    }
  };

  const onKeyPress = async (key: string) => {
    if (key === "F5") {
      if (savedOR) {
        setSavedOr(false);
        await generateNewOrcamento();
      }
    }
    if (key === "F10") {
      if (!lockButton) {
        await sendToServer();
      }
    }
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

  const removeProductToStore = (product: ProductStore) => {
    const updatedStore = store.filter((item) => item.CODPRO !== product.CODPRO);
    setStore(updatedStore);
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

  const updateValues = () => {
    let subTotal = 0;

    store.forEach((produto) => {
      const totalProduto = (produto.VRVENDA || 0) * produto.QTD;
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

  const generateNewOrcamento = async () => {
    await getRegister();
    setStore([]);
    setInputVendedor("");
  };

  const getRegister = async () => {
    const url = `${import.meta.env.VITE_SERVER_NODE_URL}/orcamento/generate`;

    const { data } = await toastPromise({
      asyncFunction: ciAxios.post<OrcamentoGenerateResponse>(url),
      pendingMessage: "Buscando ultimo registro 🔎",
    });

    const register = data.register[0].NUMCONT;
    setRegister(register);
  };

  const populateHeader = async ({ or }: { or: number }) => {
    try {
      const url = `${
        import.meta.env.VITE_SERVER_NODE_URL
      }/orcamento/products/${or}`;

      const { data } = await toastPromise({
        asyncFunction: ciAxios.get<OrcamentoProductsCabecalhoResponse>(url),
        onError: "Falha buscar dados",
      });

      if (data.cabecalho) {
        if (data.cabecalho.TOTDESC) {
          setInputTotal(data.cabecalho.TOTDESC.toString());
        }
        if (data.cabecalho.PDESC) {
          setInputDescontoPorcentagem(data.cabecalho.PDESC.toString());
        }
        if (data.cabecalho.TOTDESC) {
          setInputDescontoReal(data.cabecalho.TOTDESC.toString());
        }
      }

      if (data.produtos) {
        data.produtos.forEach(({ CODPRO, QTDADE, DESCR }) => {
          addProductToStore({
            CODPRO,
            QTD: QTDADE,
            DESCR,
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const moveOr = async (action: "next" | "previous") => {
    setLockButton(true);
    setStore([]);
    if (action === "next") {
      const url = `${import.meta.env.VITE_SERVER_NODE_URL}/orcamento`;

      const { data } = await toastPromise({
        asyncFunction: ciAxios.get(url),
        onError: "Falha buscar dados",
      });
      if (Number(data.lastRegister) < register) {
        await populateHeader({
          or: register + 1,
        });
        setRegister(register + 1);
      }
    } else {
      if (register > 1) {
        await populateHeader({
          or: register - 1,
        });
        setRegister(register - 1);
      }
    }
  };

  useEffect(() => {
    getRegister();
  }, []);

  useEffect(() => {
    updateValues();
  }, [store]);

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
            REGISTER: register,
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
      setSavedOr(true);
    }
  };

  return (
    <div className={style.headerContainer}>
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

      <ModalFirma
        firmas={firmas}
        inputVendedorRef={inputVendedorRef}
        setFirmas={setFirmas}
        setSelectedFirma={setSelectedFirma}
        visibility={visibilityModalFirma}
        setVisibility={setVisibilityModalFirma}
        setInputCliente={setInputCliente}
      />
      <div className={style.headerButtons}>
        <button onClick={() => moveOr("previous")}>
          <FaCaretLeft />
        </button>
        <button onClick={() => generateNewOrcamento()}>Novo</button>
        <button>Alterar</button>
        <button>Pesquisar</button>
        <button onClick={() => moveOr("next")}>
          <FaCaretRight />
        </button>
      </div>
      <div className={style.clienteVendedor}>
        <form onSubmit={(event: FormEvent) => event.preventDefault()}>
          <div>
            <p>OR: {register}</p>
          </div>
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
              autoFocus
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
        <ul ref={storeListRef}>
          {store.map((produto, index) => (
            <li key={produto.CODPRO + "-carrinho-" + index}>
              <button
                className="dangerButton"
                onClick={() => removeProductToStore(produto)}
              >
                <FaTrashCan />
              </button>
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
                onClick={() => setHideInformacoesExtras(!hideInformacoesExtras)}
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
                type="button"
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
  );
}
