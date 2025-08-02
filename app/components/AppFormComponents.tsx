import {
    DISABLED_ON_BG,
    LIGHT_GREY,
    PRIMARY,
    PRIMARY_HOVER,
    TEXT_DARKER,
    TEXT_NEUTRAL,
    WHITE,
} from "@/common/theming/colors";
import AppStyles from "@/common/theming/styles";
import TextStyles from "@/common/theming/text";
import { PolymorphicComponentProps } from "@/common/utils/PolymorphicComponentProps";
import {
    ImagePickerOptions,
    launchImageLibraryAsync,
    useMediaLibraryPermissions,
} from "expo-image-picker";
import {
    ArrowDown2,
    ArrowUp2,
    Eye,
    EyeSlash,
    MinusCirlce,
    TickSquare,
} from "iconsax-react-native";
import {
    isValidElement,
    ReactElement,
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    Alert,
    Image,
    ImageSourcePropType,
    Text,
    TextInputProps,
    TouchableHighlight,
    TouchableHighlightProps,
    View,
    ViewProps,
    ViewStyle,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import AppButton from "./AppButton";
import {
    FormComponentProps,
    FormInput,
    FormInputProps,
    FormLabel,
    useField,
} from "./AppForm";
import AppText from "./AppText";
import AppTextField from "./AppTextField";
import Chip from "./Chip";
import DecoratedTextField from "./DecoratedTextField";

export function PasswordTextField({
  ...props
}: TextInputProps & { update: (text: string) => void }) {
  const [masked, setMasked] = useState(true);
  return (
    <DecoratedTextField
      {...props}
      secureTextEntry={masked}
      suffix={
        <TouchableHighlight
          underlayColor={LIGHT_GREY}
          style={{
            borderRadius: 32,
          }}
          onPress={() => setMasked(!masked)}
        >
          {masked ? (
            <Eye color={TEXT_NEUTRAL} size={20} />
          ) : (
            <EyeSlash color={TEXT_NEUTRAL} size={20} />
          )}
        </TouchableHighlight>
      }
    />
  );
}
export function FormPassword(
  props: PolymorphicComponentProps<
    typeof DecoratedTextField,
    FormInputProps,
    FormComponentProps
  >
) {
  return <FormInput {...props} as={PasswordTextField} />;
}

export function RadioGroup<T extends string>({
  value,
  update,
  options,
  rounded,
  radio,
  style,
  size,
  ...props
}: FormComponentProps<T> & {
  options: Record<T, string>;
} & Pick<Parameters<typeof Chip>[0], "rounded" | "size" | "radio"> &
  ViewProps) {
  return (
    <View
      style={[
        AppStyles.radioGroupContainer,
        {
          gap: size === "small" ? 8 : 16,
          rowGap: size === "small" ? 8 : 16,
          marginTop: 8,
        },
        style,
      ]}
      {...props}
    >
      {Object.keys(options).map((e: T) => {
        return (
          <Chip
            key={e}
            onPress={() => update(e)}
            radio={radio}
            size={size}
            active={value == e}
            label={options[e]}
            rounded={rounded}
          />
        );
      })}
    </View>
  );
}

export function FormRadioGroup<T extends string>(
  props: PolymorphicComponentProps<
    typeof RadioGroup<T>,
    FormInputProps,
    FormComponentProps
  >
) {
  return <FormInput {...props} as={RadioGroup} />;
}

export function ChipMultiselect<T extends string>({
  value,
  update,
  rounded = false,
  options,
  style,
  ...props
}: Partial<FormComponentProps<T[]>> & {
  options: Record<T, string>;
  rounded?: boolean;
} & ViewProps) {
  value ??= [];
  return (
    <View
      style={[
        {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 32,
          rowGap: 16,
          marginTop: 8,
        },
        style,
      ]}
      {...props}
    >
      {Object.keys(options).map((e: T) => {
        return (
          <Chip
            label={options[e]}
            active={value.includes(e)}
            onPress={() =>
              update?.(
                value.includes(e)
                  ? value.filter((f) => f !== e)
                  : value.concat(e)
              )
            }
            key={e}
            rounded={rounded}
          />
        );
      })}
    </View>
  );
}

export function FormChips<T extends string>(
  props: PolymorphicComponentProps<
    typeof ChipMultiselect<T>,
    FormInputProps,
    FormComponentProps
  >
) {
  return <FormInput {...props} as={ChipMultiselect} />;
}
export function Checkbox({
  checked = undefined,
  checkboxLabel,
  update,
  ...props
}: {
  checked?: boolean;
  checkboxLabel?: ReactNode;
  update: (val: boolean) => void;
} & TouchableHighlightProps) {
  return (
    <TouchableHighlight
      onPress={() => update(!checked)}
      underlayColor={PRIMARY_HOVER}
      {...props}
    >
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          },
        ]}
      >
        {checked ? (
          <View
            style={{ backgroundColor: WHITE, borderRadius: 8, padding: -1 }}
          >
            <TickSquare color={PRIMARY} size={24} variant="Bold" />
          </View>
        ) : (
          <View
            style={{
              borderRadius: 6,
              borderColor: TEXT_DARKER,
              borderWidth: 1,
              paddingHorizontal: 9,
              paddingVertical: 9,
              marginHorizontal: 2,
              marginVertical: 2,
            }}
          />
        )}
        {checkboxLabel ? (
          typeof checkboxLabel == "string" ? (
            <AppText variant="body1Darker">{checkboxLabel}</AppText>
          ) : (
            checkboxLabel
          )
        ) : null}
      </View>
    </TouchableHighlight>
  );
}
export function FormCheckbox(
  props: PolymorphicComponentProps<
    typeof Checkbox,
    FormInputProps,
    FormComponentProps
  >
) {
  const value = useField<boolean>(props.name).value;
  return (
    <FormInput
      {...props}
      label={undefined}
      checkboxLabel={props.label}
      as={Checkbox}
      checked={!!value}
    />
  );
}

