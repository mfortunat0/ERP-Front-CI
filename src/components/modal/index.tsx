import { MouseEvent } from "react";
import style from "./index.module.css";

interface Modal {
  children: React.ReactNode;
  visibility: boolean;
  setVisibility: (visibility: boolean) => void;
  viewWidth?: number;
  viewHeight?: number;
}

export function Modal({
  children,
  visibility,
  setVisibility,
  viewHeight = 80,
  viewWidth = 94,
}: Modal) {
  const onClickOverlay = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLElement) {
      if (event.target.classList[0]?.includes("overlay")) {
        setVisibility(false);
      }
    }
  };

  return (
    <div
      className={style.overlay}
      style={{
        display: visibility ? "flex" : "none",
      }}
      onClick={onClickOverlay}
    >
      <div
        className={style.content}
        style={{
          width: `${viewWidth}vw`,
          height: `${viewHeight}vh`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
