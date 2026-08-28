import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

export default function IndexScreen() {
  const [temp] = useState(28.5);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.location}>Ghaziabad</Text>
        <Text style={styles.state}>Uttar Pradesh • India</Text>
        <Text style={styles.temp}>{temp}°C</Text>
        <Text style={styles.condition}>Partly Cloudy</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Air Quality Index</Text>
        <Text style={styles.aqi}>142 AQI • Moderate</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>IMD Doppler Radar Alert</Text>
        <Text style={styles.alert}>Convective cloud clusters moving ENE.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004586",
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginVertical: 32,
  },
  location: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
  },
  state: {
    fontSize: 14,
    color: "#A7C0D6",
    marginTop: 2,
  },
  temp: {
    fontSize: 54,
    fontWeight: "bold",
    color: "#FFBE00",
    marginTop: 8,
  },
  condition: {
    fontSize: 16,
    color: "#ffffff",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A7C0D6",
    textTransform: "uppercase",
  },
  aqi: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFBE00",
    marginTop: 4,
  },
  alert: {
    fontSize: 14,
    color: "#ffffff",
    marginTop: 4,
  },
});
