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
  Alert,
  Vibration,
  ActivityIndicator,
  Platform,
} from "react-native";

import {
  Button,
  Modal,
  FormControl,
  Input,
  Center,
  NativeBaseProvider,
  AlertDialog,
  useToast,
} from "native-base";

import { useFonts } from "expo-font";
import {
  MaterialCommunityIcons,
  AntDesign,
  MaterialIcons,
  FontAwesome,
  Fontisto,
  FontAwesome5,
} from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const ProductView = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [datas, setDatas] = useState([]);
  const [showModal, setShowModal] = useState(false); //showModalSale
  const [showModalSale, setShowModalSale] = useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const route = useRoute();
  const params = route.params;
  const toast = useToast();

  //Infos
  const [ident, setIdent] = React.useState("");
  const [pro_name, setPro_name] = React.useState("");
  const [pro_price, setPro_price] = React.useState("");
  const [pro_benefit, setPro_benefit] = React.useState("");
  const [edit, setEdit] = useState(true);
  const [pro_quatity, setQuatity] = useState(0);

  //Notifications
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  //Running
  const Setparms = () => {
    setIdent(params.id);
    setPro_name(params.name);
    setPro_price(params.price);
    setPro_benefit(params.benefit);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  useEffect(() => {
    Setparms();

    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Shami Boutique sales system`,
        body: `You've done with product ${pro_name}`,
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
      console.log(token);
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

  //Update Command
  const Updateinformation = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      id: ident,
      name: pro_name,
      price: pro_price,
      benefit: pro_benefit,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://unforgivable-gangs.000webhostapp.com/main.php/update_product",
        data,
        config
      )
      .then((response) => {
        toast.show({
          description: "Hello product has updated",
        });
        schedulePushNotification();
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);
      })
      .catch((error) => {
        toast.show({
          description: "Update failed try Again",
        });
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);
      });
  };



    //Adding Command
    const Adding_information = async () => {
      setEdit(false);
      setIsLoading(true);
  
      const data = {
        product_id: ident,
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
          setShowModalSale(false);
          Vibration.vibrate();
          setIsLoading(false);
          getallproduct();
          getallsales();
          setQuatity(0);

        })
        .catch((error) => {
          toast.show({
            description: "Add failed try Again",
          });
          setEdit(true);
          setShowModal(false);
          Vibration.vibrate();
          setIsLoading(false);
          setQuatity(0);
        });
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

          <View style={styles.header}></View>
          {/* <Text style={styles.textTitle2}>Identity: {params.id}</Text> */}
          <Text style={styles.item}>{pro_name}</Text>
          <Text style={styles.title2}>
            Price:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "RWF",
            }).format(pro_price)}{" "}
            Benefit:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "RWF",
            }).format(pro_benefit)}
          </Text>
        </View>

        <View style={styles.fuc}>
          <TouchableOpacity
            style={styles.update}
            onPress={() => setShowModal(true)}
          >
            <FontAwesome5
              name="edit"
              size={15}
              color="white"
              style={{
                marginRight: 10,
              }}
            />
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.delete}
            onPress={() => setIsOpen(!isOpen)}
          >
            <MaterialCommunityIcons
              name="delete-empty"
              size={20}
              color="white"
              style={{
                marginRight: 10,
              }}
            />
            <Text style={styles.btnText}>Remove</Text>
          </TouchableOpacity>
        </View>

{/*         <TouchableOpacity
            style={styles.delete}
            onPress={() => setShowModalSale(true)}
          >
            <MaterialCommunityIcons
              name="delete-empty"
              size={20}
              color="white"
              style={{
                marginRight: 10,
              }}
            />
            <Text style={styles.btnText}>Sell it Now</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
              style={styles.itemBtn}
              onPress={() => setShowModalSale(true)}
            >
              <MaterialCommunityIcons
                name="point-of-sale"
                size={24}
                color="white"
              />
              <Text style={styles.itemBtnText}>Sale new now...</Text>
            </TouchableOpacity>
            

      </ScrollView>

      <NativeBaseProvider>
        <Center flex={1} px="3">
          <Center>
            <Modal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              animationDuration={500}
            >
              <Modal.Content maxWidth="600px" width="340px">
                <Modal.CloseButton />
                <Modal.Header>Edit {pro_name}</Modal.Header>
                <Modal.Body>
                  <FormControl>
                    <FormControl.Label>Name</FormControl.Label>
                    <Input
                      value={pro_name}
                      onChangeText={setPro_name}
                      editable={edit}
                    />
                  </FormControl>
                  <FormControl mt="3">
                    <FormControl.Label>Price</FormControl.Label>
                    <Input
                      value={pro_price}
                      onChangeText={setPro_price}
                      editable={edit}
                    />
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>Benefit</FormControl.Label>
                    <Input
                      value={pro_benefit}
                      onChangeText={setPro_benefit}
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
                        onPress={Updateinformation}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={{ color: "white" }}>Edit & Save</Text>
                        )}
                      </Button>
                    </TouchableOpacity>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>


            

            <Modal
              isOpen={showModalSale}
              onClose={() => setShowModalSale(false)}
              animationDuration={500}
            >
              <Modal.Content maxWidth="600px" width="340px">
                <Modal.CloseButton />
                <Modal.Header>Sale {pro_name}</Modal.Header>
                <Modal.Body>
                  <FormControl>
                    <FormControl.Label>Name</FormControl.Label>
                    <Text>{pro_name}</Text>
                  </FormControl>
                  <FormControl mt="3">
                    <FormControl.Label>Price</FormControl.Label>
                    <Text>{pro_price}</Text>
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
                  <Text style={{
                    color:'green',
                    fontSize:10
                  }}>{pro_quatity==0?``:`Total are ${new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "RWF",
                  }).format(pro_price * pro_quatity)} and Benefit are ${new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "RWF",
                  }).format(pro_benefit * pro_quatity)}.`}</Text>

                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() => {
                        setShowModalSale(false);
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
            


            <AlertDialog
              leastDestructiveRef={cancelRef}
              isOpen={isOpen}
              onClose={onClose}
            >
              <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>Delete </AlertDialog.Header>
                <AlertDialog.Body>
                  <Text>Are you sure to delete {params.name} now ?</Text>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="unstyled"
                      colorScheme="coolGray"
                      onPress={onClose}
                      ref={cancelRef}
                    >
                      Cancel
                    </Button>
                    <Button
                      colorScheme="danger"
                      onPress={() => {
                        Vibration.vibrate();
                        setIsOpen(false);
                      }}
                    >
                      Delete
                    </Button>
                  </Button.Group>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog>
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
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
    marginLeft: 5,
    color: "#a8006e",
  },
  item: {
    backgroundColor: "#a8006e",
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 5,
    width: "94%",
    height: 70,
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
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },

  title2: {
    fontSize: 15,
    color: "black",
    textAlign: "center",
    fontWeight: "900",
    width: "100%",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },

  fuc: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  update: {
    width: "45%",
    height: 50,
    backgroundColor: "#00960a",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  delete: {
    width: "45%",
    height: 50,
    backgroundColor: "#b30000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: "white",
  },

  itemBtn: {
    backgroundColor: "#a8006e",
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 5,
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
    marginTop: 15,
  },
  itemBtnText: {
    color: "white",
    marginLeft: 10,
  },
});

export default ProductView;
