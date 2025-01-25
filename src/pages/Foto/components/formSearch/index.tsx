import { FaEraser, FaMagnifyingGlass } from "react-icons/fa6";
import { ChangeEvent, FormEvent, useState } from "react";
import { Product } from "@/interfaces";
import style from "./style.module.css";
import { CardItem } from "@/components/cardItem";
import { ciAxios } from "@/utils/ciAxios";
import { toastError, toastPromise } from "@/utils/toast";
import { blurAllInputs } from "@/utils/blurInputs";

interface FormSearchProps {
  setProductSelected: (product: Product) => void;
}

export function FormSearch({ setProductSelected }: FormSearchProps) {
  const codfir = localStorage.getItem("codfir");
  const [inputDescription, setInputDescription] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  const formatResponseServer = async () => {
    try {
      const urlSearch = `${
        import.meta.env.VITE_SERVER_NODE_URL
      }/pesquisa_produtos`;

      const { data: products } = await toastPromise({
        asyncFunction: ciAxios.post<Product[]>(urlSearch, {
          codpro: inputDescription,
          firm: codfir,
        }),
        pendingMessage: "Pesquisando produtos 🔎",
      });

      if (products.length === 0) {
        throw new Error("Nenhum resultado foi encontrado");
      }

      if (products.length === 1) {
        setProductSelected(products[0]);
      } else {
        setProducts(products);
      }
      blurAllInputs();
    } catch (error) {
      if (error instanceof Error) {
        toastError({ message: error.message });
      }
    }
  };

  const onSearch = async () => {
    if (inputDescription) {
      setInputDescription("");
      setProducts([]);
      formatResponseServer();
    }
  };

  const onInputDescriptionChange = (data: ChangeEvent<HTMLInputElement>) => {
    setInputDescription(data.target.value);
  };

  return (
    <>
      <form
        onSubmit={(event: FormEvent) => event.preventDefault()}
        className={style.formContainer}
      >
        <div className={style.inputContainer}>
          <input
            type="text"
            placeholder="Buscar...."
            value={inputDescription}
            onChange={onInputDescriptionChange}
            autoFocus
          />
          <button onClick={onSearch}>
            <FaMagnifyingGlass />
          </button>
          <button
            onClick={() => {
              setInputDescription("");
              setProducts([]);
            }}
          >
            <FaEraser />
          </button>
        </div>
      </form>
      <div className={style.cardsContainer}>
        {products.length > 0 &&
          products.map((product) => (
            <CardItem
              key={product.CODPRO}
              product={product}
              onSelectedProduct={setProductSelected}
            />
          ))}
      </div>
    </>
  );
}
