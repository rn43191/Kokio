import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import CountryFlag from "react-native-country-flag";
import { ThemedView } from "../ThemedView";
import { Card, CardContent, CardFooter } from "../ui/Card";
import { ThemedText } from "../ThemedText";
import Button from "../ui/Button";
import { Theme } from "@/constants/Colors";

const Hero = () => {
  return (
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
              <CountryFlag style={styles.flag} isoCode={"YE"} size={20} />
              <CountryFlag style={styles.flag} isoCode={"SG"} size={20} />
              <CountryFlag style={styles.flag} isoCode={"GB"} size={20} />
              <CountryFlag style={styles.flag} isoCode={"CR"} size={20} />
            </View>
          </View>
        </CardContent>
      </ImageBackground>
      <CardFooter style={styles.cardFooter}>
        <View>
          <Text style={styles.header}>Plan your Next Adventure</Text>
          <Text style={styles.subHeader}>The world awaits you!</Text>
        </View>
        <TouchableOpacity
          style={styles.heroButton}
          onPress={() => console.log("Shop")}
        >
          <Text style={styles.heroButtonText}>Shop</Text>
        </TouchableOpacity>
      </CardFooter>
    </Card>
  );
};

const styles = StyleSheet.create({
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
  card: {
    width: "100%",
    overflow: "hidden",
  },
  cardContent: {
    gap: 12,
  },
  cardFooter: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
  },
  flag: {
    width: 130,
    height: 75,
    borderRadius: 16,
  },
  flagContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
  },
  subHeader: {
    fontSize: 10,
    fontWeight: "300",
  },
  heroButton: {
    backgroundColor: Theme.colors.text,
    borderRadius: 40,
    paddingHorizontal: 24,
    paddingVertical: 5,
  },
  heroButtonText: {
    color: Theme.colors.background,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default Hero;
