
import React, { useState, useEffect, useCallback, createRef } from 'react'
import { View, Text, Image, StyleSheet, StatusBar, SafeAreaView, RefreshControl, TextInput, TouchableOpacity, Dimensions, TouchableHighlight, TouchableWithoutFeedback, Platform, Modal } from 'react-native'
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import { Button, Appbar, IconButton, DataTable, TextInput as TX, TouchableRipple } from 'react-native-paper';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import * as FetchData from '../../service/Data'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import { useNetInfo } from "@react-native-community/netinfo";
import { showMessage } from "react-native-flash-message";
import AwesomeAlert from 'react-native-awesome-alerts';
import ActionSheet from "react-native-actions-sheet";
import { Dropdown } from "react-native-material-dropdown";
import SnackBar from 'react-native-snackbar-component'
const initialLayout = { width: Dimensions.get('window').width };
// import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { Colors, Wp, Hp, useFocusEffect, ServiceAccount, Utils, Style, useNavigation } from '../../export'
import { useDispatch, useSelector } from 'react-redux'
import Income from '../../component/wallet/Income'
import Withdrawal from '../../component/wallet/Withdrawal'
import Refund from '../../component/wallet/Refund'


function Header({ navigation }) {
    return (
        <Appbar.Header style={[Style.appBar, { backgroundColor: 'transparent' }]}>
            <View style={[Style.row_start_center, { paddingVertical: '1%' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={Style.appBarIcon} source={require('../../icon/arrow.png')} />
                </TouchableOpacity>
                <Text style={[Style.appBarText]}>Kembali</Text>
            </View>
        </Appbar.Header>
    )
}
function Background() {
    return (
        <View style={styles.header}>
            <Image style={styles.imageHeader} source={require('../../icon/head2.png')} />
        </View>
    )
}
function Foreground() {
    return (
        // <View style={styles.card}>

        //     <View style={styles.cardCenter}>
        //         <Text style={styles.textCenterTop}>Saldo</Text>
        //         {salad === "" ?
        //             <ShimmerPlaceHolder
        //                 LinearGradient={LinearGradient}
        //                 style={[styles.textCenterBot, { borderRadius: 2, : 'roboto' }]}
        //                 height={33}
        //                 shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
        //             />
        //             :
        //             <Text style={styles.textCenterBot}>{salad}</Text>
        //         }
        //     </View>
        // </View>
        <></>
    )
}

export default function Count() {
    const navigation = useNavigation();
    const netInfo = useNetInfo();
    const actionSheetAdd = createRef();
    const actionSheetKey = createRef();

    const dispatch = useDispatch()
    const reduxAccount = useSelector(state => state.user.seller)
    const [allData, setallData] = useState("");
    const [alertHapus, setAlertHapus] = useState(false);
    const [sbColor, setsbColor] = useState();
    const [idDelete, setIdDelete] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listBk, setlistBk] = useState([]);
    const [marketName, setmarketName] = useState("");
    const [loadIcon, setloadIcon] = useState(false);

    const [viewTwo, setviewTwo] = useState(false);
    const [textActionSheet, settextActionSheet] = useState("");
    const [idLock, setidLock] = useState("");
    const [idLock2, setidLock2] = useState("");
    const [visibleButton, setvisibleButton] = useState(false);
    const [notifTop, setnotifTop] = useState(false)
    const [textAlert, settextAlert] = useState("")
    const [key, setkey] = useState(false);
    const [salad, setsalad] = useState("")

    const [dataListBank, setDataListBank] = useState([]);
    const [bkName, setbkName] = useState("");
    const [acc, setacc] = useState("");
    const [np, setNp] = useState("");
    const [bkKode, setbkKode] = useState("");
    const [id, setId] = useState("");
    const [index, setIndex] = useState(0)
    const [modal, setmodal] = useState(false)

    const [routes] = useState([
        { key: 'first', title: 'Pemasukan' },
        { key: 'second', title: 'Pengeluaran' },
        { key: 'third', title: 'Pengembalian' },

    ]);

    const renderScene = SceneMap({
        first: Income,
        second: Withdrawal,
        third: Refund

    });

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        handleListTransaction()
        FetchData.getDashboard('default').then(setTimeout(() => setRefreshing(false), 5000))
    }, []);

    const handleListTransaction = async () => {
        try {
            let response = await ServiceAccount.getListTransaction(reduxAccount.id_toko);
            if (response.status.code == 200 || response.status.code == 204) {
                dispatch({ type: 'SET_WITHDRAWAL', payload: response.data })
            } else {
                dispatch({ type: 'SET_WITHDRAWAL', payload: [] })
            }

        } catch (error) {
            setallData([])
            dispatch({ type: 'SET_WITHDRAWAL', payload: [] })
        }

        try {
            let response = await ServiceAccount.getListIncome(reduxAccount.id_toko);
            if (response.status.code == 200 || response.status.code == 204) {
                dispatch({ type: 'SET_INCOME', payload: response.data })
            } else {
                dispatch({ type: 'SET_INCOME', payload: [] })
            }
        } catch (error) {
            dispatch({ type: 'SET_INCOME', payload: [] })
        }

        try {
            let response = await ServiceAccount.getListRefund(reduxAccount.id_toko);
            if (response.status.code == 200 || response.status.code == 204) {
                dispatch({ type: 'SET_REFUND', payload: response.data })
            } else {
                dispatch({ type: 'SET_REFUND', payload: [] })
            }
        } catch (error) {
            dispatch({ type: 'SET_REFUND', payload: [] })
        }
    }

    async function getItem() {
        setsalad("")
        let saladNull = {
            'remaining_currency_format': 'Rp-'
        }
        let idToko = reduxAccount.id_toko
        if (viewTwo === false) settextActionSheet("Anda belum punya pin, buat sekarang!")
        if (idToko) {
            let sld = await ServiceAccount.getsalad(idToko);
            if (sld.status.code == 200) {
                setsalad(sld.data.saldo_seller)
            } else {
                setsalad("")
            }
            setLoading(false)
            setId(idToko)
            try {
                let response = await ServiceAccount.getBk(idToko)
                if (response.status.code === 200) {
                    setlistBk(response.data)
                } else {
                    setlistBk([])
                }
                if (viewTwo) settextActionSheet("Masukkan PIN anda")
                let resullllll = await ServiceAccount.getKey(idToko);
                if (resullllll.data) {
                    setviewTwo(true)
                    settextActionSheet("Masukkan PIN anda!")
                    setkey(true)
                } else {
                    setlistBk([])
                }
            } catch (error) {
                console.log("file: index.js ~ line 164 ~ Serv Account ~ error =>", error)
                setlistBk([])
            }
        } else {
            console.log("file: index.js ~ line 169 ~ getItem ~ idToko null =>", idToko)
            setsalad(saladNull)
            setlistBk([])
        }

        handleListTransaction()
        setTimeout(() => {
            setloadIcon(false)
        }, 500);
    }

    const setState = () => {
        setRefreshing(false);
        setsbColor(Colors.biruJaja)
    }
    const handleSubmit = async () => {
        let credentials = {
            "name": np,
            "bkKode": bkKode,
            "bkName": bkName,
            "acc": acc,
            "id": id
        }
        actionSheetAdd.current?.setModalVisible()
        try {
            let response = await ServiceAccount.addBk(credentials)
            console.log("🚀 ~ file: index.js ~ line 125 ~ handleSubmit ~ response", response)
            getItem()

        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 127 ~ handleSubmit ~ error", error)
        }
    }
    const handleDelete = () => {
        setAlertHapus(false)
        ServiceAccount.deleteBk(idDelete).then(res => {
            getItem()

        }).catch(error => {
            console.log("🚀 ~ file: index.js ~ line 56 ~ ServiceAccount.deleteBk ~ error", error)
        })
    }
    useFocusEffect(
        useCallback(async () => {
            let result = await Utils.checkSignal(netInfo)

            if (result === true) {
                showMessage({
                    message: "Tidak dapat terhubung",
                    description: "Periksa koneksi anda!",
                    type: "success",
                    style: { backgroundColor: Colors.biruJaja, elevation: 1 },
                });
            } else {

            }
        }, []),
    );

    useEffect(() => {
        // setTimeout(() => {
        //     actionSheetKey.current?.setModalVisible(true)

        // }, 4000);
        setState();
        getItem();
        return () => {
            setmodal(false)
            setAlertHapus(false)
            setLoading(true);
            setloadIcon(true)
            settextAlert("")
            setnotifTop(false)
            setTimeout(() => {
                setLoading(false)
            }, 4000);
            setsbColor(Colors.biruJaja)
        }

    }, [])

    const handleTariksis = () => {
        actionSheetKey.current?.setModalVisible(true)
    }

    const handleChange = (name, value) => {
        if (name === "number") {
            let res = String(Utils.regex(name, value))
            console.log("🚀 ~ file: index.js ~ line 247 ~ handleChange ~ res", res)
            setidLock(res)
            if (res.length === 6) {
                settextAlert("")
            }
        }
    }

    const handleButton = () => {
        var text = String(idLock);
        if (viewTwo === false) {
            let credentials = {
                "pin": idLock,
                "id_toko": id
            }
            if (text.length === 6) {
                settextAlert("")
                actionSheetKey.current?.setModalVisible(false)
                setTimeout(() => setnotifTop(true), 85);
                settextActionSheet("Masukkan PIN anda!")
                ServiceAccount.addKey(credentials).then(res => {
                    console.log("file: index.js ~ line 291 ~ getItem ~ error", error)
                    console.log("🚀 ~ file: index.js ~ line 273 ~ ServiceAccount.addKey ~ credentials", credentials)
                    console.log("🚀 ~ file: index.js ~ line 290 ~ ServiceAccount.addKey ~ res", res)
                    if (res.status.message == "add data success" && res.status.code == 201) {
                        setviewTwo(true)
                        actionSheetKey.current?.setModalVisible(false)

                    } else {
                        actionSheetKey.current?.setModalVisible(false)

                    }
                })

                // setTimeout(() => actionSheetKey.current?.setModalVisible(false), 2400);
            } else {
                settextAlert("Minimal pin 6 digit!")
            }
        } else {
            let credentials = {
                "pin": idLock2,
                "id_toko": id
            }
            ServiceAccount.vertifikasiKey(credentials).then(res => {
                console.log("🚀 ----------------------------------------------------------------------", res)
                if (res.status.message == "verification success" && res.status.code == 200) {
                    actionSheetKey.current?.setModalVisible(false)

                    console.log("succes")
                    settextAlert("")
                    setTimeout(() => navigation.navigate("Payouts"), 50);
                } else if (res.status.code == 401) {
                    console.log("🚀 ~ file: index.js ~ line 299 ~ ServiceAccount.vertifikasiKey ~ res.status.code", res.status.code)
                    settextAlert("PIN tidak sesuai!")
                } else {
                    actionSheetKey.current?.setModalVisible(false)
                }
            })

        }
    }

    return (
        <SafeAreaView style={Style.container}>
            <SnackBar messageStyle={{ fontFamily: 'Poppins-SemiBold' }} messageColor="white" backgroundColor={Colors.biruJaja} visible={notifTop} top={0} position="bottom" textMessage="PIN berhasil disimpan!" autoHidingTime={2000} />
            <StatusBar translucent={false} backgroundColor={sbColor} barStyle="light-content" />
            <ParallaxScroll
                renderHeader={({ animatedValue }) => <Header animatedValue={animatedValue} marketName={marketName} navigation={navigation} />}
                headerHeight={Hp('7%')}
                fadeOutParallaxForeground={true}
                fadeOutParallaxBackground={true}
                isHeaderFixed={true}
                parallaxHeight={80}
                isBackgroundScalable={false}
                renderParallaxBackground={({ animatedValue }) => <Background animatedValue={animatedValue} />}
                renderParallaxForeground={({ animatedValue }) => <Foreground salad={salad} animatedValue={animatedValue} />}
                parallaxBackgroundScrollSpeed={5}
                parallaxForegroundScrollSpeed={2.5}
                headerBackgroundColor='transparent'
                headerFixedBackgroundColor={Colors.biruJaja}
                onHeaderFixed={() => setsbColor(Colors.biruJaja)}
                onChangeHeaderVisibility={() => setsbColor(Colors.kuningJaja)}
                contentContainerStyle={{ flex: 0, paddingBottom: 70 }}
                style={{ backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={styles.body}>
                    <View style={styles.card}>
                        <View style={styles.cardCenter}>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <Text style={[Style.font_14, Style.medium, { color: Colors.biruJaja }]}>Sisa Saldo</Text>
                                {!salad ?
                                    <ShimmerPlaceHolder
                                        LinearGradient={LinearGradient}
                                        style={{ width: '65%', height: '50%', }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                    :
                                    <>
                                        <Text style={[Style.font_22, Style.semi_bold, { color: Colors.biruJaja }]}>{salad.remaining_currency_format}</Text>
                                        {salad.pending_currency_format ? <Text style={[Style.font_14, Style.medium, { color: Colors.kuningJaja }]}>Saldo Pending {salad.pending_currency_format}</Text> : null}
                                    </>

                                }
                            </View>
                            <View style={{ flex: 0, flexDirection: 'column', height: '80%', width: '20%', borderRadius: 10 }}>
                                {/* <Image style={{ height: undefined, width: undefined }} source={require('../../icon/save-money.png')} /> */}
                                <IconButton
                                    style={{ flex: 1, margin: 0, padding: 3, alignSelf: 'center', alignItems: 'center', justifyContent: 'flex-end' }}
                                    icon={require('../../icon/save-money.png')}
                                    color={Colors.biruJaja}
                                    size={30}
                                    onPress={() => {
                                        console.log('first')
                                        setmodal(true)
                                    }}
                                />
                                <Text style={{ flex: 1, alignSelf: 'center', textAlignVertical: 'center', fontFamily: 'Poppins-Regular', fontSize: 12, color: Colors.biruJaja, fontFamily: 'Poppins-Regular' }}>Tarik Saldo</Text>
                            </View>
                        </View>
                    </View>
                    {/* <View style={styles.cardList}>
                        <View style={styles.cardItem} onPress={() => console.log("akakakakakak")}>
                            {loadIcon ?
                                <ShimmerPlaceHolder
                                    LinearGradient={LinearGradient}
                                    style={[styles.textCenterBot, { borderRadius: 2, fontFamily: 'Poppins-Regular' }]}
                                    height={57}
                                    width={100}
                                    shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                />
                                :
                                <>
                                    <IconButton
                                        style={{ flex: 1, margin: 0, padding: 3, alignSelf: 'center', alignItems: 'center', justifyContent: 'flex-end' }}
                                        icon={require('../../icon/save-money.png')}
                                        color={Colors.biruJaja}
                                        size={30}
                                        onPress={() => handleTariksis()}
                                    />
                                    <Text style={{ flex: 1, alignSelf: 'center', textAlignVertical: 'center', fontFamily: 'Poppins-Regular', fontSize: 12, color: Colors.biruJaja, fontFamily:'Poppins-Regular' }}>Tarik Saldo</Text>
                                </>
                            }

                        </View>
                        <View style={styles.cardItem}>
                            {loadIcon ?
                                <ShimmerPlaceHolder
                                    LinearGradient={LinearGradient}
                                    style={[styles.textCenterBot, { borderRadius: 2, fontFamily: 'Poppins-Regular' }]}
                                    height={57}
                                    width={100}

                                    shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                />
                                :
                                <>
                                    <IconButton
                                        style={{ flex: 1, margin: 0, alignSelf: 'center', alignItems: 'center', justifyContent: 'flex-end' }}
                                        icon={require('../../icon/riwayat.png')}
                                        color={Colors.biruJaja}
                                        size={30}
                                        onPress={() => navigation.navigate("RiwayatTransaksi")}
                                    />
                                    <Text style={{ flex: 1, alignSelf: 'center', textAlignVertical: 'center', fontFamily: 'Poppins-Regular', fontSize: 12, color: Colors.biruJaja, fontFamily:'Poppins-Regular' }}>Riwayat Transaksi</Text>
                                </>
                            }
                        </View>
                    </View> */}
                    <View style={[styles.cardJaja, { padding: 0 }]}>
                        <Text style={[Style.font_16, Style.semi_bold, Style.p_3, { marginBottom: '1%' }]}>Riwayat Transaksi</Text>
                        <TabView
                            indicatorStyle={{ backgroundColor: 'white' }}
                            navigationState={{ index, routes }}
                            renderScene={renderScene}
                            onIndexChange={setIndex}
                            initialLayout={initialLayout}
                            style={{ width: '100%', height: '100%' }}
                            renderTabBar={props => (
                                <TabBar
                                    {...props}
                                    indicatorStyle={{ backgroundColor: Colors.biruJaja }}
                                    bounces={true}
                                    scrollEnabled={true}
                                    contentContainerStyle={{ padding: 0, height: '100%' }}
                                    style={{ backgroundColor: Colors.white, width: Wp('95%') }}
                                    tabStyle={{ width: Wp('31.6666%'), height: '100%', padding: 0 }} // here
                                    renderLabel={({ route, focused, color }) => {
                                        return (
                                            <View style={[Style.row_center, { width: Wp('31.6666%'), minHeight: Wp('11%') }]}>
                                                <Text style={[Style.font_12, Style.medium, { textAlign: 'center' }]}>{route.title}</Text>
                                            </View>
                                        )
                                    }}
                                />
                            )}
                        />
                        {/* {   Z !== "" ?
                            <History data={allData} />
                            : <View style={[Style.column, { paddingHorizontal: '2%' }]}>
                                <View style={[Style.row, { paddingVertical: '3%', flex: 0 }]}>
                                    <View style={[Style.column]}>
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            style={{ borderRadius: 2, marginBottom: '1%' }}
                                            width={83}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            style={{ borderRadius: 2, }}
                                            width={83}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                    </View>

                                    <View style={[Style.column, { flex: 3 }]}>
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            style={{ borderRadius: 2, marginBottom: '1%', width: '100%' }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            style={{ borderRadius: 2, }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                    </View>
                                </View>
                                <View style={[Style.row, { paddingVertical: '3%', flex: 0 }]}>
                                    <View style={[Style.column]}>
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            style={{ borderRadius: 2, marginBottom: '1%' }}
                                            width={83}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            style={{ borderRadius: 2, }}
                                            width={83}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                    </View>
                                    <View style={[Style.column, { flex: 3 }]}>
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            style={{ borderRadius: 2, marginBottom: '1%', width: '100%' }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            style={{ borderRadius: 2, }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                    </View>
                                </View>
                                <View style={[Style.row, { paddingVertical: '3%', flex: 0 }]}>
                                    <View style={[Style.column]}>
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            style={{ borderRadius: 2, marginBottom: '1%' }}
                                            width={83}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            style={{ borderRadius: 2, }}
                                            width={83}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                    </View>
                                    <View style={[Style.column, { flex: 3 }]}>
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            style={{ borderRadius: 2, marginBottom: '1%', width: '100%' }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            style={{ borderRadius: 2, }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                    </View>
                                </View>
                            </View>
                        } */}
                    </View>
                </View>
            </ParallaxScroll>
            <AwesomeAlert
                alertContainerStyle={styles.alertContainerStyle}
                overlayStyle={{ backgroundColor: 'white', opacity: 0 }}
                show={alertHapus}
                showProgress={false}
                title="PERINGATAN!"
                message="Anda ingin menghapus rekening dari jaja?"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Batal"
                confirmText="Hapus"
                confirmButtonColor="#DD6B55"
                onCancelPressed={() => setAlertHapus(false)}
                onConfirmPressed={() => handleDelete()}
            />
            <ActionSheet ref={actionSheetAdd} >
                <View style={{ padding: '3%', }}>
                    <View style={{ marginBottom: 30 }}>
                        <Text style={{ fontFamily: 'Poppins-SemiBold' }}>TAMBAH REKENING</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 13, marginBottom: -10 }}>Nama Bank</Text>
                        <Dropdown
                            label="Pilih satu"
                            data={dataListBank}
                            onChangeText={value => setbkName(value)}
                        />
                    </View>
                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 13, }}>Kode Bank</Text>
                        <TextInput value={bkKode} onChangeText={(text) => setbkKode()} placeholder="" keyboardType="numeric" style={{ borderBottomWidth: 0.5 }} />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 13, }}>Nomor Rek</Text>
                        <TextInput value={acc} onChangeText={(text) => setacc(text)} placeholder="ex. 12920009209" keyboardType="numeric" style={{ borderBottomWidth: 0.5 }} />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text>Nama Pemilik</Text>
                        <TextInput value={np} onChangeText={(text) => setNp(text)} placeholder="Alias" style={{ borderBottomWidth: 0.5 }} />
                    </View>

                    <TouchableOpacity onPress={() => handleSubmit()} style={{ marginTop: 20, padding: '2%', backgroundColor: Colors.biruJaja, elevation: 2, borderRadius: 8 }}>
                        <Text style={{ alignSelf: 'center', color: Colors.white, fontFamily: 'Poppins-SemiBold' }}>Simpan</Text>
                    </TouchableOpacity>

                </View>
            </ActionSheet>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modal}
            // onRequestClose={() => {
            //    setmodal(!modal)
            // }}
            >
                <View style={{ width: Wp('100%'), height: Hp('100%'), zIndex: 999, justifyContent: 'center', alignItems: 'center', }}>
                    <View style={[Style.column_0_start, Style.px_5, { width: Wp('90%'), height: Hp('20%'), backgroundColor: Colors.white, elevation: 11, borderRadius: 5 }]}>
                        <View style={[Style.py_4, { width: '100%' }]}>
                            <Text adjustsFontSizeToFit style={{ alignSelf: 'flex-start', fontFamily: 'Poppins-SemiBold', color: '#454545', fontSize: 14 }}>{textActionSheet}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            {viewTwo ?
                                <TextInput style={styles.inputBox} secureTextEntry={true} keyboardType="number-pad" maxLength={6} onChangeText={(text) => setidLock2(text)} />
                                :
                                <TextInput style={styles.inputBox} placeholder="Minimal pin 6 digit" keyboardType="number-pad" maxLength={6} value={idLock} onChangeText={(text) => handleChange("number", text)} />
                            }

                            <Text adjustsFontSizeToFit style={{ alignSelf: 'flex-start', fontFamily: 'Poppins-Regular', fontSize: 13, color: 'red' }}>{textAlert}</Text>
                        </View>
                        <View style={[Style.row_0_end, Style.mb_2, { width: Wp('80%'), }]}>
                            <TouchableRipple
                                style={[Style.row_0_center, Style.px_5, Style.mr_3, { backgroundColor: Colors.silver, borderRadius: 3, }]}
                                mode="contained"
                                onPress={() => setmodal(false)}>
                                <Text style={[Style.font_13, Style.semi_bold, { color: Colors.white }]}>Kembali</Text>
                            </TouchableRipple>
                            <TouchableRipple
                                style={[Style.row_0_center, Style.px_5, Style.py_2, Style.mr_3, { backgroundColor: Colors.biruJaja, borderRadius: 3, }]}
                                mode="contained"
                                onPress={handleButton}>
                                <Text style={[Style.font_13, Style.semi_bold, { color: Colors.white }]}>Masuk</Text>
                            </TouchableRipple>
                            {/* <Button
                                    disabled={visibleButton}
                                    labelStyle={{ color: Colors.white }}
                                    color={Colors.biruJaja}
                                    mode="contained"
                                    onPress={handleButton}>
                                    {viewTwo ? "Masuk" : "Simpan"}
                                </Button> */}

                        </View>
                    </View>
                </View>
            </Modal>
            <ActionSheet
                // closeOnTouchBackdrop={false}
                containerStyle={{ paddingHorizontal: '4%', paddingBottom: '5%', height: Hp('30%') }}
                ref={actionSheetKey}>
                <View style={[Style.row_between_center]}>
                    <Text style={[Style.font_14, Style.semi_bold, Style.my_5, { color: Colors.biruJaja }]}>Tarik Saldo</Text>
                    <IconButton
                        style={{ alignItems: 'center' }}
                        icon={require('../../icon/close.png')}
                        color={Colors.biruJaja}
                        size={16}
                        onPress={() => {
                            actionSheetKey.current?.setModalVisible(false)
                            // setactionSheetKey(true)
                        }}
                    />
                </View>
                <View style={Style.column_center_start}>
                    <View style={{ borderBottomWidth: 0.2, width: '100%' }}>
                        <Text adjustsFontSizeToFit style={{ alignSelf: 'flex-start', fontFamily: 'Poppins-SemiBold', color: '#454545', fontSize: 14 }}>{textActionSheet}</Text>
                        {viewTwo ?
                            <TX style={styles.inputBox} secureTextEntry={true} keyboardType="number-pad" maxLength={6} onChangeText={(text) => setidLock2(text)} />
                            :
                            <TX style={styles.inputBox} placeholder="Minimal pin 6 digit" keyboardType="number-pad" maxLength={6} value={idLock} onChangeText={(text) => handleChange("number", text)} />
                        }
                    </View>
                    <Text adjustsFontSizeToFit style={{ alignSelf: 'flex-start', fontFamily: 'Poppins-Regular', fontSize: 13, color: 'red' }}>{textAlert}</Text>
                </View>
                <Button
                    disabled={visibleButton}
                    labelStyle={{ color: Colors.white }}
                    color={Colors.biruJaja}
                    mode="contained"
                    onPress={handleButton}>
                    {viewTwo ? "Masuk" : "Simpan"}
                </Button>
            </ActionSheet>
        </SafeAreaView >
    );

}

