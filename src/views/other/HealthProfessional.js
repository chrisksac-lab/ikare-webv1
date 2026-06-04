import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import Home from "../../components/professional/screens/Home";
import Appointment from "../../components/professional/screens/Appointment";
import Notification from "../../components/professional/screens/Notification";
import Chat from "../../components/professional/screens/Chat";
import {
  MaterialCommunityIcons,
  FontAwesome,
  MaterialIcons,
} from "react-native-vector-icons";
import tw from "twrnc";
import { StatusBar } from "expo-status-bar";
import Laboratory from "../../components/professional/screens/Laboratory";
import ChatNavigation from "../../components/professional/navigation/ChatNavigation";
import { getStoredUser, getValue } from "../../services/storage";

function HealthProfessional() {
  const Bottom = createBottomTabNavigator();
  const [appointmentBadge, setAppointmentBadge] = useState()
  const [notifications, setNotifications] = useState()
  const [chat, setChat] = useState()
  useEffect(() => {
    async function getDetails() {
      const hospital = JSON.parse(await getValue("hospital"))
      const user = await getStoredUser()
      const appointmentBadge = [...user?.appointments].filter(appointment => appointment?.status == "PENDING").length
      setAppointmentBadge(appointmentBadge)
      setHospital(hospital?.name)
    }
    getDetails()
  })
  const [hospital, setHospital] = useState("ODZA District Hospital");
  return (
    <>
      <StatusBar style="light" />
        <Bottom.Navigator>
          <Bottom.Screen
            options={{
              // headerShown: false,
              headerStyle: tw`bg-[#0C3778]`,
              headerTintColor: "#FFFFFF",
              headerTitleAlign: "center",
              headerTitle: hospital,
              tabBarLabel: "Home",
              tabBarLabelStyle: tw`font-bold`,
              tabBarActiveTintColor: `#0C3778`,
              // tabBarActiveBackgroundColor: `#0C3778`,
              tabBarItemStyle: tw`rounded-[15px] p-1`,
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="home" color={color} size={size} />
              ),
            }}
            name="Home"
            component={Home}
          />
          <Bottom.Screen
            name="Appointments"
            component={Appointment}
            options={{
              headerStyle: tw`bg-[#0C3778]`,
              headerTintColor: "#FFFFFF",
              headerTitleAlign: "center",
              tabBarBadge: appointmentBadge > 0 ? appointmentBadge : "",
              tabBarLabelStyle: tw`font-bold`,
              tabBarActiveTintColor: `#0C3778`,
              // tabBarActiveBackgroundColor: `#0C3778`,
              tabBarItemStyle: tw`rounded-[15px] p-1`,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  color={color}
                  size={size}
                  name="calendar-clock"
                />
              ),
            }}
          />
          <Bottom.Screen
            name="Bot"
            component={Laboratory}
            options={{
              headerStyle: tw`bg-[#0C3778]`,
              headerTitle: "iKare Bot",
              headerTitleAlign: "center",
              // headerLeft: ({tintColor}) => <MaterialCommunityIcons color="white" size={28} name="robot" />,
              headerTintColor: "#FFFFFF",
              tabBarLabelStyle: tw`font-bold`,
              tabBarActiveTintColor: `#0C3778`,
              // tabBarActiveBackgroundColor: `#0C3778`,
              tabBarItemStyle: tw`rounded-[15px] p-1`,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="robot" color={color} size={size} />
              ),
            }}
          />
          <Bottom.Screen
            name="Chat"
            component={ChatNavigation}
            options={{
              headerStyle: tw`bg-[#0C3778]`,
              headerShown: false,
              headerTintColor: "#FFFFFF",
              tabBarBadge: 4,
              headerTitleAlign: "center",
              tabBarLabelStyle: tw`font-bold`,
              tabBarActiveTintColor: `#0C3778`,
              // tabBarActiveBackgroundColor: `#0C3778`,
              tabBarItemStyle: tw`rounded-[15px] p-1`,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="comment-multiple-outline"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Bottom.Screen
            name="Notification"
            component={Notification}
            options={{
              headerStyle: tw`bg-[#0C3778]`,
              headerTintColor: "#FFFFFF",
              tabBarBadge: 2,
              headerTitleAlign: "center",
              tabBarLabelStyle: tw`font-bold`,
              tabBarActiveTintColor: `#0C3778`,
              // tabBarActiveBackgroundColor: `#0C3778`,
              tabBarItemStyle: tw`rounded-[15px] p-1`,
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons
                  name="notifications-none"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        </Bottom.Navigator>
    </>
  );
}

export default HealthProfessional;
