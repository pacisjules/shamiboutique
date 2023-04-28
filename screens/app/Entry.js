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
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Share,
  ImageBackground,
} from "react-native";

import {
  MaterialCommunityIcons,
  AntDesign,
  MaterialIcons,
  FontAwesome,
  Fontisto,
} from "@expo/vector-icons";

import { Center, NativeBaseProvider } from "native-base";

import * as Font from "expo-font";

import { useSelector, useDispatch } from "react-redux";
import { fetchTotalsData } from "../../features/changetotals/change_total_slice";
import { fetchCurrentProductData } from "../../features/getcurrentproducts/get_current";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";

export default function Entry({ navigation }) {
  const loadImg = require("../../assets/afroGril.jpg");
  const currentDate = new Date();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [monthname, setMonthname] = useState("Month");
  const [dayname, setDayname] = useState("day");
  const day = currentDate.getDay();

  const [user, setUser] = useState(AsyncStorage.getItem("username"));
  const [company, setCompany] = useState(AsyncStorage.getItem("co_name"));

  const montly = currentDate.getMonth();
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();

  const dispatch = useDispatch();
  const { Total_data, isLoading, error } = useSelector(
    (state) => state.changeTotals
  );

  const {
    Current_products,
    Current_products_isLoading,
    Current_product_error,
  } = useSelector((state) => state.get_current_products);

  const formattedDate =
    year +
    "-" +
    (montly + 1).toString().padStart(2, "0") +
    "-" +
    date.toString().padStart(2, "0");

  const isFocused = useIsFocused();

  //Load fonts
  async function loadFonts() {
    await Font.loadAsync({
      magneto: require("../../assets/fonts/magneto.ttf"),
      Cocogoose: require("../../assets/fonts/Cocogoose.ttf"),

      "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
      "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    });

    setFontsLoaded(true);
  }

  const rundays = () => {
    //Get Days
    switch (day) {
      case 0:
        setDayname("Sunday");
        break;
      case 1:
        setDayname("Monday");
        break;
      case 2:
        setDayname("Tuesday");
        break;
      case 3:
        setDayname("Wednesday");
        break;
      case 4:
        setDayname("Thursday");
        break;
      case 5:
        setDayname("Friday");
        break;
      case 6:
        setDayname("Saturday");
        break;
      default:
        setDayname("Invalid day of week.");
        break;
    }

    switch (montly) {
      case 0:
        setMonthname("January");
        break;
      case 1:
        setMonthname("February");
        break;
      case 2:
        setMonthname("March");
        break;
      case 3:
        setMonthname("April");
        break;
      case 4:
        setMonthname("May");
        break;
      case 5:
        setMonthname("June");
        break;
      case 6:
        setMonthname("July");
        break;
      case 7:
        setMonthname("August");
        break;
      case 8:
        setMonthname("September");
        break;
      case 9:
        setMonthname("October");
        break;
      case 10:
        setMonthname("November");
        break;
      case 11:
        setMonthname("December");
        break;
      default:
        setMonthname("Invalid month number.");
        break;
    }
  };

  useEffect(() => {
    dispatch(fetchTotalsData());
    dispatch(fetchCurrentProductData());
    rundays();
    loadFonts();
    if (isFocused) {
      dispatch(fetchTotalsData());
      dispatch(fetchCurrentProductData());
      rundays();
      //console.log("Screen has been refreshed");
    }
  }, [isFocused, navigation]);

  //Check if font loaded

  if (!fontsLoaded) {
    return (
      <NativeBaseProvider>
        <ImageBackground
          source={loadImg}
          resizeMode="cover"
          style={styles.image}
        >
          <Center flex={1} px="3">
            <ActivityIndicator size="large" color="#a8006e" />
            <Text
              style={{
                color: "#ff00a6",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              Loading...
            </Text>
          </Center>
        </ImageBackground>
      </NativeBaseProvider>
    );
  }

  const Item = ({ name, quantity, Total, time }) => (
    <View style={styles.item}>
      <Fontisto name="shopping-basket" size={30} color="#ff00a6" />
      <Text style={styles.title}>
        {quantity} {name}
      </Text>
      <Text style={styles.normal}> {Total} </Text>
      <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 10,
          marginTop: -20,
          color: "#2e9100",
        }}
      >
        {" "}
        {time}{" "}
      </Text>
    </View>
  );

  //const navigation = useNavigation();
  const handlePress = () => {
    navigation.openDrawer();
    //AsyncStorage.clear();
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchTotalsData());
    dispatch(fetchCurrentProductData());

    // perform your refresh logic here
    setRefreshing(false);
  };

  //Time ago function

  function timeAgo(dateTimeStr) {
    const dateTime = new Date(dateTimeStr);
    const now = new Date();
    const diffMs = now - dateTime;
    const diffSeconds = Math.round(diffMs / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffSeconds < 60) {
      return `${diffSeconds} seconds ago`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  }



  
  return (
    <SafeAreaView
      style={{
        backgroundColor: "#fff",
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <StatusBar
            backgroundColor="#a8006e" // Set the background color of the status bar
            barStyle="white" // Set the text color of the status bar to dark
            hidden={false} // Show the status bar
          />

          <View style={styles.dates_up}>
            <Text style={styles.dates}>
              {date}
              {"th"} {monthname} {year}, {dayname}{" "}
            </Text>

            <TouchableOpacity onPress={handlePress}>
              <Image
                style={styles.tinyLogo}
                source={require("../../assets/icon.png")}
              />
            </TouchableOpacity>

            <View style={styles.news}>
              <View style={styles.infos}>
                <Text style={styles.textInH}>Total Sales</Text>

                {isLoading ? (
                  <ActivityIndicator size="small" color="#a8006e" />
                ) : (
                  Total_data.map((post) => (
                    <Text key="1" style={styles.textInG}>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "RWF",
                      }).format(post.SalesTotal)}
                    </Text>
                  ))
                )}
              </View>
              <View style={styles.infos}>
                <Text style={styles.textInH}>Benefits</Text>

                {isLoading ? (
                  <ActivityIndicator size="small" color="#a8006e" />
                ) : (
                  Total_data.map((post) => (
                    <Text key="1" style={styles.textInG}>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "RWF",
                      }).format(post.Benefit_Total)}
                    </Text>
                  ))
                )}
              </View>
            </View>
          </View>

          <Text style={styles.textTitle}>Sales functions</Text>
          <View style={styles.fuc}>
            <TouchableOpacity onPress={() => navigation.navigate("Sales")}>
              <View style={styles.fucs}>
                <MaterialCommunityIcons name="sale" size={24} color="#ff00a6" />
                <Text style={styles.textInGFuc}>Sales</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Products")}>
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

            <TouchableOpacity onPress={() => navigation.navigate("Reports")}>
              <View style={styles.fucs}>
                <FontAwesome name="print" size={24} color="#ff00a6" />
                <Text style={styles.textInGFuc}>Report</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.textTitle2}>Current sales</Text>

          {Current_products_isLoading ? (
            <View>
              <ActivityIndicator size="large" color="#a8006e" />
              <Text style={styles.textInGFuc}>Loading Wait...</Text>
            </View>
          ) : (
            <FlatList
              style={{
                backgroundColor: "white",
              }}
              horizontal={true}
              data={Current_products}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      `${item.name}`,
                      `Information:\n1. Qty ${item.quantity}\n2. Benefit ${
                        item.Totalbenefit
                      } \n3. Time ${
                        item.Sales_time
                      }\n5. Total:${new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "RWF",
                      }).format(item.Total)}`,
                      [
                        {
                          text: "OK",
                          onPress: () => console.log("OK Pressed"),
                        },
                        {
                          text: "SHARE",
                          onPress: () =>
                            Share.share({
                              message: `${company._j} system:\n${
                                user._j
                              } share to you ${
                                item.name
                              } sale information.\n1. Price: ${
                                item.price
                              }\n2. Qty: ${item.quantity}\n3. Benefit: ${
                                item.Totalbenefit
                              } \n4.Time: ${
                                item.Sales_time
                              }\nTotal:${new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "RWF",
                              }).format(item.Total)}`,
                              url: "https://myapp.com",
                              title: `${company._j} `,
                            }),
                        },
                      ]
                    )
                  }
                >
                  <Item
                    name={item.name}
                    quantity={item.quantity}
                    Total={new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "RWF",
                    }).format(item.Total)}
                    time={timeAgo(item.Sales_time)}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
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
    fontFamily: "Poppins-Bold",
  },

  tinyLogo: {
    width: 80,
    height: 80,
    borderRadius: 100,
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
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    color: "#a8006e",
  },
  textInG: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
    color: "#0a0a0a",
    fontFamily: "Poppins-Bold",
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
    fontSize: 10,
    color: "#0a0a0a",
    fontFamily: "Poppins-Regular",
  },

  textTitle: {
    fontFamily: "Poppins-Bold",
    textAlign: "left",
    fontSize: 16,
    marginTop: 85,
    marginLeft: 5,
    color: "#a8006e",
  },

  textTitle2: {
    fontFamily: "Poppins-Bold",
    textAlign: "left",
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
    backgroundColor: "#fff2fb",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    width: 120,
    height: 175,
    textAlign: "center",
    alignItems: "center",
    borderColor: "#a8006e",
    borderStyle: "solid",
    borderWidth: 2,
    justifyContent: "space-around",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 12,
    color: "#a8006e",
    textAlign: "center",
    fontWeight: "900",
    fontFamily: "Poppins-Bold",
  },

  normal: {
    fontSize: 12,
    color: "black",
    textAlign: "center",
    padding: 3,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },

  image: {
    flex: 1,
    justifyContent: "center",
  },
});
