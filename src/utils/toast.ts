import { toast, UpdateOptions, Zoom } from "react-toastify";

interface ToastSuccess {
  message: string;
}

interface ToastError {
  message: string;
}

interface ToastPromise<T> {
  asyncFunction: Promise<T>;
  pendingMessage?: string;
  onSucess?: string | UpdateOptions<T>;
  onError?: string | UpdateOptions;
}

export const toastSuccess = ({ message }: ToastSuccess) => {
  toast.success(message, {
    autoClose: 3000,
    position: "top-center",
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    theme: "colored",
    hideProgressBar: true,
    closeOnClick: false,
    transition: Zoom,
  });
};

export const toastError = ({ message }: ToastError) => {
  toast.error(message, {
    autoClose: 5000,
    position: "top-center",
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    theme: "colored",
    hideProgressBar: true,
    closeOnClick: false,
    transition: Zoom,
  });
};

export const toastPromise = async <T = unknown>({
  onError = undefined,
  onSucess = undefined,
  pendingMessage = undefined,
  asyncFunction,
}: ToastPromise<T>) => {
  const response = await toast.promise<T>(
    asyncFunction,
    {
      pending: pendingMessage,
      success: onSucess,
      error: onError,
    },
    {
      autoClose: 2000,
      position: "top-center",
      pauseOnHover: false,
      pauseOnFocusLoss: false,
      theme: "colored",
      hideProgressBar: true,
      closeOnClick: false,
      transition: Zoom,
    }
  );
  return response;
};

export const toastClear = () => {
  toast.dismiss();
};
