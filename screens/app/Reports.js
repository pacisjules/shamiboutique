import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ScrollView,
  RefreshControl,
  Platform,
  Vibration,
  ActivityIndicator,
} from "react-native";

import { useFonts } from "expo-font";
import {
  MaterialCommunityIcons,
  AntDesign,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";

import {
  Button,
  Modal,
  FormControl,
  Input,
  Center,
  NativeBaseProvider,
  AlertDialog,
  useToast,
  Select,
  CheckIcon,
} from "native-base";

import DateTimePicker from '@react-native-community/datetimepicker';

function Reports({ navigation }) {
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);


    function onDateChange(event, selectedDate) {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'Android');
        setDate(currentDate);

        //alert(date.toDateString());
        const montly = currentDate.getMonth();
        const date = currentDate.getDate();
        const year = currentDate.getFullYear();

  const formattedDate =
    year +
    "-" +
    (montly + 1).toString().padStart(2, "0") +
    "-" +
    date.toString().padStart(2, "0");
        navigation.navigate("RedPick",{
          dating: formattedDate,
        })
      }
    
      function onPress() {
        setShowPicker(true);
      }

  return (
    <SafeAreaView style={styles.container}>
      <NativeBaseProvider>
        
        <Text style={styles.textTitle}>Sales functions</Text>
          <View style={styles.fuc}>
            <TouchableOpacity onPress={() => navigation.navigate("Yesterday")}>
              <View style={styles.fucs}>
              <AntDesign name="back" size={24} color="#ff00a6" />
                <Text style={styles.textInGFuc}>Yesterday</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={onPress}>
              <View style={styles.fucs}>
                <MaterialIcons name="date-range" size={24} color="#ff00a6" />
                <Text style={styles.textInGFuc}>Pick Date</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => alert("Week")}>
              <View style={styles.fucs}>
                <FontAwesome name="calendar" size={24} color="#ff00a6" />
                <Text style={styles.textInGFuc}>Week</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => alert("From To")}>
              <View style={styles.fucs}>
              <MaterialCommunityIcons name="calendar-search" size={24} color="#ff00a6"/>
                <Text style={styles.textInGFuc}>From To</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => alert("Commons")}>
              <View style={styles.fucs}>
              <FontAwesome name="product-hunt" size={24} color="#ff00a6" />
                <Text style={styles.textInGFuc}>Commons</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Reports")}>
              <View style={styles.fucs}>
                <MaterialCommunityIcons name="battery-charging-high" size={24} color="#ff00a6" />
                <Text style={styles.textInGFuc}>Higher</Text>
              </View>
            </TouchableOpacity>

            
          </View>
          
          {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
          theme={{
            backgroundColor: '#333333',
            textColor: '#FFFFFF',
            headerBackgroundColor: '#333333',
            headerTextColor: '#FFFFFF',
          }}
        />
      )}
      <Text style={styles.selectedDate}>
        Selected date: {date.toDateString()}
      </Text>
      
      </NativeBaseProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  fuc: {
    marginTop: 10,
    backgroundColor: "#a8006e",
    width: "98%",
    height: 200,
    borderRadius: 10,
    alignItems: "center",
    //marginLeft: 3,
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
  dateTimePicker: {
    backgroundColor: '#ff00a6',
  },
});

export default Reports;
