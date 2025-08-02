// import { TextInput } from "react-native";
import { PRIMARY, RED } from "@/common/theming/colors";
import AppStyles from "@/common/theming/styles";
import { Ref, useState } from "react";
import { TextInput, TextInputProps } from "react-native";
/*
Autofill
additional-name
address-line1
address-line2
cc-number
country
current-password
email
family-name
given-name
honorific-prefix
honorific-suffix
name
new-password
off
one-time-code
postal-code
street-address
tel
username
*/

/*
enterKeyTypes
enter
done
next
search
send

returnKey
done
go
next
search
send
*/

/*inputMode
none
text
decimal
numeric
tel
search
email
url*/

/*Keyboardtype
default
number-pad
decimal-pad
numeric
email-address
phone-pad
url
*/

export type AppTextFieldProps = TextInputProps & {
  inputRef?: Ref<TextInput>;
  update: (text: string) => void;
  focusStyle?: TextInputProps["style"];
  outlined?: boolean;
  error?: boolean;
  noMargin?: boolean;
};
export default function AppTextField(props: AppTextFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      selectionColor={PRIMARY}
      {...props}
      value={props.value?.toString()}
      ref={props.inputRef}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      style={[
        AppStyles.input,
        props.outlined ? AppStyles.outlinedInput : null,
        props.style,
        focused
          ? props.focusStyle ||
            (props.outlined ? AppStyles.outlinedActive : AppStyles.focusedInput)
          : null,
        props.error
          ? {
              borderColor: RED,
            }
          : null,
        props.noMargin ? { marginBottom: 0 } : null,
      ].flat()}
      onChange={(e) => props.update?.(e.nativeEvent.text)}
    />
  );
}
