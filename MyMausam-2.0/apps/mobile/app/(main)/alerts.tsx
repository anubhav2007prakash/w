import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AlertsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Weather Alerts</Text>
      <View style={styles.alertCard}>
        <Text style={styles.alertType}>Thunderstorm with Squall</Text>
        <Text style={styles.desc}>Yellow Alert (Be Updated) for Delhi NCR.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#004586", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#ffffff", marginBottom: 16 },
  alertCard: { backgroundColor: "rgba(255, 190, 0, 0.2)", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#FFBE00" },
  alertType: { fontSize: 16, fontWeight: "bold", color: "#FFBE00" },
  desc: { fontSize: 14, color: "#ffffff", marginTop: 4 },
});
