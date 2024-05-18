import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, Image, TextInput, ScrollView, StatusBar, TouchableOpacity, Modal, Alert, StyleSheet, Linking, ToastAndroid, Platform } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { Style, Appbar, Colors, Wp, Hp, Utils } from '../../../export'
import { Button, Checkbox } from 'react-native-paper';
import { useSelector } from 'react-redux';
import VideoPlayer from 'react-native-video-player';
import Swiper from 'react-native-swiper'
import style from '../../../styles/style';


export default function Complain() {
    const reduxOrderDetail = useSelector(state => state.orders.orderDetail)
    const reduxUser = useSelector(state => state.user)

    const [statusBar, setStatusBar] = useState(Colors.biruJaja);

    const [details, setDetails] = useState("")
    const [checked, setChecked] = useState('');
    const [modal, setModal] = useState(false)

    const [disabled, setDisabled] = useState(false)
    const [solusiTest, setSolusiTest] = useState(null)
    const [statusTest, setstatusTest] = useState('request')
    const [resiBuyerTest, setResiBuyer] = useState("")
    const [resiSellerTest, setResiSeller] = useState("")
    const [formResiSeller, setFormResiSeller] = useState("")

    const [alasanTolak, setalasanTolak] = useState("")
    const [alasanTolakKomplain, setalasanTolakKomplain] = useState("")

    const [rejectModal, setrejectModal] = useState(false)
    const [rejectComplain, setRejectComplain] = useState(false)

    const [acceptModal, setacceptModal] = useState(false)

    const [detailSolution] = useState({
        refund: `1. Pembeli harus mengirim barang ke alamat penjual yang tertera, menggunakan jasa kurir terdekat.
        \n2. Pembeli harus memasukkan nomor resi pengiriman di form yang sudah disediakan, sebagai bukti pengiriman.
        \n3. Setelah penjual menerima produk dengan menekan tombol TERIMA BARANG, uang akan di kembalikan ke rekening pembeli.
        \n4. Apabila barang yang dikembalikan pembeli tidak sesuai dengan persyaratan pengembalian barang, penjual bisa menolak kembali beserta alasannya.
        \n5. Apabila nomor 4 terjadi, jual harus mengirim kembali barang tersebut ke pembeli beserta nomor resi pengiriman.
        `,
        change: `1. Pembeli harus mengirim barang ke alamat penjual yang tertera, menggunakan jasa kurir terdekat.
        \n2. Pembeli harus memasukkan nomor resi pengiriman di form yang sudah disediakan, sebagai bukti pengiriman.
        \n3. Setelah penjual menerima barang, penjual harus mengirim kembali sesuai produk yang dipesan.
        \n4. Apabila barang yang dikembalikan pembeli tidak sesuai dengan persyaratan pengembalian barang, penjual bisa menolak kembali beserta alasannya dan harus mengirim kembali barang tersebut ke pembeli.
        \n5. Penjual harus memasukkan nomor resi pengiriman di form yang sudah disediakan, sebagai bukti pengiriman (saat menukar atau mengembalikan barang).
        \n7. Proses komplain selesai, bila pembeli sudah menerima barang.
        `,
        complete: `1. Penjual harus mengirim kembali produk yang kurang sesuai alamat pembeli.
        \n2. Penjual harus memasukkan nomor resi pengiriman di form yang sudah disediakan, sebagai bukti pengiriman.
        \n3. Setelah pembeli menerima produk, proses komplain selesai.
        `,
        delivery: `1. Penjual harus menghubungi jasa kurir terkait.`,
    })

    useEffect(() => {
        if (reduxUser && Object.keys(reduxUser).length) {
            getItem()
        }

    }, [])

    const getItem = () => {
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=gtrkoupbvif5d7v2miftk5169juji2ln");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://jsonx.jaja.id/core/seller/order/complainDetailSeller?invoice=${reduxOrderDetail.invoice}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200) {
                    if (Object.keys(result.data[0]).length) {
                        let data = result.data[0];
                        console.log("🚀 ~ file: Complain.js ~ line 77 ~ getItem ~ data", data)
                        setDetails(data)
                        setstatusTest(data.status)
                        setSolusiTest(data.solusi == "lengkapi" ? 'complete' : data.solusi)
                        // refund,change, lengkapi, tolak
                        setalasanTolak(data.alasan_tolak_by_seller)
                        setResiBuyer(data.resi_customer)
                        setResiSeller(data.resi_seller)
                        setSolusiTest(data.solusi)
                        if (data.solusi) {
                            setDisabled(true)
                            setChecked(data.solusi == "lengkapi" ? 'complete' : data.solusi)
                            console.log("masuk sisni")
                        } else {
                            setDisabled(false)
                        }
                    }
                } else {
                    Utils.handleErrorResponse(result, 'Error with status code : 12032')
                }
            })
            .catch(error => Utils.handleError(error, "Error with status code : 12033"));
    }

    const handleConfirm = (val, alasanText) => {
        if (val === 'completed' && !alasanText) {
            setRejectComplain(true)
            console.log("masuk sini")
        } else {
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=haimvak8880qrbbeleojeao0e60a5eds");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`https://jsonx.jaja.id/core/seller/order/confirmKomplain?invoice=${reduxOrderDetail.invoice}&status=${val}&catatan_solusi=${alasanText}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.status.code === 200) {
                        getItem()
                        ToastAndroid.show('Kompain berhasil disetujui!', ToastAndroid.LONG, ToastAndroid.TOP)

                    } else {
                        Utils.handleErrorResponse(result, 'Erro with status code : 120030')
                    }
                    setRejectComplain(false)
                })
                .catch(error => Utils.handleError(error, "Error with status code : 12031"));
        }

    }

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

                        fetch(`https://jsonx.jaja.id/core/seller/order/solusiKomplain?invoice=${reduxOrderDetail.invoice}&solusi=${checked}&catatan_solusi=checked`, requestOptions)
                            .then(response => response.json())
                            .then(result => {
                                if (result.status.code == 200) {
                                    ToastAndroid.show('Solusi berhasil dipilih!', ToastAndroid.LONG, ToastAndroid.TOP)
                                    getItem()
                                    setDisabled(true)
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

    const handleDelivery = val => {
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=v8grl59qmhpli6favlsm776dh7h16hlo");
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        if (val === 'accept') {
            fetch(`https://jsonx.jaja.id/core/seller/order/terimaBarangBySeller?invoice=${reduxOrderDetail.invoice}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("🚀 ~ file: Complain.js ~ line 153 ~ Complain ~ result", result)
                    if (result.status.code == 200) {
                        getItem()
                        ToastAndroid.show('Barang berhasil diterima!', ToastAndroid.LONG, ToastAndroid.TOP)
                    } else {
                        Utils.handleErrorResponse(result, 'Error with status code : 12034')
                    }
                    setacceptModal(false)
                })
                .catch(error => Utils.handleError(error, "Error with status code : 12035"));
        } else {
            fetch(`https://jsonx.jaja.id/core/seller/order/tolakBarangBySeller?invoice=${reduxOrderDetail.invoice}&tolak_by_seller=${alasanTolak}`, requestOptions)
                .then(response => response.text())
                .then(result => {
                    console.log("🚀 ~ file: Complain.js ~ line 202 ~ Complain ~ result", result)
                    console.log("🚀 ~ file: Complain.js ~ line 191 ~ Complain ~ result", result)
                    if (result.status.code == 200) {
                        ToastAndroid.show('Pesanan berhasil kamu tolak!', ToastAndroid.LONG, ToastAndroid.TOP)

                        setrejectModal(false)
                    } else {
                        Utils.handleErrorResponse(result, 'Error with status code : 12034')
                    }
                })
                .catch(error => Utils.handleError(error, "Error with status code : 12037"));
        }
    }

    const handleReceiptNumber = () => {
        setResiSeller(formResiSeller)
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=413t9ua3p3g9ghfu26j3oju1pelo673p");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://jsonx.jaja.id/core/seller/order/inputResiSeller?invoice=${reduxOrderDetail.invoice}&resi_seller=${formResiSeller}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("🚀 ~ file: ResponseComplainScreen.js ~ line 94 ~ ResponseComplain ~ result", result)
                if (result.status.code == 200) {
                    ToastAndroid.show('Resi berhasil dikirimd!', ToastAndroid.LONG, ToastAndroid.TOP)
                    getItem()
                } else {
                    Utils.handleErrorResponse(result, 'Error with status code : 12036')
                }
            })
            .catch(error => Utils.handleError(error, "Error wth status code : 12037"));
    }

    return (
        <SafeAreaView style={Style.container}>
            <StatusBar
                translucent={false}
                animated={true}
                backgroundColor={statusBar}
                barStyle='default'
                showHideTransition="fade"
            />
            <Appbar back={true} title="Komplain Pesanan" />
            <View style={{ flex: 1, backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }}>
                <ScrollView>
                    {details ?
                        <View style={[Style.column_center, Style.p_3]}>
                            <View style={[Style.column, Style.py_2, Style.px_4, Style.mb_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                <Text style={[Style.font_13]}>Pembeli telah mengajukan komplain terhadap pesanannya, cek bukti yang dikirim pembeli dibawah ini :</Text>
                            </View>
                            <View style={[Style.column, Style.py_2, Style.px_4, Style.mb_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                <Text style={[Style.font_13]}>Pastikan anda meresponnya sebelum {details.created_date}, sitem akan otomatis merefund dana pembeli bila tidak ada respon dari penjual selama waktu yang ditentukan.</Text>
                            </View>
                            <View style={[Style.column, Style.p_4, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                <Text style={[Style.font_13, Style.medium, Style.my]}>Detail komplain</Text>
                                <View style={[Style.column, Style.px_2]}>
                                    <Text numberOfLines={1} style={[Style.font_13, Style.mt]}>Status Komplain  : <Text style={{ color: statusTest === "request" ? Colors.kuningJaja : statusTest == "completed" ? Colors.greenSuccess : Colors.biruJaja }}>{statusTest === "request" ? "Menunggu Konfirmasi" : statusTest == "sendback" ? 'Sedang Dikirim' : statusTest == "delivered" ? 'Pesanan Diterima' : statusTest == "completed" ? "Komplain Selesai" : 'Dikonfirmasi'}</Text></Text>

                                    <Text numberOfLines={3} style={[Style.font_13, Style.mt]}>Jenis Komplain    : {details.jenis_komplain} - {details.judul_komplain}</Text>
                                    <Text numberOfLines={25} style={[Style.font_13, Style.mt]}>Alasan Komplain : {details.komplain}</Text>
                                </View>
                                <Text style={[Style.font_13, Style.medium, Style.mt_3, Style.mb]}>Produk dikomplain</Text>
                                <View style={[Style.row_start_center, { width: '100%', height: Wp('17%') }]}>
                                    <Image style={{ width: Wp('15%'), height: Wp('15%'), borderRadius: 5, backgroundColor: Colors.BlackGrey }}
                                        resizeMethod={"scale"}
                                        resizeMode="cover"
                                        source={{ uri: details.product[0].image }}
                                    />
                                    <View style={[Style.column_between_center, { marginTop: '-1%', alignItems: 'flex-start', height: Wp('15%'), width: Wp('82%'), paddingHorizontal: '3%' }]}>
                                        <Text numberOfLines={1} style={[Style.font_13, Style.medium, { width: '90%' }]}>{details.product[0].name}</Text>
                                        <Text numberOfLines={1} style={[Style.font_12, { color: Colors.blackgrayScale }]}>{details.product[0].variasi ? details.product[0].variasi : ""}</Text>
                                        <View style={[Style.row_between_center, { width: '90%' }]}>
                                            <Text numberOfLines={1} style={[Style.font_13, Style.light]}>{details.totalOtherProduct ? "+(" + details.totalOtherProduct + " produk lainnya)" : ""}asas</Text>
                                            <Text numberOfLines={1} style={[Style.font_13, Style.semi_bold, { color: Colors.biruJaja, }]}>{details.totalPriceCurrencyFormat}</Text>
                                        </View>
                                    </View>
                                </View>

                                <Text style={[Style.font_13, Style.medium, Style.mt_3, Style.mb]}>Bukti komplain</Text>
                                <View style={[Style.row, Style.px_2]}>
                                    {!details.gambar1 && !details.gambar2 && !details.gambar3 ?
                                        <View style={style.column}>
                                            <Text style={[style.font_13, style.light]}>- 0 Foto dilampirkan</Text>
                                            <Text style={[style.font_13, style.light]}>- 0 Video dilampirkan</Text>
                                        </View>
                                        : null
                                    }
                                    {details.gambar1 ?
                                        <TouchableOpacity onPress={() => setModal(true) & setStatusBar(Colors.black)} style={Style.my_2}>
                                            <Image style={{ width: Wp('18%'), height: Wp('18%'), marginRight: 15, backgroundColor: Colors.blackGrey }} source={{ uri: details.gambar1 }} />
                                        </TouchableOpacity>

                                        : null
                                    }
                                    {details.gambar2 ?
                                        <TouchableOpacity onPress={() => setModal(true) & setStatusBar(Colors.black)} style={Style.my_2}>
                                            <Image style={{ width: Wp('18%'), height: Wp('18%'), marginRight: 15, backgroundColor: Colors.blackGrey }} source={{ uri: details.gambar2 }} />
                                        </TouchableOpacity>
                                        : null
                                    }
                                    {details.gambar3 ?
                                        <TouchableOpacity onPress={() => setModal(true) & setStatusBar(Colors.black)} style={Style.my_2}>
                                            <Image style={{ width: Wp('18%'), height: Wp('18%'), marginRight: 15, backgroundColor: Colors.blackGrey }} source={{ uri: details.gambar3 }} />
                                        </TouchableOpacity>
                                        : null
                                    }
                                    {details.video ?
                                        <TouchableOpacity onPress={() => setModal(true) & setStatusBar(Colors.black)} style={[Style.row_0_center, Style.my_2, { width: Wp('18%'), height: Wp('18%'), backgroundColor: Colors.black }]}>
                                            <Image style={{ width: '35%', height: '35%', tintColor: Colors.white, alignSelf: 'center' }} source={require('../../../icon/play.png')} />
                                        </TouchableOpacity>
                                        :
                                        null
                                    }
                                </View>
                            </View>

                            {statusTest !== "completed" ?
                                <View style={[Style.column, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                    <Text style={[Style.font_13]}>Dengan menekan tombol TERIMA berarti penjual menyetujui komplain ini, dan melanjutkan ke tahap selanjutnya.</Text>
                                    <Text style={[Style.font_13]}>Dan dengan menekan tombol TOLAK berarti penjual tidak menyetujui (bukti tidak menguatkan atau tidak memenuhi persyaratan) komplain dari pembeli</Text>
                                </View>
                                : details.catatan_solusi ?
                                    <View style={[Style.column, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                        <Text style={[Style.font_13]}>Komplain anda tolak dengan alasan : {details.catatan_solusi}</Text>
                                    </View>
                                    : null
                            }

                            {statusTest === 'request' ?
                                <View style={[Style.row_between_center, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                                    <Button onPress={() => handleConfirm('confirmed', null)} mode="contained" labelStyle={[style.font_13, style.semi_bold, { color: Colors.white }]} style={{ width: '49%' }} color={Colors.biruJaja}>
                                        Terima
                                    </Button>
                                    <Button onPress={() => handleConfirm('completed', null)} mode="contained" labelStyle={[style.font_13, style.semi_bold, { color: Colors.white }]} style={{ width: '49%' }} color={Colors.redNotif}>
                                        Tolak
                                    </Button>
                                </View>
                                : statusTest !== 'completed' ?
                                    <View style={[Style.row_between_center, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                                        <Text style={[Style.font_13, { color: Colors.biruJaja }]}>Komplain berhasil dikonfirmasi.</Text>
                                    </View> : null
                            }
                            {checked && statusTest !== 'request' && solusiTest !== "tolak" ?
                                <View style={[Style.column, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                                    <Text style={[Style.font_13, Style.mb_2]}>Prosedur {checked == "refund" ? "Pengembalian Dana" : checked == "change" ? "Tukar Barang" : checked === "complete" ? 'Lengkapi Barang' : ""} : </Text>
                                    {checked === "refund" ?
                                        <Text style={[Style.font_12]}>{detailSolution.refund}</Text>
                                        : checked === "change" ?
                                            <Text style={[Style.font_12]}>{detailSolution.change}</Text>
                                            : checked === "complete" ?
                                                <Text style={[Style.font_12]}>{detailSolution.complete}</Text>
                                                : checked === "delivery" ?
                                                    <View style={Style.column}>
                                                        <Text style={[Style.font_12]}>{detailSolution.delivery}</Text>
                                                        <Text style={[Style.font_12]}> - Informasi customer service JNE klik <Text onPress={() => Linking.openURL('https://www.jne.co.id/id/hubungi-kami/our-information')} style={[Style.font_13, { color: Colors.biruJaja }]}>disini</Text></Text>
                                                        <Text style={[Style.font_12]}> - Informasi customer service SICEPAT klik <Text onPress={() => Linking.openURL('https://www.sicepat.com/contactus')} style={[Style.font_13, { color: Colors.biruJaja }]}>disini</Text></Text>
                                                        <Text style={[Style.font_12]}>{`\n`}2. Komplain selesai apabila pembeli menerima pesanan atau paling lambat 3X24 jam.</Text>
                                                    </View>
                                                    : null
                                    }
                                </View>
                                : null
                            }
                            {statusTest !== 'request' && solusiTest !== 'tolak' ?
                                <View style={[Style.column, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                                    <Text style={[Style.font_13]}>Pilih solusi dibawah ini untuk menyelesaikan komplain : </Text>
                                    <View style={[style.row_start_center]}>
                                        <Checkbox
                                            disabled={disabled}
                                            color={Colors.biruJaja}
                                            status={checked == "refund" ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setChecked('refund');
                                            }}
                                        />
                                        <Text style={[Style.font_13]}>Pengembalian Uang</Text>
                                    </View>
                                    <View style={[style.row_start_center]}>
                                        <Checkbox
                                            disabled={disabled}
                                            color={Colors.biruJaja}
                                            status={checked == "change" ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setChecked('change');
                                            }}
                                        />
                                        <Text style={[Style.font_13]}>Tukar Barang</Text>
                                    </View>
                                    <View style={[style.row_start_center]}>
                                        <Checkbox
                                            disabled={disabled}
                                            color={Colors.biruJaja}
                                            status={checked == "complete" ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setChecked('complete');
                                            }}
                                        />
                                        <Text style={[Style.font_13]}>Lengkapi Barang</Text>
                                    </View>
                                    <View style={[style.row_start_center]}>
                                        <Checkbox
                                            disabled={disabled}
                                            color={Colors.biruJaja}
                                            status={checked == "delivery" ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setChecked('delivery');
                                            }}
                                        />
                                        <Text style={[Style.font_13]}>Masalah Pengiriman</Text>
                                    </View>
                                    {!disabled ?
                                        <View style={[Style.row_0_end, { width: '100%' }]}>
                                            <Button onPress={handleSolution} color={Colors.biruJaja} mode="contained" style={{ width: '40%' }} labelStyle={[Style.font_12, Style.medium, { color: Colors.white }]}>
                                                Pilih solusi
                                            </Button>
                                        </View>
                                        : null
                                    }
                                </View>
                                : null
                            }

                            {solusiTest === 'refund' ?
                                <View style={[Style.column, { width: '100%' }]}>
                                    {resiBuyerTest ?
                                        <>
                                            <View style={[Style.column, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                                <Text style={[Style.font_13]}>Nomor resi pengiriman dari pembeli : {resiBuyerTest}</Text>
                                            </View>
                                            {!alasanTolak ?
                                                statusTest === 'completed' ?
                                                    alasanTolak ?
                                                        <View style={[Style.column, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                                                            <Text style={[Style.font_13]}>Pesanan anda tolak, dengan alasan : {alasanTolak}</Text>
                                                        </View>
                                                        :
                                                        <View style={[Style.column, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                                                            <Text style={[Style.font_13]}>Paket telah anda terima, proses komplain selesai, sistem akan merefund otomatis bila pembeli sudah menginput rekening</Text>
                                                        </View>
                                                    :
                                                    <View style={[Style.column, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                                                        <Button onPress={() => setacceptModal(true)} mode="contained" labelStyle={[style.font_13, style.semi_bold, { color: Colors.white }]} style={{ width: '100%', marginBottom: '2%' }} color={Colors.biruJaja}>
                                                            Terima Pesanan
                                                        </Button>
                                                        <Button onPress={() => {
                                                            console.log("masuk sini")
                                                        }} mode="contained" labelStyle={[style.font_13, style.semi_bold, { color: Colors.white }]} style={{ width: '100%' }} color={Colors.kuningJaja}>
                                                            Tolak Pesanan
                                                        </Button>
                                                    </View>
                                                : null
                                            }
                                        </>
                                        : null
                                    }

                                </View>
                                : null
                            }

                            {solusiTest === 'change' ?
                                <View style={[Style.column, { width: '100%' }]}>
                                    {resiBuyerTest ?
                                        <>
                                            <View style={[Style.column, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                                <Text style={[Style.font_13]}>Nomor resi pengiriman dari pembeli : {resiBuyerTest}</Text>
                                            </View>
                                            {alasanTolak ?
                                                null
                                                :
                                                resiBuyerTest && statusTest !== 'delivered' && statusTest !== 'completed' && statusTest !== 'sendback' ?
                                                    <View style={[Style.column, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                                                        <Button onPress={() => setacceptModal(true)} mode="contained" labelStyle={[style.font_13, style.semi_bold, { color: Colors.white }]} style={{ width: '100%', marginBottom: '2%' }} color={Colors.biruJaja}>
                                                            Terima Pesanan
                                                        </Button>
                                                        <Button onPress={() => setrejectModal(true)} mode="contained" labelStyle={[style.font_13, style.semi_bold, { color: Colors.white }]} style={{ width: '100%' }} color={Colors.kuningJaja}>
                                                            Tolak Pesanan
                                                        </Button>
                                                    </View>
                                                    :
                                                    resiSellerTest ?
                                                        <>
                                                            <View style={[Style.column, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                                                                <Text style={[Style.font_13]}>Paket telah anda terima</Text>
                                                            </View>
                                                            <View style={[Style.column, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                                                                <Text style={[Style.font_13]}>Nomor resi pengiriman anda : {resiSellerTest}</Text>
                                                            </View>
                                                            {statusTest === 'completed' ?
                                                                <View style={[Style.column, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                                                    <Text style={[Style.font_13]}>Paket telah diterima, proses komplain selesai</Text>
                                                                </View>
                                                                : null
                                                            }
                                                        </>
                                                        :
                                                        <View style={[Style.column, Style.py_2, Style.px_4, Style.my_2, Style.T_medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                                                            <Text style={[Style.font_13, Style.mb]}>Masukkan resi pengiriman anda disini :</Text>
                                                            <View style={[Style.row_between_center, { width: '100%' }]}>
                                                                <TextInput maxLength={25} style={[Style.font_13, { borderWidth: 0.5, borderColor: Colors.silver, borderRadius: 5, width: '65%', paddingVertical: '2%', paddingHorizontal: '3%' }]} placeholder="Nomor resi pengiriman" onChangeText={(text) => {
                                                                    console.log("🚀 ~ file: Complain.js ~ line 498 ~ Complain ~ text", text)
                                                                    setFormResiSeller(text)
                                                                }} value={resiSellerTest} />
                                                                <Button onPress={handleReceiptNumber} mode="contained" color={Colors.biruJaja} style={{ width: '30%' }} labelStyle={[Style.font_13, Style.semi_bold, { color: Colors.white }]}>KirimM</Button>
                                                            </View>
                                                        </View>

                                            }
                                        </>
                                        : null
                                    }

                                </View>
                                : null
                            }

                            {solusiTest === 'complete' ?
                                resiSellerTest ?
                                    <>
                                        < View style={[Style.column, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                                            <Text style={[Style.font_13]}>Nomor resi pengiriman anda : {resiSellerTest}</Text>
                                        </View>
                                        {statusTest === 'completed' ?
                                            <View style={[Style.column, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                                <Text style={[Style.font_13]}>Paket telah diterima, proses komplain selesai</Text>
                                            </View>
                                            : null
                                        }
                                    </>
                                    :
                                    <View style={[Style.column, Style.py_2, Style.px_4, Style.my_2, Style.T_medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                                        <Text style={[Style.font_13, Style.mb]}>Masukkan resi pengiriman anda disini :</Text>
                                        <View style={[Style.row_between_center, { width: '100%' }]}>
                                            <TextInput maxLength={25} style={[Style.font_13, { borderWidth: 0.5, borderColor: Colors.silver, borderRadius: 5, width: '65%', paddingVertical: '2%', paddingHorizontal: '3%' }]} placeholder="Nomor resi pengiriman" onChangeText={(text) => setResiSeller(text)} value={resiSellerTest} />
                                            <Button onPress={handleReceiptNumber} mode="contained" color={Colors.biruJaja} style={{ width: '30%' }} labelStyle={[Style.font_13, Style.semi_bold, { color: Colors.white }]}>Kirim</Button>
                                        </View>
                                    </View>
                                : null}

                            {alasanTolak ?
                                <>
                                    <View style={[Style.column, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                                        <Text style={[Style.font_13]}>Pesanan anda tolak, dengan alasan : {alasanTolak}</Text>
                                    </View>
                                    {solusiTest !== 'tolak' ?
                                        <>
                                            {resiSellerTest ?
                                                <>
                                                    <View style={[Style.column, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                                                        <Text style={[Style.font_13]}>Nomor resi pengiriman anda : {resiSellerTest}</Text>
                                                    </View>
                                                    {statusTest === 'completed' ?
                                                        <View style={[Style.column, Style.py_2, Style.px_4, Style.mt_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                                            <Text style={[Style.font_13]}>Paket telah diterima, proses komplain selesai</Text>
                                                        </View>
                                                        : null
                                                    }
                                                </>
                                                :
                                                <View style={[Style.column, Style.py_2, Style.px_4, Style.my_2, Style.T_medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }]}>
                                                    <Text style={[Style.font_13, Style.mb]}>Masukkan resi pengiriman anda disini :</Text>
                                                    <View style={[Style.row_between_center, { width: '100%' }]}>
                                                        <TextInput maxLength={25} style={[Style.font_13, { borderWidth: 0.5, borderColor: Colors.silver, borderRadius: 5, width: '65%', paddingVertical: '2%', paddingHorizontal: '3%' }]} placeholder="Nomor resi pengiriman" onChangeText={(text) => setResiSeller(text)} value={resiSellerTest} />
                                                        <Button onPress={!handleReceiptNumber} mode="contained" color={Colors.biruJaja} style={{ width: '30%' }} labelStyle={[Style.font_13, Style.semi_bold, { color: Colors.white }]}>Kirim</Button>
                                                    </View>
                                                </View>
                                            }
                                        </>
                                        : null}
                                </>
                                : null
                            }
                        </View >
                        : null
                    }
                </ScrollView >
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={acceptModal}
                    onRequestClose={() => {
                        setacceptModal(!acceptModal);
                    }}>
                    <View style={{ width: Wp('100%'), height: Hp('100%'), zIndex: 999, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={[Style.column_0_center, { width: Wp('90%'), height: Wp('50%'), backgroundColor: Colors.white, elevation: 11, borderRadius: 5 }]}>
                            <View style={[Style.column_0_start, Style.p_4, { width: '100%', height: '80%' }]}>
                                {/* <Text style={[Style.font_18, Style.medium, Style.mb_2]}>Tolak Produk</Text> */}
                                <Text style={[Style.font_16, Style.medium, Style.mb_5]}>Anda yakin sudah menerima produk ini?</Text>
                                <Text style={[Style.font_14, Style.mt_3]}>Setelah anda menekan terima, saldo akan dikembalikan ke pembeli</Text>
                            </View>
                            <View style={[Style.row_0_end, { alignItems: 'flex-end', width: '100%' }]}>
                                <Button onPress={() => setacceptModal(false)} mode="text" labelStyle={[style.font_13, style.semi_bold]} style={{ height: '100%', width: '30%' }} color={Colors.kuningJaja}>
                                    Batal
                                </Button>
                                <Button onPress={() => handleDelivery('accept')} mode="text" labelStyle={[style.font_13, style.semi_bold]} style={{ height: '100%', width: '30%', marginLeft: '2%' }} color={Colors.biruJaja}>
                                    Terima
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={rejectModal}
                    onRequestClose={() => {
                        setrejectModal(!rejectModal);
                    }}>
                    <View style={{ width: Wp('100%'), height: Hp('100%'), zIndex: 999, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={[Style.column_0_center, { width: Wp('90%'), height: Wp('55%'), backgroundColor: Colors.white, elevation: 11, borderRadius: 5 }]}>
                            <View style={[Style.column_0_start, Style.p_4, { width: '100%', height: '80%' }]}>
                                {/* <Text style={[Style.font_18, Style.medium, Style.mb_2]}>Tolak Produk</Text> */}
                                <Text style={[Style.font_16, Style.medium, Style.mb_5]}>Anda yakin ingin menolak produk ini?</Text>
                                <Text style={[Style.font_14, Style.mt_3]}>Masukkan alasan tolak</Text>
                                <TextInput
                                    placeholder="Alasan tolak"
                                    value={alasanTolak}
                                    maxLength={500}
                                    onChangeText={text => setalasanTolak(text)}
                                    style={[Style.font_13, { borderBottomWidth: 0.5, borderBottomColor: Colors.blackgrayScales, width: '100%' }]}
                                />
                            </View>
                            <View style={[Style.row_0_end, { alignItems: 'flex-end', width: '100%' }]}>
                                <Button onPress={() => setrejectModal(false)} mode="text" labelStyle={[style.font_13, style.semi_bold]} style={{ height: '100%', width: '30%' }} color={Colors.kuningJaja}>
                                    Batal
                                </Button>
                                <Button onPress={() => handleDelivery('denied')} mode="text" labelStyle={[style.font_13, style.semi_bold]} style={{ height: '100%', width: '30%', marginLeft: '2%' }} color={Colors.biruJaja}>
                                    Tolak
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={rejectComplain}
                    onRequestClose={() => {
                        setRejectComplain(!rejectComplain);
                    }}>
                    <View style={{ width: Wp('100%'), height: Hp('100%'), zIndex: 999, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={[Style.column_0_center, { width: Wp('90%'), height: Wp('55%'), backgroundColor: Colors.white, elevation: 11, borderRadius: 5 }]}>
                            <View style={[Style.column_0_start, Style.p_4, { width: '100%', height: '80%' }]}>
                                {/* <Text style={[Style.font_18, Style.medium, Style.mb_2]}>Tolak Produk</Text> */}
                                <Text style={[Style.font_16, Style.medium, Style.mb_5]}>Anda yakin ingin menolak komplain ini?</Text>
                                <Text style={[Style.font_14, Style.mt_3]}>Masukkan alasan tolak</Text>
                                <TextInput
                                    placeholder="Alasan tolak"
                                    value={alasanTolakKomplain}
                                    maxLength={500}
                                    onChangeText={text => setalasanTolakKomplain(text)}
                                    style={[Style.font_13, { borderBottomWidth: 0.5, borderBottomColor: Colors.blackgrayScales, width: '100%' }]}
                                />
                            </View>
                            <View style={[Style.row_0_end, { alignItems: 'flex-end', width: '100%' }]}>
                                <Button onPress={() => setRejectComplain(false)} mode="text" labelStyle={[style.font_13, style.semi_bold]} style={{ height: '100%', width: '30%' }} color={Colors.kuningJaja}>
                                    Batal
                                </Button>
                                <Button onPress={() => handleConfirm('completed', alasanTolakKomplain)} mode="text" labelStyle={[style.font_13, style.semi_bold]} style={{ height: '100%', width: '30%', marginLeft: '2%' }} color={Colors.biruJaja}>
                                    Tolak
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modal}
                    onRequestClose={() => {
                        setModal(!modal);
                        setStatusBar(Colors.biruJaja)
                    }}>
                    <View style={{ flex: 1, width: Wp('100%'), height: Hp('100%'), backgroundColor: Colors.black, zIndex: 999 }}>
                        {details ?
                            <Swiper style={styles.wrapper} showsButtons={true}>
                                {details.gambar1 ?
                                    <View style={[style.row_center]}>
                                        <Image style={{ width: Wp('100%'), height: Hp('100%'), resizeMode: 'contain' }} source={{ uri: details.gambar1 }} />
                                    </View> : null
                                }
                                {details.gambar2 ?
                                    <View style={[style.row_center]}>
                                        <Image style={{ width: Wp('100%'), height: Hp('100%'), resizeMode: 'contain' }} source={{ uri: details.gambar2 }} />
                                    </View> : null
                                }
                                {details.gambar3 ?
                                    <View style={[style.row_center]}>
                                        <Image style={{ width: Wp('100%'), height: Hp('100%'), resizeMode: 'contain' }} source={{ uri: details.gambar3 }} />
                                    </View> : null
                                }
                                {details.video ?
                                    <View style={[style.row_center]}>
                                        <VideoPlayer
                                            video={{ uri: details.video }}
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
            </View>
        </SafeAreaView >
    )
}
const styles = StyleSheet.create({
    wrapper: {},
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontFamily: 'Poppins-SemiBold'
    }
})