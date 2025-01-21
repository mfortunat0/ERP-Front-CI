import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaCheck, FaMagnifyingGlass, FaX } from "react-icons/fa6";
import { ciAxios } from "@/utils/ciAxios";
import { toastPromise } from "@/utils/toast";
import { Product } from "@/interfaces";
import { ModalPhotoLocal } from "@/components/modalPhotoLocal";
import { ModalInserFalta } from "@/components/modalInsertFalta";
import { blurAllInputs } from "@/utils/blurInputs";
import style from "./index.module.css";
import noPhoto from "@/assets/no-photo-available.jpg";

interface ListItem extends Product {
  situacao: string;
  QTDADE: number;
}

export function SepararLista() {
  const codfir = localStorage.getItem("codfir");
  const [modalPhotoVisibility, setModalPhotoVisibility] = useState(false);
  const [modalInsertFaltaVisibility, setModalInsertFaltaVisibility] =
    useState(false);
  const [selectedItem, setSelectedItem] = useState<Product>();
  const [itensList, setItensList] = useState<ListItem[]>([]);
  const [inputNumberList, setinputNumberList] = useState("");
  const [listFalta, setListFalta] = useState(0);
  const [selectedItemFalta, setSelectedItemFalta] = useState<Product>();
  const [listNumber, setListNumber] = useState("");

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const onSubmit = () => {
    getList(inputNumberList);
    setListNumber(inputNumberList);
    blurAllInputs();

    const backupList = JSON.parse(
      localStorage.getItem(`backupList-${inputNumberList}`) as string
    );

    setTimeout(() => {
      if (backupList) {
        setItensList(backupList);
      }
    }, 500);
  };

  const getList = async (codlistc: string) => {
    setItensList([]);
    const { data } = await toastPromise({
      asyncFunction: ciAxios.post<ListItem[]>(
        `${import.meta.env.VITE_SERVER_NODE_URL}/movlist/detalhes`,
        {
          firm: codfir,
          codlistc,
        }
      ),
      pendingMessage: "Buscando lista 🔎",
    });

    const newListItem: ListItem[] = data.map((item) => {
      return {
        ...item,
        situacao: "",
      };
    });
    setItensList(newListItem);
  };

  const updateStatus = (index: number, situacao: string) => {
    const updateItensList: ListItem[] = itensList.map((item, id) => {
      if (id === index) {
        if (situacao === "falta" && item.situacao !== "falta") {
          setModalInsertFaltaVisibility(true);
        }
        return {
          ...item,
          situacao,
        };
      }
      return item;
    });
    setItensList(updateItensList);
    localStorage.setItem(
      `backupList-${listNumber}`,
      JSON.stringify(updateItensList)
    );
  };

  const preventSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  const onChangeInputInputNumberList = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setinputNumberList(event.target.value);
  };

  return (
    <>
      <section className={style.separarListaContainer}>
        <h1>Separar Lista</h1>
        <ModalPhotoLocal
          codfir={codfir}
          selectedItem={selectedItem}
          setVisibility={setModalPhotoVisibility}
          visibility={modalPhotoVisibility}
        />
        <ModalInserFalta
          firma={codfir}
          listFalta={listFalta}
          selectedItemFalta={selectedItemFalta}
          setListFalta={setListFalta}
          visibility={modalInsertFaltaVisibility}
          setVisibility={setModalInsertFaltaVisibility}
        />
        <form onSubmit={preventSubmit}>
          <p>LISTA N</p>
          <input
            type="number"
            value={inputNumberList}
            onChange={onChangeInputInputNumberList}
          />
          <button onClick={onSubmit}>
            <FaMagnifyingGlass />
          </button>
        </form>
        {itensList.length > 0 && (
          <>
            <div className={style.tableMobile}>
              <table className={style.insideTable}>
                <thead>
                  <tr>
                    <th>CODPRO</th>
                    <th>EAN</th>
                    <th>Descricao</th>
                    <th>Local</th>
                    <th>CODUNI</th>
                    <th>QTD</th>
                    <th>SALDO</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {itensList.map((item, index) => (
                    <tr
                      key={uuidv4()}
                      className={`${
                        item.situacao === "certo" ? style.certo : ""
                      } ${item.situacao === "falta" ? style.errado : ""}`}
                    >
                      <td>{item.CODPRO}</td>
                      <td>{item.EAN}</td>
                      <td
                        onClick={() => {
                          setSelectedItem(item);
                          setModalPhotoVisibility(true);
                        }}
                      >
                        {item.DESCR}
                      </td>
                      <td>{item.LOCAL}</td>
                      <td>{item.CODUNI}</td>
                      <td>
                        <b>{item.QTDADE}</b>
                      </td>
                      <td>{item.SALDO}</td>
                      <td>
                        <button
                          className="greenButton"
                          onClick={() => updateStatus(index, "certo")}
                        >
                          <FaCheck />
                        </button>
                      </td>
                      <td>
                        <button
                          className="dangerButton"
                          onClick={() => {
                            updateStatus(index, "falta");
                            setSelectedItemFalta(item);
                          }}
                        >
                          <FaX />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={style.tableLarge}>
              <table className={style.insideTable}>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Descricao</th>
                    <th>Local</th>
                    <th>CODUNI</th>
                    <th>QTD</th>
                    <th>SALDO</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {itensList.map((item, index) => (
                    <tr
                      key={uuidv4()}
                      className={`${
                        item.situacao === "certo" ? style.certo : ""
                      } ${item.situacao === "falta" ? style.errado : ""}`}
                    >
                      <td
                        onClick={() => {
                          setSelectedItem(item);
                          setModalPhotoVisibility(true);
                        }}
                      >
                        <div>
                          <img
                            src={`http://192.168.100.100:9060/fotos/P${item.CODPRO.replace(
                              ".",
                              ""
                            )}.jpg?v=${Date.now()}`}
                            onError={(event) =>
                              ((event.target as HTMLImageElement).src = noPhoto)
                            }
                            alt="Prodtuto sem foto"
                          />
                          {item.CODPRO}
                        </div>
                      </td>
                      <td>{item.DESCR}</td>
                      <td>{item.LOCAL}</td>
                      <td>{item.CODUNI}</td>
                      <td>
                        <b>{item.QTDADE}</b>
                      </td>
                      <td>{item.SALDO}</td>
                      <td>
                        <button
                          className="greenButton"
                          onClick={() => updateStatus(index, "certo")}
                        >
                          <FaCheck />
                        </button>
                      </td>
                      <td>
                        <button
                          className="dangerButton"
                          onClick={() => {
                            updateStatus(index, "falta");
                            setSelectedItemFalta(item);
                          }}
                        >
                          <FaX />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </>
  );
}
