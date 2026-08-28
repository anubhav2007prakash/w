import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function EnergyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mission LiFE Energy Optimization</Text>
      <Text style={styles.desc}>Optimal solar consumption window: 11:30 AM - 03:00 PM</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#004586", padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", color: "#ffffff" },
  desc: { fontSize: 14, color: "#FFBE00", marginTop: 8 },
});
