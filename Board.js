import React from "react";
import { View, StyleSheet } from "react-native";
import Tile from "./Tile";

const Board = ({ tiles, onPressTile }) => {
  const boardSize = Math.sqrt(tiles.length); // Assuming a square board
  const rows = [];
  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) {
      const index = i * boardSize + j;
      row.push(
        <Tile
          key={index}
          value={tiles[index]}
          onPress={() => onPressTile(index)}
        />,
      );
    }
    rows.push(
      <View key={i} style={styles.row}>
        {row}
      </View>,
    );
  }
  return <View style={styles.board}>{rows}</View>;
};

const styles = StyleSheet.create({
  board: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
  },
});

export default Board;
