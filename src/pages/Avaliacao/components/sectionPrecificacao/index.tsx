import style from "./index.module.css";
import { InputMask } from "@react-input/mask";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaRegStar, FaStar, FaX } from "react-icons/fa6";
import { Product } from "@/interfaces";
import { ciAxios } from "@/utils/ciAxios";
import { toastError } from "@/utils/toast";
import { Modal } from "@/components/modal";

interface SectionPrecificacaoProps {
  setPrecificacaoProdutoOneCode: (state: string) => void;
  setPrecificacaoProdutoOneValorSistema: (state: string) => void;
  setPrecificacaoProdutoOneValorPrateleira: (state: string) => void;
  setPrecificacaoProdutoTwoCode: (state: string) => void;
  setPrecificacaoProdutoTwoValorSistema: (state: string) => void;
  setPrecificacaoProdutoTwoValorPrateleira: (state: string) => void;
  setObservacaoPrecificacao: (state: string) => void;
  setStarsPrecificacao: (state: number) => void;
  setImagesPrecificacaoSrc: (state: string[]) => void;
  setVideosPrecificacaoSrc: (state: string[]) => void;
  starsPrecificacao: number;
  observacaoPrecificacao: string;
  precificacaoProdutoOneCode: string;
  precificacaoProdutoOneValorSistema: string;
  precificacaoProdutoOneValorPrateleira: string;
  precificacaoProdutoTwoCode: string;
  precificacaoProdutoTwoValorSistema: string;
  precificacaoProdutoTwoValorPrateleira: string;
  imagesPrecificacaoSrc: string[];
  videosPrecificacaoSrc: string[];
}

