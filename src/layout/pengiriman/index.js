import React, { useState, useEffect, createRef } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Image, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import { DataTable, Appbar, Checkbox, Switch } from 'react-native-paper';
import Warna from '../../config/Warna';
import Loading from '../../component/loading'
import * as Storage from '../../service/Storage'
import AwesomeAlert from 'react-native-awesome-alerts';
import style from '../../styles/style'
import SnackBar from 'react-native-snackbar-component'
import { useNavigation } from '@react-navigation/native'
import { Colors, Style } from '../../export';

export default function Pengiriman() {
    const navigation = useNavigation();
    const [shimmerRK, setshimmerRK] = useState(false);
    const [alertHapus, setAlertHapus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notif, setNotif] = useState(false);
    const [notifText, setNotifText] = useState("");
    const [id, setId] = useState("");
    const [showButton, setShowButton] = useState(false);
    const [ekspedisi, setEkspedisi] = useState([]);
    const [ekspedisiApi, setEkspedisiApi] = useState([]);


    useEffect(() => {
        setShowButton(false)
        setAlertHapus(false)
        setshimmerRK(true)
        getItem();
        setNotif(false)
    }, [])

    const getItem = async () => {
        try {
            let resp = await Storage.getIdToko();
            setId(resp)
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=gc40c9b784d0r664a8vm4ql6bn0apvvn");
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            fetch(`https://jsonx.jaja.id/core/seller/pengaturan/pengiriman?id_toko=${resp}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.status.code === 200) {
                        setshimmerRK(false)
                        setEkspedisi(result.data)
                        setEkspedisiApi(result.data)
                    }
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 46 ~ getIdToko ~ error", error)
        }
    }

    const handleSelect = (item, index) => {
        let array = []
        let data = ekspedisi[index];
        data.selected = !data.selected;
        ekspedisi.map((item, i) => {
            if (index == i) {
                array.push(data)
            } else {
                array.push(item)
            }
        })
        // setTimeout(() => {
        setEkspedisi(array)
        setShowButton(true)
        // }, 10);

    }

    const handleSimpan = async () => {
        setLoading(true)
        let credentials = [];
        ekspedisi.map(item => credentials.push({
            "kode_kurir": item.kode_kurir,
            "selected": item.selected
        }))
        setTimeout(() => {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "ci_session=putkddsbag6vv6m7a1d20e9tpdi5k02s");
            var raw = JSON.stringify({ "id_toko": id, "kurir": credentials });
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("https://jsonx.jaja.id/core/seller/pengaturan/pengiriman", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("🚀 ~ file: index.js ~ line 92 ~ setTimeout ~ result", result.status.code === 200)
                    if (result.status.code === 200) {
                        setNotifText("Pengriman anda berhasil disimpan!")
                        setLoading(false)
                        setShowButton(false)
                        getItem()
                        setTimeout(() => setNotif(true), 100);
                        setTimeout(() => setNotif(false), 2100);
                    } else {
                        setLoading(false)
                        setEkspedisi(ekspedisiApi)
                        setNotifText("Mohon maaf ada kesalahan teknis " + result)
                        setTimeout(() => setNotif(true), 100);
                        setTimeout(() => setNotif(false), 2100);

                    }
                })
                .catch(error => {
                    console.log("🚀 ~ file: index.js ~ line 110 ~ setTimeout ~ error", error)
                    setLoading(false)
                    setEkspedisi(ekspedisiApi)
                    setNotifText("Mohon periksa kembali koneksi internet anda atau ocoba lagi nanti" + result)
                    setTimeout(() => setNotif(true), 100);
                    setTimeout(() => setNotif(false), 2100);


                });
        }, 200);
    }

    const renderRow = ({ item, index }) => {
        return (
            <DataTable style={{ marginBottom: '2%', backgroundColor: 'white' }}>
                <DataTable.Header style={{ paddingVertical: Platform.OS === 'ios' ? '3%' : 0 }}>
                    <Text style={[Style.font_13, { textAlignVertical: 'center', width: '33%' }]}>Nama Ekspedisi</Text>
                    <Text style={[Style.font_13, { textAlignVertical: 'center', width: '50%' }]}>{item.kurir}</Text>
                    <DataTable.Cell numeric style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Switch
                            color={Warna.biruJaja}
                            value={item.selected ? true : false}
                            onValueChange={() => handleSelect(item, index)}
                        />
                    </DataTable.Cell>
                </DataTable.Header>
                <DataTable.Header style={{ paddingVertical: Platform.OS === 'ios' ? '3%' : 0 }}>
                    <Text style={[Style.font_13, { textAlignVertical: 'center', width: '33%' }]}>Tipe</Text>
                    <Text style={[Style.font_13, { textAlignVertical: 'center', width: '50%' }]}>{item.jenis_kurir}</Text>
                    <DataTable.Cell>
                    </DataTable.Cell>
                </DataTable.Header>
            </DataTable >
        );
    };

    return (
        <SafeAreaView style={[Style.container, { backgroundColor: Platform.OS === 'ios' ? Colors.biruJaja : null }]}>
            <SnackBar autoHidingTime={1000} messageStyle={{ fontFamily: 'Poppins-SemiBold' }} messageColor={Warna.white} backgroundColor={Warna.biruJaja} visible={notif} bottom={0} position="bottom" textMessage={notifText} actionHandler={() => { console.log("snackbar button clicked!") }} />
            {loading ? <Loading /> : null}
            <View style={{ flex: 1, backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }}>
                {/* <SnackBar autoHidingTime={2000} messageStyle={{ fontFamily: 'Poppins-SemiBold' }} messageColor="#454545" backgroundColor="#f0e68c" visible={notif} top={0} position="top" textMessage={notifText} actionHandler={() => { console.log("snackbar button clicked!") }} /> */}
                <View style={[style.appBar, { zIndex: -999, }]}>
                    <View style={style.row_start_center}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image style={style.appBarIcon} source={require('../../icon/arrow.png')} />
                        </TouchableOpacity>
                        <Text style={style.appBarText}>Pengiriman</Text>
                    </View>
                    {showButton ?
                        <TouchableOpacity onPress={() => handleSimpan()} style={style.row_end_center}>
                            <Text style={style.appBarButton}>SIMPAN</Text>
                        </TouchableOpacity> : null}
                </View>
                {shimmerRK === true ?
                    <View style={[Style.column]}>
                        <ShimmerPlaceHolder
                            LinearGradient={LinearGradient}
                            style={{ borderRadius: 2, width: '100%', height: '16.5%', alignSelf: 'center', marginBottom: '2%' }}
                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']} />
                        <ShimmerPlaceHolder
                            LinearGradient={LinearGradient}
                            style={{ borderRadius: 2, width: '100%', height: '16.5%', alignSelf: 'center', marginBottom: '3%' }}
                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']} />
                        <ShimmerPlaceHolder
                            LinearGradient={LinearGradient}
                            style={{ borderRadius: 2, width: '100%', height: '16.5%', alignSelf: 'center', marginBottom: '3%' }}
                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']} />
                        <ShimmerPlaceHolder
                            LinearGradient={LinearGradient}
                            style={{ borderRadius: 2, width: '100%', height: '16.5%', alignSelf: 'center', marginBottom: '3%' }}
                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']} />

                    </View>
                    : ekspedisi.length !== 0 ?
                        <FlatList
                            // extraData={ekspedisi}
                            data={ekspedisi}
                            renderItem={renderRow}
                            keyExtractor={item => item?.id_data} />
                        : <View style={{ flex: 1, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: 'grey' }}>Tidak ada data</Text></View>
                }
                <AwesomeAlert alertContainerStyle={styles.alertContainerStyle} overlayStyle={{ backgroundColor: 'white', opacity: 0 }}
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
                // confirmButtonColor="#DD6B55" onCancelPressed={() => setAlertHapus(false)} onConfirmPressed={() => handleDelete()}
                />
            </View>
        </SafeAreaView >
    )
}
