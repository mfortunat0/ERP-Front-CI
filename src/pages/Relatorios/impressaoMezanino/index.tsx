import { FaMagnifyingGlass } from "react-icons/fa6";
import style from "./index.module.css";
import { ciAxios } from "@/utils/ciAxios";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Vendedor } from "@/interfaces";

interface Response {
  daysOccurrences: [[string, string]];
}

export function RelatorioImpressaoMezanino() {
  const [initialDate, setInitialDate] = useState("");
  const [finalDate, setFinalDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [selectedVendedor, setSelectedVendedor] = useState("todos");
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [vendedoresImpressoes, setVendedoresImpressoes] =
    useState<[[string, number]]>();

  const start = async () => {
    const urlSearch = `${import.meta.env.VITE_SERVER_NODE_URL}/vendedor`;

    const { data: vendedores } = await toast.promise(
      ciAxios.get<Vendedor[]>(urlSearch),
      { pending: "Buscando..." },
      {
        theme: "dark",
        position: "top-center",
      }
    );

    setVendedores(vendedores);
  };

  useEffect(() => {
    start();
  }, []);

  const onChangeInitialDate = (event: ChangeEvent<HTMLInputElement>) => {
    setInitialDate(event.target.value);
  };

  const onChangeFinalDate = (event: ChangeEvent<HTMLInputElement>) => {
    setFinalDate(event.target.value);
  };

  const onChangeMonth = (event: ChangeEvent<HTMLInputElement>) => {
    setMonth(event.target.value);
  };

  const onChangeYear = (event: ChangeEvent<HTMLInputElement>) => {
    setYear(event.target.value);
  };

  const onChangeSelectedVendedor = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedVendedor(event.target.value);
  };

  const onSubmit = async () => {
    if (selectedVendedor !== "todos") {
      const {
        data: { daysOccurrences },
      } = await ciAxios.post<Response>(
        `${import.meta.env.VITE_SERVER_NODE_MEZANINO_URL}/report`,
        {
          USUARIO: selectedVendedor,
          ANO: Number(year),
          MES: Number(month),
          INICIO: Number(initialDate),
          FIM: Number(finalDate),
        }
      );

      setVendedoresImpressoes([[selectedVendedor, daysOccurrences.length]]);
    }
  };

  return (
    <section className={style.relatorioImpressaoMezanino}>
      <div>
        <label>
          Do dia:
          <input
            type="number"
            value={initialDate}
            onChange={onChangeInitialDate}
            placeholder="Dia inicial"
          />
        </label>
        <label>
          Ate o dia:
          <input
            type="number"
            value={finalDate}
            onChange={onChangeFinalDate}
            placeholder="Dia final"
          />
        </label>
        <label>
          Mes:
          <input
            type="number"
            placeholder="Mes"
            value={month}
            onChange={onChangeMonth}
          />
        </label>
        <label>
          Ano:
          <input
            type="number"
            placeholder="Ano"
            value={year}
            onChange={onChangeYear}
          />
        </label>
        <select value={selectedVendedor} onChange={onChangeSelectedVendedor}>
          <option value="todos">todos</option>
          {vendedores.map((vendedor) => (
            <option key={vendedor.CODVEN} value={vendedor.NOME}>
              {vendedor.NOME}
            </option>
          ))}
        </select>
        <button onClick={onSubmit}>
          Buscar
          <FaMagnifyingGlass />
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {vendedoresImpressoes?.map((vendedores) => (
            <tr key={vendedores[0]}>
              <td>{vendedores[0]}</td>
              <td>{vendedores[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
