import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import Entry from "./app/Entry";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

function CustomDrawerContent({ navigation }) {
  const [user, setUser] = useState(AsyncStorage.getItem("username"));
  const [company, setCompany] = useState(AsyncStorage.getItem("co_name"));

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={{
          uri: "https://assets.materialup.com/uploads/89dbb834-18fe-44b0-b764-3e2007cfa012/preview.png",
        }}
        style={{ width: "100%", height: 150 }}
      />
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
        onPress={() => navigation.navigate("Entry")}
      >
        <Image
          source={{
            uri: "https://assets.materialup.com/uploads/89dbb834-18fe-44b0-b764-3e2007cfa012/preview.png",
          }}
          style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
        />
        <Text style={{ fontSize: 13 }}>
          {user._j}
          {"\nShop: " + company._j}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ padding: 10 }}
        onPress={() => navigation.navigate("Entry")}
      >
        <Text style={{ fontSize: 14 }}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ padding: 10 }}
        onPress={() => navigation.navigate("Article")}
      >
        <Text style={{ fontSize: 14 }}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}






function Article() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Article Screen</Text>
    </View>
  );
}

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      // drawerContentOptions={{
      //   activeTintColor: "#e91e63",
      //   itemStyle: { marginVertical: 5 },
      // }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Feed"
        component={Entry}
        options={{
          title: " Sales",
          headerShown: false,
          headerStyle: {
            backgroundColor: "#ff00a6",
          },
          headerTitleStyle: {
            color: "white",
            fontSize: 14,
          },
        }}
      />

      <Drawer.Screen name="Article" component={Article} />
      
    </Drawer.Navigator>
  );
}

function HomeScreen() {
  const [company, setCompany] = useState(AsyncStorage.getItem("co_name"));

  const co_name = AsyncStorage.getItem("co_name");
  const navigation = useNavigation();
  const del_stor = async () => {
    //AsyncStorage.clear();
    //alert(company._j);
    navigation.openDrawer();
  };
  return <MyDrawer />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
