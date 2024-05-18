import React, { useEffect, useState, useCallback } from 'react'
import AsyncStorage from '@react-native-community/async-storage';
import { Text, StyleSheet, SafeAreaView, Image, StatusBar, ToastAndroid, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage';
import * as FetchData from '../../service/Data'
import { Style, Colors, Wp, Hp, useNavigation, Storage, ServiceOrders, ServiceAccount, Utils, useFocusEffect, ServiceProduct, ServiceOrdersNew } from '../../export'
import AwesomeAlert from 'react-native-awesome-alerts';
export default function index() {
    const dispatch = useDispatch()

    const [state, setstate] = useState(true)
    const [alert1, setalert1] = useState(false)
    const [alert2, setalert2] = useState(false)
    const [value, setValue] = useState("")
    const navigation = useNavigation();
    const reduxSeller = useSelector(state => state.user.seller.id_toko)

    useFocusEffect(
        useCallback(() => {
            handleCheck()
        }, []),
    );

    const handleCheck = () => {
        try {
            AsyncStorage.getItem('jwt').then(val => {
                if (!val) {
                    setTimeout(() => navigation.navigate("Welcome"), 2000);
                } else if (val && String(val).length === 18) {
                    dispatch({ type: "SET_TOKEN", payload: String(val) })
                    handleDashboard()
                    handleStorage()
                    handleProducts()
                    FetchData.getAllProducts()
                    FetchData.getDashboard('default')
                    setValue(val)
                    setTimeout(() => {
                        navigation.navigate("Home", { item: 'loading' })
                    }, 2000);
                    // FetchData.getProduct('default').then(navigation.replace("Home", { item: 'loading' })).catch(navigation.replace("Home", { item: 'loading' }))
                } else {
                    setTimeout(() => navigation.navigate("Welcome"), 1000);
                }
            })

            setstate(false)
        } catch (error) {
            alert('toll' + error.message)
            navigation.navigate("Welcome")
        }
    }

    const handleProducts = async () => {
        try {
            let allProduct = await ServiceProduct.fetchAllProduct(reduxSeller)
            if (allProduct) {
                dispatch({ type: 'SET_PRODUCTS', payload: allProduct })
            }
        } catch (error) {
            console.log("file: index.js ~ line 100 ~ handleFetchProduct ~ error", error)
        }
    }

    const handleStorage = async () => {
        try {
            EncryptedStorage.getItem("users").then(res => {
                if (res) {
                    dispatch({ 'type': 'SET_USER', payload: JSON.parse(res) })
                }
            }).catch(err => {
                console.log("file: index.js ~ line 60 ~ EncryptedStorage.getItem ~ err", err)
            })
            EncryptedStorage.getItem('seller').then(res => {
                if (res) {
                    dispatch({ 'type': 'SET_SELLER', payload: JSON.parse(res) })
                    getListOrders(JSON.parse(res)?.id_toko ? JSON.parse(res).id_toko : '')
                }
            }).catch(err => {
                console.log("file: index.js ~ line 62 ~ EncryptedStorage.getItem ~ err", err)
            })
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 75 ~ handleStorage ~ error", error)

        }
    }

    const getListOrders = (idToko) => {
        try {
            ServiceOrdersNew.getTabAll(idToko).then(res => res?.length ? dispatch({ type: 'SET_ORDERS', payload: res }) : '')
            ServiceOrdersNew.getTabPaid(idToko).then(res => res?.length ? dispatch({ type: 'SET_ORDER_PAID', payload: res }) : '')
            ServiceOrdersNew.getTabNeedSent(idToko).then(res => res?.length ? dispatch({ type: 'SET_ORDER_PROCESS', payload: res }) : '')
            ServiceOrdersNew.getTabSent(idToko).then(res => res?.length ? dispatch({ type: 'SET_ORDER_SENT', payload: res }) : '')
            ServiceOrdersNew.getTabCompleted(idToko).then(res => res?.length ? dispatch({ type: 'SET_ORDER_COMPLETED', payload: res }) : '')
            ServiceOrdersNew.getTabFailed(idToko).then(res => res?.length ? dispatch({ type: 'SET_ORDER_BLOCKED', payload: res }) : '')
            ServiceOrdersNew.getTabUnpaid(idToko).then(res => res?.length ? dispatch({ type: 'SET_ORDER_UNPAID', payload: res }) : '')
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 99 ~ getListOrders ~ error", String(error))
        }
    }

    const handleDashboard = async () => {
        try {
            let data = "";
            let signal = await Utils.checkSignal()
            if (signal.connect === true) {
                data = await ServiceAccount.getProfile()
                // console.log("🚀 ~ file: index.js ~ line 106 ~ handleDashboard ~ data", data.jumlah)
            } else {
                const asyncData = await EncryptedStorage.getItem("dashboard");
                if (asyncData) {
                    data = JSON.parse(asyncData)
                }
                Utils.alertPopUp('Periksa kembali koneksi internet anda!')
            }
            dispatch({ type: 'SET_DASHBOARD', payload: data })
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 117 ~ handleDashboard ~ error", error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent={true} backgroundColor='transparent' barStyle="dark-content" />

            <Image style={styles.logo} source={require('../../image/JajaFull.png')} />
            {/* <Text style={styles.text}>SELLER CENTER</Text> */}

            <AwesomeAlert
                alertContainerStyle={styles.alertContainerStyle}
                overlayStyle={{ backgroundColor: 'white', opacity: 0 }}
                show={alert1}
                showProgress={false}
                title="Pembaruan"
                message="Update telah tersedia di playstore"
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Lain Kali"
                confirmText="Update Sekarang"
                confirmButtonColor="#DD6B55"
                onCancelPressed={() => setAlertHapus(false)}
                onConfirmPressed={() => handleHapusProduk()}
            />
            <AwesomeAlert
                alertContainerStyle={styles.alertContainerStyle}
                overlayStyle={{ backgroundColor: 'white', opacity: 0 }}
                show={alert2}
                showProgress={false}
                title="Pembaruan"
                message="Update telah tersedia di playstore"
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Lain Kali"
                confirmText="Update Sekarang"
                confirmButtonColor="#DD6B55"
                onCancelPressed={() => setAlertHapus(false)}
                onConfirmPressed={() => handleHapusProduk()}
            />
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: Wp('5%'),
        backgroundColor: "white"
    },
    text: {
        fontFamily: 'Poppins-Italic',
        fontSize: 16,
        alignSelf: 'center',
        marginTop: Wp('-3%'),
    },
    logo: {
        width: Wp('70%'),
        height: Hp('23'),
    }
})
