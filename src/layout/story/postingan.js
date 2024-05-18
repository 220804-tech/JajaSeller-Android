import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native'
import Warna from '../../config/Warna'
import style from '../../styles/style'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { IconButton } from 'react-native-paper';
import * as Service from '../../service/Produk';
import * as ServiceStory from '../../service/Story';
import moduleName from '../../component/loading'

import ImagePicker from 'react-native-image-crop-picker';
import { Colors, Style, Wp } from '../../export';

export default function postingan(props) {
    const [keterangan, setketerangan] = useState("")
    const [showProduct, setShowProduct] = useState(false)
    const [products, setproducts] = useState([])
    const [productPressed, setproductPressed] = useState("")
    const [opacity, setopacity] = useState(1)
    const [loading, setloading] = useState(false)

    const [gambar, setgambar] = useState("")
    const [id, setId] = useState(1)
    const [name, setName] = useState('')

    const [feedUploaded, setfeedUploaded] = useState([])

    useEffect(() => {
        getProduct()
        getItem()
        setproductPressed("")

    }, [])

    useEffect(() => {
        console.log("🚀 ~ file: postingan.js ~ line 400000 ~ return ~ props", props.media)
        if (props.media?.uri) {
            console.log("🚀 ~ file: postingan.js ~ line 40 ~ return ~ props", props.media)
            setgambar(props.media)
        }
        return () => {

        }
    }, [props.media])

    const getItem = async () => {
        try {
            let response = await ServiceStory.getStory();
            if (response.status.code == 200) {
                setfeedUploaded(response.data.feed)
                console.log("🚀 ~ file: index.js ~ line 32 ~ getItem ~ response", response.data.feed)
            }
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 69 ~ getItem ~ error", error)
        }
    }

    const handleProductPressed = (item) => {
        let value = {
            id: item.id_produk,
            name: item.nama_produk
        }
        if (item.id_produk === productPressed.id) {
            setproductPressed("")
        } else {
            setproductPressed(value)
        }
    }

    const getProduct = async () => {
        let result = await Service.getIdToko();
        let res = await Service.getName();
        setName(res)
        setId(result)
        console.log("🚀 ~ file: postingan.js ~ line 21 ~ getProduct ~ result", result)
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=5uvmd9reofi22n7vi9ireo9tmo4452f4");
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(`https://jsonx.jaja.id/core/seller/product?page=1&limit=10&filter=&id_toko=${result}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                let res = result.product
                // console.log("🚀 ~ file: postingan.js ~ line 30 ~ getProduct ~ result", JSON.stringify(result))
                setproducts(result.product);
            })
            .catch(error => {
                console.log("🚀 ~ file: index.js ~ line 77 ~ postingan ~ error", error)
                alert(error)
                // setTimeout(() => setshimmerProduct(false), 500);
            });
    }
    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleProductPressed(item)} style={[styles.cardProductItem]}>
                <Image style={[styles.imageItem, { opacity: productPressed.id == item.id_produk ? 0.4 : 1 }]} source={{ uri: item.foto[0].url_foto }} />
                <Text numberOfLines={1} style={[styles.textItem, { opacity: productPressed.id == item.id_produk ? 0.5 : 1 }]}>{item.nama_produk}</Text>
            </TouchableOpacity>
        )
    }

    const handlePickImage = () => {
        props.handleView('camera')
        // ImagePicker.openPicker({
        //     // width: 500,
        //     // height: 450,
        //     cropping: true,
        //     includeBase64: false,
        //     mediaType: 'photo',
        //     // compressImageQuality: 0,
        // }).then((photo) => {

        //     console.log(photo, "ini photo 81")
        //     // console.log(photo.path, "ini photo 81")
        //     setgambar(photo)
        // }).catch(err => console.log(err, "error get photo in camera"))
    }

    const handleSend = () => {
        props.handleLoading(true)
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=osb0d3cv6kd90asrihdmhedgm4043u37");
        var formdata = new FormData();
        formdata.append("id_toko", id);
        formdata.append("id_produk", productPressed ? productPressed.id : "");
        formdata.append("url_media", gambar ? gambar.base64 : "");
        formdata.append("deskripsi", keterangan);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://jsonx.jaja.id/core/seller/feed/all", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log("🚀 ~ file: postingan.js ~ line 90 ~ handleSend ~ result", result)
                try {
                    if (JSON.parse(result).status.code === 201) {
                        getItem()
                        setgambar("")
                        setketerangan("")
                        setShowProduct(false)
                    } else {
                        alert(result)
                    }
                    props.handleLoading(false)
                } catch (error) {
                    console.log("🚀 ~ file: postingan.js ~ line 123 ~ handleSend ~ error", error)
                    props.handleLoading(false)
                }
            })
            .catch(error => console.log('error', error));
    }

    const renderFeed = ({ item, index }) => {
        // console.log("🚀 ~ file: postingan.js ~ line 46 ~ renderItem ~ item", item)
        // console.log("===================", index)
        return (
            <View style={styles.cardFeed}>
                <View style={styles.headerFeed}>
                    <Text adjustsFontSizeToFit style={{ fontSize: 14, color: Warna.blackLight, fontWeight: '900' }}>{name}</Text>
                    <Text adjustsFontSizeToFit style={{ fontSize: 14, color: '#9A9A9A', fontFamily: 'Poppins-Italic' }}>{item.created_date}</Text>
                </View>
                {item.url_media == null ? null :
                    <View style={{ width: '100%', height: Wp('125%'), justifyContent: "center", alignItems: 'center', marginBottom: '3%' }}>
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
        <ScrollView contentContainerStyle={{ flex: 0 }}>
            <View style={styles.addFeed}>
                <View style={{ flex: 3, justifyContent: 'center', paddingHorizontal: "4%", flexDirection: 'row' }}><Text style={[Style.font_14, Style.semi_bold, Style.mr_2, { flex: 1, color: Colors.biruJaja, }]}>Buat Postingan</Text>{productPressed === "" ? null : <Text style={[Style.font_10, {
                    backgroundColor: Colors.white, paddingHorizontal: '3%', paddingVertical: '1%', borderRadius: 100, textAlignVertical: 'center', shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.20,
                    shadowRadius: 1.41,

                    elevation: 2,
                }]}>{productPressed.name}</Text>}</View>
                <View style={{ flex: 6, flexDirection: 'row', paddingHorizontal: "3%" }}>
                    <View style={{ flex: 1, minHeight: Wp('35%'), maxHeight: Wp('100%') }}>

                        <TextInput
                            style={[Style.font_13, { width: Wp('65%') }]}
                            placeholder="Tambah Keterangan"
                            multiline={true}
                            textAlignVertical="top"
                            numberOfLines={6}
                            value={keterangan}
                            keyboardType="default"
                            maxLength={1000}
                            onChangeText={(text) => setketerangan(text)}
                            theme={{
                                colors: {
                                    primary: Warna.biruJaja,
                                },
                            }}
                        />
                    </View>
                    {gambar ?
                        <View style={{ width: Wp('20%'), height: Wp('30%'), justifyContent: "center", alignItems: 'flex-start', backgroundColor: 'silver' }}>
                            <Image style={{ width: '100%', height: '100%' }} source={{ uri: gambar.uri }} />
                        </View> : null
                    }
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: "3%", paddingVertical: '2%', alignItems: 'flex-end', borderTopWidth: 1.5, borderTopColor: '#f5f5f5' }}>
                    <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => showProduct ? setShowProduct(false) : setShowProduct(true)}>
                        <Image
                            style={{ width: 24, height: 24 }}
                            source={require('../../icon/groceries.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => handlePickImage()}>
                        <Image
                            style={{ width: 24, height: 24, tintColor: Colors.silver }}
                            source={require('../../icon/photo.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} disabled={!keterangan || keterangan !== " " || keterangan !== "  " || gambar.uri ? false : true}
                        onPress={() => handleSend()}>
                        <Image
                            style={{ width: 24, height: 24, tintColor: Warna.biruJaja }}
                            source={require('../../icon/send.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {
                showProduct ?
                    <View style={styles.cardProduct}>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            data={products}
                            renderItem={renderItem}
                        />
                    </View>
                    : null
            }
            <FlatList
                showsHorizontalScrollIndicator={false}
                data={feedUploaded}
                scrollEnabled={true}
                renderItem={renderFeed}
            />
        </ScrollView >
    )


}
const styles = StyleSheet.create({
    addFeed: {
        flex: 0,
        flexDirection: 'column',
        // height: hp('18%'),
        marginBottom: '2%',
        backgroundColor: Warna.white,
        paddingTop: '4%'
    },
    cardProduct: {
        flex: 0,
        flexDirection: 'row',
        height: hp('13%'),
        marginBottom: '2%',
        padding: '2%',
        backgroundColor: Warna.white
    },
    cardProductItem: {
        flex: 0,
        flexDirection: 'column',
        height: wp('20%'),
        width: wp('17%'),
        marginRight: 11,
        // marginRight: '2%',
        // backgroundColor: ,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageItem: {
        width: '100%',
        height: '75%',
    },
    textItem: {
        fontSize: 13,
        fontWeight: '900',
        color: Warna.blackLight,
    },
    // postinganCard: {
    //     height: hp('17%'),
    //     elevation: 2,
    //     backgroundColor: Warna.white
    // },
    headerAddFeed: {
        flex: 0,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '4%',
        // width: '100%',
    },

    inputbox: {
        // backgroundColor: 'pink',
        // width: wp('90%'),
        color: 'black',
    },
    textProductPressed: {
        fontSize: 11,
        paddingVertical: 1,
        paddingHorizontal: 10,
        elevation: 2,
        backgroundColor: Warna.white,
        borderRadius: 10,
        textAlignVertical: 'center',
        marginTop: '1%'
    },
    cardFeed: {
        flex: 0,
        width: '100%',
        flexDirection: 'column',
        backgroundColor: Warna.white,
        marginBottom: '3%',
        padding: '4%',
        height: Wp('150%')
    },
    headerFeed: {
        flex: 0, flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: '3%'
    },
    imageFeed: {
        width: '100%',
        height: '100%',
        borderRadius: 2
    }
})
