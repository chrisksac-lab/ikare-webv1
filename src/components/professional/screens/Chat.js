import React, { useEffect, useState } from 'react'
import { Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import tw from "twrnc"
import axiosInstance from '../../../utils/axiosInstance/axiosInstance'
import {MaterialIcons} from "@expo/vector-icons"
import { getStoredUser } from '../../../services/storage'
import { Image } from 'react-native'
import { FlatList } from 'react-native'
import { ActivityIndicator } from 'react-native'
import { TouchableOpacity } from 'react-native'
import {useQuery, useQueryClient} from "@tanstack/react-query"
import {sortContacts} from "../../../utils/scripts/script";
import { Avatar } from 'react-native-elements'

function Chat({navigation}) {
const [enteredContact, setEnteredContact] = useState("")
const [openModal, setOpenModal] = useState(false)
const [activeUser, setActiveUser] = useState()
const [originalChattedContact, setOriginalChattedContact] = useState([])
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
  const url = "/api/user/get-users";
  try  {
    const response = await axiosInstance.get(url)
    const dbUsers = response.data.data;
    const contacts = [...dbUsers].filter(dbUser => dbUser?._id != activeUser?._id)
    const chattedContact = []
    contacts.forEach(contact => {
        let notifs = contact?.notifications.filter(notifs => (notifs.sender === activeUser?._id || notifs.receiver === activeUser?._id))
        let unRead = notifs.filter(not => (not.status == "PENDING" && not.sender==contact?._id))
        if (notifs?.length > 0)
          {
            const lastNotif = notifs[notifs.length-1]
            chattedContact.push({...contact, lastNotif, unReadMessages:unRead.length})
          }
    })
    setChattedContact(sortContacts(chattedContact))
    setOriginalChattedContact(sortContacts(chattedContact))
    return contacts
  }
  catch(error) {
    console.log(error)
  }
}
const {data, isLoading} = useQuery({queryKey:["get-otherusers"], queryFn:getOtherUsers})
const [chattedContact, setChattedContact] = useState([])

const handleOpenSingleContact = (contact) => {
  navigation.navigate("StackChatScreen", {contact})
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
     <TouchableOpacity onPress={() => handleOpenSingleContact(item)} style={tw`flex flex-row border-b gap-2 border-gray-600 items-center py-4 bg-gray-200`}>
          {
             item?.image ?
             <Avatar size={50} rounded source={{uri: axiosInstance.getUri() + item.image}} /> :
             <Avatar size={50} containerStyle={{backgroundColor: "teal"}} rounded title={item?.fullname[0].toUpperCase()+item?.fullname[1].toUpperCase()} />
            //  <MaterialIcons name="account-circle" size={36} />
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
const handleReset = () => {
    if (enteredContact.trim() === "") {
      setChattedContact(originalChattedContact);
    }
}
  return (
    <>
    <Modal
        statusBarTranslucent
        visible={openModal}
        animationType="slide"
        presentationStyle="fullScreen"
        >
          <View style={tw`h-full`}>
          <MaterialIcons size={32} onPress={() => setOpenModal(false)} name="close" style={tw`text-right top-5 right-5`} />
            <Text style={tw`text-[20px] font-bold text-blue-800 text-center mt-5]`}>Select a contact from the list</Text>
          <FlatList 
            data={data}
            renderItem={renderContactItem}
            refreshing
            keyExtractor={(item) => item._id.toString()}
          />
          </View>
      </Modal>
      <View style={tw`p-4 h-full mt-7`}>
          <Text style={tw`text-[28px] font-bold`}>Chat</Text>
          <View style={tw`flex rounded-3 border border-gray-300 p-2 flex-row justify-between items-center`}>
            <MaterialIcons 
             style={tw`text-gray-400`}
            name='search' size={24} />
            <TextInput 
             value={enteredContact}
             onChangeText={(text) =>{setEnteredContact(text); handleSearchContact(); handleReset()}}
             placeholder='Search contact or message'
             style={tw`w-[85%]`}
            />
        </View>
        {
        isLoading ?
          <View style={"mt-7"}>
          <Text style={tw`text-center`}>Loading ....</Text>
          <ActivityIndicator size={36} style={tw`mt-3`}  />
        </View>
        :
        <View style={tw`mt-2`}>
          <FlatList 
          data={chattedContact}
          refreshing
          renderItem={renderLastMessageContactItem}
          keyExtractor={(item) => item._id}
        />
        </View>
          }
              <MaterialIcons onPress={() => setOpenModal(!openModal)} style={tw`p-2 bg-teal-800 absolute bottom-10 text-white right-5 rounded-[25px]`} name="add" size={32}/>
      </View>
    </>
  )
}

export default Chat