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
import { Text, TextStyle, TouchableOpacity, View } from "react-native";
import AppButton from "./AppButton";
import AppText from "./AppText";
import AppTextField from "./AppTextField";

import { ArrowDown2 } from "iconsax-react-native";

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

// inside AppForm.tsx
export function useFormContext<T>() {
  const ctx = useContext(formContext);
  if (!ctx) throw new Error("useFormContext must be used inside a Form");
  return ctx as FormContext<T>;
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
  formatValue?: (val: string) => string; // 👈 added
};

export function FormInput<
  ValueType = string,
  FormComponentType extends IFormElement<ValueType> = typeof AppTextField extends IFormElement<ValueType>
    ? typeof AppTextField
    : never
>({
  as: As = AppTextField as unknown as FormComponentType,
  name,
  onOpenDropdown,
  formatValue, // 👈 destructure it
  ...props
}: PolymorphicComponentProps<
  FormComponentType,
  FormInputProps & { onOpenDropdown?: () => void },
  FormComponentProps<ValueType>
>) {
  const field = useField<ValueType>(name);

  // Format value for display, keep raw value in form state
  const displayValue =
    typeof field.value === "string" && formatValue
      ? formatValue(field.value)
      : field.value;

  const handleUpdate = (val: any) => {
    // Strip out ₦ before saving to state
    if (typeof val === "string" && formatValue) {
      field.update(val.replace(/[₦\s]/g, ""));
    } else {
      field.update(val);
    }
  };

  const InputComponent = (
    <As
      update={handleUpdate}
      value={displayValue}
      name={name}
      error={!!field.error}
      noMargin={!!field.error}
      editable={!onOpenDropdown} // disable keyboard if dropdown
      pointerEvents={onOpenDropdown ? "none" : "auto"} // prevent focus
      {...props}
    />
  );

  return (
    <>
      <FormLabel {...props} />

      {onOpenDropdown ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenDropdown}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <View style={{ flex: 1, position: "relative" }}>
            {InputComponent}
            <ArrowDown2
              size={20}
              color="#999"
              style={{ alignSelf: "flex-end", bottom: 35, right: 15 }}
            />
          </View>
        </TouchableOpacity>
      ) : (
        InputComponent
      )}

      {field.error && (
        <AppText variant="body1" style={{ color: RED, ...AppStyles.mb }}>
          {field.error}
        </AppText>
      )}
    </>
  );
}


// export function FormInput<
//   ValueType = string,
//   FormComponentType extends IFormElement<ValueType> = typeof AppTextField extends IFormElement<ValueType>
//     ? typeof AppTextField
//     : never
// >({
//   as: As = AppTextField as unknown as FormComponentType,
//   name,
//   onOpenDropdown,
//   ...props
// }: PolymorphicComponentProps<
//   FormComponentType,
//   FormInputProps & { onOpenDropdown?: () => void },
//   FormComponentProps<ValueType>
// >) {
//   const field = useField<ValueType>(name);

//   const InputComponent = (
//     <As
//       update={field.update}
//       value={field.value}
//       name={name}
//       error={!!field.error}
//       noMargin={!!field.error}
//       editable={!onOpenDropdown} // disable keyboard if dropdown
//       pointerEvents={onOpenDropdown ? "none" : "auto"} // prevent focus
//       {...props}
//     />
//   );

//   return (
//     <>
//       <FormLabel {...props} />

//       {onOpenDropdown ? (
//         // Wrap input + arrow in a touchable
//         <TouchableOpacity
//           activeOpacity={0.8}
//           onPress={onOpenDropdown}
//           style={{ flexDirection: "row", alignItems: "center" }}
//         >
//           <View style={{ flex: 1, position: "relative" }}>
//             {InputComponent}
//             <ArrowDown2 size={20} color="#999" style={{ alignSelf: "flex-end", bottom: 35, right: 15 }} />
//           </View>
//         </TouchableOpacity>
//       ) : (
//         InputComponent
//       )}

//       {field.error && (
//         <AppText variant="body1" style={{ color: RED, ...AppStyles.mb }}>
//           {field.error}
//         </AppText>
//       )}
//     </>
//   );
// }


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

  const handlePress = async () => {
    console.log("FormSubmit pressed"); // <-- should log
    await form.submit();
    props.onPress?.(); // ✅ runs extra logic after successful submit
  };

  return <AppButton {...props} onPress={handlePress} />;
}
