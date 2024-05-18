import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { Paragraph } from 'react-native-paper'
import Warna from "../../config/Warna";
import { useNavigation } from "@react-navigation/native";
import style from "../../styles/style";
import database from "@react-native-firebase/database";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Style, Appbar, Utils, Colors } from "../../export";
import { useSelector } from "react-redux";

export default function ListChat() {
  const navigation = useNavigation();
  const [phone, setPhone] = useState("");
  const [users, setUsers] = useState([]);
  const [dataProfile, setDataProfile] = useState({});
  const reduxSeller = useSelector(state => state.user.seller)
  const reduxUser = useSelector(state => state.user)
  const reduxAuth = useSelector(state => state.user.token)
  const notifikasi = useSelector(state => state.dashboard.notifikasi)

  useEffect(() => {
    if (reduxAuth) {
      try {
        loadList(reduxSeller.uid)
        Firebase.sellerNotifications('orders', reduxSeller.uid)
      } catch (error) {

      }
    }
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={String(index)}
        onPress={() => {
          try {
            navigation.navigate("IsiChat", { data: item, newData: null })
            database().ref('friend/' + reduxUser.seller.uid + "/" + item.id).update({ amount: 0 });
            database().ref(`/people/${reduxUser.seller.uid}/`).update({ notif: { home: notifikasi.home, chat: notifikasi.chat - item.amount, orders: notifikasi.orders } })
          } catch (error) {

          }
        }}
        style={[Style.py_4, Style.px, Style.mb_3, {
          // backgroundColor: Warna.greenDep,
          // elevation: 2,
          // padding: 20,
          marginVertical: 3,
          borderBottomColor: Warna.silver,
          borderBottomWidth: 0.2,
          width: '95%',
          justifyContent: 'center',
          alignSelf: 'center',
          alignItems: 'flex-start'

        }]}
      >
        {/* <View style={style.row_space}>
          <View style={style.column}>
            <Text style={Style.font_14}>{item.name}</Text>
            <Text style={[Style.font_12, { color: item.status ? item.status.amount ? Warna.blackgrayScale : Warna.silver : Warna.silver }]}>{item.message ? item.message.text : null}</Text>
          </View>
          {item.status && item.status.amount ?
            <View style={{ padding: '1%', backgroundColor: Warna.kuningJaja, borderRadius: 100, height: 25, width: 25, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, backgroundColor: Warna.kuningJaja, color: Warna.blackLight }}>{item.status.amount}</Text>
            </View>
            : null
          }
        </View> */}
        <View style={[Style.row_between_center, { width: '100%' }]}>
          <View style={Style.column}>
            <Text style={{ fontSize: 14, color: Colors.blackgrayScale, marginBottom: '1%' }}>{item.name}</Text>
            <Text style={{ fontSize: 12, color: item.amount && item.amount > 0 ? Colors.blackgrayScale : Colors.silver }}>{item.message.text}</Text>
          </View>
          {item && item.amount ?
            <View style={{ padding: '1%', backgroundColor: Colors.biruJaja, borderRadius: 100, height: 25, width: 25, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[style.font_11, { textAlign: 'center', textAlignVertical: 'center', color: Colors.white }]}>{item.amount > 9 ? '9+' : item.amount}</Text>
            </View>
            : null
          }
        </View>
      </TouchableOpacity>
    );
  };

  function loadList(val) {
    database().ref("/friend/" + val).on("value", function (snapshot) {
      var returnArray = [];
      snapshot.forEach(function (snap) {
        var item = snap.val();
        item.id = snap.key;
        if (item.id !== val && item.id !== "null") {
          returnArray.push(item);
          setUsers(returnArray);
        }
      });
      return returnArray;
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: Platform.OS === 'ios' ? Colors.biruJaja : null }}
    >
      <Appbar title="Chats" />
      {
        users.length != 0 ?
          <View style={{ flex: 1, backgroundColor: Warna.white }}>
            <FlatList
              data={users}
              renderItem={renderItem}
              keyExtractor={(item, idx) => String(idx)}
            />
          </View>
          :
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Warna.white }}>
            <Image
              style={styles.iconMarket}
              source={require('../../ilustrations/empty.png')}
            />
            <Paragraph style={styles.textJajakan}>Ups..<Text style={styles.textCenter}>{reduxAuth ? 'kamu belum chat siapapun' : 'sepertinya kamu belum login'}</Text>
            </Paragraph>
          </View>

      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textJajakan: { alignSelf: 'center', textAlign: 'center', width: wp('80%'), fontSize: 18, fontFamily: 'Poppins-SemiBold', color: Warna.biruJaja, fontFamily: 'Poppins-Regular', marginVertical: hp('2%') },
  iconMarket: { alignSelf: "center", width: wp('80%'), height: hp('40%') },
})