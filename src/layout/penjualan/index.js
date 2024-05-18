import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Dimensions, StatusBar, Image, Platform } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Semua from './semua';
import PesananBaru from './pesananBaru';
import PerluDikirim from './perluDikirim';
import PesananDikirim from './pesananDikirim';
import PesananSelesai from './pesananSelesai';
import PesananBatal from './pesananBatal';
import { useDispatch, useSelector } from 'react-redux'
import { Style, Colors, Utils, ServiceOrders, NotFound, Loading, ServiceOrdersNew } from '../../export';
import PesananDikomplain from './pesananDikomplain/PesananDikomplain';
import { Appbar, TouchableRipple } from 'react-native-paper';
const initialLayout = { width: Dimensions.get('window').width };


export default function Penjualan() {
    const dispatch = useDispatch()
    const reduxSellerId = useSelector(state => state.user.seller?.id_toko)
    const reduxInvoicePickups = useSelector(state => state.orders.invoicePickups)

    const orders = useSelector(state => state.orders.orders)
    const orderPaid = useSelector(state => state.orders.orderPaid)
    const orderProcess = useSelector(state => state.orders.orderProcess)
    const orderSent = useSelector(state => state.orders.orderSent)
    const orderCompleted = useSelector(state => state.orders.orderCompleted)
    const orderFailed = useSelector(state => state.orders.orderFailed)

    const orderRefresh = useSelector(state => state.orders.orderRefresh)
    console.log("🚀 ~ file: index.js ~ line 30 ~ Penjualan ~ orderRefresh", orderRefresh)

    const reduxSeller = useSelector(state => state.user.seller)
    const reduxAuth = useSelector(state => state.user.token)

    const [index, setIndex] = useState(0);
    const [count, setCount] = useState(0)
    const [complain, setComplain] = useState(0)
    const [sent, setSent] = useState(0)
    const [loading, setloading] = useState(false)

    const [routes, setroutes] = useState([
        { key: 'first', title: 'Semua', count: orders?.length },
        { key: 'second', title: 'Pesanan Baru', count: orderPaid?.length },
        { key: 'third', title: 'Perlu dikirim', count: orderProcess?.length },
        { key: 'fourth', title: 'Dikirimkan', count: 0 },
        { key: 'fifth', title: 'Selesai', count: orderCompleted?.length },
        { key: 'sixth', title: 'Batal', count: orderFailed?.length },
        { key: 'seventh', title: 'Pengembalian', count: complain },
    ]);

    const renderScene = SceneMap({
        first: Semua,
        second: PesananBaru,
        third: PerluDikirim,
        fourth: PesananDikirim,
        fifth: PesananSelesai,
        sixth: PesananBatal,
        seventh: PesananDikomplain
    });

    useEffect(() => {
        handleCount()
        console.log("🚀 ~ file: index.js ~ line 64 ~ Penjualan ~ orderRefresh", orderRefresh)
        return () => { }
    }, [orderRefresh, orderSent])


    const handleCount = () => {
        console.log('test')
        try {
            if (reduxAuth && orderRefresh) {
                setCount(count + 1)
                let sentCount = 0;
                let complainCount = 0;
                console.log("🚀 ~ file: index.js ~ line 74 ~ handleCount ~ orderSent", orderSent.length)
                if (orderSent && orderSent.length) {
                    orderSent.map(item => {
                        if (item.status_komplain == 'Y') {
                            complainCount += 1
                        } else {
                            sentCount += 1
                        }
                    })
                }
                let newObj = routes;
                console.log("🚀 ~ file: index.js ~ line 83 ~ handleCount ~ sentCount", sentCount)
                routes[3].count = sentCount
                routes[6].count = complainCount
                setroutes(newObj)
                dispatch({ type: "SET_ORDER_REFRESH", payload: false })
            }
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 108 ~ handleCount ~ error", error)
        }
    }
    // useEffect(() => {
    //     // setloading(true)
    //     handleOrder()
    //     return () => { }
    // }, [])

    // useFocusEffect(
    //     useCallback(() => {
    //         if (orderRefresh && reduxAuth) {
    //             dispatch({ type: 'SET_ORDER_REFRESH', payload: false })
    //             Firebase.sellerNotifications('orders', reduxSeller.uid)
    //         }
    //     }, [orderRefresh]),
    // );

    const handlePickup = async () => {
        try {
            setloading(true)
            let resposonse = await ServiceOrders.requestPickup(reduxSeller.id_toko, reduxInvoicePickups)
            if (resposonse) {
                getNeedSent()
                getSent()
                setloading(false)
                Utils.alertPopUp('Pickup berhasil diajukan!')
                dispatch({ type: 'SET_INVOICE_PICKUP', payload: [] })
            } else {
                setloading(false)
            }
        } catch (error) {
            setloading(false)
        }

    }

    const getNeedSent = async () => {
        //pesananBelumDikirim
        try {
            let data = [];
            data = await ServiceOrdersNew.getTabNeedSent(reduxSellerId)
            if (data.length) {
                dispatch({ type: 'SET_ORDER_PROCESS', payload: data })
            }
            setShimmer(false)
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 46 ~ getNeedSent ~ error", error)
            setShimmer(false)
        }
    }

    const getSent = async () => {
        //pesananSedangDikirim
        try {
            let data = [];
            data = await ServiceOrdersNew.getTabSent(reduxSellerId)
            if (data.length) {
                dispatch({ type: 'SET_ORDER_SENT', payload: data })
            }
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 112 ~ getSent ~ error", error)
        }
    }
    return (
        <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: Platform.OS === 'ios' ? Colors.biruJaja : Colors.whiteGrey }}>
            <StatusBar translucent={false} backgroundColor={Colors.biruJaja} barStyle="light-content" />
            {loading || orderRefresh ? <Loading /> : null}
            <Appbar.Header style={Style.appBar}>
                <View style={Style.row_start_center}>
                    <Text style={[Style.appBarText, { marginBottom: '-1%' }]}>Penjualan  </Text>
                </View>
                {reduxInvoicePickups?.length ?
                    <TouchableRipple onPress={handlePickup} style={[Style.row_end_center, Style.px_3, Style.py, { flex: 0, borderRadius: 3, backgroundColor: Colors.white, }]}>
                        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                            <Text style={[Style.font_13, Style.semi_bold, { marginBottom: '-1%', color: Colors.biruJaja }]}>Pickup   </Text>
                            <View style={[Style.row_0_center, { alignItems: 'center' }]}>
                                <Image style={[Style.icon_14, { alignItems: 'center', tintColor: Colors.biruJaja }]} source={require('../../icon/plus-sign.png')} />
                            </View>
                        </View>
                    </TouchableRipple>
                    : null
                }
            </Appbar.Header>

            {reduxAuth ?
                <TabView
                    indicatorStyle={{ backgroundColor: 'white' }}
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={initialLayout}
                    renderTabBar={props => (
                        <TabBar
                            {...props}
                            indicatorStyle={{ backgroundColor: Colors.biruJaja }}
                            bounces={true}
                            scrollEnabled={true}
                            style={{ backgroundColor: 'white' }}
                            tabStyle={{ minHeight: 50, flex: 0, width: 125, borderBottomColor: Colors.biruJaja, borderRightColor: 'grey', justifyContent: 'center', alignSelf: 'center' }} // here
                            renderLabel={({ route, focused, }) => {
                                // console.log("🚀 ~ file: index.js ~ line 190 ~ Penjualan ~ route", route)
                                return (
                                    <View style={[Style.row_0_center, { width: 100, height: '100%' }]}>
                                        <View style={[Style.row_center, { width: '100%', textAlign: 'center' }]}>
                                            <Text style={Style.font_12}>{route.title} </Text>
                                            {route.count ?
                                                <Text style={Style.font_10}>({route.count > 99 ? "99+" : route.count})</Text>
                                                : null}

                                        </View>
                                    </View>
                                )
                            }}
                        />
                    )}
                />
                : <NotFound text="sepertinya kamu belum login.." />}
        </SafeAreaView >
    );
}

