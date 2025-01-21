import style from "./index.module.css";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaPrint, FaRegPenToSquare, FaReply } from "react-icons/fa6";
import { formatDate } from "@/utils/formats";
import { useNavigate } from "react-router-dom";
import { ciAxios } from "@/utils/ciAxios";
import { toastPromise } from "@/utils/toast";
import { ListType } from "./interfaces";
import { ListItem } from "@/interfaces";
import { ModalPhotoLocal } from "@/components/modalPhotoLocal";

export function ConsultaListasAbastecimento() {
  const navigate = useNavigate();
  const codfir = localStorage.getItem("codfir");
  const tablePrintRef = useRef<HTMLTableElement>(null);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ListItem>();
  const [lists, setLists] = useState<ListType[]>([]);
  const [selectedList, setSelectedList] = useState<ListType>();
  const [itensListSelected, setItensListSelected] = useState<ListItem[]>([]);
  const [horario, setHorario] = useState("");

  const refresh = () => {
    setSelectedList(undefined);
    setLists([]);
    getLists();
  };

  const getLists = async () => {
    const date = new Date();
    const sevenDaysAgo = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);

    const { data } = await toastPromise({
      asyncFunction: ciAxios.get<ListType[]>(
        `${
          import.meta.env.VITE_SERVER_NODE_URL
        }/movlist/consulta?firma=${codfir}&data=${sevenDaysAgo}`
      ),
      pendingMessage: "Buscando listas 🔎",
      onError: "Tentando novamente",
    });
    setLists(data.reverse());
  };

  useEffect(() => {
    getLists();
  }, []);

  const onSelectedList = async (list: ListType) => {
    const { data } = await toastPromise({
      asyncFunction: ciAxios.post<ListItem[]>(
        `${import.meta.env.VITE_SERVER_NODE_URL}/movlist/detalhes`,
        {
          firm: codfir,
          codlistc: list.CODLISTC,
        }
      ),
      pendingMessage: "Processando",
      onError: {
        render(error) {
          return `Falha: ${error}`;
        },
      },
    });

    setSelectedList(list);
    const sortedList = data.sort((item, nextItem) => {
      const a = item.LOCAL ? Number(item.LOCAL.replace(/-/g, "")) : 0;
      const b = nextItem.LOCAL ? Number(nextItem.LOCAL.replace(/-/g, "")) : 0;
      return b - a;
    });
    setItensListSelected(sortedList);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const printTable = () => {
    setHorario(new Date().toLocaleTimeString());
    setTimeout(() => {
      if (tablePrintRef.current) {
        window.print();
      }
    }, 100);
  };

  return (
    <section className={style.listasAbastecimentoContainer}>
      <ModalPhotoLocal
        codfir={codfir}
        selectedItem={selectedItem}
        setVisibility={setModalVisibility}
        visibility={modalVisibility}
      />
      {itensListSelected && selectedList ? (
        <>
          <button className={style.floatingButtonPrint} onClick={printTable}>
            <FaPrint />
          </button>

          <button
            className={style.floatingButtonEdit}
            onClick={() => {
              if (selectedList.TIPOLIST === 1) {
                navigate(
                  `/novalistaAbastecimento?codlistc=${selectedList.CODLISTC}`
                );
              } else if (selectedList.TIPOLIST === 2) {
                navigate(`/cadastroEstoque?codlistc=${selectedList.CODLISTC}`);
              } else if (selectedList.TIPOLIST === 3) {
                navigate(`/contagemEstoque?codlistc=${selectedList.CODLISTC}`);
              }
            }}
          >
            <FaRegPenToSquare />
          </button>

          <button className={style.floatingButtonReturn} onClick={refresh}>
            <FaReply />
          </button>
          <div>
            <h2>Lista N: {selectedList.CODLISTC}</h2>
            <h2>Data: {formatDate(selectedList.DTEMIS)}</h2>
            <h2 className={style.horario}>Hora: {horario}</h2>
            <h2>Usuario {selectedList.NOME}</h2>
          </div>
          <table className={style.insideTable} ref={tablePrintRef}>
            <thead>
              <tr>
                <th>CODPRO</th>
                <th>EAN</th>
                <th>Descricao</th>
                <th>Local</th>
                <th>CODUNI</th>
                <th>QTD</th>
                <th>SALDO</th>
              </tr>
            </thead>
            <tbody>
              {itensListSelected.map((item) => (
                <tr
                  key={uuidv4()}
                  onClick={() => {
                    setSelectedItem(item);
                    setModalVisibility(true);
                  }}
                >
                  <td>{item.CODPRO}</td>
                  <td>{item.EAN}</td>
                  <td>{item.DESCR}</td>
                  <td>{item.LOCAL}</td>
                  <td>{item.CODUNI}</td>
                  <td>
                    <b>{item.QTDADE}</b>
                  </td>
                  <td>{item.SALDO}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <h1>Listas abastecimento</h1>
          {lists && (
            <table className={style.outsideTable}>
              <thead>
                <tr>
                  <th>Numero</th>
                  <th>Nome</th>
                  <th>Data</th>
                  <th>Itens</th>
                </tr>
              </thead>
              <tbody>
                {lists.map((list) => (
                  <tr onClick={() => onSelectedList(list)} key={uuidv4()}>
                    <td>{list.CODLISTC}</td>
                    <td>{list.NOME}</td>
                    <td>
                      {formatDate(
                        list.DTEMIS.substring(0, 10).replace(/-/g, "/")
                      )}
                    </td>
                    <td>{list.TOTAL_ITENS}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </section>
  );
}
