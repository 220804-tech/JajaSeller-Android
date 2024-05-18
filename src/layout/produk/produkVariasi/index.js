import React, { useState, useEffect, createRef } from 'react'
import { View, Text, SafeAreaView, Image, TouchableOpacity, TouchableNativeFeedback, FlatList, StyleSheet } from 'react-native'
import style from '../../../styles/style';
import { Appbar, Button, Switch, TextInput as TextPaper, IconButton } from 'react-native-paper'; import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Warna from '../../../config/Warna';
import ActionSheetSettingVariasi from 'react-native-actions-sheet';
import ActionSheetLayout from 'react-native-actions-sheet';
import ActionSheetDiskon from 'react-native-actions-sheet';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Service from '../../../service/Produk';

import ListVariasi from '../variasi';
import Spinner from 'react-native-loading-spinner-overlay';

export default function Variasi({ route }) {
    const actionSheetSettingVariasi = createRef();
    const actionSheetLayout = createRef();
    const actionSheetDiskon = createRef();
    const [aturDiskon, setaturDiskon] = useState(0);
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [idVariasi, setidVariasi] = useState('');
    const [showvariasi, setshowvariasi] = useState(false);
    const [listvariasi, setlistvariasi] = useState([]);
    const [paramVariasi, setparamVariasi] = useState('Add');
    const [statusVariasi, setstatusVariasi] = useState('Add');
    const [idProduct, setidProduct] = useState("");
    const [valVariasiAdd, setvalVariasiAdd] = useState([]);
    const [valVariasi, setvalVariasi] = useState(null);
    const [spinner, setspinner] = useState(false);
    const [alertHapusDiskon, setalertHapusDiskon] = useState(false);

    const { id_product, data, valVariasiAd } = route.params;


    useEffect(() => {
        setalertHapusDiskon(false);
        setidProduct(id_product)
        setlistvariasi(data)
        setvalVariasiAdd(valVariasiAd)
    }, [])
    const renderListvariasi = ({ item }) => {
        let variasiName = '';
        if (item.warna !== null) {
            variasiName = item.warna;
        } else if (item.ukuran !== null) {
            variasiName = item.ukuran;
        } else if (item.model !== null) {
            variasiName = item.model;
        } else {
            variasiName = 'Default';
        }

        const handleSettingVariasi = (item) => {
            console.log('handleSettingVariasi -> item', item);
            setparamVariasi('Edit');
            setvalVariasi(item);
            setidVariasi(item.id_variasi);
            // console.log("handleEditDiskon -> variasipress", item.id_variasi)
            // console.log("handleSettingVariasi -> item", item.presentase_diskon)
            if (listvariasi.length > 1) setshowvariasi(true);
            if (listvariasi.length <= 1) setshowvariasi(false);
            console.log('handleSettingVariasi -> listvariasi', listvariasi.length);
        };

        return (
            <View style={styles.listvariasi}>
                <Spinner
                    visible={spinner}
                    color={Warna.white}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
                <Text style={[styles.textListVariasi, { flex: 2 }]} numberOfLines={2}>
                    {variasiName}
                </Text>
                <View style={{ flex: 3, flexDirection: 'column' }}>
                    {item.nominal_diskon === '0' || item.nominal_diskon == null ? (
                        <Text style={styles.textHarga}>Rp. {item?.harga_normal}</Text>
                    ) : (
                        <>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textHargaBeforeVariasi}>
                                    Rp. {item?.harga_normal}
                                </Text>
                                <Text style={styles.textDiskon}>{item.presentase_diskon}%</Text>
                            </View>
                            <Text style={styles.textHargaAfterVariasi}>
                                Rp. {item.harga_variasi}
                            </Text>
                        </>
                    )}
                </View>
                <Text style={[styles.textListVariasi, { flex: 1 }]} numberOfLines={2}>
                    {item.stok}
                </Text>

                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                    }}>
                    <IconButton
                        style={{ margin: 0 }}
                        icon={require('../../../icon/settings.png')}
                        color={Warna.biruJaja}
                        size={22}
                        onPress={() => {
                            handleSettingVariasi(item);
                            setTimeout(
                                () => actionSheetLayout.current?.setModalVisible(true),
                                100,
                            );
                        }}
                    />
                </View>
            </View>
        );
    };
    const handleEditVariasi = () => {
        console.log('handleEditVariasi -> valVariasiAdd', valVariasiAdd);
        console.log('handleEditVariasi -> valVariasi', valVariasi);
        actionSheetLayout.current?.setModalVisible();
        setTimeout(() => actionSheetSettingVariasi.current?.setModalVisible(), 250);
        setstatusVariasi('Edit');
    };

    const handleSaveVariasi = (params) => {
        if (params == true) setspinner(true);
        else if (params == false) setTimeout(() => setspinner(false), 200);
        else if (params == '201') {
            actionSheetSettingVariasi.current?.setModalVisible();
            getProductById();
            setTimeout(() => setspinner(false), 500);
        }
    };

    const handleDeleteDiskon = async () => {
        setspinner(true);
        setalertHapusDiskon(false);
        try {
            let resDeleteDiskon = await Service.deleteDiskon(idVariasi);
            console.log('handleDeleteDiskon => res : ', resDeleteDiskon.data);
            if (resDeleteDiskon.data.status == 200) {
                setaturDiskon('');
                setStartDate('');
                setEndDate('');
                actionSheetLayout.current?.setModalVisible(false);
                getProductById();
                setTimeout(() => setspinner(false), 500);
            }
            console.log('resDeleteDiskon.data.status', resDeleteDiskon.data.status);
        } catch (error) {
            console.log('handleDeleteDiskon => error : ', error);
        }
    };

    const getProductById = async () => {
        try {
            let listVariasi = await Service.getProductById(idProduct);
            setnamaprodukVariasi(listVariasi.product.nama_produk);
            setlistvariasi(await listVariasi.product.variasi);
            // let obj = await listVariasi.product.variasi[0]
            // setidVariasi(obj.id_variasi)
            let data = [];
            let arr = await listVariasi.product.variasi;
            // console.log("index -> listVariasi.product.variasi", listVariasi.product.variasi.id_variasi)
            if (arr.length > 1) {
                arr.map((ar) => {
                    if (ar.warna === null) {
                        data.push({ label: ar.ukuran, value: ar.id_variasi });
                    } else {
                        data.push({ label: ar.warna, value: ar.id_variasi });
                    }
                });
                setvariasi(data);
            } else {
                setvariasi(arr);
            }
        } catch (error) {
            console.log('index -> error', error);
        }
        console.log('listvariasi', listvariasi);
    };
    const showDatePicker = (text) => {
        if (text === 'end') {
            setselectedDate('end');
        } else {
            setselectedDate('start');
        }
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const handleConfirm = (date) => {
        let str = JSON.stringify(date);
        let res = str.slice(1, 11);
        if (selectedDate === 'start') {
            setStartDate(res);
        } else {
            setEndDate(res);
        }
        hideDatePicker();
    };
    return (
        <SafeAreaView style={style.container}>
            <Appbar.Header style={style.appBar}>
                <View style={style.row_start_center}>
                    <Text style={style.appBarText}>Variasi</Text>
                </View>

                <TouchableOpacity>
                    <Image style={style.appBarIcon} source={require('../../../icon/more.png')} />
                </TouchableOpacity>
            </Appbar.Header>


            <View style={[styles.listvariasi, { paddingHorizontal: '3%', flex: 0 }]}>
                <Text style={[styles.textListVariasi, { flex: 2 }]}>Variasi</Text>
                <Text style={[styles.textListVariasi, { flex: 3 }]}>Harga</Text>
                <Text style={[styles.textListVariasi, { flex: 1 }]}>Stok</Text>

                {/* <Text style={styles.textListVariasi}>Diskon</Text> */}
                <Text style={[styles.textListVariasi, { flex: 1 }]}>Opsi</Text>
            </View>

            <FlatList
                contentContainerStyle={{ paddingHorizontal: "3%" }}
                // contentContainerStyle={{ height: 100 }}
                // nestedScrollEnable={true}
                data={listvariasi}
                renderItem={renderListvariasi}
                keyExtractor={(item) => item.id_variasi}
            />
            <Button
                contentStyle={{ height: hp('5%') }}
                color={Warna.biruJaja}
                labelStyle={{ color: Warna.white }}
                mode="contained"
                onPress={() => {
                    setvalVariasi(valVariasiAdd);
                    setstatusVariasi('Add');
                    setTimeout(
                        () => actionSheetSettingVariasi.current?.setModalVisible(),
                        250,
                    );
                }}>
                Tambah Variasi
            </Button>
            <ActionSheetDiskon
                footerHeight={11}
                containerStyle={style.actionSheet}
                ref={actionSheetDiskon}>
                <View style={styles.headerModal}>
                    <Text style={styles.informasiProduk}>Atur Diskon</Text>
                    <TouchableOpacity
                        onPress={() => actionSheetDiskon.current?.setModalVisible()}>
                        <Image
                            style={styles.iconClose}
                            source={require('../../../icon/close.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={[style.column]}>
                    <Text style={styles.textLabel}>
                        Persentase Diskon % <Text style={styles.red}>*</Text>
                    </Text>
                    <View style={styles.flex0}>
                        <TextPaper
                            // disabled={true}asasa
                            // label="Nominal persentasi diskon"
                            maxLength={2}
                            keyboardType="numeric"
                            value={aturDiskon}
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                borderBottomWidth: 0,
                                borderBottomColor: 'white',
                            }}
                            onChangeText={(text) => setaturDiskon(text)}
                            theme={{
                                colors: {
                                    primary: Warna.biruJaja,
                                },
                            }}
                        />
                        <Image
                            style={styles.iconCalendar}
                            source={require('../../../icon/percentage.png')}
                        />
                    </View>

                    <Text style={styles.textLabel}>
                        Tanggal Mulai Diskon <Text style={styles.red}>*</Text>
                    </Text>
                    <View style={styles.flex0border}>
                        <TouchableOpacity onPress={() => showDatePicker('start')}>
                            <TextPaper
                                onPress={() => showDatePicker('start')}
                                disabled={true}
                                onFocus={() => showDatePicker('start')}
                                // label="Tanggal Mulai Diskon"
                                style={{ flex: 1, backgroundColor: 'transparent' }}
                                value={startDate}
                                onChangeText={() => showDatePicker('start')}
                            />
                        </TouchableOpacity>
                        <TouchableNativeFeedback onPress={() => showDatePicker('start')}>
                            <Image
                                style={styles.iconCalendar}
                                source={require('../../../icon/calendar.png')}
                            />
                        </TouchableNativeFeedback>
                    </View>

                    <Text style={styles.textLabel}>
                        Tanggal Berakhir Diskon <Text style={styles.red}>*</Text>
                    </Text>
                    <View style={styles.flex0border}>
                        <TouchableOpacity onPress={() => showDatePicker('end')}>
                            <TextPaper
                                disabled={true}
                                onFocus={() => showDatePicker('end')}
                                // label="Tanggal Berakhir Diskon"
                                style={{ flex: 1, backgroundColor: 'transparent' }}
                                value={endDate}
                                onChangeText={() => showDatePicker('end')}
                            />
                        </TouchableOpacity>

                        <TouchableNativeFeedback onPress={() => showDatePicker('end')}>
                            <Image
                                style={styles.iconCalendar}
                                source={require('../../../icon/calendar.png')}
                            />
                        </TouchableNativeFeedback>
                    </View>
                </View>
                <Button
                    style={styles.buttonModal}
                    mode="contained"
                    onPress={() => handlePressDiskon()}>
                    Simpan
                </Button>
            </ActionSheetDiskon>
            <ActionSheetSettingVariasi
                footerHeight={11}
                containerStyle={style.actionSheet}
                ref={actionSheetSettingVariasi}>
                <View style={style.actionSheetHeader}>
                    <Text style={style.actionSheetTitle}>Variasi</Text>
                    <TouchableOpacity
                        onPress={() =>
                            actionSheetSettingVariasi.current?.setModalVisible()
                        }>
                        <Image
                            style={styles.iconClose}
                            source={require('../../../icon/close.png')}
                        />
                    </TouchableOpacity>
                </View>

                <ListVariasi
                    // status={paramVariasi}
                    handleSaveVariasi={(params) => handleSaveVariasi(params)}
                    valVariasi={statusVariasi == 'Edit' ? valVariasi : valVariasiAdd}
                    status={statusVariasi}
                    idProduct={idProduct}
                />
            </ActionSheetSettingVariasi>
            <ActionSheetLayout
                footerHeight={11}
                containerStyle={style.actionSheet}
                ref={actionSheetLayout}>
                <View style={style.actionSheetHeader}>
                    <Text style={style.actionSheetTitle}>Atur Variasi</Text>
                    <TouchableOpacity
                        onPress={() => actionSheetLayout.current?.setModalVisible(false)}>
                        <Image
                            style={style.actionSheetClose}
                            source={require('../../../icon/close.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={style.column_center_start}>
                    <TouchableOpacity
                        onPress={() => handleEditVariasi()}
                        style={style.appBarRow}>
                        <Text>Ubah Variasi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            actionSheetLayout.current?.setModalVisible(false) &
                            setTimeout(
                                () => actionSheetDiskon.current?.setModalVisible(true),
                                100,
                            )
                        }
                        style={style.appBarRow}>
                        <Text>Atur Diskon</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setalertHapusDiskon(true)}
                        style={style.appBarRow}>
                        <Text>Hapus Diskon</Text>
                    </TouchableOpacity>
                </View>
            </ActionSheetLayout>
            <AwesomeAlert
                alertContainerStyle={styles.alertContainerStyle}
                overlayStyle={{ backgroundColor: 'white', opacity: 0 }}
                show={alertHapusDiskon}
                showProgress={false}
                title="PERINGATAN!"
                message="Diskon akan dihapus dan kembali ke harga normal!"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Batal"
                confirmText="Hapus"
                confirmButtonColor="#DD6B55"
                onCancelPressed={() => setalertHapusDiskon(false)}
                onConfirmPressed={() => handleDeleteDiskon()}
            />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    listvariasi: {
        flex: 1,
        paddingVertical: hp('1%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: hp('0%'),
        borderBottomColor: '#9A9A9A',
        borderBottomWidth: 0.2,
        alignItems: 'center',
    },
    textListVariasi: {
        flex: 1,
        fontSize: 14,
        color: '#000000',
        fontWeight: '900',
        justifyContent: 'flex-end',
    },
    textHargaBeforeVariasi: {
        flex: 0,
        fontSize: 11,
        color: '#000000',
        fontWeight: '900',
        justifyContent: 'flex-end',
        paddingHorizontal: wp('2%'),
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },
    textHargaAfterVariasi: {
        flex: 0,
        fontSize: 14,
        color: '#000000',
        fontWeight: '900',
        justifyContent: 'flex-end',
        paddingHorizontal: wp('2%'),
    },
    textDiskon: {
        fontSize: 10,
        marginLeft: 10,
        color: '#FFF',
        backgroundColor: Warna.biruJaja,
        borderRadius: 13,
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('0.3W%'),
        justifyContent: 'flex-end',
    },
    textHarga: {
        fontSize: 13,
        color: '#000000',
        fontWeight: '900',
        justifyContent: 'flex-end',
        paddingHorizontal: wp('2%'),
    },
    iconClose: {
        width: 14,
        height: 14,
        tintColor: 'grey',
    },
    alertContainerStyle: {
        borderColor: 'grey',
        borderWidth: 2,
    },

})