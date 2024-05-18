import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Button } from 'react-native-paper'
import styles from '../../../styles/penjualan'
import Shimmer from '../../../component/shimmerPenjualan'
import { connect, useDispatch, useSelector } from 'react-redux'
import { getAllOrders } from '../../../service/Orders';
import { getAllOrdersStorage } from '../../../service/Storage';
import { checkSignal } from '../../../utils'
import EncryptedStorage from 'react-native-encrypted-storage';
import { Style, Wp, Hp, Colors, ServiceOrdersNew } from '../../../export';
import firebaseDatabase from '@react-native-firebase/database';

export default function PesananDikomplain() {
    const orderSent = useSelector(state => state.orders.orderSent)
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const [shimmer, setShimmer] = useState(false)
    const [refreshing, setRefreshing] = useState(false);


    const onRefresh = useCallback(async (e) => {
        setShimmer(true)
        getSent()
    })

    const getSent = async () => {
        //pesananSedangDikirim (ambil yg status complainnya true, cek Flatlist atau map dibawah)
        try {
            let data = [];
            data = await ServiceOrdersNew.getTabSent(reduxSellerId)
            if (data.length) {
                dispatch({ type: 'SET_ORDER_SENT', payload: data })
            }
            setShimmer(false)
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 42 ~ getSent ~ error", error)
            setShimmer(false)
        }
    }
    // const handleRedux = async () => {
    //     try {
    //         let data = {};
    //         let signal = await checkSignal();
    //         if (signal.connect === true) {
    //             data = await getAllOrders()
    //         } else {
    //             const asyncData = await EncryptedStorage.getItem("orders");
    //             if (asyncData && asyncData.length) {
    //                 data = await getAllOrdersStorage()
    //             }
    //             ToastAndroid.show("Periksa kembali koneksi internet anda!", ToastAndroid.LONG, ToastAndroid.CENTER)
    //         }
    //         dispatch({ type: 'SET_ORDERS', payload: data.orders })
    //         dispatch({ type: 'SET_ORDER_UNPAID', payload: data.orderUnpaid })
    //         dispatch({ type: 'SET_ORDER_PAID', payload: data.orderPaid })
    //         dispatch({ type: 'SET_ORDER_PROCESS', payload: data.orderProcess })
    //         dispatch({ type: 'SET_ORDER_SENT', payload: data.orderSent })
    //         dispatch({ type: 'SET_ORDER_COMPLETED', payload: data.orderCompleted })
    //         dispatch({ type: 'SET_ORDER_BLOCKED', payload: data.orderFailed })
    //         setShimmer(false)
    //     } catch (error) {
    //         ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
    //     }
    // }

    const handlePress = (inv, item) => {
        try {
            dispatch({ type: 'SET_ORDER_DETAIL', payload: "" })
            dispatch({ type: 'SET_ORDER_INVOICE', payload: inv })
            dispatch({ type: 'SET_COMPLAIN_TARGET', payload: '' })
            dispatch({ type: 'SET_COMPLAIN_UPDATE', payload: true })
            navigation.navigate('DetailKomplain', { data: inv })
            if (item?.uidCustomer) {
                dispatch({ type: 'SET_ORDER_UID', payload: item.uidCustomer })
                console.log("🚀 ~ file: PesananDikomplain.js ~ line 68 ~ handlePress ~ item.uidCustomer", item.uidCustomer)
                firebaseDatabase()
                    .ref(`/people/${item.uidCustomer ? item.uidCustomer : ''}`)
                    .once('value')
                    .then(snapshot => {
                        let target = snapshot.val();
                        dispatch({ type: 'SET_COMPLAIN_TARGET', payload: target.token })
                    }).catch(err => {
                        console.log("🚀 ~ file: PesananDikomplain.js ~ line 84 ~ handlePress ~ err", err)
                    })
            }
        } catch (error) {
            console.log("🚀 ~ file: PesananDikomplain.js ~ line 90 ~ handlePress ~ error", error)
        }
    }

    return (
        <ScrollView
            style={[Style.container, { backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}>
            {shimmer ? <Shimmer /> :
                orderSent && orderSent.length ?
                    orderSent.map((item, idx) => {
                        if (item.status_komplain === "Y") {
                            return (
                                <TouchableOpacity key={String(idx)} style={styles.card} onPress={() => handlePress(item.invoice, item)}>
                                    <View style={[Style.row_space, { flex: 0 }]}>
                                        <Text style={styles.textName}>{String(item.customerName).substr(0, 15)} - <Text style={styles.textDate}>{item.invoice}</Text></Text>
                                    </View>
                                    <View style={[styles.bodyCard,]}>
                                        <View style={styles.image}>
                                            <Image source={{ uri: item.product.image }} style={styles.imageItem} />
                                        </View>
                                        <View style={[Style.column, Style.px_2, { justifyContent: 'space-between', height: Wp('17%'), width: Wp('72%'), alignItems: 'flex-start' }]}>
                                            <Text numberOfLines={1} style={[Style.font_14, { width: '100%' }]}>{item.product.name}</Text>
                                            <Text numberOfLines={1} style={[Style.font_13, Style.semi_bold, { color: Colors.biruJaja }]}>{item.totalOrderCurrencyFormat}</Text>
                                            <Text numberOfLines={1} style={[Style.font_13, { color: Colors.redNotif }]}>Pesanan anda sedang dikomplain!</Text>
                                        </View>
                                    </View>
                                    <View style={[Style.column, Style.px_3]}>
                                    </View>
                                    <View style={[Style.row_0_center, { paddingVertical: '2%' }]}>
                                        {item.shipping.country ?
                                            <View style={[Style.row_start_center, { paddingHorizontal: '3%' }]}>
                                                <Image style={{ height: Wp('5%'), width: Wp('5%'), tintColor: Colors.kuningJaja }} source={require('../../../icon/google-maps.png')} />
                                                <Text style={styles.textTitle}>{item.shipping.country}</Text>
                                            </View>
                                            :
                                            <View style={[Style.row_start_center, { paddingHorizontal: '3%' }]}>
                                            </View>
                                        }
                                        <View style={styles.footerCard}>
                                            <Button onPress={() => handlePress(item.invoice)} mode="contained" style={{ width: Wp('25%'), zIndex: 100, }} contentStyle={{ width: Wp('25%') }} color={Colors.biruJaja} labelStyle={[Style.font_10, Style.semi_bold, { color: Colors.white }]}>Lihat</Button>
                                        </View>
                                    </View>

                                </TouchableOpacity>
                            )
                        }
                    })
                    : <View style={{ width: Wp('100%'), height: Hp('40%'), justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Tidak ada data</Text>
                    </View>
            }
        </ScrollView>
    )
}

