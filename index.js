import React from 'react';
import { AppRegistry, LogBox, Platform } from 'react-native';
// import App from './App';
import { name as appName } from './app.json';
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import store from './src/store/combineReducer'
import Firebase from './src/service/Firebase';
import firebaseMessaging from '@react-native-firebase/messaging';
import 'react-native-gesture-handler'

LogBox.ignoreAllLogs();
firebaseMessaging().setBackgroundMessageHandler(remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

// firebaseMessaging().onMessage(remoteMessage => {
// alert(JSON.stringify(remoteMessage.notification.title));
// ToastAndroid.show(JSON.stringify(remoteMessage.notification.body), ToastAndroid.LONG, ToastAndroid.TOP)
// BackHandler.exitApp();
// navigation.navigate(remoteMessage.data.type);
// });
const App = () => (
    <Provider store={createStore(store)}>
        <Firebase />
    </Provider>
)
AppRegistry.registerComponent(appName, () => App);
