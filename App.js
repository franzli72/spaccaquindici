import React, { useState, useEffect, useRef } from "react";
import { Image, Text, View, StyleSheet, SafeAreaView } from "react-native";
import { useFonts } from "expo-font";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Audio } from "expo-av";
import Board from "./Board";
import { AnimatedPressable } from "./AnimatedPressable";

const backgrounds = [
  { id: 0, image: require("./assets/backgrounds/0.png") },
  { id: 1, image: require("./assets/backgrounds/1.png") },
  { id: 2, image: require("./assets/backgrounds/2.png") },
  { id: 3, image: require("./assets/backgrounds/3.png") },
  { id: 4, image: require("./assets/backgrounds/4.png") },
];

const vividColors = [
  {
    name: "Red",
    hex: "#FF0000",
    rgb: "rgb(255, 0, 0)",
    contrast: "rgba(0, 0, 0, 0.5)",
  },
  {
    name: "Orange",
    hex: "#FFA500",
    rgb: "rgb(255, 165, 0)",
    contrast: "rgba(0, 0, 0, 0.5)",
  },
  {
    name: "Yellow",
    hex: "#FFFF00",
    rgb: "rgb(255, 255, 0)",
    contrast: "rgba(0, 0, 0, 0.5)",
  },
  {
    name: "Lime",
    hex: "#00FF00",
    rgb: "rgb(0, 255, 0)",
    contrast: "rgba(0, 0, 0, 0.5)",
  },
  {
    name: "Green",
    hex: "#008000",
    rgb: "rgb(0, 128, 0)",
    contrast: "rgba(255, 255, 255, 0.5)",
  },
  {
    name: "Cyan",
    hex: "#00FFFF",
    rgb: "rgb(0, 255, 255)",
    contrast: "rgba(0, 0, 0, 0.5)",
  },
  {
    name: "Blue",
    hex: "#0000FF",
    rgb: "rgb(0, 0, 255)",
    contrast: "rgba(255, 255, 255, 0.5)",
  },
  {
    name: "Magenta",
    hex: "#FF00FF",
    rgb: "rgb(255, 0, 255)",
    contrast: "rgba(0, 0, 0, 0.5)",
  },
  {
    name: "Purple",
    hex: "#800080",
    rgb: "rgb(128, 0, 128)",
    contrast: "rgba(255, 255, 255, 0.5)",
  },
  {
    name: "Pink",
    hex: "#FF1493",
    rgb: "rgb(255, 20, 147)",
    contrast: "rgba(0, 0, 0, 0.5)",
  },
  {
    name: "Deep Pink",
    hex: "#FF1493",
    rgb: "rgb(255, 20, 147)",
    contrast: "rgba(0, 0, 0, 0.5)",
  },
  {
    name: "Gold",
    hex: "#FFD700",
    rgb: "rgb(255, 215, 0)",
    contrast: "rgba(0, 0, 0, 0.5)",
  },
  {
    name: "Hot Pink",
    hex: "#FF69B4",
    rgb: "rgb(255, 105, 180)",
    contrast: "rgba(0, 0, 0, 0.5)",
  },
  {
    name: "Dark Orange",
    hex: "#FF8C00",
    rgb: "rgb(255, 140, 0)",
    contrast: "rgba(0, 0, 0, 0.5)",
  },
  {
    name: "Spring Green",
    hex: "#00FF7F",
    rgb: "rgb(0, 255, 127)",
    contrast: "rgba(0, 0, 0, 0.5)",
  },
  {
    name: "Deep Sky Blue",
    hex: "#00BFFF",
    rgb: "rgb(0, 191, 255)",
    contrast: "rgba(0, 0, 0, 0.5)",
  },
  {
    name: "Dodger Blue",
    hex: "#1E90FF",
    rgb: "rgb(30, 144, 255)",
    contrast: "rgba(0, 0, 0, 0.5)",
  },
  {
    name: "Light Sea Green",
    hex: "#20B2AA",
    rgb: "rgb(32, 178, 170)",
    contrast: "rgba(0, 0, 0, 0.5)",
  },
  {
    name: "Medium Violet Red",
    hex: "#C71585",
    rgb: "rgb(199, 21, 133)",
    contrast: "rgba(0, 0, 0, 0.5)",
  },
  {
    name: "Dark Violet",
    hex: "#9400D3",
    rgb: "rgb(148, 0, 211)",
    contrast: "rgba(255, 255, 255, 0.5)",
  },
];

