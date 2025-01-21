import style from "./index.module.css";
import { Modal } from "@/components/modal";
import { ChangeEvent, useState } from "react";
import { FaRegStar, FaStar, FaX } from "react-icons/fa6";

interface SectionLimpezaProps {
  setImagesLimpezaSrc: (state: string[]) => void;
  setVideosLimpezaSrc: (state: string[]) => void;
  setObservacaoLimpeza: (state: string) => void;
  setStarsLimpeza: (state: number) => void;
  starsLimpeza: number;
  observacaoLimpeza: string;
  imagesLimpezaSrc: string[];
  videosLimpezaSrc: string[];
}

export function SectionLimpeza({
  setImagesLimpezaSrc,
  setVideosLimpezaSrc,
  setObservacaoLimpeza,
  setStarsLimpeza,
  starsLimpeza,
  imagesLimpezaSrc,
  videosLimpezaSrc,
  observacaoLimpeza,
}: SectionLimpezaProps) {
  const [modalPhotoVisibility, setModalPhotoVisibility] = useState(false);
  const [imageLimpezaSrc, setImageLimpezaSrc] = useState("");
  const [videoLimpezaSrc, setVideoLimpezaSrc] = useState("");

  const onInputImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVideoLimpezaSrc("");
    const reader = new FileReader();
    if (event.target.files) {
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        setImageLimpezaSrc(reader.result + "");
      };
    }
  };

  const onInputVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImageLimpezaSrc("");
    const reader = new FileReader();
    if (event.target.files) {
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        setVideoLimpezaSrc(reader.result + "");
      };
    }
  };

  const onInputObservacaoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setObservacaoLimpeza(event.target.value);
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
        {imageLimpezaSrc && (
          <img loading="lazy" src={imageLimpezaSrc} alt="imagem capturada" />
        )}
        {videoLimpezaSrc && (
          <video width={260} height={260} controls>
            <source src={videoLimpezaSrc} />
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
          {imageLimpezaSrc && (
            <button
              className="greenButton"
              onClick={() => {
                setModalPhotoVisibility(false);
                setImagesLimpezaSrc([...imagesLimpezaSrc, imageLimpezaSrc]);
                setImageLimpezaSrc("");
              }}
            >
              Salvar
            </button>
          )}
          {videoLimpezaSrc && (
            <button
              className="greenButton"
              onClick={() => {
                setModalPhotoVisibility(false);
                setVideosLimpezaSrc([...videosLimpezaSrc, videoLimpezaSrc]);
                setVideoLimpezaSrc("");
              }}
            >
              Salvar
            </button>
          )}
        </div>
      </Modal>
      <div className={style.avaliacaoContent}>
        <h3>Limpeza</h3>
        <p>
          A área de venda (gôndolas/prateleiras) está limpa e bem conservada? Os
          produtos estão sem poeiras ?
        </p>
        <div className={style.avaliacaoStars}>
          {starsLimpeza > 0 ? (
            <i>
              <FaStar
                onClick={() => {
                  if (starsLimpeza === 1) {
                    setStarsLimpeza(0);
                  } else {
                    setStarsLimpeza(1);
                  }
                }}
              />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsLimpeza(1)} />
            </i>
          )}
          {starsLimpeza > 1 ? (
            <i>
              <FaStar onClick={() => setStarsLimpeza(2)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsLimpeza(2)} />
            </i>
          )}
          {starsLimpeza > 2 ? (
            <i>
              <FaStar onClick={() => setStarsLimpeza(3)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsLimpeza(3)} />
            </i>
          )}
          {starsLimpeza > 3 ? (
            <i>
              <FaStar onClick={() => setStarsLimpeza(4)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsLimpeza(4)} />
            </i>
          )}
          {starsLimpeza > 4 ? (
            <i>
              <FaStar onClick={() => setStarsLimpeza(5)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsLimpeza(5)} />
            </i>
          )}
        </div>
        <input
          type="text"
          onChange={onInputObservacaoChange}
          placeholder="Observação..."
          value={observacaoLimpeza}
        />
        <div className={style.avaliacaoButtons}>
          <button onClick={() => setModalPhotoVisibility(true)}>
            Tirar foto
          </button>
        </div>
        <div className={style.containerImages}>
          {imagesLimpezaSrc.length > 0 &&
            imagesLimpezaSrc.map((image, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                }}
              >
                <button
                  className={style.closeButton}
                  onClick={() => {
                    setImagesLimpezaSrc(
                      imagesLimpezaSrc.filter(
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
          {videosLimpezaSrc.length > 0 &&
            videosLimpezaSrc.map((video, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                }}
              >
                <button
                  className={style.closeButton}
                  onClick={() => {
                    setVideosLimpezaSrc(
                      videosLimpezaSrc.filter(
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
