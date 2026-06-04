import React, { useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native'
import tw from "twrnc"
import {MaterialIcons} from "@expo/vector-icons"
import * as DocumentPicker from "expo-document-picker"
import * as ExpoImage from "expo-image-picker"
import {getStoredUser} from "../../../services/storage";
import axiosInstance from "../../../utils/axiosInstance/axiosInstance"
import Toast from 'react-native-toast-message'
import * as fs from 'expo-file-system'
import { useQuery } from '@tanstack/react-query'
import * as Print from "expo-print"
import * as MediaLibrary from "expo-media-library"

function Emergency() {
  const [isLoading, setIsLoading] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [allEhrs, setAllEhrs] = useState([])
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions()
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
  const pickDocument = async() => {
    const activeUser  = await getStoredUser()
      DocumentPicker.getDocumentAsync({
        multiple: true,
        type: ["image/*", "application/pdf"]
      })
      .then(async result => {
        if (!result.canceled)
        {
          setIsLoading(true)
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
                  name: result.assets[i].name,
                  extension: getFileExtension(result.assets[i].name, "."),
                  base64: await convertToBlob(result.assets[i])
              })
            }
        const url = "/api/user/submit-ehr"; 
        axiosInstance.post(url, 
           {user: JSON.stringify(activeUser), 
            length: result.assets.length, 
            platform: "mobile", 
            type: "doc", documents: JSON.stringify(documents)},
           {headers: {"Content-Type": "multipart/form-data", 
          "Accept": "application/json"}})
        .then(response => Toast.show({
          type: "success",
          text1: response?.data?.message
        }))
        .catch(error => {
          console.log(error)
          Toast.show({
          type: "error",
          text1: error?.response?.data?.message ?? error?.message
         })})
        }
      })
      .catch(error => Alert.alert("Error",error))
      .finally(() => setIsLoading(false))
  }
  const pickImage = async () => {
      const activeUser  = await getStoredUser()
      let result = await ExpoImage.launchCameraAsync({
        mediaTypes: ExpoImage.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: true,
        quality: 1,
        base64: true
      })
      if (!result.canceled) {
        setIsCapturing(true)
        const url = "/api/user/submit-ehr";
        axiosInstance.post(url, {user:JSON.stringify(activeUser), platform:"mobile", base64: result.assets[0].base64, extension:getFileExtension(result.assets[0].fileName, ".")}, {headers: {"Content-Type": "multipart/form-data"}})
        .then(response => Toast.show({
          type: "success",
          text1: response.data?.message
        }))
        .catch(error => Toast.show({
          type: "error",
          text1: error?.response?.data.message ?? error.message
        }))
        .finally(() => setIsCapturing(false))
      }
  }
  function getFileExtension(filename, separator){
    // get file extension
    const extension = filename.split(separator).pop();
    return extension;
  }
  const [loadEhr, setLoadEhr] = useState(false)
  const getEhr = async () => {
    setLoadEhr(true)
    try {
      const user = await getStoredUser()
      const url = "/api/user/get-singleuser";
      const response = await axiosInstance.post(url, {id:user?._id, role:"PATIENT"});
      setAllEhrs(response.data.data.ehr?.filter(ehr => ehr?.documents?.length > 0))
      return response.data.data.ehr
    }
    catch (error) {
      console.log("Error: ", error)
    }
    finally{
      setLoadEhr(false)
    }
  }
  const {data} = useQuery({queryKey:["get-ehr"], queryFn:getEhr})
  const exportToPDF = async (html, height=650) => {
     const result = await Print.printToFileAsync({html, height, base64:true})
     console.log("File uri: ", result.uri)
     return result
  }
  
  const handleDownloadSingle = async (ehr) => {
      const perm = await fs.StorageAccessFramework.requestDirectoryPermissionsAsync()
      if (!perm.granted) {
        return
      }
      if (ehr?.documents?.length == 0)
        {
            const html = `
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                  </head>
                  <body>
                    <div style="p-24 text-[20px]">
                      <div style="mt-1">Details: ${ehr?.details}</div>
                      <div style="mt-3">Date: ${ehr?.test_date}</div>
                      <div style="mt-3">Doctor: ${ehr?.doctor}</div>
                    </div>
                  </body>
                  </html>
            `
            const file = await exportToPDF(html, 400)
            const filename = "Ehr"+new Date().getTime()+".pdf"
            // const downloadResult = await fs.downloadAsync(file.uri, fs.documentDirectory+filename)
            await fs.StorageAccessFramework.createFileAsync(perm.directoryUri, filename, "application/pdf")
            .then(async (uri) => {
                await fs.writeAsStringAsync(uri, file.base64, {encoding: fs.EncodingType.Base64})
                Toast.show({
                  type: "info",
                  text1: "Download successful, located in "+fs.documentDirectory
                })
            })
            .catch(error => console.log(error))
        }
        else {
          const directory = await fs.StorageAccessFramework.requestDirectoryPermissionsAsync()
          const uri = directory.directoryUri
          ehr?.documents?.forEach(async document => {
            var mimeType;
            if (getFileExtension(document, ".") == "pdf")
            {
              mimeType="application/pdf"
            }
            else {
              mimeType = `image/${getFileExtension(document, ".")}`
            }
            const downloadResult = await fs.downloadAsync(axiosInstance.getUri()+document, fs.documentDirectory+new Date().getTime()+"."+getFileExtension(document, "."))
            const downloadedFileString = await fs.readAsStringAsync(downloadResult.uri, {encoding: fs.EncodingType.Base64})
            fs.StorageAccessFramework.createFileAsync(perm.directoryUri, "EHR"+new Date().getTime(), mimeType)
            .then(async uri=> {
                await fs.StorageAccessFramework.writeAsStringAsync(uri, downloadedFileString, {encoding: fs.EncodingType.Base64})
            })
            .catch(error => console.log(error))
            .finally(() => {
              Toast.show({
                type: "info",
                text1: "Download successful, check the file in the "+ perm.directoryUri+" directory"
              })
            })
          })          
        }
  }
  const [isCompleteDownload, setIsCompleteDownload] = useState(false)
  const handleDownloadAll = async() => {
    setIsCompleteDownload(true)
    const perm = await fs.StorageAccessFramework.requestDirectoryPermissionsAsync()
      if (!perm.granted) {
        return
      }
    const user = await getStoredUser()
      const header = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        </head>
        <body>
          <div style="padding:24; color:white; background-color:teal; font-weight:700; font-size: 20px;">
            <div style="margin-top:5; font-size:24px; text-align:center; text-transform:uppercase; font-weight:800;">Patient's Electronic Health record</div>
            <div style="margin-top:7; font-size:18px;">Patient: ${user?.fullname}</div>
            <div style="margin-top:7; font-size:18px;">Email: ${user?.email}</div>
            <div style="margin-top:7; font-size:18px;">Phone Number: ${user?.tel}</div>
            <div style="margin-top:7; font-size:18px;">Gender: ${user?.gender}</div>
            <div style="margin-top:7; font-size:18px;">Date of Birth: ${new Date().toLocaleDateString()}</div>
          </div>
        `
        var ehrPart = ""
        data?.forEach(ehr => {
            if (ehr?.documents?.length === 0) {
              ehrPart += `
                <div style="padding:24; border-bottom: 3px solid teal; font-weight:700; font-size:20px;">
                  <div style="margin-top:3;">Details: ${ehr?.details}</div>
                  <div style="margin-top:4;">Date: ${ehr?.test_date}</div>
                  <div style="margin-top:4;">Doctor: ${ehr?.doctor}</div>
                </div>
              `
            }
        })
        const html = header + ehrPart + "</body> </html>"
        const file = await exportToPDF(html)
        // const filename = "Ehr"+new Date().getTime()+".pdf"
        // await fs.downloadAsync(file.uri, fs.documentDirectory+filename)
        fs.StorageAccessFramework.createFileAsync(perm.directoryUri, "Complete_Ehr"+new Date().getTime(), "application/pdf")
        .then(async uri => {
              await fs.StorageAccessFramework.writeAsStringAsync(uri, file.base64, {encoding: fs.EncodingType.Base64})
              Toast.show({
                type: "info",
                text1: "File downloaded successfully, check the iKare EHR directory"
              })
        })
        .catch(error => console.log(error))
        .finally(() => {
          setIsCompleteDownload(false)
        })
  }
  const renderSingleEhr = ({item}) => (
    <View style={tw`mt-2 bg-teal-800 bg-opacity-10 p-4 border-b-2 flex flex-row justify-between items-center border-teal-800`}>
        <View>
        <Text style={tw`font-semibold text-teal-800`}>{item?.details}</Text>
        <Text style={tw`font-semibold text-teal-800`}>{item?.test_date}</Text>
        </View>
        <MaterialIcons onPress={() => handleDownloadSingle(item)} name="download" size={36} color={"teal"} />
    </View>
  )
  return (
    <>
        <View style={tw`px-8 py-4`}>
            <Text style={tw`text-[22px] text-[#0C3778] font-semibold text-center`}>Electronic Health Record</Text>
            <View style={tw`self-end flex gap-4 flex-row justify-between items-center mt-5`}>
                {isCapturing ? 
                 <ActivityIndicator size={36} />
                 :
                <View style={tw`flex flex-col justify-center items-center`}>
                  <MaterialIcons onPress={pickImage} name="camera-alt" size={30} />
                  <Text style={tw`text-[8px] font-bold`}>Scan</Text>
                </View>
                }
                  {
                    isLoading ?
                    <ActivityIndicator size={36} /> 
                    :
                    <View style={tw`flex flex-col justify-center items-center`}>
                      <MaterialIcons onPress={pickDocument} name="upload" size={30} />
                      <Text style={tw`text-center text-[8px] font-bold`}>Upload one</Text>
                    </View>
                  }
                {
                  isCompleteDownload ?
                  <ActivityIndicator size={36} />
                  :
                  <View style={tw`flex flex-col justify-center items-center`}>
                    <MaterialIcons onPress={handleDownloadAll} name="download" size={30} />
                    <Text style={tw`text-center text-[8px] font-bold`}>Download all</Text>
                  </View>
                }
            </View>
            {
                  loadEhr ?
                  <ActivityIndicator size={40} style={tw`mt-7`} />
                  :
                  <FlatList 
                    style={tw`mt-7`}
                    data={allEhrs}
                    renderItem={renderSingleEhr}
                    keyExtractor={(item) => item?._id}
                  />
            }
        </View>
    </>
  )
}

export default Emergency