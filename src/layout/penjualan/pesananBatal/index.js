import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Button } from 'react-native-paper'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import style from '../../../styles/style'
import styles from '../../../styles/penjualan'
import Warna from '../../../config/Warna'
import Shimmer from '../../../component/shimmerPenjualan'
import { useSelector, useDispatch } from 'react-redux'
import { Colors, ServiceOrdersNew, Style } from '../../../export';

export default function index(props) {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxSellerId = useSelector(state => state.user.seller?.id_toko)
    const orderFailed = useSelector(state => state.orders.orderFailed)

    const [shimmer, setShimmer] = useState(false)
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback((e) => {
        setShimmer(true)
        getFailed()
    })

    const getFailed = async () => {
        //pesananFailed
        try {
            let data = [];
            data = await ServiceOrdersNew.getTabFailed(reduxSellerId)
            if (data.length) {
                dispatch({ type: 'SET_ORDER_PROCESS', payload: data })
            }
            setShimmer(false)
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 40 ~ getFailed ~ error", error)
            setShimmer(false)
        }
    }


    const handlePress = (inv) => {
        navigation.navigate('DetailsPesanan', { data: inv })
    }

    return (
        <ScrollView
            style={[Style.container, { backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}>
            {shimmer ? <Shimmer /> :
                orderFailed && orderFailed.length ?
                    orderFailed.map((item, idx) => {
                        return (
                            <TouchableOpacity key={String(idx)} style={styles.card} onPress={() => handlePress(item.invoice)}>
                                <View style={[style.row_space, { flex: 0 }]}>
                                    <Text style={styles.textName}>{String(item.customerName).substr(0, 15)} - <Text style={styles.textDate}>{item.invoice}</Text></Text>
                                    <Text style={styles.textDate}>{item.created_date} {item.time}</Text>
                                </View>
                                <View style={styles.bodyCard}>
                                    <View style={styles.image}>
                                        <Image source={{ uri: item.product.image }} style={styles.imageItem} />
                                    </View>
                                    <View style={[style.column_start, { height: '100%', paddingVertical: '1%', justifyContent: 'space-between', alignItems: 'flex-start', flex: 3 }]}>
                                        <View>
                                            <Text style={styles.textTitle}>{item.product.name}</Text>
                                            <Text style={styles.textPrice}>{item.totalOrderCurrencyFormat}</Text>
                                        </View>
                                        <Text style={styles.textDetail}>Rician Pesanan</Text>
                                    </View>
                                </View>
                                <View style={styles.footerCard}>
                                    <Button onPress={() => handlePress(item.invoice)} mode="contained" style={{ width: wp('25%'), zIndex: 100, }} contentStyle={{ width: wp('25%') }} color={Colors.biruJaja} labelStyle={[Style.font_10, Style.semi_bold, { color: Warna.white }]}>Lihat</Button>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                    : <View style={{ width: wp('100%'), height: hp('40%'), justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Tidak ada data</Text>
                    </View>
            }


        </ScrollView>
    )
}
