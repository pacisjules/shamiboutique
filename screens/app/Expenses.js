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
  Ionicons,
  Feather,
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
  Icon,
  Stack,
  Pressable,
  TextArea,
} from "native-base";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchSearchProductsData,
} from "../../features/getfullproducts/getallproducts";

import { fetchAllTypesData } from "../../features/getalltypes/getalltypes";
import { fetchAllExpensesData } from "../../features/getallexpenses/getallexpenses";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


const Expenses = ({ navigation }) => {
  const dispatch = useDispatch();
  const [salesP, setsalesP] = useState(AsyncStorage.getItem("salepoint_id"));
  const [userTP, setUserTP] = useState(AsyncStorage.getItem("userType"));

  //Get All products from redux array
  const { expenses_error, all_expense, expense_isLoading } = useSelector(
    (state) => state.getallexpenses
  );

  //Get All expense Type from redux array
  const { types_isLoading, all_types, types_error } = useSelector(
    (state) => state.getalltypes
  );

  //Normal
  const [refreshing, setRefreshing] = useState(false);
  const [datas, setDatas] = useState([]);
  const isFocused = useIsFocused();
  const toast = useToast();

  //Modals
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [showModal2, setShowModal2] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  //Infos
  //type state
  const [type_name, setType_name] = useState("");
  const [type_description, setType_description] = useState("");

  //Expenses info
  const [ExpName, setExpName] = useState("");
  const [ExpAmount, setExpAmount] = useState(0);
  const [Exp_description, setExp_description] = useState("");
  const [SelectedValueData, setSelectedValue] = useState("");

  const [edit, setEdit] = useState(true);

  //Notifications
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();


  //For search products
  const [searchQuery, setSearchQuery] = useState("");

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchAllTypesData(2));
    dispatch(fetchAllExpensesData(2));
    // perform your refresh logic here
    setRefreshing(false);
  };

  useEffect(() => {
   
    // dispatch(fetchAllTypesData(`${salesP._j}`));
    // dispatch(fetchAllExpensesData(`${salesP._j}`));

    if (isFocused) {
      dispatch(fetchAllTypesData(2));
      dispatch(fetchAllExpensesData(2));
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
        body: `You've add new item.`,
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

  const Item = ({ name, id, price, benefit }) => (
    <View style={styles.item}>
      <Text style={styles.title}>
        {id}. {name}
      </Text>
      <Text style={styles.title2}> {price}</Text>
    </View>
  );

  //Adding Command
  const Adding_Type = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      name: type_name,
      description: type_description,
      sales_point_id: salesP._j,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://unforgivable-gangs.000webhostapp.com/main.php/add_expenses_type",
        data,
        config
      )
      .then((response) => {
        toast.show({
          description: "Hello Type has added",
        });
        schedulePushNotification();
        setEdit(true);
        setShowModal2(false);
        Vibration.vibrate();
        setIsLoading(false);
        dispatch(fetchAllTypesData(`${salesP._j}`));
      })
      .catch((error) => {
        toast.show({
          description: "Adding failed try Again",
        });
        setEdit(true);
        setShowModal2(false);
        Vibration.vibrate();
        setIsLoading(false);
      });
  };

  const Adding_Expenses = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      name: ExpName,
      amount: ExpAmount,
      description: Exp_description,
      sales_point_id: salesP._j,
      exp_type: SelectedValueData,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://unforgivable-gangs.000webhostapp.com/main.php/add_expenses",
        data,
        config
      )
      .then((response) => {
        toast.show({
          description: "Hello Expenses has added",
        });
        schedulePushNotification();
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);
        dispatch(fetchAllExpensesData(`${salesP._j}`));
      })
      .catch((error) => {
        toast.show({
          description: "Add failed try Again",
        });
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);
      });
  };

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
              <View style={styles.itemBox}>
                <TouchableOpacity
                  style={styles.itemBtn}
                  onPress={() => setShowModal(true)}
                >
                  <MaterialIcons name="add-to-photos" size={24} color="white" />
                  <Text style={styles.itemBtnText}>New Expense</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.itemBtn}
                  onPress={() => setShowModal2(true)}
                >
                  <Feather name="type" size={24} color="white" />
                  <Text style={styles.itemBtnText}>Expense Type</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.textTitle2}>
              All {all_expense.length}{" "}
              {all_expense.length == 1 ? "expense" : "expenses"} list
            </Text>

            <Center>
              <Input
                w={{
                  base: "94%",
                  md: "25%",
                }}
                onChangeText={(e) => {
                  setSearchQuery(e);
                  dispatch(fetchSearchProductsData(e));
                }}
                value={searchQuery}
                InputLeftElement={
                  <Icon
                    as={<Ionicons name="ios-search-circle" />}
                    size={5}
                    ml="2"
                    color="muted.600"
                  />
                }
                placeholder="Search..."
              />
            </Center>
          </View>
        </ScrollView>

        {expense_isLoading ? (
          <View>
            <Center>
              <ActivityIndicator size="large" color="#a8006e" />
              <Text style={styles.textInGFuc}>Loading Please Wait...</Text>
            </Center>
          </View>
        ) : (
          <FlatList
            style={{
              backgroundColor: "white",
            }}
            data={all_expense}
            renderItem={({ item }) => (
              <Item
                name={item.name}
                id={item.id}
                price={item.description}
                benefit={new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "RWF",
                }).format(item.amount)}
              />
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
              }}
              animationDuration={500}
            >
              <Modal.Content maxWidth="600px" width="340px">
                <Modal.CloseButton />
                <Modal.Header>Add New Expense</Modal.Header>
                <Modal.Body>
                  <FormControl>
                    <FormControl.Label>Name</FormControl.Label>
                    <Input
                      value={ExpName}
                      onChangeText={setExpName}
                      editable={edit}
                    />
                  </FormControl>
                  <FormControl mt="3">
                    <FormControl.Label>Amount</FormControl.Label>
                    <Input
                      value={ExpAmount}
                      onChangeText={setExpAmount}
                      editable={edit}
                      inputMode="numeric"
                    />
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>Select type</FormControl.Label>

                    <Picker
                      selectedValue={SelectedValueData}
                      style={{ height: 50, width: "100%" }}
                      onValueChange={(itemValue, itemIndex) =>
                        setSelectedValue(itemValue)
                      }
                    >
                      {all_types.map((item) => (
                        <Picker.Item
                          label={item.name}
                          value={item.id}
                          key={item.id}
                        />
                      ))}

                      {/* <Picker.Item label="Java" value="java" />
                      <Picker.Item label="JavaScript" value="js" /> */}
                    </Picker>
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>Description</FormControl.Label>

                    <TextArea
                      bordered
                      placeholder="Enter some description type..."
                      value={Exp_description}
                      onChangeText={setExp_description}
                      rowSpan={5}
                      editable={edit}
                    />
                  </FormControl>
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
                        onPress={Adding_Expenses}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={{ color: "white" }}>Add Expense</Text>
                        )}
                      </Button>
                    </TouchableOpacity>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </Center>

          <Center>
            <Modal
              isOpen={showModal2}
              onClose={() => {
                setShowModal2(false);
              }}
              animationDuration={500}
            >
              <Modal.Content maxWidth="600px" width="340px">
                <Modal.CloseButton />
                <Modal.Header>Add new type</Modal.Header>
                <Modal.Body>
                  <FormControl>
                    <FormControl.Label>Name</FormControl.Label>

                    <Input
                      value={type_name}
                      onChangeText={setType_name}
                      editable={edit}
                    />
                  </FormControl>
                  <FormControl mt="3">
                    <FormControl.Label>Description</FormControl.Label>

                    <TextArea
                      bordered
                      placeholder="Enter some description type..."
                      value={type_description}
                      onChangeText={setType_description}
                      rowSpan={5}
                      editable={edit}
                    />
                  </FormControl>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() => {
                        setShowModal2(false);
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
                        onPress={Adding_Type}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={{ color: "white" }}>Add Type</Text>
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
    height: 230,
    flex: 1,
  },

  containerer: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "#fff",
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
    marginTop: 10,
    marginBottom: 10,
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
    height: 55,
    textAlign: "center",
    alignItems: "center",
    borderColor: "#a8006e",
    borderStyle: "solid",
    borderWidth: 1,
    justifyContent: "space-between",
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
    width: "40%",
    textAlign: "left",
  },
  itemBox: {
    width: "100%",
    height: 100,
    flexDirection: "row",
    paddingTop: 10,
    justifyContent: "center",
  },

  itemBtn: {
    backgroundColor: "#a8006e",
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 10,
    width: "42%",
    height: 45,
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
    fontSize: 12,
  },
});

export default Expenses;
