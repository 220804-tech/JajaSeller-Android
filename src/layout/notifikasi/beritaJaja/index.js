import React, { useState, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import * as Firebase from '../../../service/Firebase'
import Shimmer from '../../../component/shimmerNotification'
import { useDispatch, useSelector } from 'react-redux';
import { Colors, Style } from '../../../export';
import { getNotifications } from '../../../service/Notifikasi';

export default function index() {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const reduxNotification = useSelector(state => state.notification.infoJaja)
    const reduxSeller = useSelector(state => state.user.seller.uid)
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);


    useFocusEffect(
        useCallback(() => {
            setTimeout(() => Firebase.sellerNotifications("home", reduxSeller), 5000);
        }, []),
    );

    const onRefresh = useCallback(() => {
        setRefreshing(false)
        setLoading(true)
        handleNotifikasi()
        console.log("cok")
    }, []);

    const handleNotifikasi = async () => {
        let response = await getNotifications();
        if (response && Object.keys(response).length && response.data && Object.keys(response.data).length) {
            let data = await response.data.transaksi.reverse().concat(response.data.wishlist).reverse()
            let filter = await data.sort(function (a, b) {
                return new Date(b.date) - new Date(a.date);
            });
            dispatch({ type: "SET_ALL_NOTIF", payload: filter })
            dispatch({ type: "SET_WISHLISTS", payload: response.data.wishlist })
            dispatch({ type: "SET_INFOJAJA", payload: response.data.from_jaja.reverse() })
            setLoading(false)
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {loading ? <Shimmer /> :
                <ScrollView refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}>
                    {
                        reduxNotification && reduxNotification.length ?

                            reduxNotification.map((notif, indx) => {
                                return (
                                    <TouchableOpacity key={indx} style={[Style.column, Style.mb_2, Style.p_3, { backgroundColor: 'white' }]} onPress={() => console.log("pressed")}>
                                        <View style={[Style.row_between_center, Style.mb_3]}>
                                            <Text style={[Style.font_13, Style.medium, { color: Colors.biruJaja }]}>{String(notif.title).substr(0, 30)}</Text>
                                            <Text style={[Style.font_13]}>{notif.date} {notif.time}</Text>
                                        </View>

                                        <View style={Style.column}>
                                            <Text style={[Style.font_14]}>{notif.text}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                            :
                            <Text style={[Style.font_13, Style.text_center]}>Notifikasi kamu masih kosong!</Text>
                    }
                </ScrollView>
            }
        </View>
    )
}