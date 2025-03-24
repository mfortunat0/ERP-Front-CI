import { Modal } from "@/components/modal";
import style from "./index.module.css";
import { ChangeEvent, useState } from "react";
import { FaRegStar, FaStar, FaX } from "react-icons/fa6";

interface SectionEmbalagensProps {
  setObservacaoEmbalagens: (state: string) => void;
  setStarsEmbalagens: (state: number) => void;
  setImagesEmbalagensSrc: (state: string[]) => void;
  setVideosEmbalagensSrc: (state: string[]) => void;
  starsEmbalagens: number;
  observacaoEmbalagens: string;
  imagesEmbalagensSrc: string[];
  videosEmbalagensSrc: string[];
}

export function SectionEmbalagens({
  starsEmbalagens,
  imagesEmbalagensSrc,
  videosEmbalagensSrc,
  observacaoEmbalagens,
  setObservacaoEmbalagens,
  setStarsEmbalagens,
  setImagesEmbalagensSrc,
  setVideosEmbalagensSrc,
}: SectionEmbalagensProps) {
  const [modalPhotoVisibility, setModalPhotoVisibility] = useState(false);
  const [imageEmbalagensSrc, setImageEmbalagensSrc] = useState("");
  const [videoEmbalagensSrc, setVideoEmbalagensSrc] = useState("");

  const onInputImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVideoEmbalagensSrc("");
    const reader = new FileReader();
    if (event.target.files) {
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        setImageEmbalagensSrc(reader.result + "");
      };
    }
  };

  const onInputVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImageEmbalagensSrc("");
    const reader = new FileReader();
    if (event.target.files) {
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        setVideoEmbalagensSrc(reader.result + "");
      };
    }
  };

  const onInputObservacaoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setObservacaoEmbalagens(event.target.value);
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
          {imageEmbalagensSrc || videoEmbalagensSrc ? (
            <>
              <button
                className="greenButton"
                onClick={() => {
                  setModalPhotoVisibility(false);
                  if (imageEmbalagensSrc) {
                    setImagesEmbalagensSrc([
                      ...imagesEmbalagensSrc,
                      imageEmbalagensSrc,
                    ]);
                    setImageEmbalagensSrc("");
                  } else {
                    setVideosEmbalagensSrc([
                      ...videosEmbalagensSrc,
                      videoEmbalagensSrc,
                    ]);
                    setVideoEmbalagensSrc("");
                  }
                }}
              >
                Salvar
              </button>
              <button
                className="dangerButton"
                onClick={() => {
                  setModalPhotoVisibility(false);
                  setImageEmbalagensSrc("");
                  setVideoEmbalagensSrc("");
                }}
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <label htmlFor="file-photo-embalagem">Capturar foto</label>
              <input
                type="file"
                id="file-photo-embalagem"
                accept="image/*"
                capture="environment"
                onChange={onInputImageChange}
              />
              <label htmlFor="file-video-embalagem">Capturar video</label>
              <input
                type="file"
                id="file-video-embalagem"
                accept="video/*"
                capture="environment"
                onChange={onInputVideoChange}
              />
            </>
          )}
        </div>
        <div className={style.modalContent}>
          {imageEmbalagensSrc && (
            <img
              className={style.modalPhoto}
              loading="lazy"
              src={imageEmbalagensSrc}
              alt="imagem capturada"
            />
          )}
          {videoEmbalagensSrc && (
            <video
              className={style.modalVideo}
              width={260}
              height={260}
              controls
            >
              <source src={videoEmbalagensSrc} />
            </video>
          )}
        </div>
      </Modal>
      <div className={style.avaliacaoContent}>
        <h3>Embalagens</h3>
        <p>
          As embalagens e caixas dos produtos estão sem avarias ? Os produtos
          estão etiquetados? Os produtos possuem código de barra ?
        </p>
        <div className={style.avaliacaoStars}>
          {starsEmbalagens > 0 ? (
            <i>
              <FaStar
                onClick={() => {
                  if (starsEmbalagens === 1) {
                    setStarsEmbalagens(0);
                  } else {
                    setStarsEmbalagens(1);
                  }
                }}
              />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsEmbalagens(1)} />
            </i>
          )}
          {starsEmbalagens > 1 ? (
            <i>
              <FaStar onClick={() => setStarsEmbalagens(2)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsEmbalagens(2)} />
            </i>
          )}
          {starsEmbalagens > 2 ? (
            <i>
              <FaStar onClick={() => setStarsEmbalagens(3)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsEmbalagens(3)} />
            </i>
          )}
          {starsEmbalagens > 3 ? (
            <i>
              <FaStar onClick={() => setStarsEmbalagens(4)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsEmbalagens(4)} />
            </i>
          )}
          {starsEmbalagens > 4 ? (
            <i>
              <FaStar onClick={() => setStarsEmbalagens(5)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsEmbalagens(5)} />
            </i>
          )}
        </div>
        <input
          type="text"
          onChange={onInputObservacaoChange}
          value={observacaoEmbalagens}
          placeholder="Observação..."
        />
        <div className={style.avaliacaoButtons}>
          <button onClick={() => setModalPhotoVisibility(true)}>
            Tirar foto
          </button>
        </div>
        <div className={style.containerImages}>
          {imagesEmbalagensSrc.length > 0 &&
            imagesEmbalagensSrc.map((image, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                }}
              >
                <button
                  className={style.closeButton}
                  onClick={() => {
                    setImagesEmbalagensSrc(
                      imagesEmbalagensSrc.filter(
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
          {videosEmbalagensSrc.length > 0 &&
            videosEmbalagensSrc.map((video, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                }}
              >
                <button
                  className={style.closeButton}
                  onClick={() => {
                    setVideosEmbalagensSrc(
                      videosEmbalagensSrc.filter(
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
