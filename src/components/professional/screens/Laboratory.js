import React, { useState, useEffect, useCallback } from 'react'
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import tw from "twrnc"
import {MaterialIcons, MaterialCommunityIcons} from "@expo/vector-icons"
import MessageCard from '../../patient/cards/MessageCard'
import axiosInstance from '../../../utils/axiosInstance/axiosInstance'
import { getStoredUser, getValue } from '../../../services/storage'
import { io } from "socket.io-client";
import Toast from 'react-native-toast-message'
import axios from 'axios'

function Laboratory() {
  const [currentConversation, setCurrentConversation] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [isSending, setIsSending] = useState(false);
  useEffect(() => {
      const getUser = async () => {
          const activeUser = await getStoredUser();
          setActiveUser(activeUser)
      };
      getUser()
  },[]);
  const [newMessage, setNewMessage] = useState("")
    const sendMessage = () => {
        const date = new Date();
        setIsSending(true);
        const data = {
            sender: activeUser?._id,
            receiver: "bot"+date.getTime(),
            message: newMessage,
            documents: [],
            time: date
        }
        setCurrentConversation((state) => [...state,data])
        if (newMessage) {
            const djangoUrl = "http://192.168.111.160:8000/api/diseases/";
            axios.post(djangoUrl, {symptoms: newMessage})
            .then((response) => setCurrentConversation(state => [...state, {
              sender: "bot"+new Date().getTime(),
              receiver: activeUser._id,
              message: "Various possibilities include: "+ response.data.data.final_prediction.toString(),
              documents: [],
              time: new Date()
          }]))
            .catch(error => console.log(error))
            .finally(() => {
              setNewMessage("");
              setIsSending(false);
            })
        }
    }
    const renderMessageItem = useCallback(({item}) => (
        <MessageCard
            key={item?._id} 
            incoming={item?.sender === activeUser?._id ? false : true}
            documents= {item?.documents ?? []}
            message={item?.message}
            time={item?.date}
        />
    ), []);
  return (
    <View style={tw`h-full`}>
        {/* <View style={tw`bg-[#0C3778] p-4 flex flex-row justify-between items-center`}>
              <View style={tw`flex flex-row justify-between items-center w-[57%]`}>
                <MaterialCommunityIcons name="robot" size={40} color="white" />
             <View>
             <Text style={tw`text-white text-4 font-semibold`}>iKare Bot</Text>
            </View>
        </View>
            <View style={tw`flex flex-row justify-between items-center w-[20%]`}>
            <MaterialIcons name="phone" size={24} color="white" />
            <MaterialIcons name="videocam" size={30} color="white" />           
            </View>
        </View> */}
        <View style={tw`p-4 h-[80%]`}>
                <FlatList 
                 keyExtractor={(item) => item._id}
                 ListEmptyComponent={() => (
                    <View style={tw`p-4`}>
                      <Text style={tw`text-center text-[15px] font-semibold`}>Remember to separate symptoms with a comma ","</Text>
                    </View>
                 )}
                 data={currentConversation}
                 renderItem={renderMessageItem}
                />
        </View>
        <View style={tw`flex flex-row justify-between items-center absolute bottom-0 left-0 right-0`}>
                <View style={tw`p-4 rounded-5 bg-gray-700 w-[90%] flex flex-row justify-start gap-4 items-center`}>
                    <MaterialIcons 
                    style={tw`text-white`} name="emoji-emotions" size={30} />
                    <TextInput 
                      placeholder='Message'
                      value={newMessage}
                      style={tw`text-white w-[65%]`}
                      placeholderTextColor="white"
                      onChangeText={(text) => setNewMessage(text)}
                />
                </View>
                { isSending ? <ActivityIndicator size={"large"} /> : <MaterialIcons onPress={sendMessage} name="send" size={40} style={tw`text-gray-700`} />}
            </View>
    </View>
  )
}

export default Laboratory