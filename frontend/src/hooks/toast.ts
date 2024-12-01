import { toast } from "react-toastify";

export const successToast = (message: string) => {
  toast.success(message, {
    className: "bg-green-50",
  });
};

export const warningToast = (message: string) => {
  toast.warning(message, {
    className: "bg-orange-50",
  });
};

export const errorToast = (message: string) => {
  toast.error(message, {
    className: "bg-red-50",
  });
};

export const infoToast = (message: string) => {
  toast.info(message, {
    className: "bg-gray-50",
  });
};
