import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function WeatherScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detailed Meteorological Forecast</Text>
      <Text style={styles.desc}>7-Day IMD Synoptic Bulletin and Rain Outlook</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#004586", padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", color: "#ffffff" },
  desc: { fontSize: 14, color: "#ffffff", marginTop: 8 },
});
