import React, { useEffect, useState, } from 'react'
import { View, Text, ScrollView, TextInput, ToastAndroid } from 'react-native'
import { Button } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux'
import { Style, Colors, Wp, Hp, Utils } from '../../export'
export default function WaitingDelivery() {
    const dispatch = useDispatch()
    const complainDetails = useSelector(state => state.complain.complainDetails)
    console.log("🚀 ~ file: WaitingDelivery.js ~ line 9 ~ WaitingDelivery ~ complainDetails", complainDetails)
    const complainStep = useSelector(state => state.complain.complainStep)
    const orderInvoice = useSelector(state => state.orders.orderInvoice)
    console.log("🚀 ~ file: WaitingDelivery.js ~ line 11 ~ WaitingDelivery ~ orderInvoice", orderInvoice)

    const [collapsForm, setCollapsForm] = useState(true)
    const [resiSeller, setResiSeller] = useState('')
    const [checked, setChecked] = useState('');
    const [modalConfirm, setModalConfirm] = useState(false);
    const [alasanTolak, setAlasanTolak] = useState('');


    const handleReceiptNumber = () => {
        if (String(resiSeller).length > 5) {
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=413t9ua3p3g9ghfu26j3oju1pelo673p");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`https://jsonx.jaja.id/core/seller/order/inputResiSeller?invoice=${orderInvoice}&resi_seller=${resiSeller}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("🚀 ~ file: ResponseComplainScreen.js ~ line 94 ~ ResponseComplain ~ result", result)
                    if (result.status.code == 200) {
                        ToastAndroid.show('Resi berhasil dikirim!', ToastAndroid.LONG, ToastAndroid.TOP)
                        dispatch({ type: 'SET_COMPLAIN_UPDATE', payload: true })
                    } else {
                        Utils.handleErrorResponse(result, 'Error with status code : 12036')
                    }
                })
                .catch(error => Utils.handleError(error, "Error wth status code : 12037"));
        } else {
            ToastAndroid.show('Masukkan resi dengan benar!', ToastAndroid.LONG, ToastAndroid.TOP)
        }
    }

    return (
        <View style={Style.container}>
            <ScrollView
                style={[Style.container, { backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }]}
                contentContainerStyle={Style.pt_2} >

                <View style={[Style.column, Style.py_2, Style.px_4, Style.mb_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                    <Text style={[Style.font_13]}>Komplain berhasil dikonfirmasi menggunakan solusi <Text style={[Style.font_13, Style.medium]}>{complainDetails.solusi == 'refund' ? 'Pengembalian Dana' : complainDetails.solusi == 'change' ? 'Tukar Barang' : 'Lengkapi Barang'}</Text></Text>
                </View>
                {complainDetails.solusi !== 'lengkapi' ?
                    <View style={[Style.column, Style.py_2, Style.px_4, Style.mb_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                        <Text style={[Style.font_13, Style.mb_3]}>Harap menunggu pembeli mengisi resi pengiriman</Text>

                        <Text style={[Style.font_13, Style.mb]}>Note: </Text>
                        <Text style={[Style.font_13, Style.mb]}>1. Pembeli harus mengirim barang terkait </Text>
                        <Text style={[Style.font_13, Style.mb]}>2. Pembeli bisa menggunakan jasa pengiriman terdekatnya untuk mengirim barang</Text>
                        <Text style={[Style.font_13, Style.mb]}>3. Setelah pembeli mengirim barang, pembeli harus menginput resi pengiriman di halaman detail komplain sebagai bukti</Text>
                    </View>
                    :
                    <>

                        <View style={[Style.column, Style.py_2, Style.px_4, Style.mb_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                            <Text style={[Style.font_13, Style.mb_3]}>Prosedur yang harus dilakukan penjual saat ini:</Text>
                            <Text style={[Style.font_13, Style.mb]}>1. Penjual harus mengirim barang yang kurang </Text>
                            <Text style={[Style.font_13, Style.mb]}>2. Penjual harus mengisi resi pengiriman diform bawah ini</Text>
                        </View>
                        <View style={[Style.column, Style.py_2, Style.px_4, Style.my_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                            <Text style={[Style.font_13, Style.mb]}>Masukkan resi pengiriman anda disini :</Text>
                            <View style={[Style.row_between_center, { width: '100%' }]}>
                                <TextInput style={[Style.font_13, { borderWidth: 0.5, borderColor: Colors.blackGrey, borderRadius: 5, width: '65%', paddingVertical: '2%', paddingHorizontal: '3%' }]} placeholder="Nomor resi pengiriman" onChangeText={(text) => setResiSeller(text)} value={resiSeller} />
                                <Button onPress={handleReceiptNumber} mode="contained" color={Colors.biruJaja} style={{ width: '30%' }} labelStyle={[Style.font_13, Style.semi_bold, { color: Colors.white }]}>Kirim</Button>
                            </View>
                        </View>
                    </>
                }
            </ScrollView >
        </View >
    )
}
