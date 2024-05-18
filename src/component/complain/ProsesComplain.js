import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Modal, TextInput, ToastAndroid } from 'react-native'
import { Button } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux'
import { Style, Colors, Wp, Hp, Utils, } from '../../export'
import * as Firebase from '../../service/Firebase'

export default function ProsesComplain() {
    const dispatch = useDispatch()
    const complainDetails = useSelector(state => state.complain.complainDetails)
    const complainStep = useSelector(state => state.complain.complainStep)
    const orderInvoice = useSelector(state => state.orders.orderInvoice)
    const complainTarget = useSelector(state => state.complain.complainTarget)
    const seller = useSelector(state => state.user.seller)

    const [collapsForm, setCollapsForm] = useState(true)
    const [resiSeller, setResiSeller] = useState('')
    const [checked, setChecked] = useState('');
    const [modalRefund, setModalRefund] = useState(false);
    const [alasanTolak, setAlasanTolak] = useState('');
    const [modalChange, setModalChange] = useState(false);


    const handleConfirm = (name) => {
        let valid = true
        if (modalChange) {
            setModalChange(false)
            if (!alasanTolak && modalChange == 'second') {
                valid = false
                ToastAndroid.show('Alasan tolak tidak boleh kosong!', ToastAndroid.LONG, ToastAndroid.TOP)
            } else if (!resiSeller) {
                valid = false
                ToastAndroid.show('Nomor resi tidak boleh kosong!', ToastAndroid.LONG, ToastAndroid.TOP)
            }
        }

        if (valid) {
            setModalRefund(null)
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=v8grl59qmhpli6favlsm776dh7h16hlo");
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            if (name === 'first') {
                handleNotif()
                fetch(`https://jsonx.jaja.id/core/seller/order/terimaBarangBySeller?invoice=${orderInvoice}`, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        console.log("🚀 ~ file: Complain.js ~ line 153 ~ Complain ~ result", result)
                        if (result.status.code == 200) {
                            Utils.alertPopUp('Barang berhasil diterima!')
                            fetch(`https://jsonx.jaja.id/core/seller/order/inputResiSeller?invoice=${orderInvoice}&resi_seller=${resiSeller}`, requestOptions)
                                .then(response => response.json())
                                .then(rslt => {
                                    console.log("🚀 ~ file: ResponseComplainScreen.js ~ line 94 ~ ResponseComplain ~ rslt", rslt)
                                    if (rslt.status.code == 200) {
                                        Utils.alertPopUp('Resi berhasil dikirim!')
                                        dispatch({ type: 'SET_COMPLAIN_UPDATE', payload: true })
                                    } else {
                                        Utils.handleErrorResponse(rslt, 'Error with status code : 12036')
                                    }
                                })
                                .catch(error => Utils.handleError(error, "Error wth status code : 12037"));
                        } else {
                            Utils.handleErrorResponse(result, 'Error with status code : 12034')
                        }

                    })
                    .catch(error => Utils.handleError(error, "Error with status code : 12035"));
            } else {
                fetch(`https://jsonx.jaja.id/core/seller/order/tolakBarangBySeller?invoice=${orderInvoice}&tolak_by_seller=${alasanTolak}`, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        console.log("🚀 ~ file: Complain.js ~ line 191 ~ Complain ~ result", result)
                        if (result.status.code == 200) {
                            ToastAndroid.show('Pesanan berhasil kamu tolak!', ToastAndroid.LONG, ToastAndroid.TOP)
                            fetch(`https://jsonx.jaja.id/core/seller/order/inputResiSeller?invoice=${orderInvoice}&resi_seller=${resiSeller}`, requestOptions)
                                .then(response => response.json())
                                .then(rslt => {
                                    console.log("🚀 ~ file: ResponseComplainScreen.js ~ line 94 ~ ResponseComplain ~ rslt", rslt)
                                    if (rslt.status.code == 200) {
                                        ToastAndroid.show('Resi berhasil dikirim!', ToastAndroid.LONG, ToastAndroid.TOP)
                                        dispatch({ type: 'SET_COMPLAIN_UPDATE', payload: true })
                                    } else {
                                        Utils.handleErrorResponse(rslt, 'Error with status code : 12036')
                                    }
                                })
                                .catch(error => Utils.handleError(error, "Error wth status code : 12037"));
                        } else {
                            Utils.handleErrorResponse(rslt, 'Error with status code : 12034')
                        }
                    })
                    .catch(error => Utils.handleError(error, "Error with status code : 12037"));
            }
        }

    }

    const handleNotif = () => {
        console.log("🚀 ~ file: ProsesComplain.js ~ line 13 ~ ProsesComplain ~ complainTarget", complainTarget)
        Firebase.notifChat(complainTarget, { body: 'Komplain pesanan kamu telah diproses.', title: seller.nama_toko })

    }

    return (
        <View style={Style.container}>
            <ScrollView
                style={[Style.container, { backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }]}
                contentContainerStyle={Style.pt_2} >
                <View style={[Style.row_between_center, Style.py_2, Style.px_4, Style.mb_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                    <Text style={[Style.font_13]}>No. Resi : </Text>
                    <Text style={[Style.font_13, Style.medium]}>{complainDetails.resi_customer}</Text>
                </View>
                <View style={[Style.column, Style.py_2, Style.px_4, Style.mb_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                    <Text style={[Style.font_13, Style.mb_2]}>Setelah barang sampai, penjual harus memeriksa barang terlebih dahulu sebelum menekan tombol <Text style={[Style.semi_bold]}>TERIMA</Text>{complainDetails.solusi == 'refund' ? ',\n' : complainDetails.solusi == 'change' ? ', dan masukan nomor resi di bawah ini sebagai bukti pengiriman bahwa penjual sudah mengirim kembali' : null}</Text>
                    <Text style={[Style.font_13]}>Dan bila barang yang dikembalikan tidak sesuai dengan syarat ketentuan pengembalian barang, penjual berhak menekan tombol <Text style={[Style.semi_bold]}>TOLAK </Text>beserta alasannya,{'\n'}dan harus mengirimkan kembali barang tersebut ke pembeli dengan menginput resi pengiriman sebagai bukti</Text>
                    <View style={[Style.row_between_center, Style.mt_5]}>
                        <Button onPress={() => complainDetails.solusi == 'refund' ? setModalRefund('second') : setModalChange('second')} mode="contained" labelStyle={[Style.font_13, Style.semi_bold, { color: Colors.white }]} style={{ width: '49%' }} color={Colors.redNotif}>
                            Tolak
                        </Button>
                        <Button onPress={() => complainDetails.solusi == 'refund' ? setModalRefund('first') : setModalChange('first')} mode="contained" labelStyle={[Style.font_13, Style.semi_bold, { color: Colors.white }]} style={{ width: '49%' }} color={Colors.biruJaja}>
                            Terima
                        </Button>
                    </View>
                </View>
            </ScrollView >
            <Modal transparent={true} visible={modalRefund ? true : false} animationType='fade' >
                <View style={{ width: Wp('100%'), height: Hp('100%'), justifyContent: 'center', alignItems: 'center' }}>
                    <View style={[Style.column, { width: Wp('90%'), height: modalRefund === 'first' ? Wp('45%') : Wp('65%'), backgroundColor: Colors.white, elevation: 11, zIndex: 999, borderRadius: 7 }]}>
                        <View style={[Style.column_0_start, Style.p_4, { flex: 1 }]}>
                            {modalRefund === 'second' ?
                                <>
                                    <Text style={[Style.font_14, Style.semi_bold, Style.mb_5, { color: Colors.biruJaja }]}>Tolak Komplain</Text>
                                    <Text style={[Style.font_13]}>Masukkan alasan tolak</Text>
                                    <TextInput
                                        maxLength={500}
                                        value={alasanTolak}
                                        onChangeText={text => {
                                            setAlasanTolak(text)
                                        }}
                                        style={[Style.font_13, Style.pt, Style.pl, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver, width: '100%', paddingBottom: 0 }]}
                                    />
                                    <Text style={[Style.font_13, Style.mt_5,]}>Masukkan resi pengiriman</Text>
                                    <TextInput
                                        maxLength={500}
                                        value={resiSeller}
                                        onChangeText={text => {
                                            setResiSeller(text)
                                            console.log(text.length)
                                        }}
                                        style={[Style.font_13, Style.pt, Style.pl, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver, width: '100%', paddingBottom: 0 }]}
                                    />
                                </>
                                :
                                <>
                                    <Text style={[Style.font_14, Style.semi_bold, Style.mb_5, { color: Colors.biruJaja }]}>Konfirmasi Komplain</Text>
                                    <Text style={Style.font_13}>Dengan menekan KONFIRMASI, saldo akan dikembalikan ke pembeli dan proses komplain selesai.</Text>
                                </>
                            }
                        </View>
                        <View style={[Style.row_0_end, Style.p_2, { alignItems: 'flex-end', width: '100%', }]}>
                            <Button mode="text" onPress={() => setModalRefund(null)} labelStyle={[Style.font_13, Style.semi_bold]} style={{ height: '100%', width: '30%' }} color={Colors.kuningJaja}>
                                Batal
                            </Button>
                            <Button mode="text" onPress={() => {
                                handleConfirm(modalRefund)
                            }} labelStyle={[Style.font_13, Style.semi_bold]} style={{ height: '100%', width: '45%' }} color={Colors.biruJaja}>
                                Konfirmasi
                            </Button>
                        </View>
                    </View>
                </View >
            </Modal >
            <Modal transparent={true} visible={modalChange ? true : false} animationType='fade' >
                <View style={{ width: Wp('100%'), height: Hp('100%'), justifyContent: 'center', alignItems: 'center' }}>
                    <View style={[Style.column, { width: Wp('90%'), height: modalChange === 'first' ? Wp('45%') : Wp('65%'), backgroundColor: Colors.white, elevation: 11, zIndex: 999, borderRadius: 7 }]}>
                        {modalChange === 'second' ?
                            <View style={[Style.column_0_start, Style.p_4, { flex: 1 }]}>
                                <Text style={[Style.font_14, Style.semi_bold, Style.mb_5, { color: Colors.biruJaja }]}>Tolak Komplain</Text>
                                <Text style={[Style.font_13]}>Masukkan alasan tolak</Text>
                                <TextInput
                                    maxLength={500}
                                    value={alasanTolak}
                                    onChangeText={text => {
                                        setAlasanTolak(text)
                                    }}
                                    style={[Style.font_13, Style.pt, Style.pl, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver, width: '100%', paddingBottom: 0 }]}
                                />
                                <Text style={[Style.font_13, Style.mt_5,]}>Masukkan resi pengiriman</Text>
                                <TextInput
                                    maxLength={500}
                                    value={resiSeller}
                                    onChangeText={text => {
                                        setResiSeller(text)
                                        console.log(text.length)
                                    }}
                                    style={[Style.font_13, Style.pt, Style.pl, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver, width: '100%', paddingBottom: 0 }]}
                                />
                            </View>
                            :
                            <View style={[Style.column_0_start, Style.p_4, { flex: 1 }]}>
                                <Text style={[Style.font_14, Style.semi_bold, Style.mb_5, { color: Colors.biruJaja }]}>Terima Barang</Text>
                                <Text style={[Style.font_13,]}>Masukkan resi pengiriman</Text>
                                <TextInput
                                    maxLength={500}
                                    value={resiSeller}
                                    onChangeText={text => {
                                        setResiSeller(text)
                                    }}
                                    style={[Style.font_13, Style.pt, Style.pl, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver, width: '100%', paddingBottom: 0 }]}
                                />
                            </View>
                        }
                        <View style={[Style.row_0_end, Style.p_2, { alignItems: 'flex-end', width: '100%', }]}>
                            <Button mode="text" onPress={() => setModalChange(null)} labelStyle={[Style.font_13, Style.semi_bold]} style={{ height: '100%', width: '30%' }} color={Colors.kuningJaja}>
                                Batal
                            </Button>
                            <Button mode="text" onPress={() => handleConfirm(modalChange)}

                                labelStyle={[Style.font_13, Style.semi_bold]} style={{ height: '100%', width: '45%' }} color={Colors.biruJaja}>
                                Konfirmasi
                            </Button>
                        </View>
                    </View>
                </View >
            </Modal >
        </View >
    )
}
