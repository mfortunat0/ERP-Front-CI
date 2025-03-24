import { Product } from "../interfaces";
import { ciAxios } from "./ciAxios";
import { toastPromise } from "./toast";

interface GerarLista {
  codlistc: number;
  ncont: number;
}

interface GenerateListFaltaParams {
  firma: string | null;
  setListFalta: (codlistc: number) => void;
}

const generateListFalta = async ({
  firma,
  setListFalta,
}: GenerateListFaltaParams): Promise<number> => {
  const nome = localStorage.getItem("user")?.split("-")[0];
  const { data } = await ciAxios.post<GerarLista>(
    `${import.meta.env.VITE_SERVER_NODE_URL}/movlist/gerar_lista`,
    {
      nome,
      tipolist: "4",
      firma,
    }
  );
  setListFalta(data.codlistc);
  return data.codlistc;
};

interface InsertIntoFaltaParams {
  product: Product;
  falta: string;
  saldoerr: string;
  listFalta: number;
  firma: string | null;
  setListFalta: (codlistc: number) => void;
}

export const insertIntoFalta = async ({
  falta,
  listFalta,
  product,
  saldoerr,
  setListFalta,
  firma,
}: InsertIntoFaltaParams) => {
  const url = `${import.meta.env.VITE_SERVER_NODE_URL}/movlist/inserir`;

  const codlistc = listFalta
    ? listFalta
    : await generateListFalta({
        firma,
        setListFalta,
      });

  await toastPromise({
    asyncFunction: ciAxios.post(url, {
      codlistc: codlistc,
      codpro: product.CODPRO,
      un: product.CODUNI,
      qtd: 1,
      saldo: product.SALDO,
      falta,
      saldoerr,
    }),
    pendingMessage: "Enviando dados",
    onSucess: `Produto ${product.CODPRO} enviado com sucesso`,
    onError: {
      render() {
        setTimeout(() => {
          insertIntoFalta({
            falta,
            firma,
            listFalta,
            product,
            saldoerr,
            setListFalta,
          });
        }, 20000);
        return "Falha na conexão";
      },
    },
  });
};
