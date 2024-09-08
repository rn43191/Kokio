import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import CountryFlag from "react-native-country-flag";
import { ThemedView } from "../ThemedView";
import { Card, CardContent, CardFooter } from "../ui/Card";
import { ThemedText } from "../ThemedText";
import Button from "../ui/Button";

const Hero = () => {
  return (
    <ThemedView>
      <Card>
        <ImageBackground
          source={require("@/assets/images/hero-background.png")}
          resizeMode="cover"
          style={styles.backgroundImageContainer}
          imageStyle={styles.backgroundImage}
        >
          <CardContent>
            <View style={styles.flagContainerTop}>
              <CountryFlag style={styles.flag} isoCode={"CA"} size={25} />
              <CountryFlag style={styles.flag} isoCode={"US"} size={25} />
              <CountryFlag style={styles.flag} isoCode={"FR"} size={25} />
            </View>
          </CardContent>
        </ImageBackground>
        <CardFooter
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <View>
            <Text>Plan your Next Adventure</Text>
            <Text>The world awaits you!</Text>
          </View>
          <Button>Shop</Button>
        </CardFooter>
      </Card>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
  backgroundImageContainer: {
    flex: 1,
    overflow: "hidden",
  },
  backgroundImage: {
    opacity: 0.5,
    width: 400,
    height: 400,
  },
  flag: {
    width: 140,
    height: 80,
    borderRadius: 16,
  },
  flagContainerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    gap: 12,
  },
});

export default Hero;
