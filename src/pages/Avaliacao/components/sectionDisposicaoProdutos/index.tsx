import { Modal } from "@/components/modal";
import style from "./index.module.css";
import { ChangeEvent, useState } from "react";
import { FaRegStar, FaStar, FaX } from "react-icons/fa6";

interface SectionDisposicaoProdutosProps {
  setImagesDisposicaoProdutosSrc: (state: string[]) => void;
  setVideosDisposicaoProdutosSrc: (state: string[]) => void;
  setObservacaoDisposicaoProdutos: (state: string) => void;
  setStarsDisposicaoProdutos: (state: number) => void;
  starsDisposicaoProdutos: number;
  observacaoDisposicaoProdutos: string;
  imagesDisposicaoProdutosSrc: string[];
  videosDisposicaoProdutosSrc: string[];
}

export function SectionDisposicaoProdutos({
  starsDisposicaoProdutos,
  imagesDisposicaoProdutosSrc,
  videosDisposicaoProdutosSrc,
  observacaoDisposicaoProdutos,
  setImagesDisposicaoProdutosSrc,
  setVideosDisposicaoProdutosSrc,
  setObservacaoDisposicaoProdutos,
  setStarsDisposicaoProdutos,
}: SectionDisposicaoProdutosProps) {
  const [modalPhotoVisibility, setModalPhotoVisibility] = useState(false);
  const [imageDisposicaoProdutosSrc, setImageDisposicaoProdutosSrc] =
    useState("");
  const [videoDisposicaoProdutosSrc, setVideoDisposicaoProdutosSrc] =
    useState("");

  const onInputImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVideoDisposicaoProdutosSrc("");
    const reader = new FileReader();

    if (event.target.files) {
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        setImageDisposicaoProdutosSrc(reader.result + "");
      };
    }
  };

  const onInputVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImageDisposicaoProdutosSrc("");
    const reader = new FileReader();
    if (event.target.files) {
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        setVideoDisposicaoProdutosSrc(reader.result + "");
      };
    }
  };

  const onInputObservacaoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setObservacaoDisposicaoProdutos(event.target.value);
  };

  return (
    <section>
      <Modal
        visibility={modalPhotoVisibility}
        setVisibility={setModalPhotoVisibility}
      >
        <div className={style.modalHeader}>
          <button onClick={() => setModalPhotoVisibility(false)}>
            <FaX />
          </button>
        </div>
        {imageDisposicaoProdutosSrc && (
          <img
            loading="lazy"
            src={imageDisposicaoProdutosSrc}
            alt="imagem capturada"
          />
        )}
        {videoDisposicaoProdutosSrc && (
          <video width={260} height={260} controls>
            <source src={videoDisposicaoProdutosSrc} />
          </video>
        )}
        <div className={style.buttonsContainer}>
          <label htmlFor="file-photo">Capturar foto</label>
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
          {imageDisposicaoProdutosSrc && (
            <button
              className="greenButton"
              onClick={() => {
                setModalPhotoVisibility(false);
                setImagesDisposicaoProdutosSrc([
                  ...imagesDisposicaoProdutosSrc,
                  imageDisposicaoProdutosSrc,
                ]);
                setImageDisposicaoProdutosSrc("");
              }}
            >
              Salvar
            </button>
          )}
          {videoDisposicaoProdutosSrc && (
            <button
              className="greenButton"
              onClick={() => {
                setModalPhotoVisibility(false);
                setVideosDisposicaoProdutosSrc([
                  ...videosDisposicaoProdutosSrc,
                  videoDisposicaoProdutosSrc,
                ]);
                setVideoDisposicaoProdutosSrc("");
              }}
            >
              Salvar
            </button>
          )}
        </div>
      </Modal>
      <div className={style.avaliacaoContent}>
        <h3>Disposição de produtos</h3>
        <p>
          Os produtos estão organizados de forma lógica e fácil de encontrar?
        </p>
        <div className={style.avaliacaoStars}>
          {starsDisposicaoProdutos > 0 ? (
            <i>
              <FaStar
                onClick={() => {
                  if (starsDisposicaoProdutos === 1) {
                    setStarsDisposicaoProdutos(0);
                  } else {
                    setStarsDisposicaoProdutos(1);
                  }
                }}
              />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsDisposicaoProdutos(1)} />
            </i>
          )}
          {starsDisposicaoProdutos > 1 ? (
            <i>
              <FaStar onClick={() => setStarsDisposicaoProdutos(2)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsDisposicaoProdutos(2)} />
            </i>
          )}
          {starsDisposicaoProdutos > 2 ? (
            <i>
              <FaStar onClick={() => setStarsDisposicaoProdutos(3)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsDisposicaoProdutos(3)} />
            </i>
          )}
          {starsDisposicaoProdutos > 3 ? (
            <i>
              <FaStar onClick={() => setStarsDisposicaoProdutos(4)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsDisposicaoProdutos(4)} />
            </i>
          )}
          {starsDisposicaoProdutos > 4 ? (
            <i>
              <FaStar onClick={() => setStarsDisposicaoProdutos(5)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsDisposicaoProdutos(5)} />
            </i>
          )}
        </div>
        <input
          type="text"
          onChange={onInputObservacaoChange}
          placeholder="Observação..."
          value={observacaoDisposicaoProdutos}
        />
        <div className={style.avaliacaoButtons}>
          <button onClick={() => setModalPhotoVisibility(true)}>
            Tirar foto
          </button>
        </div>
        <div className={style.containerImages}>
          {imagesDisposicaoProdutosSrc.length > 0 &&
            imagesDisposicaoProdutosSrc.map((image, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                }}
              >
                <button
                  className={style.closeButton}
                  onClick={() => {
                    setImagesDisposicaoProdutosSrc(
                      imagesDisposicaoProdutosSrc.filter(
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
          {videosDisposicaoProdutosSrc.length > 0 &&
            videosDisposicaoProdutosSrc.map((video, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                }}
              >
                <button
                  className={style.closeButton}
                  onClick={() => {
                    setVideosDisposicaoProdutosSrc(
                      videosDisposicaoProdutosSrc.filter(
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
