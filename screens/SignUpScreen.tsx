import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
  Toast,
} from "react-native-alert-notification";

const PUBLICK_URL = "https://ec52c035de10.ngrok-free.app/";

export default function SignUpScreen({ navigation }: { navigation: any }) {
  const [getFullName, setFullName] = React.useState("");
  const [getUsername, setUsername] = React.useState("");
  const [getEmail, setEmail] = React.useState("");
  const [getPassword, setPassword] = React.useState("");
  const [getConfirmPassword, setConfirmPassword] = React.useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);


  const validateForm = () => {
    const fullName = getFullName.trim();
    const username = getUsername.trim();
    const email = getEmail.trim();
    const password = getPassword;
    const confirmPassword = getConfirmPassword;

    if (!fullName || !username || !email || !password || !confirmPassword) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "WARNING",
        textBody: "Please fill required data",
      });
      return false;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Passwords do not match",
      });
      return false;
    }

    if (password.length < 6) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "WARNING",
        textBody: "Password must be at least 6 characters long",
      });
      return false;
    } else if (password.length > 20) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "WARNING",
        textBody: "Password must be at less than 20 characters",
      });
      return false;
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "WARNING",
        textBody: "Please enter a valid email address",
      });
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {

      const response = await fetch(PUBLICK_URL + "FinTrack/SignUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: getFullName,
          username: getUsername,
          email: getEmail,
          password: getPassword
        })
      });

      const res = await response.json();

      if (response.ok && res.id) {
        await AsyncStorage.setItem("userId", res.id.toString());

        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Account created successfully.Please log in to continue.",
          button: "OK",
          onPressButton: () => {
            navigation.replace("Login");
          },
        });

      } else if (response.status === 409) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "An account with this email already exists.Please use a different email.or try logging in.",
          button: "OK"
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "WARNING",
          textBody: "Failed to create account. Please try again.",
        });
      }

    } catch (err: any) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <AlertNotificationRoot>
        <ScrollView contentContainerStyle={styles.scrollContainer}>

          <View style={styles.formContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join us and start tracking your expenses with</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>

              {/* Full Name*/}
              <View style={[styles.inputContainer]}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  value={getFullName}
                  onChangeText={setFullName}
                  style={styles.input}
                  placeholder="Sadun Perera"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                />
              </View>

              {/* Username */}
              <View style={[styles.inputContainer]}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  value={getUsername}
                  onChangeText={setUsername}
                  style={styles.input}
                  placeholder="Sadun123"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                />
              </View>

              {/* Email */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  value={getEmail}
                  onChangeText={setEmail}
                  style={styles.input}
                  placeholder="sadun123@example.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    value={getPassword}
                    onChangeText={setPassword}
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!passwordVisible}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  >
                    <Text style={styles.eyeText}>{passwordVisible ? "👁️" : "👁️‍🗨️"}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    value={getConfirmPassword}
                    onChangeText={setConfirmPassword}
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Confirm your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!confirmPasswordVisible}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  >
                    <Text style={styles.eyeText}>{confirmPasswordVisible ? "👁️" : "👁️‍🗨️"}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Password Requirements */}
              <View style={styles.passwordRequirements}>
                <Text style={styles.requirementsText}>
                  Password must be at least 6 characters long
                </Text>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                <Text style={styles.signUpButtonText}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </AlertNotificationRoot>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  formContainer: {
    marginHorizontal: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  form: {
    marginBottom: 24,
  },
  nameRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
    color: "#111827",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: "absolute",
    right: 15,
    top: 15,
    padding: 5,
  },
  eyeText: {
    fontSize: 18,
  },
  passwordRequirements: {
    marginBottom: 24,
  },
  requirementsText: {
    fontSize: 12,
    color: "#6B7280",
    fontStyle: "italic",
  },
  signUpButton: {
    backgroundColor: "#10B981",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signUpButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
    elevation: 0,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
  },
  signInText: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "600",
  }
});