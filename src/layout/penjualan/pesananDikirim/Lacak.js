import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Image, RefreshControl, FlatList, StyleSheet, ToastAndroid, ScrollView, Platform } from 'react-native'
import style from '../../../styles/style'
import { Appbar, DataTable, Divider } from 'react-native-paper';
import Warna from '../../../config/Warna';
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { checkSignal } from '../../../utils'

import Loading from '../../../component/loading'
import { Colors, Utils } from '../../../export';
export default function Lacak(props) {
    const navigation = useNavigation();
    const [data, setdata] = useState([])
    const [loading, setLoading] = useState(false)
    const { order } = props.route.params;
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        setLoading(true)
        getItem()
    }, [props])

    const onRefresh = useCallback(() => {
        setRefreshing(false);
        checkNetwork()
        if (order) {
            getItem()
        } else {
            navigation.goBack()
            setTimeout(() => ToastAndroid.show('Ada kesalahan teknis.', ToastAndroid.LONG, ToastAndroid.CENTER), 300);
        }
    }, []);

    const getItem = () => {
        let error = true
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`https://jsonx.jaja.id/core/seller/penjualan/track/${order.invoice}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                error = false
                setdata(result.data)
                setLoading(false)
            })
            .catch(err => {
                error = false
                setLoading(false)
                Utils.handleError(err, 'Error with status code : 12054')
            });
        setTimeout(() => {
            if (error) {
                Utils.alertPopUp("Sedang memuat..")
                setTimeout(() => {
                    if (error) {
                        setLoading(false)
                        Utils.alertPopUp("Koneksi terputus, periksa kembali koneksi internet anda!")
                    }

                }, 7000);
            }
        }, 5000);
    }

    useFocusEffect(
        useCallback(() => {
            checkNetwork()
        }, []),
    );

    const checkNetwork = () => {
        try {
            checkSignal().then(res => {
                handleLoopSignal(res);
                if (res.connect === false) {
                    checkSignal().then(resp => {
                        setTimeout(() => handleLoopSignal(resp), 4000);
                        if (resp.connect === false) {
                            checkSignal().then(respo => {
                                setTimeout(() => handleLoopSignal(respo), 8000);
                            })
                        }
                    })

                }
            })
        } catch (error) {
            Utils.alertPopUp(String(error))
        }
    }


    const handleLoopSignal = (signal) => {
        if (signal.connect === false) {
            Utils.alertPopUp("Periksa kembali koneksi internet anda!")
        } else {
            getItem();
        }
        return signal.connect
    }


    return (
        <SafeAreaView style={style.container}>
            {loading ? <Loading /> : null}
            <View style={style.appBar}>
                <View style={style.row_start_center}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image style={style.appBarIcon} source={require('../../../icon/arrow.png')} />
                    </TouchableOpacity>
                    <Text style={style.appBarText}>Dalam Pengiriman</Text>
                </View>
            </View>
            <View style={[{ flex: 1, backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }]}>
                <ScrollView style={style.column}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>No. Resi</DataTable.Title>
                            <DataTable.Title numeric>{order.receiptNumber ? order.receiptNumber : ""}</DataTable.Title>
                        </DataTable.Header>

                        <FlatList
                            data={data}
                            renderItem={({ item }) => (
                                <>
                                    <View style={{ felx: 1, flexDirection: 'row', width: '100%' }}>
                                        <View style={[style.column, { paddingVertical: '3%', paddingHorizontal: '2%', width: '25%' }]}>
                                            <Text style={styles.textDate}>{item.date}</Text>
                                            <Text style={styles.textDate}>{item.time}</Text>
                                        </View>
                                        <View style={{ felx: 1, flexDirection: 'row', paddingVertical: '3%', width: '75%', height: '100%', paddingHorizontal: '2%', }}>
                                            <Text numberOfLines={2} style={[styles.textInfo, { color: data[0].description === item.description ? Warna.biruJaja : Warna.blackgrayScale }]}>{item.description}</Text>
                                        </View>
                                    </View>
                                    <Divider />
                                </>
                            )}
                        />
                    </DataTable>
                </ScrollView>
            </View>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    textDate: {
        color: Warna.blackgrayScale,
        fontSize: 11,
        textAlign: 'center'
    },
    textInfo: {
        fontSize: 13,
        color: Warna.blackgrayScale
    }

})
