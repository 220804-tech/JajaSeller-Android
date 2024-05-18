import React, { useState, useEffect, createRef } from "react";
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Image, FlatList, Dimensions, KeyboardAvoidingView, ScrollView, StyleSheet, ImageBackground, StatusBar, Platform } from "react-native";
import { IconButton, TouchableRipple } from 'react-native-paper'
import ImagePicker from "react-native-image-crop-picker";
import AsyncStorage from "@react-native-community/async-storage";
import firebaseDatabase from '@react-native-firebase/database';
import * as Firebase from '../../service/Firebase'
import { Wp, Hp, Colors, Style, useNavigation, Storage, Utils, Appbar, FastImage } from '../../export'
import { useSelector } from "react-redux";
import ActionSheet from 'react-native-actions-sheet';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function IsiChat({ route }) {
  const navigation = useNavigation();
  const sellerId = useSelector(state => state.user.seller.id_toko)
  const reduxSeller = useSelector(state => state.user.seller.uid)
  const insets = useSafeAreaInsets();
  const galeryRef = createRef()

  const menuGambar = createRef();
  const flatlist = createRef();
  const [isiChat, setIsiChat] = useState("");
  const [Phone, setPhone] = useState("");
  const [uid, setUid] = useState("");
  const [namaToko, setnamaToko] = useState(false)
  const [newFriend, setnewFriend] = useState(false)
  const [loadChat, setloadChat] = useState(true)
  const [fotoSeller, setFotoSeller] = useState("")
  const [customerFirebase, setcustomerFirebase] = useState('')

  const [nameChat, setnameChat] = useState("")
  const [dataFriend, setdataFriend] = useState("")
  const [messageList, setMessageList] = useState([]);
  const [gambar, setGambar] = useState("");
  const [token, setToken] = useState("")
  const [screen, setScreen] = useState("")
  const { data, newData } = route.params;


  async function SendMessage(path) {
    let imageUrl = ''
    if (path) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Cookie", "ci_session=3jj2gelqr7k1pgt00mekej9msvt8evts");

      var raw = JSON.stringify({
        'storeId': sellerId,
        "image": path
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      await fetch("https://jaja.id/backend/chat/image", requestOptions)
        .then(response => response.text())
        .then(res => {
          try {
            let result = JSON.parse(res)
            if (result.status.code === 200) {
              imageUrl = result.data.url
            } else {
              imageUrl = false
            }
          } catch (error) {
            imageUrl = false
          }
        })
        .catch(error => {
          imageUrl = false
          Utils.handleError(error, 'Error with status code : 12044')
        });
    }
    if (isiChat.length || path) {
      var message = {
        message: isiChat,
        time: firebaseDatabase.ServerValue.TIMESTAMP,
        from: uid,
        image: imageUrl
      }
      if (!newFriend) {
        try {
          var msgId = firebaseDatabase().ref('/messages').child(data.chat).push().key;
          firebaseDatabase().ref('messages/' + data.chat + '/' + msgId).set(message);
          firebaseDatabase().ref('friend/' + uid + "/" + data.id).update({ chat: data.chat, name: data.name, message: { text: isiChat, time: new Date().toString() } })
          firebaseDatabase().ref('friend/' + data.id + "/" + uid).update({ chat: data.chat, name: data.name, message: { text: isiChat, time: new Date().toString() }, amount: firebaseDatabase.ServerValue.increment(1) });

          if (customerFirebase?.token) {
            // ini fungsi buat notif dari atas hp ketika user tidak buka aplikasi
            Firebase.notifChat(customerFirebase.token, { body: isiChat, title: namaToko })

          }

          if (customerFirebase?.notif) {
            firebaseDatabase().ref(`/people/${data.id}/notif`).update({ chat: firebaseDatabase.ServerValue.increment(1) });
          } else {
            firebaseDatabase().ref(`/people/${data.id}/notif`).set({ home: 0, chat: 1, orders: 0 });
          }

        } catch (error) {
          console.log("🚀 ~ file: index.js ~ line 106 ~ SendMessage ~ error", error)
          console.log("data error", data)
        }
      } else {
        setdataFriend(newData.uid + uid)
        firebaseDatabase().ref('friend/' + uid + "/" + newData.uid).set({ chat: newData.uid + uid, name: newData.name, message: { text: isiChat, time: new Date().toString() } });
        firebaseDatabase().ref('friend/' + newData.uid + "/" + uid).set({ chat: newData.uid + uid, name: namaToko, message: { text: isiChat, time: new Date().toString() }, amount: 1 });
        var msgId = firebaseDatabase().ref('/messages').child(newData.uid + uid).push().key;
        firebaseDatabase().ref('messages/' + newData.uid + uid + '/' + msgId).set(message); //pengirim+

        if (customerFirebase.token) {
          Firebase.notifChat(customerFirebase.token, { body: isiChat, title: namaToko })
        }
        firebaseDatabase().ref(`/people/${newData.uid}/notif`).set({ home: 0, chat: 1, orders: 0 });
      }
      setIsiChat('')
      setGambar("")
    }
  }

  useEffect(() => {
    if (newData) {
      setnameChat(newData.name)
      setnewFriend(true)
      setloadChat(false)
    } else {
      setloadChat(true)
      setnameChat(data.name);
    }

    LoadMessages()
    getItem()
    statePertamax()
    return () => { }

  }, []);

  useEffect(() => {
    Firebase.sellerNotifications("chat", reduxSeller)
    return () => { }
  }, [])

  const getItem = async () => {
    try {
      let res = await Storage.getToko()
      setFotoSeller(res?.foto)
      firebaseDatabase().ref("/people/" + data?.id).once('value')
        .then(snap => {
          var item = snap.val();
          if (item?.photo) {
            setcustomerFirebase(item)
          }
        }).catch(err => {
          console.log("🚀 ~ file: index.js ~ line 166 ~ getItem ~ err", err)
        })
    } catch (error) {
      Utils.alertPopUp(error.message)
    }
  }

  const renderRow = ({ item }) => {
    return (
      <View style={[Style.p_2, { width: Wp("100%") }]}>
        {item.from === uid ?
          item.image ?
            <View
              style={{
                width: '100%',
                justifyContent: "flex-end",
                flexDirection: "row",
              }}
            >

              <View style={[{ width: Wp('40%'), height: Wp('40%'), alignItems: 'center', justifyContent: 'center', borderRadius: 5, opacity: 0.8 }]}>
                {/* <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', resizeMode: 'contain', alignSelf: 'center' }} /> */}
                <FastImage
                  style={[{ height: '100%', width: '100%', alignSelf: 'center', backgroundColor: Colors.silver, borderRadius: 5 }]}
                  source={{ uri: item.image }}
                  resizeMode={FastImage.resizeMode.center}
                />
              </View>
            </View>
            :
            <View
              style={{
                width: Wp('100%'),
                justifyContent: "flex-end",
                alignSelf: "center",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  maxWidth: "80%",
                  borderWidth: 0.2,
                  borderRadius: 15,
                  borderColor: Colors.biruJaja,
                  borderTopRightRadius: 0,
                  marginVertical: 5,
                  marginHorizontal: 10,
                  backgroundColor: Colors.biruJaja,
                  padding: 10,
                }}
              >
                <Text
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 14,
                    color: "#FFF", textAlign: "right"
                  }}
                >
                  {item["message"]}
                </Text>
                <Text
                  style={{
                    fontSize: Hp("1.1"),
                    color: "#FFF", textAlign: "right"
                  }}
                >
                  {convertTimes(item.time)}
                </Text>
              </View>

              {/* <View style={{
                borderRadius: 50,
                width: Hp("6%"),
                height: Hp("6%"),
                backgroundColor: Colors.blackgrayScale, overflow: "hidden"
              }}>
                <Image
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: Hp("6%"),
                    height: Hp("6%"),
                    borderRadius: 50,
                    // backgroundColor: Colors.blackgrayScale,
                    overflow: "hidden"
                  }}
                  resizeMethod={"scale"}
                  resizeMode={item["image"] == '' ? "center" : "cover"}
                  source={{ uri: fotoSeller }}
                />
              </View> */}
            </View>
          :
          <View>
            {item['productTitle'] != 'null' && item.productTitle && item.productTitle !== "0" ?

              <View
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  alignSelf: "center",
                  flexDirection: "row",
                  marginBottom: 10
                }}
              >
                <View
                  style={{
                    flex: 1,
                    width: Wp("100%"),
                    height: Wp("22%"),
                    padding: '3%',
                    borderRadius: 5,
                    flexDirection: "row",
                    alignSelf: 'center',
                    backgroundColor: Colors.white,
                    elevation: 0.5,
                    opacity: 0.9
                  }}
                >
                  <View style={{ flex: 0 }}>
                    <Image
                      style={{
                        alignSelf: "center",
                        width: Wp("15%"),
                        height: Wp("15%"),
                        marginRight: 10,
                        borderRadius: 2
                      }}
                      resizeMethod={"scale"}
                      resizeMode={"cover"}
                      source={{ uri: item['productImage'] }}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={{ fontSize: 14, fontFamily: 'Poppins-Medium', color: Colors.blackgrayScale }}>{item['productTitle']}</Text>
                    {item['priceDiscount'] > 0 ?
                      <View style={{ flexDirection: 'row' }}>
                        <Text adjustsFontSizeToFit style={{ alignSelf: 'center', textDecorationLine: 'line-through', marginRight: '3%', fontSize: 12 }}>{item['priceFirst']}</Text>
                        <View style={{ width: 25, height: 20, backgroundColor: Colors.redPower, justifyContent: 'center', borderRadius: 3 }}>
                          <Text adjustsFontSizeToFit style={{ color: 'white', fontFamily: 'Poppins-SemiBold', fontSize: 14, alignSelf: 'center' }}>{item['priceDiscount'] + "%"}</Text>
                        </View>
                      </View>
                      :
                      <View></View>
                    }
                    <Text style={{ color: Colors.blackgrayScale, fontFamily: 'Poppins-Medium', fontSize: Wp("3%") }}>{item['priceLast']}</Text>
                  </View>
                </View>
              </View>
              :
              null
            }
            {item.image ?
              <View style={[{ width: Wp('40%'), height: Wp('40%'), alignItems: 'center', justifyContent: 'center', borderRadius: 5, opacity: 0.8 }]}>
                {/* <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', resizeMode: 'contain', alignSelf: 'center' }} /> */}
                <FastImage
                  style={[{ height: '100%', width: '100%', alignSelf: 'center', backgroundColor: Colors.silver, }]}
                  source={{ uri: item.image }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
              : item.order && Object.keys(item.order).length ?
                <View style={[Style.py_4, Style.px_2, { backgroundColor: Colors.silver, borderRadius: 10, borderTopLeftRadius: 0, width: Wp('45%'), }]}>
                  <TouchableRipple rippleColor={Colors.biruJaja} onPress={() => navigation.navigate('DetailsPesanan', { data: item.order.invoice })} style={[{ backgroundColor: Colors.white, elevation: 1, borderRadius: 3 }]}>
                    <Text style={[Style.font_12, Style.px_2, { textAlign: "left", color: Colors.biruJaja }]}>
                      No. {item.order.invoice}
                    </Text>
                  </TouchableRipple>
                  <Text style={[Style.font_10, Style.mb_5, Style.ml_2, { textAlign: "left", color: Colors.white }]}>
                    {item.order.status}
                  </Text>
                  <View style={[Style.column_start_center, { width: Wp('27%'), height: Wp('27%'), alignSelf: 'flex-start', backgroundColor: Colors.red }]}>
                    <Image source={{ uri: item.order.imageOrder ? item.order.imageOrder : null }} style={{ backgroundColor: Colors.silver, width: '100%', height: '100%', resizeMode: 'contain' }} />
                  </View>
                </View>
                :
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    // marginTop:
                  }}
                >
                  {/* <View
                  style={{
                    width: "100%",
                    justifyContent: "flex-start",
                    alignSelf: "center",
                    flexDirection: "row",
                  }}
                > */}
                  {/* <View style={{
                    borderRadius: 50,
                    width: Hp("6%"),
                    height: Hp("6%"),
                    backgroundColor: Colors.biruJaja,
                  }}>
                    <Image
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: '100%',
                        height: '100%',
                        borderRadius: 100,
                        overflow: "hidden"
                      }}
                      resizeMethod={"scale"}
                      resizeMode={item["image"] == '' ? "center" : "cover"}
                      source={{ uri: fotoCustomer }}
                    />
                  </View> */}
                  <View
                    style={{
                      maxWidth: "80%",
                      borderWidth: 0.2,
                      borderRadius: 15,
                      borderColor: Colors.silver,
                      borderTopLeftRadius: 0,
                      marginVertical: 5,
                      backgroundColor: Colors.silver,
                      padding: 10,
                    }}
                  >

                    {item.message ?
                      <Text style={[Style.font_13, { color: Colors.white }]}>
                        {item["message"]}
                      </Text> : null}
                    <Text
                      style={{
                        fontSize: Hp("1.2%"),
                        color: "#FFF"
                      }}
                    >
                      {convertTimes(item.time)}
                    </Text>
                    {/* </View> */}
                  </View>
                </View>
            }
          </View>

        }
      </View >
    );
  }

  function statePertamax() {
    AsyncStorage.getItem('token').then((result) => {
      setToken(result)
    });
    AsyncStorage.getItem("xxTwo").then(toko => {
      setPhone(JSON.parse(toko)?.telepon)
      setUid(JSON.parse(toko)?.uid)
      if (data?.id) {
        firebaseDatabase().ref('friend/' + JSON.parse(toko).uid + "/" + data.id + "/status").set({ amount: 0, read: true })
      }
    });
    AsyncStorage.getItem("xxTwo").then(toko => {
      setnamaToko(JSON.parse(toko).nama_toko);
    });
  }

  function setChat(value) {
    setIsiChat(value)
  }

  function convertTimes(timestamp) {
    const d = new Date(timestamp);
    var date = d.getHours() + ":" + d.getMinutes()
    return date;
  }

  function LoadMessages(val) {
    try {
      if (data?.chat) {
        firebaseDatabase().ref('/messages').child(data.chat).on('value', function (snapshoot) {
          if (snapshoot.val()) {
            const values = Object.values(snapshoot.val())
            let arr = []
            for (const key of values) {
              arr.push(key)
            }
            setMessageList(arr.sort((a, b) => (a.time > b.time ? 1 : -1)).reverse())
          }
        })
      } else {
        firebaseDatabase().ref('/messages').child(dataFriend ? dataFriend : val).once('value')
          .then(snapshott => {
            if (snapshott.val()) {
              const values = Object.values(snapshott.val())
              let arr = []
              for (const key of values) {
                arr.push(key)
              }
              setMessageList(arr.sort((a, b) => (a.time > b.time ? 1 : -1)).reverse())
            }

          }).catch(err => {
            console.log("🚀 ~ file: index.js ~ line 466 ~ LoadMessages ~ err", err)
          })
      }
    } catch (error) {
      console.log("🚀 ~ file: index.js ~ line 469 ~ LoadMessages ~ error", error)
    }
  }
  // function ImageChoose(side) {
  //   if (side === "camera") {
  //     ImagePicker.openCamera({
  //       width: 200,
  //       height: 200,
  //     }).then(image => {
  //       setGambar(image.path)
  //     });
  //   } else {
  //     ImagePicker.openPicker({
  //       width: 200,
  //       height: 200,
  //       cropping: true,
  //       includeBase64: true,
  //       compressImageQuality: 1,
  //     }).then(image => {
  //       setGambar(image.path)
  //     });
  //   }
  //   menuGambar.current.hide()
  // }
  const handleOpenCamera = () => {
    ImagePicker.openCamera({
      compressImageQuality: 0.8,
      includeBase64: true
    }).then(image => {
      let dataLoading = { "from": reduxSeller.uid, "image": 'loading', "message": "" }
      let newArr = messageList
      newArr.push(dataLoading)
      setMessageList(newArr)
      galeryRef.current?.setModalVisible(false)
      SendMessage(image.data)
    }).catch(err => {
      galeryRef.current?.setModalVisible(false)
    })
  }

  const handlePickImage = () => {
    ImagePicker.openPicker({
      compressImageQuality: 0.8,
      includeBase64: true
    }).then(image => {
      galeryRef.current?.setModalVisible(false)
      SendMessage(image.data)
    }).catch(err => {
      galeryRef.current?.setModalVisible(false)
    })
  }

  return (
    <SafeAreaProvider style={[Style.container, Platform.OS == 'ios' ? Style.pt_4 : null]}>
      <StatusBar translucent={false} backgroundColor={Colors.biruJaja} barStyle="light-content" />
      <Appbar title={nameChat} back={true} />
      <ImageBackground source={require('../../image/bgChat3.jpg')} style={{ width: '100%', height: '100%', paddingBottom: Math.max(insets.bottom, 50), backgroundColor: Colors.white }}>
        <FlatList
          inverted={-1}
          ref={flatlist}
          style={[Style.pt_2, { height: '92%', }]}
          data={messageList}
          renderItem={renderRow}
          keyExtractor={(item, index) => index.toString()}
        />

        <View style={[Style.row_around_center, Style.px_2, Style.mb_2, { height: '7%', backgroundColor: 'transparent', }]}>
          <View style={[Style.row_0_start_center, { width: "80%", height: '77%', borderRadius: 100, backgroundColor: Colors.white, opacity: 0.9, elevation: 1 }]}>
            <TextInput
              style={[Style.font_14, { width: "82%", borderColor: "gray", borderBottomLeftRadius: 100, borderTopLeftRadius: 100, paddingHorizontal: 20, marginBottom: '-1%' }]}
              underlineColorAndroid="transparent"
              onChangeText={(text) => setChat(text)} onSubmitEditing={() => SendMessage(null)}
              value={isiChat}
            />
            {!isiChat.length ?
              <IconButton
                icon={require('../../icon/camera.png')}
                style={{ height: Hp('5.5%'), width: Hp('5.5%'), borderRadius: 100 }}
                color={Colors.biruJaja}
                onPress={() => galeryRef.current?.setModalVisible(true)}
              />
              : null
            }
          </View>
          <IconButton
            icon={require('../../icon/send.png')}
            style={{ backgroundColor: Colors.biruJaja, height: Hp('5.5%'), width: Hp('5.5%'), borderRadius: 100, elevation: 1 }}
            color={Colors.white}
            onPress={() => SendMessage(null)}
          />
        </View>

      </ImageBackground>

      <ActionSheet containerStyle={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: Colors.white }} ref={galeryRef}>
        <View style={[Style.column, Style.pb, { backgroundColor: '#ededed' }]}>
          <TouchableOpacity onPress={handleOpenCamera} style={{ borderBottomWidth: 0.5, borderBottomColor: Colors.silver, alignSelf: 'center', width: Wp('100%'), backgroundColor: Colors.white, paddingVertical: '3%' }}>
            <Text style={[Style.font_16, { alignSelf: 'center' }]}>Ambil Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePickImage} style={{ alignSelf: 'center', width: Wp('100%'), backgroundColor: Colors.White, paddingVertical: '3%', marginBottom: '1%' }}>
            <Text style={[Style.font_16, { alignSelf: 'center' }]}>Buka Galeri</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => galeryRef.current?.setModalVisible(false)} style={{ alignSelf: 'center', width: Wp('100%'), backgroundColor: Colors.white, paddingVertical: '2%' }}>
            <Text style={[Style.font_16, { alignSelf: 'center', color: Colors.redNotif }]}>Batal</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </SafeAreaProvider>
  );
}
