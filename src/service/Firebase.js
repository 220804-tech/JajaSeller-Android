import React, { useEffect, useState } from "react";
import Routes from "../config/routes";
import Update from '../config/updateRoute'
import AsyncStorage from "@react-native-community/async-storage";
import { getToko } from './Storage'
import database from '@react-native-firebase/database';
import firebaseMessaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info'
import { Platform } from "react-native";

export const buyerNotifications = async (params, uidBuyyer) => {
  database()
    .ref("/people/" + uidBuyyer)
    .once('value')
    .then(snapshot => {
      var item = snapshot.val();
      if (item && Object.keys(item).length && item.notif) {
        database().ref(`/people/${uidBuyyer}/notif`).update(params === "home" ? { home: item.notif.home + 1 } : params === "chat" ? { chat: item.notif.chat + 1 } : { orders: item.notif.orders + 1 })

      } else {
        database().ref(`/people/${uidBuyyer}/notif`).update({ orders: 0, home: 0, chat: 0 }).then(() => {
          database().ref(`/people/${uidBuyyer}/notif`).update(params === "home" ? { home: item.notif.home + 1 } : params === "chat" ? { chat: item.notif.chat + 1 } : { orders: item.notif.orders + 1 })
        })
      }
    })
}

export const sellerNotifications = async (params, sellerUid) => {
  try {
    database().ref(`/people/${sellerUid}/notif`).update(params === "home" ? { home: 0 } : params === "chat" ? { chat: 0 } : { orders: 0 })
  } catch (error) {
    console.log("🚀 ~ file: Firebase.js ~ line 30 ~ sellerNotifications ~ error", error)
  }
}

export const getNotifications = async () => {
  let seller = await getToko();
  return database().ref("/people/" + seller.uid).once('value').then(async res => {
    let item = res.val()
    if (item.notif) {
      return await item.notif;
    } else {
      //masuk sini jika data people di firebase database tidak ada
      let notif = { orders: 0, home: 0, chat: 0 };
      database().ref(`/people/${seller.uid}/`).update({ notif: { orders: 0, home: 0, chat: 0 } })
      database().ref(`/friend/${seller.uid}/null`).set({ chat: 'null' })
      return notif;
    }
  })
}

export const notifChat = async (target, data) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "key=AAAAQjWK8Ko:APA91bFWRgTUvuPlU1dpVR-FqnLQPYgKGtbif1njzRDKnlH5C_uS1MkocgTASxDPw-tDnRjJJrsC6WQdeLDnV1uFp9gTjdwVXU1rvbKvqwhh78LuPhkbwtS79LYwrv_gICYa3MCExD08");

  var raw = JSON.stringify({
    "to": target,
    "collapse_key": "s",
    "notification":
    {
      "body": data.body,
      "title": data.title,
    },
    // "image": "https://firebasestorage.googleapis.com/v0/b/fir-chat-apps-cb8cf.appspot.com/o/jaja-logo.png?alt=media&token=35c90d56-decd-4376-9aff-c915d08179ea"
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://fcm.googleapis.com/fcm/send", requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log("🚀 ~ file: index.js ~ line 145 ~ notifChat ~ result", result)
    })
    .catch(error => console.log('error', error));
}


export default function Firebase(props) {
  const [update, setUpdate] = useState(false)


  useEffect(() => {
    getItem()
    // database().ref('/seller/').on('value', snapshot => {
    // let code = DeviceInfo.getBuildNumber()
    // console.log("🚀 ~ file: line 110221 ~ database ~ device =>", String(code))
    // console.log("🚀 ~ file: Firebase.js ~ line 119 ~ database ~ firebase    =>", String(snapshot.val()))
    // if (String(snapshot.val().versionCode) !== String(code) && String(snapshot.val().nextVersion) !== String(code) && Platform.OS !== 'ios') {
    //   setUpdate(true)
    //   // setUpdate(false)
    // } else {
    // setUpdate(false)
    // }
    // })
  }, [])

  const getItem = async () => {
    const authStatus = await firebaseMessaging().requestPermission();
    const enabled =
      authStatus === firebaseMessaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === firebaseMessaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      const tokenMessaging = await firebaseMessaging().getToken();
      AsyncStorage.setItem('token', tokenMessaging);
    }
  }
  async function requestUserPermission() {
    // try {
    //   const authStatus = await messaging().requestPermission();
    //   const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    //   if (enabled) {
    //     const tokenMessaging = await messaging().getToken()
    //     AsyncStorage.setItem('token', tokenMessaging);
    //   }
    // } catch (error) {
    //   console.log("🚀 ~ file: Firebase.js ~ line 123 ~ requestUserPermission ~ error", error)
    // }
  }

  return (
    <>
      {update ?
        <Update />
        :
        <Routes />
      }
    </>
  )
}

