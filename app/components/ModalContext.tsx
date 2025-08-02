import { createContext, useContext } from "react";

export type ModalArgs = {
  dismiss: () => void;
  visible: boolean;
};
export const ModalContext = createContext<{
  openModal: <T extends React.FC<ModalArgs>>(
    modal: T,
    args: Omit<Parameters<T>[0], "dismiss" | "visible"> & {
      onDismiss?: () => void;
    }
  ) => void;
}>(null!);

export const useOpenModal = () => useContext(ModalContext).openModal;
