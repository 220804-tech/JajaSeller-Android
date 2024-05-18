import React from 'react'
import { View, Text } from 'react-native'
import ImagePicker from "react-native-image-crop-picker";

export default function index() {

    const kamera =()=> {
        ImagePicker.openCamera({
            width: 300,
            height: 300,
            cropping: true,
            includeBase64: true,
            compressImageQuality:0,
          }).then(image => {
            console.log(image);
            this.setState({ images: image });
          }) 
    }
    return (
        <View>
            <Text>Kamera</Text>
            {/* {kamera()} */}
        </View>
    )
}
