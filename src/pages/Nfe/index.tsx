import style from "./index.module.css";
import noPhoto from "../../assets/no-photo-available.jpg";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { FaMagnifyingGlass, FaPlus, FaX } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { ciAxios } from "../../utils/ciAxios";
import { toastError, toastPromise } from "../../utils/toast";
import { NfeCabecalho, ProductNfe } from "./interfaces";
import { Modal } from "@/components/modal";

export function Nfe() {
  const [inputText, setInputText] = useState("");
  const [selectedOption, setSelectedOption] = useState("CHAVE");
  const [products, setProducts] = useState<ProductNfe[]>([]);
  const [nfes, setNfes] = useState<NfeCabecalho[]>([]);
  const [actualNfe, setActualNfe] = useState(0);
  const [modalPhotoVisibility, setModalPhotoVisibility] = useState(false);
  const [activeProduct, setActiveProduct] = useState<ProductNfe>();
  const [activeEan, setActiveEan] = useState("");
  const [qtds, setQtds] = useState<number[]>([]);
  const [buttonLock, setButtonLock] = useState(true);
  const eanInputRef = useRef<HTMLInputElement>(null);
  const nfeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const clearAllActivesRow = () => {
    const rows = document.querySelectorAll<HTMLTableRowElement>(".row");
    rows.forEach((row) => {
      row.style.backgroundColor = "var(--primary-white)";
      row.style.color = "#000";
    });
  };

  const onChangeInputText = (event: ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const onChangeSelectedOption = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    if (nfeInputRef.current) {
      nfeInputRef.current.focus();
    }
  };

  const onChangeactiveEan = (event: ChangeEvent<HTMLInputElement>) => {
    setActiveEan(event.target.value);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (selectedOption === "NUMERONFE") {
      const { data } = await toastPromise({
        asyncFunction: ciAxios.post<NfeCabecalho[]>(
          `${import.meta.env.VITE_SERVER_NODE_URL}/nfe/search`,
          {
            NUMERONFE: inputText,
          }
        ),
        pendingMessage: "Pesquisando NF-e 🔎",
      });

      setInputText("");
      setProducts([]);
      if (data.length === 1) {
        setActualNfe(data[0].NCONT);
        onSelectedNfe(data[0].CHAVE);
      } else {
        setNfes(data);
      }
    }
    if (selectedOption === "CHAVE") {
      const { data } = await toastPromise({
        asyncFunction: ciAxios.post<ProductNfe[]>(
          `${import.meta.env.VITE_SERVER_NODE_URL}/nfe/search`,
          {
            CHAVE: inputText,
          }
        ),
        pendingMessage: "Buscando produtos 🔎",
      });

      setInputText("");
      setProducts(data);
      setActualNfe(data[0].NCONT);
      setNfes([]);
      setQtds(new Array(data.length).fill(0));
    }
  };

  const onSelectedNfe = async (chave: string) => {
    const { data } = await toastPromise({
      asyncFunction: ciAxios.post<ProductNfe[]>(
        `${import.meta.env.VITE_SERVER_NODE_URL}/nfe/search`,
        {
          CHAVE: chave,
        }
      ),
      pendingMessage: "Buscando produtos 🔎",
    });

    setInputText("");
    setProducts(data);
    setActualNfe(data[0].NCONT);
    setNfes([]);
    setQtds(new Array(data.length).fill(0));
  };

  const setActiveRow = (CODPRO: string) => {
    const row = document.querySelector<HTMLTableRowElement>(
      `.C${CODPRO.replace(".", "")}`
    );
    if (row) {
      clearAllActivesRow();
      row.style.backgroundColor = "var(--primary-blue)";
      row.style.color = "var(--primary-white)";
    }
  };

  const onShowPhoto = (product: ProductNfe) => {
    setModalPhotoVisibility(true);
    setActiveProduct(product);
    setActiveRow(product.CODPRO);
  };

  const onSubmitEan = (event: FormEvent) => {
    event.preventDefault();

    const rows = document.querySelectorAll<HTMLTableRowElement>(".row");
    const tableWrapper = document.querySelector("." + style.tableWrapper);
    let check = false;

    rows.forEach((row) => {
      if (row.id === activeEan) {
        clearAllActivesRow();
        scrollTo(1000, 1000);
        row.style.backgroundColor = "var(--primary-blue)";
        row.style.color = "var(--primary-white)";
        setActiveEan("");
        if (tableWrapper) {
          tableWrapper.scrollTop = row.offsetTop - 20;
        }
        check = true;
      }
    });

    if (!check) {
      toastError({ message: `Produto ${activeEan} não consta na NF-e` });
      setActiveEan("");
    }
  };

  const updateButtonFinishStatus = () => {
    const producstQtd = products.map((product) => product.QTDADE);
    if (JSON.stringify(producstQtd) === JSON.stringify(qtds)) {
      setButtonLock(false);
    } else {
      setButtonLock(true);
    }
  };

  const appendQtdProduct = (id: number, CODPRO: string) => {
    const qtd = Number(prompt("Informe a quantidade"));
    const temp = qtds;
    temp[id] += qtd;

    const row = document.querySelector<HTMLTableRowElement>(
      `.C${CODPRO.replace(".", "")}`
    );

    if (row) {
      updateButtonFinishStatus();
      if (temp[id] !== products[id].QTDADE) {
        row.style.backgroundColor = "var(--primary-red)";
        row.style.color = "var(--primary-white)";
      } else if (temp[id] === products[id].QTDADE) {
        row.style.backgroundColor = "var(--primary-green)";
        row.style.color = "var(--primary-white)";
      } else {
        row.style.backgroundColor = "var(--primary-white)";
        row.style.color = "#000";
      }
    }

    setQtds([...temp]);
    if (eanInputRef.current) {
      eanInputRef.current.focus();
    }
  };

  const onFinish = async () => {
    await toastPromise({
      asyncFunction: ciAxios.post<ProductNfe[]>(
        `http://192.168.100.149:7000/print`,
        {
          NFE: actualNfe,
          QTD: products.length,
        }
      ),
      pendingMessage: "Enviando comprovante",
    });
  };

  return (
    <section className={style.NfeContainer}>
      <Modal
        visibility={modalPhotoVisibility}
        setVisibility={setModalPhotoVisibility}
      >
        <button
          className="dangerButton rightButton"
          onClick={() => {
            setModalPhotoVisibility(false);
            if (eanInputRef.current) {
              eanInputRef.current.focus();
            }
          }}
        >
          <FaX />
        </button>
        <img
          src={`http://192.168.100.100:9060/fotos/P${activeProduct?.CODPRO.replace(
            ".",
            ""
          )}.jpg?v=${Date.now()}`}
          onError={(event) =>
            ((event.target as HTMLImageElement).src = noPhoto)
          }
          alt="produto"
        />
        <h2 className={style.modalEan}>EAN: {activeProduct?.EAN}</h2>
      </Modal>
      {products.length === 0 && (
        <form onSubmit={onSubmit}>
          <input
            type="number"
            value={inputText}
            onChange={onChangeInputText}
            autoFocus
            ref={nfeInputRef}
            style={{
              width: selectedOption === "NUMERONFE" ? "8%" : "100%",
            }}
          />
          <select value={selectedOption} onChange={onChangeSelectedOption}>
            <option value="CHAVE">Chave NF-e</option>
            <option value="NUMERONFE">Numero NF-e</option>
          </select>
          <button>
            <FaMagnifyingGlass />
          </button>
        </form>
      )}
      {products.length > 0 && (
        <>
          <form onSubmit={onSubmitEan}>
            <input
              type="number"
              autoFocus
              className={style.barCodeInput}
              placeholder="Codigo EAN"
              onChange={onChangeactiveEan}
              value={activeEan}
              ref={eanInputRef}
            />
          </form>
          <div className={style.header}>
            <h1>NF-e {actualNfe}</h1>
            <div>
              <button
                className="greenButton"
                disabled={buttonLock}
                onClick={() => onFinish()}
                style={{
                  filter: buttonLock ? "brightness(0.8)" : "brightness(1)",
                }}
              >
                Finalizar <FaCheck />
              </button>
              <button className="dangerButton" onClick={() => setProducts([])}>
                Sair <FaX />
              </button>
            </div>
          </div>
          <div className={style.tableWrapper}>
            <table className={style.tableFixHead}>
              <thead>
                <tr>
                  <th>CODPRO</th>
                  <th>DESCRICAO</th>
                  <th>CODUNI</th>
                  <th>QTD</th>
                </tr>
              </thead>
              <tbody>
                {products &&
                  products.map((product, index) => (
                    <tr
                      key={product.CODPRO}
                      className={`row C${product.CODPRO.replace(".", "")}`}
                      id={product.EAN}
                      data-qtd={product.QTDADE}
                    >
                      <td>{product.CODPRO}</td>
                      <td onClick={() => onShowPhoto(product)}>
                        {product.DESCR}
                      </td>
                      <td>{product.CODUNI}</td>
                      <td>
                        <p>{qtds[index]}</p>
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            appendQtdProduct(index, product.CODPRO)
                          }
                        >
                          <FaPlus />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {nfes.length > 0 && (
        <table className={style.tableListNfes}>
          <thead>
            <tr>
              <th>N°</th>
              <th>FIRMA</th>
            </tr>
          </thead>
          <tbody>
            {nfes &&
              nfes.map((nfe, index) => (
                <tr
                  key={nfe.CHAVE + index}
                  onClick={() => onSelectedNfe(nfe.CHAVE)}
                >
                  <td>{nfe.NCONT}</td>
                  <td>{nfe.FIRMA}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
