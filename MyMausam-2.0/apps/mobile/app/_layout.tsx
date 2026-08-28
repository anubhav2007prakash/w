import React from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import IndexScreen from "./(main)/index";

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <IndexScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0055A6",
  },
});
