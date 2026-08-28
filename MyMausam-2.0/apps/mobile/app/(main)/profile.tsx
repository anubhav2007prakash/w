import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile & Persona</Text>
      <Text style={styles.desc}>Active Persona: Health & Allergy Sensitive</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#004586", padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", color: "#ffffff" },
  desc: { fontSize: 14, color: "#8ED329", marginTop: 8 },
});
