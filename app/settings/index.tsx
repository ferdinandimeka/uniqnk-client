import Form, { FormInput } from "@/app/components/AppForm";
import SearchInput from "@/app/components/SearchInput";
import { useRouter } from "expo-router";
import {
  Activity, ArrowRight2, ArrowSquareLeft,
  DocumentText,
  Eye,
  I24Support,
  InfoCircle,
  Logout,
  Notification, Security, ShieldSecurity,
  Speaker,
  User
} from "iconsax-react-native";
import React from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppScreen from "../components/AppScreen";
import { useOpenModal } from "../components/ModalContext";
import Section from "../components/Section";

const { width } = Dimensions.get("window");

const Settings = () => {
  const openModal = useOpenModal();
  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  return (
    <AppScreen noPadding backgroundColor="#fff" style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust depending on header height
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Section
            as={SafeAreaView}
            style={{
              width: "100%",
              backgroundColor: "#fff",
              paddingBottom: 10,
            }}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={goBack}>
                <ArrowSquareLeft size={24} color="#000" />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Settings</Text>
              <View style={{ width: 40 }} />
            </View>
          </Section>

          <View style={{ paddingHorizontal: 16 }}>
            <Form>
              <FormInput
                as={SearchInput}
                outlined
                placeholder="search"
                name="search"
              />
            </Form>

            <View style={styles.settingsContent}>
              <TouchableOpacity style={styles.contents} onPress={() => router.push('/settings/profileDetails')}>
                <View style={styles.content}>
                  <User
                    size="16"
                    color="#555555"
                    variant="Bold"
                  />
                  <Text style={styles.Text}>Profile</Text>
                </View>

                <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.contents}>
                <View style={styles.content}>
                  <Notification
                    size="16"
                    color="#555555"
                    variant="Bold"
                  />
                  <Text style={styles.Text}>Notifications</Text>
                </View>

                <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.contents} onPress={() => router.push('/settings/accountSecurity')}>
                <View style={styles.content}>
                  <Security
                    size="16"
                    color="#555555"
                    variant="Bold"
                  />
                  <Text style={styles.Text}>Account Security Settings</Text>
                </View>

                <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.contents}>
                <View style={styles.content}>
                  <Activity
                    size="16"
                    color="#555555"
                    variant="Bold"
                  />
                  <Text style={styles.Text}>Activity</Text>
                </View>

                <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.contents}>
                <View style={styles.content}>
                  <Eye
                    size="16"
                    color="#555555"
                    variant="Bold"
                  />
                  <Text style={styles.Text}>Privacy</Text>
                </View>

                <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.contents}>
                <View style={styles.content}>
                  <ShieldSecurity
                    size="16"
                    color="#555555"
                    variant="Bold"
                  />
                  <Text style={styles.Text}>Restrictions</Text>
                </View>

                <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginTop: 60, paddingHorizontal: 16, paddingVertical: 20, gap: 20, flex: 1 }}>
            <TouchableOpacity style={styles.contents}>
                <View style={styles.content}>
                  <InfoCircle
                    size="16"
                    color="#555555"
                    variant="Bold"
                  />
                  <Text style={styles.Text}>About</Text>
                </View>

                <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                />
              </TouchableOpacity>

            <TouchableOpacity style={styles.contents}>
                <View style={styles.content}>
                  <Speaker
                    size="16"
                    color="#555555"
                    variant="Bold"
                  />
                  <Text style={styles.Text}>Report a problem</Text>
                </View>

                <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                />
              </TouchableOpacity>

            <TouchableOpacity style={styles.contents}>
                <View style={styles.content}>
                  <I24Support
                    size="16"
                    color="#555555"
                    variant="Bold"
                  />
                  <Text style={styles.Text}>Support</Text>
                </View>

                <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.contents}>
                <View style={styles.content}>
                  <DocumentText
                    size="16"
                    color="#555555"
                    variant="Bold"
                  />
                  <Text style={styles.Text}>Terms and Policies</Text>
                </View>

                <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.contents}>
                <View style={styles.content}>
                  <Logout
                    size="16"
                    color="#555555"
                    variant="Bold"
                  />
                  <Text style={styles.Text}>Logout</Text>
                </View>

                {/* <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                /> */}
              </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "Mulish",
    fontWeight: "bold",
    textAlign: "center",
    color: "#474A55",
    flex: 1,
  },
  form: {
    flexDirection: "column",
    gap: 5,
    paddingVertical: 0,
  },
  settingsContent: {
    paddingVertical: 20,
    gap: 20,
    flex: 1,
  },
  contents: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 6
  },
  content: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  Text: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "Mulish",
    fontWeight: "600",
    color: "#2B2C33",
  },
});

export default Settings;
