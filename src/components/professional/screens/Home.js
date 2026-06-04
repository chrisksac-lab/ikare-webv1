import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import tw from "twrnc";
import { MaterialIcons } from "@expo/vector-icons";
import InfoCard from "../cards/InfoCard";
import ConsultationCard from "../cards/ConsultationCard";
import { getStoredUser, getValue } from "../../../services/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { Dimensions } from "react-native";
import axiosInstance from "../../../utils/axiosInstance/axiosInstance";
import { Avatar } from "react-native-elements";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

function Home({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const bar_data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };
  const [appointment, setAppointment] = useState();
  const compareFunction = (dateStringA, dateStringB) => {
    const milliA = new Date(dateStringA).getTime();
    const milliB = new Date(dateStringB).getTime();
    return milliA - milliB;
  };
  const [activeUser, setActiveUser] = useState();
  const handleLogOut = async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("role");
    await AsyncStorage.removeItem("hospital");
    navigation.push("NavigationStacks");
  };
  const getActiveDetails = async () => {
    const url = "/api/user/get-singleuser";
    const user = await getStoredUser();
    const userRole = await getValue("role");
    const hospitalS = await getValue("hospital");
    const host = JSON.parse(hospitalS);
    try {
      const response = await axiosInstance.post(url, {
        id: user?._id,
        hospitalName: host?.name,
      });
      const accepted = [...response.data.data?.appointments].filter(
        (appt) => appt.status === "ACCEPTED"
      );
      const appointments = accepted;
      const acceptedAppointments = [...appointments].filter(
        (appt) => appt.status === "ACCEPTED"
      );
      const filteredAppointments = [...acceptedAppointments].sort((a, b) =>
        compareFunction(a, b)
      );
      setAppointment(filteredAppointments[0]);
      return accepted;
    } catch (error) {
      console.log("ERROR", error.response.data.message ?? error.message);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["data"],
    queryFn: getActiveDetails,
  });
  useEffect(() => {
    async function getUser() {
      setActiveUser(await getStoredUser());
    }
    // getActiveDetails()
    getUser();
  });
  return (
    <>
      <ScrollView>
        <Modal
          visible={modalVisible}
          animationType="slide"
          presentationStyle="formSheet"
        >
          <View style={tw`p-4`}>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <MaterialIcons name="close" size={30} style={tw`text-right`} />
            </TouchableOpacity>
            <View style={tw`mt-5 flex-col justify-between items-start h-2/3`}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Profile")}
                style={tw`flex gap-8 flex-row items-center justify-start`}
              >
                <MaterialIcons name="account-circle" size={25} />
                <Text style={tw`text-5 font-semibold`}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Settings")}
                style={tw`flex gap-8 flex-row items-center justify-start`}
              >
                <MaterialIcons name="settings" size={25} />
                <Text style={tw`text-5 font-semibold`}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Prescription")}
                style={tw`flex flex-row gap-8 items-center justify-start`}
              >
                <MaterialIcons name="medical-services" size={25} />
                <Text style={tw`text-5 font-semibold`}>Prescription</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleLogOut()}
                style={tw`flex flex-row gap-8 items-center justify-start`}
              >
                <MaterialIcons name="logout" size={25} />
                <Text style={tw`text-5 font-semibold`}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex flex-row gap-8 items-center justify-start`}
              >
                <MaterialIcons name="help" size={25} />
                <Text style={tw`text-5 font-semibold`}>Help</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={tw`p-4`}>
          <View style={tw`flex flex-row justify-between items-center`}>
            <View style={tw`flex flex-row gap-2 justify-between items-center`}>
              {activeUser?.image ? (
                <Avatar
                  rounded
                  size={50}
                  source={{ uri: axiosInstance.getUri() + activeUser.image }}
                />
              ) : (
                <MaterialIcons name="account-circle" size={60} />
              )}
              <View style={tw``}>
                <Text style={tw`text-[#0C3778] font-semibold`}>
                  Welcome back,
                </Text>
                <Text style={tw`text-5 text-blue-950 font-semibold`}>
                  {activeUser?.fullname}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <MaterialIcons name="menu-open" size={30} />
            </TouchableOpacity>
          </View>
          <Text style={tw`mt-8 text-[16px] font-semibold`}>Consultations</Text>
          <View
            style={tw`flex flex-row items-center justify-between w-full`}
          >
            <LineChart
              data={{
                labels: [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                ],
                datasets: [
                  {
                    data: [110, 100, 150, 80, 200, 100],
                  },
                ],
              }}
              width={Dimensions.get("window").width - 30} // from react-native
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#0C3778",
                backgroundGradientFrom: "#0C3778",
                backgroundGradientTo: "teal",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
          <Text style={tw`mt-6 text-[16px] font-semibold`}>Appointments</Text>
          <BarChart
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            data={bar_data}
            width={Dimensions.get("window").width - 30} // from react-native
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "teal",
              backgroundGradientFrom: "teal",
              backgroundGradientTo: "yellowgreen",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            verticalLabelRotation={30}
          />
          <Text style={tw`mt-3 text-5 font-semibold text-[#0C3778]`}>
            Upcoming Consultation
          </Text>
          <ScrollView horizontal>
            <View style={tw`flex flex-row justify-between items-center gap-4 p-2 mt-2`}>
              <View
                style={tw`w-6/12 rounded-[15px] p-4 bg-white flex flex-col justify-between items-start shadow gap-2`}
              >
                <View
                  style={tw`flex w-full flex-row justify-between items-center`}
                >
                  <MaterialIcons name="person" size={28} color={"teal"} />
                  <MaterialIcons name="menu-open" size={28} />
                </View>
                <Text style={tw`text-[16px] font-semibold`}>
                  Patient: {appointment?.user}
                </Text>
                <Text style={tw`text-[16px] font-semibold`}>
                  Details: {appointment?.details}
                </Text>
                <Text style={tw`text-[16px] font-semibold`}>
                  Date: {new Date(appointment?.date).toLocaleDateString() + " "+ new Date(appointment?.date).toLocaleTimeString()}
                </Text>
              </View>
              <View
                style={tw`w-6/12 rounded-[15px] p-4 bg-white flex flex-col justify-between items-start shadow gap-2`}
              >
                <View
                  style={tw`flex w-full flex-row justify-between items-center`}
                >
                  <MaterialIcons name="person" size={28} color={"teal"} />
                  <MaterialIcons name="menu-open" size={28} />
                </View>
                <Text style={tw`text-[16px] font-semibold`}>
                  Patient: {appointment?.user}
                </Text>
                <Text style={tw`text-[16px] font-semibold`}>
                  Details: {appointment?.details}
                </Text>
                <Text style={tw`text-[16px] font-semibold`}>
                  Date: {new Date(appointment?.date).toLocaleDateString() + " "+ new Date(appointment?.date).toLocaleTimeString()}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
}

export default Home;
