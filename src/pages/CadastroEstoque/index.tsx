import style from "./index.module.css";
import { CardItem } from "@/components/cardItem";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { FaEraser, FaMagnifyingGlass, FaX } from "react-icons/fa6";
import { BalanceProductResponse, Product } from "@/interfaces";
import { ciAxios } from "@/utils/ciAxios";
import { toastError, toastPromise } from "@/utils/toast";
import { Item, ItemBackup } from "./interfaces";

export function CadastroEstoque() {
  const codfir = localStorage.getItem("codfir");
  const [products, setProducts] = useState<Product[]>();
  const [qtds, setQtds] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState(false);
  const [codlistc, setCodlistc] = useState(0);
  const [itensList, setItensList] = useState<Item[]>([]);
  const [inputNovoCadastroProduct, setInputNovoCadastroProduct] = useState("");
  const [inputNovoCadastroData, setInputNovoCadastroData] = useState("");
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

    const { data } = await toastPromise({
      asyncFunction: ciAxios.post(url, {
        codlistc,
        codpro,
        un,
        qtd: String(qtd),
        saldo,
        cadastro,
      }),
      pendingMessage: `Produto ${codpro} enviado com sucesso`,
    });

    item.codlisti = data.codlisti;
    setItensList(list);
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
    const urlDelete = `${import.meta.env.VITE_SERVER_NODE_URL}/movlist/excluir`;

    if (inputNovoCadastroData) {
      const newItem = {
        cadastro: inputNovoCadastroData,
        id: itensList.length + 1,
        name: selectedProduct?.DESCR || "",
        codpro: selectedProduct?.CODPRO || "",
        saldo: selectedProduct?.SALDO || 0,
        un: selectedProduct?.CODUNI || "",
        qtd: 1,
        codlisti: 0,
      };

      const itemRepeated = itensList.find(
        (item) => item.codpro === newItem.codpro
      );

      if (itemRepeated) {
        if (confirm("Item ja inserido na lista deseja substituir?")) {
          toastPromise({
            asyncFunction: ciAxios.post(urlDelete, {
              codlisti: itemRepeated.codlisti,
            }),
            pendingMessage: "Substituindo produto",
          });

          const updatedList = itensList.filter(
            (item) => item.codpro !== itemRepeated.codpro
          );
          sendItemToServer({ item: newItem, list: [newItem, ...updatedList] });
        }
      } else {
        if (selectedProduct?.LOCAL) {
          if (confirm("Item com local ja cadastrado deseja substituir?")) {
            sendItemToServer({ item: newItem, list: [...itensList, newItem] });
          }
        } else {
          sendItemToServer({ item: newItem, list: [...itensList, newItem] });
        }
      }

      setInputNovoCadastroData("");
      setSelectedProduct(undefined);
      setProducts(undefined);

      if (inputSearchRef.current) {
        inputSearchRef.current.focus();
      }
    } else {
      toastError({ message: "Local não informado" });
    }
  };

  const removeItemFromList = async (item: Item) => {
    if (confirm(`Deseja realmete remover o item ${item.name}?`)) {
      const urlDelete = `${
        import.meta.env.VITE_SERVER_NODE_URL
      }/movlist/excluir`;

      toastPromise({
        asyncFunction: ciAxios.post(urlDelete, {
          codlisti: item.codlisti,
        }),
        pendingMessage: "Removendo produto...",
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

  const onInputNovoCadastroChangeData = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setInputNovoCadastroData(event.target.value);
  };

  return (
    <section className={style.cadastroEstoqueContainer}>
      <h2>Cadastro Estoque</h2>
      <form
        className={style.cadastroEstoqueformContainer}
        onSubmit={onSubmitSearch}
      >
        <input
          type="text"
          value={inputNovoCadastroProduct}
          onChange={onInputNovoCadastroChangeProduct}
          placeholder="Produto..."
          autoFocus
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          aria-autocomplete="none"
          ref={inputSearchRef}
        />
        <button type="button" onClick={() => setInputNovoCadastroProduct("")}>
          <FaEraser />
        </button>
        <button onClick={onSubmitSearch}>
          <FaMagnifyingGlass />
        </button>
      </form>

      <div className={style.cadastroEstoqueCardsContainer}>
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
          className={style.cadastroEstoqueInsertContainer}
          onSubmit={onSubmitInsert}
        >
          <input
            type="text"
            placeholder="Cadastro"
            value={inputNovoCadastroData}
            onChange={onInputNovoCadastroChangeData}
            autoFocus
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
              {itensList.length > 0 &&
                itensList.map((item) => (
                  <tr key={item.codpro}>
                    <td>{item.name}</td>
                    <td>{item.cadastro}</td>
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