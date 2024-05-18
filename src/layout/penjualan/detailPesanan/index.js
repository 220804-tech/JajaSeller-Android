import React, { useState, useEffect, useCallback, createRef } from 'react'
import { View, Text, Image, StatusBar, FlatList, TouchableOpacity, Alert, TextInput, SafeAreaView, ScrollView, Modal, RefreshControl, Platform } from "react-native";
import { Button, RadioButton, Checkbox } from 'react-native-paper'
import styles from '../../../styles/penjualan'
import { money } from '../../../utils'
import { Dialog } from 'react-native-simple-dialogs';
import EncryptedStorage from 'react-native-encrypted-storage';
import * as Firebase from '../../../service/Firebase'
import { useDispatch, useSelector } from 'react-redux'
import firebaseDatabase from '@react-native-firebase/database';
import { Colors, Style, Appbar, Utils, Storage, ServiceOrders, Wp, Loading, useNavigation, useFocusEffect, Hp, ServiceOrdersNew } from '../../../export';
import email from 'react-native-email'
import DocumentPicker from "react-native-document-picker";
import ActionSheet from 'react-native-actions-sheet';
import ImagePicker from "react-native-image-crop-picker";

export default function DetailsPesanan(props) {
    const navigation = useNavigation()
    const galleryRef = createRef()
    const reduxSellerId = useSelector(state => state.user.seller?.id_toko)

    const reduxOrderDetail = useSelector(state => state.orders.orderDetail)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const [visibilityCancel, setVisibilityCancel] = useState(false)
    const [visibilityReject, setVisibilityReject] = useState(false)
    const [visibilityDialog, setVisibilityDialog] = useState(false)
    const [visibilityDialogInputResi, setVisibilityDialogInputResi] = useState(false)
    const [modalKirimBukti, setmodalKirimBukti] = useState(false)

    const [alasanTolak, setalasanTolak] = useState("")
    const [inputResi, setInputResi] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [shipping, setShipping] = useState(null);
    const [reject, setReject] = useState(false);
    const [checked, setChecked] = useState("first");
    const [checkedCancel, setcheckedCancel] = useState('');
    const [imageBase64, setimageBase64] = useState('');
    const [imageUrl, setimageUrl] = useState('');


    const handleFileImageToLink = async (base64) => {
        if (base64) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "ci_session=3jj2gelqr7k1pgt00mekej9msvt8evts");

            var raw = JSON.stringify({
                'storeId': reduxSellerId,
                "image": base64
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
                    console.log(res, 'qwertyuio12');
                    try {
                        let result = JSON.parse(res)
                        if (result?.status?.code === 200) {
                            setimageUrl(result.data.url)
                        }
                    } catch (error) {
                        console.log("🚀 ~ file: index.js ~ line 100 ~ handleFileImageToLink ~ error", error)
                    }
                })
                .catch(error => {
                    // console.log("🚀 ~ file: index.js ~ line 104 ~ handleFileImageToLink ~ error", error)
                    Utils.handleError(error, 'Error with status code : 42044')
                });
        }
    }

    const handleOpenCamera = () => {
        ImagePicker.open({
            compressImageQuality: 1,
            includeBase64: true,
            writeTempFile: true,

        }).then(image => {
            galleryRef.current?.setModalVisible(false)
            setimageBase64(image)
            handleFileImageToLink(image.data)

        });
    }
    const handlePickImage = () => {
        ImagePicker.openPicker({
            compressImageQuality: 1,
            includeBase64: true,
            writeTempFile: true,
        }).then(image => {
            galleryRef.current?.setModalVisible(false)
            setimageBase64(image)
            handleFileImageToLink(image.data)
        });
    }


    useEffect(() => {
        setLoading(true)
        if (props?.route?.params?.data) {
            getItem(props.route.params.data)
        }
    }, [props])

    const getAll = async () => {
        // semuapesanan
        try {
            let data = [];
            data = await ServiceOrdersNew.getTabAll(reduxSellerId)
            if (data.length) {
                dispatch({ type: 'SET_ORDERS', payload: data })
            }
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 75 ~ getTabAll ~ error", error)
        }
    }

    const getPaid = async () => {
        // pesananbaru
        try {
            let data = [];
            data = await ServiceOrdersNew.getTabPaid(reduxSellerId)
            if (data.length) {
                dispatch({ type: 'SET_ORDER_PAID', payload: data })
            }
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 90 ~ getTabPaid ~ error", error)
        }
    }

    const getNeedSent = async () => {
        //pesananBelumDikirim
        try {
            let data = [];
            data = await ServiceOrdersNew.getTabNeedSent(reduxSellerId)
            if (data.length) {
                dispatch({ type: 'SET_ORDER_PROCESS', payload: data })
            }
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 101 ~ getNeedSent ~ error", error)
        }
    }
    const getSent = async () => {
        //pesananSedangDikirim
        try {
            let data = [];
            data = await ServiceOrdersNew.getTabSent(reduxSellerId)
            if (data.length) {
                dispatch({ type: 'SET_ORDER_SENT', payload: data })
            }
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 112 ~ getSent ~ error", error)
        }
    }
    const getFailed = async () => {
        //pesananBatal
        try {
            let data = [];
            data = await ServiceOrdersNew.getTabFailed(reduxSellerId)
            if (data.length) {
                dispatch({ type: 'SET_ORDER_BLOCKED', payload: data })
            }
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 123 ~ getFailed ~ error", error)
        }
    }


    const handleLoopSignal = (signal) => {
        if (signal.connect === false) {
            Utils.alertPopUp('Periksa kembali koneksi nternet anda!')
        } else {
            try {
                getItem(props.route.params.data);
            } catch (error) {
                console.log("🚀 ~ file: index.js ~ line 321 ~ handleLoopSignal ~ error", error)
            }
        }
        return signal.connect
    }

    const getItem = (inv) => {
        try {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            setRefreshing(false)
            fetch(`https://jsonx.jaja.id/core/seller/penjualan/${inv}`, requestOptions)
                .then(response => response.text())
                .then(res => {
                    try {
                        let result = JSON.parse(res)
                        if (result.status.code == 200) {
                            dispatch({ type: 'SET_ORDER_DETAIL', payload: result.data })
                            setShipping(result.data.shipping ? result.data.shipping : null)
                        } else {
                            Utils.handleErrorResponse(result, 'Error with status code : 12075')
                        }
                        setLoading(false)
                    } catch (error) {
                        console.log("🚀 ~ file: index.js ~ line 123 ~ getItem ~ error", error)
                        Utils.alertPopUp(String(res), 'Error with status code : 12076')
                        setLoading(false)
                    }
                })
                .catch((err) => {
                    console.log("🚀 ~ file: index.js ~ line 217 ~ getItem ~ err", err)
                    Utils.handleError(err, 'Error with status code : 12077')
                    setLoading(false)
                });
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 222 ~ getItem ~ error", error)
            setLoading(false)
        }
    }

    const renderItem = ({ item }) => {
        return (
            <View style={[Style.row_0, { marginBottom: '2%', borderBottomWidth: 1, borderBottomColor: Colors.silver }]}>
                <View style={{ flex: 0, height: Wp('18%'), width: Wp('20%'), marginRight: '2%', backgroundColor: Colors.silver }}>
                    <Image source={{ uri: item.image }} style={styles.imageItem} />
                </View>
                <View style={Style.column_start_center}>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={styles.formText}>{item.name}</Text>
                    <View style={[Style.column_end_center, { width: '100%' }]}>
                        <Text adjustsFontSizeToFit style={[styles.formTextRight]}>{item.qty} x <Text adjustsFontSizeToFit style={{ color: item.qty <= 1 ? Colors.biruJaja : Colors.blackLight, fontSize: 14 }}>{money(String(item.price))}</Text></Text>
                        {item.qty > 1 ?
                            <Text adjustsFontSizeToFit style={[styles.formTextRight, { color: Colors.biruJaja }]}>Rp {money(String(item.totalPrice))}</Text>
                            : null}
                    </View>
                </View>
            </View >
        )
    }

    const handlePesananBaru = (name) => {
        if (name === "terima") {
            Alert.alert("Penting", "Anda akan menerima pesanan ini?", [
                {
                    text: 'Kembali',
                },
                {
                    text: "Terima",
                    onPress: () => {
                        setLoading(true)
                        try {
                            var formdata = new FormData();
                            formdata.append("invoice", reduxOrderDetail.invoice);
                            formdata.append("terima_pesanan", "baru");

                            var requestOptions = {
                                method: 'POST',
                                body: formdata,
                                redirect: 'follow'
                            };
                            setRefreshing(false)
                            fetch("https://jsonx.jaja.id/core/seller/order/updateterima", requestOptions)
                                .then(response => response.json())
                                .then(() => {
                                    setTimeout(() => setLoading(false), 1000);
                                    setTimeout(() => navigation.goBack(), 1500)
                                    setTimeout(() => Utils.alertPopUp("Pesanan berhasil diterima!"), 500);
                                    Firebase.buyerNotifications("orders")
                                    getAll()
                                    getPaid()
                                    getNeedSent()
                                    handleEmail()
                                    setTimeout(() => dispatch({ type: "SET_ORDER_REFRESH", payload: true }), 3000);
                                }).catch(error => {
                                    setTimeout(() => setLoading(false), 300);
                                    setTimeout(() => Utils.alertPopUp(JSON.stringify(error)), 1000);
                                });
                            setVisibilityDialog(false)
                        } catch (error) {
                            console.log("🚀 ~ file: index.js ~ line 262 ~ handlePesananBaru ~ error", error)

                        }
                    }
                },
            ])
        } else {
            setVisibilityDialog(true)
        }

    }
    const handleEmail = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`https://elibx.jaja.id/jaja/user/order-sendmail?invoice=${reduxOrderDetail.invoice}&image=${reduxOrderDetail.product[0].image}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                try {
                    let res = JSON.parse(result)
                    if (res?.status?.code === 200) {
                        Utils.alertPopUp('Bukti berhasil dikirim!')
                    } else {
                        Utils.alertPopUp('Gagal mengirim bukti!' + ' => ' + res?.status?.message ? res.status.message : '')
                    }
                } catch (error) {
                    console.log("🚀 ~ file: index.js ~ line 63 ~ handleEmail ~ error", error)
                }
            })
            .catch(error => {
                console.log("🚀 ~ file: index.js ~ line 315 ~ handleEmail ~ error", error)
                // setmodalKirimBukti(true)
                // Utils.handleError(error, 'Error with status code : 60101')
            });
    }

    const handleReject = () => {
        if (alasanTolak.length <= 6) {
            setVisibilityCancel(false)
            Utils.alertPopUp('Alasan tolak setikdaknya berisi dua kata!')
        } else if (reject && reduxOrderDetail) {
            setLoading(true)
            setVisibilityReject(false)
            setVisibilityDialog(false)
            var formdata = new FormData();
            formdata.append("kendala_toko", checked === "first" ? "stok" : checked === "second" ? "kurir" : checked === "third" ? "tokotutup" : checked === "fourth" ? "pembeli" : 'lainnya');
            formdata.append("alasan_tolak", alasanTolak);
            formdata.append("invoice", reduxOrderDetail.invoice);

            var requestOptions = {
                method: 'POST',
                body: formdata,
            };

            fetch("https://jsonx.jaja.id/core/seller/order/updatebatalkan", requestOptions)
                .then(response => response.json())
                .then(async result => {
                    if (result.error === false) {
                        Utils.alertPopUp('Pesanan berhasil dibatalakan!')
                        getPaid()
                        getFailed()
                        firebaseDatabase().ref("/people/" + reduxOrderDetail.uidCustomer).once('value').then(async snapshot => {
                            let item = await snapshot.val();
                            if (item && item.notif) {
                                await Firebase.notifChat(item.token, { body: alasanTolak, title: "Pesanan anda dibatalkan" })
                                Firebase.buyerNotifications("orders", reduxOrderDetail.uidCustomer).then(res => {
                                    console.log("🚀 ~ file: index.js ~ line 226 ~ Firebase.buyerNotifications ~ res", res)
                                })
                                Firebase.buyerNotifications("home", reduxOrderDetail.uidCustomer).then(res => {
                                    console.log("🚀 ~ file: index.js ~ line 226 ~ Firebase.buyerNotifications ~ res", res)
                                })
                            } else {
                                firebaseDatabase().ref(`/people/${reduxOrderDetail.uidCustomer}/notif`).update({ home: 1, chat: 0, orders: 1 });
                            }
                        })
                        setTimeout(() => dispatch({ type: "SET_ORDER_REFRESH", payload: true }), 3000);
                        setTimeout(() => {
                            setLoading(false)
                            navigation.goBack()
                        }, 4000);
                    } else {
                        Utils.alertPopUp(JSON.stringify(result.message))
                    }
                    setalasanTolak("")
                    setVisibilityCancel(false)
                    setVisibilityReject(false)
                    setTimeout(() => setLoading(false), 500);
                })
                .catch(error => {
                    setLoading(false)
                    setVisibilityCancel(false)
                    setVisibilityReject(false)
                    Utils.alertPopUp(JSON.stringify(error))
                });
            setTimeout(() => setLoading(false), 500);
            setReject(false)
            setTimeout(() => navigation.navigate("Penjualan", { data: 'update' }), 1500);
        } else if (reject === false && reduxOrderDetail) {
            setVisibilityDialog(false)
            setTimeout(() => {
                setLoading(true)
            }, 500);

            var formdata = new FormData();
            formdata.append("invoice", reduxOrderDetail.invoice);
            formdata.append("terima_pesanan", "baru");
            formdata.append("alasan_tolak", alasanTolak);
            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };
            fetch("https://jsonx.jaja.id/core/seller/order/updatetolak", requestOptions)
                .then(response => response.json())
                .then(async () => {
                    setVisibilityDialog(false)
                    setalasanTolak("")
                    setTimeout(() => Utils.alertPopUp('Pesanan berhasil ditolak!'), 3000);
                    firebaseDatabase().ref("/people/" + reduxOrderDetail.uidCustomer).once('value').then(async snapshot => {
                        let item = await snapshot.val();
                        if (item && item.notif) {
                            await Firebase.notifChat(item.token, { body: alasanTolak, title: "Pesanan anda dibatalkan" })
                            Firebase.buyerNotifications("orders", reduxOrderDetail.uidCustomer).then(res => {
                                console.log("🚀 ~ file: index.js ~ line 226 ~ Firebase.buyerNotifications ~ res", res)
                            })
                            Firebase.buyerNotifications("home", reduxOrderDetail.uidCustomer).then(res => {
                                console.log("🚀 ~ file: index.js ~ line 226 ~ Firebase.buyerNotifications ~ res", res)
                                setTimeout(() => setLoading(false), 1500);
                            })
                        } else {
                            firebaseDatabase().ref(`/people/${reduxOrderDetail.uidCustomer}/notif`).update({ home: 1, chat: 0, orders: 1 });
                        }
                    })
                    setTimeout(() => setLoading(false), 500);
                    setTimeout(() => navigation.navigate("Penjualan", { data: 'update' }), 1500);
                })
                .catch(error => {
                    setLoading(false)
                    setTimeout(() => Utils.alertPopUp(JSON.stringify(error)), 500);
                });
        } else {
            setVisibilityDialog(false)
            Utils.alertPopUp('Mohon maaf ada kesalahan teknis!')
        }
    }

    const handleInputResi = () => {
        if (inputResi.length > 5) {
            setLoading(true)
            var formdata = new FormData();
            formdata.append("id_resi", reduxOrderDetail.resi_id);
            formdata.append("manual_booking", "manual booking");
            formdata.append("nomor_resi", inputResi);

            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };
            fetch("https://jsonx.jaja.id/core/seller/order/updatenoresi", requestOptions)
                .then(response => response.json())
                .then(() => {
                    Firebase.buyerNotifications("orders")
                    getNeedSent()
                    getSent()
                    setVisibilityDialogInputResi(false)
                    setInputResi("")
                    Utils.alertPopUp('Nomor resi berhasil ditambahkan!')
                    firebaseDatabase().ref("/people/" + reduxOrderDetail.uidCustomer).once('value').then(snapshot => {
                        let item = snapshot.val();
                        console.log("🚀 ~ file: index.js ~ line 53 ~ fire ~ item", item.token)
                        if (item && item.notif) {
                            Firebase.notifChat(item.token, { body: "Pesanan anda sedang dalam proses pengiriman", title: "Pesanan anda telah dikirim" })
                            Firebase.buyerNotifications("orders", reduxOrderDetail.uidCustomer)
                            Firebase.buyerNotifications("home", reduxOrderDetail.uidCustomer)
                        } else {
                            firebaseDatabase().ref(`/people/${reduxOrderDetail.uidCustomer}/notif`).update({ home: 1, chat: 0, orders: 1 });
                        }
                    })
                    setTimeout(() => {
                        setLoading(false)
                        navigation.navigate("Penjualan", { data: 'update' })
                    }, 1500);
                })
                .catch(error => {
                    setLoading(false)
                    setTimeout(() => Utils.alertPopUp(JSON.stringify(error)), 300);
                });
        } else {
            Utils.alertPopUp('Nomer resi terlalu pendek!')
        }
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        if (props.route.params.data) {
            getItem(props.route.params.data)
        } else {
            setRefreshing(false);
            setTimeout(() => Utils.alertPopUp('Ada kesalahan teknis!'), 300);
        }
        setTimeout(() => {
            setLoading(false)
        }, 5000);
    }, []);

    return (
        <SafeAreaView style={Style.container}>
            <StatusBar translucent={false} backgroundColor={Colors.biruJaja} barStyle="light-content" />
            {loading ? <Loading /> : null}
            <Appbar back={true} title="Detail pesanan" />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                contentContainerStyle={{ flex: 1, backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }}
            >
                {reduxOrderDetail ?
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={[Style.column, { backgroundColor: Colors.white, marginBottom: '2%', paddingHorizontal: '3%', paddingVertical: '2%', justifyContent: 'center' }]}>
                            <View style={[Style.row_between_center, { marginBottom: '2%' }]}>
                                <Text adjustsFontSizeToFit style={[Style.font_14, Style.medium]}>Nomor pesanan</Text>
                                <Text adjustsFontSizeToFit style={[Style.font_13, Style.medium]}>{reduxOrderDetail.invoice}</Text>
                            </View>
                            {reduxOrderDetail.date.created_date ?
                                <View style={[Style.row_between_center, { marginBottom: '0%', paddingVertical: 0 }]}>
                                    <Text adjustsFontSizeToFit style={Style.font_13}>Waktu pemesanan</Text>
                                    <Text adjustsFontSizeToFit style={[Style.font_13]}>{reduxOrderDetail.date.created_date}</Text>
                                </View> : null
                            }
                            {reduxOrderDetail.date.payment_date ?
                                <View style={[Style.row_between_center, { marginBottom: '0%', paddingVertical: 0 }]}>
                                    <Text adjustsFontSizeToFit style={Style.font_13}>Waktu pembayaran</Text>
                                    <Text adjustsFontSizeToFit style={[Style.font_13]}>{reduxOrderDetail.date.payment_date}</Text>
                                </View>
                                : null}
                            {reduxOrderDetail.date.send_date ?
                                <View style={[Style.row_between_center, { marginBottom: '0%', paddingVertical: 0 }]}>
                                    <Text adjustsFontSizeToFit style={Style.font_13}>Waktu pengiriman</Text>
                                    <Text adjustsFontSizeToFit style={[Style.font_13]}>{reduxOrderDetail.date.send_date}</Text>
                                </View>
                                : null}
                            {reduxOrderDetail.date.confirm_date ?
                                <View style={[Style.row_between_center, Style.mb_2]}>
                                    <Text adjustsFontSizeToFit style={Style.font_13}>{reduxOrderDetail.status === "Dibatalkan" ? 'Waktu dibatalkan' : "Waktu pesanan selesai"}</Text>
                                    <Text adjustsFontSizeToFit style={[Style.font_13]}>{reduxOrderDetail.status === "Dibatalkan" ? reduxOrderDetail.date.confirm_date ? reduxOrderDetail.date.confirm_date : "-" : reduxOrderDetail.date.end_date ? reduxOrderDetail.date.end_date : '-'}</Text>
                                </View>
                                : null}

                        </View>

                        {shipping?.name ?
                            <View style={[Style.column, { backgroundColor: Colors.white, marginBottom: '2%', paddingHorizontal: '3%', paddingVertical: '2%' }]}>

                                <View style={[Style.row_between_center, Style.mb_2]}>
                                    <Text adjustsFontSizeToFit style={[Style.font_14, Style.medium]}>Informasi pesanan</Text>
                                </View>
                                <Text adjustsFontSizeToFit style={[Style.font_13, Style.mb]}>{reduxOrderDetail.customerName}</Text>
                                <Text adjustsFontSizeToFit style={[Style.font_13, Style.mb_2]}>{shipping?.address?.split('<br>')}</Text>
                                <View style={[Style.row_between_center, Style.mb_2]}>
                                    <Text adjustsFontSizeToFit style={Style.font_13}>{shipping.name}</Text>
                                    <Text adjustsFontSizeToFit style={Style.font_13}>{shipping.priceCurrencyFormat}</Text>
                                </View>

                                <View style={[Style.row_start]}>

                                    <Text adjustsFontSizeToFit style={Style.font_13}><Text adjustsFontSizeToFit style={[Style.font_13, Style.medium]}>Catatan : </Text>{reduxOrderDetail.note && Object.keys(reduxOrderDetail.note).length && reduxOrderDetail.note.fromCustomer ? String(reduxOrderDetail.note.fromCustomer).slice(0, 1000) : 'Tidak ada catatan'}</Text>
                                </View>
                            </View>
                            : null
                        }
                        {Object.keys(reduxOrderDetail.voucherJaja).length !== 0 ?
                            <View style={[Style.column, { backgroundColor: Colors.white, marginBottom: '2%', paddingHorizontal: '3%', paddingVertical: '2%', justifyContent: 'center' }]}>
                                <View style={[Style.row_between_center, { marginBottom: 0 }]}>
                                    <Text adjustsFontSizeToFit style={[Style.font_14, { marginBottom: 0 }]}>Voucher Jaja</Text>
                                    <Text adjustsFontSizeToFit style={[Style.font_13, { marginBottom: 0 }]}>-{reduxOrderDetail.voucherJaja.discount}</Text>
                                </View>
                            </View>
                            : null
                        }
                        {Object.keys(reduxOrderDetail.voucherMerchant).length !== 0 ?
                            <View style={[Style.column, { backgroundColor: Colors.white, marginBottom: '2%', paddingHorizontal: '3%', paddingVertical: '2%', justifyContent: 'center' }]}>
                                <View style={[Style.row_between_center, { marginBottom: 0 }]}>
                                    <Text adjustsFontSizeToFit style={[Style.font_14, { marginBottom: 0 }]}>Voucher Toko</Text>
                                    <Text adjustsFontSizeToFit style={[Style.font_13, { marginBottom: 0 }]}>- {reduxOrderDetail.voucherMerchant.discount}</Text>
                                </View>
                            </View>
                            : null
                        }
                        <View style={[Style.column, { backgroundColor: Colors.white, marginBottom: '2%', paddingHorizontal: '3%', paddingVertical: '2%' }]}>
                            <View style={[Style.row_between_center, Style.mb_2]}>
                                <Text adjustsFontSizeToFit style={Style.font_14}>Informasi produk</Text>
                            </View>
                            <View style={Style.column}>
                                <FlatList
                                    contentContainerStyle={{ flex: 0 }}
                                    data={reduxOrderDetail.product}
                                    keyExtractor={(item, index) => String(index)}
                                    renderItem={renderItem}
                                />
                                <View style={[Style.row_between_center, Style.mb_2]}>
                                    <Text adjustsFontSizeToFit style={[Style.font_13, { flex: 0, marginBottom: '0%' }]}>Ongkos kirim</Text>
                                    <Text adjustsFontSizeToFit style={Style.font_13}>{shipping ? shipping.priceCurrencyFormat : "Rp 0"}</Text>
                                </View>
                                {Object.keys(reduxOrderDetail.voucherJaja).length !== 0 ?
                                    <View style={[Style.row_between_center, Style.mb_2]}>
                                        <Text adjustsFontSizeToFit style={[Style.font_13, { flex: 0, marginBottom: '0%' }]}>Voucher Jaja</Text>
                                        <Text adjustsFontSizeToFit style={[Style.font_13, { color: Colors.kuningJaja }]}>- {reduxOrderDetail.discountVoucherJajaCurrencyFormat}</Text>
                                    </View> : null
                                }
                                {Object.keys(reduxOrderDetail.voucherMerchant).length !== 0 ?
                                    <View style={[Style.row_between_center, Style.mb_2]}>
                                        <Text adjustsFontSizeToFit style={[Style.font_13, { flex: 0, marginBottom: '0%' }]}>Voucher Toko</Text>
                                        <Text adjustsFontSizeToFit style={[Style.font_13, { color: Colors.kuningJaja }]}>- {reduxOrderDetail.discountVoucherMerchantCurrencyFormat}</Text>
                                    </View> : null
                                }
                                <View style={[Style.row_between_center, Style.mb_2]}>
                                    <Text adjustsFontSizeToFit style={[Style.font_13, { flex: 0, marginBottom: '0%' }]}>Biaya penanganan</Text>
                                    <Text adjustsFontSizeToFit style={Style.font_13}>Rp. 0</Text>
                                </View>
                                <View style={[Style.row_0, { alignItems: 'center', marginBottom: '1%' }]}>
                                    <Text adjustsFontSizeToFit style={[Style.font_13, { flex: 1, marginBottom: '0%' }]}>{reduxOrderDetail.totalProduct} produk</Text>
                                    <View style={[Style.row_end_center, { width: '100%', flex: 1 }]}>
                                        <Text adjustsFontSizeToFit style={[Style.font_13, { marginBottom: '0%' }]}>Total pesanan:</Text>
                                        <Text adjustsFontSizeToFit style={[styles.formTextRight, { color: Colors.biruJaja, marginLeft: '5%' }]}>Rp {money(String(reduxOrderDetail.totalOrder))}</Text>
                                    </View>
                                </View>
                                {reduxOrderDetail.status === "Belum Bayar" ?
                                    <View style={[Style.row_between_center]}>
                                        <Text adjustsFontSizeToFit style={[Style.font_13, { flex: 0, marginBottom: '0%' }]}>Status :</Text>
                                        <Text adjustsFontSizeToFit style={[Style.font_13, Style.italic, { color: Colors.redPower }]}>Menunggu pembayaran</Text>
                                    </View>
                                    : reduxOrderDetail.status === "Pesanan Baru" ?
                                        <View style={[Style.row_between_center, { marginTop: '3%' }]}>
                                            <Button onPress={() => handlePesananBaru("tolak")} style={{ width: '45%' }} labelStyle={{ color: Colors.white }} color={Colors.redNotif} mode="contained">
                                                Tolak
                                            </Button>
                                            <Button onPress={() => handlePesananBaru("terima")} style={{ width: '45%' }} labelStyle={{ color: Colors.white }} color={Colors.biruJaja} mode="contained">
                                                Terima
                                            </Button>
                                        </View>
                                        : reduxOrderDetail.status === "Perlu Dikirim" ?
                                            <View style={[Style.row_between_center, Style.my_3]}>
                                                <Button onPress={() => setVisibilityDialogInputResi(true)} style={{ width: '47%', elevation: 0, borderRadius: 3 }} labelStyle={[Style.font_12, Style.medium, { color: Colors.white }]} color={Colors.biruJaja} mode="contained">
                                                    Input Resi
                                                </Button>
                                                <Button onPress={() => setVisibilityReject(true) & setReject(true)} style={{ width: '47%', elevation: 0, borderRadius: 3 }} labelStyle={[Style.font_12, Style.medium, { color: Colors.white }]} color={Colors.redNotif} mode="contained">
                                                    Batalkan
                                                </Button>
                                            </View>
                                            : reduxOrderDetail.status === "Dibatalkan" ?
                                                <View style={[Style.row_between_center]}>
                                                    <Text adjustsFontSizeToFit style={[Style.font_13, { flex: 0, marginBottom: '0%' }]}>Status :</Text>
                                                    <Text adjustsFontSizeToFit style={[Style.font_13, Style.italic, { color: Colors.redPower }]}>Pesanan dibatalkan</Text>
                                                </View>
                                                : reduxOrderDetail.status === "Dikirimkan" ?
                                                    reduxOrderDetail?.shipping?.name ?
                                                        <View style={Style.column}>
                                                            <Button onPress={() => navigation.navigate('LacakPaket', { order: reduxOrderDetail })} style={{ width: '100%', marginTop: '3%' }} labelStyle={[Style.font_12, Style.bold, { color: Colors.white }]} color={Colors.biruJaja} mode="contained">
                                                                Lacak Pesanan
                                                            </Button>
                                                            {reduxOrderDetail.status_komplain == 'Y' ?
                                                                <Button onPress={() => navigation.navigate('Complain')} style={{ width: '100%', marginTop: '3%' }} labelStyle={[Style.font_12, Style.bold, { color: Colors.white }]} color={Colors.kuningJaja} mode="contained">
                                                                    Lihat Komplain
                                                                </Button>
                                                                : null}
                                                        </View>
                                                        : null
                                                    : reduxOrderDetail.status === 'Selesai' ?
                                                        // <Button onPress={() => setmodalKirimBukti(true)} style={[Style.mt_4, { width: '95%', elevation: 0, borderRadius: 3, alignSelf: 'center' }]} labelStyle={[Style.font_12, Style.medium, { color: Colors.white }]} color={Colors.biruJaja} mode="contained">
                                                        //     Kirim Bukti
                                                        // </Button>
                                                        null
                                                        : null
                                }
                            </View>
                        </View>
                    </View>
                    :
                    null
                }
            </ScrollView>
            <Dialog
                visible={visibilityCancel}
                title='Anda yakin ingin membatalkan pesanan ini?'
                onTouchOutside={() => setVisibilityDialog(false) & setalasanTolak("")} >
                <View style={{ flexDirection: 'row', marginTop: '3%', justifyContent: 'space-evenly' }}>
                    <TouchableOpacity onPress={() => setVisibilityCancel(false)} style={{ backgroundColor: Colors.kuningJaja, padding: '3%', borderRadius: 5, width: '25%' }}>
                        <Text adjustsFontSizeToFit style={[Style.font_14, { color: 'white', alignSelf: 'center' }]}>Tutup</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleReject} style={{ backgroundColor: Colors.biruJaja, padding: '3%', borderRadius: 5 }}>
                        <Text adjustsFontSizeToFit style={[Style.font_14, { color: 'white', alignSelf: 'center' }]}>Batalkan</Text>
                    </TouchableOpacity>
                </View>
            </Dialog>
            <Dialog visible={visibilityReject} title='Anda yakin ingin membatalkan pesanan ini?' onTouchOutside={() => setVisibilityDialog(false) & setalasanTolak("")} >
                <View style={Style.column}>
                    <View style={[Style.row_0_start_center, { marginBottom: checked === "first" ? '3%' : '5%' }]}>
                        <RadioButton
                            value="first"
                            status={checked === 'first' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('first') & setalasanTolak("")}
                        />
                        <Text style={styles.textAlasanTolak}>Stok produk kosong</Text>
                    </View>
                    {checked === "first" ? <TextInput style={{ paddingHorizontal: '2%', alignSelf: 'center', borderWidth: 0.5, borderRadius: 5, width: '90%', borderColor: checked === "first" ? Colors.biruJaja : Colors.blackGrey, marginBottom: '3%' }} onChangeText={(text) => setalasanTolak(text)} /> : null}
                    <View style={[Style.row_0_start_center, { marginBottom: checked === "second" ? '3%' : '5%' }]}>
                        <RadioButton
                            value="second"
                            status={checked === 'second' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('second') & setalasanTolak("")}
                        />
                        <Text style={styles.textAlasanTolak} >Kendala dalam pengiriman</Text>
                    </View>
                    {checked === "second" ? <TextInput style={{ paddingHorizontal: '2%', alignSelf: 'center', borderWidth: 0.5, borderRadius: 5, width: '90%', borderColor: checked === "second" ? Colors.biruJaja : Colors.blackGrey, marginBottom: '3%' }} onChangeText={(text) => setalasanTolak(text)} /> : null}

                    <View style={[Style.row_0_start_center, { marginBottom: checked === "third" ? '3%' : '5%' }]}>
                        <RadioButton
                            value="third"
                            status={checked === 'third' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('third') & setalasanTolak("")}
                        />
                        <Text style={styles.textAlasanTolak}>Toko sedang tutup</Text>
                    </View>
                    {checked === "third" ? <TextInput style={{ paddingHorizontal: '2%', alignSelf: 'center', borderWidth: 0.5, borderRadius: 5, width: '90%', borderColor: checked === "third" ? Colors.biruJaja : Colors.blackGrey, marginBottom: '3%' }} onChangeText={(text) => setalasanTolak(text)} /> : null}

                    <View style={[Style.row_0_start_center, { marginBottom: checked === "fourth" ? '3%' : '5%' }]}>
                        <RadioButton
                            value="fourth"
                            status={checked === 'fourth' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('fourth') & setalasanTolak("")}
                        />
                        <Text style={styles.textAlasanTolak}>Pembeli tidak merespon</Text>
                    </View>
                    {checked === "fourth" ? <TextInput style={{ paddingHorizontal: '2%', alignSelf: 'center', borderWidth: 0.5, borderRadius: 5, width: '90%', borderColor: checked === "fourth" ? Colors.biruJaja : Colors.blackGrey, marginBottom: '3%' }} onChangeText={(text) => setalasanTolak(text)} /> : null}

                    <View style={[Style.row_0_start_center, { marginBottom: checked === "fifth" ? '3%' : '5%' }]}>
                        <RadioButton
                            value="fifth"
                            status={checked === 'fifth' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('fifth') & setalasanTolak("")}
                        />
                        <Text style={styles.textAlasanTolak}>Lainnya</Text>
                    </View>
                    {checked === "fifth" ? <TextInput style={{ paddingHorizontal: '2%', alignSelf: 'center', borderWidth: 0.5, borderRadius: 5, width: '90%', borderColor: checked === "fifth" ? Colors.biruJaja : Colors.blackGrey, marginBottom: '3%' }} onChangeText={(text) => setalasanTolak(text)} /> : null}

                    <View style={Style.row_0_end}>
                        <TouchableOpacity onPress={() => setVisibilityReject(false)} style={[Style.px_3, Style.py_2, { backgroundColor: Colors.kuningJaja, borderRadius: 3, width: '25%' }]}>
                            <Text adjustsFontSizeToFit style={[Style.font_13, Style.medium, { color: 'white', alignSelf: 'center' }]}>Tutup</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setVisibilityCancel(true)} style={[Style.px_4, Style.py_2, Style.ml_3, { backgroundColor: Colors.redNotif, borderRadius: 3 }]}>
                            <Text adjustsFontSizeToFit style={[Style.font_13, Style.medium, { color: 'white', alignSelf: 'center' }]}>Batalkan</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Dialog>
            {/* <Dialog
                visible={visibilityDialog}
                title={`Pesanan dengan nomor ` + reduxOrderDetail.invoice + " akan dibatalkan"}
                onTouchOutside={() => {
                    setVisibilityDialog(false)
                    setalasanTolak("")
                }} >
                <View style={Style.column}>
                    <Text adjustsFontSizeToFit style={{ fontSize: 14 }}>Input alasan pembatalan</Text>

                    <TextInput value={alasanTolak} onChangeText={text => setalasanTolak(text)} placeholder="Alasan Tolak" numberOfLines={2} style={{ height: 45, marginTop: 10, borderWidth: 0.5, paddingHorizontal: 10 }} />
                    <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' }}>
                        <TouchableOpacity onPress={() => { setVisibilityDialog(false) & setalasanTolak("") & setVisibilityCancel(false) }} style={{ backgroundColor: Colors.kuningJaja, padding: '3%', borderRadius: 5, width: '40%' }}>
                            <Text adjustsFontSizeToFit style={[Style.font_14, Style.semi_bold, { color: 'white', alignSelf: 'center' }]}>Kembali</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleReject} style={{ backgroundColor: Colors.biruJaja, padding: '3%', borderRadius: 5, width: '40%', marginLeft: '2%' }}>
                            <Text adjustsFontSizeToFit style={[Style.font_14, Style.semi_bold, { color: 'white', alignSelf: 'center' }]}>Tolak</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Dialog> */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalKirimBukti}
                onRequestClose={() => setmodalKirimBukti(!modalKirimBukti)}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: Wp('100%'), height: Hp('100%'), backgroundColor: 'rgba(52, 52, 52, 0.2)', zIndex: 999 }}>
                    <View style={[Style.shadow_3, Style.column_between_center, { alignItems: 'flex-start', width: Wp('90%'), height: Hp('22%'), backgroundColor: Colors.white, zIndex: 999, padding: '4%' }]}>
                        <Text style={[Style.font_13, Style.semi_bold, { color: Colors.biruJaja }]}>Kirim Bukti</Text>
                        <Text style={[Style.font_10, Style.mb, { color: Colors.red, fontStyle: 'italic' }]}>Note : Bukti invoice akan dikirim ke email pembeli, lampirkan file atau gambar bersifat opsional.</Text>

                        <View style={[Style.row_0_start_center]}>


                            <TouchableOpacity style={[Style.px_3, Style.py, Style.mr, { backgroundColor: Colors.silver, borderRadius: 1 }]} onPress={handlePickImage}>
                                <Text style={[Style.font_10]}>Lampirkan gambar</Text>
                            </TouchableOpacity>
                            <Text numberOfLines={2} style={[Style.font_10, { width: '60%' }]}>{imageBase64?.path ? String(imageBase64?.path).slice(String(imageBase64?.path).length - 25, String(imageBase64?.path).length) : ''}</Text>

                        </View>


                        {/* <Text style={Style.font_14}>Alasan Tolak</Text> */}
                        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end', width: '100%' }}>
                            <TouchableOpacity onPress={() => setmodalKirimBukti(false)} style={{ backgroundColor: Colors.kuningJaja, paddingHorizontal: '1%', paddingVertical: '2%', borderRadius: 5, width: '35%' }}>
                                <Text style={[Style.font_10, { color: 'white', fontFamily: 'Poppins-SemiBold', alignSelf: 'center' }]}>Kembali</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleEmail} style={{ backgroundColor: Colors.biruJaja, paddingHorizontal: '1%', paddingVertical: '2%', borderRadius: 5, width: '35%', marginLeft: '2%', }}>
                                <Text style={[Style.font_10, { color: 'white', fontFamily: 'Poppins-SemiBold', alignSelf: 'center' }]}>Kirim</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={visibilityDialog}
                onRequestClose={() => {
                    setVisibilityDialog(!visibilityDialog);
                }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: Wp('100%'), height: Hp('100%'), backgroundColor: 'transparent', zIndex: 999 }}>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', width: Wp('90%'), height: Hp('45%'), backgroundColor: 'white', zIndex: 999, padding: '4%' }}>
                        <Text style={[Style.font_13, Style.semi_bold, { color: Colors.biruJaja }]}>Pilih alasan pembatalan untuk nomor pesanan {reduxOrderDetail.invoice}</Text>
                        <View style={[Style.row_start_center, { width: '100%' }]}>
                            <Checkbox
                                color={Colors.biruJaja}
                                status={checkedCancel == 1 ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setcheckedCancel(1);
                                    setalasanTolak('Toko sedang tidak beroperasi')

                                }}
                            />
                            <Text style={[Style.font_13]}>Stok produk habis</Text>
                        </View>
                        <View style={[Style.row_start_center, { width: '100%' }]}>
                            <Checkbox
                                color={Colors.biruJaja}
                                status={checkedCancel == 2 ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setcheckedCancel(2);
                                    setalasanTolak('Toko sedang tidak beroperasi')

                                }}
                            />
                            <Text style={[Style.font_13]}>Toko sedang tidak beroperasi</Text>
                        </View>
                        <View style={[Style.row_start_center, { width: '100%' }]}>
                            <Checkbox
                                color={Colors.biruJaja}
                                status={checkedCancel == 3 ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setcheckedCancel(3);
                                    setalasanTolak('')
                                }}
                            />
                            <Text style={[Style.font_13]}>Lainnya</Text>
                        </View>
                        {checkedCancel === 3 ?
                            <TextInput value={alasanTolak} onChangeText={text => setalasanTolak(text)} placeholder="Alasan Tolak" numberOfLines={2} style={{ height: 45, marginTop: 10, borderWidth: 0.5, paddingHorizontal: 10, width: '100%' }} />
                            : null
                        }
                        {/* <Text style={Style.font_14}>Alasan Tolak</Text> */}
                        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end', width: '100%' }}>
                            <TouchableOpacity onPress={() => { setVisibilityDialog(false) & setalasanTolak("") & setVisibilityCancel(false) }} style={{ backgroundColor: Colors.kuningJaja, paddingHorizontal: '3%', paddingVertical: '3%', borderRadius: 5, width: '35%' }}>
                                <Text style={{ color: 'white', fontFamily: 'Poppins-SemiBold', alignSelf: 'center' }}>Kembali</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleReject()} style={{ backgroundColor: Colors.biruJaja, paddingHorizontal: '3%', paddingVertical: '3%', borderRadius: 5, width: '35%', marginLeft: '2%', }}>
                                <Text style={{ color: 'white', fontFamily: 'Poppins-SemiBold', alignSelf: 'center' }}>Kirim</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Dialog
                visible={visibilityDialogInputResi}
                title={`Masukkan nomor resi pada pesanan ` + reduxOrderDetail.invoice}
                onTouchOutside={() => { setVisibilityDialogInputResi(false) }} >
                <View style={Style.column}>
                    <Text adjustsFontSizeToFit style={Style.font_14}>Input Resi</Text>
                    <TextInput value={inputResi} onChangeText={text => setInputResi(text)} placeholder="Nomor Resi" numberOfLines={2} style={{ height: 45, marginTop: 10, borderWidth: 0.5, paddingHorizontal: 10 }} />
                    <TouchableOpacity onPress={handleInputResi} style={{ backgroundColor: Colors.biruJaja, padding: '3%', marginTop: 10, borderRadius: 5, width: '25%', alignSelf: 'flex-end' }}>
                        <Text adjustsFontSizeToFit style={[Style.font_14, Style.semi_bold, { color: 'white', alignSelf: 'center' }]}>Kirim</Text>
                    </TouchableOpacity>
                </View>
            </Dialog>
            <ActionSheet containerStyle={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: Colors.white }} ref={galleryRef}>
                <View style={[Style.column, Style.pb, { backgroundColor: '#ededed' }]}>
                    <TouchableOpacity onPress={handleOpenCamera} style={{ borderBottomWidth: 0.5, borderBottomColor: Colors.silver, alignSelf: 'center', width: Wp('100%'), backgroundColor: Colors.white, paddingVertical: '3%' }}>
                        <Text style={[Style.font_16, { fontWeight: '900', alignSelf: 'center' }]}>Ambil Foto</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handlePickImage} style={{ alignSelf: 'center', width: Wp('100%'), backgroundColor: Colors.White, paddingVertical: '3%', marginBottom: '1%' }}>
                        <Text style={[Style.font_16, { fontWeight: '900', alignSelf: 'center' }]}>Buka Galeri</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => galleryRef.current?.setModalVisible(false)} style={{ alignSelf: 'center', width: Wp('100%'), backgroundColor: Colors.white, paddingVertical: '2%' }}>
                        <Text style={[Style.font_16, { fontWeight: '900', alignSelf: 'center', color: Colors.redNotif }]}>Batal</Text>
                    </TouchableOpacity>
                </View>
            </ActionSheet>
        </SafeAreaView >
    )
}