const styles = StyleSheet.create({
    body: {
        flex: 0, flexDirection: 'column', alignSelf: "center", justifyContent: 'flex-start', paddingBottom: Hp('0%'), marginTop: '-25%'
    },
    inputBox: {
        paddingVertical: '1%',
        // backgroundColor: 'red',
        width: Wp('80%'),
        borderBottomColor: Colors.silver,
        borderBottomWidth: 0.2
    },
    imageHeader: {
        height: Hp('10%'),
        width: '100%',
        opacity: 1,
    },
    header: {
        height: Hp('10%'),
        backgroundColor: Colors.biruJaja,
        alignItems: 'center',
        justifyContent: 'flex-start',
        opacity: 0.95,
    },
    card: {
        flex: 0,
        flexDirection: 'column',
        borderRadius: 5,
        backgroundColor: Colors.white,
        width: Wp('95%'),
        height: Wp('30%'),
        shadowColor: "#000",
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        opacity: 1,
        elevation: 11,
        marginBottom: '2%'
    },
    cardCenter: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '92%',
        alignSelf: 'center',
        // backgroundColor: 'pink',
        alignItems: 'center'
    },
    textCenterTop: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: Colors.biruJaja,
    },
    textCenterPending: {
        marginTop: '2%',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: Colors.kuningJaja,
    },
    cardJaja: {
        flex: 1,
        flexDirection: 'column',
        padding: '3%',
        marginTop: '2%',
        marginBottom: '2%',
        width: Wp('95%'),
        height: Hp('60%'),
        backgroundColor: 'white',
        shadowColor: "#f5f5f5",
        shadowOpacity: 0.2,
        elevation: 0.5,
        borderRadius: 3
    }
})
