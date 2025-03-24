import { Link, useNavigate } from "react-router-dom";
import style from "./index.module.css";
import { ciAxios } from "../../utils/ciAxios";
import { toastPromise } from "../../utils/toast";

export function ListaAbastecimentoHome() {
  const navigate = useNavigate();

  const newList = async () => {
    const nome = localStorage.getItem("user")?.split("-")[0];
    const codfir = localStorage.getItem("codfir");
    const { data } = await toastPromise({
      asyncFunction: ciAxios.post(
        `${import.meta.env.VITE_SERVER_NODE_URL}/movlist/gerar_lista`,
        {
          nome,
          tipolist: "1",
          firma: codfir,
        }
      ),
      pendingMessage: "Criando nova lista",
    });

    navigate(`/novalistaAbastecimento?codlistc=${data.codlistc}`);
  };

  return (
    <section className={style.listaAbastecimentoButtonsHome}>
      <h2>Menu Listas</h2>
      <button onClick={newList}>Nova lista abastecimento</button>
      <Link to="/consultaListasAbastecimento">
        <button>Listas abastecimento</button>
      </Link>
      <Link to="/separarLista">
        <button>Separar lista</button>
      </Link>
      <Link to="/imprimirEtiquetas">
        <button>imprimir etiquetas</button>
      </Link>
    </section>
  );
}
