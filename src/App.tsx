import style from "./App.module.css";
import logoUrl from "./assets/logo.png";
import { Route, Routes } from "react-router-dom";
import { FaHouse, FaMaximize, FaRightToBracket } from "react-icons/fa6";
import { Home } from "./pages/Home";
import { Foto } from "./pages/Foto";
import { ToastContainer } from "react-toastify";
import { Avaliacao } from "./pages/Avaliacao";
import { ConsultaProdutos } from "./pages/ConsultaProdutos";
import { CadastroEstoque } from "./pages/CadastroEstoque";
import { Login } from "./pages/Login";
import { useNavigate } from "react-router-dom";
import { ListaAbastecimentoHome } from "./pages/ListasAbastecimentoHome";
import { NovaListaAbastecimento } from "./pages/NovaListaAbastecimento";
import { ConsultaListasAbastecimento } from "./pages/ConsultaListasAbastecimento";
import { useEffect } from "react";
import { SepararLista } from "./pages/SepararLista";
import { ImprimirEtiquetas } from "./pages/ImprimirEtiquetas";
import { ConsultaEntregas } from "./pages/ConsultaEntregas";
import { ContagemEstoque } from "./pages/ContagemEstoque";
import { Nfe } from "./pages/Nfe";
import { AutorizacaoCompra } from "./pages/AutorizacaoCompra";
import { Orcamento } from "./pages/Orcamento";
import { Relatorios } from "./pages/Relatorios/";
import { RelatorioImpressaoMezanino } from "./pages/Relatorios/impressaoMezanino";

export function App() {
  const navigate = useNavigate();
  const nome = localStorage.getItem("user")?.split("-")[0];

  const logout = () => {
    if (confirm("Deseja sair?")) {
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const goHome = () => {
    if (confirm("Deseja realmente voltar ao inicio")) {
      navigate("/home");
    }
  };

  const toogleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  useEffect(() => {
    const storageUser = localStorage.getItem("user");
    if (!storageUser) {
      localStorage.removeItem("user");
      navigate("/");
    }
  }, []);

  return (
    <main className={style.mainContainer}>
      <ToastContainer />
      <nav className={style.navContainer}>
        <a>
          <img loading="lazy" className={style.logo} src={logoUrl} alt="Logo" />
        </a>
        <div>
          <span onClick={logout}>{nome}</span>
          <button onClick={goHome}>
            <FaHouse />
          </button>
          <button onClick={toogleFullScreen}>
            <FaMaximize />
          </button>
          <button onClick={logout}>
            <FaRightToBracket />
          </button>
        </div>
      </nav>
      <div className={style.contentPage}>
        <Routes>
          <Route index path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/foto" element={<Foto />} />
          <Route path="/avaliacao" element={<Avaliacao />} />
          <Route path="/consultaProdutos" element={<ConsultaProdutos />} />
          <Route path="/autorizacaoCompra" element={<AutorizacaoCompra />} />
          <Route path="/cadastroEstoque" element={<CadastroEstoque />} />
          <Route path="/nfe" element={<Nfe />} />
          <Route path="/orcamento" element={<Orcamento />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route
            path="/relatoriosImpressaoMezanino"
            element={<RelatorioImpressaoMezanino />}
          />
          <Route path="/consultaEntregas" element={<ConsultaEntregas />} />

          {/*Listas Route  */}
          <Route
            path="/listasAbastecimentoHome"
            element={<ListaAbastecimentoHome />}
          />
          <Route
            path="/novalistaAbastecimento"
            element={<NovaListaAbastecimento />}
          />
          <Route
            path="/consultaListasAbastecimento"
            element={<ConsultaListasAbastecimento />}
          />
          <Route path="/separarLista" element={<SepararLista />} />
          <Route path="/imprimirEtiquetas" element={<ImprimirEtiquetas />} />
          <Route path="/contagemEstoque" element={<ContagemEstoque />} />
        </Routes>
      </div>
    </main>
  );
}
