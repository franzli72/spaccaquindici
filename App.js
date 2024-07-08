import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Audio } from "expo-av";
import Board from "./Board";

const Game = () => {
  const [tiles, setTiles] = useState([]); // Array to hold tile values
  const [blankTileIndex, setBlankTileIndex] = useState(null); // Index of the empty tile
  const [correctTiles, setCorrectTiles] = useState(0);
  const sound = useRef(new Audio.Sound());

  useEffect(() => {
    // Set the audio mode
    async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error("Error setting audio mode", error);
      }
    };
  });

  // Function to generate random tiles
  const generateTiles = () => {
    const shuffledNumbers = [...Array(16).keys()].sort(
      () => Math.random() - 0.5
    );
    setTiles(shuffledNumbers);
    findBlankTile(shuffledNumbers); // Find the initial empty tile position
    setCorrectTiles(0);
  };

  // Function to find the blank tile index
  const findBlankTile = (newTiles) => {
    const index = newTiles.indexOf(0);
    setBlankTileIndex(index);
  };

  // Function to handle tile press
  const handlePressTile = (index) => {
    // Check if the tile is adjacent to the empty space
    const dx = Math.abs(index - blankTileIndex) % 4;
    const dy = Math.abs(Math.floor(index / 4) - Math.floor(blankTileIndex / 4));
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[blankTileIndex]] = [
        newTiles[blankTileIndex],
        newTiles[index],
      ];
      setTiles(newTiles); // Update state with new tile positions
      setBlankTileIndex(index); // Update empty tile index
      // playSound(0);
      checkWin(newTiles);
    } // Check for win condition after the move
  };

  // Function to check win condition
  const checkWin = (newTiles) => {
    var correctTiles = 0;
    for (let i = 0; i < newTiles.length - 1; i++) {
      if (newTiles[i] == i + 1) {
        correctTiles += 1;
      }
    }
    if (correctTiles >= 15) {
      playSound(1);
    } else {
      playSound(2);
    }
    setCorrectTiles(correctTiles);
    return correctTiles;
  };

  const playSound = async (type) => {
    const sounds = [
      require("./assets/sounds/708605__marevnik__ui_pop_up.mp3"),
      require("./assets/sounds/651464__darcyadam__dca-button-dialogue.wav"),
      require("./assets/sounds/683100__florianreichelt__mutliple-bubbles-bursting.mp3"),
    ];

    // Register the listener
    const onPlaybackStatusUpdate = (status) => {
      console.log("Playback status updated:", status);
    };

    sound.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

    try {
      await sound.current.loadAsync(sounds[type], { shouldPlay: true });
      await sound.current.playAsync();

      // sound.current.setOnPlaybackStatusUpdate(null);
      if (sound.current) {
        await sound.current.unloadAsync();
      }
    } catch (error) {
      console.error("Error in sound playback", error);
    }
  };

  useEffect(() => {
    generateTiles();
  }, []); // Generate tiles on initial render

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={{ alignItems: "center", marginTop: 15 }}>
          <FontAwesome6
            name="hammer"
            size={60}
            color="yellow"
            onPress={() => generateTiles()}
          />
          <Text style={styles.gameTitle}>Break 15</Text>
        </View>
        <Board tiles={tiles} onPressTile={handlePressTile} />
        {correctTiles <= 15 ? (
          <View style={{ alignItems: "center" }}>
            <Text style={styles.correctTilesLabel}>Correct Tiles</Text>
            <Text style={styles.correctTilesValue}>{correctTiles}</Text>
          </View>
        ) : (
          <View style={{ alignItems: "center" }}>
            <Text style={styles.correctTilesLabel}>YOU WON!</Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // This makes the View fill the entire screen
    backgroundColor: "#0f172a", // Set your desired background color here
    alignItems: "center", // Centers the Board component horizontally
    justifyContent: "center", // Centers the Board component vertically
  },
  gameTitle: {
    color: "red",
    fontSize: 64,
    fontWeight: "bold",
    padding: 10,
  },
  correctTilesLabel: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  correctTilesValue: {
    color: "white",
    fontSize: 128,
    fontWeight: "bold",
  },
});

export default Game;
