import style from "./index.module.css";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Firma } from "../../interfaces";
import { ChangeEvent, FormEvent, KeyboardEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ciAxios } from "../../utils/ciAxios";
import { toastError, toastPromise } from "../../utils/toast";

export function AutorizacaoCompra() {
  const user = localStorage.getItem("user")?.split("-")[0];
  const [firmas, setFirmas] = useState<Firma[]>([]);
  const [selectedFirma, setSelectedFirma] = useState<Firma>();
  const [inputTextSearch, setInputTextSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputAutorizadoRetirar, setInputAutorizadoRetirar] = useState("");
  const [inputAutorizadoPor, setInputAutorizadoPor] = useState("");
  const [textAreaObservation, setTextAreaObservation] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  //@ts-expect-error: Global Key
  window.onkeydown = (event: KeyboardEvent<Element>) => {
    if (window.innerWidth >= 1024) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
      }
      onKeyPress(event.key);
    }
  };

  const onChangeInputAutorizadoRetirar = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setInputAutorizadoRetirar(event.target.value);
  };

  const onChangeInputAutorizadoPor = (event: ChangeEvent<HTMLInputElement>) => {
    setInputAutorizadoPor(event.target.value);
  };

  const onChangeTextAreaObservation = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTextAreaObservation(event.target.value);
  };

  const onInputTextSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputTextSearch(event.target.value);
  };

  const onSubmitForm = async (event: FormEvent) => {
    if (!isLoading && inputTextSearch) {
      setIsLoading(true);
      const tableWrapper = document.querySelector("." + style.tableWrapper);
      try {
        event.preventDefault();

        const urlSearch = `${
          import.meta.env.VITE_SERVER_NODE_URL
        }/cliente?firma=${inputTextSearch}`;

        const { data: firmas } = await toastPromise({
          asyncFunction: ciAxios.get<Firma[]>(urlSearch),
          pendingMessage: "Buscando 🔎",
        });

        if (firmas.length !== 0) {
          setFirmas(firmas);
          setSelectedFirma(undefined);
          setInputAutorizadoPor("");
          setInputAutorizadoRetirar("");
          setTextAreaObservation("");
        } else {
          toastError({
            message: `Nenhum resultado encontrado para "${inputTextSearch}"`,
          });
        }
        setInputTextSearch("");
        if (tableWrapper) {
          tableWrapper.scrollTop = 0;
        }
      } catch (error) {
        if (error instanceof Error) {
          toastError({ message: error.message });
        }
      }
      setIsLoading(false);
    }
  };

  const onKeyPress = (key: string) => {
    if (firmas.length > 0) {
      if (key === "ArrowUp") {
        const index = firmas.findIndex(
          (findFirma) => findFirma.CODCLI === selectedFirma?.CODCLI
        );

        const previousPosition = index - 1;
        if (firmas[previousPosition].CODCLI) {
          const tableWrapper = document.querySelector("." + style.tableWrapper);
          const rowSelected = document.querySelector<HTMLTableRowElement>(
            "." + style.consultaFirmasActiveRow
          );
          if (tableWrapper) {
            if (rowSelected) {
              tableWrapper.scrollTop = rowSelected.offsetTop - 120;
            }
          }
          setSelectedFirma(undefined);
          setInputAutorizadoPor("");
          setInputAutorizadoRetirar("");
          setTextAreaObservation("");
          setSelectedFirma(firmas[previousPosition]);
        }
      }

      if (key === "ArrowDown") {
        const index = firmas.findIndex(
          (findFirma) => findFirma.CODCLI === selectedFirma?.CODCLI
        );

        const nextPosition = index + 1;
        if (firmas[nextPosition].CODCLI) {
          const tableWrapper = document.querySelector("." + style.tableWrapper);
          const rowSelected = document.querySelector<HTMLTableRowElement>(
            "." + style.consultaFirmasActiveRow
          );
          if (tableWrapper) {
            if (rowSelected) {
              tableWrapper.scrollTop = rowSelected.offsetTop - 120;
            }
          }
          setSelectedFirma(undefined);
          setInputAutorizadoPor("");
          setInputAutorizadoRetirar("");
          setTextAreaObservation("");
          setSelectedFirma(firmas[nextPosition]);
        }
      }
    }
  };

  const onSubmitPrint = async (event: FormEvent) => {
    event.preventDefault();
    if (inputAutorizadoPor && inputAutorizadoRetirar) {
      await toastPromise({
        asyncFunction: ciAxios.post(
          "http://192.168.100.124:7000/imprimir-autorizacaoCompra",
          {
            nome: selectedFirma?.FIRMA,
            usuario: user,
            codCliente: selectedFirma?.CODCLI,
            observacao: textAreaObservation.replace(/\n/g, " "),
            autorizadorPor: inputAutorizadoPor,
            autorizadoRetirar: inputAutorizadoRetirar,
          }
        ),
        pendingMessage: "Enviando impressão 🖨️",
        onError: {
          render(error) {
            return `Algo deu errado: ${error}`;
          },
        },
        onSucess: {
          render() {
            setInputAutorizadoPor("");
            setInputAutorizadoRetirar("");
            setTextAreaObservation("");
            return "Impresso com sucesso";
          },
        },
      });
    }
  };

  return (
    <>
      <section className={style.consultaFirmasContainer}>
        <h2>Autorização Compra</h2>
        <form>
          <input
            type="text"
            value={inputTextSearch}
            onChange={onInputTextSearchChange}
            placeholder="Pesquisar um firma..."
          />
          <button onClick={onSubmitForm}>
            <FaMagnifyingGlass />
          </button>
          <Link to="/consultaProdutos">
            <button>Consulta produtos</button>
          </Link>
        </form>
        {firmas.length > 0 && (
          <div className={style.tableWrapper}>
            <table className={style.tableFixHead}>
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Firma</th>
                  <th>Fantasia</th>
                  <th>CNPJ</th>
                </tr>
              </thead>
              <tbody>
                {firmas.map((firma) => (
                  <tr
                    key={firma.CODCLI}
                    onClick={() => {
                      setSelectedFirma(firma);
                      setInputAutorizadoPor("");
                      setInputAutorizadoRetirar("");
                      setTextAreaObservation("");
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                    className={
                      firma.CODCLI === selectedFirma?.CODCLI
                        ? style.consultaFirmasActiveRow
                        : ""
                    }
                  >
                    <td>{firma.CODCLI}</td>
                    <td>{firma.FIRMA}</td>
                    <td>{firma.FANTASIA}</td>
                    <td>{firma.CNPJ}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selectedFirma && (
          <footer>
            <form>
              <div>
                <p>Autorizado a retirar: </p>
                <input
                  type="text"
                  required
                  autoFocus
                  ref={inputRef}
                  value={inputAutorizadoRetirar}
                  onChange={onChangeInputAutorizadoRetirar}
                  placeholder="Autorizado a retirar"
                />
              </div>
              <div>
                <p>Autorizado por: </p>
                <input
                  type="text"
                  required
                  value={inputAutorizadoPor}
                  onChange={onChangeInputAutorizadoPor}
                  placeholder="Autorizado por"
                />
              </div>
              <textarea
                placeholder="Obs..."
                value={textAreaObservation}
                onChange={onChangeTextAreaObservation}
              />
              <button onClick={onSubmitPrint}>Imprimir</button>
            </form>
          </footer>
        )}
      </section>
    </>
  );
}
