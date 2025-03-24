import style from "./index.module.css";
import { CardItem } from "@/components/cardItem";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { BalanceProductResponse, Product } from "@/interfaces";
import { Link } from "react-router-dom";
import { ciAxios } from "@/utils/ciAxios";
import { toastError, toastPromise } from "@/utils/toast";
import {
  FaClipboardList,
  FaEraser,
  FaMagnifyingGlass,
  FaX,
} from "react-icons/fa6";
import { blurAllInputs } from "@/utils/blurInputs";

interface Item {
  name: string;
  codpro: string;
  saldo: number;
  un: string;
  qtd: number;
  id: number;
  codlisti: number;
}

interface ItemBackup {
  CODLISTI: number;
  CODPRO: string;
  CODUNI: string;
  DESCR: string;
  EAN: string;
  LOCAL: string;
  QTDADE: number;
  SALDO: number;
  CADASTRO: string;
}

export function NovaListaAbastecimento() {
  const codfir = localStorage.getItem("codfir");
  const [products, setProducts] = useState<Product[]>();
  const [qtds, setQtds] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [itensList, setItensList] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [codlistc, setCodlistc] = useState(0);

  const [inputListaCadastroProduct, setInputListaCadastroProduct] =
    useState("");
  const [inputListaCadastroData, setInputListaCadastroData] = useState("");
  const [inputListaCadastroTypeUn, setInputListaCadastroTypeUn] = useState("");
  const inputListaCadastroProductRef = useRef<HTMLInputElement>(null);

  const start = async () => {
    if (location.href.includes("codlistc")) {
      const codlistcBackup = Number(location.href.split("?")[1].split("=")[1]);
      if (codlistcBackup) {
        const { data } = await toastPromise({
          asyncFunction: ciAxios.post<ItemBackup[]>(
            `${import.meta.env.VITE_SERVER_NODE_URL}/movlist/detalhes`,
            {
              codlistc: codlistcBackup,
            }
          ),
          pendingMessage: "Buscando itens da lista 🔎",
        });

        const itensBackup = data.map((item, index) => {
          return {
            id: index,
            name: item.DESCR,
            codpro: item.CODPRO,
            saldo: item.SALDO,
            un: item.CODUNI,
            qtd: item.QTDADE,
            codlisti: item.CODLISTI,
          };
        });

        setItensList(itensBackup);
        setCodlistc(codlistcBackup);
      }
    } else {
      toastError({ message: `Lista ${codlistc} inexistente` });
    }
  };

  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    setInputListaCadastroTypeUn(selectedProduct?.CODUNI || "UN");
  }, [selectedProduct]);

  const addSaldo = async (dataProducts: Product[]) => {
    const promises: [Promise<unknown>] | unknown[] = [];
    for (let c = 0; c < dataProducts.length; c++) {
      promises.push(
        new Promise((resolve, reject) => {
          try {
            const codfir = localStorage.getItem("codfir");

            const ulrSaldo = `${
              import.meta.env.VITE_SERVER_NODE_URL
            }/pesquisa_produtos/${dataProducts[c].CODPRO}/saldos`;

            ciAxios
              .get<BalanceProductResponse[]>(ulrSaldo)
              .then(({ data: dataSaldos }) => {
                if (dataSaldos.length === 0) {
                  qtds[c] = 0;
                } else {
                  qtds[c] =
                    dataSaldos.find((item) => item.CODFIR === Number(codfir))
                      ?.SALDO || 0;
                }
                setQtds([...qtds]);
                resolve(null);
              });
          } catch (error) {
            toastError({
              message: `Falha ao buscar saldo do item ${dataProducts[c].DESCR}`,
            });
            reject(error);
          }
        })
      );
    }

    setProducts([...dataProducts]);
    await toastPromise({
      asyncFunction: Promise.all(promises),
      pendingMessage: "Buscando saldos 🔎",
    });
  };

  const onSubmitSearch = async (event: FormEvent) => {
    event.preventDefault();

    if (!isLoading && inputListaCadastroProduct) {
      setIsLoading(true);
      try {
        setProducts([]);
        setSelectedProduct(undefined);
        setInputListaCadastroData("");

        const url = `${import.meta.env.VITE_SERVER_NODE_URL}/pesquisa_produtos`;

        const { data: dataProducts } = await toastPromise({
          asyncFunction: ciAxios.post<Product[]>(url, {
            codpro: inputListaCadastroProduct,
            firm: codfir,
          }),
          pendingMessage: "Buscando 🔎",
        });

        if (dataProducts.length === 0) {
          throw new Error("Nenhum resultado encontrado");
        }

        if (dataProducts.length === 1) {
          const product = dataProducts[0];
          const codfir = localStorage.getItem("codfir");
          const ulrSaldo = `${
            import.meta.env.VITE_SERVER_NODE_URL
          }/pesquisa_produtos/${product.CODPRO}/saldos`;

          const { data: dataSaldos } = await ciAxios.get<
            BalanceProductResponse[]
          >(ulrSaldo);

          if (dataSaldos.length === 0) {
            product.SALDO = 0;
          } else {
            product.SALDO = dataSaldos.find(
              (item) => item.CODFIR === Number(codfir)
            )?.SALDO;
          }

          setSelectedProduct(product);
          setInputListaCadastroProduct("");
        } else {
          setQtds(new Array(dataProducts.length).fill(0));
          addSaldo(dataProducts);
          setInputListaCadastroProduct("");
        }
      } catch (error) {
        setInputListaCadastroProduct("");
        if (error instanceof Error) {
          toastError({ message: error.message });
        }
      }
      setIsLoading(false);
      blurAllInputs();
    }
  };

  const onSubmitInsert = async (event: FormEvent) => {
    event.preventDefault();
    const urlDelete = `${import.meta.env.VITE_SERVER_NODE_URL}/movlist/excluir`;

    if (Number(inputListaCadastroData) <= 0) {
      toastError({ message: "Quantidade não informada" });
    } else {
      const newItem = {
        id: itensList.length + 1,
        name: selectedProduct?.DESCR || "",
        codpro: selectedProduct?.CODPRO || "",
        saldo: selectedProduct?.SALDO || 0,
        un: inputListaCadastroTypeUn || "UN",
        qtd: Number(inputListaCadastroData),
        codlisti: 0,
      };

      const itemRepeated = itensList.find(
        (item) => item.codpro === newItem.codpro
      );

      if (itemRepeated) {
        if (confirm("Item ja inserido na lista deseja substituir?")) {
          await toastPromise({
            asyncFunction: ciAxios.post(urlDelete, {
              codlisti: itemRepeated.codlisti,
            }),
            pendingMessage: "Substituindo produto",
          });

          const updatedList = itensList.filter(
            (item) => item.codpro !== itemRepeated.codpro
          );

          if (newItem.qtd > 30) {
            if (
              confirm(
                `Quantidade ${newItem.qtd} muito alta deseja realmente inserir?`
              )
            ) {
              sendItemToServer({
                item: newItem,
                list: [newItem, ...updatedList],
              });
            }
          } else {
            sendItemToServer({
              item: newItem,
              list: [newItem, ...updatedList],
            });
          }
        }
      } else {
        if (newItem.qtd > 30) {
          if (
            confirm(
              `Quantidade ${newItem.qtd} muito alta deseja realmente inserir?`
            )
          ) {
            sendItemToServer({ item: newItem, list: [...itensList, newItem] });
          }
        } else {
          sendItemToServer({ item: newItem, list: [...itensList, newItem] });
        }
      }

      setInputListaCadastroData("");
      setSelectedProduct(undefined);
      setProducts(undefined);

      if (inputListaCadastroProductRef.current) {
        inputListaCadastroProductRef.current.focus();
      }
    }
  };

  const sendItemToServer = async ({
    item,
    list,
  }: {
    item: Item;
    list: Item[];
  }) => {
    const { codpro, un, qtd, saldo } = item;
    const url = `${import.meta.env.VITE_SERVER_NODE_URL}/movlist/inserir`;

    try {
      const { data } = await toastPromise({
        asyncFunction: ciAxios.post(url, {
          codlistc,
          codpro,
          un,
          qtd: String(qtd),
          saldo,
        }),
        pendingMessage: "Enviando",
        onSucess: `Produto ${codpro} enviado com sucesso`,
        onError: "Falha na conexão",
      });

      item.codlisti = data.codlisti;
      setItensList(list);
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        sendItemToServer({ item, list });
      }, 3000);
    }
  };

  const removeItemFromList = async (item: Item) => {
    if (confirm(`Deseja realmete remover o item ${item.name}?`)) {
      const urlDelete = `${
        import.meta.env.VITE_SERVER_NODE_URL
      }/movlist/excluir`;

      await toastPromise({
        asyncFunction: ciAxios.post(urlDelete, {
          codlisti: item.codlisti,
        }),
        pendingMessage: "Removendo produto",
        onError: "Falha ao remover produto",
      });

      const updatedList = itensList.filter(
        (actualItem) => actualItem.codpro !== item.codpro
      );
      setItensList(updatedList);
    }
  };

  const onInputListaCadastroChangeProduct = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setInputListaCadastroProduct(event.target.value);
  };

  const onInputListaCadastroChangeData = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setInputListaCadastroData(event.target.value);
  };

  const onInputListaCadastroChangeQTD = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setInputListaCadastroTypeUn(event.target.value.toUpperCase());
  };

  return (
    <section className={style.listaAbastecimentoContainer}>
      <h2>Lista</h2>
      {!!codlistc && (
        <>
          <Link to="/consultaListasAbastecimento">
            <button className={style.floatingButton}>
              <FaClipboardList />
            </button>
          </Link>
          <form
            className={style.listaAbastecimentoformContainer}
            onSubmit={onSubmitSearch}
          >
            <input
              type="text"
              value={inputListaCadastroProduct}
              onChange={onInputListaCadastroChangeProduct}
              placeholder="Produto..."
              autoFocus
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              aria-autocomplete="none"
              ref={inputListaCadastroProductRef}
            />
            <button
              type="button"
              onClick={() => setInputListaCadastroProduct("")}
            >
              <FaEraser />
            </button>
            <button onClick={onSubmitSearch}>
              <FaMagnifyingGlass />
            </button>
          </form>

          <div className={style.listaAbastecimentoCardsContainer}>
            {products &&
              !selectedProduct?.DESCR &&
              products.map((product, index) => {
                product.SALDO = qtds[index];
                return (
                  <CardItem
                    key={product.CODPRO}
                    product={product}
                    onSelectedProduct={setSelectedProduct}
                  />
                );
              })}

            {selectedProduct?.DESCR && (
              <>
                <CardItem
                  product={selectedProduct}
                  onSelectedProduct={setSelectedProduct}
                />
                <button
                  className="dangerButton"
                  onClick={() => setSelectedProduct(undefined)}
                >
                  Voltar
                </button>
              </>
            )}
          </div>

          {selectedProduct?.DESCR && (
            <form
              className={style.listaAbastecimentoInsertContainer}
              onSubmit={onSubmitInsert}
            >
              <input
                type="text"
                value={inputListaCadastroTypeUn}
                onChange={onInputListaCadastroChangeQTD}
              />
              <input
                type="text"
                placeholder="Quantidade"
                value={inputListaCadastroData}
                onChange={onInputListaCadastroChangeData}
                autoFocus
                autoCorrect="off"
                autoComplete="off"
                spellCheck="false"
                aria-autocomplete="none"
              />

              <button>Inserir</button>
            </form>
          )}
          <footer>
            <div className={style.cadastroProdutoListTitle}>
              {itensList.length > 0 && <h1>Lista {codlistc}</h1>}
            </div>
            <div className={style.novoCadastroTableContainer}>
              <table>
                <tbody>
                  {itensList &&
                    itensList.map((item) => (
                      <tr key={item.codpro}>
                        <td>{item.name}</td>
                        <td>{item.qtd + " " + item.un}</td>
                        <td>
                          <button onClick={() => removeItemFromList(item)}>
                            <FaX />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </footer>
        </>
      )}
    </section>
  );
}
