import React, { useEffect, useRef } from "react";
import { Text, StyleSheet, TouchableOpacity, Animated, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function WelcomeScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(70)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={["#020617", "#0f172a", "#164e63"]} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: slide }] }]}>
        <Text style={styles.logo}>Fixora</Text>
        <Text style={styles.title}>Smart Service Hub</Text>
        <Text style={styles.desc}>
          Book trusted services like electrician, plumber, cleaning, tutor and home repair from one smart mobile app.
        </Text>

        <TouchableOpacity style={styles.btn} onPress={() => router.push("/login")}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineBtn} onPress={() => router.push("/signup")}>
          <Text style={styles.outlineText}>Create Account</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  card: {
    backgroundColor: "rgba(255,255,255,0.10)",
    padding: 28,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
  },
  logo: { color: "#38bdf8", fontSize: 52, fontWeight: "900", textAlign: "center" },
  title: { color: "#fff", fontSize: 24, fontWeight: "800", textAlign: "center", marginTop: 8 },
  desc: { color: "#cbd5e1", textAlign: "center", lineHeight: 23, marginTop: 18, marginBottom: 35 },
  btn: { backgroundColor: "#38bdf8", padding: 16, borderRadius: 18, alignItems: "center", marginBottom: 14 },
  btnText: { color: "#020617", fontSize: 17, fontWeight: "900" },
  outlineBtn: { borderWidth: 1, borderColor: "#38bdf8", padding: 16, borderRadius: 18, alignItems: "center" },
  outlineText: { color: "#38bdf8", fontSize: 17, fontWeight: "900" },
});