// components/ModalProvider.tsx
import React, { ReactNode, useCallback, useState } from "react";
import { ModalArgs, ModalContext } from "./ModalContext";

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [ModalComponent, setModalComponent] = useState<React.FC<ModalArgs> | null>(null);
  const [modalProps, setModalProps] = useState<any>({});
  const [visible, setVisible] = useState(false);

  const openModal = useCallback(
    <T extends React.FC<ModalArgs>>(
      Modal: T,
      args: Omit<Parameters<T>[0], "dismiss" | "visible"> & { onDismiss?: () => void }
    ) => {
      setModalComponent(() => Modal);
      setModalProps(args);
      setVisible(true);
    },
    []
  );

  const dismiss = useCallback(() => {
    setVisible(false);
    modalProps?.onDismiss?.();
  }, [modalProps]);

  return (
    <ModalContext.Provider value={{ openModal }}>
      {children}
      {ModalComponent && (
        <ModalComponent
          {...modalProps}
          visible={visible}
          dismiss={dismiss}
        />
      )}
    </ModalContext.Provider>
  );
};
