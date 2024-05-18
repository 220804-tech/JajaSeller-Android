import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView, RefreshControl, Platform } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Semua from './semua';
import Wishlist from './wishlist';
import BeritaJaja from './beritaJaja';
import { useDispatch, useSelector } from 'react-redux'
import { getNotifications } from '../../service/Notifikasi'
const initialLayout = { width: Dimensions.get('window').width };
import { Style, Hp, Colors, Appbar, Storage } from '../../export';

export default function Notifikasi() {
  const dataNotifikasi = useSelector(state => state.dashboard.dataNotifikasi)
  const dispatch = useDispatch()
  const [index, setIndex] = useState(0);
  const [notifData, setnotifData] = useState([]);
  const [transaksiData, settransaksiData] = useState([]);
  const [wishlistData, setwishlistData] = useState([]);
  const [jajaData, setjajaData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [shimmer, setshimmer] = useState(Boolean);


  const onRefresh = useCallback(() => {
    setRefreshing(false)
    setshimmer(true)
    handleNotifikasi()
  }, []);

  const SemuaRoute = () => <Semua data={notifData} />;
  // const TransaksiRoute = () => shimmer ? <Shimmer /> : <Transaksi data={transaksiData} />;
  const WishlistRoute = () => <Wishlist data={wishlistData} />;
  const BeritaJajaRoute = () => <BeritaJaja data={jajaData} />;

  const [routes] = useState([
    { key: 'first', title: 'Semua' },
    // { key: 'second', title: 'Transaksi' },
    { key: 'third', title: 'Wishlist' },
    { key: 'fourth', title: 'Info Jaja' },
  ]);

  const renderScene = SceneMap({
    first: SemuaRoute,
    // second: TransaksiRoute,
    third: WishlistRoute,
    fourth: BeritaJajaRoute,
  });

  const handleProps = async () => {
    try {
      if (Object.keys(dataNotifikasi).length) {
        settransaksiData(dataNotifikasi.data.transaksi)
        setwishlistData(dataNotifikasi.data.wishlist)
        setnotifData(dataNotifikasi.data.transaksi.reverse().concat(dataNotifikasi.data.wishlist).reverse())
        setjajaData(dataNotifikasi.data.from_jaja)
        setTimeout(() => setshimmer(false), 250);
      }
    } catch (error) {
      setTimeout(() => setshimmer(false), 500);
    }
  }
  const handleNotifikasi = async () => {
    let response = await getNotifications();
    dispatch({ type: "SET_DATA_NOTIFIKASI", payload: response })
    setTimeout(() => {
      setshimmer(false)
      handleProps()
    }, 1000);
  }
  useEffect(() => {
    handleProps()
    readData()
    setshimmer(true)
  }, [])

  const readData = async () => {
    try {
      let result = await Storage.getIdToko();

      var raw = "";
      var requestOptions = {
        method: 'POST',
        body: raw,
        redirect: 'follow'
      };
      fetch(`https://jsonx.jaja.id/core/seller/dashboard/notifikasi?id_toko=${result}`, requestOptions)
        .then(response => response.json())
        .then(result => console.log("hapus notif"))
        .catch(error => console.log('error', error));
    } catch (error) {
      console.log(error, "error line 95")
    }
  }


  return (
    <SafeAreaView style={Style.container}>
      <Appbar back={true} title="Notifikasi" />
      <View style={[Style.container, { backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }]}>
        <TabView
          style={{ flex: 1 }}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: Colors.biruJaja }}
              style={{ backgroundColor: 'white' }}
              tabStyle={{ minHeight: 50, minWidth: 100, borderBottomColor: Colors.biruJaja }} // here
              renderLabel={({ route, focused, color }) => (
                <Text style={[Style.font_13, { padding: '-5%', color: focused ? Colors.biruJaja : Colors.blackGrey }]}>
                  {route.title}
                </Text>
              )}
            />
          )}
        />
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: Colors.biruJaja,
    height: Hp('7%'),
    color: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '3%',
  },
  appBarIcon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    tintColor: '#ffff',
  },
  appBarText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  item: {
    tintColor: '#ffff',
    alignSelf: 'flex-end',
    textAlign: 'right',
    color: 'white',
  },
});
