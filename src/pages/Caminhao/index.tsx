import { Link } from "react-router-dom";
import style from "./index.module.css";

export function Caminhao() {
  return (
    <section className={style.caminhaoContainer}>
      <Link to="/consultaEntregas">
        <button>Consulta Entregas</button>
      </Link>
    </section>
  );
}
