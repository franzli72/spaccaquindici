import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Tile = ({ value, onPress }) => {

  const tileStyle = () => {
    if (value === 0) {
      return styles.emptyTile;
    } else if (value % 2 === 0) {
      return styles.evenTile;
    } else {
      return styles.oddTile;
    }
  };

  const textStyle = () => {
    if (value % 2 === 0) {
      return styles.evenText;
    } else {
      return styles.oddText;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={tileStyle()}>
      <Text style={textStyle()}>{value === 0 ? "" : value}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  evenTile: {
    backgroundColor: "#FAF3E0",
    margin: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  oddTile: {
    backgroundColor: "red",
    margin: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  emptyTile: {
    // backgroundColor: "white",
    margin: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  evenText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "black",
  },
  oddText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
});

export default Tile;
