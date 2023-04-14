import React, { useState } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import axios from "axios";

const Registeruser = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [Message, setMessage] = useState("");
  const [edit, setEdit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const add_user = async () => {
    setMessage("");
    setEdit(false);
    setIsLoading(true);

    const data = {
      username: username,
      email: email,
      password: password,
      company_name: "Igurire Shami Boutique",
      company_ID: 5,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    axios
      .post(
        "https://unforgivable-gangs.000webhostapp.com/insertuser.php",
        data,
        config
      )
      .then((response) => {
        alert("Sign up success in system Please Login");
        navigation.navigate("Login");

        //AsyncStorage.setItem('isLoggedIn', 'true');
        //AsyncStorage.setItem('email', response.data.email);
        //AsyncStorage.setItem('user_id', response.data.id);
        //AsyncStorage.setItem('co_id', response.data.company_ID);

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
        backgroundColor="white" // Set the background color of the status bar
        barStyle="light-content" // Set the text color of the status bar to dark
        hidden={false} // Show the status bar
      />
      <Image style={styles.tinyLogo} source={require("../assets/icon.png")} />

      <TextInput
        placeholder="Username"
        value={username}
        style={styles.input}
        onChangeText={(text) => setUsername(text)}
        editable={edit}
      />
      <TextInput
        placeholder="Email"
        value={email}
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        editable={edit}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        editable={edit}
      />

      <TouchableOpacity onPress={add_user}>
        <View style={styles.button}>
          <Text
            style={{
              color: "white",
            }}
          >
            Signup
          </Text>
        </View>
      </TouchableOpacity>

      {isLoading && <ActivityIndicator size="large" color="#ff00a6" />}
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

export default Registeruser;
