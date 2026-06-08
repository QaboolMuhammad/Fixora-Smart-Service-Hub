import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import API from "../services/api";

export default function ProviderDashboard() {
  const params = useLocalSearchParams();
  const providerId = String(params.providerId || "");

  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [status, setStatus] = useState("free");

  useEffect(() => {
    if (providerId) {
      loadData();
    }
  }, [providerId]);

  const loadData = async () => {
    try {
      const b = await API.get(`/bookings/provider/${providerId}`);
      const n = await API.get(`/notifications/${providerId}`);
      setBookings(b.data);
      setNotifications(n.data);
    } catch {
      Alert.alert("Error", "Provider data load nahi ho raha");
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      await API.put(`/users/${providerId}/status`, {
        providerStatus: newStatus,
      });
      setStatus(newStatus);
      Alert.alert("Updated", `You are now ${newStatus}`);
    } catch {
      Alert.alert("Error", "Status update failed");
    }
  };

  const completeJob = async (id: string) => {
    try {
      await API.put(`/bookings/${id}/complete`);
      Alert.alert("Completed", "Job complete ho gaya. Status free ho gaya.");
      setStatus("free");
      loadData();
    } catch {
      Alert.alert("Error", "Complete failed");
    }
  };

  return (
    <LinearGradient colors={["#020617", "#0f172a", "#164e63"]} style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.navBtn}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.navBtn}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Provider Panel</Text>
        <Text style={styles.sub}>Assigned jobs and notifications</Text>

        <View style={styles.statusRow}>
          <TouchableOpacity style={status === "free" ? styles.active : styles.statusBtn} onPress={() => updateStatus("free")}>
            <Text style={status === "free" ? styles.activeText : styles.statusText}>Free</Text>
          </TouchableOpacity>
          <TouchableOpacity style={status === "busy" ? styles.active : styles.statusBtn} onPress={() => updateStatus("busy")}>
            <Text style={status === "busy" ? styles.activeText : styles.statusText}>Busy</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.section}>Notifications</Text>
        {notifications.length === 0 ? <Text style={styles.empty}>No notifications yet</Text> : null}

        {notifications.map((n) => (
          <View key={n._id} style={styles.card}>
            <Text style={styles.cardTitle}>🔔 {n.title}</Text>
            <Text style={styles.text}>{n.message}</Text>
          </View>
        ))}

        <Text style={styles.section}>My Orders</Text>
        {bookings.length === 0 ? <Text style={styles.empty}>No assigned orders</Text> : null}

        {bookings.map((b) => (
          <View key={b._id} style={styles.card}>
            <Text style={styles.cardTitle}>{b.serviceTitle}</Text>
            <Text style={styles.text}>Customer: {b.customerName}</Text>
            <Text style={styles.text}>Contact: {b.contactNumber}</Text>
            <Text style={styles.text}>Address: {b.address}</Text>
            <Text style={styles.text}>Payment: {b.paymentMethod} / {b.paymentStatus}</Text>
            <Text style={styles.status}>Status: {b.status}</Text>

            {b.status !== "Completed" && (
              <TouchableOpacity style={styles.completeBtn} onPress={() => completeJob(b._id)}>
                <Text style={styles.completeText}>Mark Completed</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  topBar: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  navBtn: { color: "#38bdf8", fontWeight: "900" },
  title: { color: "#fff", fontSize: 34, fontWeight: "900" },
  sub: { color: "#cbd5e1", marginBottom: 18 },
  statusRow: { flexDirection: "row", gap: 10 },
  statusBtn: { flex: 1, borderWidth: 1, borderColor: "#38bdf8", padding: 14, borderRadius: 16, alignItems: "center" },
  active: { flex: 1, backgroundColor: "#38bdf8", padding: 14, borderRadius: 16, alignItems: "center" },
  statusText: { color: "#38bdf8", fontWeight: "900" },
  activeText: { color: "#020617", fontWeight: "900" },
  section: { color: "#fff", fontSize: 22, fontWeight: "900", marginVertical: 16 },
  empty: { color: "#94a3b8", marginBottom: 10 },
  card: { backgroundColor: "rgba(255,255,255,0.11)", padding: 18, borderRadius: 22, marginBottom: 14 },
  cardTitle: { color: "#fff", fontSize: 18, fontWeight: "900" },
  text: { color: "#cbd5e1", marginTop: 6 },
  status: { color: "#facc15", fontWeight: "900", marginTop: 8 },
  completeBtn: { backgroundColor: "#22c55e", padding: 14, borderRadius: 16, marginTop: 12, alignItems: "center" },
  completeText: { color: "#020617", fontWeight: "900" },
});