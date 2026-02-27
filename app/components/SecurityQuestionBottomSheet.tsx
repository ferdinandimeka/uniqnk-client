import RadioGroup, { Option } from "@/app/components/RadioGroup";
import { useAuthStore } from "@/store/useAuthStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import React, { useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import AppText from "./AppText";
import { ModalArgs } from "./ModalContext";

interface Props {
  title?: string;
}

type Step = "select" | "answer" | "confirm";

const SecurityQuestionBottomSheet: React.FC<ModalArgs & Props> = ({
  dismiss,
  visible,
  title,
}) => {
    // const openModal = useOpenModal();
    const { setSecurityQuestion } = useSettingsStore();
    const { users } = useAuthStore(); // ✅ from Zustand
    const userId = users?.data?.user._id

    // const [question, setQuestion] = useState<Option["value"]>("What is your mother’s maiden name?");
    // const [questionId, setQuestionId] = useState<Option["id"]>("What is your mother’s maiden name?");
    

    const [answerText, setAnswerText] = useState("");
    const [confirmText, setConfirmText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<Step>("select");

    const securityQuestions: Option[] = [
        {
        header: "Mother’s maiden name",
        value: "What is your mother’s maiden name?",
        label: "What is your mother’s maiden name?",
        id: "mother_maiden_name",
        },
        {
        header: "First pet",
        value: "What was the name of your first pet?",
        label: "What was the name of your first pet?",
        id: "first_pet",
        },
        {
        header: "Birth city",
        value: "In which city were you born?",
        label: "In which city were you born?",
        id: "birth_city",
        },
        {
        header: "Favorite teacher",
        value: "What is the name of your favorite teacher?",
        label: "What is the name of your favorite teacher?",
        id: "favorite_teacher",
        },
    ];

    const [selectedQuestion, setSelectedQuestion] = useState<Option>(
    securityQuestions[0]
    );
    const normalizeAnswer = (text: string) => text.trim().toLowerCase();
    const validateAnswer = (value: string) => {
        if (!value.trim()) return "Answer is required";
        if (value.trim().length < 3) return "Answer must be at least 3 characters";
        return null;
    }

    const answersMatch = normalizeAnswer(answerText) === normalizeAnswer(confirmText);

    const handleAnswerText = () => {
        const validationError = validateAnswer(answerText);
        if (validationError) {
            setError(validationError);
            return false;
        }
        setError(null);
        setStep("confirm");
    }

    const handleConfirm = async () => {
        if (!answersMatch) {
            setError("Answers do not match");
            return;
        }

        setError(null);

        // ✅ Safe to proceed (hash + API later)
        try {
            await setSecurityQuestion(userId, selectedQuestion.id, answerText);
            alert("Security question set successfully");
        } catch (error) {
            Alert.alert("Error", error instanceof Error ? error.message : "Failed to set security question");
            return;
        }
        dismiss();
    };

    console.log("question:", selectedQuestion.label);
    console.log("questionId:", selectedQuestion.id);
    console.log("answerText:", answerText);
    console.log("confirmText:", confirmText);

    return (
        <Modal transparent animationType="slide" visible={visible}>
        <Pressable style={styles.overlay} onPress={dismiss} />

        <View style={styles.sheet}>
            <View style={styles.border} />

            {title && <AppText variant="header" style={styles.title}>{title}</AppText>}

            {/* STEP 1 – SELECT QUESTION
            {select && (
            <View style={styles.body}>
                <RadioGroup
                options={securityQuestions}
                value={question}
                onChange={setQuestion}
                />

                <Pressable
                style={styles.nextButton}
                onPress={() =>
                    openModal(({ dismiss, visible }) => (
                    <SecurityQuestionBottomSheet
                        answer
                        title="Answer Security Question"
                        dismiss={dismiss}
                        visible={visible}
                        id={undefined}
                    />
                    ))
                }
                >
                    <AppText variant="body1" style={styles.nextButtonText}>Next</AppText>
                </Pressable>
            </View>
            )} */}

            {/* STEP 1 – SELECT QUESTION */}
            {step === "select" && (
            <View style={styles.body}>
               <RadioGroup
                    options={securityQuestions}
                    value={selectedQuestion.value}
                    onChange={(value: Option["value"]) => {
                        const found = securityQuestions.find(q => q.value === value);
                        if (found) setSelectedQuestion(found);
                    }}
                />


                <Pressable
                style={styles.nextButton}
                onPress={() => setStep("answer")}
                >
                <AppText variant="body1" style={styles.nextButtonText}>
                    Next
                </AppText>
                </Pressable>
            </View>
            )}

            {/* STEP 2 – ANSWER */}
            {/* {answer && (
            <View style={styles.body}>
                <AppText variant="body1" style={styles.subtitle}>
                    Enter your answer
                </AppText>

                <AppText variant="body2" style={styles.subtitle}>
                    {question}
                </AppText>

                <TextInput
                    style={styles.input}
                    value={answerText}
                    onChangeText={setAnswerText}
                    placeholder="Your answer"
                />

                <Pressable
                style={styles.nextButton}
                onPress={() =>
                    openModal(({ dismiss, visible }) => (
                    <SecurityQuestionBottomSheet
                        confirm
                        title="Confirm Answer"
                        dismiss={dismiss}
                        visible={visible}
                        id={undefined}
                    />
                    ))
                }
                >   
                    <Pressable onPress={handleAnswerText}>
                        <AppText variant="body1" style={styles.nextButtonText}>Next</AppText>
                    </Pressable>
                
                </Pressable>
            </View>
            )} */}

            {/* STEP 2 – ANSWER */}
            {step === "answer" && (
                <View style={styles.body}>
                    <AppText variant="body1" style={styles.subtitle}>
                        Enter your answer
                    </AppText>

                    <AppText variant="body2" style={styles.subtitle}>
                        {selectedQuestion.label}
                    </AppText>

                    <TextInput
                        style={styles.input}
                        value={answerText}
                        onChangeText={setAnswerText}
                        placeholder="Your answer"
                    />

                    {error && <AppText style={{ color: "red" }}>{error}</AppText>}

                    <Pressable
                        style={styles.nextButton}
                        onPress={handleAnswerText}
                    >
                        <AppText variant="body1" style={styles.nextButtonText}>
                            Next
                        </AppText>
                    </Pressable>
                </View>
            )}


            {/* STEP 3 – CONFIRM */}
            {step === "confirm" && (
                <View style={styles.body}>
                    <AppText variant="body1" style={styles.subtitle}>
                    Re-enter your answer
                    </AppText>

                    <TextInput
                    style={styles.input}
                    value={confirmText}
                    onChangeText={setConfirmText}
                    placeholder="Confirm answer"
                    />

                    {error && <AppText style={{ color: "red" }}>{error}</AppText>}

                    <Pressable
                    style={styles.nextButton}
                    onPress={handleConfirm}
                    >
                    <AppText variant="body1" style={styles.nextButtonText}>
                        Save Security Question
                    </AppText>
                    </Pressable>
                </View>
            )}
        </View>
        </Modal>
    );
};

export default SecurityQuestionBottomSheet;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    sheet: {
        backgroundColor: "#fff",
        paddingVertical: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: "70%",
    },
    border: {
        borderTopWidth: 5,
        borderTopColor: "#D9D9D9",
        width: 70,
        alignSelf: "center",
        borderRadius: 25,
        marginBottom: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
        color: "#474A55",
    },
    subtitle: {
        textAlign: "center",
        marginBottom: 10,
        color: "#555",
    },
    body: {
        paddingHorizontal: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        padding: 12,
        marginTop: 10,
    },
    nextButton: {
        backgroundColor: "#384CFF",
        borderRadius: 25,
        paddingVertical: 12,
        marginTop: 30,
    },
    nextButtonText: {
        color: "#fff",
        fontWeight: "700",
        textAlign: "center",
    },
});
