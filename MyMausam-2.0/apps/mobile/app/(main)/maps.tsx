import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MapsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doppler Radar & Weather Maps</Text>
      <Text style={styles.desc}>Active IMD Delhi (Palam) Radar Station - 250km Range</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#004586", padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", color: "#ffffff" },
  desc: { fontSize: 14, color: "#A7C0D6", marginTop: 8 },
});
