import style from "./index.module.css";
import CamComponent from "./components/cam";
import { CardItem } from "@/components/cardItem";
import { FormSearch } from "./components/formSearch";
import { Product } from "@/interfaces";
import { useState } from "react";
import { FaRectangleXmark } from "react-icons/fa6";

export function Foto() {
  const [productSelected, setProductSelected] = useState<Product>();
  return (
    <section className={style.fotoContainer}>
      <h2>Inserir Foto</h2>
      {productSelected ? (
        <div className={style.cardsContainer}>
          <CardItem
            onSelectedProduct={setProductSelected}
            product={productSelected}
          />
          <CamComponent
            productSelected={productSelected}
            setProductSelected={setProductSelected}
          />
          <footer className={style.fotoFooterContainer}>
            <button
              onClick={() => setProductSelected(undefined)}
              className={style.buttonDanger}
            >
              Sair <FaRectangleXmark />
            </button>
          </footer>
        </div>
      ) : (
        <FormSearch setProductSelected={setProductSelected} />
      )}
    </section>
  );
}
