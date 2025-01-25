import style from "./index.module.css";
import { ChangeEvent, useState } from "react";
import { FaRegStar, FaStar, FaX } from "react-icons/fa6";
import { Product } from "@/interfaces";
import { ciAxios } from "@/utils/ciAxios";
import { toastError } from "@/utils/toast";
import { Modal } from "@/components/modal";
import { InputMask } from "@react-input/mask";

interface SectionValidadeProdutosProps {
  setValidadeProdutosOne: (state: string) => void;
  setValidadeProdutosOneDate: (state: string) => void;
  setValidadeProdutosTwo: (state: string) => void;
  setValidadeProdutosTwoDate: (state: string) => void;
  setObservacaoValidadeProdutos: (state: string) => void;
  setStarsValidade: (state: number) => void;
  setImagesValidadeProdutosSrc: (state: string[]) => void;
  setVideosValidadeProdutosSrc: (state: string[]) => void;
  imagesValidadeProdutosSrc: string[];
  videosValidadeProdutosSrc: string[];
  observacaoValidadeProdutos: string;
  validadeProdutosOne: string;
  validadeProdutosOneDate: string;
  validadeProdutosTwo: string;
  validadeProdutosTwoDate: string;
  starsValidade: number;
}

export function SectionValidadeProdutos({
  setObservacaoValidadeProdutos,
  setValidadeProdutosOne,
  setValidadeProdutosOneDate,
  setValidadeProdutosTwo,
  setValidadeProdutosTwoDate,
  setStarsValidade,
  setImagesValidadeProdutosSrc,
  setVideosValidadeProdutosSrc,
  imagesValidadeProdutosSrc,
  videosValidadeProdutosSrc,
  starsValidade,
  observacaoValidadeProdutos,
  validadeProdutosOne,
  validadeProdutosOneDate,
  validadeProdutosTwo,
  validadeProdutosTwoDate,
}: SectionValidadeProdutosProps) {
  const [modalPhotoVisibility, setModalPhotoVisibility] = useState(false);
  const [isActiveBody, setIsActiveBody] = useState(false);
  const [imageValidadeProdutosSrc, setImageValidadeProdutosSrc] = useState("");
  const [videoValidadeProdutosSrc, setVideoValidadeProdutosSrc] = useState("");
  const codfir = localStorage.getItem("codfir");

  const onInputImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVideoValidadeProdutosSrc("");
    const reader = new FileReader();
    if (event.target.files) {
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        setImageValidadeProdutosSrc(reader.result + "");
      };
    }
  };

  const onInputVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImageValidadeProdutosSrc("");
    const reader = new FileReader();
    if (event.target.files) {
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        setVideoValidadeProdutosSrc(reader.result + "");
      };
    }
  };

  const onInputObservacaoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setObservacaoValidadeProdutos(event.target.value);
  };

  const onValidadeProdutosOne = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setValidadeProdutosOne(event.target.value);

    const codpro = event.target.value.replace(/_/g, "");
    if (codpro.length === 9) {
      const url = `${import.meta.env.VITE_SERVER_NODE_URL}/pesquisa_produtos`;
      const { data } = await ciAxios.post<Product[]>(url, {
        codpro,
        firm: codfir,
      });

      if (data.length === 0) {
        setValidadeProdutosOne("");
        toastError({ message: `Produto ${codpro} não cadastrado` });
      }
    }
  };

  const onValidadeProdutosOneDate = (event: ChangeEvent<HTMLInputElement>) => {
    setValidadeProdutosOneDate(event.target.value);

    const newValue = event.target.value.replace(/_/g, "");

    if (newValue.length === 5) {
      const [mes, ano] = newValue.split("/");
      if (Number(mes) < 1 || Number(mes) > 12 || Number(ano) < 1) {
        setValidadeProdutosOneDate("");
        toastError({ message: "Mes/Ano esta incorreto" });
      }
    }
  };

  const onValidadeProdutosTwo = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setValidadeProdutosTwo(event.target.value);

    const codpro = event.target.value.replace(/_/g, "");
    if (codpro.length === 9) {
      const url = `${import.meta.env.VITE_SERVER_NODE_URL}/pesquisa_produtos`;
      const { data } = await ciAxios.post<Product[]>(url, {
        codpro,
        firm: codfir,
      });

      if (data.length === 0) {
        setValidadeProdutosTwo("");
        toastError({
          message: `Produto ${codpro} não cadastrado`,
        });
      }
    }
  };

  const onValidadeProdutosTwoDate = (event: ChangeEvent<HTMLInputElement>) => {
    setValidadeProdutosTwoDate(event.target.value);

    const newValue = event.target.value.replace(/_/g, "");

    if (newValue.length === 5) {
      const [mes, ano] = newValue.split("/");
      if (Number(mes) < 1 || Number(mes) > 12 || Number(ano) < 1) {
        setValidadeProdutosTwoDate("");
        toastError({ message: "Mes/Ano esta incorreto" });
      }
    }
  };

  return (
    <section>
      <Modal
        setVisibility={setModalPhotoVisibility}
        visibility={modalPhotoVisibility}
      >
        <div className={style.modalHeader}>
          <button onClick={() => setModalPhotoVisibility(false)}>
            <FaX />
          </button>
        </div>
        {imageValidadeProdutosSrc && (
          <img
            loading="lazy"
            src={imageValidadeProdutosSrc}
            alt="imagem capturada"
          />
        )}
        {videoValidadeProdutosSrc && (
          <video width={260} height={260} controls>
            <source src={videoValidadeProdutosSrc} />
          </video>
        )}
        <div className={style.buttonsContainer}>
          <label
            htmlFor="file-photo"
            onClick={() => setModalPhotoVisibility(true)}
          >
            Capturar foto
          </label>
          <input
            type="file"
            id="file-photo"
            accept="image/*"
            capture="environment"
            onChange={onInputImageChange}
          />
          <label htmlFor="file-video">Capturar video</label>
          <input
            type="file"
            id="file-video"
            accept="video/*"
            capture="environment"
            onChange={onInputVideoChange}
          />
          {imageValidadeProdutosSrc && (
            <button
              className="greenButton"
              onClick={() => {
                setModalPhotoVisibility(false);
                setImagesValidadeProdutosSrc([
                  ...imagesValidadeProdutosSrc,
                  imageValidadeProdutosSrc,
                ]);
                setImageValidadeProdutosSrc("");
              }}
            >
              Salvar
            </button>
          )}
          {videoValidadeProdutosSrc && (
            <button
              className="greenButton"
              onClick={() => {
                setModalPhotoVisibility(false);
                setVideosValidadeProdutosSrc([
                  ...videosValidadeProdutosSrc,
                  videoValidadeProdutosSrc,
                ]);
                setVideoValidadeProdutosSrc("");
              }}
            >
              Salvar
            </button>
          )}
        </div>
      </Modal>
      <div className={style.avaliacaoContent}>
        <div className={style.header}>
          <h3>Validade dos produtos</h3>
          <button onClick={() => setIsActiveBody(!isActiveBody)}>
            Avaliar
          </button>
        </div>
        <div
          className={`${style.body} ${isActiveBody ? style.activeBody : ""}`}
        >
          <p>
            Verificar a validade dos produtos (Amostrar dois produtos como
            exemplo)
          </p>
          <div className={style.avaliacaoStars}>
            {starsValidade > 0 ? (
              <i>
                <FaStar
                  onClick={() => {
                    if (starsValidade === 1) {
                      setStarsValidade(0);
                    } else {
                      setStarsValidade(1);
                    }
                  }}
                />
              </i>
            ) : (
              <i>
                <FaRegStar onClick={() => setStarsValidade(1)} />
              </i>
            )}
            {starsValidade > 1 ? (
              <i>
                <FaStar onClick={() => setStarsValidade(2)} />
              </i>
            ) : (
              <i>
                <FaRegStar onClick={() => setStarsValidade(2)} />
              </i>
            )}
            {starsValidade > 2 ? (
              <i>
                <FaStar onClick={() => setStarsValidade(3)} />
              </i>
            ) : (
              <i>
                <FaRegStar onClick={() => setStarsValidade(3)} />
              </i>
            )}
            {starsValidade > 3 ? (
              <i>
                <FaStar onClick={() => setStarsValidade(4)} />
              </i>
            ) : (
              <i>
                <FaRegStar onClick={() => setStarsValidade(4)} />
              </i>
            )}
            {starsValidade > 4 ? (
              <i>
                <FaStar onClick={() => setStarsValidade(5)} />
              </i>
            ) : (
              <i>
                <FaRegStar onClick={() => setStarsValidade(5)} />
              </i>
            )}
          </div>
          <div className={style.validadeContainer}>
            <div>
              <InputMask
                mask={"_._"}
                replacement={{ _: /\d/ }}
                className={style.validadeProdutoInput}
                type="tel"
                placeholder="Produto"
                onChange={onValidadeProdutosOne}
                value={validadeProdutosOne}
              />
              <InputMask
                mask={"__/__"}
                replacement={{ _: /\d/ }}
                type="tel"
                placeholder="Validade (mm/aa)"
                onChange={onValidadeProdutosOneDate}
                value={validadeProdutosOneDate}
              />
            </div>
            <div>
              <InputMask
                mask={"_._"}
                replacement={{ _: /\d/ }}
                className={style.validadeProdutoInput}
                type="tel"
                placeholder="Produto"
                onChange={onValidadeProdutosTwo}
                value={validadeProdutosTwo}
              />
              <InputMask
                mask={"__/__"}
                replacement={{ _: /\d/ }}
                type="tel"
                placeholder="Validade (mm/aa)"
                onChange={onValidadeProdutosTwoDate}
                value={validadeProdutosTwoDate}
              />
            </div>
            <input
              type="text"
              onChange={onInputObservacaoChange}
              placeholder="Observação..."
              value={observacaoValidadeProdutos}
            />
            <div className={style.avaliacaoButtons}>
              <button onClick={() => setModalPhotoVisibility(true)}>
                Tirar foto
              </button>
            </div>
            <div className={style.containerImages}>
              {imagesValidadeProdutosSrc.length > 0 &&
                imagesValidadeProdutosSrc.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                    }}
                  >
                    <button
                      className={style.closeButton}
                      onClick={() => {
                        setImagesValidadeProdutosSrc(
                          imagesValidadeProdutosSrc.filter(
                            (_, indexImg) => indexImg !== index
                          )
                        );
                      }}
                    >
                      <FaX />
                    </button>
                    <img loading="lazy" src={image} />
                  </div>
                ))}
              {videosValidadeProdutosSrc.length > 0 &&
                videosValidadeProdutosSrc.map((video, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                    }}
                  >
                    <button
                      className={style.closeButton}
                      onClick={() => {
                        setVideosValidadeProdutosSrc(
                          videosValidadeProdutosSrc.filter(
                            (_, indexVideo) => indexVideo !== index
                          )
                        );
                      }}
                    >
                      <FaX />
                    </button>
                    <video controls>
                      <source src={video} />
                    </video>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
