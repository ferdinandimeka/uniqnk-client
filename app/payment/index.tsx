import { rMS, rS } from "@/styles/responsive";
// import { useFormikContext } from "formik"; // 👈 import this
import { useOpenModal } from "@/app/components/ModalContext";
import React from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Form, { FormInput, useFormContext } from "../components/AppForm";
import AppScreen from "../components/AppScreen";
import DecoratedTextField from "../components/DecoratedTextField";
import PaymentBottomSheet from "../components/PaymentBottomSheet";

const img = require('@/assets/image/icon.png');

const Payment = () => {
    const openModal = useOpenModal();
    const handleNavigation = () => {
        openModal(PaymentBottomSheet, {})
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "padding"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
            <AppScreen noPadding backgroundColor="#fdfdffff" style={{ flex: 1, paddingTop: 60, paddingHorizontal: 10 }}>
                 <Form initialValue={{ amount: "" }} onSubmit={() => {}}>
                    <FormContent handleNavigation={handleNavigation} />
                </Form> 
            </AppScreen>
        </KeyboardAvoidingView>
    );
};

// 👇 Extract into a sub-component so we can use formik context
const FormContent = ({ handleNavigation }: { handleNavigation: () => void }) => {
    const { data } = useFormContext<{ amount: string }>();

    const isDisabled = !data.amount?.trim(); // disabled if empty

    return (
        <View style={{ flexDirection: "column", gap: 30, alignItems: "center" }}>
            <View style={{ flexDirection: "row", paddingHorizontal: 15 }}>
                <FormInput
                    as={DecoratedTextField}
                    name="amount"
                    containerStyle={{ flex: 1 }}
                    outlined
                    noMargin
                    placeholder="₦0000.00"
                    keyboardType="numeric"
                    formatValue={(val: string) => {
                        if (!val) return "";

                        // parse raw numeric
                        const num = parseFloat(val.replace(/[^\d.]/g, ""));
                        if (isNaN(num)) return "";

                        // format with commas + 2 decimals
                        return `₦ ${num.toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        })}`;
                    }}
                />
            </View>

            <TouchableOpacity
                style={[
                    styles.btn2,
                    { backgroundColor: isDisabled ? "#ccc" : "#1C78FF" } // dim when disabled
                ]}
                disabled={isDisabled}
                onPress={handleNavigation}
            >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, fontFamily: "MulishBold" }}>Continue</Text>
                <Image source={img} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    btn2: {
        backgroundColor: '#1C78FF',
        padding: rMS(16),
        borderRadius: 32,
        width: rS(300),
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: "row",
        gap: 10
    },
});

export default Payment;
