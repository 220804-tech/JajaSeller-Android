import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, Dimensions } from 'react-native'
import style from '../../styles/style'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Semua from '../count/history'
import SudahTerlepas from '../count/complete'
import Ditolak from '../count/failed'
import AkanDilepas from '../count/process'
import { Appbar, IconButton } from 'react-native-paper'
import Warna from '../../config/Warna';
const initialLayout = { width: Dimensions.get('window').width };
import { useNavigation } from '@react-navigation/native'
import * as Service from '../../service/Account'

export default function History() {
    const navigation = useNavigation();
    const [index, setIndex] = useState(0);
    const [allData, setallData] = useState([]);

    const SemuaRoute = () => <Semua data={allData} />;
    const SudahTerlepasRoute = () => <SudahTerlepas data={allData} />;
    const AkanDilepasRoute = () => <AkanDilepas data={allData} />;
    const DitolakRoute = () => <Ditolak data={allData} />;

    const [routes] = useState([
        { key: 'first', title: 'Semua' },
        { key: 'third', title: 'Menunggu' },
        { key: 'second', title: 'Selesai' },
        { key: 'fourth', title: 'Ditolak' },
    ]);

    const renderScene = SceneMap({
        first: SemuaRoute,
        second: SudahTerlepasRoute,
        third: AkanDilepasRoute,
        fourth: DitolakRoute,
    });

    const getItem = async () => {
        try {
            let response = await Service.getListTransaction();
            setallData(response.data)
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 42 ~ getItem ~ error", error)
        }
    }

    useEffect(() => {
        getItem()
    }, [])

    return (
        <SafeAreaView style={style.container}>
            <Appbar.Header style={[style.appBar, { flex: 0 }]}>
                <View style={style.row_start_center}>
                    <IconButton
                        style={{ margin: 0 }}
                        icon={require('../../icon/arrow.png')}
                        color={Warna.white}
                        size={23}
                        onPress={() => navigation.goBack()}
                    />
                    <Text adjustsFontSizeToFit style={style.appBarText}>Riwayat Transaksi</Text>
                </View>

            </Appbar.Header>
            <TabView
                indicatorStyle={{ backgroundColor: 'white' }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}

                        style={{ backgroundColor: 'white' }}
                        tabStyle={{ minHeight: 50, minWidth: 100, borderBottomColor: Warna.biruJaja }}
                        renderLabel={({ route }) => (
                            <Text style={{ color: 'black', margin: 3, fontSize: 11, width: 66, textAlign: 'center', padding: '-5%' }}>
                                {route.title}
                            </Text>
                        )}
                    />
                )}
            />
        </SafeAreaView>
    )
}
