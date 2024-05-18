import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { Button, Checkbox } from 'react-native-paper'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import style from '../../../styles/style'
import styles from '../../../styles/penjualan'
import Warna from '../../../config/Warna'
import Shimmer from '../../../component/shimmerPenjualan'
import { useDispatch, useSelector } from 'react-redux'
import { Style, Wp, Colors, Utils, ServiceOrdersNew } from '../../../export';

export default function index() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const orderProcess = useSelector(state => state.orders.orderProcess)
    const reduxInvoicePickups = useSelector(state => state.orders.invoicePickups)
    const reduxSellerId = useSelector(state => state.user.seller?.id_toko)

    const [shimmer, setShimmer] = useState(false)
    const [refreshing, message] = useState(false);
    const [count, setCount] = useState(0);

    useEffect(() => {
        dispatch({ type: 'SET_INVOICE_PICKUP', payload: [] })
    }, [])

    const onRefresh = useCallback((e) => {
        setShimmer(true)
        getNeedSent()
    })


    const getNeedSent = async () => {
        //pesananBelumDikirim
        try {
            let data = [];
            data = await ServiceOrdersNew.getTabNeedSent(reduxSellerId)
            if (data.length) {
                dispatch({ type: 'SET_ORDER_PROCESS', payload: data })
            }
            setShimmer(false)
            setTimeout(() => dispatch({ type: "SET_ORDER_REFRESH", payload: true }), 3000);
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 46 ~ getNeedSent ~ error", error)
            setShimmer(false)
        }
    }
    const handlePress = (inv) => {
        navigation.navigate('DetailsPesanan', { data: inv })
    }

    const handleRequestPickup = (item, idx) => {
        let newItem = item
        let newArr = orderProcess
        let newInPicks = reduxInvoicePickups
        console.log("🚀 ~ file: index.js ~ line 51 ~ handleRequestPickup ~ item", item.invoice)
        console.log("🚀 ~ file: index.js ~ line 58 ~ handleRequestPickup ~ JSON.stringify(newInPicks).includes(item.invoice)", JSON.stringify(newInPicks).includes(item.invoice))
        if (!!item?.pickup && JSON.stringify(newInPicks).includes(item.invoice)) {
            newItem.pickup = false
            const found = newInPicks.find(element => element === item.invoice);
            const filter = newInPicks.filter(element => element.indexOf(found) === -1)
            dispatch({ type: 'SET_INVOICE_PICKUP', payload: filter })
        } else {
            newItem.pickup = true
            newArr[idx] = newItem
            newInPicks.push(item.invoice)
            dispatch({ type: 'SET_INVOICE_PICKUP', payload: newInPicks })
        }
        dispatch({ type: 'SET_ORDER_PROCESS', payload: newArr })
        dispatch({ type: 'SET_ORDER_COUNT', payload: Math.random() })
        setCount(count + 1)
    }

    return (
        <ScrollView
            style={[Style.container, { backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}>
            {shimmer ? <Shimmer /> :
                orderProcess && orderProcess.length ?
                    orderProcess.map((item, idx) => {
                        return (
                            <View key={String(idx)} style={styles.card}>
                                <View style={[Style.row_space, { flex: 0 }]}>
                                    <Text style={styles.textName}>{String(item.customerName).substr(0, 15)} - <Text style={styles.textDate}>{item.invoice}</Text></Text>
                                    <Text style={styles.textDate}>{item.status === "Belum Bayar" ? item.date.created_date : item.date.payment_date}</Text>
                                </View>
                                <View style={styles.bodyCard}>
                                    <View style={styles.image}>
                                        <Image source={{ uri: item.product.image }} style={styles.imageItem} />
                                    </View>
                                    <View style={{ flex: 3, height: wp('18%'), justifyContent: 'space-around', alignItems: 'flex-start', flexDirection: 'column' }}>
                                        <View style={[Style.row_between_center]}>
                                            <Text numberOfLines={1} style={[Style.font_13, { flex: 1 }]}>{item.product.name}</Text>
                                        </View>
                                        <Text style={[Style.font_12, { flex: 1, }]}>{item.totalOrderCurrencyFormat} {item.isHasDiscount ? <Text style={[Style.font_10, { textDecorationLine: 'line-through' }]}>{item.baseTotalOrderCurrencyFormat}</Text> : null}</Text>
                                        <Text onPress={() => handlePress(item.invoice)} style={[Style.font_12, { color: Colors.biruJaja, flex: 1, }]}>Rician Pesanan</Text>
                                    </View>
                                    {/* <View style={{ flex: 3, height: wp('17%'), justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'column' }}>
                                        <View style={Style.column}>
                                            <Text style={styles.textTitle}>{item.product.name}</Text>
                                            {item.isHasDiscount ? <Text style={styles.textPriceBefore}>{item.baseTotalOrderCurrencyFormat}</Text> : null}
                                            <Text style={styles.textPrice}>{item.totalOrderCurrencyFormat}</Text>
                                        </View>
                                        <View style={[Style.row_0_center, { marginBottom: '5%' }]}>
                                            <Text style={[styles.textDetail, Style.row_start_center]}>Rician Pesanan</Text>
                                            {item.status === "Pesanan Baru" ?
                                                <Text style={[styles.textDetail, Style.row_end_center, { color: Warna.redPower, textAlign: 'right' }]}>{item.date.limitTerima ? item.date.limitTerima : null}</Text>
                                                : null}
                                        </View>
                                    </View> */}
                                </View>
                                {/* {item.status === "Pesanan Baru" ?
                                                <Text style={[Style.font_11, Style.row_end_center, { color: Colors.redPower, textAlign: 'left' }]}>Berakhir dalam {item.date.limitTerima ? item.date.limitTerima : null}</Text>
                                                : null} */}
                                {/* <View style={[Style.row_0_center, { paddingVertical: '2%' }]}>
                                        {item.status === "Pesanan Baru" ?
                                            <Text style={[Style.font_11, Style.row_end_center, { color: Colors.redPower, textAlign: 'left' }]}> {item.date.limitTerima ? item.date.limitTerima : null}</Text>
                                            : null}
                                        <View style={[Style.row_start_center]}>
                                            <Image style={{ height: Wp('4.7%'), width: Wp('4.7%') }} source={require('../../../icon/google-maps.png')} />
                                            <Text style={Style.font_13}> {item.shipping.country}</Text>
                                        </View>
                                    </View> */}
                                <View style={[Style.row_between_center, { paddingVertical: '2%', paddingHorizontal: '3%' }]}>
                                    <View style={Style.column_start}>
                                        <View style={[Style.row_start_center, Style.mb]}>
                                            <Image style={{ height: Wp('4.7%'), width: Wp('4.7%'), tintColor: Colors.kuningJaja }} source={require('../../../icon/google-maps.png')} />
                                            <Text style={Style.font_13}> {item.shipping.country ? item.shipping.country : '-'}</Text>
                                        </View>
                                        {String('rajacepat - race').includes(item.shipping?.code) ?
                                            <View style={[Style.row_start_center, { marginLeft: '-6%' }]}>
                                                <Checkbox
                                                    color={Colors.biruJaja}
                                                    status={item.pickup ? 'checked' : 'unchecked'}
                                                    onPress={() => handleRequestPickup(item, idx)}
                                                />
                                                <Text style={[Style.font_13]}>Request Pickup</Text>
                                            </View>
                                            : null}
                                    </View>
                                    <View style={styles.footerCard}>
                                        <Button onPress={() => handlePress(item.invoice)} mode="contained" style={{ width: Wp('25%'), zIndex: 100, }} contentStyle={{ width: Wp('25%') }} color={Colors.biruJaja} labelStyle={[Style.font_10, Style.semi_bold, { color: Colors.white }]}>Lihat</Button>
                                    </View>
                                </View>

                                {/* </View> */}

                            </View>
                        )
                    })
                    : <View style={{ width: wp('100%'), height: hp('40%'), justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Tidak ada data</Text>
                    </View>
            }
        </ScrollView >
    )
}

