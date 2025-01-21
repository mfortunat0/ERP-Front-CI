import { Product } from "@/interfaces";
import noPhoto from "../../assets/no-photo-available.jpg";
import style from "./index.module.css";

interface CardItemProps {
  product: Product;
  onSelectedProduct: (product: Product) => void;
}

export function CardItem({ product, onSelectedProduct }: CardItemProps) {
  const user = localStorage.getItem("user")?.split("-")[0];
  const { CODPRO, DESCR, FAMILIA, SALDO, CODUNI, VRATAC, VRCUSTO, LOCAL } =
    product;
  const VRVENDA = product.VRVENDA || 0;

  return (
    <div
      className={style.cardContainer}
      onClick={() => onSelectedProduct(product)}
    >
      <div className={style.cardImageProfile}>
        <img
          src={`http://192.168.100.100:9060/fotos/P${CODPRO.replace(
            ".",
            ""
          )}.jpg?v=${Date.now()}`}
          onError={(event) =>
            ((event.target as HTMLImageElement).src = noPhoto)
          }
          alt="Imagem item"
        />
      </div>
      <div className={style.cardContent}>
        <h3>{DESCR}</h3>
        <p>
          <b>{CODPRO}</b>
        </p>
        <p>
          <b>Preço:</b> R$ {VRVENDA.toFixed(2).toString().replace(".", ",")}
        </p>
        <p>
          <b>Atacado:</b> R$ {VRATAC?.toFixed(2).toString().replace(".", ",")}
        </p>
        <p>
          <b>Saldo:</b> {SALDO || 0}
          {CODUNI?.toLocaleLowerCase()}
        </p>
        {(user === "GIL" || user === "PAULO") && (
          <>
            <p>
              <b>Custo:</b> R${" "}
              {VRCUSTO?.toFixed(2).toString().replace(".", ",")}
            </p>
            <p>
              <b>Margem:</b>{" "}
              {((VRVENDA / (VRCUSTO || 0) - 1) * 100 || 0).toFixed(2)}%
            </p>
          </>
        )}
        <p>
          <b>Familia:</b> {FAMILIA}
        </p>
        <div>
          <span>Local {LOCAL || "Não registrado"}</span>
        </div>
      </div>
    </div>
  );
}
