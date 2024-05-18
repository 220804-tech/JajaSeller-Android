import React, { useState, useEffect, createRef, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, StyleSheet, FlatList, Modal, StatusBar } from 'react-native';
import Warna from '../../config/Warna';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import style from '../../styles/style';
import ActionSheetOpenCamera from 'react-native-actions-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import * as Service from '../../service/Story'
import ImageViewer from 'react-native-image-zoom-viewer';
import { useNavigation } from '@react-navigation/native';
import Postingan from './postingan'
import Loading from '../../component/loading'
import * as ServiceProduk from '../../service/Produk';
import { useFocusEffect } from '@react-navigation/native';
import { Appbar } from '../../export';
import Camera from './Camera'

export default function Story() {
    const navigation = useNavigation();
    const actionSheetOpenCamera = createRef();
    const [storyUploaded, setstoryUploaded] = useState()
    const [loading, setloading] = useState(false);
    const [id, setId] = useState(1)
    const [zoom, setzoom] = useState(false)
    const [storyPressed, setstoryPressed] = useState("")
    const [mediaResult, setmediaResult] = useState("")

    const [view, setview] = useState("")

    useFocusEffect(
        useCallback(() => {
            getItem();
            getData()
        }, []),
    );
    const handleOpenPhoto = async () => {
        await actionSheetOpenCamera.current?.setModalVisible(false)

        ImagePicker.openCamera({
            width: 450,
            height: 500,
            cropping: false,
            includeBase64: true,
            mediaType: 'any',
            writeTempFile: true
            // compressImageQuality: 0,
        }).then((photo) => {
            console.log(photo, "ini photo 37")
            // setstoryUpload(photo)
            navigation.navigate('StoryUpload', { media: photo })
        }).catch(err => console.log(err, "error get photo in camera"))
    }
    const handleOpenVideo = () => {
        actionSheetOpenCamera.current?.setModalVisible(false)

        ImagePicker.openCamera({
            width: 450,
            height: 500,
            cropping: false,
            includeBase64: false,
            mediaType: 'video',
            compressImageQuality: 0,
        }).then((video) => {
            console.log("🚀 ~ file: index.js ~ line 57 ~ handleOpenVideo ~ video", video)
            // setstoryUpload(video)
            navigation.navigate('StoryUpload', { media: video })
        }).catch(err => console.log(err, "error get video in camera"))

    }
    const handleOpenLibrary = () => {
        actionSheetOpenCamera.current?.setModalVisible(false)
        ImagePicker.openPicker({
            width: 450,
            height: 500,
            cropping: false,
            includeBase64: true,
            mediaType: 'any'
        }).then((media) => {
            navigation.navigate('StoryUpload', { media: media, id: id })
        }).catch(err => console.log(err, "error get media in library"))
    }
    // {
    //     type : video,
    //     time : 06-01-2021 12:12,
    //     url  : "htttp/",
    //     name : "nama pengupload/toko",
    //     id_toko   : "id toko",
    //     id_story
    //    }
    const getItem = async () => {
        try {
            let response = await Service.getStory();
            if (response.status.code == 200) {
                setstoryUploaded(response.data.story)
            }
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 69 ~ getItem ~ error", error)
        }
    }
    const getData = async () => {
        try {
            let result = await ServiceProduk.getIdToko();
            setId(result)
        } catch (error) {
            console.log("line 102 error get id toko index story ", error)
        }
    }


    useEffect(() => {
        getItem()
        getData()
        return () => {
        }
    }, [])

    const handleLoading = (val) => {
        setloading(val)
    }

    const handleRefresh = () => {
        setloading(true)
        getItem()

        console.log("redfres")

    }
    const renderStory = ({ item }) => {
        // console.log("🚀 ~ file: index.js ~ line 128 ~ renderStory ~ item", item)
        return (
            <View style={{ marginRight: 5, width: wp('19%'), height: wp('23%'), justifyContent: "center", alignItems: "center", borderRadius: 10, borderWidth: 1, borderColor: "grey", }}>
                {item.type === "video" ?
                    <Video source={{ uri: item.url_media }}   // Can be a URL or a local file.
                        playInBackground={false}
                        paused={false}
                        resizeMode="cover"
                        // ref={(ref) => {
                        //     player = ref
                        // }}
                        // onStart                                  // Store reference
                        // onBuffer              // Callback when remote video is buffering
                        // onError               // Callback when video cannot be loaded
                        style={styles.image}
                    />
                    :
                    <TouchableOpacity onPress={() => {
                        setstoryPressed(item)
                        setzoom(true)
                    }} style={{ width: '100%', height: '100%' }}>
                        <Image source={{ uri: item.url_media }} style={styles.imageStory} />
                    </TouchableOpacity>
                }
                <Modal visible={zoom} transparent={true}>
                    <StatusBar translucent={false} hidden={true} backgroundColor={Warna.blackLight} barStyle="dark-content" />

                    <View style={{ flex: 1, backgroundColor: 'black' }}>
                        <Image source={{ uri: storyPressed.url_media }} style={styles.imageZoom} />
                        <TouchableOpacity onPress={() => setzoom(false)} style={{ position: 'absolute', top: 10, left: 10, width: 30, height: 30, }}>
                            <Image style={{ tintColor: 'white', width: 30, height: 30 }} source={require('../../icon/arrow.png')} />
                        </TouchableOpacity>
                        <View style={{ position: 'absolute', bottom: 20, width: 30, height: 30, justifyContent: 'center', width: '100%', elevation: 1 }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>{storyPressed.deskripsi}</Text>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    return (

        <SafeAreaView style={style.container}>
            {loading ?
                <Loading /> : null
            }
            {/* <View style={[{ backgroundColor: 'white', flex: 0, flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#F5F5F5', padding: '3%', marginBottom: '1%' }]}>
                <ScrollView nestedScrollEnabled={true} showsHorizontalScrollIndicator={false} horizontal={true} >
                    <TouchableOpacity onPress={() => navigation.navigate("StoryUpload", { id: id })} style={{ marginRight: 5, width: wp('19%'), height: wp('23%'), justifyContent: "center", alignItems: "center", borderRadius: 10, borderWidth: 1, borderColor: "grey", }}>
                        <Image source={require('../../icon/camera.png')} style={styles.iconStory} />
                    </TouchableOpacity>
                    <FlatList
                        horizontal={true}
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        data={storyUploaded}
                        renderItem={renderStory}
                    />
                </ScrollView>
            </View> */}
            {/* <ScrollView> */}
            {!view ?
                <>
                    <Appbar title='Postingan' back={true} />
                    <Postingan media={mediaResult} handleView={e => setview(e)} handleLoading={handleLoading} />
                </>
                :
                <Camera handleView={(e, media) => {
                    setview(e)
                    setmediaResult(media)
                }} />
            }
            {/* </ScrollView> */}

            <ActionSheetOpenCamera
                footerHeight={11}
                containerStyle={{ height: hp('19%'), flexDirection: 'column', paddingHorizontal: '3%' }}
                ref={actionSheetOpenCamera}>
                <View style={[style.actionSheetHeader, { flex: 0 }]}>
                    <Text style={style.actionSheetTitle}>Jaja Story</Text>
                    <TouchableOpacity
                        onPress={() => actionSheetOpenCamera.current?.setModalVisible(false)}>
                        <Image
                            style={style.actionSheetClose}
                            source={require('../../icon/close.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={style.pickMedia}>
                    <View style={[style.pickMediaButton, { backgroundColor: 'white' }]}>
                        <TouchableOpacity style={[style.pickMediaIcon]}
                            onPress={() => handleOpenPhoto()}>
                            <Image
                                style={{ height: '44%', width: '50%', tintColor: Warna.biruJaja }}
                                source={require('../../icon/camera.png')}
                            />
                            <Text style={style.pickMediaText}>Kamera</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={[style.pickMediaButton, { backgroundColor: 'white' }]}>
                                    <TouchableOpacity style={[style.pickMediaIcon]}
                                        onPress={() => handleOpenVideo()}>
                                        <Image
                                            style={{ height: '35%', width: '70%' }}
                                            source={require('../../icon/movie.png')}
                                        />
                                        <Text style={style.pickMediaText}>Video</Text>
                                    </TouchableOpacity>
                                </View> */}
                    <View style={[style.pickMediaButton]}>
                        <TouchableOpacity style={[style.pickMediaIcon]}
                            onPress={() => handleOpenLibrary()}>
                            <Image
                                style={{ height: '44%', width: '50%', tintColor: Warna.kuningJaja }}
                                source={require('../../icon/photo.png')}
                            />
                            <Text style={style.pickMediaText}>Galeri</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ActionSheetOpenCamera>

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({

    boxStory: {
        borderWidth: 0.2,
        borderColor: Warna.biruJaja,
        borderRadius: 3,
        height: hp('13%'),
        width: wp('19%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '1%'
        // backgroundColor: 'grey'
    },
    iconStory: {
        tintColor: Warna.biruJaja,
        width: wp('7%'),
        height: wp('7%')
    },
    imageStory: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        resizeMode: 'cover'
    },
    textStoryZoom: {
        flex: 0,
        position: 'absolute',
        bottom: 0,
    },
    textStoryItemZoom: {
        fontSize: 14,
        color: 'white'
    },
    imageZoom: {
        width: '100%',
        height: '100%',
        position: 'relative'
    },
    image: { borderRadius: 10, flex: 0, width: wp('20%'), height: hp('12%'), padding: 2, borderRadius: 10, borderWidth: 0.2, borderColor: '#9A9A9A' },
    background: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        elevation: 7,
    },
    container: {
        zIndex: 1,
        backgroundColor: 'transparent',
        bottom: 0,
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.10)',

    },
    loading: {
        padding: 8,
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
    }
});

