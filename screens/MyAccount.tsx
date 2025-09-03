import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

type ProgressStatus = "idle" | "saving" | "success" | "error";

export default function MyAccount() {
  const [fullName, setFullName] = useState("Pamith Herath");
  const [userName, setUserName] = useState("pamith123");
  const [email, setEmail] = useState("pbherath2018@gmail.com");
  const [password, setPassword] = useState("pamith@0310");
  const [memberSince, setMemberSince] = useState<Date | null>(
    new Date(2025, 4, 15)
  );

  const [progressStatus, setProgressStatus] = useState<ProgressStatus>("idle");
  const [secureText, setSecureText] = useState(true);

  const progress = useRef(new Animated.Value(0)).current;

  const startFakeUpdate = () => {
    if (!fullName.trim() || !userName.trim() || !email.trim()) {
      Alert.alert(
        "Validation",
        "Full name, user name and email are required."
      );
      return;
    }

    setProgressStatus("saving");
    progress.setValue(0);

    Animated.timing(progress, {
      toValue: 1,
      duration: 1400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        setMemberSince(new Date());
        setProgressStatus("success");

        setTimeout(() => {
          setProgressStatus("idle");
          progress.setValue(0);
        }, 1400);
      }, 300);
    });
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const renderStatus = () => {
    switch (progressStatus) {
      case "saving":
        return (
          <View style={styles.statusRow}>
            <ActivityIndicator size="small" color="#1976d2" />
            <Text style={styles.statusText}> Saving profile…</Text>
          </View>
        );
      case "success":
        return (
          <Text style={[styles.statusText, styles.successText]}>
            ✅ Profile updated
          </Text>
        );
      case "error":
        return (
          <Text style={[styles.statusText, styles.errorText]}>
            ❌ Failed to update
          </Text>
        );
      default:
        return <Text style={styles.statusText}>Ready</Text>;
    }
  };

  const formattedMemberSince = memberSince
    ? memberSince.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>My Account</Text>

        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full name"
              placeholderTextColor="#aaa"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>User name</Text>
            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
              placeholder="User name"
              placeholderTextColor="#aaa"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity onPress={() => setSecureText((v) => !v)}>
                <Text style={styles.toggleText}>
                  {secureText ? "Show" : "Hide"}
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry={secureText}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Member since</Text>
            <Text style={styles.memberText}>{formattedMemberSince}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.button}
            onPress={startFakeUpdate}
            disabled={progressStatus === "saving"}
          >
            <Text style={styles.buttonText}>
              {progressStatus === "saving" ? "Saving..." : "Update Profile"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statusContainer}>
          {renderStatus()}
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[styles.progressBarFill, { width: progressWidth }]}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa" },
  content: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    color: "#222",
    alignSelf: "center",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "Roboto",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginTop: 40,

    
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  field: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: "600", color: "#555", marginBottom: 6 },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  memberText: {
    fontSize: 16,
    paddingVertical: 10,
    color: "#444",
    fontWeight: "500",
  },
  actions: { marginTop: 20, alignItems: "center" },
  button: {
    backgroundColor: "#1976d2",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  statusContainer: { marginTop: 24 },
  statusRow: { flexDirection: "row", alignItems: "center" },
  statusText: { fontSize: 14, color: "#666", marginLeft: 6 },
  successText: { color: "#2e7d32", fontWeight: "600" },
  errorText: { color: "#c62828", fontWeight: "600" },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 12,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: "#1976d2",
  },
  toggleText: { color: "#1976d2", fontWeight: "600", fontSize: 14 },
});
