import React, { useState, useEffect, createRef } from 'react'
import { View, Text, ScrollView, FlatList, StyleSheet, TouchableOpacity, TextInput, SafeAreaView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import { IconButton, DataTable, Button } from 'react-native-paper';
import Warna from '../../../config/Warna';
import * as Service from '../../../service/Account'
import AsyncStorage from "@react-native-community/async-storage";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Dropdown } from "react-native-material-dropdown";
import ActionSheet from "react-native-actions-sheet";
import AwesomeAlert from 'react-native-awesome-alerts';
import style from '../../../styles/style';
import { Style } from '../../../export';

export default function index() {
    const actionSheetAdd = createRef();
    const [listBk, setlistBk] = useState([]);
    const [shimmerRK, setshimmerRK] = useState(false);
    const [alertHapus, setAlertHapus] = useState(false);
    const [dataListBank, setDataListBank] = useState([]);
    const [bkName, setbkName] = useState("");
    const [acc, setacc] = useState("");
    const [bkKode, setbkKode] = useState("");
    const [id, setId] = useState("");
    const [idDelete, setIdDelete] = useState("");
    const [city, setcity] = useState("");
    const [branch_office, setbranch_office] = useState("");
    const [alertRekening, setAlertRekening] = useState("");


    function getListBank() {
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append(
            "Authorization",
            "Basic SVJJUy01ZjNjZjQ1MC0xZmQwLTQ1ZWQtODk3Zi0xMDVmNGMyMjQwY2I6"
        );

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(
            "https://app.sandbox.midtrans.com/iris/api/v1/beneficiary_banks",
            requestOptions
        )
            .then(response => response.json())
            .then(result => {
                var count = Object.keys(result.beneficiary_banks).length;
                let list = [];

                for (var i = 0; i < count; i++) {
                    // console.log(result.beneficiary_banks[i].code); // I need to add
                    list.push({ code: result.beneficiary_banks[i].code, value: result.beneficiary_banks[i].name }); // Create your array of data
                }
                setDataListBank(list);
            })
            .catch(error => console.log("error", error));
    }
    const renderRow = ({ item }) => {
        return (
            <DataTable.Row key={item?.id_data}>
                <DataTable.Cell>{item.bank_name}</DataTable.Cell>
                <DataTable.Cell numeric>{item.name}</DataTable.Cell>
                <DataTable.Cell numeric>{item.account}</DataTable.Cell>
                {/* <DataTable.Cell numeric>
                    <IconButton
                        icon={require('../../../icon/delete.png')}
                        color={Warna.red}
                        size={20}
                        onPress={() => {
                            setAlertHapus(true)
                            setIdDelete(item?.id_data)
                        }}
                    />
                </DataTable.Cell> */}
            </DataTable.Row>
        );
    };
    const getItem = async () => {
        await AsyncStorage.getItem("xxTwo").then(async (toko) => {
            if (toko !== undefined || toko !== null) {
                setId(JSON.parse(toko).id_toko)
                try {
                    let response = await Service.getBk(JSON.parse(toko).id_toko)
                    if (response.status.code === 200) {
                        setlistBk(response.data)
                        setTimeout(() => setshimmerRK(false), 500);
                    } else {
                        setlistBk([])
                        setTimeout(() => setshimmerRK(false), 500);
                    }
                } catch (error) {
                    setlistBk([])
                    setTimeout(() => setshimmerRK(false), 500);
                }
            } else {
                setlistBk([])
                setTimeout(() => setshimmerRK(false), 500);
            }
        });
    }
    const handleSubmit = async () => {
        let credentials = {
            "bank_code": bkKode,
            "bank_name": bkName,
            "account": acc,
            "branch_office": branch_office,
            "city": city,
            "id_toko": id,
        }
        console.log("🚀 ~ file: index.js ~ line 119 ~ handleSubmit ~ credentials", credentials)
        try {
            let response = await Service.addBk(credentials)
            if (response.status.code === 404) {
                console.log("🚀 ~ file: index.js ~ line 122 ~ handleSubmit ~ response.status.code ", response.status.code)
                setAlertRekening("Rekening tidak terdaftar")
            } else if (response.status.code === 201) {
                getItem()
                setbkKode("")
                setbkName("")
                setacc("")
                setcity("")
                setbranch_office("")
                setTimeout(() => {
                    actionSheetAdd.current?.setModalVisible(false)
                }, 500);
            } else {
                console.log("🚀 ~ file: index.js ~ line 135 ~ handleSubmit ~ response", response)
            }

        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 127 ~ handleSubmit ~ error", error)
        }
    }
    const handleDelete = () => {
        setAlertHapus(false)

        console.log("🚀 ~ file: index.js ~ line 50 ~ handleDelete ~ idDelete", idDelete)
        Service.deleteBk(idDelete).then(res => {
            console.log("🚀 ~ file: index.js ~ line 57 ~ response ~ res", res)
            getItem()

        }).catch(error => {
            console.log("🚀 ~ file: index.js ~ line 56 ~ Service.deleteBk ~ error", error)
        })
    }

    useEffect(() => {
        setAlertHapus(false)
        setshimmerRK(true)
        getItem();
        getListBank();

    }, [])


    function onChangeText(text, code, data) {
        var codeBank = data.filter(value => value.value.toLowerCase().indexOf(text.toLowerCase()) > -1);
        console.log("ini kodebank", codeBank[0].code);
        setbkKode(codeBank[0].code)
        setbkName(text)
    }

    return (
        <SafeAreaView style={styles.cardRK}>
            <View style={styles.rkbank}>
                <Text style={[Style.font_13, Style.semi_bold, { flex: 1 }]}>Rekening Bank</Text>
                <IconButton
                    style={{ marginTop: 0, alignItems: 'center', justifyContent: 'center', }}
                    icon={require('../../../icon/plus.png')}
                    color={Warna.biruJaja}
                    size={18}
                    onPress={() => actionSheetAdd.current?.setModalVisible()} />
            </View>
            {shimmerRK === true ?
                <View style={style.column}>
                    <ShimmerPlaceHolder
                        LinearGradient={LinearGradient}
                        style={{ borderRadius: 2, width: '95%', height: '23%', alignSelf: 'center', marginBottom: '2%', marginTop: '4%' }}
                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']} />
                    <ShimmerPlaceHolder
                        LinearGradient={LinearGradient}
                        style={{ borderRadius: 2, width: '95%', height: '23%', alignSelf: 'center', marginBottom: '3%' }}
                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']} />

                </View>
                :
                listBk.length !== 0 ?
                    <DataTable style={{ paddingBottom: '2%' }}>
                        <DataTable.Header>
                            <DataTable.Title>Nama Bank</DataTable.Title>
                            <DataTable.Title numeric>Nama Pemilik</DataTable.Title>
                            <DataTable.Title numeric>Account</DataTable.Title>
                            {/* <DataTable.Title numeric>Hapus</DataTable.Title> */}

                        </DataTable.Header>
                        <FlatList
                            data={listBk}
                            renderItem={renderRow}
                            keyExtractor={item => item?.id_data} />

                    </DataTable>
                    : <View style={{ flex: 1, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: 'grey' }}>Belum ada rekening bank</Text></View>
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
                confirmButtonColor="#DD6B55" onCancelPressed={() => setAlertHapus(false)} onConfirmPressed={() => handleDelete()}
            />
            <ActionSheet
                closeOnTouchBackdrop={false}
                containerStyle={{ flex: 0, paddingHorizontal: "4%" }}
                footerHeight={20}
                ref={actionSheetAdd}>
                <View style={{ padding: '4%', }}>
                    <View style={{ marginBottom: '5%' }}>
                        <Text style={style.actionSheetTitle}>TAMBAH REKENING</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 13, marginBottom: -10 }}>Nama Bank</Text>
                        <Dropdown
                            label="Pilih Bank"
                            data={dataListBank}

                            onChangeText={(value, index, data) => onChangeText(value, index, data)}
                        />
                    </View>

                    <View style={{ marginVertical: '1%' }}>
                        <Text style={{ fontSize: 13, }}>Nomor Rekening</Text>
                        <TextInput value={acc} onChangeText={(text) => {
                            setacc(text)
                            setAlertRekening("")
                        }} placeholder="ex. 12920009209" keyboardType="numeric" style={{ borderBottomWidth: 0.5 }} />
                        <Text style={{ fontSize: 12, color: 'red' }}>{alertRekening}</Text>
                    </View>
                    <View style={{ marginVertical: '1%' }}>
                        <Text style={{ fontSize: 13, }}>Kantor Cabang</Text>
                        <TextInput placeholder="Kantor Cabang" value={branch_office} onChangeText={(text) => setbranch_office(text)} style={{ borderBottomWidth: 0.5 }} />
                    </View>
                    <View style={{ marginVertical: '1%' }}>
                        <Text style={{ fontSize: 13, }}>Kota</Text>
                        <TextInput placeholder="Kota" value={city} onChangeText={(text) => setcity(text)} keyboardType="default" style={{ borderBottomWidth: 0.5 }} />
                    </View>

                    {/* <TouchableOpacity  style={{ marginTop: 20, padding: '2%', backgroundColor: Warna.biruJaja, elevation: 2, borderRadius: 8 }}>
                        <Text style={{ alignSelf: 'center', color: Warna.white, fontFamily: 'Poppins-SemiBold' }}>Simpan</Text>
                    </TouchableOpacity> */}
                    <Button onPress={() => handleSubmit()} mode="contained" color={Warna.biruJaja}>
                        Simpan
                    </Button>
                </View>
            </ActionSheet>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    rkbank: {
        flex: 0,
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: '3%',
        paddingTop: '3%'
    },
    cardRK: {
        flex: 1,
        flexDirection: 'column',
        marginTop: '2%',
        width: wp('95%'),
        backgroundColor: 'white',
        shadowColor: "#f5f5f5",
        shadowOpacity: 0.2,
        elevation: 0.5,
        borderRadius: 3
    },
})
