// import React, {
//   PropsWithChildren,
//   ReactNode,
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { Text, TextStyle, View } from "react-native";
// import { DARK_GRAY, RED } from "@/common/theming/colors";
// import TextStyles from "@/common/theming/text";
// import { PolymorphicComponentProps } from "@/common/utils/PolymorphicComponentProps";
// import AppButton from "./AppButton";
// import AppText from "./AppText";
// import AppTextField from "./AppTextField";
// import AppStyles from "@/common/theming/styles";

// type Path = [...path: (string | number)[], key: string];
// export type FormContext<T extends object = any> = {
//   submit(): void;
//   data: T;
//   reset(value: any): void;
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   update(path: Path, value: any): void;
//   setError(e: FormErrorState): void;
// } & FormErrorState;

// const context = createContext(null as FormContext);

// export default function Form<T extends object = any>({
//   onSubmit,
//   formRef,
//   children,
//   initialValue,
//   onValidate,
//   onChange,
// }: {
//   onSubmit?: (data: T) => void;
//   initialValue?: T;
//   onChange?: (data: T) => void;
//   onValidate?: (
//     data: T
//   ) => Promise<FormErrorState | null> | FormErrorState | null;
//   formRef?: React.MutableRefObject<FormContext<T>>;
// } & PropsWithChildren) {
//   const [data, setData] = useState<T>(initialValue ?? ({} as T));
//   const [errorInfo, setErrorInfo] = useState<FormErrorState>(null);

//   const callbacks = useRef({ onSubmit, onChange, onValidate });
//   callbacks.current.onChange = onChange;
//   callbacks.current.onValidate = onValidate;
//   callbacks.current.onSubmit = onSubmit;

//   useEffect(() => {
//     if (callbacks.current.onValidate) {
//       let cancelled = false;
//       const deferred = setTimeout(async () => {
//         if (
//           callbacks.current.onValidate &&
//           errorInfo &&
//           (errorInfo.error || errorInfo.errors)
//         ) {
//           const result = await callbacks.current.onValidate(data);
//           if (!cancelled) setErrorInfo(result);
//         }
//       }, 1000);
//       return () => {
//         cancelled = true;
//         clearTimeout(deferred);
//       };
//     }
//   }, [data, errorInfo]);
//   const value = useMemo(() => {
//     return {
//       data,
//       setError: setErrorInfo,
//       ...errorInfo,
//       submit: async () => {
//         const errorInfo = callbacks.current.onValidate
//           ? await callbacks.current.onValidate(data)
//           : null;
//         setErrorInfo(errorInfo);
//         if (errorInfo) return;
//         try {
//           await callbacks.current.onSubmit(data);
//         } catch (e) {
//           console.error(e);
//           setErrorInfo({ error: e.message });
//         }
//       },
//       update(path: Path, value: any) {
//         const _isArray = Array.isArray;
//         let x = _isArray(data) ? (data.slice() as T) : { ...data };
//         const y = x;

//         for (let i = 0; i < path.length - 1; i++) {
//           const isArray = x[path[i]]
//             ? _isArray(x[path[i]])
//             : typeof path[i + 1] === "number";

//           x = x[path[i]] = isArray
//             ? [...(x[path[i]] || [])]
//             : { ...(x[path[i]] || {}) };
//         }

//         if (value === undefined && _isArray(x)) {
//           x.splice(path[path.length - 1] as number, 1);
//         } else x[path[path.length - 1]] = value;
//         setData(y);
//         if (callbacks.current.onChange) {
//           callbacks.current.onChange(y);
//         }
//       },
//       reset: setData,
//     };
//   }, [data, errorInfo]);

