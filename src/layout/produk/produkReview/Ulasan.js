import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList, SafeAreaView, ScrollView, Image, StyleSheet, TextInput, RefreshControl } from 'react-native'
import { Appbar, Button, Card } from 'react-native-paper';
import Warna from '../../../config/Warna';
import style from '../../../styles/style';
import { Colors, Style, Utils, Wp, Hp } from '../../../export';
import { useSelector } from 'react-redux';
// import { Rating, AirbnbRating } from 'react-native-ratings';
// const WATER_IMAGE = require('./water.png')
import * as Service from '../../../service/Produk'
import VideoPlayer from 'react-native-video-player';

export default function Ulasan({ route }) {
    const [ulasan, setUlasan] = useState([])
    const [openTextReply, setOpenTextReply] = useState("")
    const [textReply, setTextReply] = useState("")
    const [review, setReview] = useState([])
    const [total, setTotal] = useState({})
    const [pressed, setpressed] = useState(null)
    const [refreshing, setrefreshing] = useState(false)

    const reduxSeller = useSelector(state => state.user.seller)
    const { data } = route.params;

    const textAutoReply = [
        { id: 1, message: "Terimakasih sudah berkunjung di toko kami" },
        // { id: 2, message: "Semoga cocok ya" },
        { id: 2, message: "Baik kak, kami akan proses pengembaliannya" }
    ]

    useEffect(() => {
        getItem(data)
    }, [])

    const getItem = (value) => {
        try {
            setTotal({
                review: value.total_review,
                average: value.average_rating
            })

            setReview(value.review)
        } catch (error) {
            console.log("🚀 ~ file: Ulasan.js ~ line 47 ~ getItem ~ error", error)
        }
    }

    const renderAutoReply = ({ item }) => {
        return (
            <Text onPress={() => setTextReply(item.message)} style={{ flex: 0, marginBottom: "2%", elevation: 1, borderRadius: 10, padding: 10, backgroundColor: Warna.white, fontSize: 10, alignSelf: 'center' }}>{item.message}</Text>
        )
    }

    const starGold = (item) => {
        let arr = []
        for (let index = 0; index < 5; index++) {
            arr.push(index)
        }
        return arr.map((ar, i) => {
            if (i < item) {
                return <Image source={require('../../../icon/ulasan.png')} style={{ width: 14, height: 14, tintColor: 'gold' }} />
            } else {
                return <Image source={require('../../../icon/ulasan.png')} style={{ width: 14, height: 14, tintColor: '#D5D5D5' }} />
            }
        })
    }
    const openKeyboard = (val) => {
        setOpenTextReply(val)
    }

    const handleReview = (val) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=s298re78v04b1g03hg15kf1l1v8ojkmb");

        var raw = JSON.stringify({
            "rating_id": val,
            "id_toko": reduxSeller.id_toko,
            "text": textReply
        });
        console.log("🚀 ~ file: Ulasan.js ~ line 80 ~ handleReview ~ raw", raw)

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://jsonx.jaja.id/core/seller/review/respond", requestOptions)
            .then(response => response.text())
            .then(result => {
                try {
                    let res = JSON.parse(result)
                    console.log("🚀 ~ file: Ulasan.js ~ line 95 ~ handleReview ~ res", res)
                    if (res?.status?.code === 200) {
                        getListRating()
                        console.log('text')
                    } else {
                        Utils.handleErrorResponse(res, 'Error with status code : 10401')
                    }

                } catch (error) {
                    Utils.alertPopUp(String(result))
                }
            })
            .catch(error => Utils.handleError(error, 'Error with status code : 10402'));
    }

    const getListRating = async () => {
        try {
            console.log("🚀 ~ file: Ulasan.js ~ line 113 ~ getListRating ~ data.rating_id", data.id_rating)
            let response = await Service.getDetailRating(data.id_rating);
            setTimeout(() => setrefreshing(false), 2000);
            if (response?.status?.code === 200) {
                console.log("🚀 ~ file: Ulasan.js ~ line 116 ~ getListRating ~ response", response.status)
                setReview(response.data.review)
                console.log("🚀 ~ file: Ulasan.js ~ line 117 ~ getListRating ~ response.data.review", response.data.review)
                setpressed('')
                setTextReply('')
                console.log('masuk sini 1')
            } else {
                console.log('masuk sini 2')
                Utils.handleErrorResponse(response, 'Error with status code : 10501')
            }
        } catch (error) {
            console.log('masuk sini 3')
            setrefreshing(false)
            Utils.handleError(error, 'Error with status code : 10502')
        }
    }

    const onRefresh = useCallback(async () => {
        setrefreshing(true);
        getListRating()
    }, []);

    return (
        <SafeAreaView style={style.container}>
            {/* <KeyboardAvoidingView behavior="padding" /> */}

            <Appbar style={[style.appBar, { paddingHorizontal: Wp('0%') }]}>
                <Appbar.Action
                    icon={require('../../../icon/arrow.png')}
                    color={Warna.white}
                    style={{ backgroundColor: Warna.biruJaja }}

                    onPress={() => console.log('Pressed archive')}
                />
                <View style={style.row_start_center}>
                    <Text style={style.appBarText}>Ulasan Produk</Text>
                </View>
            </Appbar>
            <View style={{ padding: '1%', flex: 1, }}>
                <View style={{ flex: 0, flexDirection: 'column', padding: '2%', alignItems: 'center', backgroundColor: 'white', elevation: 1, padding: '3%', marginBottom: '2%' }}>
                    <View style={styles.textWrapperRating}>
                        <Image source={require('../../../icon/ulasan.png')} style={[styles.iconStart, { tintColor: Warna.kuningJaja }]} />
                        <Text style={Style.font_13}>{total.average}</Text>
                        <Text style={styles.textCenterRating}>/5.0</Text><Text style={styles.textRightRating}>Rata-Rata Rating</Text></View>
                    <View style={styles.textWrapperRating}>
                        <Image source={require('../../../icon/feedback.png')} style={styles.iconStart} />
                        <Text style={styles.textLeftRating}>{total.review}</Text>
                        <Text style={styles.textCenterRating}></Text>
                        <Text style={styles.textRightRating}>Ulasan</Text>
                    </View>
                </View>
                <View style={{ flex: 1, }}>
                    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                        {review && review.length ?
                            review.map((item, index) => {
                                return (
                                    <View key={index + 'KZ'} style={styles.cardUlasan}>
                                        <View style={Style.row_space}>
                                            <View style={[style.row, { backgroundColor: 'white' }]}>
                                                <View style={styles.imageProfile}>
                                                    <Image source={{ uri: item.image_user }} style={styles.imageProfileItem} />
                                                </View>
                                                <View style={style.column_center_start}>
                                                    <Text style={Style.font_13}>{item.nama_lengkap}</Text>
                                                    <Text style={Style.font_12}>{String(item.date_created).slice(0, 16)}</Text>
                                                    {/* <Text style={Style.font_12}>{item.comment}</Text> */}
                                                    {/* <Text style={Style.font_13}>Ukuran {item.keterangan.ukuran + ", " + item.keterangan.Warna} </Text> */}
                                                </View>
                                            </View>
                                            <View style={styles.starRatings}>
                                                {starGold(item.rating)}
                                            </View>
                                        </View>

                                        <View style={[Style.px, Style.py_2]}>
                                            <Text style={Style.font_13}>{item.comment}</Text>
                                        </View>
                                        {item.image && item.image.length ?
                                            < View style={[Style.row_0]}>
                                                {console.log("🚀 ~ file: Ulasan.js ~ line 195 ~ review.map ~ item.image", item.image, index)}
                                                {item.image.map(img => {
                                                    return (
                                                        <Image style={[Style.mr_3, { width: Wp('29%'), height: Wp('49%'), backgroundColor: Colors.silver }]} source={{ uri: img }} />
                                                    )
                                                })
                                                }
                                            </View>
                                            : <Text style={[Style.font_12, { color: Colors.silver, alignSelf: 'center' }]}>Tidak ada gambar</Text>
                                        }
                                        {item.video ?
                                            <View style={[Style.row_center, Style.mt_2, { backgroundColor: Colors.blackgrayScale, alignSelf: 'center' }]}>
                                                <VideoPlayer
                                                    video={{ uri: item.video }}
                                                    resizeMode="cover"
                                                    style={{ width: Wp('94%'), height: Wp('75%') }}
                                                    disableFullscreen={false}
                                                    fullScreenOnLongPress={true}
                                                />
                                            </View>
                                            : null
                                        }

                                        {openTextReply && index === pressed ?
                                            <View style={[Style.row_0_center, Style.p_2, Style.font_13, { backgroundColor: Colors.white }]}>
                                                <TextInput
                                                    autoFocus={true}
                                                    // onBlur={() => setOpenTextReply(false)}
                                                    style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 0.2, borderRadius: 3, marginRight: '1%' }}
                                                    onChangeText={text => setTextReply(text)}
                                                    value={textReply}
                                                />
                                                <Button mode='contained' color={Colors.biruJaja} labelStyle={[Style.font_12, Style.semi_bold, { color: Colors.white }]} onPress={() => handleReview(item.rating_id)}>
                                                    SEND
                                                </Button>
                                            </View>
                                            :
                                            item.is_response ?
                                                <Button style={{ width: Wp('20%'), alignSelf: 'flex-end' }} mode='text' color={Colors.biruJaja} labelStyle={[Style.font_12, Style.semi_bold, { color: Colors.blackgrayScale }]} onPress={() => {
                                                    setOpenTextReply(true)
                                                    setpressed(index)
                                                }} >
                                                    Balas
                                                </Button>
                                                : null
                                        }
                                        {
                                            !item.is_response ?
                                                <View style={[styles.cardUlasan, Style.pl_4, Style.mt_2]}>
                                                    <View style={[style.row, { backgroundColor: 'white' }]}>
                                                        <View style={styles.imageProfile}>
                                                            <Image source={{ uri: reduxSeller.foto }} style={styles.imageProfileSeller} />
                                                        </View>
                                                        <View style={style.column_center_start}>
                                                            <Text style={Style.font_13}>{reduxSeller.nama_toko}</Text>
                                                            <Text style={Style.font_13}>{String(item.date_response).slice(0, 16)}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={[Style.px, Style.py_2]}>
                                                        <Text style={[Style.font_13, { fontSize: 13 }]}>{item.message_response}</Text>
                                                    </View>
                                                </View>
                                                : null
                                        }

                                    </View>
                                )
                            })
                            : <View><Text>Kosong</Text></View>
                        }
                    </ScrollView>
                </View>
            </View >
            {/* {
                openTextReply ?
                    <View style={styles.inputReply}>
                        <FlatList
                            data={textAutoReply}
                            horizontal={true}
                            renderItem={renderAutoReply}

                        />
                        <View style={[Style.row_0_center, Style.p_2, Style.font_13,{backgroundColor: Colors.white}]}>
                            <TextInput
                                autoFocus={true}
                                // onBlur={() => setOpenTextReply(false)}
                                style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 0.2, borderRadius: 5, marginRight: '1%' }}
                                onChangeText={text => setTextReply(text)}
                                value={textReply}

                            />
                            <Text onPress={() => alert(textReply)} adjustsFontSizeToFit style={{ flex: 0, alignItems: 'center', justifyContent: 'center', paddingVertical: '2.5%', paddingHorizontal: '4%', fontSize: 16, alignSelf: 'center' }}>Send</Text>
                        </View>
                    </View>

                    : null
            } */}
        </SafeAreaView >
    )
}


