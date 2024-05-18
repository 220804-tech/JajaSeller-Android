import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView, Text, View, TouchableOpacity, ScrollView, StyleSheet, ToastAndroid, Alert, Image, RefreshControl, Platform } from "react-native";
import { Paragraph } from "react-native-paper";
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { Style, Colors, Storage, Appbar } from '../../export';
import { useDispatch, useSelector } from 'react-redux';
export default function Alamat() {
    const navigation = useNavigation();
    const reduxSeller = useSelector(state => state.user.seller)
    const dispatch = useDispatch()
    const [refreshControl, setRefreshControl] = useState(false)

    useEffect(() => {
        setRefreshControl(false)
    }, [])


    useFocusEffect(
        useCallback(() => {
            // getItem()
        }, []),
    );
    const onRefresh = useCallback(() => {
        setRefreshControl(false)
        getData()
    }, []);


    const getData = async () => {
        try {
            let result = await Storage.getIdToko();
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=j4efp81smrg1tpc6gadd6oob219h28k5");
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("https://jsonx.jaja.id/core/seller/pengaturan/profil/" + result, requestOptions)
                .then(response => response.json())
                .then(async result => {
                    setRefreshControl(false)
                    dispatch({ type: "SET_SELLER", payload: result.data.seller })
                })
                .catch(error => {
                    setRefreshControl(false)
                    setTimeout(() => {
                        Alert.alert(
                            "Jaja.id",
                            "Mohon periksa kembali koneksi internet anda!",
                            [
                                { text: "OK", onPress: () => console.log("OK Pressed") }
                            ],
                            { cancelable: false }
                        );
                    }, 200);
                });
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 70 ~ getData ~ error", error)
            setRefreshControl(false)
            setTimeout(() => {
                Alert.alert(
                    "Jaja.id",
                    "Ada kesalahan teknis.",
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                );
            }, 200);
        }
    }
    return (
        <SafeAreaView style={Style.container}>
            <Appbar back={true} title="Alamat" />
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshControl} onRefresh={onRefresh} />
                }
                style={{ backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }}
                contentContainerStyle={Style.p_4}>
                {reduxSeller && reduxSeller.lokasi ? <TouchableOpacity onPress={() => navigation.navigate("EditAlamat", { data: reduxSeller.lokasi })} style={[Style.column_start_center, styles.card]}>
                    <View style={[Style.column, Style.py_4, Style.px_3]}>
                        <View style={[Style.row_space, Style.mb_2]}>
                            <Text style={[Style.font_14, Style.semi_bold, { color: Colors.biruJaja }]}>{reduxSeller.nama_toko ? reduxSeller.nama_toko : ""}</Text>
                            <TouchableOpacity onPress={() => console.log("pressed")}>
                                <Image style={[Style.icon_19, { color: Colors.blackGrey }]} source={require('../../icon/edit_pen.png')} />
                            </TouchableOpacity>
                        </View>
                        <Paragraph style={[Style.font_13, Style.mb]}>{reduxSeller.lokasi.provinsi + ", " + reduxSeller.lokasi.kota_kabupaten + ", " + reduxSeller.lokasi.kecamatan + ", " + reduxSeller.lokasi.kelurahan + ", " + reduxSeller.lokasi.kode_pos + ", " + reduxSeller.lokasi.alamat_toko}</Paragraph>
                        <View style={[Style.row_0_end]}>
                            <Text style={[Style.font_13, { textAlignVertical: "bottom", marginRight: '3%', color: reduxSeller.lokasi.latitude ? Colors.biruJaja : Colors.redPower }]}> {reduxSeller.lokasi.latitude ? "Lokasi sudah dipin" : "Lokasi belum dipin"}</Text>
                            <Image style={[Style.icon_21, { margin: 0, padding: 0 }]} source={require('../../icon/google-maps.png')} />
                        </View>
                    </View>
                </TouchableOpacity>
                    : null}
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white, justifyContent: 'flex-start',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    map: { width: 21, height: 21, marginRight: '0%' },
    options: { width: 19, height: 19, marginRight: '0%', tintColor: Colors.blackGrey },

    buttonMaps: { flex: 0, borderRadius: 20 },
    body: { width: "100%", flex: 1, justifyContent: 'flex-start', backgroundColor: Colors.white, paddingVertical: '4%', paddingHorizontal: '3%', },
})