//   useEffect(() => {
//     if (formRef) {
//       formRef.current = value;
//       return () => (formRef.current = null);
//     }
//   }, [formRef, value]);
//   return <context.Provider value={value}>{children}</context.Provider>;
// }
// export const useField = function <T>(path_or_name: Path | string) {
//   const path: Path = useMemo(() => {
//     if (typeof path_or_name === "string")
//       return path_or_name
//         .split(/[[\].]/)
//         .filter(Boolean)
//         .map((e) => (/^\d+$/.test(e) ? parseInt(e) : e)) as Path;
//     else return path_or_name ?? ["?"];
//   }, [path_or_name]);
//   const m = useContext(context);

//   const error = path.reduce((acc, e) => acc?.[e], m.errors) as
//     | string
//     | undefined;
//   return useMemo(
//     () => ({
//       value: path.reduce((acc, e) => acc?.[e], m.data) as T | undefined,
//       error: Array.isArray(error) ? error.join(". ") + "." : error,
//       update(value: T) {
//         m.update(path, value);
//       },
//     }),
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [...path, m]
//   );
// };
// export type FormComponentProps<T = string> = {
//   value: T;
//   update: (e: T) => void;
//   error?: boolean;
// };
// type IFormElement<T> = React.ElementType<FormComponentProps<T>>;

// export type FormInputProps = {
//   label?: ReactNode;
//   labelStyle?: TextStyle;
//   error?: string;
//   placeholder?: string;
//   required?: boolean;
//   name: string;
// };

// export function FormInput<
//   ValueType = string,
//   FormComponentType extends IFormElement<ValueType> = typeof AppTextField extends IFormElement<ValueType>
//     ? typeof AppTextField
//     : never
// >({
//   as: As = AppTextField as unknown as FormComponentType,
//   name,
//   ...props
// }: PolymorphicComponentProps<
//   FormComponentType,
//   FormInputProps,
//   FormComponentProps<ValueType>
// >) {
//   const field = useField<ValueType>(name);

//   return (
//     <>
//       <FormLabel {...props} />
//       <As
//         update={field.update}
//         value={field.value}
//         name={name}
//         error={!!field.error}
//         noMargin={!!field.error}
//         {...props}
//       />
//       {field.error ? (
//         // @ts-expect-error AppText does not like color
//         <AppText variant="body1" style={{ color: RED, ...AppStyles.mb }}>
//           {field.error}
//         </AppText>
//       ) : null}
//     </>
//   );
// }
// export function FormLabel({
//   label,
//   required = true,
//   labelStyle,
// }: {
//   label?: ReactNode;
//   required?: boolean;
//   labelStyle?: TextStyle;
// }) {
//   return label ? (
//     typeof label == "string" ? (
//       <Text
//         style={[TextStyles.smBold, { color: DARK_GRAY }, labelStyle ?? null]}
//       >
//         {label}
//         <Text style={{ color: "red" }}>{required ? " *" : ""}</Text>
//       </Text>
//     ) : (
//       label
//     )
//   ) : null;
// }

// export function FormArray<T = string>({
//   name,
//   renderEach,
//   renderHeader,
//   renderFooter,
//   ...props
// }: {
//   renderEach: (
//     value: T,
//     i: number,
//     update: (value: T | undefined) => void
//   ) => ReactNode;
//   renderHeader?: (value: T[], update: (value: T[]) => void) => ReactNode;
//   renderFooter?: (value: T[], update: (value: T[]) => void) => ReactNode;
// } & PolymorphicComponentProps<
//   typeof View,
//   FormInputProps,
//   FormComponentProps<T[]>
// >) {
//   const field = useField<T[]>(name);
//   if (!field.value) field.value = [];
//   return (
//     <>
//       <FormLabel {...props} />
//       {renderHeader ? renderHeader(field.value, field.update) : null}
//       {field.value.map((e, i) => {
//         return renderEach(e, i, (value: T | undefined) => {
//           /** This matches the behaviour of Form.update */
//           field.update(
//             value === undefined
//               ? [...field.value.slice(0, i), ...field.value.slice(i + 1)]
//               : [...field.value.slice(0, i), value, ...field.value.slice(i + 1)]
//           );
//         });
//       })}
//       {renderFooter ? renderFooter(field.value, field.update) : null}
//     </>
//   );
// }

