import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Audio } from 'expo-av';
import Board from "./Board";

const Game = () => {
  const [tiles, setTiles] = useState([]); // Array to hold tile values
  const [blankTileIndex, setBlankTileIndex] = useState(null); // Index of the empty tile
  const [correctTiles, setCorrectTiles] = useState(0);

  // Function to generate random tiles
  const generateTiles = () => {
    const shuffledNumbers = [...Array(16).keys()].sort(
      () => Math.random() - 0.5,
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
    for (let i = 0; i< newTiles.length - 1; i++) {
      if (newTiles[i] == i+1) {
        correctTiles += 1;
      }
    }
    setCorrectTiles(correctTiles);
    return correctTiles;
  };

  const playSound = async (type) => {
    // Initialize the sound

    const sounds = [
      './assets/sounds/708605__marevnik__ui_pop_up.mp3',
      './assets/sounds/651464__darcyadam__dca-button-dialogue.wav',
      './assets/sounds/683100__florianreichelt__mutliple-bubbles-bursting.mp3',
    ];

    console.log(sounds[type]);

    const sound = new Audio.Sound();
    try {
      await sound.loadAsync(sounds[type]);
      await sound.playAsync();
      await sound.unloadAsync();
    } catch (error) {
      console.error('Error in sound playback', error)
    }
  }

  useEffect(() => {
    generateTiles();
  }, []); // Generate tiles on initial render

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={{ alignItems: 'center', marginTop: 15 }}>
          <FontAwesome6 name="hammer" size={60} color="yellow" onPress={() => (generateTiles())} />
          <Text style={styles.gameTitle}>SPACCA QUINDICI</Text>
        </View>
        <Board tiles={tiles} onPressTile={handlePressTile} />
        {correctTiles <= 5 ? (
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.correctTilesLabel}>Correct Tiles</Text>
            <Text style={styles.correctTilesValue}>{correctTiles}</Text>
          </View>
        ) : (
          <View style={{ alignItems: 'center' }}>
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
    backgroundColor: '#0f172a', // Set your desired background color here
    alignItems: 'center', // Centers the Board component horizontally
    justifyContent: 'center', // Centers the Board component vertically
  },
  gameTitle: {
    color: 'red',
    fontSize: 32,
    fontWeight: 'bold',
    padding: 10,
  },
  correctTilesLabel: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  correctTilesValue: {
    color: 'white',
    fontSize: 128,
    fontWeight: 'bold',
  }
});

export default Game;
