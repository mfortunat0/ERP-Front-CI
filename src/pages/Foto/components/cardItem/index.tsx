import { Product, ProductList } from "@/interfaces";
import noPhoto from "../../../../assets/no-photo-available.jpg";

interface CardItemProps {
  product: Product | ProductList;
  setModalLocalImage?: (state: boolean) => void;
  setLocalProduct?: (localProduct: string) => void;
  setSelectedProduct?: (product: Product) => void;
}

export default function CardItem({
  product,
  setModalLocalImage,
  setLocalProduct,
  setSelectedProduct,
}: CardItemProps) {
  const { CODPRO, DESCR, LOCAL, EAN, VRVENDA } = product;

  return (
    <>
      <div
        className="cardContainer"
        onClick={async () => {
          if (setSelectedProduct) {
            setSelectedProduct({
              CODPRO,
              DESCR,
              EAN,
              VRVENDA,
              LOCAL,
            });
          }
        }}
      >
        <div className="cardImage">
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
        <div className="cardContent">
          <h3>{DESCR}</h3>
          <div>
            <p>Preço: R$ {VRVENDA?.toFixed(2).toString().replace(".", ",")}</p>
            <p>Codigo: {CODPRO}</p>
            <p>EAN: {EAN}</p>
          </div>
          {!!LOCAL && (
            <div>
              <button
                onClick={() => {
                  if (setModalLocalImage && setLocalProduct) {
                    setLocalProduct(LOCAL);
                    setModalLocalImage(true);
                  }
                }}
              >
                Local {LOCAL}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
