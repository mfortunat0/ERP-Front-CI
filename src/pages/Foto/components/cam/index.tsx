import { ChangeEvent, useState } from "react";
import { FaImages } from "react-icons/fa6";
import { Product } from "../../../../interfaces";
import { ImageCropIOS } from "../imageCropIOS";
import style from "./index.module.css";
import ImageCrop from "../imageCrop";

interface CamComponentProps {
  productSelected: Product;
  setProductSelected: (product: Product | undefined) => void;
}

export default function CamComponent({
  productSelected,
  setProductSelected,
}: CamComponentProps) {
  const [imageUrl, setImageUrl] = useState("");
  const isIphone = navigator.userAgent.includes("iPhone");

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const imageUrl = URL.createObjectURL(file);
        setImageUrl(imageUrl);
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, 100);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {!imageUrl && (
        <div className={style.captureContainer}>
          <div className={style.containerInputFile}>
            <label htmlFor="file-cam">Tirar uma foto</label>
            <input
              type="file"
              id="file-cam"
              accept="image/*"
              capture="environment"
              onChange={onFileChange}
            />
          </div>
          <div className={style.containerInputFile}>
            <label htmlFor="file-upload">
              Galeria
              <FaImages />
            </label>
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={onFileChange}
            />
          </div>
        </div>
      )}
      {imageUrl && isIphone && (
        <ImageCropIOS
          imageUrl={imageUrl}
          productSelected={productSelected}
          setProductSelected={setProductSelected}
        />
      )}
      {imageUrl && !isIphone && (
        <ImageCrop
          imageUrl={imageUrl}
          productSelected={productSelected}
          setProductSelected={setProductSelected}
        />
      )}
    </>
  );
}
