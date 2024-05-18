import React, { useState, useEffect, createRef } from 'react';
import { View, Text, SafeAreaView, Image, StyleSheet, TextInput, StatusBar, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import { IconButton } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import style from '../../styles/style';
import Warna from '../../config/Warna';
import Video from "../../component/video"
import * as Storage from "../../service/Storage"
import * as Service from "../../service/Story"
import ImagePicker from 'react-native-image-crop-picker';

import { Button, Appbar, RadioButton } from 'react-native-paper';
import ActionSheetBrand from 'react-native-actions-sheet';

export default function StoryUpload({ route }) {
    const navigation = useNavigation();
    const productRef = createRef();
    const [state, setstate] = useState("")
    const [products, setproducts] = useState("")
    const [gambar, setgambar] = useState("")
    const [deskripsi, setdeskripsi] = useState("")
    const [productPressed, setproductPressed] = useState("")
    const { id } = route.params

    useEffect(() => {
        // setstate(media)
        getItem()
        getToko()

    }, [])
    const getItem = async () => {
        try {
            let response = await Storage.getProductAktif()
            setproducts(JSON.parse(response))
        } catch (error) {
            console.log("🚀 ~ file: upload.js ~ line 29 ~ getItem ~ error", error)

        }
    }

    const handleOpenPhoto = async () => {
        ImagePicker.openCamera({
            width: 450,
            height: 500,
            cropping: false,
            includeBase64: true,
            mediaType: 'photo',
        }).then((photo) => {
            setgambar(photo)
        }).catch(err => console.log(err, "error get photo in camera"))
    }

    const handleOpenLibrary = () => {
        ImagePicker.openPicker({
            width: 450,
            height: 500,
            cropping: false,
            includeBase64: false,
            mediaType: 'photo',
            writeTempFile: true
        }).then((media) => {
            console.log("cok", media)
            setgambar(media)
        }).catch(err => console.log(err, "error get media in library"))

    }

    const getToko = async () => {
        try {
            let response = await Storage.getIdToko()
            setidToko(JSON.parse(response))
        } catch (error) {
            console.log("🚀 ~ file: upload.js ~ line 29 ~ getItem ~ error", error)

        }
    }
    const handleUpload = () => {
        console.log("🚀 ~ file: postingan.js ~ line 70 ~ handleSend ~ result", id)
        console.log("🚀 ~ file: postingan.js ~ line 70 ~ handleSend ~ result", productPressed)
        console.log("🚀 ~ file: postingan.js ~ line 70 ~ handleSend ~ result", gambar)
        console.log("🚀 ~ file: postingan.js ~ line 70 ~ handleSend ~ result", deskripsi)

        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=osb0d3cv6kd90asrihdmhedgm4043u37");
        var formdata = new FormData();
        formdata.append("id_toko", id);
        formdata.append("id_produk", productPressed !== "" ? productPressed.id : "");
        formdata.append("url_media", gambar !== "" ? gambar.data : "");
        formdata.append("deskripsi", deskripsi);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://jsonx.jaja.id/core/seller/feed/story", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("🚀 ~ file: postingan.js ~ line 90 ~ handleSend ~ result", result)
                try {
                    if (result.status.code === 201) {
                        getItem()
                        setgambar("")
                        setdeskripsi("")
                        setShowProduct(false)
                        navigation.goBack()
                    } else {
                        console.log(result);
                    }
                } catch (error) {
                    console.log("🚀 ~ file: postingan.js ~ line 123 ~ handleSend ~ error", error)
                }
            })
            .catch(error => console.log('error', error));
    }

    const renderItem = ({ item }) => {
        console.log("🚀 ~ file: upload.js ~ line 57 ~ renderItem ~ products", item)
        return (
            <TouchableOpacity onPress={() => setproductPressed(item)} style={styles.touchProduk}>
                <Text style={styles.textKategori}>{item.nama_produk}</Text>
            </TouchableOpacity >
        )
    }


    const handleSend = () => {
        // props.handleLoading(true)
        console.log("🚀 ~ file: postingan.js ~ line 70 ~ handleSend ~ result", id)
        console.log("🚀 ~ file: postingan.js ~ line 70 ~ handleSend ~ result", productPressed)
        console.log("🚀 ~ file: postingan.js ~ line 70 ~ handleSend ~ result", gambar)
        console.log("🚀 ~ file: postingan.js ~ line 70 ~ handleSend ~ result", deskripsi)

        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=osb0d3cv6kd90asrihdmhedgm4043u37");
        var formdata = new FormData();
        formdata.append("id_toko", id);
        formdata.append("id_produk", productPressed !== "" ? productPressed.id : "");
        formdata.append("url_media", gambar !== "" ? gambar.data : "");
        formdata.append("deskripsi", deskripsi);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://jsonx.jaja.id/core/seller/feed/story", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("🚀 ~ file: postingan.js ~ line 90 ~ handleSend ~ result", result.status.code)
                console.log("🚀 ~ file: postingan.js ~ line 90 ~ handleSend ~ result",)
                try {
                    if (result.status.code === 201) {
                        console.log("🚀 ~ file: upload.js ~ line 157 ~ handleSend ~ 201 true")
                        getItem()
                        setgambar("")
                        setdeskripsi("")
                        navigation.goBack()
                    } else {
                        alert(result)
                    }
                    // props.handleLoading(false)
                } catch (error) {
                    console.log("🚀 ~ file: postingan.js ~ line 123 ~ handleSend ~ error", error)
                    // props.handleLoading(false    )
                }
            })
            .catch(error => console.log('error', error));
    }

    const renderFeed = ({ item, index }) => {
        console.log("🚀 ~ file: postingan.js ~ line 46 ~ renderItem ~ item", item)
        console.log("===================", index)
        return (
            <View style={styles.cardFeed}>
                <View style={styles.headerFeed}>
                    <Text adjustsFontSizeToFit style={{ fontSize: 14, color: Warna.blackLight, fontWeight: '900' }}>{name}</Text>
                    <Text adjustsFontSizeToFit style={{ fontSize: 14, color: '#9A9A9A', fontFamily: 'Poppins-Italic' }}>{item.created_date}</Text>
                </View>
                {item.url_media == null ? null :
                    <View style={{ width: '100%', height: 150, justifyContent: "center", alignItems: 'center', marginBottom: '3%' }}>
                        <Image style={styles.imageFeed} source={{ uri: item.url_media }} />
                    </View>
                }
                <View style={{ flex: 0, width: '100%' }}>
                    <Text>{item.url_media == null ? null : <Text adjustsFontSizeToFit style={{ fontSize: 14, color: Warna.blackLight, fontFamily: 'Poppins-SemiBold' }}>{name} </Text>}{item.deskripsi}</Text>
                </View>

            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent={false} hidden={true} backgroundColor={Warna.blackLight} barStyle="dark-content" />
            <Appbar.Header style={[style.appBar, { backgroundColor: 'transparent' }]}>

                <TouchableOpacity style={{ marginRight: wp('1%') }} onPress={() => navigation.navigate('Promosi')}>
                    <Image style={style.arrowBack} source={require('../../icon/arrow.png')} />
                </TouchableOpacity>
                <View style={style.row_start_center}>
                    <Text style={style.appBarText}>Kembali</Text>
                </View>
                {/* productRef.current?.setModalVisible(true) */}
                <TouchableOpacity onPress={() => console.log("pressed")} style={style.row_end_center}>
                    <Image style={styles.iconProduct} source={require('../../icon/groceries.png')} />
                </TouchableOpacity>

            </Appbar.Header>
            <View style={{ flex: 1 }}>
                <View style={styles.boxImage}>
                    {console.log(state, "ini state")}
                    {console.log(state.mime, "ini state")}

                    {gambar === "" ?
                        <View style={[styles.image, { backgroundColor: '#F5F5F5', flex: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }]}>
                            <TouchableOpacity onPress={() => handleOpenPhoto()} style={{ flex: 0 }}>
                                <Image style={{ width: 50, height: 50, tintColor: '#9A9A9A' }} source={require('../../icon/camera.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleOpenLibrary()} style={{ flex: 0 }}>
                                <Image style={{ width: 50, height: 50, tintColor: '#9A9A9A' }} source={require('../../icon/photo.png')} />
                            </TouchableOpacity>
                        </View>

                        :
                        <View>
                            <Image style={styles.image} source={{ uri: gambar.path }} />
                            <TouchableOpacity onPress={() => setgambar("")} style={{ position: 'absolute', right: 1, top: 6 }}>
                                <Image style={{ width: 23, height: 23, tintColor: Warna.redPower }} source={require('../../icon/delete.png')} />
                            </TouchableOpacity>
                        </View>


                    }
                    {/* <Video value={state.path} /> :  */}
                </View>
                {productPressed !== "" ?
                    <View style={styles.row_center_center_0}>
                        <Text style={styles.textProductPressed}>{productPressed.nama_produk}</Text>
                        <IconButton
                            icon={require('../../icon/close.png')}
                            style={{ margin: 0 }}
                            color={Warna.blackLight}
                            size={12}
                            onPress={() => setproductPressed("")}
                        />
                    </View> : null
                }
                <View style={styles.boxInput}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Tambah keterangan..."
                        placeholderTextColor="#C0C0C0"
                        onChangeText={(text) => setdeskripsi(text)}
                    />
                    <IconButton
                        icon={require('../../icon/send.png')}
                        style={{ margin: 0, backgroundColor: Warna.biruJaja }}
                        color={Warna.white}
                        size={25}
                        onPress={() => handleSend()}
                    />
                </View>
            </View>
            <ActionSheetBrand containerStyle={styles.actionSheet}

                ref={productRef}>
                <View style={styles.actionSheetHeader}>
                    <Text style={styles.actionSheetTitle}>Daftar Produk</Text>
                    <TouchableOpacity
                        onPress={() => productRef.current?.setModalVisible(false)}
                    >
                        <Image
                            style={styles.iconClose}
                            source={require('../../icon/close.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ height: 200, paddingHorizontal: wp('2%') }}>
                    <ScrollView style={{ flex: 1 }}
                        scrollEnabled={true}>
                        <FlatList
                            data={products}
                            renderItem={renderItem}
                            keyExtractor={item => item?.id_data}
                        />

                    </ScrollView>
                </View>
            </ActionSheetBrand>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black', padding: '2%' },
    actionSheet: { padding: '3%', flex: 0, flexDirection: 'column' },
    boxImage: {
        flex: 1,
        justifyContent: 'center'
    },
    image: {
        flex: 0,
        width: wp('100%'),
        height: wp('55%'),
        alignSelf: 'center',
    },
    boxInput: {
        flex: 0,
        flexDirection: 'row',
        paddingRight: '3%'
    },
    textInput: {
        flex: 1,
        color: 'white',
        fontSize: 16
    },
    iconBack: {

    },
    iconProduct: { width: 27, height: 27, alignSelf: 'flex-end', marginRight: wp('1%') },
    iconClose: { width: 14, height: 14, tintColor: 'grey', },
    actionSheetTitle: { flex: 1, fontFamily: 'Poppins-SemiBold', fontSize: 17, color: Warna.biruJaja, marginBottom: hp('0.5%') },
    actionSheetHeader: { flex: 1, flexDirection: 'row', alignContent: 'space-between', alignItems: 'center', paddingVertical: '2%' },
    touchProduk: { borderBottomColor: '#454545', borderBottomWidth: 0.5, paddingVertical: hp('2%') },
    textKategori: { fontSize: 14, fontWeight: "bold", color: "#454545" },
    row_center_center_0: { flex: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', width: wp('40%'), borderRadius: 5, padding: '2%' },
    textProductPressed: { fontSize: 12, color: Warna.blackLight }
})