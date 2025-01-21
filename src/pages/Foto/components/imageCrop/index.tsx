import { useState, useRef } from "react";
import "react-image-crop/dist/ReactCrop.css";
import "react-toastify/dist/ReactToastify.css";
import style from "./index.module.css";
import noPhoto from "@/assets/no-photo-available.jpg";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";
import { Product } from "@/interfaces";
import { ciAxios } from "@/utils/ciAxios";
import { toastPromise, toastSuccess } from "@/utils/toast";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import {
  FaBan,
  FaCheck,
  FaCropSimple,
  FaRotateLeft,
  FaRotateRight,
} from "react-icons/fa6";
import { Modal } from "@/components/modal";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 100,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

interface ImageCropProps {
  imageUrl: string;
  productSelected: Product;
  setProductSelected: (product: Product | undefined) => void;
}

export default function ImageCrop({
  imageUrl,
  productSelected,
  setProductSelected,
}: ImageCropProps) {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [formDataState, setFormDataState] = useState<FormData>();
  const [submitInProgress, setSubmitInProgress] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [sendButtonText, setSendButtonText] = useState("Enviar");
  const [imageRotateDeg, setImageRotateDeg] = useState("0deg");

  const url = `${
    import.meta.env.VITE_SERVER_NODE_URL
  }/uploads/salvar-imagem-produto`;
  const scale = 1;
  const rotate = 0;
  const aspect = 1;
  const widthFinalImage = 500;
  const heightFinalImage = 500;

  const recortar = () => {
    if (crop) {
      setCrop(undefined);
      setSendButtonText("Enviar");
    } else {
      if (imgRef.current?.width && imgRef.current?.height) {
        setSendButtonText("Enviar recorte");
        const width = imgRef.current.width;
        const height = imgRef.current.height;
        setCrop(centerAspectCrop(width, height, aspect));
      }
    }
  };

  const minus90Degrees = () => {
    const actualDeg = Number(imageRotateDeg.replace("deg", ""));
    const newActualDeg = actualDeg - 90;
    if (newActualDeg > -360) {
      setImageRotateDeg(`${newActualDeg}deg`);
    } else {
      setImageRotateDeg("0deg");
    }
  };

  const more90Degrees = () => {
    const actualDeg = Number(imageRotateDeg.replace("deg", ""));
    const newActualDeg = actualDeg + 90;
    if (newActualDeg < 360) {
      setImageRotateDeg(`${newActualDeg}deg`);
    } else {
      setImageRotateDeg("0deg");
    }
  };

  async function onSendFileServer() {
    if (!submitInProgress) {
      setSubmitInProgress(true);
      const image = imgRef.current;
      const previewCanvas = previewCanvasRef.current;

      if (!image || !previewCanvas) {
        throw new Error("Crop canvas does not exist");
      }

      const offscreen = document.createElement("canvas");
      offscreen.width = widthFinalImage;
      offscreen.height = heightFinalImage;
      const ctx = offscreen.getContext("2d");

      if (ctx) {
        ctx.imageSmoothingEnabled = false;
      }

      if (!ctx) {
        alert("No 2d context");
        throw new Error("No 2d context");
      }

      if (sendButtonText === "Enviar") {
        canvasPreview(
          image,
          previewCanvasRef.current,
          {
            height: Number(image.height),
            width: Number(image.width),
            unit: "px",
            x: 0,
            y: 2,
          },
          scale,
          Number(imageRotateDeg.replace("deg", ""))
        );
      }

      ctx.drawImage(
        previewCanvas,
        0,
        0,
        previewCanvas.width,
        previewCanvas.height,
        0,
        0,
        offscreen.width,
        offscreen.height
      );

      offscreen.toBlob(async (result) => {
        if (result) {
          const nomeImagem =
            "P" + productSelected.CODPRO.replace(".", "") + ".jpg";

          const imagem = new File([result], nomeImagem, {
            type: "image/jpg",
          });

          const formData = new FormData();
          formData.append("nomeImagem", nomeImagem);
          formData.append("imagem", imagem);

          setFormDataState(formData);

          try {
            await ciAxios.get(
              `${
                import.meta.env.VITE_SERVER_NODE_URL
              }/uploads/verifica-imagem-existente/${productSelected.CODPRO}`
            );
            await toastPromise({
              asyncFunction: ciAxios.post(url, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }),
              pendingMessage: "Enviando nova foto",
            });

            toastSuccess({ message: "Imagem salva com sucesso" });

            setProductSelected(undefined);
          } catch (error) {
            setModalVisibility(true);
          }
        }
      });
      setSubmitInProgress(false);
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  const replacePhotoServer = async () => {
    await toastPromise({
      asyncFunction: ciAxios.post(url, formDataState, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      pendingMessage: "Substituindo foto",
    });

    toastSuccess({ message: "Imagem salva com sucesso" });
    setProductSelected(undefined);
  };

  return (
    <>
      <Modal setVisibility={setModalVisibility} visibility={modalVisibility}>
        <span>Imagem ja cadastrada no sistema</span>
        <img
          src={`http://192.168.100.100:9060/fotos/P${productSelected.CODPRO.replace(
            ".",
            ""
          )}.jpg`}
          onError={(event) =>
            ((event.target as HTMLImageElement).src = noPhoto)
          }
          alt="imagem ja cadastrada"
        />
        <span>Deseja realmente alterar?</span>
        <div className={style.modalButtonsContainer}>
          <button onClick={replacePhotoServer}>
            <FaCheck />
          </button>
          <button className="dangerButton">
            <FaBan onClick={() => setModalVisibility(false)} />
          </button>
        </div>
      </Modal>

      <div className={style.imageCropContainer}>
        <div className={style.buttonsContainer}>
          <button onClick={minus90Degrees}>
            <FaRotateLeft />
          </button>
          <button onClick={more90Degrees}>
            <FaRotateRight />
          </button>
        </div>
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => {
            setCrop(percentCrop), setSendButtonText("Enviar recorte");
          }}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
          minHeight={100}
          keepSelection
        >
          <img
            className={style.imageCrop}
            width={widthFinalImage}
            height={heightFinalImage}
            ref={imgRef}
            src={imageUrl}
            alt="crop image"
            style={{
              transform: `rotate(${imageRotateDeg})`,
            }}
          />
        </ReactCrop>
        <div className={style.buttonsContainer}>
          <button onClick={recortar}>
            <FaCropSimple />{" "}
          </button>
          <button onClick={onSendFileServer}>{sendButtonText}</button>
        </div>
        <div>
          <canvas className={style.hideCanvas} ref={previewCanvasRef} />
        </div>
      </div>
    </>
  );
}
