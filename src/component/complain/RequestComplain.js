import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, Settings, TextInput, Alert, Modal, ToastAndroid, StatusBar } from 'react-native'
import { Button, Checkbox } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { Style, Colors, Wp, Hp, Utils, Firebase } from '../../export'
import Collapsible from 'react-native-collapsible';
import VideoPlayer from 'react-native-video-player';
import Swiper from 'react-native-swiper'
import firebaseDatabase from '@react-native-firebase/database';
export default function RequestComplain() {
    const complainDetails = useSelector(state => state.complain.complainDetails)
    const complainStep = useSelector(state => state.complain.complainStep)
    const orderInvoice = useSelector(state => state.orders.orderInvoice)
    const orderUid = useSelector(state => state.orders.orderUid)
    const realNotif = useSelector(state => state.dashboard.notifikasi)
    const target = useSelector(state => state.notification.target)

    const dispatch = useDispatch()
    const refScrolView = useRef()
    const [collapsForm, setCollapsForm] = useState(true)
    const [resiSeller, setResiSeller] = useState('')
    const [checked, setChecked] = useState('');
    const [modalConfirm, setModalConfirm] = useState(false);
    const [alasanTolak, setAlasanTolak] = useState('');
    const [modal, setModal] = useState(false);
    const [statusBar, setStatusBar] = useState(Colors.biruJaja);

    useEffect(() => {

    }, [])

    const handleSolution = () => {
        Alert.alert(
            `${checked == "refund" ? "Pengembalian Dana" : checked == "change" ? "Tukar Barang" : checked === "complete" ? 'Lengkapi Barang' : checked === "delivery" ? "Masalah Pengiriman" : ""}`,
            "Setelah anda memilih, solusi tidak dapat diubah",
            [
                {
                    text: "Batal",
                    onPress: () => console.log(checked),
                    style: "cancel",
                },
                {
                    text: "Pilih",
                    onPress: () => {
                        var myHeaders = new Headers();
                        myHeaders.append("Cookie", "ci_session=baigr5juu7sdhf8f8s882cvs311g7mg0");

                        var requestOptions = {
                            method: 'GET',
                            headers: myHeaders,
                            redirect: 'follow'
                        };

                        fetch(`https://jsonx.jaja.id/core/seller/order/solusiKomplain?invoice=${orderInvoice}&solusi=${checked}&catatan_solusi=checked`, requestOptions)
                            .then(response => response.json())
                            .then(result => {
                                if (result.status.code == 200) {
                                    ToastAndroid.show('Solusi berhasil dipilih!', ToastAndroid.LONG, ToastAndroid.TOP)
                                    getItem()
                                } else {
                                    Utils.handleErrorResponse(result, 'Error with status code : 12030')
                                }
                            })
                            .catch(error => Utils.handleError(error, "Error with status code : 12031"));
                    },
                    style: "default",
                },
            ],
            {
                cancelable: true,
            }
        );
    }
    const handleConfirm = async (val) => {
        console.log("🚀 ~ file: RequestComplain.js ~ line 83 ~ handleConfirm ~ modalConfirm", modalConfirm)
        if (alasanTolak && String(alasanTolak).length > 5) {
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=haimvak8880qrbbeleojeao0e60a5eds");
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            await fetch(`https://jsonx.jaja.id/core/seller/order/confirmKomplain?invoice=${orderInvoice}&status=${val}&catatan_solusi=${alasanTolak}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.status.code === 200) {
                        ToastAndroid.show('Komplain berhasil disetujui!', ToastAndroid.LONG, ToastAndroid.TOP)
                        if (modalConfirm === 'completed') {
                            dispatch({ type: 'SET_COMPLAIN_UPDATE', payload: true })
                        }
                        // if (val === 'completed') {
                        //     ToastAndroid.show('Solusi berhasil dipilih!', ToastAndroid.LONG, ToastAndroid.TOP)
                        //     Firebase.notifChat(item.token, { body: 'Komplain kamu telah direspon penjual.', title: 'Komplain Pesanan' })
                        // }
                    } else {
                        Utils.handleErrorResponse(result, 'Error with status code : 120030')
                    }
                })
                .catch(error => Utils.handleError(error, "Error with status code : 120031"));

            if (modalConfirm === 'confirmed') {
                fetch(`https://jsonx.jaja.id/core/seller/order/solusiKomplain?invoice=${orderInvoice}&solusi=${checked}&catatan_solusi=checked`, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        if (result.status.code == 200) {
                            ToastAndroid.show('Solusi berhasil dipilih!', ToastAndroid.LONG, ToastAndroid.TOP)
                            // Firebase.notifChat(item.token, { body: 'Komplain kamu telah direspon penjual.', title: 'Komplain Pesanan' })
                            dispatch({ type: 'SET_COMPLAIN_UPDATE', payload: true })
                            setModalConfirm(null)

                        } else {
                            Utils.handleErrorResponse(result, 'Error with status code : 12003')
                        }
                    })
                    .catch(error => Utils.handleError(error, "Error with status code : 12001"));
            }
            firebaseDatabase().ref(`/people/${orderUid}notif`).update({ order: realNotif.orders + 1 });
        } else {
            ToastAndroid.show('Catatan solusi terlalu pendek!', ToastAndroid.LONG, ToastAndroid.TOP)
        }
    }


    return (
        <View style={[Style.container]}>
            <StatusBar
                translucent={false}
                animated={true}
                backgroundColor={statusBar}
                barStyle='default'
                showHideTransition="fade"
            />
            <ScrollView
                style={[Style.container, { backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }]}
                contentContainerStyle={Style.pt_2} ref={refScrolView}>
                {complainDetails && Object.keys(complainDetails).length ?
                    <View style={Style.container}>
                        {/* <View style={[Style.column, Style.py_2, Style.px_4, Style.mb_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                            <Text style={[Style.font_13]}>Pembeli telah mengajukan komplain terhadap pesanannya, cek bukti yang dikirim pembeli dibawah ini :</Text>
                        </View> */}
                        <View style={[Style.column, Style.py_2, Style.px_3, Style.mb_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                            <Text style={[Style.font_13]}>Pastikan anda meresponnya sebelum {String(complainDetails.complain_limit).slice(0, 16)}, sistem akan otomatis merefund dana pembeli bila tidak ada respon dari penjual selama waktu yang ditentukan.</Text>
                        </View>
                        <View style={[Style.column, Style.p_3, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                            <Text style={[Style.font_13, Style.medium, Style.my, { color: Colors.blackgrayScale }]}>Alasan Komplain</Text>
                            <Text numberOfLines={25} style={[Style.font_13, Style.mt]}>{complainDetails.jenis_komplain ? complainDetails.jenis_komplain + ' - ' : ''}{complainDetails.judul_komplain ? complainDetails.judul_komplain + ' - ' : ''}{complainDetails.komplain}</Text>
                            <Text style={[Style.font_13, Style.medium, Style.mt_3, Style.mb]}>Bukti komplain</Text>
                            <View style={[Style.row]}>
                                {!complainDetails.gambar1 && !complainDetails.gambar2 && !complainDetails.gambar3 ?
                                    <View style={Style.column}>
                                        <Text style={[Style.font_13, Style.light]}>- 0 Foto dilampirkan</Text>
                                        <Text style={[Style.font_13, Style.light]}>- 0 Video dilampirkan</Text>
                                    </View>
                                    : null
                                }
                                {complainDetails.gambar1 ?
                                    <TouchableOpacity onPress={() => setModal(true) & setStatusBar(Colors.black)} style={Style.my_2}>
                                        <Image style={{ width: Wp('18%'), height: Wp('18%'), marginRight: 18, borderRadius: 4, backgroundColor: Colors.blackGrey }} source={{ uri: complainDetails.gambar1 }} />
                                    </TouchableOpacity>

                                    : null
                                }
                                {complainDetails.gambar2 ?
                                    <TouchableOpacity onPress={() => setModal(true) & setStatusBar(Colors.black)} style={Style.my_2}>
                                        <Image style={{ width: Wp('18%'), height: Wp('18%'), marginRight: 18, borderRadius: 4, backgroundColor: Colors.blackGrey }} source={{ uri: complainDetails.gambar2 }} />
                                    </TouchableOpacity>
                                    : null
                                }
                                {complainDetails.gambar3 ?
                                    <TouchableOpacity onPress={() => setModal(true) & setStatusBar(Colors.black)} style={Style.my_2}>
                                        <Image style={{ width: Wp('18%'), height: Wp('18%'), marginRight: 18, borderRadius: 4, backgroundColor: Colors.blackGrey }} source={{ uri: complainDetails.gambar3 }} />
                                    </TouchableOpacity>
                                    : null
                                }
                                {complainDetails.video ?
                                    <TouchableOpacity onPress={() => setModal(true) & setStatusBar(Colors.black)} style={[Style.row_0_center, Style.my_2, { width: Wp('18%'), height: Wp('18%'), backgroundColor: Colors.black, borderRadius: 4 }]}>
                                        <Image style={{ width: '35%', height: '35%', tintColor: Colors.white, alignSelf: 'center' }} source={require('../../icon/play.png')} />
                                    </TouchableOpacity>
                                    :
                                    null

                                }
                            </View>
                            <Text style={[Style.font_13, Style.medium, Style.mt_3, Style.mb]}>Produk dikomplain</Text>
                            <View style={[Style.row_start_center, { width: '100%' }]}>
                                <Image style={{ width: Wp('18%'), height: Wp('18%'), borderRadius: 4, backgroundColor: Colors.blackgrayScale }}
                                    resizeMethod={"scale"}
                                    resizeMode="cover"
                                    source={{ uri: complainDetails.product[0].image }}
                                />
                                <View style={[Style.column_between_center, { marginTop: '-1%', alignItems: 'flex-start', height: Wp('18%'), width: Wp('82%'), paddingHorizontal: '3%' }]}>
                                    <View style={Style.column}>
                                        <Text numberOfLines={1} style={[Style.font_13, { width: '90%' }]}>{complainDetails.product[0].name}</Text>
                                        <Text numberOfLines={1} style={[Style.font_11, Style.light, { marginTop: '-1%' }]}>{complainDetails.product[0].variasi ? complainDetails.product[0].variasi : ""}</Text>
                                    </View>
                                    <View style={[Style.row_between_center, { width: '90%' }]}>
                                        {complainDetails.totalOtherProduct ?
                                            <Text numberOfLines={1} style={[Style.font_13, Style.light]}>{complainDetails.totalOtherProduct ? "+(" + complainDetails.totalOtherProduct + " produk lainnya)" : ""}</Text>
                                            : null
                                        }
                                        <Text numberOfLines={1} style={[Style.font_13]}>{complainDetails.totalPriceCurrencyFormat}</Text>
                                    </View>
                                </View>
                            </View>

                        </View>

                        {complainDetails.solusi !== "completed" ?
                            <View style={[Style.column, Style.pt_2, Style.pb_5, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                <View style={Style.row_between_center}>
                                    <Text style={[Style.font_13, Style.medium]}>No.Invoice</Text>
                                    <Text style={[Style.font_13]}>{complainDetails.invoice}</Text>
                                </View>
                                <View style={Style.row_between_center}>
                                    <Text style={[Style.font_13, Style.T_light]}>Tanggal Pengajuan</Text>
                                    <Text style={[Style.font_13]}>{String(complainDetails.created_date).slice(0, 16)}</Text>
                                </View>
                                <View style={Style.row_between_center}>
                                    <Text style={[Style.font_13, Style.T_light]}>Batas Waktu</Text>
                                    <Text style={[Style.font_13]}>{String(complainDetails.complain_limit).slice(0, 16)}</Text>
                                </View>
                                {/* <Text style={[Style.font_13]}>Dengan menekan tombol <Text style={[Style.semi_bold]}>TERIMA</Text> berarti penjual menyetujui komplain ini, dan melanjutkan ke tahap selanjutnya.</Text>
                                <Text style={[Style.font_13]}>Dan dengan menekan tombol <Text style={[Style.semi_bold]}>TOLAK</Text> berarti penjual tidak menyetujui (bukti tidak menguatkan atau tidak memenuhi persyaratan) komplain dari pembeli.</Text> */}
                                <View style={[Style.row_between_center, Style.mt_5]}>
                                    <Button onPress={() => setModalConfirm('confirmed')} mode="contained" labelStyle={[Style.font_13, Style.semi_bold, { color: Colors.white }]} style={{ width: '49%' }} color={Colors.biruJaja}>
                                        Terima
                                    </Button>
                                    <Button onPress={() => setModalConfirm('completed')} mode="contained" labelStyle={[Style.font_13, Style.semi_bold, { color: Colors.white }]} style={{ width: '49%' }} color={Colors.redNotif}>
                                        Tolak
                                    </Button>
                                </View>
                            </View>

                            : complainDetails.catatan_solusi ?
                                <View style={[Style.column, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                    <Text style={[Style.font_13]}>Komplain anda tolak dengan alasan: {complainDetails.catatan_solusi}</Text>
                                </View>
                                : null
                        }

                    </View>
                    : null
                }

            </ScrollView >
            <Modal transparent={true} visible={modalConfirm ? true : false} animationType='fade' >
                <View style={{ width: Wp('100%'), height: Hp('100%'), justifyContent: 'center', alignItems: 'center' }}>
                    <View style={[Style.column, { width: Wp('90%'), height: modalConfirm === 'confirmed' ? Wp('95%') : Wp('45%'), backgroundColor: Colors.white, elevation: 11, zIndex: 999, borderRadius: 7 }]}>
                        <View style={[Style.column_0_start, Style.p_4, { flex: 1 }]}>
                            {modalConfirm === 'confirmed' ?
                                <>
                                    <Text style={[Style.font_14, Style.semi_bold, Style.mb_5, { color: Colors.biruJaja }]}>Konfirmasi Komplain</Text>
                                    <Text style={[Style.font_13, Style.mb_3]}>Pilih solusi dibawah ini untuk menyelesaikan komplain: </Text>
                                    <View style={[Style.row_start_center]}>
                                        <Checkbox
                                            disabled={complainDetails.solusi ? true : false}
                                            color={Colors.biruJaja}
                                            status={checked == "refund" ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setChecked('refund');
                                            }}
                                        />
                                        <Text style={[Style.font_13]}>Pengembalian Uang</Text>
                                    </View>
                                    <View style={[Style.row_start_center]}>
                                        <Checkbox
                                            disabled={complainDetails.solusi ? true : false}
                                            color={Colors.biruJaja}
                                            status={checked == "change" ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setChecked('change');
                                            }}
                                        />
                                        <Text style={[Style.font_13]}>Tukar Barang</Text>
                                    </View>
                                    <View style={[Style.row_start_center]}>
                                        <Checkbox
                                            disabled={complainDetails.solusi ? true : false}
                                            color={Colors.biruJaja}
                                            status={checked == "lengkapi" ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setChecked('lengkapi');
                                            }}
                                        />
                                        <Text style={[Style.font_13]}>Lengkapi Barang</Text>
                                    </View>
                                    <Text style={[Style.font_13, Style.mt_3]}>Catatan untuk pembeli :</Text>
                                    <TextInput
                                        maxLength={500}
                                        // value={etalaseSelected}
                                        onChangeText={text => {
                                            setAlasanTolak(text)
                                            console.log(text.length)
                                        }}
                                        style={[Style.font_13, Style.pt, Style.pl, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver, width: '100%', paddingBottom: 0 }]}
                                    />
                                </>
                                :
                                <>
                                    <Text style={[Style.font_14, Style.semi_bold, Style.mb_5, { color: Colors.biruJaja }]}>Tolak Komplain</Text>

                                    <Text style={[Style.font_13]}>Masukkan alasan tolak</Text>
                                    <TextInput
                                        maxLength={500}
                                        // value={etalaseSelected}
                                        onChangeText={text => {
                                            setAlasanTolak(text)
                                            console.log(text.length)
                                        }}
                                        style={[Style.font_13, Style.pt, Style.pl, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver, width: '100%', paddingBottom: 0 }]}
                                    />
                                </>

                            }
                        </View>
                        <View style={[Style.row_0_end, Style.p_2, { alignItems: 'flex-end', width: '100%', }]}>
                            <Button mode="text" onPress={() => setModalConfirm(null)} labelStyle={[Style.font_13, Style.semi_bold]} style={{ height: '100%', width: '30%' }} color={Colors.kuningJaja}>
                                Batal
                            </Button>
                            <Button mode="text" onPress={() => {
                                handleConfirm(modalConfirm)
                            }}
                                labelStyle={[Style.font_13, Style.semi_bold]} style={{ height: '100%', width: '45%' }} color={Colors.biruJaja}>
                                Konfirmasi
                            </Button>
                        </View>
                    </View>
                </View >
            </Modal >
            <Modal
                animationType="fade"
                transparent={true}
                visible={modal}
                onRequestClose={() => {
                    setModal(!modal);
                    setStatusBar(Colors.biruJaja)
                }}>
                <View style={{ flex: 1, width: Wp('100%'), height: Hp('100%'), backgroundColor: Colors.black, zIndex: 999 }}>
                    {complainDetails && Object.keys(complainDetails).length ?
                        <Swiper style={Style.wrapper} showsButtons={true}>
                            {complainDetails.gambar1 ?
                                <View style={[Style.row_center]}>
                                    <Image style={{ width: Wp('100%'), height: Hp('100%'), resizeMode: 'contain' }} source={{ uri: complainDetails.gambar1 }} />
                                </View> : null
                            }
                            {complainDetails.gambar2 ?
                                <View style={[Style.row_center]}>
                                    <Image style={{ width: Wp('100%'), height: Hp('100%'), resizeMode: 'contain' }} source={{ uri: complainDetails.gambar2 }} />
                                </View> : null
                            }
                            {complainDetails.gambar3 ?
                                <View style={[Style.row_center]}>
                                    <Image style={{ width: Wp('100%'), height: Hp('100%'), resizeMode: 'contain' }} source={{ uri: complainDetails.gambar3 }} />
                                </View> : null
                            }
                            {complainDetails.video ?
                                <View style={[Style.row_center]}>
                                    <VideoPlayer
                                        video={{ uri: complainDetails.video }}
                                        resizeMode="cover"
                                        style={{ width: Wp('100%'), height: Hp('100%') }}
                                        disableFullscreen={false}
                                        fullScreenOnLongPress={true}
                                    />
                                </View>
                                : null
                            }
                        </Swiper>
                        : null
                    }
                </View>
            </Modal >
        </View >
    )
}
