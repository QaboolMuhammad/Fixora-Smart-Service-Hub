import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";

export default function ProviderProfile() {
  const p: any = useLocalSearchParams();

  return (
    <LinearGradient colors={["#020617", "#0f172a", "#164e63"]} style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>{p.providerName}</Text>
        <Text style={styles.badge}>{p.providerStatus === "busy" ? "Busy" : "Free Now"}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Experience</Text>
          <Text style={styles.text}>{p.experience || p.providerExperience}</Text>

          <Text style={styles.label}>Completed Jobs</Text>
          <Text style={styles.text}>{p.completedJobs}</Text>

          <Text style={styles.label}>Earnings</Text>
          <Text style={styles.text}>Rs {p.earnings}</Text>

          <Text style={styles.label}>Rating</Text>
          <Text style={styles.text}>⭐ {p.rating}</Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, paddingTop: 60 },
  title: { color: "#fff", fontSize: 34, fontWeight: "900" },
  badge: { color: "#22c55e", fontSize: 18, fontWeight: "900", marginVertical: 15 },
  card: { backgroundColor: "rgba(255,255,255,0.10)", padding: 22, borderRadius: 28 },
  label: { color: "#38bdf8", fontWeight: "900", marginTop: 14 },
  text: { color: "#fff", marginTop: 5, lineHeight: 22 },
  btn: { backgroundColor: "#38bdf8", padding: 16, borderRadius: 18, marginTop: 25, alignItems: "center" },
  btnText: { color: "#020617", fontWeight: "900" },
});