export function SectionPrecificacao({
  setObservacaoPrecificacao,
  setPrecificacaoProdutoOneCode,
  setPrecificacaoProdutoOneValorPrateleira,
  setPrecificacaoProdutoOneValorSistema,
  setPrecificacaoProdutoTwoCode,
  setPrecificacaoProdutoTwoValorPrateleira,
  setPrecificacaoProdutoTwoValorSistema,
  setStarsPrecificacao,
  setImagesPrecificacaoSrc,
  setVideosPrecificacaoSrc,
  imagesPrecificacaoSrc,
  videosPrecificacaoSrc,
  starsPrecificacao,
  observacaoPrecificacao,
  precificacaoProdutoOneCode,
  precificacaoProdutoOneValorPrateleira,
  precificacaoProdutoOneValorSistema,
  precificacaoProdutoTwoCode,
  precificacaoProdutoTwoValorPrateleira,
  precificacaoProdutoTwoValorSistema,
}: SectionPrecificacaoProps) {
  const [modalPhotoVisibility, setModalPhotoVisibility] = useState(false);
  const inputDescricao1Ref = useRef<HTMLInputElement>(null);
  const inputValorSistema1Ref = useRef<HTMLInputElement>(null);
  const inputDescricao2Ref = useRef<HTMLInputElement>(null);
  const inputValorSistema2Ref = useRef<HTMLInputElement>(null);
  const [imagePrecificacaoSrc, setImagePrecificacaoSrc] = useState("");
  const [videoPrecificacaoSrc, setVideoPrecificacaoSrc] = useState("");

  const codfir = localStorage.getItem("codfir");

  useEffect(() => {
    if (inputDescricao1Ref.current && inputValorSistema1Ref.current) {
      inputDescricao1Ref.current.value = "";
      inputValorSistema1Ref.current.value = "";
    }
  }, [precificacaoProdutoOneCode]);

  useEffect(() => {
    if (inputDescricao2Ref.current && inputValorSistema2Ref.current) {
      inputValorSistema2Ref.current.value = "";
      inputDescricao2Ref.current.value = "";
    }
  }, [precificacaoProdutoTwoCode]);

  const onInputImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVideoPrecificacaoSrc("");
    const reader = new FileReader();
    if (event.target.files) {
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        setImagePrecificacaoSrc(reader.result + "");
      };
    }
  };

  const onInputVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImagePrecificacaoSrc("");
    const reader = new FileReader();
    if (event.target.files) {
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        setVideoPrecificacaoSrc(reader.result + "");
      };
    }
  };

  const onInputObservacaoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setObservacaoPrecificacao(event.target.value);
  };

  const onProductPrecificationOne = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const codpro = event.target.value.replace(/_/g, "");
    setPrecificacaoProdutoOneCode(codpro);

    if (codpro.length === 9) {
      const url = `${import.meta.env.VITE_SERVER_NODE_URL}/pesquisa_produtos`;
      const { data } = await ciAxios.post<Product[]>(url, {
        codpro,
        firm: codfir,
      });

      if (data.length > 0) {
        if (inputDescricao1Ref.current) {
          inputDescricao1Ref.current.value = data[0].DESCR;
        }
        if (inputValorSistema1Ref.current) {
          if (data[0].VRVENDA) {
            setPrecificacaoProdutoOneValorSistema(
              "R$ " + data[0].VRVENDA.toString().replace(".", ",")
            );
          }
        }
      } else {
        toastError({ message: `Produto ${codpro} não cadastrado` });
      }
    } else {
      if (inputDescricao1Ref.current) {
        inputDescricao1Ref.current.value = "";
      }
      if (inputValorSistema1Ref.current) {
        inputValorSistema1Ref.current.value = "";
        setPrecificacaoProdutoOneValorSistema("");
      }
    }
  };

  const onProductPrecificationTwo = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const codpro = event.target.value.replace(/_/g, "");

    setPrecificacaoProdutoTwoCode(codpro);

    if (codpro.length === 9) {
      const url = `${import.meta.env.VITE_SERVER_NODE_URL}/pesquisa_produtos`;
      const { data } = await ciAxios.post<Product[]>(url, {
        codpro,
        firm: codfir,
      });

      if (data.length > 0) {
        if (inputDescricao2Ref.current) {
          inputDescricao2Ref.current.value = data[0].DESCR;
        }
        if (inputValorSistema2Ref.current) {
          if (data[0].VRVENDA) {
            setPrecificacaoProdutoTwoValorSistema(
              "R$ " + data[0].VRVENDA.toString().replace(".", ",")
            );
          }
        }
      } else {
        toastError({ message: `Produto ${codpro} não cadastrado` });
      }
    } else {
      if (inputDescricao2Ref.current) {
        inputDescricao2Ref.current.value = "";
      }
      if (inputValorSistema2Ref.current) {
        inputValorSistema2Ref.current.value = "";
        setPrecificacaoProdutoTwoValorSistema("");
      }
    }
  };

  const onPrecificacaoProdutoOneValorPrateleira = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setPrecificacaoProdutoOneValorPrateleira(event.target.value);
  };

  const onPrecificacaoProdutoTwoValorPrateleira = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setPrecificacaoProdutoTwoValorPrateleira(event.target.value);
  };

  return (
    <section>
      <Modal
        setVisibility={setModalPhotoVisibility}
        visibility={modalPhotoVisibility}
        viewHeight={70}
      >
        <div className={style.modalHeader}>
          <button
            className="dangerButton rightButton"
            onClick={() => setModalPhotoVisibility(false)}
          >
            <FaX />
          </button>
        </div>
        <div className={style.buttonsContainer}>
          {imagePrecificacaoSrc || videoPrecificacaoSrc ? (
            <>
              <button
                className="greenButton"
                onClick={() => {
                  setModalPhotoVisibility(false);
                  if (imagePrecificacaoSrc) {
                    setImagesPrecificacaoSrc([
                      ...imagesPrecificacaoSrc,
                      imagePrecificacaoSrc,
                    ]);
                    setImagePrecificacaoSrc("");
                  } else {
                    setVideosPrecificacaoSrc([
                      ...videosPrecificacaoSrc,
                      videoPrecificacaoSrc,
                    ]);
                    setVideoPrecificacaoSrc("");
                  }
                }}
              >
                Salvar
              </button>
              <button
                className="dangerButton"
                onClick={() => {
                  setModalPhotoVisibility(false);
                  setImagePrecificacaoSrc("");
                  setVideoPrecificacaoSrc("");
                }}
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <label htmlFor="file-photo-precificacao">Capturar foto</label>
              <input
                type="file"
                id="file-photo-precificacao"
                accept="image/*"
                capture="environment"
                onChange={onInputImageChange}
              />
              <label htmlFor="file-video-precificacao">Capturar video</label>
              <input
                type="file"
                id="file-video-precificacao"
                accept="video/*"
                capture="environment"
                onChange={onInputVideoChange}
              />
            </>
          )}
        </div>
        <div className={style.modalContent}>
          {imagePrecificacaoSrc && (
            <img
              className={style.modalPhoto}
              loading="lazy"
              src={imagePrecificacaoSrc}
              alt="imagem capturada"
            />
          )}
          {videoPrecificacaoSrc && (
            <video
              className={style.modalVideo}
              width={260}
              height={260}
              controls
            >
              <source src={videoPrecificacaoSrc} />
            </video>
          )}
        </div>
      </Modal>
      <div className={style.avaliacaoContent}>
        <h3>Precificação</h3>
        <p>
          Os preços estão visíveis e atualizados? Eles correspondem aos
          registros no sistema de ponto de venda? (Amostrar dois produtos para
          confrontar se o preço está correto assim como a descrição do produto)
        </p>
        <div className={style.avaliacaoStars}>
          {starsPrecificacao > 0 ? (
            <i>
              <FaStar
                onClick={() => {
                  if (starsPrecificacao === 1) {
                    setStarsPrecificacao(0);
                  } else {
                    setStarsPrecificacao(1);
                  }
                }}
              />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsPrecificacao(1)} />
            </i>
          )}
          {starsPrecificacao > 1 ? (
            <i>
              <FaStar onClick={() => setStarsPrecificacao(2)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsPrecificacao(2)} />
            </i>
          )}
          {starsPrecificacao > 2 ? (
            <i>
              <FaStar onClick={() => setStarsPrecificacao(3)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsPrecificacao(3)} />
            </i>
          )}
          {starsPrecificacao > 3 ? (
            <i>
              <FaStar onClick={() => setStarsPrecificacao(4)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsPrecificacao(4)} />
            </i>
          )}
          {starsPrecificacao > 4 ? (
            <i>
              <FaStar onClick={() => setStarsPrecificacao(5)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsPrecificacao(5)} />
            </i>
          )}
        </div>
        <div className={style.precificacaoContainer}>
          <div>
            <InputMask
              mask={"____.____"}
              replacement={{ _: /\d/ }}
              className={style.precificacaoProdutoInput}
              type="tel"
              placeholder="Produto"
              onChange={onProductPrecificationOne}
              value={precificacaoProdutoOneCode}
            />
            <input
              type="text"
              ref={inputDescricao1Ref}
              placeholder="Descricao"
              disabled
            />
          </div>
          <div>
            <input
              type="text"
              ref={inputValorSistema1Ref}
              placeholder="Valor sistema"
              value={precificacaoProdutoOneValorSistema}
              disabled
            />
            <input
              type="tel"
              placeholder="Valor prateleira"
              onChange={onPrecificacaoProdutoOneValorPrateleira}
              value={precificacaoProdutoOneValorPrateleira}
            />
          </div>
          <div>
            <InputMask
              mask={"____.____"}
              replacement={{ _: /\d/ }}
              className={style.precificacaoProdutoInput}
              placeholder="Produto"
              type="tel"
              onChange={onProductPrecificationTwo}
              value={precificacaoProdutoTwoCode}
            />
            <input
              type="text"
              ref={inputDescricao2Ref}
              placeholder="Descricao"
              disabled
            />
          </div>
          <div>
            <input
              type="text"
              ref={inputValorSistema2Ref}
              placeholder="Valor sistema"
              disabled
              value={precificacaoProdutoTwoValorSistema}
            />
            <input
              type="tel"
              placeholder="Valor prateleira"
              onChange={onPrecificacaoProdutoTwoValorPrateleira}
              value={precificacaoProdutoTwoValorPrateleira}
            />
          </div>
        </div>
        <input
          type="text"
          onChange={onInputObservacaoChange}
          placeholder="Observação..."
          value={observacaoPrecificacao}
        />
        <div className={style.avaliacaoButtons}>
          <button onClick={() => setModalPhotoVisibility(true)}>
            Tirar foto
          </button>
        </div>
        <div className={style.containerImages}>
          {imagesPrecificacaoSrc.length > 0 &&
            imagesPrecificacaoSrc.map((image, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                }}
              >
                <button
                  className={style.closeButton}
                  onClick={() => {
                    setImagesPrecificacaoSrc(
                      imagesPrecificacaoSrc.filter(
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
          {videosPrecificacaoSrc.length > 0 &&
            videosPrecificacaoSrc.map((video, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                }}
              >
                <button
                  className={style.closeButton}
                  onClick={() => {
                    setVideosPrecificacaoSrc(
                      videosPrecificacaoSrc.filter(
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
    </section>
  );
}
