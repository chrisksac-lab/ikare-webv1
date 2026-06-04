import React, {useEffect, useState} from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import tw from "twrnc"
import { splashImages } from '../../utils/constants/SplashImages'

function SplashScreen() {
    const [activeImg, setActiveImg] = useState(splashImages)
    useEffect(() => {
        var t = 0;
        var timeout = setInterval(()=>{
          updateBG()
          ++t;
          if(t==4){
            t=0;
            clearTimeout(timeout)
        //     storedInformation ?
        //    navigation.navigate("Home") :
        //     navigation.navigate("Login")
          }
        },900)
    
        return ()=> clearTimeout(timeout)
    }, [activeImg])
    const checkIsBg=(value)=>{
        const arr = [...activeImg]
        let res = false;
    
        arr.forEach((item,index)=>{
          if(item.index==value){
              res = item.isBg
            }
        })
        return res;
      }
    const updateBG=()=>{
        let arr = [...activeImg]
        let isActive = false;
        let activeIndex = -1;
        // check if no one is active
        arr.forEach((item,index)=>{
          if(item.isBg==true){
            isActive = true
          }
        })
    
         if(isActive==false){
          arr[0].isBg = true
         }else{
            // check for active index
            arr.forEach((item,index)=>{
              if(item.isBg===true){
                activeIndex = index;
              }
            })
            
            //assign next index active
            if(activeIndex>=0 && activeIndex<arr.length){
              arr[activeIndex].isBg = false
              activeIndex == arr.length-1 ? arr[0].isBg = true : arr[activeIndex+1].isBg = true;
            }else{
              arr[0].isBg = true;
            }
          }
          setActiveImg(arr);
      }
  return (
    <>
        <View style={tw`w-full items-center p-8 h-full bg-[#0C3778]`}>
        <View style={tw`flex flex-col h-[90%] items-center mt-[-15%] w-full justify-between`}>
            {
                activeImg?.map((image, index) => {
                    if(checkIsBg(index)) {
                        return (
            <>
            <Image 
                source={image.source}
                alt='Splash 1'
                resizeMode='contain'
                style={tw`w-full`}
                />
                
            <Text style={tw`text-white text-8 mt-[-10%] text-center font-bold`}>
            {image.text}
            </Text>
            </>)
                    }                    
                })
            }

            <TouchableOpacity
             style={tw`bg-transparent p-2 w-[65%] items-center border-2 rounded-5 border-white mb-3 mt-7`}>
                <Text style={tw`text-white font-semibold`}>Skip intro</Text>
            </TouchableOpacity>
            </View>
              <View style={tw`flex flex-row justify-between w-[45%] bottom-5 absolute items-center`}>
                    <View style={ !checkIsBg(0) ? tw`rounded-10 w-6 h-6 bg-white` : tw`rounded-10 w-6 h-6 bg-blue-700` }></View>
                    <View style={ !checkIsBg(1) ? tw`rounded-10 w-6 h-6 bg-white` : tw`rounded-10 w-6 h-6 bg-blue-700`}></View>
                    <View style={ !checkIsBg(2) ? tw`rounded-10 w-6 h-6 bg-white` : tw`rounded-10 w-6 h-6 bg-blue-700` }></View>
                    <View style={ !checkIsBg(3) ? tw`rounded-10 w-6 h-6 bg-white` : tw`rounded-10 w-6 h-6 bg-blue-700` }></View>
              </View>
        </View>
    </>
  )
}

export default SplashScreen