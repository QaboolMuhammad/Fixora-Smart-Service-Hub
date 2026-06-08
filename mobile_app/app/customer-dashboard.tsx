import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import API from "../services/api";

export default function CustomerDashboard() {
  const [city, setCity] = useState("Karachi");
  const [services, setServices] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [confirmation, setConfirmation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  useEffect(() => {
    loadServices();
  }, [city]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/services?city=${city}`);
      setServices(res.data);
    } catch {
      Alert.alert("Error", "Services load nahi ho rahi");
    } finally {
      setLoading(false);
    }
  };

  const openBooking = (service: any) => {
    setSelectedService(service);
    setModal(true);
  };

  const bookNow = async () => {
    if (!customerName || !contactNumber || !address) {
      Alert.alert("Missing Info", "Name, contact number aur address required hain");
      return;
    }

    try {
      const res = await API.post("/bookings", {
        customerName,
        contactNumber,
        city,
        address,
        serviceTitle: selectedService.title,
        serviceImage: selectedService.image,
        price: selectedService.price,
        paymentMethod,
      });

      setModal(false);
      setConfirmation(res.data.booking);
      setCustomerName("");
      setContactNumber("");
      setAddress("");
    } catch (error: any) {
      Alert.alert("Booking Failed", error.response?.data?.message || "Error");
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
        <Text style={styles.title}>Fixora</Text>
        <Text style={styles.sub}>Book trusted home services. Admin will assign a provider.</Text>

        <View style={styles.cityRow}>
          {["Karachi", "Islamabad"].map((item) => (
            <TouchableOpacity
              key={item}
              style={city === item ? styles.cityActive : styles.cityBtn}
              onPress={() => setCity(item)}
            >
              <Text style={city === item ? styles.cityActiveText : styles.cityText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? <ActivityIndicator color="#38bdf8" size="large" /> : null}

        {services.map((service) => (
          <View key={service._id} style={styles.card}>
            <Image source={{ uri: service.image }} style={styles.image} />
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.desc}>{service.description}</Text>
            <Text style={styles.price}>Rs {service.price}</Text>

            <View style={styles.infoBox}>
              <Text style={styles.info}>📍 Available in {service.city}</Text>
              <Text style={styles.info}>🛠 Category: {service.category}</Text>
              <Text style={styles.info}>✅ Admin will assign best available provider</Text>
            </View>

            <TouchableOpacity style={styles.bookBtn} onPress={() => openBooking(service)}>
              <Text style={styles.bookText}>Book Service</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal visible={modal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirm Booking</Text>
            <Text style={styles.selected}>{selectedService?.title}</Text>

            <TextInput style={styles.input} placeholder="Your Name" placeholderTextColor="#94a3b8" value={customerName} onChangeText={setCustomerName} />
            <TextInput style={styles.input} placeholder="Contact Number" placeholderTextColor="#94a3b8" value={contactNumber} onChangeText={setContactNumber} keyboardType="phone-pad" />
            <TextInput style={[styles.input, { height: 80 }]} placeholder="House Address" placeholderTextColor="#94a3b8" value={address} onChangeText={setAddress} multiline />

            <View style={styles.cityRow}>
              {["Cash", "Online"].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={paymentMethod === item ? styles.cityActive : styles.cityBtn}
                  onPress={() => setPaymentMethod(item)}
                >
                  <Text style={paymentMethod === item ? styles.cityActiveText : styles.cityText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.confirmBtn} onPress={bookNow}>
              <Text style={styles.confirmText}>Send to Admin</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModal(false)}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={!!confirmation} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.done}>🎉 Request Sent</Text>
            <Text style={styles.confirmLine}>Service: {confirmation?.serviceTitle}</Text>
            <Text style={styles.confirmLine}>City: {confirmation?.city}</Text>
            <Text style={styles.confirmLine}>Payment: {confirmation?.paymentMethod}</Text>
            <Text style={styles.confirmLine}>Status: {confirmation?.status}</Text>

            <TouchableOpacity style={styles.confirmBtn} onPress={() => setConfirmation(null)}>
              <Text style={styles.confirmText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, paddingTop: 50 },
  topBar: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  navBtn: { color: "#38bdf8", fontWeight: "900", fontSize: 15 },
  title: { color: "#fff", fontSize: 42, fontWeight: "900" },
  sub: { color: "#cbd5e1", marginBottom: 18, marginTop: 5 },
  cityRow: { flexDirection: "row", gap: 10, marginBottom: 15 },
  cityBtn: { flex: 1, borderWidth: 1, borderColor: "#38bdf8", padding: 13, borderRadius: 16, alignItems: "center" },
  cityActive: { flex: 1, backgroundColor: "#38bdf8", padding: 13, borderRadius: 16, alignItems: "center" },
  cityText: { color: "#38bdf8", fontWeight: "900" },
  cityActiveText: { color: "#020617", fontWeight: "900" },
  card: { backgroundColor: "rgba(255,255,255,0.11)", padding: 15, borderRadius: 28, marginBottom: 20 },
  image: { width: "100%", height: 185, borderRadius: 24 },
  serviceTitle: { color: "#fff", fontSize: 24, fontWeight: "900", marginTop: 13 },
  desc: { color: "#cbd5e1", marginTop: 8, lineHeight: 21 },
  price: { color: "#38bdf8", fontSize: 20, fontWeight: "900", marginTop: 10 },
  infoBox: { backgroundColor: "rgba(2,6,23,0.45)", padding: 13, borderRadius: 18, marginTop: 13 },
  info: { color: "#e2e8f0", marginBottom: 5 },
  bookBtn: { backgroundColor: "#38bdf8", padding: 16, borderRadius: 18, alignItems: "center", marginTop: 15 },
  bookText: { color: "#020617", fontWeight: "900" },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.78)", justifyContent: "center", padding: 18 },
  modalBox: { backgroundColor: "#0f172a", padding: 22, borderRadius: 28 },
  modalTitle: { color: "#fff", fontSize: 25, fontWeight: "900", textAlign: "center" },
  selected: { color: "#38bdf8", textAlign: "center", marginVertical: 13, fontWeight: "900" },
  input: { backgroundColor: "rgba(255,255,255,0.10)", color: "#fff", padding: 14, borderRadius: 14, marginBottom: 12 },
  confirmBtn: { backgroundColor: "#38bdf8", padding: 15, borderRadius: 16, alignItems: "center" },
  confirmText: { color: "#020617", fontWeight: "900" },
  cancel: { color: "#fff", textAlign: "center", marginTop: 15 },
  done: { color: "#38bdf8", fontSize: 26, fontWeight: "900", textAlign: "center", marginBottom: 15 },
  confirmLine: { color: "#fff", marginBottom: 8 },
});