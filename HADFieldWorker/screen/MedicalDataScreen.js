import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Styles } from "../utils/Styles";
import { COLOR } from "../utils/Color";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Divider from "../components/Divider";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import CustomButton from "../components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { getValueFor } from "../utils/Util";
import {
  insertMedicalData,
  removeRecordFromAppointmentTable,
} from "../services/databaseServices";
const { width, height } = Dimensions.get("screen");

function MedicalDataScreen() {
  const navigation = useNavigation();

  const data = useRoute().params;
  const today = new Date().toISOString();

  const [bpData, setBPData] = useState({
    sys: "",
    dia: "",
  });

  const [medicalData, setMedicalData] = useState({
    bp: "",
    date: today.split("T")[0],
    f_id: null,
    isVisited: false,
    photo: null,
    sugar_level: "",
    temperature: "",
    v_id: data.v_id,
  });

  const [image, setImage] = useState(null);
  const [imagePermission, setImagePersmission] = useState(null);

  useEffect(() => {
    (async () => {
      const status = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setImagePersmission(status.status === "granted");
    })();
  }, []);

  const onInputChange = (name, text) => {
    setMedicalData((pv) => {
      return {
        ...pv,
        [name]: text,
      };
    });
  };

  const onBPDataChange = (name, text) => {
    setBPData((pv) => {
      return {
        ...pv,
        [name]: text,
      };
    });
  };

  const isAllValueFilled = (medicalData) => {
    return (
      medicalData.f_id !== null &&
      bpData.sys !== "" &&
      bpData.dia !== "" &&
      medicalData.sugar_level !== "" &&
      medicalData.temperature !== ""
      // medicalData.photo !== ""
    );
  };

  const onSubmitData = async () => {
    const f_id = JSON.parse(await getValueFor("user")).e_id;
    medicalData.bp = bpData.sys + "/" + bpData.dia;
    medicalData.f_id = f_id;
    if (!isAllValueFilled(medicalData)) {
      Alert.alert("Please fill all data!");
    } else {
      medicalData.isVisited = 1;
      storeRecord(medicalData);
    }
  };

  const storeRecord = async () => {
    console.log(medicalData);
    console.log("sent");
    insertMedicalData(medicalData)
      .then((success) => {
        removeRecordFromAppointmentTable(data.v_id)
          .then((success) => {
            navigation.goBack();
          })
          .catch((error) => {
            Alert.alert("Error, please submit again.");
          });
      })
      .catch((error) => {
        Alert.alert("Error, please submit again.");
      });
  };

  const openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      onInputChange("photo", result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      onInputChange("photo", result.assets[0].uri);
    }
  };

  const onClear = () => {
    setImage(null);
    onInputChange("photo", "");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.screen}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 8,
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                borderRadius: 12,
                padding: 8,
                margin: 4,
                elevation: 8,
                backgroundColor: COLOR.shade2,
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Text
                style={{
                  margin: 8,
                  color: COLOR.black,
                  fontWeight: "600",
                  fontSize: width / 16,
                }}
              >
                {data.name}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                elevation: 8,
                padding: 8,
                margin: 4,
                borderRadius: 12,
                backgroundColor: COLOR.shade4,
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Text
                style={{
                  margin: 8,
                  fontSize: width / 28,
                  fontWeight: "300",
                  color: COLOR.white,
                }}
              >
                {data.address}
              </Text>
            </View>
          </View>
          <View>
            <View
              style={{
                elevation: 8,
                height: 96,
                width: 96,
                borderRadius: 12,
                padding: 8,
                justifyContent: "center",
                alignItems: "center",
                margin: 4,
                backgroundColor: COLOR.shade4,
                overflow: "hidden",
              }}
            >
              <Text
                style={{
                  color: COLOR.white,
                  fontSize: width / 24,
                  fontWeight: "400",
                }}
              >
                <Text
                  style={{
                    fontSize: width / 16,
                    fontWeight: "600",
                  }}
                >
                  {data.age}
                </Text>{" "}
                yrs
              </Text>
            </View>
            <View
              style={{
                elevation: 8,
                height: 96,
                width: 96,
                borderRadius: 12,
                padding: 8,
                margin: 4,
                backgroundColor: COLOR.shade2,
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <Ionicons
                name={data.gender == "M" ? "male" : "female"}
                size={48}
                color={COLOR.primaryColor}
              />
            </View>
          </View>
        </View>
        <Divider />
        <View
          style={{
            minheight: height / 12,
            maxHeight: height / 4,
            elevation: 8,
            borderRadius: 12,
            marginHorizontal: 4,
            marginVertical: 24,
            padding: 8,
            backgroundColor: COLOR.shade5,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              padding: 8,
              fontSize: width / 24,
              fontWeight: "400",
              color: COLOR.white,
            }}
          >
            {data.instruction}
          </Text>
        </View>
        <Divider />
        <View style={{ marginVertical: 8 }}>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flex: 1,
                height: 148,
                margin: 4,
                borderRadius: 16,
                backgroundColor: COLOR.shade4,
                overflow: "hidden",
                padding: 8,
                elevation: 8,
              }}
            >
              <Text
                style={{
                  paddingTop: 8,
                  paddingLeft: 8,
                  fontSize: width / 20,
                  fontWeight: "500",
                  color: COLOR.white,
                }}
              >
                Blood{"\n"}Pressure{" "}
                <Text
                  style={{
                    fontWeight: "300",
                    fontSize: width / 24,
                  }}
                >
                  (mmHg)
                </Text>
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TextInput
                  style={styles.textinput}
                  keyboardType="numeric"
                  selectionColor={COLOR.white}
                  placeholder="SYS"
                  placeholderTextColor={COLOR.gray}
                  onChangeText={(text) => {
                    onBPDataChange("sys", text);
                  }}
                />
                <Text
                  style={{
                    color: COLOR.white,
                    fontSize: width / 12,
                  }}
                >
                  {"/"}
                </Text>
                <TextInput
                  style={styles.textinput}
                  keyboardType="numeric"
                  selectionColor={COLOR.white}
                  placeholder="DIA"
                  placeholderTextColor={COLOR.gray}
                  onChangeText={(text) => {
                    onBPDataChange("dia", text);
                  }}
                />
              </View>
            </View>
            <View
              style={{
                height: 148,
                width: 148,
                margin: 4,
                borderRadius: 16,
                backgroundColor: COLOR.shade2,
                overflow: "hidden",
                padding: 8,
                elevation: 8,
              }}
            >
              <Text
                style={{
                  paddingTop: 8,
                  paddingLeft: 8,
                  fontSize: width / 24,
                  color: COLOR.black,
                  fontWeight: "500",
                }}
              >
                Body{"\n"}Temperature{" "}
                <Text
                  style={{
                    fontWeight: "300",
                    fontSize: width / 24,
                  }}
                >
                  (°F)
                </Text>
              </Text>
              <TextInput
                style={styles.textinputBlack}
                keyboardType="numeric"
                selectionColor={COLOR.black}
                placeholderTextColor={COLOR.black}
                onChangeText={(text) => {
                  onInputChange("temperature", text);
                }}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View
              style={{
                height: 148,
                width: 148,
                margin: 4,
                borderRadius: 16,
                backgroundColor: COLOR.shade2,
                overflow: "hidden",
                padding: 8,
                elevation: 8,
              }}
            >
              <Text
                style={{
                  paddingTop: 8,
                  paddingLeft: 8,
                  fontSize: width / 24,
                  color: COLOR.black,
                  fontWeight: "500",
                }}
              >
                Body {"\n"}Weight{" "}
                <Text
                  style={{
                    fontWeight: "300",
                    fontSize: width / 24,
                  }}
                >
                  (Kg)
                </Text>
              </Text>

              {/* <TextInput
                style={styles.textinputBlack}
                keyboardType="numeric"
                selectionColor={COLOR.black}
                placeholderTextColor={COLOR.black}
                onChangeText={(text) => {
                  onInputChange("weight", text);
                }}
              /> */}
            </View>
            <View
              style={{
                flex: 1,
                height: 148,
                margin: 4,
                borderRadius: 16,
                backgroundColor: COLOR.shade4,
                padding: 8,
                elevation: 8,
              }}
            >
              <Text
                style={{
                  paddingTop: 8,
                  paddingLeft: 8,
                  fontSize: width / 20,
                  color: COLOR.white,
                  fontWeight: "500",
                }}
              >
                Blood {"\n"}Sugar Level{" "}
                <Text
                  style={{
                    fontWeight: "300",
                    fontSize: width / 24,
                  }}
                >
                  (mg/dL)
                </Text>
              </Text>
              <View
                style={{
                  alignItems: "flex-start",
                }}
              >
                <TextInput
                  style={styles.textinput}
                  keyboardType="numeric"
                  selectionColor={COLOR.white}
                  placeholderTextColor={COLOR.white}
                  onChangeText={(text) => {
                    onInputChange("sugar_level", text);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        <Divider />
        <View
          style={{
            marginVertical: 8,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {image ? (
            <View
              style={{
                flexDirection: "column",
              }}
            >
              <Image
                source={{ uri: image }}
                style={{
                  margin: 8,
                  borderRadius: 12,
                  width: width / 2,
                  height: width / 2,
                }}
              />
              <TouchableOpacity activeOpacity={0} onPress={onClear}>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: width / 20,
                    borderColor: COLOR.black,
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                >
                  Clear
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                height: width / 2,
                width: width / 2,
                borderBottomColor: COLOR.black,
                borderWidth: 1,
                margin: 8,
                borderRadius: 12,
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="camera"
                size={width / 8}
                color={COLOR.gray}
                onPress={() => {
                  openCamera();
                }}
              />
              <Ionicons
                name="image"
                size={width / 8}
                color={COLOR.gray}
                onPress={() => {
                  uploadImage();
                }}
              />
            </View>
          )}
        </View>

        <Divider />

        <View
          style={{
            elevation: 8,
          }}
        >
          <CustomButton
            style={{
              marginHorizontal: 4,
              padding: 8,
              borderRadius: 12,
            }}
            onPress={onSubmitData}
            title="submit"
            textColor={COLOR.white}
            backgroundColor={COLOR.primaryColorDark}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: COLOR.white,
    padding: 8,
  },
  textinput: {
    width: width / 6,
    padding: 8,
    borderBottomWidth: 2,
    borderColor: COLOR.white,
    fontSize: width / 16,
    color: COLOR.white,
    margin: 8,
  },
  textinputBlack: {
    width: width / 6,
    padding: 8,
    borderBottomWidth: 2,
    borderColor: COLOR.black,
    fontSize: width / 16,
    color: COLOR.black,
    margin: 8,
  },
});

export default MedicalDataScreen;
