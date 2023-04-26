import React, { useState, useEffect } from "react";
import "react-native-gesture-handler";
import { StyleSheet, View, Text, Button, Image, ActivityIndicator, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import LoginScreen from "./screens/LoginScreen";
import Registeruser from "./screens/Registeruser";
import HomeScreen from "./screens/HomeScreen";
import Entry from "./screens/app/Entry";
import Products from "./screens/app/Products";
import ProductView from "./screens/app/ProductView";
import Sales from "./screens/app/Sales";


import {
  Center,
  NativeBaseProvider,
} from "native-base";



import * as Font from 'expo-font';

//Add redux provider
import { store } from "./store/store";
import { Provider } from "react-redux";

export default function App() {
  const loadImg = require("./assets/afroGril.jpg");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [company, setCompany] = useState(AsyncStorage.getItem("co_name"));
  const [isLoggedIn, setIsLoggedIn] = useState();
  const co_name = AsyncStorage.getItem("co_name");


  //Load fonts
  async function loadFonts() {
    await Font.loadAsync({
      'Regular': require('./assets/fonts/magneto.ttf'),
      'Cocogoose': require('./assets/fonts/Cocogoose.ttf'),
    });

    setFontsLoaded(true);
  }

  useEffect(() => {
    loadFonts();
    const checkLoginStatus = async () => {
      const loggedInStatus = await AsyncStorage.getItem("isLoggedIn");
      setIsLoggedIn(loggedInStatus === "true");
    };
    checkLoginStatus();
  }, []);


  if (!fontsLoaded) {
    return (
      <NativeBaseProvider>
        <ImageBackground source={loadImg} resizeMode="cover" style={styles.image}>
        <Center flex={1} px="3">
          <ActivityIndicator size="large" color="#a8006e" />
          <Text style={{
            color:"#ff00a6",
            fontWeight:'bold',
            fontSize:20
          }}>Loading...</Text>
        </Center>
        </ImageBackground>
      </NativeBaseProvider>
    );
  }

  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
        {isLoggedIn ? (
          <Stack.Navigator
            screenOptions={{
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: " Sales for " + company._j + " Shop  ",
                headerShown: false,
                headerStyle: {
                  backgroundColor: "#ff00a6",
                },
                headerTitleStyle: {
                  color: "white",
                  fontSize: 13,
                },
              }}
            />
            <Stack.Screen name="Register" component={Registeruser} />
            <Stack.Screen name="Entry" component={Entry} />
            <Stack.Screen name="Products" component={Products} />
            <Stack.Screen
              name="ProductView"
              component={ProductView}
              title="View information"
            />
            <Stack.Screen name="Sales" component={Sales} title="Sales" />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator
            screenOptions={{
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={Registeruser} />
            <Stack.Screen name="Entry" component={Entry} />
            <Stack.Screen name="Products" component={Products} />
            <Stack.Screen
              name="ProductView"
              component={ProductView}
              title="View information"
            />
            <Stack.Screen name="Sales" component={Sales} title="Sales" />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              
              options={{
                title: " Sales for " + company._j + " Shop  ",
                headerShown: false,
                headerStyle: {
                  backgroundColor: "#ff00a6",
                },
                headerTitleStyle: {
                  color: "white",
                  fontSize: 13,
                  alignItems: "center",
                },
              }}

            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  tinyLogo: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },

  image: {
    flex: 1,
    justifyContent: 'center',
  },
});