// export function FormSubmit(
//   props: PolymorphicComponentProps<typeof AppButton, { onPress?: any }>
// ) {
//   const form = useContext(context);
//   return <AppButton onPress={form.submit} {...props} />;
// }


import { DARK_GRAY, RED } from "@/common/theming/colors";
import AppStyles from "@/common/theming/styles";
import TextStyles from "@/common/theming/text";
import { PolymorphicComponentProps } from "@/common/utils/PolymorphicComponentProps";
import React, {
    PropsWithChildren,
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Text, TextStyle, View } from "react-native";
import AppButton from "./AppButton";
import AppText from "./AppText";
import AppTextField from "./AppTextField";

type Path = [...path: (string | number)[], key: string];

export type FormErrorState = {
  error?: string;
  errors?: Record<string, any>;
} | null;

export type FormContext<T extends object = any> = {
  submit(): void;
  data: T;
  reset(value: T): void;
  update(path: Path, value: any): void;
  setError(e: FormErrorState): void;
} & FormErrorState;

const formContext = createContext<FormContext<any> | null>(null);

export default function Form<T extends object = any>({
  onSubmit,
  formRef,
  children,
  initialValue,
  onValidate,
  onChange,
}: {
  onSubmit?: (data: T) => void;
  initialValue?: T;
  onChange?: (data: T) => void;
  onValidate?: (data: T) => Promise<FormErrorState> | FormErrorState;
  formRef?: React.MutableRefObject<FormContext<T> | null>;
} & PropsWithChildren) {
  const [data, setData] = useState<T>(initialValue ?? {} as T);
  const [errorInfo, setErrorInfo] = useState<FormErrorState>(null);

  const callbacks = useRef({ onSubmit, onChange, onValidate });
  callbacks.current = { onSubmit, onChange, onValidate };

  useEffect(() => {
    if (!callbacks.current.onValidate) return;

    let cancelled = false;
    const timeout = setTimeout(async () => {
      if (cancelled || !callbacks.current.onValidate) return;

      if (errorInfo?.error || errorInfo?.errors) {
        const result = await callbacks.current.onValidate(data);
        if (!cancelled) setErrorInfo(result);
      }
    }, 1000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [data, errorInfo]);

  const value = useMemo<FormContext<T>>(() => ({
    data,
    ...errorInfo,
    setError: setErrorInfo,
    reset: setData,
    submit: async () => {
      const error = callbacks.current.onValidate
        ? await callbacks.current.onValidate(data)
        : null;
      setErrorInfo(error);
      if (error) return;
      try {
        await callbacks.current.onSubmit?.(data);
      } catch (e: any) {
        console.error(e);
        setErrorInfo({ error: e.message });
      }
    },
    update(path: Path, value: any) {
      const isArray = Array.isArray;
      let current = isArray(data) ? [...(data as any)] : { ...data };
      const newData = current;

      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        const nextKey = path[i + 1];
        const isNextArray = typeof nextKey === "number";
        current[key] = current[key]
          ? isArray(current[key])
            ? [...current[key]]
            : { ...current[key] }
          : isNextArray
          ? []
          : {};
        current = current[key];
      }

      const lastKey = path[path.length - 1];
      if (value === undefined && isArray(current)) {
        current.splice(lastKey as number, 1);
      } else {
        current[lastKey] = value;
      }

      setData(newData);
      callbacks.current.onChange?.(newData);
    },
  }), [data, errorInfo]);

  useEffect(() => {
    if (formRef) {
      formRef.current = value;
      return () => {
        formRef.current = null;
      };
    }
  }, [formRef, value]);

  return <formContext.Provider value={value}>{children}</formContext.Provider>;
}

export function useField<T>(pathOrName: Path | string) {
  const form = useContext(formContext);
  if (!form) throw new Error("useField must be used inside a Form");

  const path: Path = useMemo(() => {
    return typeof pathOrName === "string"
      ? pathOrName
          .split(/[[\].]/)
          .filter(Boolean)
          .map((e) => (/^\d+$/.test(e) ? parseInt(e) : e)) as Path
      : pathOrName ?? ["?"];
  }, [pathOrName]);

  const error = path.reduce((acc, key) => acc?.[key], form.errors) as string | undefined;

  return useMemo(() => ({
    value: path.reduce((acc, key) => acc?.[key], form.data) as T | undefined,
    error: Array.isArray(error) ? error.join(". ") + "." : error,
    update: (value: T) => form.update(path, value),
  }), [form, path, error]);
}

export type FormComponentProps<T = string> = {
  value: T;
  update: (e: T) => void;
  error?: boolean;
};

type IFormElement<T> = React.ElementType<FormComponentProps<T>>;

export type FormInputProps = {
  label?: ReactNode;
  labelStyle?: TextStyle;
  error?: string;
  placeholder?: string;
  required?: boolean;
  name: string;
};

export function FormInput<
  ValueType = string,
  FormComponentType extends IFormElement<ValueType> = typeof AppTextField extends IFormElement<ValueType>
    ? typeof AppTextField
    : never
>({
  as: As = AppTextField as unknown as FormComponentType,
  name,
  ...props
}: PolymorphicComponentProps<
  FormComponentType,
  FormInputProps,
  FormComponentProps<ValueType>
>) {
  const field = useField<ValueType>(name);

  return (
    <>
      <FormLabel {...props} />
      <As
        update={field.update}
        value={field.value}
        name={name}
        error={!!field.error}
        noMargin={!!field.error}
        {...props}
      />
      {field.error && (
        <AppText variant="body1" style={{ color: RED, ...AppStyles.mb }}>
          {field.error}
        </AppText>
      )}
    </>
  );
}

export function FormLabel({
  label,
  required = true,
  labelStyle,
}: {
  label?: ReactNode;
  required?: boolean;
  labelStyle?: TextStyle;
}) {
  return label ? (
    typeof label === "string" ? (
      <Text style={[TextStyles.smBold, { color: DARK_GRAY }, labelStyle]}>
        {label}
        {required && <Text style={{ color: "red" }}> *</Text>}
      </Text>
    ) : (
      label
    )
  ) : null;
}

export function FormArray<T = string>({
  name,
  renderEach,
  renderHeader,
  renderFooter,
  ...props
}: {
  renderEach: (
    value: T,
    i: number,
    update: (value: T | undefined) => void
  ) => ReactNode;
  renderHeader?: (value: T[], update: (value: T[]) => void) => ReactNode;
  renderFooter?: (value: T[], update: (value: T[]) => void) => ReactNode;
} & PolymorphicComponentProps<
  typeof View,
  FormInputProps,
  FormComponentProps<T[]>
>) {
  const field = useField<T[]>(name);

  const updateAt = (i: number, value: T | undefined) => {
    const newArray = value === undefined
      ? [...field.value.slice(0, i), ...field.value.slice(i + 1)]
      : [...field.value.slice(0, i), value, ...field.value.slice(i + 1)];
    field.update(newArray);
  };

  return (
    <>
      <FormLabel {...props} />
      {renderHeader?.(field.value, field.update)}
      {field.value.map((item, i) => renderEach(item, i, (val) => updateAt(i, val)))}
      {renderFooter?.(field.value, field.update)}
    </>
  );
}

export function FormSubmit(
  props: PolymorphicComponentProps<typeof AppButton, { onPress?: any }>
) {
  const form = useContext(formContext);
  if (!form) throw new Error("FormSubmit must be used inside a Form");

  return <AppButton onPress={form.submit} {...props} />;
}
