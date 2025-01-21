import { Product } from "../interfaces";

export const formatProductToClipBoard = (product: Product) => {
  return `*${product.DESCR}*\n- R$${product.VRVENDA?.toFixed(2).replace(
    ".",
    ","
  )} À Prazo\n- R$${product.VRATAC?.toFixed(2).replace(".", ",")} À Vista`;
};
