import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, SafeAreaView, Dimensions, ScrollView, RefreshControl, TouchableOpacity, Image, ToastAndroid, LogBox, Platform } from 'react-native'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Account from './account';
import Banner from './banner';
import OpenStore from './scheduleToko';
import * as FecthData from '../../service/Data'
const initialLayout = { width: Dimensions.get('window').width };
import { Colors, Loading, Style, useNavigation, Storage, Appbar, Wp, Hp, ServiceAccount } from '../../export'
import { useSelector, useDispatch } from 'react-redux';


export default function AccountToko(props) {
    const navigation = useNavigation();
    const reduxSeller = useSelector(state => state.user.seller)
    console.log("🚀 ~ file: index.js ~ line 16 ~ index ~ reduxSeller", reduxSeller.deskripsi_toko)
    const reduxDashboard = useSelector(state => state.dashboard.dashboard)



    const dispatch = useDispatch()
    const [index, setIndex] = useState(0);
    const [dashboard, setdashboard] = useState("");

    const [loading, setLoading] = useState(false);
    const [refreshControl, setRefreshControl] = useState(false);

    const AccountRoute = () => <Account data={reduxSeller} dashboard={reduxDashboard.jumlah} handleLoading={handleLoading} />;
    const BannerRoute = () => <Banner data={reduxSeller} handleLoading={handleLoading} />;
    const OpenStoreRoute = () => <OpenStore data={reduxSeller} handleLoading={handleLoading} />;

    const [routes] = useState([
        { key: 'first', title: 'Profile' },
        { key: 'second', title: 'Banner' },
        { key: 'third', title: 'Jadwal Toko' },

    ]);

    const renderScene = SceneMap({
        first: AccountRoute,
        second: BannerRoute,
        third: OpenStoreRoute,

    });

    useEffect(() => {
        LogBox.ignoreAllLogs();
        setLoading(false)
        getData()
        setRefreshControl(false)
    }, [props])

    const getData = async () => {
        console.log('masuk')
        try {
            FecthData.getAccount(reduxSeller.id_toko).then(res => dispatch({ type: "SET_SELLER", payload: res.seller }))
            ServiceAccount.getDashboard(reduxSeller.id_toko).then(res => dispatch({ type: "SET_DASHBOARD", payload: res.data }))
            setRefreshControl(false)
            setTimeout(() => setLoading(false), 1000);
        } catch (error) {
            ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    }

    const onRefresh = useCallback(() => {
        setRefreshControl(true)
        getData()
    }, []);

    const handleLoading = (val) => {
        if (val === true) {
            setLoading(val);
        } else {
            getData();
        }
    }

    return (
        <SafeAreaView style={Style.container}>
            {loading ? <Loading /> : null}
            <Appbar back={true} title="Pengaturan Toko" />
            <ScrollView stickyHeaderIndices={[0]} nestedScrollEnabled={true} refreshControl={<RefreshControl refreshing={refreshControl} onRefresh={onRefresh} />}
                style={{ flex: 1, width: Wp('100%'), height: Hp('100%'), backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }}>
                <TabView
                    indicatorStyle={{ backgroundColor: 'white' }}
                    // style={{ backgroundColor: 'pink' }}
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={initialLayout}
                    style={{ width: Wp('100%'), height: Hp('100%') }}
                    renderTabBar={(props) => (
                        <TabBar
                            {...props}
                            indicatorStyle={{ backgroundColor: Colors.biruJaja }}
                            // scrollEnabled={true}
                            style={{ backgroundColor: 'white' }}
                            tabStyle={{ minHeight: 50, minWidth: 100, borderBottomColor: Colors.biruJaja }} // here
                            renderLabel={({ route, focused, color }) => (
                                <Text style={[Style.font_13, Style.medium, { color: focused ? Colors.biruJaja : Colors.blackGrey }]}>
                                    {route.title}
                                </Text>
                            )}
                        />
                    )}
                />
            </ScrollView>
        </SafeAreaView>
    )
}
