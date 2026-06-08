import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import API from "../services/api";

export default function AdminDashboard() {
  const [tab, setTab] = useState("orders");
  const [bookings, setBookings] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    loadAdmin();
  }, []);

  const loadAdmin = async () => {
    try {
      const b = await API.get("/bookings");
      const p = await API.get("/users/providers");
      setBookings(b.data);
      setProviders(p.data);
    } catch {
      Alert.alert("Error", "Admin data load nahi ho raha");
    }
  };

  const assignProvider = async (bookingId: string, providerId: string) => {
    try {
      await API.put(`/bookings/${bookingId}/assign`, { providerId });
      Alert.alert("Assigned", "Provider ko job assign ho gaya");
      loadAdmin();
    } catch (error: any) {
      Alert.alert("Assign Failed", error.response?.data?.message || "Error");
    }
  };

  const updateRating = async (provider: any, value: number) => {
    try {
      let rating = Number(provider.rating || 4.5) + value;
      if (rating > 5) rating = 5;
      if (rating < 1) rating = 1;

      await API.put(`/users/providers/${provider._id}/rating`, {
        rating: rating.toFixed(1),
      });

      loadAdmin();
    } catch {
      Alert.alert("Error", "Rating update failed");
    }
  };

  const pending = bookings.filter((b) => b.status !== "Completed");
  const completed = bookings.filter((b) => b.status === "Completed");

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

      <Text style={styles.title}>Admin Control</Text>
      <Text style={styles.sub}>Manage orders, providers and system status</Text>

      <View style={styles.tabs}>
        {["orders", "providers", "history"].map((item) => (
          <TouchableOpacity
            key={item}
            style={tab === item ? styles.tabActive : styles.tab}
            onPress={() => setTab(item)}
          >
            <Text style={tab === item ? styles.tabActiveText : styles.tabText}>{item.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {tab === "orders" && (
          <>
            <View style={styles.stats}>
              <View style={styles.statBox}>
                <Text style={styles.statNo}>{pending.length}</Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNo}>{providers.length}</Text>
                <Text style={styles.statLabel}>Providers</Text>
              </View>
            </View>

            {pending.map((b) => (
              <View key={b._id} style={styles.card}>
                <Text style={styles.cardTitle}>{b.serviceTitle}</Text>
                <Text style={styles.text}>Customer: {b.customerName}</Text>
                <Text style={styles.text}>Contact: {b.contactNumber}</Text>
                <Text style={styles.text}>City: {b.city}</Text>
                <Text style={styles.text}>Address: {b.address}</Text>
                <Text style={styles.text}>Payment: {b.paymentMethod} / {b.paymentStatus}</Text>
                <Text style={styles.status}>Status: {b.status}</Text>
                <Text style={styles.text}>Provider: {b.providerName}</Text>

                {b.status === "Pending Admin Approval" && (
                  <>
                    <Text style={styles.assignTitle}>Assign Provider</Text>

                    {providers.map((p) => (
                      <TouchableOpacity
                        key={p._id}
                        style={p.providerStatus === "busy" ? styles.busyProvider : styles.assignBtn}
                        onPress={() => assignProvider(b._id, p._id)}
                        disabled={p.providerStatus === "busy"}
                      >
                        <Text style={styles.assignText}>
                          {p.fullName} — {p.providerStatus || "free"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </>
                )}
              </View>
            ))}
          </>
        )}

        {tab === "providers" && (
          <>
            {providers.map((p) => (
              <View key={p._id} style={styles.providerCard}>
                <Image
                  source={{
                    uri: p.image || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
                  }}
                  style={styles.avatar}
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.providerName}>{p.fullName}</Text>
                  <Text style={styles.text}>Email: {p.email}</Text>
                  <Text style={styles.text}>City: {p.city || "Not added"}</Text>
                  <Text style={p.providerStatus === "busy" ? styles.busy : styles.free}>
                    {p.providerStatus === "busy" ? "Busy on work" : "Free now"}
                  </Text>
                  <Text style={styles.text}>Experience: {p.experience || "Service expert"}</Text>
                  <Text style={styles.text}>Jobs: {p.completedJobs || 0}</Text>
                  <Text style={styles.text}>Earnings: Rs {p.earnings || 0}</Text>

                  <View style={styles.ratingRow}>
                    <TouchableOpacity style={styles.smallBtn} onPress={() => updateRating(p, -0.1)}>
                      <Text style={styles.smallBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.rating}>⭐ {p.rating || 4.5}</Text>
                    <TouchableOpacity style={styles.smallBtn} onPress={() => updateRating(p, 0.1)}>
                      <Text style={styles.smallBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {tab === "history" && (
          <>
            {completed.map((b) => (
              <View key={b._id} style={styles.card}>
                <Text style={styles.cardTitle}>{b.serviceTitle}</Text>
                <Text style={styles.text}>Customer: {b.customerName}</Text>
                <Text style={styles.text}>Provider: {b.providerName}</Text>
                <Text style={styles.text}>Price: Rs {b.price}</Text>
                <Text style={styles.done}>Completed</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, paddingTop: 50 },
  topBar: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  navBtn: { color: "#38bdf8", fontWeight: "900" },
  title: { color: "#fff", fontSize: 32, fontWeight: "900" },
  sub: { color: "#cbd5e1", marginTop: 5, marginBottom: 15 },
  tabs: { flexDirection: "row", gap: 8, marginBottom: 15 },
  tab: { flex: 1, borderWidth: 1, borderColor: "#38bdf8", padding: 11, borderRadius: 14, alignItems: "center" },
  tabActive: { flex: 1, backgroundColor: "#38bdf8", padding: 11, borderRadius: 14, alignItems: "center" },
  tabText: { color: "#38bdf8", fontSize: 11, fontWeight: "900" },
  tabActiveText: { color: "#020617", fontSize: 11, fontWeight: "900" },
  stats: { flexDirection: "row", gap: 10, marginBottom: 15 },
  statBox: { flex: 1, backgroundColor: "rgba(255,255,255,0.12)", padding: 18, borderRadius: 20 },
  statNo: { color: "#38bdf8", fontSize: 28, fontWeight: "900" },
  statLabel: { color: "#fff", marginTop: 5 },
  card: { backgroundColor: "rgba(255,255,255,0.11)", padding: 17, borderRadius: 22, marginBottom: 14 },
  cardTitle: { color: "#fff", fontSize: 20, fontWeight: "900" },
  text: { color: "#cbd5e1", marginTop: 6 },
  status: { color: "#facc15", fontWeight: "900", marginTop: 8 },
  assignTitle: { color: "#fff", fontWeight: "900", marginTop: 15 },
  assignBtn: { backgroundColor: "#38bdf8", padding: 12, borderRadius: 14, marginTop: 10 },
  busyProvider: { backgroundColor: "#64748b", padding: 12, borderRadius: 14, marginTop: 10 },
  assignText: { color: "#020617", fontWeight: "900", textAlign: "center" },
  providerCard: { backgroundColor: "rgba(255,255,255,0.11)", padding: 14, borderRadius: 24, marginBottom: 14, flexDirection: "row", gap: 12 },
  avatar: { width: 75, height: 75, borderRadius: 38 },
  providerName: { color: "#fff", fontSize: 18, fontWeight: "900" },
  free: { color: "#22c55e", fontWeight: "900", marginTop: 6 },
  busy: { color: "#f97316", fontWeight: "900", marginTop: 6 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  smallBtn: { backgroundColor: "#38bdf8", width: 33, height: 33, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  smallBtnText: { color: "#020617", fontSize: 18, fontWeight: "900" },
  rating: { color: "#fff", fontWeight: "900" },
  done: { color: "#22c55e", fontWeight: "900", marginTop: 8 },
});