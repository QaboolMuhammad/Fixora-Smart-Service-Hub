import React, { useState } from "react";
import { Text, StyleSheet, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import API from "../services/api";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/signup", {
        fullName,
        email,
        password,
        role,
      });

      Alert.alert("Success", res.data.message);
      router.push("/login");
    } catch (error: any) {
      Alert.alert("Signup Failed", error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#020617", "#0f172a", "#164e63"]} style={styles.container}>
      <Text style={styles.heading}>Create Account</Text>
      <Text style={styles.sub}>Join Fixora as customer or provider</Text>

      <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#94a3b8" value={fullName} onChangeText={setFullName} />
      <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#94a3b8" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#94a3b8" value={password} onChangeText={setPassword} secureTextEntry />

      <View style={styles.roleBox}>
        <TouchableOpacity style={role === "customer" ? styles.roleActive : styles.roleOutline} onPress={() => setRole("customer")}>
          <Text style={role === "customer" ? styles.roleActiveText : styles.roleOutlineText}>Customer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={role === "provider" ? styles.roleActive : styles.roleOutline} onPress={() => setRole("provider")}>
          <Text style={role === "provider" ? styles.roleActiveText : styles.roleOutlineText}>Provider</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#020617" /> : <Text style={styles.btnText}>Signup</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  heading: { color: "#fff", fontSize: 34, fontWeight: "900", textAlign: "center" },
  sub: { color: "#cbd5e1", textAlign: "center", marginTop: 8, marginBottom: 25 },
  input: {
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  roleBox: { flexDirection: "row", gap: 12, marginBottom: 16 },
  roleActive: { flex: 1, backgroundColor: "#38bdf8", padding: 14, borderRadius: 15, alignItems: "center" },
  roleOutline: { flex: 1, borderWidth: 1, borderColor: "#38bdf8", padding: 14, borderRadius: 15, alignItems: "center" },
  roleActiveText: { color: "#020617", fontWeight: "900" },
  roleOutlineText: { color: "#38bdf8", fontWeight: "900" },
  btn: { backgroundColor: "#38bdf8", padding: 16, borderRadius: 16, alignItems: "center" },
  btnText: { color: "#020617", fontSize: 17, fontWeight: "900" },
  link: { color: "#38bdf8", textAlign: "center", marginTop: 20, fontWeight: "700" },
});