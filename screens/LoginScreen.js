import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Message, setMessage] = useState("");
  const [edit, setEdit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setMessage("");
    setEdit(false);
    setIsLoading(true);
    const data = {
      username: email,
      password: password,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    axios
      .post(
        "https://unforgivable-gangs.000webhostapp.com/userlogin.php",
        data,
        config
      )
      .then((response) => {
        navigation.navigate("Home");

        AsyncStorage.setItem("isLoggedIn", "true");
        AsyncStorage.setItem("email", response.data.email);
        AsyncStorage.setItem("user_id", response.data.id);
        AsyncStorage.setItem("co_id", response.data.company_ID);
        AsyncStorage.setItem("co_name", response.data.company_name);
        AsyncStorage.setItem("username", response.data.username);
        
        setEdit(true);
        setIsLoading(false);
      })
      .catch((error) => {
        setMessage("Login failed please check username and password");
        setEdit(true);
        setIsLoading(false);
        setTimeout(() => {
          setMessage("");
          // Handle login success or failure here
        }, 3000);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#ff00a6" // Set the background color of the status bar
        barStyle="white" // Set the text color of the status bar to dark
        hidden={false} // Show the status bar
      />
      <Image style={styles.tinyLogo} source={require("../assets/icon.png")} />

      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setEmail}
        value={email}
        editable={edit}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
        editable={edit}
      />

      <TouchableOpacity onPress={handleLogin}>
        <View style={styles.button}>
          <Text
            style={{
              color: "white",
            }}
          >
            Login
          </Text>
        </View>
      </TouchableOpacity>

      <Text
        style={{
          color: "red",
          fontSize: 10,
        }}
      >
        {Message}
      </Text>
      {isLoading && <ActivityIndicator size="large" color="#ff00a6" />}
      <Text
        style={{
          color: "black",
          fontSize: 10,
          marginTop: 5,
          textAlign: "center",
        }}
      >
        if you don't have account Click {"\n"}{" "}
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text
            style={{
              color: "red",
              textDecorationLine: "underline",
            }}
          >
            Register here
          </Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: 300,
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginTop: 15,
    borderRadius: 5,
  },

  button: {
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    backgroundColor: "#ff00a6",
    width: 300,
    alignItems: "center",
  },

  tinyLogo: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
});

export default LoginScreen;
