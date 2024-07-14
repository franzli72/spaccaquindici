import React from "react";
import { Dimensions, Text, TouchableOpacity, StyleSheet } from "react-native";

const tileColors = [
  { id: 0, backgroundColor: "black", color: "black" },
  { id: 1, backgroundColor: "red", color: "white" },
  { id: 2, backgroundColor: "white", color: "red" },
  { id: 3, backgroundColor: "red", color: "white" },
  { id: 4, backgroundColor: "white", color: "red" },
  { id: 5, backgroundColor: "white", color: "red" },
  { id: 6, backgroundColor: "red", color: "white" },
  { id: 7, backgroundColor: "white", color: "red" },
  { id: 8, backgroundColor: "red", color: "white" },
  { id: 9, backgroundColor: "red", color: "white" },
  { id: 10, backgroundColor: "white", color: "red" },
  { id: 11, backgroundColor: "red", color: "white" },
  { id: 12, backgroundColor: "white", color: "red" },
  { id: 13, backgroundColor: "red", color: "white" },
  { id: 14, backgroundColor: "white", color: "red" },
  { id: 15, backgroundColor: "red", color: "white" },
]
const Tile = ({ value, onPress }) => {
  const {fontScale} = Dimensions.get('window');
  const styles = makeStyles(fontScale);

  const tileStyle = () => {
    if (value === 0) {
      return styles.emptyTile;
    } else {
      return [styles.tile, {backgroundColor: tileColors[value].backgroundColor}];
    }
  };

  const textStyle = () => {
      return [styles.text, {color: tileColors[value].color}];
  };

  return (
    <TouchableOpacity onPress={onPress} style={tileStyle()}>
      <Text style={textStyle()}>{value === 0 ? "" : value}</Text>
    </TouchableOpacity>
  );
};

const makeStyles = fontScale => StyleSheet.create({
  tile: {
    backgroundColor: "#FAF3E0",
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
  text: {
    fontSize: 36 / fontScale,
    fontWeight: "bold",
    color: "black",
  },
  
});

export default Tile;
