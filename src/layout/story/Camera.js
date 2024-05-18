import React, { createRef, useEffect, useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, CameraRoll, PermissionsAndroid, Image, Platform, Alert } from 'react-native'

import { RNCamera, } from 'react-native-camera';
// import { Icon } from 'react-native-vector-icons/Icon';
import { Wp, Hp, Colors, Style } from '../../export';
import Icon from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import CameraRoll from "@react-native-community/cameraroll";
import { useAndroidBackHandler } from "react-navigation-backhandler";

// import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-player';

export default function Camera(props) {
    const [hasCameraPermissions, setHasCameraPermissions] = useState(false)
    const [hasAudioPermissions, setHasAudioPermissions] = useState(false)
    const [hasGalleryPermissions, setHasGalleryPermissions] = useState(false)

    const [galleryItems, setGalleryItems] = useState([])
    const [resultMedia, setresultMedia] = useState('')
    console.log("🚀 ~ file: camera.js ~ line 24 ~ Camera ~ resultMedia", resultMedia)
    const [count, setcount] = useState(0)

    const [cameraRef, setCameraRef] = useState(null)
    const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back)
    const [cameraFlash, setCameraFlash] = useState(RNCamera.Constants.FlashMode.off)

    const [isCameraReady, setIsCameraReady] = useState(false)
    const [source, setsource] = useState('')
    const [next, setnext] = useState(false)

    // const isFocused = useIsFocused()

    useEffect(() => {

    }, [])

    useAndroidBackHandler(() => {
        handleBack()
        return true
    });
    const handleBack = () => {
        if (resultMedia.uri) {
            Alert.alert(
                "Hapus Perubahan?",
                "Jika kembali perubahan akan dihapus.",
                [
                    {
                        text: "Batal",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "Hapus", onPress: () => props.handleView('', null) }
                ],
                { cancelable: false }
            );
        } else {
            props.handleView('', null)
        }

    }

    const recordVideo = async () => {
        if (cameraRef) {
            try {
                const options = { maxDuration: 60, quality: RNCamera.Constants.VideoQuality['480'] }
                const videoRecordPromise = cameraRef.recordAsync(options)
                if (videoRecordPromise) {
                    const data = await videoRecordPromise;
                    setresultMedia(data)
                    setcount(count + 1)
                    // const source = data.uri
                    // console.log("🚀 ~ file: index.js ~ line 36 ~ recordVideo ~ source", source)
                    // let sourceThumb = await generateThumbnail(source)
                    // console.log("🚀 ~ file: index.js ~ line 37 ~ recordVideo ~ sourceThumb", sourceThumb)
                }
            } catch (error) {
                console.log("🚀 ~ file: Camera.js ~ line 80 ~ recordVideo ~ error", error)
                // console.warn(error)
            }
        }
    }

    const stopVideo = async () => {
        if (cameraRef) {
            cameraRef.stopRecording()
        }
    }

    const pickFromGallery = async () => {
        try {
            let result = await launchImageLibrary({
                mediaType: 'mixed',
                quality: 0.9,
                selectionLimit: 120,
                videoQuality: 'high',
                includeExtra: true,
                includeBase64: true,

            })
            console.log("🚀 ~ file: camera.js ~ line 101 ~ pickFromGallery ~ result", result.assets[0])
            setresultMedia(result.assets[0])
            setcount(count + 1)

        } catch (error) {
            console.log("🚀 ~ file: camera.js ~ line 115 ~ pickFromGallery ~ error", error)
        }
        // let result = await ImagePicker.openPicker({
        //     mediaType: "any",

        //     mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        //     allowsEditing: true,
        //     aspect: [16, 9],
        //     quality: 1
        // })

    }


    const generateThumbnail = async (source) => {
        try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(
                source,
                {
                    time: 5000,
                }
            );
            return uri;
        } catch (e) {
            console.log("🚀 ~ file: Camera.js ~ line 132 ~ generateThumbnail ~ e", e)
            // console.warn(e);
        }
    };

    const takePicture = () => {
        if (cameraRef) {
            console.log("🚀 ~ file: index.js ~ line 87 ~ takePicture ~ cameraRef", cameraRef)
            try {
                // const options = { maxDuration: 60, quality: RNCamera.Constants.}
                // const videoRecordPromise = cameraRef.RE
                // if (videoRecordPromise) {
                //     const data = await videoRecordPromise;
                //     setresultMedia(data.uri)
                // const source = data.uri
                // console.log("🚀 ~ file: index.js ~ line 36 ~ recordVideo ~ source", source)
                // let sourceThumb = await generateThumbnail(source)
                // console.log("🚀 ~ file: index.js ~ line 37 ~ recordVideo ~ sourceThumb", sourceThumb)
                // }
            } catch (error) {
                console.log("🚀 ~ file: Camera.js ~ line 151 ~ takePicture ~ error", error)
                // console.warn(error)
            }
        }
    }

    // if (!hasCameraPermissions || !hasAudioPermissions || !hasGalleryPermissions) {
    //     return (
    //         <View></View>
    //     )
    // }
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: next ? 'white' : 'black', height: Hp('100%') }]}>
            <StatusBar
                backgroundColor={next ? 'white' : 'black'}
                barStyle={next ? 'dark-content' : 'light-content'}
            />
            {resultMedia ?


                <View style={styles.container}>




                    <View style={{ flex: 1, width: Wp('100%'), height: Hp('100%') }}>
                        {resultMedia?.type === 'image/jpeg' ?
                            <Image
                                source={{ uri: resultMedia.uri }}
                                style={{ flex: 1 }}

                            /> :
                            <VideoPlayer
                                video={{ uri: resultMedia.uri }}
                                resizeMode="contain"
                                style={{ width: Wp('100%'), height: Hp('100%') }}
                                // disableFullscreen={false}
                                fullscreenAutorotate={true}
                                fullScreenOnLongPress={true}
                                automaticallyWaitsToMinimizeStalling={true}
                                allowsExternalPlayback={true}
                                pauseOnPress={true}
                                showDuration={true}
                                controls={true}
                                repeat={true}
                            />
                        }
                        <View style={{
                            top: 10,
                            right: 0,
                            marginHorizontal: 5,
                            position: 'absolute'
                        }}>

                            <TouchableOpacity
                                style={[Style.px_3, Style.py_2, { backgroundColor: 'transparent', borderRadius: 2 }]}
                                onPress={() => props.handleView('', resultMedia)}>
                                <Text style={[Style.font_14, Style.semi_bold, { color: Colors.white, alignSelf: 'center' }]}>Lanjutkan</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                    <View style={{
                        top: 10,
                        left: 0,
                        marginHorizontal: 20,
                        position: 'absolute'
                    }}>

                        <TouchableOpacity
                            style={styles.sideBarButton}
                            onPress={handleBack}>
                            <Image style={{ width: 25, height: 25, tintColor: Colors.white }} source={require('../../icon/arrow.png')} />
                            {/* <Fontisto size={20} name="arrow-left" color='white' /> */}
                        </TouchableOpacity>

                    </View>
                </View>

                :
                <View style={styles.container}>
                    <RNCamera
                        ref={ref => setCameraRef(ref)}
                        style={styles.camera}
                        ratio={'16:9'}
                        type={cameraType}
                        flashMode={cameraFlash}
                        onCameraReady={() => setIsCameraReady(true)}
                        androidCameraPermissionOptions={{
                            title: 'Permission to use camera',
                            message: 'We need your permission to use your camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                        androidRecordAudioPermissionOptions={{
                            title: 'Permission to use audio recording',
                            message: 'We need your permission to use your audio',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                    />
                    <View style={styles.sideBarContainer}>
                        <TouchableOpacity
                            style={styles.sideBarButton}
                            onPress={() => setCameraType(cameraType === RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back)}>
                            <Fontisto size={24} name="spinner-refresh" color='white' />
                            <Text style={styles.iconText}>Flip</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.sideBarButton}
                            onPress={() => setCameraFlash(cameraFlash === RNCamera.Constants.FlashMode.off ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off)}>

                            <Fontisto size={24} name="flash" color='white' />
                            <Text style={styles.iconText}>Flash</Text>
                        </TouchableOpacity>

                    </View>


                    <View style={styles.bottomBarContainer}>
                        {/* <View style={{ flex: 1 }}></View> */}

                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <TouchableOpacity
                                onPress={() => pickFromGallery()}
                                style={styles.galleryButton}>
                                <Image
                                    style={styles.galleryButtonImage}
                                    source={require('../../icon/photo-gallery.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.recordButtonContainer}>
                            <TouchableOpacity
                                disabled={!isCameraReady}
                                onPress={() => takePicture()}
                                onLongPress={() => recordVideo()}
                                onPressOut={() => stopVideo()}
                                style={styles.recordButton}
                            />
                        </View>

                        <View style={{ flex: 1 }}></View>

                    </View>
                </View>

            }

        </SafeAreaView >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
        backgroundColor: 'black',
        aspectRatio: 9 / 16,
    },
    bottomBarContainer: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        marginBottom: 30,
    },
    recordButtonContainer: {
        flex: 1,
    },
    recordButton: {
        borderWidth: 8,
        borderColor: '#ff404087',
        backgroundColor: '#ff4040',
        borderRadius: 100,
        height: 80,
        width: 80,
        alignSelf: 'center'
    },
    galleryButton: {
        // backgroundColor: 'white',
        // overflow: 'hidden',
        width: 60,
        height: 60,
    },
    galleryButtonImage: {

        width: '100%',
        height: '100%',
    },
    sideBarContainer: {
        bottom: 20,
        right: 0,
        marginHorizontal: 20,
        position: 'absolute'
    },
    iconText: {
        color: 'white',
        fontSize: 12,
        marginTop: 5
    },
    sideBarButton: {
        alignItems: 'center',
        marginBottom: 25
    }
});