const Game = () => {
  const [tiles, setTiles] = useState([]); // Array to hold tile values
  const [blankTileIndex, setBlankTileIndex] = useState(null); // Index of the empty tile
  const [correctTiles, setCorrectTiles] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState(backgrounds[0].image);
  const [titleColor, setTitleColor] = useState(vividColors[0].rgb);
  const [titleBackgroundColor, setTitleBackgroundColor] = useState(
    vividColors[0].contrast
  );
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const sound = useRef(new Audio.Sound());
  const intervalRef = useRef(null);

  const [fontsLoaded, fontError] = useFonts({
    BubbleFont: require("./assets/fonts/BubbleFont.ttf"),
  });

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

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimer((prevTime) => prevTime + 10); // Increase by 10 milliseconds
      }, 10);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Function to generate random tiles
  const generateTiles = () => {
    const shuffledNumbers = [...Array(16).keys()].sort(
      () => Math.random() - 0.5
    );
    setTiles(shuffledNumbers);
    findBlankTile(shuffledNumbers); // Find the initial empty tile position
    setCorrectTiles(0);

    const imageRandomIndex = Math.floor(Math.random() * backgrounds.length);
    setBackgroundImage(backgrounds[imageRandomIndex].image);

    const titleColorsIndex = Math.floor(Math.random() * vividColors.length);
    setTitleColor(vividColors[titleColorsIndex].rgb);
    setTitleBackgroundColor(vividColors[titleColorsIndex].contrast);

    setTimer(0);
    setIsRunning(true);
    checkWin(tiles);
    playSound(2);
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
      setIsRunning(false);
      playSound(1);
    } else {
      playSound(0);
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

    const sound = new Audio.Sound();
    try {
      await sound.unloadAsync();
      await sound.loadAsync(sounds[type], {shouldPlay: true});
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (error) {
      console.error(error)
    }


  };

  useEffect(() => {
    generateTiles();
  }, []); // Generate tiles on initial render

  const ControlButtons = () => {
    return (
      <View style={styles.buttonWrapper}>
        <AnimatedPressable onPress={() => generateTiles()}>
          <View style={[styles.buttonContainer, { backgroundColor: "red" }]}>
            <FontAwesome6 size={32} name="repeat" color="white" />
          </View>
        </AnimatedPressable>
      </View>
    );
  };

  const formatTime = (time) => {
    const seconds = Math.floor(time / 1000);
    const milliseconds = time % 1000;
    return `${seconds}.${
      milliseconds < 100 ? `0${milliseconds}` : milliseconds
    }`;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Image
          source={backgroundImage}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={{ alignItems: "center", marginTop: 15 }}>
          <AnimatedPressable onPress={generateTiles}>
            <Text
              style={[
                styles.gameTitle,
                { color: titleColor, backgroundColor: titleBackgroundColor },
              ]}
            >
              Break 15
            </Text>
          </AnimatedPressable>
        </View>
        <View style={{ alignItems: "center", marginTop: 15 }}>
            <Text
              style={[
                styles.gameTimer,
                { color: titleColor, backgroundColor: titleBackgroundColor },
              ]}
            >
              {formatTime(timer)}
              </Text>
        </View>
        <View style={styles.topOfBackground}>
          <Board tiles={tiles} onPressTile={handlePressTile} />
        </View>
        {correctTiles <= 15 ? (
          <View style={{ alignItems: "center" }}>
            {/* <Text style={styles.correctTilesLabel}>Correct Tiles</Text> */}
            <Text style={[styles.correctTilesValue, { color:vividColors[correctTiles].hex}]}>{correctTiles}</Text>
          </View>
        ) : (
          <View style={{ alignItems: "center" }}>
            <Text style={[styles.correctTilesLabel, { color:vividColors[correctTiles].hex}]}>WON!</Text>
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
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  topOfBackground: {
    flex: 1,
    padding: 20,
    margin: 20,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional translucent background
    // backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  gameTitle: {
    fontWeight: "bold", // Makes the text fat
    fontFamily: "BubbleFont",
    fontSize: 72, // Adjust size as needed
    // color: '#ff0000',            // Text color
    color: "#0000ff", // Text color
    // backgroundColor: '#007bff',  // Background color
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    borderRadius: 25, // Rounded corners
    textAlign: "center", // Center the text
    overflow: "hidden", // Ensures the border radius is applied correctly
  },

  gameTimer: {
    fontWeight: "bold", // Makes the text fat
    fontFamily: "BubbleFont",
    fontSize: 24, // Adjust size as needed
    // color: '#ff0000',            // Text color
    color: "#0000ff", // Text color
    // backgroundColor: '#007bff',  // Background color
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    borderRadius: 25, // Rounded corners
    textAlign: "center", // Center the text
    overflow: "hidden", // Ensures the border radius is applied correctly
    width: 180,
  },

  correctTilesLabel: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  correctTilesValue: {
    color: "white",
    fontFamily: 'BubbleFont',
    fontSize: 128,
    lineHeight: 140,
    fontWeight: "bold",
    color: "#00a0ff", // Text color
    // backgroundColor: "rgba(255, 255, 255, 0.5)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 10, // Horizontal padding
    borderRadius: 80, // Rounded corners
    textAlign: "center", // Center the text
    overflow: "hidden", // Ensures the border radius is applied correctly
    width: 200,
  },
  buttonWrapper: {},
  buttonContainer: {},
});

export default Game;
