import style from "./index.module.css";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { FaEraser, FaMagnifyingGlass, FaX } from "react-icons/fa6";
import { CardItem } from "@/components/cardItem";
import { BalanceProductResponse, Product } from "../../interfaces";
import { ciAxios } from "../../utils/ciAxios";
import { toastError, toastPromise } from "../../utils/toast";

interface Item {
  name: string;
  codpro: string;
  saldo: number;
  un: string;
  qtd: number;
  id: number;
  codlisti: number;
  cadastro: string;
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

export function ContagemEstoque() {
  const codfir = localStorage.getItem("codfir");
  const [products, setProducts] = useState<Product[]>();
  const [qtds, setQtds] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState(false);
  const [codlistc, setCodlistc] = useState(0);
  const [itensList, setItensList] = useState<Item[]>([]);

  const [inputNovoCadastroProduct, setInputNovoCadastroProduct] = useState("");
  const [inputNovoCadastroQtd, setInputNovoCadastroQtd] = useState("");
  const [inputNovoCadastroData, setInputNovoCadastroData] = useState("AREA");
  const inputSearchRef = useRef<HTMLInputElement>(null);

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
          pendingMessage: "Buscando itens da lista",
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
            cadastro: item.CADASTRO,
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

  const sendItemToServer = async ({
    item,
    list,
  }: {
    item: Item;
    list: Item[];
  }) => {
    const { codpro, un, qtd, saldo, cadastro } = item;
    const url = `${import.meta.env.VITE_SERVER_NODE_URL}/movlist/inserir`;

    try {
      const { data } = await toastPromise({
        asyncFunction: ciAxios.post(url, {
          codlistc,
          codpro,
          un,
          qtd: String(qtd),
          saldo,
          cadastro,
        }),
        pendingMessage: `Enviando`,
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

  const itemIsMissing = (codpro: string) => {
    const item = itensList.filter((item) => item.codpro === codpro);
    if (item.length === 2) {
      const itemArea = itensList.filter(
        (item) => item.codpro === codpro && item.cadastro === "AREA"
      )[0];
      const itemEstoque = itensList.filter(
        (item) => item.codpro === codpro && item.cadastro === "ESTOQUE"
      )[0];

      if (itemArea && itemEstoque) {
        if (itemArea.qtd === 0 && itemEstoque.qtd > 0) {
          alert("Item com estoque porem não possui na aréa");
        }
      }
    }
  };

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
    if (!isLoading && inputNovoCadastroProduct) {
      setIsLoading(true);
      try {
        const url = `${import.meta.env.VITE_SERVER_NODE_URL}/pesquisa_produtos`;

        setProducts([]);
        setSelectedProduct(undefined);

        const { data: dataProducts } = await toastPromise({
          asyncFunction: ciAxios.post<Product[]>(url, {
            codpro: inputNovoCadastroProduct,
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

          console.log(dataSaldos);

          if (dataSaldos.length === 0) {
            product.SALDO = 0;
          } else {
            product.SALDO = dataSaldos.find(
              (item) => item.CODFIR === Number(codfir)
            )?.SALDO;
          }

          setSelectedProduct(product);
          setInputNovoCadastroProduct("");
        } else {
          setQtds(new Array(dataProducts.length).fill(0));
          addSaldo(dataProducts);
          setInputNovoCadastroProduct("");
        }
      } catch (error) {
        setInputNovoCadastroProduct("");
        if (error instanceof Error) {
          toastError({ message: error.message });
        }
      }
      setIsLoading(false);
    }
  };

  const onSubmitInsert = async (event: FormEvent) => {
    event.preventDefault();

    if (inputNovoCadastroQtd) {
      const urlDelete = `${
        import.meta.env.VITE_SERVER_NODE_URL
      }/movlist/excluir`;

      const newItem = {
        cadastro: inputNovoCadastroData,
        id: itensList.length + 1,
        name: selectedProduct?.DESCR || "",
        codpro: selectedProduct?.CODPRO || "",
        saldo: selectedProduct?.SALDO || 0,
        un: selectedProduct?.CODUNI || "",
        qtd: Number(inputNovoCadastroQtd),
        codlisti: 0,
      };

      const itemRepeated = itensList.find(
        (item) =>
          item.codpro === newItem.codpro && item.cadastro === newItem.cadastro
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
            (item) =>
              !(
                item.codpro === itemRepeated.codpro &&
                item.cadastro === itemRepeated.cadastro
              )
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
              itemIsMissing(newItem.codpro);
            }
          } else {
            sendItemToServer({
              item: newItem,
              list: [newItem, ...updatedList],
            });
            itemIsMissing(newItem.codpro);
          }
        }
      } else {
        sendItemToServer({ item: newItem, list: [...itensList, newItem] });
        itemIsMissing(newItem.codpro);
      }

      setInputNovoCadastroData("AREA");
      setInputNovoCadastroQtd("");
      setSelectedProduct(undefined);
      setProducts(undefined);

      if (inputSearchRef.current) {
        inputSearchRef.current.focus();
      }
    } else {
      toastError({ message: "Quantidade não preenchida" });
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

  const onInputNovoCadastroChangeProduct = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setInputNovoCadastroProduct(event.target.value);
  };

  const onInputNovoCadastroChangeQtd = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setInputNovoCadastroQtd(event.target.value);
  };

  const onInputNovoCadastroChangeData = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setInputNovoCadastroData(event.target.value);
  };

  return (
    <section className={style.contagemEstoqueContainer}>
      <h2>Contagem Estoque</h2>
      <form
        className={style.contagemEstoqueformContainer}
        onSubmit={onSubmitSearch}
      >
        <input
          type="text"
          value={inputNovoCadastroProduct}
          onChange={onInputNovoCadastroChangeProduct}
          placeholder="Produto..."
          autoFocus
          ref={inputSearchRef}
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          aria-autocomplete="none"
        />
        <button type="button" onClick={() => setInputNovoCadastroProduct("")}>
          <FaEraser />
        </button>
        <button onClick={onSubmitSearch}>
          <FaMagnifyingGlass />
        </button>
      </form>

      <div className={style.contagemEstoqueCardsContainer}>
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

        {!!selectedProduct?.DESCR && (
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

      {!!selectedProduct?.DESCR && (
        <form
          className={style.contagemEstoqueInsertContainer}
          onSubmit={onSubmitInsert}
        >
          <select
            onChange={onInputNovoCadastroChangeData}
            value={inputNovoCadastroData}
          >
            <option value="AREA">Área</option>
            <option value="ESTOQUE">Estoque</option>
          </select>
          <input
            type="number"
            placeholder="Quantidade"
            value={inputNovoCadastroQtd}
            onChange={onInputNovoCadastroChangeQtd}
            autoFocus
          />
          <button>Inserir</button>
        </form>
      )}
      <footer>
        <div className={style.contagemEstoqueListTitle}>
          {itensList.length > 0 && <h1>Lista {codlistc}</h1>}
        </div>
        <div className={style.novoCadastroTableContainer}>
          <table>
            <tbody>
              {itensList.length > 0 &&
                itensList.map((item) => (
                  <tr key={item.codpro}>
                    <td>{item.name}</td>
                    <td>
                      {item.qtd} {item.un}
                    </td>
                    <td>{item.cadastro?.toUpperCase()}</td>
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
    </section>
  );
}
