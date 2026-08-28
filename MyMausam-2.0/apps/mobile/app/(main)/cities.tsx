import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CitiesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cities & Weather Stations</Text>
      <Text style={styles.item}>Ghaziabad • 28.5°C</Text>
      <Text style={styles.item}>Delhi • 29.2°C</Text>
      <Text style={styles.item}>Mumbai • 31.0°C</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#004586", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#ffffff", marginBottom: 16 },
  item: { fontSize: 16, color: "#ffffff", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)" },
});
