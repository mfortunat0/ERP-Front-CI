import style from "./index.module.css";
import noPhoto from "@/assets/no-photo-available.jpg";
import { Product } from "@/interfaces";
import { useState } from "react";
import { FaBan, FaCheck } from "react-icons/fa6";
import { ciAxios } from "@/utils/ciAxios";
import { toastPromise, toastSuccess } from "@/utils/toast";
import { Modal } from "@/components/modal";

interface ImageCropIOSProps {
  imageUrl: string;
  productSelected: Product;
  setProductSelected: (product: Product | undefined) => void;
}

export function ImageCropIOS({
  imageUrl,
  productSelected,
  setProductSelected,
}: ImageCropIOSProps) {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [formDataState, setFormDataState] = useState<FormData>();
  const [submitInProgress, setSubmitInProgress] = useState(false);

  const widthFinalImage = 500;
  const heightFinalImage = 500;
  const url = `${
    import.meta.env.VITE_SERVER_NODE_URL
  }/uploads/salvar-imagem-produto`;

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

  const sendButton = async () => {
    if (!submitInProgress) {
      setSubmitInProgress(true);
      const imageBlob = (await fetch(imageUrl)).blob();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("CTX is null");
      }

      const urlBlob = URL.createObjectURL(await imageBlob);
      const img = new Image();
      img.src = urlBlob;

      img.onload = function () {
        canvas.width = widthFinalImage;
        canvas.height = heightFinalImage;
        ctx.drawImage(img, 0, 0, widthFinalImage, heightFinalImage);

        canvas.toBlob(async (blob) => {
          if (blob) {
            const formData = new FormData();
            const nomeImagem =
              "P" + productSelected.CODPRO.replace(".", "") + ".jpg";

            const imagem = new File([blob], nomeImagem, {
              type: "image/jpg",
            });

            formData.append("imagem", imagem);
            formData.append("nomeImagem", nomeImagem);

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
              console.log(error);
              setModalVisibility(true);
            }
          }
        });
      };
      setSubmitInProgress(false);
    }
  };

  return (
    <div className={style.imageCropContainer}>
      <Modal visibility={modalVisibility} setVisibility={setModalVisibility}>
        <span>Imagem ja cadastrada no sistema</span>
        <img
          src={`http://192.168.100.100:9060/fotos/P${productSelected.CODPRO.replace(
            ".",
            ""
          )}.jpg?v=${Date.now()}`}
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
      <img
        className={style.imageCrop}
        width={widthFinalImage}
        height={heightFinalImage}
        src={imageUrl}
        alt="crop image"
      />
      <button onClick={sendButton}>Enviar</button>
    </div>
  );
}
