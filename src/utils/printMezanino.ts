import { UpdateOptions } from "react-toastify";
import { Product } from "../interfaces";
import { ciAxios } from "./ciAxios";
import { toastError, toastPromise } from "./toast";

interface PrintMezanino<T = any> {
  product: Product;
  user: string;
  QTD: number;
  VENDEDOR?: number;
  onSucess?: string | UpdateOptions<T>;
  onError?: string | UpdateOptions;
}

export const printMezanino = async ({
  VENDEDOR,
  QTD,
  product,
  user,
  onError,
  onSucess,
}: PrintMezanino) => {
  if (QTD > 0) {
    await toastPromise({
      asyncFunction: ciAxios.post(
        `${import.meta.env.VITE_SERVER_NODE_MEZANINO_URL}/print`,
        {
          ...product,
          QTD,
          VENDEDOR,
          USUARIO: user,
        }
      ),
      pendingMessage: "Enviando dados para o mezanino",
      onError,
      onSucess,
      // onError: "Erro ao tentar enviar dados",
      // onSucess: {
      //   render() {
      //     setInputMezaninoQtd("");
      //     setInputMezaninoVendedor("");
      //     setModalMezaninoOpen(false);
      //     return "Enviado com sucesso";
      //   },
      // },
    });
  } else {
    toastError({ message: "Quantidade invalida" });
  }
};
