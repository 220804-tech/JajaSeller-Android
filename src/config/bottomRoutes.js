import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, ToastAndroid } from 'react-native'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NewBeranda, Produk, ListChat, Promosi, Penjualan } from "./pages";
import database from "@react-native-firebase/database"
import { connect, useDispatch, useSelector } from 'react-redux'
import { getAllOrders } from '../service/Orders';
import { checkSignal } from '../utils'
import { getAllOrdersStorage } from '../service/Storage';
import { getNotifications } from '../service/Notifikasi'
import EncryptedStorage from 'react-native-encrypted-storage';
import { Hp, Style, Colors, Wp, Utils, ServiceAccount, Loading, ServiceOrdersNew } from '../export'
const HomeStack = createBottomTabNavigator();

function BottomRoutes(props) {
    const notifikasi = useSelector(state => state.dashboard.notifikasi)
    const dashboardLoading = useSelector(state => state.loading.dashboard)
    const reduxSellerId = useSelector(state => state.user.seller?.id_toko)

    const dispatch = useDispatch()
    const reduxUser = useSelector(state => state.user.seller)
    const reduxAuth = useSelector(state => state.user.token)

    useEffect(() => {
        // handleDashboard()
        handleChat();
        handleNotifikasi()
        setTimeout(() => {
            dispatch({ type: "SET_DASHBOARD_LOADING", payload: false })
        }, 3000);
    }, [])


    const handleNotifikasi = async () => {
        try {
            let response = await getNotifications();
            if (response && Object.keys(response).length && response.data && Object.keys(response.data).length) {
                let data = await response.data.transaksi.reverse().concat(response.data.wishlist).reverse()
                let filter = await data.sort(function (a, b) {
                    return new Date(b.date) - new Date(a.date);
                });
                dispatch({ type: "SET_ALL_NOTIF", payload: filter })
                dispatch({ type: "SET_WISHLISTS", payload: response.data.wishlist })
                dispatch({ type: "SET_INFOJAJA", payload: response.data.from_jaja })
            }
        } catch (error) {
            console.log("🚀 ~ file: bottomRoutes.js ~ line 41 ~ handleNotifikasi ~ error", error)
        }
    }

    const handleCountNotifikasi = async () => {
        try {
            let data = "";
            let signal = await Utils.checkSignal()
            if (signal.connect === true) {
                data = await ServiceAccount.getProfile()
            } else {
                const asyncData = await EncryptedStorage.getItem("dashboard");
                if (asyncData) {
                    data = JSON.parse(asyncData)
                }
                Utils.alertPopUp("Periksa kembali koneksi internet anda!")
            }
            dispatch({ type: 'SET_DASHBOARD', payload: data })
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 117 ~ handleDashboard ~ error", error)
        }
    }

    const getAll = async () => {
        // semuapesanan
        try {
            ServiceOrdersNew.getTabAll(reduxSellerId).then(res => res?.length ? dispatch({ type: 'SET_ORDERS', payload: res }) : '')
            ServiceOrdersNew.getTabPaid(reduxSellerId).then(res => res?.length ? dispatch({ type: 'SET_ORDER_PAID', payload: res }) : '')
            ServiceOrdersNew.getTabNeedSent(reduxSellerId).then(res => res?.length ? dispatch({ type: 'SET_ORDER_PROCESS', payload: res }) : '')
            ServiceOrdersNew.getTabSent(reduxSellerId).then(res => res?.length ? dispatch({ type: 'SET_ORDER_SENT', payload: res }) : '')
            ServiceOrdersNew.getTabCompleted(reduxSellerId).then(res => res?.length ? dispatch({ type: 'SET_ORDER_COMPLETED', payload: res }) : '')
            ServiceOrdersNew.getTabFailed(reduxSellerId).then(res => res?.length ? dispatch({ type: 'SET_ORDER_BLOCKED', payload: res }) : '')
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 81 ~ getListOrders ~ error", String(error))
        }
    }

    const handleChat = () => {
        try {
            database().ref("/people/" + reduxUser.uid + "/notif/").on("value", async function (snapshot) {
                let result = snapshot.val()
                if (result) {
                    database().ref("/friend/" + reduxUser.uid).on("value", function (snapshott) {
                        var returnArray = [];
                        snapshott.forEach(function (snap) {
                            var item = snap.val();
                            item.id = snap.key;
                            if (item.id !== reduxUser.uid && item.id !== "null") {
                                returnArray.push(item);
                                let countChat = 0
                                returnArray.map(item => countChat += item.amount)
                                result.chat = countChat
                            }
                        });
                        if (notifikasi.orders > 0 || notifikasi.chat > 0) {
                            getAll()
                        }

                        dispatch({ type: 'SET_NOTIFIKASI', payload: result })
                        handleCountNotifikasi()
                    });
                    database().ref(`/people/${reduxUser.uid}/notif`).set({ home: result.home ? result.home : 0, chat: result.chat ? result.chat : 0, orders: result.orders ? result.orders : 0 })
                }
            })
        } catch (error) {
            console.log("🚀 ~ file: bottomRoutes.js ~ line 112 ~ handleChat ~ error", error)
        }
    }

    // const handleRedux = async () => {
    //     try {
    //         let data = {};
    //         let signal = await Utils.checkSignal();
    //         if (signal.connect == true) {
    //             data = await getAllOrders()
    //         } else {
    //             const asyncData = await EncryptedStorage.getItem("orders");
    //             if (asyncData && asyncData.length) {
    //                 data = await Storage.getAllOrderStorage()
    //             } else {
    //                 data = []
    //             }
    //         }
    //         dispatch({ type: 'SET_ORDERS', payload: data.orders })
    //         dispatch({ type: 'SET_ORDER_UNPAID', payload: data.orderUnpaid })
    //         dispatch({ type: 'SET_ORDER_PAID', payload: data.orderPaid })
    //         dispatch({ type: 'SET_ORDER_PROCESS', payload: data.orderProcess })
    //         dispatch({ type: 'SET_ORDER_SENT', payload: data.orderSent })
    //         dispatch({ type: 'SET_ORDER_COMPLETED', payload: data.orderCompleted })
    //         dispatch({ type: 'SET_ORDER_BLOCKED', payload: data.orderFailed })
    //     } catch (error) {
    //         // dispatch({ type: "SET_ORDER_REFRESH", payload: false })
    //     }
    // }

    return (
        <>
            {dashboardLoading ? <Loading /> : null}
            <HomeStack.Navigator initialRouteName="Beranda" backBehavior='initialRoute' screenOptions={{ headerShown: false, tabBarItemStyle: { alignItems: 'center', justifyContent: 'center' } }}>
                <HomeStack.Screen name="Beranda" component={NewBeranda}
                    options={{
                        tabBarLabel: ({ size, focused }) => (
                            <Text numberOfLines={1} style={[Style.font_11, { color: focused ? Colors.kuningJaja : Colors.biruJaja, marginBottom: '3%' }]}>Beranda</Text>
                        ),
                        tabBarIcon: ({ size, focused }) => {
                            return (
                                focused ? <View><Image source={require('../icon/bottomTab/home-yellow.png')} style={[{ width: size - 1, height: size - 1, marginBottom: '-2%' }]} />{reduxAuth && notifikasi && notifikasi.home ? <View style={styles.countNotif}><Text style={styles.textNotif}>{notifikasi.home > 99 ? "99+" : notifikasi.home}</Text></View> : null}</View>
                                    : <View><Image source={require('../icon/bottomTab/home.png')} style={[{ width: size - 1, height: size - 1, marginBottom: '-2%' }]} />{reduxAuth && notifikasi && notifikasi.home ? <View style={styles.countNotif}><Text style={styles.textNotif}>{notifikasi.home > 99 ? "99+" : notifikasi.home}</Text></View> : null}</View>
                            )
                        }
                    }} />
                <HomeStack.Screen name="Produk" component={Produk}
                    options={{
                        tabBarLabel: ({ size, focused }) => (
                            <Text numberOfLines={1} style={[Style.font_11, { marginBottom: '3%', color: focused ? Colors.kuningJaja : Colors.biruJaja, }]}>Produk</Text>
                        ),
                        tabBarIcon: ({ size, focused }) => (
                            focused ? <Image source={require('../icon/bottomTab/product-yellow.png')} style={[{ width: size - 1, height: size - 1, marginBottom: '-2%' }]} />
                                : <Image source={require('../icon/bottomTab/product.png')} style={[{ width: size - 1, height: size - 1, marginBottom: '-2%' }]} />
                        )
                    }}
                />
                <HomeStack.Screen name="Chat" component={ListChat}

                    options={{
                        tabBarLabel: ({ size, focused }) => (
                            <Text numberOfLines={1} style={[Style.font_11, { marginBottom: '3%', color: focused ? Colors.kuningJaja : Colors.biruJaja, marginTop: '0%' }]}>Chat</Text>
                        ),
                        tabBarIcon: ({ size, focused }) => (
                            focused ? <View><Image source={require('../icon/bottomTab/chat-yellow.png')} style={[{ width: size - 1, height: size - 1, marginBottom: '-2%', }]} />{reduxAuth && notifikasi && notifikasi.chat ? <View style={styles.countNotif}><Text style={styles.textNotif}>{notifikasi.chat > 99 ? "99+" : notifikasi.chat}</Text></View> : null}</View>
                                : <View><Image source={require('../icon/bottomTab/chat.png')} style={[{ width: size - 1, height: size - 1, marginBottom: '-2%' }]} />{reduxAuth && notifikasi && notifikasi.chat ? <View style={styles.countNotif}><Text style={styles.textNotif}>{notifikasi.chat > 99 ? "99+" : notifikasi.chat}</Text></View> : null}</View>
                        )
                    }}
                />
                <HomeStack.Screen name="Promosi" component={Promosi}
                    options={{
                        tabBarLabel: ({ size, focused }) => (
                            <Text numberOfLines={1} style={[Style.font_11, { marginBottom: '3%', color: focused ? Colors.kuningJaja : Colors.biruJaja, }]}>Promosi</Text>
                        ),
                        tabBarIcon: ({ size, focused }) => (
                            focused ? <Image source={require('../icon/bottomTab/offer-yellow.png')} style={[[{ width: size - 1, height: size - 1, marginBottom: '-2%' }], { tintColor: Colors.kuningJaja }]} />
                                : <Image source={require('../icon/bottomTab/offer.png')} style={[[{ width: size - 1, height: size - 1, marginBottom: '-2%' }], { tintColor: Colors.biruJaja }]} />
                        )
                    }}
                />

                <HomeStack.Screen name="Penjualan" component={Penjualan}
                    options={{
                        tabBarLabel: ({ size, focused }) => (
                            <Text numberOfLines={1} style={[Style.font_11, { marginBottom: '3%', color: focused ? Colors.kuningJaja : Colors.biruJaja, }]}>Penjualan</Text>
                        ),
                        tabBarIcon: ({ size, focused }) => (
                            focused ? <View><Image source={require('../icon/bottomTab/traffic-yellow.png')} style={[{ width: size - 1, height: size - 1, marginBottom: '-2%' }]} />{reduxAuth && notifikasi && notifikasi.orders ? <View style={styles.countNotif}><Text style={styles.textNotif}>{notifikasi.orders > 99 ? "99+" : notifikasi.orders}</Text></View> : null}</View>
                                : <View><Image source={require('../icon/bottomTab/traffic.png')} style={[{ width: size - 1, height: size - 1, marginBottom: '-2%' }]} />{reduxAuth && notifikasi && notifikasi.orders ? <View style={styles.countNotif}><Text style={styles.textNotif}>{notifikasi.orders > 99 ? "99+" : notifikasi.orders}</Text></View> : null}</View>
                        )
                    }}
                />
            </HomeStack.Navigator>
        </>
    );


}

export default connect(state => ({
    dashboard: state.dashboard,
    orders: state.orders,
    dispatch: state
}))(BottomRoutes)


const styles = StyleSheet.create({

    countNotif: {
        position: 'absolute', height: 17, width: 17, backgroundColor: Colors.redNotif, right: -5, top: -2, borderRadius: 100, alignItems: 'center', justifyContent: 'center'
    },
    textNotif: { fontSize: 9, color: Colors.white, fontFamily: 'Poppins-Regular' },
    textBlue: { fontSize: 12, color: Colors.biruJaja },
    textGrey: { fontSize: 12, color: Colors.blackGrey },

})