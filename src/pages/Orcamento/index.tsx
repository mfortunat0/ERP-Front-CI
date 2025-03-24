import style from "./index.module.css";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "@/utils/formatDate";
import { ciAxios } from "@/utils/ciAxios";
import { toastPromise } from "@/utils/toast";
import { ModalMezanino } from "@/components/modalMezanino";
import { blurAllInputs } from "@/utils/blurInputs";
import { Header } from "./components/header";
import { Form } from "./components/form";
import { Details } from "./components/details";
import {
  BalanceProductResponse,
  Firma,
  Product,
  ProductComplementarResponse,
  ProductStore,
  Vendedor,
} from "@/interfaces";
import { ModalInserFalta } from "@/components/modalInsertFalta";

export function Orcamento() {
  const inputVendedorRef = useRef<HTMLInputElement>(null);
  const inputTextSearchRef = useRef<HTMLInputElement>(null);
  const storeListRef = useRef<HTMLUListElement>(null);
  const [listFalta, setListFalta] = useState(0);
  const [inputCliente, setInputCliente] = useState("");
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [selectedVendedor, setSelectedVendedor] = useState<Vendedor>();
  const [selectedFirma, setSelectedFirma] = useState<Firma>();
  const [selectedProduto, setSelectedProduto] = useState<Product>();
  const [produtoSemelhante, setProdutoSemelhante] = useState<Product>();
  const [inputVendedor, setInputVendedor] = useState("");
  const [store, setStore] = useState<ProductStore[]>([]);
  const [visibilityModalMezanino, setVisibilityModalMezanino] = useState(false);
  const [visibilityModalFalta, setVisibilityModalFalta] = useState(false);
  const [produtoComplementares, setProdutoComplementares] = useState<Product[]>(
    []
  );
  const [visibilityFichaAnalitica, setVisibilityFichaAnalitica] =
    useState(true);
  const [formVisualizationType, setFormVisualizationType] = useState<
    "card" | "line"
  >("line");

  useEffect(() => {
    start();
  }, []);

  const start = async () => {
    const urlSearch = `${import.meta.env.VITE_SERVER_NODE_URL}/cliente?firma=1`;

    const { data: firmas } = await toastPromise({
      asyncFunction: ciAxios.get<Firma[]>(urlSearch),
      pendingMessage: "Buscando 🔎",
    });

    setSelectedFirma(firmas[0]);
    setInputCliente(firmas[0].CODCLI.toString());
    if (inputVendedorRef.current) {
      inputVendedorRef.current.focus();
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

    produto.SALDO = 0;
    produto.SALDO_PRE = 0;
    produto.ULT_COMPRA = "--/--/----";
    produto.ULT_COMPRA_PRE = "--/--/----";
    produto.QTD_ULT_COMPRA = 0;
    produto.VENDA_ULT_COMPRA = 0;
    produto.PEREQUE = {
      SALDO: 0,
      SALDO_PRE: 0,
      ULT_COMPRA: "--/--/----",
      ULT_COMPRA_PRE: "--/--/----",
      VENDA_ULT_COMPRA: 0,
      QTD_ULT_COMPRA: 0,
    };

    if (balances.length > 0) {
      let ultCompraItagua = "";
      let ultCompraPereque = "";

      balances.forEach((firmaSaldo) => {
        if (firmaSaldo.CODFIR === 1) {
          produto.SALDO = firmaSaldo.SALDO || 0;
          produto.ULT_COMPRA =
            formatDate(firmaSaldo.ULT_COMPRA) || "--/--/----";
          ultCompraItagua = firmaSaldo.ULT_COMPRA?.substring(0, 10);
        } else if (firmaSaldo.CODFIR === 3) {
          produto.PEREQUE = {
            SALDO_PRE: 0,
            SALDO: firmaSaldo.SALDO,
            ULT_COMPRA: formatDate(firmaSaldo.ULT_COMPRA) || "--/--/----",
            ULT_COMPRA_PRE: "--/--/----",
          };

          ultCompraPereque = firmaSaldo.ULT_COMPRA?.substring(0, 10);
        } else if (firmaSaldo.CODFIR === 99) {
          produto.SALDO_PRE = firmaSaldo.SALDO || 0;
          produto.ULT_COMPRA_PRE =
            formatDate(firmaSaldo.ULT_COMPRA) || "--/--/----";
        } else if (firmaSaldo.CODFIR === 100) {
          if (produto.PEREQUE) {
            produto.PEREQUE.SALDO_PRE = firmaSaldo.SALDO || 0;
            produto.PEREQUE.ULT_COMPRA_PRE =
              formatDate(firmaSaldo.ULT_COMPRA) || "--/--/----";
          }
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
          setVisibilityFichaAnalitica(true);
        } else {
          setProdutoSemelhante(undefined);
          setVisibilityFichaAnalitica(false);
          setProdutoComplementares([]);
        }
      });
    setSelectedProduto(produto);
  };

  const addProductToStore = (product: ProductStore) => {
    const productExists = store.find((item) => item.CODPRO === product.CODPRO);
    if (!productExists) {
      setTimeout(() => {
        setSelectedProduto(undefined);
      }, 100);
      setStore([...store, product]);
      blurAllInputs();

      setTimeout(() => {
        if (storeListRef.current) {
          storeListRef.current.scrollTop = storeListRef.current.scrollHeight;
        }
      }, 500);
    } else {
      if (
        confirm(
          `Produto "${product.DESCR}" ja incluido na lista, Deseja realmente acrescentar?`
        )
      ) {
        setStore([...store, product]);
        blurAllInputs();
        setTimeout(() => {
          if (storeListRef.current) {
            storeListRef.current.scrollTop = storeListRef.current.scrollHeight;
          }
        }, 500);
      }
    }
  };

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
      <ModalMezanino
        selectedProduto={selectedProduto}
        visibility={visibilityModalMezanino}
        setVisibility={setVisibilityModalMezanino}
      />

      <ModalInserFalta
        listFalta={listFalta}
        setListFalta={setListFalta}
        selectedItemFalta={selectedProduto}
        setVisibility={setVisibilityModalFalta}
        visibility={visibilityModalFalta}
      />

      <Header
        inputCliente={inputCliente}
        inputTextSearchRef={inputTextSearchRef}
        inputVendedor={inputVendedor}
        selectedFirma={selectedFirma}
        selectedVendedor={selectedVendedor}
        setInputCliente={setInputCliente}
        setInputVendedor={setInputVendedor}
        setSelectedFirma={setSelectedFirma}
        setSelectedVendedor={setSelectedVendedor}
        setStore={setStore}
        store={store}
        storeListRef={storeListRef}
        addProductToStore={addProductToStore}
      />

      <Form
        addProductToStore={addProductToStore}
        inputTextSearchRef={inputTextSearchRef}
        onSelectedProduct={onSelectedProduct}
        produtoComplementares={produtoComplementares}
        produtos={produtos}
        selectedFirma={selectedFirma}
        selectedProduto={selectedProduto}
        selectedVendedor={selectedVendedor}
        setProdutoComplementares={setProdutoComplementares}
        setProdutos={setProdutos}
        setSelectedProduto={setSelectedProduto}
        formVisualizationType={formVisualizationType}
        setFormVisualizationType={setFormVisualizationType}
      />
      {selectedProduto && (
        <Details
          addProductToStore={addProductToStore}
          visibilityFichaAnalitica={visibilityFichaAnalitica}
          produtoSemelhante={produtoSemelhante}
          selectedProduto={selectedProduto}
          setVisibilityFichaAnalitica={setVisibilityFichaAnalitica}
          setVisibilityModalMezanino={setVisibilityModalMezanino}
          setVisibilityModalFalta={setVisibilityModalFalta}
        />
      )}
    </section>
  );
}
