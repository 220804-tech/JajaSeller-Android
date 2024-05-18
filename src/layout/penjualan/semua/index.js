import React, { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput, Alert, ScrollView, RefreshControl, Modal, Platform } from 'react-native'
import { Button, Checkbox } from 'react-native-paper'
import Shimmer from '../../../component/shimmerPenjualan'
import { Dialog } from 'react-native-simple-dialogs';
import * as Firebase from '../../../service/Firebase'
import { useSelector, useDispatch } from 'react-redux'
import Unpaid from '../belumBayar'
import { Style, Colors, useNavigation, Wp, Hp, Loading, Utils, FastImage, ServiceOrdersNew } from '../../../export';
import firebaseDatabase from '@react-native-firebase/database';
import styles from '../../../styles/penjualan'

export default function index() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const orders = useSelector(state => state.orders.orders)
    const orderUnpaid = useSelector(state => state.orders.orderUnpaid)
    const reduxSellerId = useSelector(state => state.user.seller?.id_toko)

    const [visibilityDialog, setVisibilityDialog] = useState(false)
    const [pesananDitolak, setpesananDitolak] = useState("")
    const [alasanTolak, setalasanTolak] = useState("toko sedang tidak beroperasi")
    const [shimmer, setShimmer] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setloading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [checked, setChecked] = useState('');

    const onRefresh = useCallback(async (e) => {
        setShimmer(true)
        getAll()
    })

    const getAll = async () => {
        // semuapesanan
        try {
            let data = [];
            data = await ServiceOrdersNew.getTabAll(reduxSellerId)
            if (data.length) {
                dispatch({ type: 'SET_ORDERS', payload: data })
            }
            setShimmer(false)
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 75 ~ getTabAll ~ error", error)
            setShimmer(false)
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

    const handlePress = (inv) => {
        navigation.navigate('DetailsPesanan', { data: inv })
    }

    const handleSubmit = async (data, name) => {
        try {
            if (name === "terima") {
                Alert.alert("Penting", "Anda akan menerima pesanan ini?", [
                    {
                        text: 'Kembali',
                    },
                    {
                        text: "Terima",
                        onPress: () => {
                            setloading(true)
                            try {
                                var formdata = new FormData();
                                formdata.append("invoice", data.invoice);
                                formdata.append("terima_pesanan", "baru");

                                var requestOptions = {
                                    method: 'POST',
                                    body: formdata,
                                    redirect: 'follow'
                                };
                                fetch("https://jsonx.jaja.id/core/seller/order/updateterima", requestOptions)
                                    .then(response => response.json())
                                    .then(result => {
                                        getAll();
                                        getPaid()
                                        if (!data?.shipping?.code) {
                                            handleInputResi(data)
                                        } else {
                                            getNeedSent()
                                            setTimeout(() => Utils.alertPopUp("Pesanan berhasil diterima"), 500);
                                            setTimeout(() => setloading(false), 1500);
                                        }
                                        Firebase.buyerNotifications("orders")
                                    })
                                    .catch(error => {
                                        Utils.alertPopUp(String(error))
                                        setTimeout(() => setloading(false), 1000);
                                    });
                            } catch (error) {
                                console.log("🚀 ~ file: index.js ~ line 132 ~ handleSubmit ~ error", error)
                            }
                        }
                    },
                ])
            } else {
                setVisibilityDialog(true)
                setpesananDitolak(data)
            }
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 155 ~ handleSubmit ~ error", error)
        }
    }

    const handleInputResi = async (result) => {
        try {
            var formdata = new FormData();
            formdata.append("id_resi", result?.resi_id);
            formdata.append("manual_booking", "manual booking");
            formdata.append("nomor_resi", result?.resi_id + "DIGITALVOUCHER");
            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };
            fetch("https://jsonx.jaja.id/core/seller/order/updatenoresi", requestOptions)
                .then(response => response.json())
                .then(() => {
                    getSent()
                    setTimeout(() => {
                        setloading(false)
                    }, 3000);
                    handleNotifFirebase(result, 'Pesanan kamu telah dikonfirmasi', `Pesanan kamu dengan invoice ${result.invoice} telah dikonfirmasi`)
                })
                .catch(error => {
                    console.log("🚀 ~ file: index.js ~ line 179 ~ handleInputResi ~ error", error)
                    setloading(false)
                });

        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 184 ~ handleInputResi ~ error", error)
            setloading(false)
        }
    }

    const handleReject = () => {
        try {
            if (alasanTolak.length <= 6) {
                Utils.alertPopUp('Alasan tolak setidaknya berisi dua kata')
            } else if (pesananDitolak) {
                setVisibilityDialog(false)
                setTimeout(() => {
                    setloading(true)
                    var formdata = new FormData();
                    formdata.append("invoice", pesananDitolak.invoice);
                    formdata.append("terima_pesanan", "baru");
                    formdata.append("alasan_tolak", alasanTolak);
                    var requestOptions = {
                        method: 'POST',
                        body: formdata,
                        redirect: 'follow'
                    };
                    fetch("https://jsonx.jaja.id/core/seller/order/updatetolak", requestOptions)
                        .then(response => response.json())
                        .then(() => {
                            setTimeout(() => Utils.alertPopUp('Pesanan berhasil ditolak!'), 2000);
                            firebaseDatabase().ref("/people/" + pesananDitolak.uidCustomer).once('value')
                                .then(snap => {
                                    var item = snap.val();
                                    if (item && item.notif) {
                                        Firebase.notifChat(item.token, { body: alasanTolak, title: "Pesanan anda dibatalkan" })
                                        firebaseDatabase().ref(`/people/${pesananDitolak.uidCustomer}/notif`).update({ orders: item.notif.orders + 1, home: item.notif.home + 1 });
                                    } else {
                                        firebaseDatabase().ref(`/people/${pesananDitolak.uidCustomer}/notif`).update({ home: 1, chat: 0, orders: 1 });
                                    }

                                }).catch(err => {
                                    console.log("🚀 ~ file: index.js ~ line 166 ~ getItem ~ err", err)
                                })
                            setTimeout(() => setloading(false), 2000);
                            setalasanTolak("")
                            getAll()
                            getFailed()
                            Firebase.buyerNotifications("orders")
                        })
                        .catch(error => {
                            Utils.handleError(error, "Error with status code : 20122")
                            setTimeout(() => setloading(false), 1000);
                        });
                }, 250);
            } else {
                setVisibilityDialog(false)
                Utils.alertPopUp('Ada kesalahan teknis, ulangi beberapa saat..')
                setloading(false)
            }
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 239 ~ handleReject ~ error", error)
            setloading(false)
        }
    }

    const handleNotifFirebase = (data, title, body) => {
        firebaseDatabase().ref("/people/" + data.uidCustomer).once('value')
            .then(snapshot => {
                let item = snapshot.val();
                if (item && item.notif) {
                    Firebase.notifChat(item.token, { body: body, title: title })
                    firebaseDatabase().ref(`/people/${data.uidCustomer}/notif`).update({ orders: item.notif.orders + 1, home: item.notif.home + 1 });
                } else {
                    firebaseDatabase().ref(`/people/${data.uidCustomer}/notif`).update({ home: 1, chat: 0, orders: 1 });
                }
            });
    }

    return (
        <View style={[Style.container, { backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null, width: '100%' }]}>
            {loading ? <Loading /> : null}
            <ScrollView nestedScrollEnabled={true} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {shimmer ? <Shimmer /> :
                    <>
                        {orderUnpaid && orderUnpaid.length ?
                            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', paddingHorizontal: '3%', paddingVertical: '2%', alignItems: 'center', backgroundColor: Colors.kuningWarning }}>
                                <View style={{ alignSelf: 'flex-start', flex: 0, paddingVertical: '1%', paddingHorizontal: '1%', borderRadius: 5, }}>
                                    <Text style={{ alignSelf: 'flex-start', flex: 0, fontSize: 12, color: Colors.blackgrayScale, fontFamily: 'Poppins-Italic' }}>Ada pesanan menunggu pembayaran cek</Text>
                                </View>
                                <TouchableOpacity onPress={() => setModalVisible(true)} style={{ alignSelf: 'flex-start', flex: 0, paddingVertical: '1%', paddingRight: '2%', borderRadius: 5, opacity: 0.8 }}>
                                    <Text style={{ alignSelf: 'flex-start', flex: 0, fontSize: 12, color: Colors.biruJaja, fontFamily: 'Poppins-Italic' }}>disini</Text>
                                </TouchableOpacity>
                            </View>
                            : null
                        }
                        {orders?.length ?
                            orders.map((item, idx) => {
                                if (!item.complain) {
                                    return (
                                        <View key={String(idx)} style={styles.card} >
                                            <View style={[Style.row_space, { flex: 0 }]}>
                                                <Text style={styles.textName}>{String(item.customerName).substr(0, 15)} - <Text style={styles.textDate}>{item.invoice}</Text></Text>
                                                <Text style={styles.textDate}>{item.status === "Belum Bayar" ? item.date.created_date : item.date.payment_date}</Text>
                                            </View>
                                            <View style={styles.bodyCard}>
                                                <View style={[styles.image, Style.mr_2]}>
                                                    <FastImage
                                                        style={styles.imageItem}
                                                        source={{ uri: item?.product?.image }}
                                                        resizeMode={FastImage.resizeMode.contain}
                                                    />
                                                </View>
                                                <View style={{ flex: 3, height: Wp('17%'), justifyContent: 'space-around', alignItems: 'flex-start', flexDirection: 'column' }}>
                                                    <Text style={[Style.font_13, { flex: 1 }]}>{item.product.name}</Text>
                                                    <Text style={[Style.font_12, { flex: 1, }]}>{item.totalOrderCurrencyFormat} {item.isHasDiscount ? <Text style={[Style.font_10, { textDecorationLine: 'line-through' }]}>{item.baseTotalOrderCurrencyFormat}</Text> : null}</Text>
                                                    <Text onPress={() => handlePress(item.invoice)} style={[Style.font_12, { color: Colors.biruJaja, flex: 1, }]}>{item.status}</Text>
                                                </View>
                                            </View>
                                            <View style={[Style.row_0_center, { paddingVertical: '2%', paddingHorizontal: '3%' }]}>
                                                <View style={[[Style.column, { flex: 1 }]]}>
                                                    {item.status === "Pesanan Baru" ?
                                                        <Text style={[Style.font_10, Style.row_end_center, { color: Colors.redPower, textAlign: 'left' }]}>Berakhir dalam {item.date.limitTerima ? item.date.limitTerima : null}</Text>
                                                        : null}
                                                    {item?.shipping?.country ?
                                                        <View style={[Style.row_start_center]}>
                                                            <Image style={{ height: Wp('4.5%'), width: Wp('4.5%'), tintColor: Colors.kuningJaja }} source={require('../../../icon/google-maps.png')} />
                                                            <Text style={Style.font_13}> {item.shipping.country}</Text>
                                                        </View>
                                                        : null}
                                                </View>
                                                {item.status === "Belum Bayar" ?
                                                    <TouchableOpacity onPress={() => handlePress(item.invoice)} style={styles.footerCard}>
                                                        <Text style={{ color: Colors.redPower, fontSize: 12, fontFamily: 'Poppins-Italic' }}>Menunggu Pembayaran</Text>
                                                    </TouchableOpacity>
                                                    :
                                                    <View style={Style.row_end_center}>
                                                        {item.status == "Pesanan Baru" ?
                                                            <>
                                                                <Button onPress={() => handleSubmit(item, "tolak")} mode="contained" style={{ width: Wp('25%'), marginRight: '2%' }} contentStyle={{ width: Wp('25%') }} color={Colors.redNotif} labelStyle={[Style.font_10, Style.semi_bold, { color: Colors.white }]}>Tolak</Button>
                                                                <Button onPress={() => handleSubmit(item, "terima")} mode="contained" style={{ width: Wp('25%'), zIndex: 100, }} contentStyle={{ width: Wp('25%') }} color={Colors.biruJaja} labelStyle={[Style.font_10, Style.semi_bold, { color: Colors.white }]}>Terima</Button>
                                                            </>
                                                            :
                                                            <Button onPress={() => item.status === "Dikirimkan" ? navigation.push('LacakPaket', { order: item }) : handlePress(item.invoice)} mode="contained" style={{ width: Wp('25%'), zIndex: 100, }} contentStyle={{ width: Wp('25%') }} color={item.status === "Perlu Dikirim" || item.status === "Dikirimkan" ? Colors.biruJaja : item.status === "Dibatalkan" ? Colors.biruJaja : Colors.biruJaja} labelStyle={[Style.font_10, Style.semi_bold, { color: Colors.white }]}>{item.status === "Perlu Dikirim" ? "Kirim" : item.status === "Dikirimkan" ? "Lihat" : "Lihat"}</Button>}
                                                    </View>}

                                            </View>
                                        </View>
                                    )
                                }
                            })
                            :
                            <View style={{ width: Wp('100%'), height: Hp('40%'), justifyContent: 'center', alignItems: 'center' }}>
                                <Text>Tidak ada data</Text>
                            </View>
                        }
                    </>
                }
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={visibilityDialog}
                    onRequestClose={() => {
                        setVisibilityDialog(false);
                    }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: Wp('100%'), height: Hp('100%'), backgroundColor: 'transparent', zIndex: 999 }}>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', width: Wp('90%'), height: Hp('45%'), backgroundColor: 'white', zIndex: 999, padding: '4%' }}>
                            <Text style={[Style.font_13, Style.semi_bold, { color: Colors.biruJaja }]}>Pilih alasan pembatalan untuk nomor pesanan {pesananDitolak.invoice}</Text>
                            <View style={[Style.row_start_center, { width: '100%' }]}>
                                <Checkbox
                                    color={Colors.biruJaja}
                                    status={checked == 1 ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setChecked(1);
                                        setalasanTolak('Toko sedang tidak beroperasi')

                                    }}
                                />
                                <Text style={[Style.font_13]}>Stok produk habis</Text>
                            </View>
                            <View style={[Style.row_start_center, { width: '100%' }]}>
                                <Checkbox
                                    color={Colors.biruJaja}
                                    status={checked == 2 ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setChecked(2);
                                        setalasanTolak('Toko sedang tidak beroperasi')

                                    }}
                                />
                                <Text style={[Style.font_13]}>Toko sedang tidak beroperasi</Text>
                            </View>
                            <View style={[Style.row_start_center, { width: '100%' }]}>
                                <Checkbox
                                    color={Colors.biruJaja}
                                    status={checked == 3 ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setChecked(3);
                                        setalasanTolak('')
                                    }}
                                />
                                <Text style={[Style.font_13]}>Lainnya</Text>
                            </View>
                            {checked === 3 ?
                                <TextInput value={alasanTolak} onChangeText={text => setalasanTolak(text)} placeholder="Alasan Tolak" numberOfLines={2} style={{ height: 45, marginTop: 10, borderWidth: 0.5, paddingHorizontal: 10, width: '100%' }} />
                                : null
                            }
                            {/* <Text style={style.font_14}>Alasan Tolak</Text> */}
                            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end', width: '100%' }}>
                                <TouchableOpacity onPress={() => { setVisibilityDialog(false), setalasanTolak("") }} style={{ backgroundColor: Colors.kuningJaja, paddingHorizontal: '2%', paddingVertical: '3%', borderRadius: 5, width: '30%' }}>
                                    <Text style={[Style.font_10, { color: 'white', fontFamily: 'Poppins-SemiBold', alignSelf: 'center' }]}>Kembali</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleReject()} style={{ backgroundColor: Colors.biruJaja, paddingHorizontal: '2%', paddingVertical: '3%', borderRadius: 5, width: '30%', marginLeft: '2%', }}>
                                    <Text style={[Style.font_10, { color: 'white', fontFamily: 'Poppins-SemiBold', alignSelf: 'center' }]}>Submit</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>
                <Dialog
                    animationType="fade"
                    visible={modalVisible}
                    title={pesananDitolak.invoice}
                    onTouchOutside={() => setModalVisible(false)}>
                    <View style={{ flex: 0, minHeight: Hp('40%'), maxHeight: Hp('80%') }}>
                        <Text style={{ fontSize: 14, color: Colors.blackgrayScale, fontFamily: 'Poppins-Italic', marginBottom: '7%' }}>Pesanan dengan status menunggu pembayaran</Text>
                        <Unpaid handleShowModal={() => setModalVisible(false)} />
                        <Button onPress={() => setModalVisible(false)} mode="contained" style={{ width: Wp('20%'), alignSelf: 'flex-end' }} contentStyle={{ width: Wp('20%') }} color={Colors.biruJaja} labelStyle={[Style.font_10, Style.semi_bold, { color: Colors.white }]}>Tutup</Button>
                    </View>
                </Dialog>
            </ScrollView >
        </View>
    )
}