import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import { useFonts } from "expo-font";
import {
  MaterialCommunityIcons,
  AntDesign,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
];

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

function Entry() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.openDrawer();

    //AsyncStorage.clear();
  };

  const [loadedFonts] = useFonts({
    Regular: require("../../assets/fonts/magneto.ttf"),
    Quick: require("../../assets/fonts/Quicksand.ttf"),
    Cocogoose: require("../../assets/fonts/Cocogoose.ttf"),
  });

  if (!loadedFonts) {
    return true;
  }

  return (
    <SafeAreaView style={styles.containerer}>
      <View style={styles.container}>
        <StatusBar
          backgroundColor="white" // Set the background color of the status bar
          barStyle="light-content" // Set the text color of the status bar to dark
          hidden={false} // Show the status bar
        />

        <View style={styles.dates_up}>
          <Text style={styles.dates}>Period date: {formattedDate}</Text>

          <TouchableOpacity onPress={handlePress}>
            <Image
              style={styles.tinyLogo}
              source={require("../../assets/icon.png")}
            />
          </TouchableOpacity>

          <View style={styles.news}>
            <View style={styles.infos}>
              <Text style={styles.textInH}>Total Sales</Text>
              <Text style={styles.textInG}>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "RWF",
                }).format(12000)}
              </Text>
            </View>
            <View style={styles.infos}>
              <Text style={styles.textInH}>Benefits</Text>
              <Text style={styles.textInG}>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "RWF",
                }).format(2000)}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.textTitle}>Sales functions</Text>
        <View style={styles.fuc}>
          <TouchableOpacity onPress={() => alert("Sales")}>
            <View style={styles.fucs}>
              <MaterialCommunityIcons name="sale" size={24} color="#ff00a6" />
              <Text style={styles.textInGFuc}>Sales</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => alert("Products")}>
            <View style={styles.fucs}>
              <AntDesign name="database" size={24} color="#ff00a6" />
              <Text style={styles.textInGFuc}>Products</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => alert("Expenses")}>
            <View style={styles.fucs}>
              <MaterialIcons
                name="workspaces-filled"
                size={24}
                color="#ff00a6"
              />
              <Text style={styles.textInGFuc}>Expenses</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => alert("Debts")}>
            <View style={styles.fucs}>
              <MaterialCommunityIcons
                name="cash-lock"
                size={24}
                color="#ff00a6"
              />
              <Text style={styles.textInGFuc}>Debts</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => alert("Paids")}>
            <View style={styles.fucs}>
              <MaterialCommunityIcons
                name="cash-lock-open"
                size={24}
                color="#ff00a6"
              />
              <Text style={styles.textInGFuc}>Paid Debts</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => alert("Report")}>
            <View style={styles.fucs}>
              <FontAwesome name="print" size={24} color="#ff00a6" />
              <Text style={styles.textInGFuc}>Report</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.textTitle2}>Current sales</Text>

        <FlatList
          horizontal={true}
          data={DATA}
          renderItem={({ item }) => <Item title={item.title} />}
          keyExtractor={(item) => item.id}
        />

        {/* <Text>Entry Screen</Text>
      <Button
        onPress={handlePress}
        title="Clean"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      /> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: "#fff",
    marginTop: 30,
    width: "100%",
    height: "100%",
    flex: 1,
  },
  dates_up: {
    backgroundColor: "#a8006e",
    width: "100%",
    height: 200,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
  },
  dates: {
    color: "white",
    textAlign: "center",
    marginTop: 10,
  },

  tinyLogo: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginTop: 10,
  },
  news: {
    backgroundColor: "transparent",
    width: 300,
    height: 120,
    marginTop: 20,
    flex: 1,
    justifyContent: "space-between",
    alignContent: "space-between",
    flexDirection: "row",
  },

  infos: {
    textAlign: "center",
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "white",
    width: "48%",
    height: 120,
  },

  textInH: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    color: "#a8006e",
  },
  textInG: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20,
    color: "#0a0a0a",
  },

  fuc: {
    marginTop: 10,
    backgroundColor: "#a8006e",
    width: "98%",
    height: 200,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 3,
    padding: 10,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  fucs: {
    backgroundColor: "white",
    width: 100,
    height: 80,
    borderRadius: 10,
    alignItems: "center",
    padding: 15,
    flax: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    margin: 5,
  },

  textInGFuc: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 10,
    color: "#0a0a0a",
  },

  textTitle: {
    fontFamily: "Regular",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 85,
    marginLeft: 5,
    color: "#a8006e",
  },

  textTitle2: {
    fontFamily: "Regular",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 13,
    marginLeft: 5,
    color: "#a8006e",
  },

  containerer: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },

  item: {
    backgroundColor: "black",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    width: 120,
  },
  title: {
    fontSize: 16,
    color: "white",
  },
});

export default Entry;
