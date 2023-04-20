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
} from "react-native";
import { useFonts } from "expo-font";
import {
  MaterialCommunityIcons,
  AntDesign,
  MaterialIcons,
  FontAwesome,
  Fontisto,
} from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";

function Entry({ navigation }) {
  const currentDate = new Date();

  const [monthname, setMonthname] = useState("Month");
  const [dayname, setDayname] = useState("day");
  const day = currentDate.getDay();

  const montly = currentDate.getMonth();
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();

  const formattedDate =
    year +
    "-" +
    (montly + 1).toString().padStart(2, "0") +
    "-" +
    date.toString().padStart(2, "0");

    
  const isFocused = useIsFocused();

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

  const formattedTime = currentDate.toLocaleTimeString();
  const [refreshing, setRefreshing] = useState(false);
  const [currentdata, setCurrentdata] = useState([]);

  const [tot, setTot] = useState([]);
  const [totbenefit, setTotBenefit] = useState([]);

  const getcurrentproduct = () => {
    axios
      .get(
        "https://unforgivable-gangs.000webhostapp.com/maincondition.php/five_sales_current",
        {
          params: {
            date: formattedDate,
            company: 5,
          },
        }
      )
      .then((response) => {
        setCurrentdata(response.data);
        //console.log(currentdata)
      })
      .catch((error) => {
        console.error("No response");
      });
  };

  const gettotals = () => {
    axios
      .get(
        "https://unforgivable-gangs.000webhostapp.com/maincondition.php/all_sales_totals",
        {
          params: {
            date: formattedDate,
            company: 5,
          },
        }
      )
      .then((response) => {
        setTot(response.data);
        //console.log(tot)
      })
      .catch((error) => {
        console.error("No response");
      });
  };

  useEffect(() => {
    getcurrentproduct();
    gettotals();
    rundays();

    if (isFocused) {
      getcurrentproduct();
      gettotals();
      rundays();
      console.log("Screen has been refreshed");
    }
  }, [isFocused, navigation]);

  const Item = ({ name, quantity, Total }) => (
    <View style={styles.item}>
      <Fontisto name="shopping-basket" size={30} color="#ff00a6" />
      <Text style={styles.title}>
        {quantity} {name}
      </Text>
      <Text style={styles.normal}> {Total} </Text>
    </View>
  );

  //const navigation = useNavigation();
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

  const onRefresh = () => {
    setRefreshing(true);
    getcurrentproduct();
    gettotals();
    // perform your refresh logic here
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.containerer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <StatusBar
            backgroundColor="#ff00a6" // Set the background color of the status bar
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

                {tot.map((post) => (
                  <Text key="1" style={styles.textInG}>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "RWF",
                    }).format(post.SalesTotal)}
                  </Text>
                ))}
              </View>
              <View style={styles.infos}>
                <Text style={styles.textInH}>Benefits</Text>

                {tot.map((post) => (
                  <Text key="1" style={styles.textInG}>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "RWF",
                    }).format(post.Benefit_Total)}
                  </Text>
                ))}
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
            data={currentdata}
            renderItem={({ item }) => (
              <Item
                name={item.name}
                quantity={item.quantity}
                Total={new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "RWF",
                }).format(item.Total)}
              />
            )}
            keyExtractor={(item) => item.id}
          />

          {/* {currentdata.map((item) => (
            <Text key={item.id}>{item.name}</Text>
          ))} */}

          {/* <Text>Entry Screen</Text>
      <Button
        onPress={handlePress}
        title="Clean"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      /> */}
        </View>
      </ScrollView>
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
    backgroundColor: "white",
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
    borderWidth: 3,
    justifyContent: "space-around",
  },
  title: {
    fontSize: 12,
    color: "#a8006e",
    textAlign: "center",
    fontWeight: "900",
  },

  normal: {
    fontSize: 12,
    color: "black",
    textAlign: "center",
    padding: 3,
    fontWeight: "bold",
  },
});

export default Entry;
