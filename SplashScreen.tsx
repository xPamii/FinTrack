import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  StyleSheet,
} from "react-native";
import Svg, { Rect, Path } from "react-native-svg";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


// 🔹 Define navigation type
type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Dashboard: undefined;
};

type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Splash"
>;

type Props = {
  navigation: SplashScreenNavigationProp;
};

const COLORS = {
  blue: "#1E90FF",
  green: "#2ECC71",
  text: "#333333",
  muted: "#666666",
  white: "#FFFFFF",
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Logo */}
      <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>
        <FinTrackLogo size={120} />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        style={[
          styles.title,
          { opacity: fade, transform: [{ translateY: slide }] },
        ]}
      >
        <Text style={{ color: COLORS.blue }}>Fin</Text>
        <Text style={{ color: COLORS.green }}>Track</Text>
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text
        style={[
          styles.tagline,
          { opacity: fade, transform: [{ translateY: slide }] },
        ]}
      >
        Track your money, control your future.
      </Animated.Text>

      {/* CTA Button */}
      <Animated.View
        style={{ width: "100%", opacity: fade, transform: [{ translateY: slide }], marginTop: 36 }}
      >
        <TouchableOpacity
          onPress={() => navigation.replace("Login")}
          activeOpacity={0.9}
          style={styles.button}
        >
          <Text style={styles.buttonText}>GET STARTED</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Footer */}
      <Text style={styles.footer}>v1.0.0</Text>
    </View>
  );
};

export default SplashScreen;

/** 🔹 FinTrack Logo (SVG) */
const FinTrackLogo: React.FC<{ size?: number }> = ({ size = 120 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Wallet body */}
      <Rect x="10" y="25" width="80" height="55" rx="14" fill={COLORS.blue} />
      {/* Wallet lip */}
      <Rect x="20" y="20" width="60" height="8" rx="4" fill={COLORS.blue} opacity={0.9} />
      {/* Upward arrow (growth) */}
      <Path
        d="M25 63 L40 48 L52 58 L72 38"
        stroke={COLORS.green}
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M72 38 L72 50 M72 38 L60 38"
        stroke={COLORS.green}
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    marginTop: 20,
  },
  tagline: {
    color: COLORS.muted,
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
  },
  button: {
    backgroundColor: COLORS.blue,
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.blue,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    color: COLORS.muted,
    fontSize: 12,
  },
});