export function BigFormSelect({
  options,
  style,
  ...props
}: {
  options: { label: string; value: any }[];
  style?: ViewStyle;
} & PolymorphicComponentProps<
  typeof SelectDropdown,
  FormInputProps,
  Record<
    | "search"
    | "defaultValue"
    | "ref"
    | "data"
    | "onSelect"
    | "renderButton"
    | "renderItem",
    any
  >
>) {
  const field = useField(props.name);
  const ref = useRef<SelectDropdown>();

  useEffect(() => {
    ref.current.selectIndex(options.findIndex((t) => t.value === field.value));
  }, [field.value, options]);

  return (
    <SelectDropdown
      dropdownStyle={{ marginTop: -24, borderRadius: 8, elevation: 4 }}
      renderButton={(a, isOpened) => (
        <View
          style={{
            width: "100%",
            position: "relative",
            ...style,
            borderWidth: 0,
            margin: 0,

            marginTop: 0,
            paddingHorizontal: 0,
          }}
        >
          <FormLabel {...props} />
          <AppTextField
            readOnly
            placeholder={props.placeholder}
            update={() => {}}
            value={a?.label}
            style={{
              color: "#333333",
              ...style,
              marginBottom: 0,
              maxHeight: "100%",
            }}
          />
          {isOpened ? (
            <ArrowUp2
              style={{ position: "absolute", right: 16, bottom: 12 }}
              color={PRIMARY}
              size={24}
            />
          ) : (
            <ArrowDown2
              style={{ position: "absolute", right: 16, bottom: 12 }}
              color={"#bbbbbb"}
              size={24}
            />
          )}
        </View>
      )}
      defaultValue={field.value}
      ref={ref}
      data={options}
      renderItem={(e, i, b) => {
        return (
          <View
            style={{
              paddingVertical: 12,
              borderBottomColor: "#f0f0f0",
              borderBottomWidth: 1,
              paddingHorizontal: 16,

              backgroundColor: b ? PRIMARY : WHITE,
            }}
          >
            <Text style={[TextStyles.lg, { color: b ? WHITE : "#333333" }]}>
              {e.label}
            </Text>
          </View>
        );
      }}
      onSelect={(e: any) => {
        field.update(e.value);
      }}
      {...props}
    />
  );
}
export type ImageFile = {
  uri: string;
  width: number;
  height: number;
  type: "image";
};
export const FormImage = function <
  T extends React.ElementType = typeof AppButton
>(
  props: PolymorphicComponentProps<
    T,
    Omit<FormInputProps, "placeholder"> & {
      placeholder: ImageSourcePropType | ReactElement | string | ImageFile;
    },
    { onPress: () => void; onClick: () => void; children: any }
  > & { options?: ImagePickerOptions }
) {
  const As = props.as ?? AppButton;
  const field = useField(props.name);
  const [status, requestPermission] = useMediaLibraryPermissions();
  const ref = useRef({ options: props.options });
  ref.current.options = props.options;
  const onClick = useCallback(() => {
    const handleResult = () => {
      launchImageLibraryAsync(ref.current.options).then((e) => {
        e.assets?.[0] && field.update(e.assets[0] as ImageFile);
      });
    };
    if (status?.granted) {
      handleResult();
    } else {
      requestPermission().then((status) => {
        if (status.granted) {
          handleResult();
        } else {
          Alert.alert(
            "Permission denied",
            "You need to grant permission to access your media library"
          );
        }
      });
    }
  }, [status?.granted, field, requestPermission]);
  const placeholder = props.placeholder ?? "No image selected";
  return (
    <>
      <As
        {...props}
        onClick={onClick}
        onPress={onClick}
        style={[{ padding: 0, overflow: "hidden" }, props.style]}
      >
        {field.value ? (
          <Image
            source={field.value}
            style={{
              width: "100%",
              flex: 1,
              resizeMode: "contain",
            }}
          />
        ) : typeof placeholder === "string" ? (
          <Text style={{ color: DISABLED_ON_BG, textAlign: "center" }}>
            {placeholder}
          </Text>
        ) : isValidElement(placeholder) ? (
          placeholder
        ) : (
          <Image
            source={placeholder as ImageSourcePropType}
            style={{
              width: "100%",
              flex: 1,
              resizeMode: "contain",
            }}
          />
        )}
        {props.children}
        <TouchableHighlight
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            opacity: field.value ? 0.8 : 0,
            zIndex: 10,
          }}
          onPress={() => {
            field.update(undefined);
          }}
        >
          <MinusCirlce size={32} color={DISABLED_ON_BG} />
        </TouchableHighlight>
      </As>
      <FormLabel {...props} />
    </>
  );
};
