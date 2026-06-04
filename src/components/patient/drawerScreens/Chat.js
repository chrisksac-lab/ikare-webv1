import React, { useEffect, useState } from 'react'
import { Alert, Modal, TouchableOpacity, Text, TextInput, View } from 'react-native'
import tw from "twrnc"
import ContactCard from '../cards/ContactCard'
import axiosInstance from '../../../utils/axiosInstance/axiosInstance'
import {MaterialIcons} from "@expo/vector-icons"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getStoredUser } from '../../../services/storage'
import { Image } from 'react-native'
import { FlatList, ActivityIndicator } from 'react-native'
import NetInfo from "@react-native-community/netinfo"
import Toast from 'react-native-toast-message';
import * as Notifications from "expo-notifications";
import * as Device from "expo-device"
import * as Constants from "expo-constants";
import { Avatar } from 'react-native-elements'
import { sortContacts } from '../../../utils/scripts/script'

export async function registerForPushNotificationsAsync() {
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
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid

    if (Constants.easConfig?.projectId) {
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.easConfig.projectId, // you can hard code project id if you dont want to use expo Constants
        })
      ).data;
      console.log(token);
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

function Chat({navigation, route}) {
  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got notification! 🔔",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }
const [enteredContact, setEnteredContact] = useState("")
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
})

NetInfo.fetch().then(state => {
    if (!state.isConnected) {
      Toast.show({
        type: "info",
        text1: "Check your internet connection !"
      })
    }
})
.catch(error => Toast.show({
  type: "error",
  text1: error
}))
const [openModal, setOpenModal] = useState(false)
const [activeUser, setActiveUser] = useState()
const queryClient = useQueryClient();
useEffect(() => {
  async function getCurrent () {
    setActiveUser(await getStoredUser())
  }
  setInterval(() => {
    queryClient.invalidateQueries();
  }, 500);
  getCurrent()
}, [])
const [chattedContact, setChattedContact] = useState([])
const [originalChattedContact, setOriginalChattedContact] = useState([])

const handleSearchContact = () => {
  setChattedContact(originalChattedContact)
  if (enteredContact)
  {
    const filteredContact = [...chattedContact].filter(contact => contact?.fullname.toLowerCase().includes(enteredContact.trim().toLowerCase()))
    if (filteredContact.length == 0) {
        const extendedFilter = []
        chattedContact.forEach(chatContact => {
            const notifications = chatContact.notifications;
            const match = [...notifications].filter(notification => (notification?.message.toLowerCase().includes(enteredContact.trim().toLowerCase())))
            if (match.length > 0)
                extendedFilter.push(chatContact)
        })
        setChattedContact(extendedFilter)
    }
    else
    setChattedContact(filteredContact)
  }
}

