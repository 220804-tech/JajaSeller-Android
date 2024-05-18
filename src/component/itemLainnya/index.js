import AsyncStorage from "@react-native-community/async-storage";
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { View, Image, Text, TouchableOpacity, Alert, BackHandler, StyleSheet, Platform, Linking } from "react-native";
import { useNavigation, CommonActions, NavigationAction } from '@react-navigation/native';
import * as Service from '../../service/Account'
import Loading from '../loading'
import EncryptedStorage from 'react-native-encrypted-storage';
import { connect, useDispatch } from 'react-redux'
import { Colors, Style } from "../../export";
// import { GoogleSignin } from '@react-native-community/google-signin';
import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';

String.prototype.insert = function (index, string) {
  if (index > 0) {
    return this.substring(0, index) + string + this.substr(index);
  }
  return string + this;
};

const ItemLainnya = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const [penjualan, setpenjualan] = useState("0")
  const [loading, setLoading] = useState(false)

  const handlePress = value => {
    if (value === "Logout") {
      Alert.alert(
        "Keluar",
        "Anda yakin ingin keluar",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => handleLogout() }
        ],
        { cancelable: false }
      );
    } else if (value === "Rekening Bank") {
      navigation.navigate("ListBank")
    } else if (value === "Alamat") {
      navigation.navigate("Alamat")
    } else if (value === "Pengiriman") {
      navigation.navigate("Pengiriman")
    } else if (value === "Dompetku") {
      navigation.navigate("Count")
    } else if (value === "Jaja CS") {
      let url = "whatsapp://send?text=" +
        'Halo, Jaja.id \n' +
        "&phone=62" + '82113840369'
      Linking.openURL(url)
        .then(data => {
          console.log("WhatsApp Opened successfully " + data);  //<---Success
        })
        .catch(() => {
          Utils.alertPopUp('Harap install whatsapp terlebih dahulu!')
          setTimeout(() => {
            Linking.openURL('https://jaja.id/bantuan/')
          }, 1500);

        });
    } else if (value === "Akun") {
      navigation.navigate("Account")
    } else if (value === "Toko") {
      navigation.navigate("AccountToko")
    } else if (value === "Kembali ke Jaja") {
      Alert.alert(
        "Jaja.id",
        "Anda akan beralih ke Jaja.id ?",
        [
          {
            text: "Batal",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Ya", onPress: () => handleReturn() }
        ],
        { cancelable: false }
      );
    }
  }

  const handleReturn = () => {
    EncryptedStorage.setItem('JAJAID2021', JSON.stringify('ABOGOBOGA'))
  }


  const handleLogout = async () => {
    setLoading(true)
    try {
      EncryptedStorage.clear()
      const keys = await AsyncStorage.getAllKeys();
      AsyncStorage.multiRemove(keys)
      AsyncStorage.clear()
      dispatch({ type: 'USER_LOGOUT' })
      dispatch({ type: 'RESET_COMPLAIN', payload: true })
      dispatch({ type: 'RESET_PRODUCT', payload: true })
      dispatch({ type: 'RESET_NOTIFICATION', payload: true })
      dispatch({ type: 'RESET_ORDER', payload: true })
      dispatch({ type: 'RESET_STORE', payload: true })
      dispatch({ type: 'RESET_WALLET', payload: true })
      dispatch({ type: 'RESET_WALLET', payload: true })

      try {
        await GoogleSignin.revokeAccess();
        let resp = await GoogleSignin.signOut();
        console.log("🚀 ~ file: index.js ~ line 93 ~ handleLogout ~ resp", resp)
      } catch (error) {
        console.log("🚀 ~ file: index.js ~ line 96 ~ handleLogout ~ error", error)
      }

      setTimeout(() => {
        setLoading(false)
        navigation.navigate('Welcome')
      }, 500);
    } catch (error) {
      setTimeout(() => setLoading(false), 300);
      navigation.replace('Welcome')
    }
  }

  return (
    <>
      {loading ? <Loading /> : null}
      <TouchableOpacity style={{ marginVertical: '1%' }} onPress={() => handlePress(props.title)}>
        <View style={[Style.row_0, Style.py_2]}>
          <View style={[Style.icon_24, Style.mr]}>
            <Image
              source={props.gambar}
              style={{
                height: undefined,
                width: undefined,
                resizeMode: "contain",
                flex: 1,
                tintColor: props.tintColor
              }}
            />
          </View>
          <Text style={[Style.container, Style.font_14, Style.medium, Style.ml_5, { backgroundColor: Platform.OS === 'ios' ? Colors.white : null }]}>
            {props.title}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default connect(state => ({ state: state.dashboard }))(ItemLainnya)
