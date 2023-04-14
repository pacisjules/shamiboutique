import React, { useState, useEffect } from "react";
import 'react-native-gesture-handler';
import { StyleSheet, View, Text, Button,Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from '@react-navigation/drawer';

import LoginScreen from "./screens/LoginScreen";
import Registeruser from "./screens/Registeruser";
import HomeScreen from "./screens/HomeScreen";



function App() {
  const [company, setCompany] = useState(AsyncStorage.getItem("co_name"));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const co_name = AsyncStorage.getItem("co_name");

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedInStatus = await AsyncStorage.getItem("isLoggedIn");
      setIsLoggedIn(loggedInStatus === "true");
    };
    checkLoginStatus();
  }, []);



  const Stack = createNativeStackNavigator();

  return (
    
    <NavigationContainer>
      
      {isLoggedIn ? (
        <Stack.Navigator screenOptions={{
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
          
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
        </Stack.Navigator>
      ) : (

        <Stack.Navigator screenOptions={{
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
          
          
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={Registeruser} />
          
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
                alignItems:'center'
              },
            }}
          />
        </Stack.Navigator>

      )}
    </NavigationContainer>
   
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
});

export default App;
