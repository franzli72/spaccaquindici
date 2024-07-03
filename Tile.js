import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Tile = ({ value, onPress }) => (
  <TouchableOpacity onPress={onPress} style={value === 0 ? styles.emptyTile : styles.tile}>
    <Text style={styles.text}>{value === 0 ? "" : value}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  tile: {
    backgroundColor: "orange",
    margin: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70, 
    borderRadius: 10,
  },
  emptyTile: {
    // backgroundColor: "orange",
    margin: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70, 
    borderRadius: 10,
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
});

export default Tile;
