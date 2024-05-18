import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Button } from 'react-native-paper'
import styles from '../../../styles/penjualan'
import Shimmer from '../../../component/shimmerPenjualan'
import { useSelector, useDispatch } from 'react-redux'
import { getAllOrders } from '../../../service/Orders';
import { getAllOrdersStorage } from '../../../service/Storage';
import { checkSignal } from '../../../utils'
import EncryptedStorage from 'react-native-encrypted-storage';
import { Style, Wp, Hp, Colors, ServiceOrdersNew } from '../../../export';

export default function index(props) {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const orderSent = useSelector(state => state.orders.orderSent)
    const reduxSellerId = useSelector(state => state.user.seller?.id_toko)

    const [shimmer, setShimmer] = useState(false)
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async (e) => {
        setShimmer(true)
        getSent()
    })

    const getSent = async () => {
        //pesananSedangDikirim
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

    const handlePress = (inv) => {
        dispatch({ type: 'SET_ORDER_DETAIL', payload: "" })
        navigation.navigate('DetailsPesanan', { data: inv })
    }

    return (
        <ScrollView
            style={[Style.container, { backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}>
            {shimmer ? <Shimmer /> :
                orderSent && orderSent.length ?
                    orderSent.map((item, idx) => {
                        if (item.status_komplain === "T") {

                            return (
                                <View key={String(idx)} style={styles.card} >
                                    <View style={[Style.row_space, { flex: 0 }]}>
                                        <Text style={styles.textName}>{String(item.customerName).substr(0, 15)} - <Text style={styles.textDate}>{item.invoice}</Text></Text>
                                        <Text style={styles.textDate}>{item.status === "Belum Bayar" ? item.date.created_date : item.date.payment_date}</Text>
                                    </View>
                                    <View style={[styles.bodyCard,]}>
                                        <View style={styles.image}>
                                            <Image source={{ uri: item.product.image }} style={styles.imageItem} />
                                        </View>
                                        <View style={[Style.column, Style.px_2, { justifyContent: 'space-between', height: Wp('17%'), width: Wp('72%'), alignItems: 'flex-start' }]}>
                                            <Text numberOfLines={1} style={[Style.font_14, { width: '100%' }]}>{item.product.name}</Text>
                                            <Text numberOfLines={1} style={[Style.font_13, Style.semi_bold, { color: Colors.biruJaja }]}>{item.totalOrderCurrencyFormat}</Text>

                                            <Text numberOfLines={1} style={[Style.font_13, { color: Colors.kuningJaja }]}>{item.status_komplain === "Y" ? 'Pesanan anda sedang dikomplain!' : ''}</Text>
                                        </View>
                                    </View>
                                    <View style={[Style.column, Style.px_3]}>
                                    </View>
                                    <View style={[Style.row_0_center, { paddingVertical: '2%', paddingHorizontal: '3%' }]}>
                                        {item.shipping?.country ?
                                            <View style={[Style.row_start_center]}>
                                                <Image style={{ height: Wp('4.7%'), width: Wp('4.7%'), tintColor: Colors.biruJaja }} source={require('../../../icon/google-maps.png')} />
                                                <Text style={Style.font_13}> {item.shipping.country}</Text>
                                            </View>
                                            : <View style={[Style.row_start_center]}></View>
                                        }
                                        <View style={[styles.footerCard, { alignSelf: 'flex-end' }]}>
                                            <Button onPress={() => handlePress(item.invoice)} mode="contained" style={{ width: Wp('25%'), zIndex: 100, }} contentStyle={{ width: Wp('25%') }} color={Colors.biruJaja} labelStyle={[Style.font_10, Style.semi_bold, { color: Colors.white }]}>Lihat</Button>
                                        </View>
                                    </View>

                                </View>
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

