import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function WeatherGPTScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MausamMitra AI Assistant</Text>
      <Text style={styles.desc}>Ask any question about weather, crops, tides, or solar generation.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#004586", padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", color: "#ffffff" },
  desc: { fontSize: 14, color: "#00DDE5", marginTop: 8 },
});
