import React from "react";
import {

View,
Text,
StyleSheet,
ScrollView,
Image,
TouchableOpacity,
Linking,
Alert,
Platform,
} from "react-native";

const APP_NAME = "FinTrack";
const APP_VERSION = "1.0.0";
const COMPANY = "FinTrack Inc.";
const SUPPORT_EMAIL = "support@fintrack.com";
const PRIVACY_URL = "https://www.fintrack.com/privacy";
const TERMS_URL = "https://www.fintrack.com/terms";

/**
 * AboutUs screen for the FinTrack expense app.
 * - Shows app title, description, version, contact and legal links.
 * - Uses simple components only (no external dependencies).
 */

const AboutUs: React.FC = () => {
const openLink = async (url: string) => {
    try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert("Unable to open link", url);
        }
    } catch (err) {
        Alert.alert("Error", "Failed to open link.");
    }
};

const sendEmail = async (to: string, subject = `${APP_NAME} Support`) => {
    const mailUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}`;
    try {
        const supported = await Linking.canOpenURL(mailUrl);
        if (supported) {
            await Linking.openURL(mailUrl);
        } else {
            Alert.alert("Unable to open mail client");
        }
    } catch {
        Alert.alert("Error", "Failed to open mail client");
    }
};

return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
            {/* Simple placeholder logo; replace with Image source if you have one */}
            <View style={styles.logo}>
                <Image
                    source={require("../assets/finTrackLogo.png")}
                    style={{ width: 80, height: 80, borderRadius: 18 }}
                    resizeMode="cover"
                    accessibilityLabel={`${APP_NAME} logo`}
                />
            </View>
            <View style={styles.titleBox}>
                <Text style={styles.title}>{APP_NAME}</Text>
                <Text style={styles.subtitle}>Personal expense tracker</Text>
            </View>
        </View>

        <View style={styles.card}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.paragraph}>
                FinTrack helps you monitor daily expenses, set budgets, and visualize
                spending trends. Designed to be fast, private, and easy to use.
            </Text>

            <Text style={styles.meta}>
                Version: <Text style={styles.metaValue}>{APP_VERSION}</Text>
            </Text>
            <Text style={styles.meta}>
                Company: <Text style={styles.metaValue}>{COMPANY}</Text>
            </Text>
        </View>

        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <TouchableOpacity
                style={styles.linkRow}
                onPress={() => sendEmail(SUPPORT_EMAIL)}
            >
                <Text style={styles.linkLabel}>Support</Text>
                <Text style={styles.linkValue}>{SUPPORT_EMAIL}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.linkRow}
                onPress={() => openLink(PRIVACY_URL)}
            >
                <Text style={styles.linkLabel}>Privacy Policy</Text>
                <Text style={styles.linkValue}>View</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkRow} onPress={() => openLink(TERMS_URL)}>
                <Text style={styles.linkLabel}>Terms of Service</Text>
                <Text style={styles.linkValue}>View</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Credits</Text>
            <Text style={styles.paragraph}>
                Built with React Native. Icons and illustrations are placeholders —
                replace them with your assets or attributions if needed.
            </Text>
        </View>

        <Text style={styles.footer}>© {new Date().getFullYear()} {COMPANY}</Text>
    </ScrollView>
);
};

const styles = StyleSheet.create({
container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#F7F9FC",
    flexGrow: 1,
    
},
header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
        marginTop: 50,
},
logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: "#1E88E5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    ...Platform.select({
        ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
        },
        android: {
            elevation: 4,
        },
    }),
},
logoText: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
},
titleBox: {
    flex: 1,
},
title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A202C",
},
subtitle: {
    fontSize: 13,
    color: "#4A5568",
    marginTop: 2,
},
card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    ...Platform.select({
        ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
        },
        android: {
            elevation: 2,
        },
    }),
},
sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#2D3748",
},
paragraph: {
    fontSize: 14,
    color: "#4A5568",
    lineHeight: 20,
},
meta: {
    marginTop: 10,
    fontSize: 13,
    color: "#718096",
},
metaValue: {
    color: "#2D3748",
    fontWeight: "600",
},
linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    alignItems: "center",
},
linkLabel: {
    fontSize: 15,
    color: "#2B6CB0",
    fontWeight: "600",
},
linkValue: {
    fontSize: 13,
    color: "#4A5568",
},
footer: {
    textAlign: "center",
    color: "#94A3B8",
    marginTop: 20,
    fontSize: 13,
},
});

export default AboutUs;