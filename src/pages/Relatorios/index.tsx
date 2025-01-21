import { Link } from "react-router-dom";
import style from "./index.module.css";

export function Relatorios() {
  return (
    <section className={style.relatoriosContainer}>
      <Link to="/relatoriosImpressaoMezanino">
        <button>Impressão mezanino</button>
      </Link>
    </section>
  );
}