const getOtherUsers = async () => {
  // await schedulePushNotification()()
  const activeUser = await getStoredUser()
  const url = "/api/user/get-users";
  try  {
    const response = await axiosInstance.get(url)
    const dbUsers = response.data.data;
    const contacts = [...dbUsers].filter(dbUser => dbUser?._id != activeUser?._id)
    const chattedContact = []
    contacts.forEach(contact => {
        let notifs = contact?.notifications.filter(notifs => (notifs.sender === activeUser?._id || notifs.receiver === activeUser?._id))
        if (notifs?.length > 0)
          {
            const lastNotif = notifs[notifs.length-1]
            chattedContact.push({...contact, lastNotif})
          }
    })
    setChattedContact(sortContacts(chattedContact));
    setOriginalChattedContact(sortContacts(chattedContact));   
    return contacts
  }
  catch(error) {
    console.log(error)
  }
}
const {data, isError, isLoading, error} = useQuery({queryKey: ["other-users"], queryFn:getOtherUsers})
const handleOpenSingleContact = (contact) => {
  navigation.navigate("DrawerChatScreen", {contact})
}
const renderContactItem = ({item}) => {
  return (
     <TouchableOpacity onPress={() => handleOpenSingleContact(item)} style={tw`p-4 flex flex-row border-b gap-6 border-gray-200 items-center`}>
          {
             item?.image ?
             <Avatar rounded size={50} source={{uri: axiosInstance.getUri() + item.image}} /> :
             <Avatar size={50} containerStyle={{backgroundColor: "teal"}} rounded title={item?.fullname[0].toUpperCase()+item?.fullname[1].toUpperCase()} />
          }
          <Text style={tw`text-[18px] font-semibold`}>{item?.fullname}</Text>
     </TouchableOpacity> 
  )
}
const renderLastMessageContactItem = ({item}) => {
  return (
     <TouchableOpacity onPress={() => handleOpenSingleContact(item)} style={tw`flex flex-row border-b gap-4 border-gray-600 items-center py-4 bg-gray-200`}>
          {
             item?.image ?
             <Avatar rounded size={50} source={{uri: axiosInstance.getUri() + item.image}} /> :
             <Avatar size={50} containerStyle={{backgroundColor: "teal"}} rounded title={item?.fullname[0].toUpperCase()+item?.fullname[1].toUpperCase()} />
          }
          <View>
            <View style={tw`flex flex-row justify-between items-center`}>
              <Text style={tw`text-[18px] font-bold`}>{item?.fullname}</Text>
              {item?.unReadMessages > 0 && <Text style={tw`text-center px-2 py-1 bg-blue-800 text-white rounded-full`}>{item?.unReadMessages}</Text>}
            </View>
            <View style={tw`flex flex-row items-center justify-between gap-4`}>
              <Text style={tw`w-[55%] font-semibold text-[12px] overflow-hidden`}>{item.lastNotif?.message=="" ? <MaterialIcons size={24} name="image" /> : item.lastNotif?.message}</Text> 
              <Text style={tw`text-teal-700 text-[12px] font-black`}>
                {new Date().getDate() != new Date(item?.lastNotif?.date).getDate() ? new Date(item?.lastNotif?.date).toLocaleDateString() : new Date(item?.lastNotif?.date).getHours()+":"+new Date(item?.lastNotif?.date).getMinutes()}
            </Text>
            </View>
          </View>
     </TouchableOpacity> 
  )
}

  return (
    <>
      <Modal
        visible={openModal}
        animationType='slide'
        presentationStyle="fullScreen"
        style={tw`p-4 bg-gray-800 text-white`}
        >
          <MaterialIcons size={32} onPress={() => setOpenModal(false)} name="close" style={tw`text-right top-7 right-5`} />
            <Text style={tw`text-center text-[18px] font-semibold text-blue-800 mt-5`}>Select a contact from list</Text>
          <FlatList 
            data={data}
            renderItem={renderContactItem}
            keyExtractor={(item) => item._id.toString()}
          />
      </Modal>
      <View style={tw`p-4 h-full`}>
        <View style={tw`flex flex-row justify-between items-center`}>
          <Text style={tw`text-8 text-[#0C3778] font-semibold text-center`}>CHAT</Text>
          <View style={tw`flex w-[70%] rounded-3 border border-gray-300 p-2 flex-row justify-between items-center`}>
            <MaterialIcons 
             style={tw`text-gray-400`}
            name='search' size={24} />
            <TextInput 
             value={enteredContact}
             onChangeText={(text) =>{setEnteredContact(text); handleSearchContact()}}
             placeholder='Search contact or message'
             style={tw`w-[85%]`}
            />
          </View>
        </View>
        {
          isLoading ?
          <ActivityIndicator style={tw`mt-5`} size={40}  />
          :
          <View style={tw`mt-2`}>
            <FlatList 
            data={chattedContact}
            renderItem={renderLastMessageContactItem}
            keyExtractor={(item) => item._id.toString()}
          />
          </View>
          }
          <MaterialIcons onPress={() => setOpenModal(!openModal)} style={tw`p-2 bg-teal-800 absolute bottom-5 text-white right-5 rounded-[25px]`} name="add" size={32}/>
      </View>
    </>
  )
}

export default Chat