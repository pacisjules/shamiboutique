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
  ImageBackground,
  Alert,
  Share,
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

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Font from "expo-font";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchTotalsDataDate,
  fetchAllSalesDataDate,
} from "../../features/RedpickDateTime/RedPickDate";
import { useRoute } from "@react-navigation/native";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const RedPick = ({ navigation }) => {
  const loadImg = require("../../assets/afroGril.jpg");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [datas, setDatas] = useState([]);
  const [dataspro, setDataspro] = useState([]);
  const isFocused = useIsFocused();
  const toast = useToast();

  const [user, setUser] = useState(AsyncStorage.getItem("username"));
  const [company, setCompany] = useState(AsyncStorage.getItem("co_name"));

  const dispatch = useDispatch();

  //Get All sales from redux array
  const { DateError, DateTotal_data, DateIsLoading } = useSelector(
    (state) => state.RedPickDate
  );

  const { all_sales, all_sales_isLoading, all_sale_error } = useSelector(
    (state) => state.RedPickDate
  );

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

  //Dates
  const currentDate = new Date();
  const montly = currentDate.getMonth();
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();

  const formattedDate =
    year +
    "-" +
    (montly + 1).toString().padStart(2, "0") +
    "-" +
    date.toString().padStart(2, "0");

  const route = useRoute();
  const params = route.params;

  //Modals
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //Infos
  const [ident, setIdent] = useState("");
  const [pro_name, setPro_name] = useState("");
  const [pro_quatity, setQuatity] = useState(0);
  const [pro_benefit, setPro_benefit] = useState("");
  const [edit, setEdit] = useState(true);
  const [service, setService] = React.useState("");

  //Notifications
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  //Get price for calculation
  const [result, setResult] = useState([]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchTotalsDataDate(params.dating));
    dispatch(fetchAllSalesDataDate(params.dating));

    getallproduct();
    // perform your refresh logic here
    setRefreshing(false);
  };

  const getallproduct = () => {
    axios
      .get(
        "https://unforgivable-gangs.000webhostapp.com/maincondition.php/all_products",
        {
          params: {
            company: 5,
            date: 1,
          },
        }
      )
      .then((response) => {
        setDataspro(response.data);
      })
      .catch((error) => {
        // console.error("No response");
      });
  };

  useEffect(() => {
    dispatch(fetchTotalsDataDate(params.dating));
    dispatch(fetchAllSalesDataDate(params.dating));
    getallproduct();
    loadFonts();
    if (isFocused) {
      dispatch(fetchTotalsDataDate(params.dating));
      dispatch(fetchAllSalesDataDate(params.dating));
      //console.log("Screen has been refreshed");
    }

    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        //console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [isFocused, navigation]);

  //Notification and Vibration
  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Shami Boutique sales system`,
        body: `You've add new sale.`,
        data: { data: "goes here" },
      },
      trigger: { seconds: 1 },
    });
  }

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      //console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  const onClose = () => setIsOpen(false);

  const cancelRef = React.useRef(null);

  const ONE_SECOND_IN_MS = 1000;

  const PATTERN = [
    1 * ONE_SECOND_IN_MS,
    2 * ONE_SECOND_IN_MS,
    3 * ONE_SECOND_IN_MS,
  ];

  const PATTERN_DESC =
    Platform.OS === "android"
      ? "wait 1s, vibrate 2s, wait 3s"
      : "wait 1s, vibrate, wait 2s, vibrate, wait 3s";

  const Item = ({ name, id, price, quantity, total, Totalbenefit }) => (
    <View style={styles.item}>
      <View style={styles.left}>
        <Text style={styles.tit}>
          {id}.{name}
        </Text>
        <Text style={styles.tit}>Price on {price}</Text>
        <Text style={styles.tit}>Benefit: {Totalbenefit}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.title2}> Qty ({quantity})</Text>
        <Text style={styles.title2}> Total {total}</Text>
      </View>
    </View>
  );

  //Adding Command
  const Adding_information = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      product_id: service,
      sales_point_id: 1,
      quantity: pro_quatity,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://unforgivable-gangs.000webhostapp.com/main.php/add_sale",
        data,
        config
      )
      .then((response) => {
        toast.show({
          description: "Sale has added",
        });
        schedulePushNotification();
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);
        getallproduct();
        dispatch(fetchTotalsDataDate(params.dating));
        dispatch(fetchAllSalesDataDate(params.dating));
        setIdent("");
        setPro_name("");
        setPro_price("");
        setPro_benefit("");
      })
      .catch((error) => {
        toast.show({
          description: "Add failed try Again",
        });
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);
        setIdent("");
        setPro_name("");
        setPro_price("");
        setPro_benefit("");
      });
  };

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

  return (
    <SafeAreaView style={styles.containerer}>
      <NativeBaseProvider>
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
            <View style={styles.header}>
              {DateIsLoading ? (
                <ActivityIndicator size="small" color="#a8006e" />
              ) : (
                DateTotal_data.map((post) => (
                  <Text
                    key="1"
                    style={{
                      textAlign: "center",
                      fontSize: 18,
                      marginLeft: 5,
                      color: "black",
                      fontFamily: "Poppins-Bold",
                    }}
                  >
                    Total sales:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "RWF",
                    }).format(post.SalesTotal)}
                  </Text>
                ))
              )}

              {DateIsLoading ? (
                <ActivityIndicator size="small" color="#a8006e" />
              ) : (
                DateTotal_data.map((post) => (
                  <Text
                    key="1"
                    style={{
                      textAlign: "center",
                      fontSize: 18,
                      marginLeft: 5,
                      color: "black",
                      fontFamily: "Poppins-Bold",
                    }}
                  >
                    Benefit:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "RWF",
                    }).format(post.Benefit_Total)}
                  </Text>
                ))
              )}
            </View>

            <Text
              style={{
                fontFamily: "Regular",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 16,
                marginLeft: 5,
                color: "#a8006e",
                marginBottom: 30,
                marginTop: 15,
              }}
            >
              All {all_sales.length} {all_sales.length == 1 ? "sale" : "sales"}{" "}
              list on {params.dating}.
            </Text>
          </View>
        </ScrollView>

        {all_sales_isLoading ? (
          <View>
            <Center>
              <ActivityIndicator size="large" color="#a8006e" />
              <Text style={styles.textInGFuc}>Loading Please Wait...</Text>
            </Center>
          </View>
        ) : (
          <FlatList
            data={all_sales}
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
                  id={item.id}
                  price={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "RWF",
                  }).format(item.price)}
                  quantity={item.quantity}
                  total={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "RWF",
                  }).format(item.Total)}
                  Totalbenefit={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "RWF",
                  }).format(item.Totalbenefit)}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        )}

        <Center flex={1} px="3">
          <Center>
            <Modal
              isOpen={showModal}
              onClose={() => {
                setShowModal(false);
                setService("");
                setQuatity("");
              }}
              animationDuration={500}
            >
              <Modal.Content maxWidth="600px" width="340px">
                <Modal.CloseButton />
                <Modal.Header>Sale</Modal.Header>
                <Modal.Body>
                  <FormControl>
                    <FormControl.Label>Product</FormControl.Label>
                    <Select
                      selectedValue={service}
                      minWidth="200"
                      accessibilityLabel="Choose product"
                      placeholder="Select product"
                      _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="4" />,
                      }}
                      mt={1}
                      onValueChange={(e) => {
                        setService(e);
                        setResult(dataspro.find((item) => item.id === e));
                      }}
                      value={service}
                    >
                      {dataspro.map((item) => (
                        <Select.Item
                          key={item.id}
                          label={`${item.name} Cost ${item.price}.`}
                          value={item.id}
                        />
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>Quantity</FormControl.Label>
                    <Input
                      value={pro_quatity}
                      onChangeText={setQuatity}
                      editable={edit}
                      inputMode="numeric"
                    />
                  </FormControl>
                  <Text
                    style={{
                      color: "green",
                      fontSize: 10,
                    }}
                  >
                    {pro_quatity == 0
                      ? ``
                      : `Total are ${new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "RWF",
                        }).format(
                          result.price * pro_quatity
                        )} and Benefit are ${new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "RWF",
                        }).format(result.benefit * pro_quatity)}.`}
                  </Text>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() => {
                        setShowModal(false);
                      }}
                    >
                      {isLoading ? (
                        <Text style={{ color: "gray" }}>Please wait..</Text>
                      ) : (
                        <Text style={{ color: "gray" }}>Cancel</Text>
                      )}
                    </Button>
                    <TouchableOpacity>
                      <Button
                        style={{
                          backgroundColor: "#68bd00",
                        }}
                        onPress={Adding_information}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={{ color: "white" }}>Apply now</Text>
                        )}
                      </Button>
                    </TouchableOpacity>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </Center>
        </Center>
      </NativeBaseProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: "#fff",
    marginTop: 0,
    width: "100%",
    height: "100%",
    flex: 1,
  },

  containerer: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },

  header: {
    backgroundColor: "white",
    height: 60,
    width: "100%",
  },
  textTitle2: {
    fontFamily: "Regular",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
    color: "#a8006e",
  },
  item: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 10,
    width: "94%",
    height: 85,
    textAlign: "center",
    alignItems: "center",
    borderColor: "#a8006e",
    borderStyle: "solid",
    borderWidth: 1,
    justifyContent: "space-around",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    flexDirection: "row",
  },

  left: {
    backgroundColor: "#fff2fb",
    width: "60%",
    height: 65,
    borderRadius: 10,
    justifyContent: "center",
    paddingLeft: 10,
  },

  tit: {
    fontSize: 11,
    color: "black",
    textAlign: "left",
  },

  title: {
    fontSize: 10,
    color: "white",
    textAlign: "center",
    fontWeight: "900",
    width: "50%",
    textAlign: "left",
    backgroundColor: "#690044",
    height: "100%",
    padding: 6,
    borderRadius: 5,
    alignItems: "center",
  },

  title2: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
    fontWeight: "900",
    textAlign: "left",
  },

  itemBtn: {
    backgroundColor: "#a8006e",
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 10,
    width: "94%",
    height: 55,
    textAlign: "center",
    alignItems: "center",
    borderColor: "#a8006e",
    borderStyle: "solid",
    borderWidth: 2,
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },

  itemBtnText: {
    color: "white",
    marginLeft: 10,
  },
});

export default RedPick;
