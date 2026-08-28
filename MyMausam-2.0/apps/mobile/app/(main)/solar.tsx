import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SolarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rooftop Solar PV Estimator</Text>
      <Text style={styles.desc}>Estimated Daily Yield: 10.6 kWh (~₹2,385/mo savings)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#004586", padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", color: "#ffffff" },
  desc: { fontSize: 14, color: "#FFBE00", marginTop: 8 },
});
