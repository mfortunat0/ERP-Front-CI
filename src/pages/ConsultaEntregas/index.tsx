import style from "./index.module.css";
import { FaMagnifyingGlass, FaX } from "react-icons/fa6";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { ciAxios } from "@/utils/ciAxios";
import { toastError, toastPromise } from "@/utils/toast";
import { Modal } from "@/components/modal";

interface Entrega {
  date: string;
  documento: string;
  hora: string;
  id: number;
  latitude: number;
  longitude: number;
  observacao: string;
  veiculo: string;
}

export function ConsultaEntregas() {
  const [selectVeiculo, setSelectVeiculo] = useState("HR");
  const [inputDate, setInputDate] = useState("");
  const [iframeParans, setIframeParans] = useState("");
  const [inputDocument, setInputDocument] = useState("");
  const [activeDocument, setActiveDocument] = useState("");
  const [activeFotoBase64, setActiveFotoBase64] = useState("");
  const [modalPhotoVisibility, setModalPhotoVisibility] = useState(false);
  const [fotos, setFotos] = useState<string[]>();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const onChangeSelectVeiculo = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectVeiculo(event.target.value);
  };

  const onChangeInputDocument = (event: ChangeEvent<HTMLInputElement>) => {
    setInputDocument(event.target.value);
  };

  const onChangeInputDate = (event: ChangeEvent<HTMLInputElement>) => {
    setInputDate(event.target.value);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIframeParans("");
    if (inputDate && selectVeiculo) {
      const { data } = await toastPromise({
        asyncFunction: ciAxios.get<Entrega[]>(
          `http://192.168.100.147:8537/controleEntrega/${inputDate}/${selectVeiculo}/mD7WA1Y8`
        ),
        pendingMessage: "Buscando entregas 🔎",
        onError: "Falha ao buscar entregas",
      });

      if (data.length === 0) {
        toastError({ message: "Nenhum resultado encontrado" });
      } else {
        const queryString = data
          .map(
            (entrega) =>
              `${entrega.latitude},${entrega.longitude},${entrega.documento}`
          )
          .join(";");
        setIframeParans(queryString);
      }
    }
  };

  const onSubmitDocument = async (event: FormEvent) => {
    event.preventDefault();

    await toastPromise({
      asyncFunction: ciAxios.get<string[]>(
        `http://192.168.100.147:8537/storage/${inputDocument}`
      ),
      pendingMessage: "Buscando fotos",
      onError: "Falha ao buscar fotos",
    });

    setActiveDocument(inputDocument);
    setFotos(fotos);
    setInputDocument("");
  };

  const onImageSelected = (base64: string) => {
    setModalPhotoVisibility(true);
    setActiveFotoBase64(base64);
  };

  return (
    <section className={style.consultaEntregasContainer}>
      <form onSubmit={onSubmit}>
        <select onChange={onChangeSelectVeiculo} value={selectVeiculo}>
          <option value="HR">HR</option>
          <option value="MERCEDES">MERCEDES</option>
          <option value="CARROCERIA710">CARROCERIA 710</option>
          <option value="CARROCERIA1419">CARROCERIA 1419</option>
          <option value="BASCULANTEVR">BASCULANTE VERMELHO</option>
          <option value="BASCULANTEBR">BASCULANTE BRANCO</option>
        </select>
        <input type="date" value={inputDate} onChange={onChangeInputDate} />
        <button>
          <FaMagnifyingGlass />
        </button>
      </form>
      <footer>
        {iframeParans && (
          <div>
            <iframe
              src={`${
                import.meta.env.VITE_SERVER_NODE_URL
              }/mapa.html?list=${iframeParans}`}
              scrolling="no"
              ref={iframeRef}
            ></iframe>
            <form onSubmit={onSubmitDocument}>
              <div>
                <input
                  type="text"
                  list="list-autocomplete-entregas"
                  placeholder="Pesquisar documento..."
                  value={inputDocument}
                  onChange={onChangeInputDocument}
                />
                <button>
                  <FaMagnifyingGlass />
                </button>
                <datalist id="list-autocomplete-entregas">
                  {iframeParans.split(";").map((item, index) => (
                    <option
                      key={item + "-" + index}
                      value={item.split(",")[2]}
                    ></option>
                  ))}
                </datalist>
              </div>
              <h3>{activeDocument}</h3>
              <div>
                {fotos &&
                  fotos.map((base64) => (
                    <img
                      src={`data:image/jpeg;base64, ${base64}`}
                      alt=""
                      onClick={() =>
                        onImageSelected(`data:image/jpeg;base64, ${base64}`)
                      }
                    />
                  ))}
                <Modal
                  visibility={modalPhotoVisibility}
                  setVisibility={setModalPhotoVisibility}
                >
                  <button
                    className="dangerButton rightButton"
                    onClick={() => setModalPhotoVisibility(false)}
                  >
                    <FaX />
                  </button>
                  <img loading="lazy" src={activeFotoBase64} alt="" />
                </Modal>
              </div>
            </form>
          </div>
        )}
      </footer>
    </section>
  );
}
