import style from "./index.module.css";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ciAxios } from "@/utils/ciAxios";
import { toastPromise } from "@/utils/toast";

export function Home() {
  const navigate = useNavigate();
  const nome = localStorage.getItem("user")?.split("-")[0];

  useEffect(() => {
    if (!nome) {
      logout();
    }
  });

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const newList = async (url: string, tipolist: string) => {
    const nome = localStorage.getItem("user")?.split("-")[0];
    const codfir = localStorage.getItem("codfir");
    const { data } = await toastPromise({
      asyncFunction: ciAxios.post(
        `${import.meta.env.VITE_SERVER_NODE_URL}/movlist/gerar_lista`,
        {
          nome,
          tipolist,
          firma: codfir,
        }
      ),
      pendingMessage: "Criando nova lista",
    });

    navigate(`${url}?codlistc=${data.codlistc}`);
  };

  return (
    <section className={style.homeContainer}>
      <section className={style.linksContainer}>
        <Link to="/foto">
          <button>Inserir Foto</button>
        </Link>
        <Link to="/avaliacao">
          <button>Avaliação</button>
        </Link>
        <Link to="/consultaProdutos">
          <button>Consulta produtos</button>
        </Link>
        <Link to="/listasAbastecimentoHome">
          <button>Listas abastecimento</button>
        </Link>
        <a onClick={() => newList("/contagemEstoque", "3")}>
          <button>Contagem estoque</button>
        </a>
        <a onClick={() => newList("/cadastroEstoque", "2")}>
          <button>Cadastro estoque</button>
        </a>
        <Link to="/consultaEntregas">
          <button>Caminhao</button>
        </Link>
        <Link to="/nfe">
          <button>Nota fiscal</button>
        </Link>
        <Link to="/orcamento">
          <button>Orçamentos</button>
        </Link>
        <Link to="/relatorios">
          <button>Relatorios</button>
        </Link>
      </section>
    </section>
  );
}
