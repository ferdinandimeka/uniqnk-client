import React, { createContext, useContext } from "react";

export type ModalArgs = {
  id: string | string[] | undefined;
  dismiss: () => void;
  visible: boolean;
};

// Extendable props type
export type ModalProps<T = any> = ModalArgs & T;

// Context type definition
type ModalContextType = {
  openModal: <T extends React.FC<any>>(
    modal: T,
    args?: Partial<Omit<Parameters<T>[0], keyof ModalArgs>> & {
      onDismiss?: () => void;
      id?: string | string[];          // ✅ Explicitly support `id`
      activeTab?: string;   // ✅ Support other useful props
    }
  ) => void;
};

export const ModalContext = createContext<ModalContextType>(null!);

// Custom hook to open a modal
export const useOpenModal = () => useContext(ModalContext).openModal;
