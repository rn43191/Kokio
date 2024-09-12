import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import CountryFlag from "react-native-country-flag";
import { ThemedView } from "../ThemedView";
import { Card, CardContent, CardFooter } from "../ui/Card";
import { ThemedText } from "../ThemedText";
import Button from "../ui/Button";

const Hero = () => {
  return (
    // <ThemedView>
    <Card style={styles.card}>
      <ImageBackground
        source={require("@/assets/images/hero-background.png")}
        resizeMode="cover"
        style={styles.backgroundImageContainer}
        imageStyle={styles.backgroundImage}
      >
        <CardContent>
          <View style={styles.cardContent}>
            <View style={styles.flagContainer}>
              <CountryFlag style={styles.flag} isoCode={"CA"} size={20} />
              <CountryFlag style={styles.flag} isoCode={"US"} size={20} />
              <CountryFlag style={styles.flag} isoCode={"FR"} size={20} />
            </View>
            <View style={styles.flagContainer}>
              <CountryFlag style={styles.flag} isoCode={"DE"} size={20} />
              <CountryFlag style={styles.flag} isoCode={"SG"} size={20} />
              <CountryFlag style={styles.flag} isoCode={"GB"} size={20} />
              <CountryFlag style={styles.flag} isoCode={"CR"} size={20} />
            </View>
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
    // </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    overflow: "hidden",
  },
  backgroundImageContainer: {
    overflow: "hidden",
    width: "100%",
    position: "relative",
    padding: 0,
  },
  backgroundImage: {
    position: "absolute",
    opacity: 0.5,
    top: -150,
    right: 0,
    width: "100%",
    height: 600,
  },
  flag: {
    width: 130,
    height: 75,
    borderRadius: 16,
  },
  cardContent: {
    gap: 12,
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    // marginTop: 20,
    // gap: 12,
  },
  flagContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
  },
});

export default Hero;