const styles = StyleSheet.create({
    imageProduk: {
        width: Wp('50%')
    },
    textWrapperRating: { flex: 0, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2%' },
    iconStart: { height: Hp('4.5%'), width: Hp('4.5%'), flex: 0, resizeMode: 'contain', marginRight: '3%' },
    textLeftRating: {
        fontSize: 22,
        color: 'grey',
        fontFamily: 'Poppins-SemiBold',
        marginRight: '1%',
        marginBottom: '-2%'
    },
    textCenterRating: {
        flex: 0,
        fontSize: 13,
        color: 'grey',
        fontWeight: '900',
        marginRight: '5%',
        textAlignVertical: 'bottom'

    },
    textRightRating: {
        flex: 1,
        fontSize: 16,
        color: 'grey',
        fontWeight: '900',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        // backgroundColor: 'blue',
        textAlign: 'right',
        fontFamily: 'Poppins-Regular'
    },
    cardUlasan: {
        flex: 0,
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: '2%',
        marginBottom: '1.5%'
    },
    imageProfile: {
        flex: 0,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '1.5%',
    },
    imageProfileItem: {
        borderRadius: 50,
        width: 50, height: 50,
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: Colors.silver,
        zIndex: 999
    },
    imageProfileSeller: {
        borderRadius: 50,
        width: 40, height: 40,
        justifyContent: 'center',
        borderWidth: 0.2,
        borderColor: Colors.silver
    },
    starRatings: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
    },
    inputText: {


    },
    inputReply: {
        flex: 0,
        flexDirection: 'column',
        // padding: '2%',

    },
    autoReply: {
        flex: 0,
        flexDirection: 'row',
        marginBottom: '1%'
    }
})
