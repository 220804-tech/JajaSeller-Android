import React, { useState, useEffect, useCallback } from "react";
import { View, Text, SafeAreaView, Image, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Alert, Platform } from "react-native";
import { Appbar, IconButton } from "react-native-paper";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import ItemLainnya from "../../component/itemLainnya";
import AsyncStorage from "@react-native-community/async-storage";
import { Storage, useNavigation, Colors, Style } from '../../export'
import { useSelector } from "react-redux";
export default function Lainnya() {
  const navigation = useNavigation();
  // const [profile, setProfile] = useState([]);
  const [refreshControl, setRefreshControl] = useState(false);
  const profile = useSelector(state => state.user.seller)

  const getData = async () => {
    try {
      let result = await Storage.getIdToko();
      var myHeaders = new Headers();
      myHeaders.append("Cookie", "ci_session=j4efp81smrg1tpc6gadd6oob219h28k5");
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch("https://jsonx.jaja.id/core/seller/pengaturan/profil/" + result, requestOptions)
        .then(response => response.json())
        .then(async result => {
          setTimeout(() => setRefreshControl(false), 1000);
          await AsyncStorage.setItem('xxTwo', JSON.stringify(result.seller))
        })
        .catch(error => {
          console.log("🚀 ~ file: index.js ~ line 54 ~ getData ~ error", error)
          setRefreshControl(false)
          setTimeout(() => {
            Alert.alert(
              "Jaja.id",
              "Mohon periksa kembali koneksi internet anda!",
              [
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ],
              { cancelable: false }
            );
          }, 200);
        });
    } catch (error) {
      console.log("🚀 ~ file: index.js ~ line 70 ~ getData ~ error", error)
      setRefreshControl(false)
      setTimeout(() => {
        Alert.alert(
          "Jaja.id",
          "Ada kesalahan teknis.",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
      }, 200);
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshControl(true)
    getData()
  }, []);

  return (
    <SafeAreaView style={Style.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshControl} onRefresh={onRefresh} />
        }>
        <Appbar.Header style={styles.appBar}>
          <View style={styles.navbar}>
            <TouchableOpacity style={Style.iconHeader} onPress={() => navigation.goBack()} >
              <Image source={require("../../icon/arrow.png")} style={Style.appBarIcon} />
            </TouchableOpacity>
          </View>
          <View style={{ width: '100%', height: hp('10%'), justifyContent: 'center', alignItems: 'center', flex: 0 }}>
            <View style={styles.circleImage}>
              <Image resizeMode="cover" style={styles.logoJaja} source={profile.foto === null ? require("../../image/JajaFull.png") : { uri: profile.foto }} />
            </View>
            <Text style={{ fontWeight: "bold", fontSize: 16, color: Colors.white, fontFamily: 'Poppins-Regular', marginBottom: '1%' }}>{profile.nama_toko}</Text>
            <View style={{ flex: 0, flexDirection: 'row' }}>
              <IconButton
                icon={require('../../icon/ribbon.png')}
                color={profile.kategori_seller == "Bronze" ? "#967444" : profile.kategori_seller == "Platinum" ? "#e5e4e2" : "#b9f2ff"}
                size={17}
                style={{ margin: 0, padding: 1, backgroundColor: 'white', elevation: 2 }}
                onPress={() => console.log('Pressed')}
              />
            </View>
          </View>
        </Appbar.Header>
        <View style={[Style.column, { flex: 1, backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }]}>
          <View style={styles.card}>
            <Text style={{ fontSize: 16, fontFamily: 'Poppins-Regular', marginBottom: '3%' }}>Informasi Toko</Text>
            <ItemLainnya
              title="Alamat"
              gambar={require("../../icon/address.png")}
            />
            <ItemLainnya
              title={`Dompetku`}
              gambar={require("../../icon/wallet-blue.png")}
            />
            <ItemLainnya
              title={`Pengiriman`}
              gambar={require("../../icon/vehicle-yellow.png")}
            />
            <ItemLainnya
              title="Rekening Bank"
              gambar={require("../../icon/card-blue.png")}
            />

          </View>
          <View style={styles.card}>
            <Text style={{ fontSize: 16, fontFamily: 'Poppins-Regular', marginBottom: '3%' }}>Pengaturan</Text>
            <ItemLainnya
              title={`Akun`}
              gambar={require("../../icon/profile.png")}
            />
            <ItemLainnya
              title="Toko"
              gambar={require("../../icon/open.png")}
            />
          </View>
          <View style={styles.card}>
            <Text style={{ fontSize: 16, fontFamily: 'Poppins-Regular', marginBottom: '3%' }}>Lainnya</Text>
            <ItemLainnya
              title="Jaja CS"
              gambar={require("../../icon/customer-service.png")}
            />
            {/* <ItemLainnya
              title="Kembali ke Jaja"
              gambar={require("../../icon/undo.png")}
              tintColor={Colors.kuningJaja}
            /> */}
            <ItemLainnya
              title="Logout"
              gambar={require("../../icon/power-button.png")}
              tintColor={Colors.redPower}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  appBar: { elevation: 2, backgroundColor: "#64B0C9", height: hp("21%"), width: '100%', color: "white", paddingHorizontal: '4%', marginBottom: '3%', flexDirection: 'column', flex: 0, alignItems: 'center', alignSelf: 'center', justifyContent: 'flex-start' },
  navbar: { flexDirection: 'row', justifyContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'center', backgroundColor: '#64B0C9', height: hp('7%'), color: 'white' },
  circleImage: { height: hp('11%'), backgroundColor: Colors.white, width: hp('11%'), borderRadius: 100, elevation: 1, padding: '0.75%', marginBottom: '1%' },
  logoJaja: { height: '100%', width: '100%', resizeMode: "contain", borderRadius: 100 },
  body: { flex: 1, flexDirection: "column" },
  card: { flex: 0, flexDirection: 'column', backgroundColor: Colors.white, padding: '4%', marginBottom: '2%' },
});
