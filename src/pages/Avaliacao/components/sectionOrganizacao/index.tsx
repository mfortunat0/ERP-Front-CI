import { Modal } from "@/components/modal";
import { ChangeEvent, useState } from "react";
import { FaRegStar, FaStar, FaX } from "react-icons/fa6";
import style from "./index.module.css";

interface SectionOrganizacaoProps {
  setImagesOrganizacaoSrc: (state: string[]) => void;
  setVideosOrganizacaoSrc: (state: string[]) => void;
  setObservacaoOrganizacao: (state: string) => void;
  setStarsOrganizacao: (state: number) => void;
  starsOrganizacao: number;
  observacaoOrganizacao: string;
  imagesOrganizacaoSrc: string[];
  videosOrganizacaoSrc: string[];
}

export function SectionOrganizacao({
  starsOrganizacao,
  imagesOrganizacaoSrc,
  videosOrganizacaoSrc,
  observacaoOrganizacao,
  setObservacaoOrganizacao,
  setStarsOrganizacao,
  setImagesOrganizacaoSrc,
  setVideosOrganizacaoSrc,
}: SectionOrganizacaoProps) {
  const [modalPhotoVisibility, setModalPhotoVisibility] = useState(false);
  const [imageOrganizacaoSrc, setImageOrganizacaoSrc] = useState("");
  const [videoOrganizacaoSrc, setVideoOrganizacaoSrc] = useState("");

  const onInputImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVideoOrganizacaoSrc("");
    const reader = new FileReader();
    if (event.target.files) {
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        setImageOrganizacaoSrc(reader.result + "");
      };
    }
  };

  const onInputVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImageOrganizacaoSrc("");
    const reader = new FileReader();
    if (event.target.files) {
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        setVideoOrganizacaoSrc(reader.result + "");
      };
    }
  };

  const onInputObservacaoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setObservacaoOrganizacao(event.target.value);
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
          {imageOrganizacaoSrc || videoOrganizacaoSrc ? (
            <>
              <button
                className="greenButton"
                onClick={() => {
                  setModalPhotoVisibility(false);
                  if (imageOrganizacaoSrc) {
                    setImagesOrganizacaoSrc([
                      ...imagesOrganizacaoSrc,
                      imageOrganizacaoSrc,
                    ]);
                    setImageOrganizacaoSrc("");
                  } else {
                    setVideosOrganizacaoSrc([
                      ...videosOrganizacaoSrc,
                      videoOrganizacaoSrc,
                    ]);
                    setVideoOrganizacaoSrc("");
                  }
                }}
              >
                Salvar
              </button>
              <button
                className="dangerButton"
                onClick={() => {
                  setModalPhotoVisibility(false);
                  setImageOrganizacaoSrc("");
                  setVideoOrganizacaoSrc("");
                }}
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <label htmlFor="file-photo-organizacao">Capturar foto</label>
              <input
                type="file"
                id="file-photo-organizacao"
                accept="image/*"
                capture="environment"
                onChange={onInputImageChange}
              />
              <label htmlFor="file-video-organizacao">Capturar video</label>
              <input
                type="file"
                id="file-video-organizacao"
                accept="video/*"
                capture="environment"
                onChange={onInputVideoChange}
              />
            </>
          )}
        </div>
        <div className={style.modalContent}>
          {imageOrganizacaoSrc && (
            <img
              className={style.modalPhoto}
              loading="lazy"
              src={imageOrganizacaoSrc}
              alt="imagem capturada"
            />
          )}
          {videoOrganizacaoSrc && (
            <video
              className={style.modalVideo}
              width={260}
              height={260}
              controls
            >
              <source src={videoOrganizacaoSrc} />
            </video>
          )}
        </div>
      </Modal>
      <div className={style.avaliacaoContent}>
        <h3>Organização</h3>
        <p>
          Existem caixas/ produtos no chão? Existem espaços vazios no corredor?
          Temos ganchos vazios ?
        </p>
        <div className={style.avaliacaoStars}>
          {starsOrganizacao > 0 ? (
            <i>
              <FaStar
                onClick={() => {
                  if (starsOrganizacao === 1) {
                    setStarsOrganizacao(0);
                  } else {
                    setStarsOrganizacao(1);
                  }
                }}
              />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsOrganizacao(1)} />
            </i>
          )}
          {starsOrganizacao > 1 ? (
            <i>
              <FaStar onClick={() => setStarsOrganizacao(2)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsOrganizacao(2)} />
            </i>
          )}
          {starsOrganizacao > 2 ? (
            <i>
              <FaStar onClick={() => setStarsOrganizacao(3)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsOrganizacao(3)} />
            </i>
          )}
          {starsOrganizacao > 3 ? (
            <i>
              <FaStar onClick={() => setStarsOrganizacao(4)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsOrganizacao(4)} />
            </i>
          )}
          {starsOrganizacao > 4 ? (
            <i>
              <FaStar onClick={() => setStarsOrganizacao(5)} />
            </i>
          ) : (
            <i>
              <FaRegStar onClick={() => setStarsOrganizacao(5)} />
            </i>
          )}
        </div>
        <input
          type="text"
          onChange={onInputObservacaoChange}
          placeholder="Observação..."
          value={observacaoOrganizacao}
        />
        <div className={style.avaliacaoButtons}>
          <button onClick={() => setModalPhotoVisibility(true)}>
            Tirar foto
          </button>
        </div>
        <div className={style.containerImages}>
          {imagesOrganizacaoSrc.length > 0 &&
            imagesOrganizacaoSrc.map((image, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                }}
              >
                <button
                  className={style.closeButton}
                  onClick={() => {
                    setImagesOrganizacaoSrc(
                      imagesOrganizacaoSrc.filter(
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
          {videosOrganizacaoSrc.length > 0 &&
            videosOrganizacaoSrc.map((video, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                }}
              >
                <button
                  className={style.closeButton}
                  onClick={() => {
                    setVideosOrganizacaoSrc(
                      videosOrganizacaoSrc.filter(
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
