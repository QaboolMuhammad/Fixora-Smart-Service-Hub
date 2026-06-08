import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", { email, password });

      if (res.data.user.role === "admin") {
        router.replace("/admin-dashboard");
      } else if (res.data.user.role === "provider") {
        router.replace({
          pathname: "/provider-dashboard",
          params: { providerId: res.data.user.id },
        });
      } else {
        router.replace("/customer-dashboard");
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#020617", "#0f172a", "#164e63"]} style={styles.container}>
      <Text style={styles.heading}>Welcome Back</Text>
      <Text style={styles.sub}>Login to continue using Fixora</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#94a3b8"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#94a3b8"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {errorMsg ? <Text style={styles.errorBox}>{errorMsg}</Text> : null}

      <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#020617" /> : <Text style={styles.btnText}>Login</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}>Don't have an account? Signup</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  heading: { color: "#fff", fontSize: 36, fontWeight: "900", textAlign: "center" },
  sub: { color: "#cbd5e1", textAlign: "center", marginTop: 8, marginBottom: 30 },
  input: {
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#fff",
    padding: 17,
    borderRadius: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  errorBox: {
    backgroundColor: "rgba(239,68,68,0.18)",
    color: "#fecaca",
    padding: 12,
    borderRadius: 14,
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "800",
  },
  btn: {
    backgroundColor: "#38bdf8",
    padding: 17,
    borderRadius: 18,
    alignItems: "center",
  },
  btnText: { color: "#020617", fontSize: 17, fontWeight: "900" },
  link: { color: "#38bdf8", textAlign: "center", marginTop: 22, fontWeight: "900" },
});