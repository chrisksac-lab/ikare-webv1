import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { MaterialIcons, FontAwesome, Entypo } from "@expo/vector-icons";
import { Drawer } from "react-native-paper";
import tw from "twrnc";
import { useEffect } from "react";
import { getStoredUser } from "../../../services/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar } from "react-native-elements";
import axiosInstance from "../../../utils/axiosInstance/axiosInstance";

function PatientDrawerContent(props) {
  const [activeUser, setActiveUser] = useState();
  useEffect(() => {
    async function getUser() {
      const user = await getStoredUser();
      setActiveUser(user);
    }
    getUser();
  });
  const handleLogOut = async () => {
    await AsyncStorage.clear();
    props.navigation.push("NavigationStacks");
  };
  const [activeItem, setActiveItem] = useState("Home")
  return (
    <>
      <DrawerContentScrollView {...props} style={tw`bg-white`}>
        {/* <View style={tw`p-4`}>
                <Text style={tw`text-10 font-bold  ml-5`}>iKare</Text>
            </View> */}
        <Drawer.Section>
        <View style={tw`p-4 flex flex-col justify-between items-center`}>
          { activeUser?.image ?
            <Avatar size={100} rounded source={{uri: axiosInstance.getUri() + activeUser.image}} />
          :
          <MaterialIcons
            name="account-circle"
            size={150}
            style={tw`text-gray-700`}
          />}
          <View>
            <Text style={tw` text-center text-5 font-bold`}>
              {" "}
              {activeUser?.fullname}{" "}
            </Text>
            <Text style={tw` text-center text-4`}>{activeUser?.email}</Text>
          </View>
        </View>
        </Drawer.Section>
        <Drawer.Section>
          <DrawerItem
            label={({focused}) => <Text style={tw`font-bold text-gray-700 ${focused ? "text-[#0C3778]": ""}`}>Home</Text>}
            icon={({focused}) => (
              <MaterialIcons
                name="view-quilt"
                size={24}
                style={tw`${focused ? "text-[#0C3778]" : "text-gray-700"}`}
                color={focused ? "#0C3778":"text-gray-700"}
              />
            )}
            focused={activeItem==="Home"}
            onPress={() => {props.navigation.navigate("Home"); setActiveItem("Home")}}
          />
          <DrawerItem
            label={({focused}) => <Text style={tw`font-bold text-gray-700 ${focused ? "text-[#0C3778]": "text-gray-700"}`}>Pharmacies</Text>}
            icon={({focused}) => (
              <MaterialIcons
                name="storefront"
                size={24}
                style={tw`${focused ? "text-[#0C3778]" : "text-gray-700"}`}
                color={focused ? "#0C3778":"text-gray-700"}
              />
            )}
            focused={activeItem==="Pharmacies"}
            onPress={() =>{ props.navigation.navigate("Pharmacies"); setActiveItem("Pharmacies")}}
          />
          <DrawerItem
            label={({focused}) => <Text style={tw`font-bold text-gray-700 ${focused ? "text-[#0C3778]": ""}`}>Appointments</Text>}
            icon={({focused}) => (
              <MaterialIcons
                name="schedule"
                size={24}
                style={tw`${focused ? "text-[#0C3778]" : "text-gray-700"}`}
                color={focused ? "#0C3778":"text-gray-700"}
              />
            )}
            focused={activeItem === "Appointments"}
            onPress={() => {props.navigation.navigate("Appointments"); setActiveItem("Appointments")}}
          />
          <DrawerItem
            label={({focused}) => <Text style={tw`font-bold text-gray-700 ${focused ? "text-[#0C3778]": "text-gray-700"}`}>Consultation</Text>}
            icon={({focused}) => (
              <MaterialIcons
                name="video-chat"
                size={24}
                style={tw`${focused ? "text-[#0C3778]" : "text-gray-700"}`}
                color={focused ? "#0C3778":"text-gray-700"}
              />
            )}
            focused={activeItem==="Consultation"}
            onPress={() => props.navigation.navigate("Consultation")}
          />
          <DrawerItem
            label={({focused}) => <Text style={tw`font-bold text-gray-700 ${focused ? "text-[#0C3778]": "text-gray-700"}`}>EHR</Text>}
            icon={({focused}) => (
              <MaterialIcons
                name="e-mobiledata"
                size={24}
                style={tw`${focused ? "text-[#0C3778]" : "text-gray-700"}`}
                color={focused ? "#0C3778":"text-gray-700"}
              />
            )}
            focused={activeItem==="EHR"}
            onPress={() => {props.navigation.navigate("Emergency"); setActiveItem("EHR")}}
          />
          <DrawerItem
            label={({focused}) => <Text style={tw`font-bold text-gray-700 ${focused ? "text-[#0C3778]": "text-gray-700"}`}>Chat</Text>}
            icon={({focused}) => (
              <MaterialIcons 
                name="chat" 
                size={24}
                style={tw`${focused ? "text-[#0C3778]" : "text-gray-700"}`} 
                color={focused ? "#0C3778":"text-gray-700"} 
                />
            )}
            focused={activeItem==="Chat"}
            onPress={() => {props.navigation.navigate("Chat"); setActiveItem("Chat")}}
          />
          <DrawerItem
            label={({focused}) => <Text style={tw`font-bold text-gray-700 ${focused ? "text-[#0C3778]": "text-gray-700"}`}>Notifications</Text>}
            icon={({focused}) => (
              <MaterialIcons 
                name="notifications" 
                size={24}
                style={tw`${focused ? "text-[#0C3778]" : "text-gray-700"}`} 
                color={focused ? "#0C3778":"text-gray-700"} 
                />
            )}
            focused={activeItem==="Notifications"}
            onPress={() => {props.navigation.navigate("Notifications"); setActiveItem("Notifications")}}
          />
          <DrawerItem
            label={({focused}) => <Text style={tw`font-bold text-gray-700 ${focused ? "text-[#0C3778]": "text-gray-700"}`}>Profile</Text>}
            icon={({focused}) => (
              <MaterialIcons
                name="account-circle"
                size={24}
                style={tw`${focused ? "text-[#0C3778]" : "text-gray-700"}`}
                color={focused ? "#0C3778":"text-gray-700"}
              />
            )}
            focused={activeItem==="Profile"}
            onPress={() => {props.navigation.navigate("Profile"); setActiveItem("Profile")}}
          />
          <DrawerItem
            label="Log Out"
            labelStyle={tw`text-gray-700 font-bold`}
            icon={() => (
              <MaterialIcons
                name="logout"
                size={24}
                style={tw`text-gray-700`}
              />
            )}
            onPress={() => handleLogOut()}
          />
        </Drawer.Section>
      </DrawerContentScrollView>
    </>
  );
}

export default PatientDrawerContent;
