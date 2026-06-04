import React, { useState, memo, useEffect } from 'react'
import { ActivityIndicator, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import tw from "twrnc"
import {MaterialIcons, Entypo, FontAwesome} from "@expo/vector-icons"
import MessageCard from '../cards/MessageCard'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../../../utils/axiosInstance/axiosInstance'
import { getStoredUser, getValue } from '../../../services/storage'
import { io } from 'socket.io-client'
import * as DocumentPicker from "expo-document-picker"
import * as ExpoImage from "expo-image-picker"
import { Avatar } from 'react-native-elements'
import * as fs from "expo-file-system"
import Toast from 'react-native-toast-message'
import EmojiSelector from 'react-native-emoji-selector'

function ChatScreen({navigation, route}) {
    const {contact} = route.params
    const [activeUser, setActiveUser] = useState()
    const [socket, setSocket] = useState()
    function getFileExtension(filename, separator){
      // get file extension
      const extension = filename.split(separator).pop();
      return extension;
    }
    async function convertToBlob(file) {
      try {
      const response = await fs.readAsStringAsync(file.uri, {encoding: fs.EncodingType.Base64})
      return response
      }
      catch(error) {
        console.log(error)}
    }
    const takePicture = async () => {
      let result = await ExpoImage.launchCameraAsync({
        mediaTypes: ExpoImage.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: true,
        quality: 1,
        base64: true
      })
      if (!result.canceled) {
          handleAddAttachment(result.assets);
      }
  }

  const handleAddAttachment = (files) => {
    try {
      const date = new Date()
      const filenames = [];
      // for (let i=0; i<files.length;i++) {
      //     filenames.push(files[i].name)
      // }
      socket.emit("attach-mobile-document", {
        sender: activeUser?._id,
        receiver: contact?._id,
        time: date,
        files,
        message: ""
      })
    }
    catch(error) {
       console.log(error.message)
    }
  }

  const [speedDialOpen, setSpeedDialOpen] = useState(false);
   const pickDocument = async () => {
    const activeUser  = await getStoredUser()
    DocumentPicker.getDocumentAsync({
      multiple: true,
      type: ["image/*", "application/pdf"]
    })
    .then(async result => {
      if (!result.canceled)
      {
          var documents = []
          for (let i=0;i<result.assets.length;i++) {
            console.log(result.assets[i].size)
            if (result.assets[i].size > 770000) {
              return Toast.show({
                type: "error",
                text1: "Please upload a document <= 750kB"
              })
            }
            documents.push({
                fileName: result.assets[i].name,
                extension: getFileExtension(result.assets[i].name, "."),
                base64: await convertToBlob(result.assets[i])
            })
            handleAddAttachment(documents)
          }
      }
    })
   }

   useEffect(() => {
    getSocketMessagesAndLoadSocket()
    return () => {
        socket?.disconnect();
    }
}, [])
const getSocketMessagesAndLoadSocket = async () => {
    const socketIO = io(axiosInstance.getUri(), {
        "transports": ['websocket']
      });
      setSocket(socketIO);
      socket?.connect();
      const userRole = await getValue("role");
      const activeUser = await getStoredUser();
        if (userRole === "PATIENT")
        socket?.emit("send-mobile-socket", {...activeUser, userRole})
        else
        {
          const hospital = JSON.parse(await getValue("hospital"))
          socket?.emit("send-mobile-socket", {...activeUser, userRole, hospital_id:hospital?._id})
        }
        socket?.on("private-message", data => {
            if (data?.sender == contact?._id)
            {
              setCurrentConversation((state) => [
                ...state,
                {
                sender: contact?._id,
                receiver: activeUser?._id,
                date: data?.time,
                documents: data?.documents,
                message: data?.message
              }])
            }
          })
}

    const [currentConversation, setCurrentConversation] = useState([])
    const getActiveUser = async() => {
        const activeUser = await getStoredUser()
        setActiveUser(activeUser)
        const url = "/api/user/get-singleuser";
        try {
            const response = await axiosInstance.post(url, {id: activeUser?._id, role:"PATIENT"})
            const notifications = response.data?.data.notifications
            var currentConversation  = [];
            [...notifications].forEach(userNotif => {
            if (userNotif?.sender == contact?._id || userNotif?.receiver==contact?._id)
              currentConversation.push(userNotif)
            })
            setCurrentConversation(currentConversation)
            return currentConversation;
        }  
        catch(error) {
            console.log(error)
        }
      }
    const {data, isLoading} = useQuery({queryKey:["get-active-user"], queryFn:getActiveUser})
    const [newMessage, setNewMessage] = useState("")
    const sendMessage = () => {
        const date = new Date()
        const data = {
            sender: activeUser?._id,
            receiver: contact?._id,
            message: newMessage,
            documents: [],
            time: date
        }
        if (newMessage) {
            socket.emit("send-mobile-message", data)
            // setCurrentConversation()
        }
    }
    const renderMessageItem = ({item}) => (
        <MessageCard 
            incoming={item?.sender === activeUser?._id ? false : true}
            key={item => item?._id}
            message={item?.message}
            documents={item.documents ?? []}
            time={item?.date}
        />
    )
    const [emojiOpen, setEmojiOpen] = useState(false)
  return (
    <>
        <View style={tw`bg-[#0C3778] p-4 flex flex-row justify-between items-center`}>
              <View style={tw`flex flex-row gap-2 justify-between items-center w-[57%]`}>
                <TouchableOpacity
                 onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="keyboard-arrow-left" size={24} color="white" />
              </TouchableOpacity>
              {
                contact?.image ?
                <Avatar rounded size={50} source={{uri: axiosInstance.getUri() + contact.image}} /> :
                <Avatar size={50} containerStyle={{backgroundColor: "teal"}} rounded title={contact?.fullname[0].toUpperCase()+contact?.fullname[1].toUpperCase()} />
              }
              
             <View>
             <Text style={tw`text-white text-4 font-semibold`}>{contact?.fullname}</Text>
            <Text style={tw`text-white text-3`}>5 mins ago</Text>
            </View>
        </View>
            <View style={tw`flex flex-row justify-between items-center w-[20%]`}>
            <MaterialIcons name="phone" size={24} color="white" />
            <MaterialIcons name="videocam" size={30} color="white" />           
            </View>
        </View>
        <View style={tw`p-4 h-[80%]`}>
            {
                isLoading ?
                <ActivityIndicator size={32} />
                :
                <FlatList 
                 keyExtractor={(item) => item._id.toString()}
                 data={currentConversation}
                 renderItem={renderMessageItem}
                />
            }
        </View>
        {emojiOpen &&<View style={tw`p-4 bg-white h-full w-full absolute top-5`}>
                <MaterialIcons name="close" size={28} onPress={() => setEmojiOpen(!emojiOpen)} />
               <EmojiSelector 
               onEmojiSelected={(emoji) => setNewMessage(emoji+newMessage)}
              />
        </View>}
        <View style={tw`flex flex-row justify-between items-center absolute bottom-5 left-0 right-0`}>
                <View style={tw`p-4 rounded-5 bg-gray-700 w-[90%] flex flex-row justify-between items-center`}>
                    <MaterialIcons 
                    onPress={() => setEmojiOpen(!emojiOpen)}
                    style={tw`text-white`} name="emoji-emotions" size={30} />
                    <TextInput 
                      placeholder='Message'
                      value={newMessage}
                      style={tw`text-white w-[65%]`}
                      placeholderTextColor="white"
                      onChangeText={(text) => setNewMessage(text)}

                    />
                    <MaterialIcons onPress={pickDocument} name="attach-file" size={30} style={tw`text-white`} />
                    <MaterialIcons onPress={takePicture} name="camera-alt" size={30} style={tw`text-white`} />
                </View>
                <MaterialIcons onPress={sendMessage} name="send" size={40} style={tw`text-gray-700`} />
            </View>
    </>
  )
}

export default ChatScreen