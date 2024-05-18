import React, { useState, useEffect, createRef, useCallback } from 'react';
import { Text, View, Image, TouchableNativeFeedback, TouchableOpacity, TextInput, FlatList, Alert, ScrollView, RefreshControl, ToastAndroid } from 'react-native';
import { Card, Button, Switch, TextInput as TextPaper, IconButton } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Spinner from '../../../component/loading';
import { useFocusEffect } from '@react-navigation/native';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetDeskripsi from 'react-native-actions-sheet';
import AsyncStorage from "@react-native-community/async-storage";
import ActionSheetDiskon from 'react-native-actions-sheet';
import ActionSheetVariasi from 'react-native-actions-sheet';
import SelectMultiple from 'react-native-select-multiple';
import ActionSheetListVariasi from 'react-native-actions-sheet';
import ActionSheetLayout from 'react-native-actions-sheet';
import ActionSheetSettingVariasi from 'react-native-actions-sheet';
import Variasi from '../variasi';
import * as FecthData from '../../../service/Data';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Service from '../../../service/Produk';
import * as Storage from '../../../service/Storage';

import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Warna from '../../../config/Warna';
import style from '../../../styles/style';
import * as Utils from '../../../utils'
import { styles } from '../../../styles/product';

const actionSheetRef = createRef();
const actionSheetStok = createRef();
const actionSheetHarga = createRef();
const actionSheetDeskripsi = createRef();
const actionSheetGambar = createRef();
const actionSheetDiskon = createRef();
const actionSheetVariasi = createRef();
const actionSheetListVariasi = createRef();
const actionSheetLayout = createRef();
const actionSheetSettingVariasi = createRef();

export default function index(props, { route }) {
    const navigation = useNavigation();
    const [idProduct, setidProduct] = useState(0);
    const [productsApi, setProductApi] = useState([]);
    const [products, setProduct] = useState([]);
    const [itemPressed, setitemPressed] = useState('');
    const [statusVariasi, setstatusVariasi] = useState('Add');
    const [namaprodukVariasi, setnamaprodukVariasi] = useState('');
    const [spinner, setspinner] = useState(false);
    const [idVariasi, setidVariasi] = useState('');
    const [variasi, setvariasi] = useState([]);
    const [listvariasi, setlistvariasi] = useState([]);
    const [paramVariasi, setparamVariasi] = useState('Add');
    const [shimmerProduct, setshimmerProduct] = useState(Boolean);
    const [showvariasi, setshowvariasi] = useState(false);
    const [showAlert, setshowAlert] = useState(false);
    const [titleAlert, setTitleAlert] = useState('');
    const [alertHapus, setAlertHapus] = useState(false);
    const [alertStatus, setAlertStatus] = useState(false);
    const [alertHapusDiskon, setalertHapusDiskon] = useState(false);
    const [alertHapusVariasi, setalertHapusVariasi] = useState(false);
    const [onClose, setonClose] = useState(true);

    const [productOnpress, setproductOnpress] = useState({});
    const [valVariasi, setvalVariasi] = useState(null);
    const [valVariasiAdd, setvalVariasiAdd] = useState(null);
    const [aturDiskon, setaturDiskon] = useState(0);
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectectedItems, setselectectedItems] = useState([]);
    const [selectedDate, setselectedDate] = useState('start');
    const [isEnabled, setIsEnabled] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const onSelectionsChange = (selected) => {
        setselectectedItems(selected);
    };
    const renderLabel = (label) => {
        return (
            <TouchableOpacity
                onPress={() => alert('ahah')}
                style={styles.touchKategori}>
                <Text adjustsFontSizeToFit style={styles.textKategori}>{label}</Text>
            </TouchableOpacity>
        );
    };
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

        return (
            <TouchableOpacity onPress={() => {
                handleSettingVariasi(item);
                setTimeout(() => actionSheetLayout.current?.setModalVisible(true), 100);
            }}
                style={[styles.listvariasi, { backgroundColor: item.id_variasi === idVariasi ? Warna.silver : Warna.white }]}>
                <Text adjustsFontSizeToFit style={[styles.textListVariasi, { flex: 2 }]} numberOfLines={2}>
                    {variasiName}
                </Text>
                <View style={{ flex: 3, flexDirection: 'column' }}>
                    {item.nominal_diskon === '0' || item.nominal_diskon == null ?
                        <Text adjustsFontSizeToFit style={styles.textHarga}>{item?.harga_normal}</Text>
                        :
                        <>
                            <View style={{ flexDirection: 'row' }}>
                                <Text adjustsFontSizeToFit style={styles.textHargaBeforeVariasi}>
                                    {item?.harga_normal}
                                </Text>
                                <Text style={styles.textDiskon}>{item.presentase_diskon}%</Text>
                            </View>
                            <Text adjustsFontSizeToFit style={styles.textHargaAfterVariasi}>
                                Rp{Utils.money(item.harga_variasi)}
                            </Text>
                        </>
                    }
                </View>
                <Text adjustsFontSizeToFit style={[styles.textListVariasi, { flex: 1 }]} numberOfLines={2}>
                    {item.stok}
                </Text>
                <Text adjustsFontSizeToFit style={[styles.textListVariasi, { flex: 2 }]} numberOfLines={3}>
                    {item.tgl_mulai_diskon == null ? "-" : item.tgl_mulai_diskon + ' sampai ' + item.tgl_berakhir_diskon}
                </Text>
            </TouchableOpacity>
        );
    };
    const toggleSwitch = (e) => {
        // typeSelected(idProduct);
        setonClose(false)
        setIsEnabled((previousState) => !previousState);
        setAlertStatus(true);
    };
    const handleActionSheet = (e) => {
        setTitleAlert(e + productOnpress.nama_produk);
        actionSheetRef.current?.setModalVisible(false);
        if (e === 'stok ') {
            setTimeout(() => {
                actionSheetStok.current?.setModalVisible(true);
            }, 600);
        } else if (e === 'harga ') {
            setTimeout(() => {
                actionSheetHarga.current?.setModalVisible(true);
            }, 600);
        } else if (e === 'deskripsi ') {
            setTimeout(() => {
                actionSheetDeskripsi.current?.setModalVisible(true);
            }, 600);
        } else if (e === 'gambar ') {
            setTimeout(() => {
                actionSheetGambar.current?.setModalVisible(true);
            }, 600);
        } else if (e === 'listvariasi') {
            setTimeout(() => {
                actionSheetListVariasi.current?.setModalVisible(true);
            }, 600);
        } else if (e === 'diskon') {
            setTimeout(() => {
                actionSheetDiskon.current?.setModalVisible(true);
            }, 600);
        } else if (e === 'preview') {
            setTimeout(() => { navigation.navigate('ProdukPreview') }, 200);
        }
    };
    const handleAlert = (e) => {
        if (e === 'hapus') {
            actionSheetRef.current?.setModalVisible(false);
            setTimeout(() => {
                setAlertHapus(!alertHapus);
            }, 1000);
        } else if (e === 'deskripsi') {
            actionSheetDeskripsi.current?.setModalVisible(false);
            setTimeout(() => {
                setshowAlert(!showAlert);
            }, 700);
            setTimeout(() => {
                setshowAlert(false);
            }, 2800);
        } else {
            actionSheetStok.current?.setModalVisible(false);
            actionSheetHarga.current?.setModalVisible(false);
            setTimeout(() => {
                setshowAlert(!showAlert);
            }, 700);
            setTimeout(() => {
                setshowAlert(false);
            }, 2800);
        }
    };
    const handleHapusProduk = () => {
        setAlertHapus(false);
    };

    const handleFilter = (text) => {
        const beforeFilter = products;
        const afterFilter = beforeFilter.filter(product => product.nama_produk.toLowerCase().indexOf(text.toLowerCase()) > -1);
        setProductApi(afterFilter);
    };
    const getProductApi = async () => {
        Service.getProductsWaitConfirm().then(() => {
            setTimeout(() => {
                getProductLocal();
                setshimmerProduct(false)
                setspinner(false)
                setitemPressed("")
                setproductOnpress({})
            }, 1000);
        })

    };
    const handleOptions = async (item) => {
        if (item.status_produk === "live") {
            setIsEnabled(true)
        } else if (item.status_produk === "arsipkan") {
            setIsEnabled(false)
        }
        setonClose(true)
        setitemPressed(item.id_produk)
        setaturDiskon('');
        setStartDate('');
        setEndDate('');
        setshowAlert(false);
        actionSheetRef.current?.setModalVisible();
        let obj = await item.variasi[0];
        let arr = await item.variasi;
        setvalVariasiAdd(obj);
        setproductOnpress(item);
        setidProduct(item.id_produk);
        setidVariasi(obj.id_variasi);
        setnamaprodukVariasi(item.nama_produk);
        setlistvariasi(item.variasi);
        let data = [];
        if (arr.lenght > 1) {
            await arr.map((ar) => {
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
    };
    const getProductLocal = async () => {
        try {
            let data = await Storage.getWaitConfirmProducts()
            if (data && data.lenght !== 0) {
                setProduct(data);
                setProductApi(data);
                setspinner(false)
                setitemPressed("")
                setproductOnpress({})
            }
            setshimmerProduct(false)
        } catch (error) {
            setTimeout(() => setshimmerProduct(false), 500);
            ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    };

    useFocusEffect(
        useCallback(() => {
            removeStorage()
            setitemPressed("")
            getProductLocal()
        }, []),
    );

    const removeStorage = () => {
        AsyncStorage.removeItem('updateProduk').catch(() => {
            ToastAndroid.show(String(error), ToastAndroid.SHORT, ToastAndroid.CENTER)
        })

    }
    useEffect(() => {
        if (props.search) {
            handleFilter(props.search);
        }
        if (props.params == "update") {
            setshimmerProduct(true)
            // getProductLocal();
            props.handleparams('')
            removeStorage();
        }
        return () => {
            setRefreshing(false)
            setAlertHapus(false);
            setshowAlert(false);
            setalertHapusDiskon(false);
            setTitleAlert('');
            setalertHapusVariasi(false)
        }
    }, [props]);

    const renderItem = ({ item }) => {
        if (shimmerProduct === true) {
            return (
                <View style={style.column}>
                    <View style={styles.cardItem}>
                        <ShimmerPlaceHolder
                            LinearGradient={LinearGradient}
                            style={styles.cardImage}
                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        />
                        <View style={[styles.cardText, { paddingVertical: '2%' }]}>
                            <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                            <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={{ marginVertical: '1%' }}
                                width={140}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                            <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                width={75}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                        </View>
                    </View>
                </View>
            );
        } else {
            return (
                <TouchableOpacity onPress={() => handleEditProduk(item)}>
                    <Card
                        key={item.id}
                        style={[styles.card, { backgroundColor: itemPressed === item.id_produk ? '#9A9A9A' : 'white' }]}>
                        <View style={styles.cardItem}>
                            <Card.Cover
                                style={[styles.cardImage, { opacity: item.jumlah_stok_in === "0" ? 0.3 : 1, backgroundColor: 'grey' }]}
                                source={{ uri: item.foto && item.foto[0] && item.foto[0].url_foto }}
                            />
                            <View style={styles.cardText}>
                                <View style={styles.cardParentTitle}>
                                    <View style={styles.cardParentTitle}>
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.cardTitle]}>{item.nama_produk}</Text>
                                        <Text adjustsFontSizeToFit style={styles.cardKondisi}>{item.kondisi}</Text>
                                    </View>
                                </View>

                                <Text adjustsFontSizeToFit style={styles.cardHarga}>{item.variasi[0]?.harga_normal}</Text>
                                <Text adjustsFontSizeToFit style={[styles.cardHarga, { color: item.jumlah_stok_in && item.jumlah_stok_in > 0 ? Warna.blackLight : Warna.redPower }]}>{item.jumlah_stok_in && item.jumlah_stok_in > 0 ? 'Stok : ' + item.jumlah_stok_in : "Stok habis"}</Text>
                                <Text adjustsFontSizeToFit style={[styles.status, { color: item.status_produk ? item.status_produk === "blokir" ? Warna.redPower : Warna.kuningJaja : Warna.white }]}>{item.status_produk ? item.status_produk : null}</Text>
                            </View>
                            <Card.Actions style={styles.cardOption}>
                                <IconButton
                                    style={{ margin: 0 }}
                                    icon={require('../../../icon/options.png')}
                                    color={Warna.black}
                                    size={27}
                                    onPress={() => handleOptions(item)}
                                />
                            </Card.Actions>
                        </View>
                    </Card>
                </TouchableOpacity>
            );
        }
    };
    const handleEditProduk = (data) => {
        actionSheetRef.current?.setModalVisible(false);
        setTimeout(() => {
            navigation.navigate('ProdukEdit', {
                item: data ? data : productOnpress,
                revisi: true
            });
        }, 150);
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
    const handleDelete = () => {
        if (idProduct !== 0) {
            Alert.alert(
                'Hapus!',
                'Anda ingin menghapus produk ini?',
                [
                    {
                        text: 'BATAL',
                        onPress: () => setitemPressed(''),
                        style: 'cancel',
                    },
                    {
                        text: 'YA',
                        onPress: () => {
                            Service.deleteProduct(idProduct)
                                .then((res) => {
                                    setspinner(true);
                                    if (res.status == 200) {
                                        getProductApi();
                                    }
                                })
                                .catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER));
                            actionSheetRef.current?.setModalVisible(false);
                        },
                    },
                ],
                { cancelable: false },
            );
        }
    };
    const typeSelected = (value) => {
        setitemPressed(value);
    };

    const handlePressDiskon = async () => {
        setspinner(true);
        let credentials = {
            'presentase_diskon': aturDiskon,
            'tgl_mulai_diskon': startDate,
            'tgl_berakhir_diskon': endDate,
        };


        if (selectectedItems.length > 1) {
            for (let index = 0; index < variasi.length; index++) {
                try {
                    let response = await Service.aturDiskon(credentials, idVariasi);
                    if (response.status === 200) {
                        setTimeout(() => setspinner(false), 1000);
                        ToastAndroid.show("Diskon berhasil ditambahkan", ToastAndroid.SHORT, ToastAndroid.CENTER)
                    } else {
                        ToastAndroid.show("Mohon maaf ada kesalahan teknis", ToastAndroid.LONG, ToastAndroid.CENTER)
                    }
                } catch (error) {
                    ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
                }
            }
        } else {
            try {
                await Service.aturDiskon(credentials, idVariasi);
                getProductById();
                actionSheetDiskon.current?.setModalVisible(false);
                setidVariasi("")
                setTimeout(() => setspinner(false), 1000);
                ToastAndroid.show("Diskon berhasil ditambahkan", ToastAndroid.SHORT, ToastAndroid.CENTER)
            } catch (error) {
                ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
            }
        }
    };
    const handleDeleteDiskon = async () => {
        setspinner(true);
        setalertHapusDiskon(false);
        try {
            let resDeleteDiskon = await Service.deleteDiskon(idVariasi);
            if (resDeleteDiskon.data.status == 200) {
                setaturDiskon('');
                setStartDate('');
                setEndDate('');
                actionSheetLayout.current?.setModalVisible(false);
                getProductById();
                setTimeout(() => setspinner(false), 500);
                setidVariasi("")
                setalertHapusDiskon(false);
                ToastAndroid.show("Diskon berhasil di reset", ToastAndroid.SHORT, ToastAndroid.CENTER)
            } else {
                setTimeout(() => setspinner(false), 500);
                ToastAndroid.show("Mohon maaf ada kesalahan teknis", ToastAndroid.LONG, ToastAndroid.CENTER)
            }
        } catch (error) {
            setTimeout(() => setspinner(false), 500);
            ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    };
    const getProductById = async () => {
        try {
            let listVariasi = await Service.getProductById(idProduct);
            setnamaprodukVariasi(listVariasi.product.nama_produk);
            setlistvariasi(await listVariasi.product.variasi);
            let data = [];
            let arr = await listVariasi.product.variasi;
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
    };
    const handleSettingVariasi = (item) => {
        setparamVariasi('Edit');
        setvalVariasi(item);
        setidVariasi(item.id_variasi);
        if (listvariasi.length > 1) setshowvariasi(true);
        if (listvariasi.length <= 1) setshowvariasi(false);
    };
    const handleEditVariasi = () => {
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
            setidVariasi("")
            setTimeout(() => setspinner(false), 500);
        }
    };
    const onRefresh = useCallback(() => {
        setTimeout(() => setRefreshing(false), 200);
        setTimeout(() => setshimmerProduct(true), 250);
        Service.getProductsWaitConfirm().then(() => setTimeout(() => getProductLocal(), 500));
    }, []);

    const handleDeleteVariasi = () => {
        setalertHapusVariasi(false)
        setTimeout(() => {
            actionSheetLayout.current?.setModalVisible(false)
            var requestOptions = {
                method: 'DELETE',
                redirect: 'follow'
            };
            fetch(`https://jsonx.jaja.id/core/seller/product/variasi/${idVariasi}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.status == 200) {
                        getProductById();
                        setidVariasi("")
                        ToastAndroid.show("Variasi berhasil di hapus", ToastAndroid.SHORT, ToastAndroid.CENTER)
                    } else {
                        ToastAndroid.show(result.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                    }
                    setalertHapusVariasi(false)
                })
                .catch(error => {
                    setalertHapusVariasi(false)
                    ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
                });
        }, 1000);
    }

    return (
        <View style={{ flex: 1 }} >
            {spinner ? <Spinner /> : null}
            {productsApi.length === 0 ?
                <Text adjustsFontSizeToFit style={{ alignSelf: 'center', fontSize: 14 }}>
                    Tidak ada produk
                </Text>
                :
                <View style={{ flex: 1 }}>
                    <FlatList
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        data={productsApi}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id_produk}
                    />
                </View>
            }
            <ActionSheet containerStyle={styles.actionSheet} ref={actionSheetRef} onClose={() => onClose ? setitemPressed('') : null} >
                <View style={styles.headerModal}>
                    <Text adjustsFontSizeToFit style={styles.informasiProduk}>Informasi Produk</Text>
                    <IconButton
                        style={{ margin: 0 }}
                        icon={require('../../../icon/close.png')}
                        color={Warna.biruJaja}
                        size={18}
                        onPress={() => actionSheetRef.current?.setModalVisible(false)}
                    />
                </View>
                <TouchableOpacity
                    style={styles.modalLine}
                    onPress={() => {
                        actionSheetRef.current?.setModalVisible(false)
                        setTimeout(() => navigation.navigate("ProdukPreview", { data: productOnpress }), 200);
                    }
                    }>
                    <Image
                        style={[styles.iconModal, { tintColor: Warna.biruJaja }]}
                        source={require('../../../icon/eye-visible.png')}
                    />
                    <Text adjustsFontSizeToFit style={styles.textLine}>Lihat Produk</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.modalLine}
                    // onPress={() => navigation.navigate('Variasi', { data: listvariasi, id_product: idProduct, valVariasiAd: valVariasiAdd })}>
                    onPress={() => handleActionSheet('listvariasi')}>
                    <Image
                        style={styles.iconModal}
                        source={require('../../../icon/specification.png')}
                    />
                    <Text adjustsFontSizeToFit style={styles.textLine}>Detail Produk</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.modalLine}
                    onPress={() => handleEditProduk(null)}>
                    <Image
                        style={styles.iconModal}
                        source={require('../../../icon/setting.png')}
                    />
                    <Text adjustsFontSizeToFit style={styles.textLine}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.modalLine}
                    onPress={handleDelete}>
                    <Image
                        style={[styles.iconModal, { tintColor: Warna.red }]}
                        source={require('../../../icon/delete.png')}
                    />
                    <Text adjustsFontSizeToFit style={styles.textLine}>Hapus</Text>
                </TouchableOpacity>
            </ActionSheet>

            <ActionSheetDeskripsi
                footerHeight={11}
                containerStyle={styles.actionSheet}
                ref={actionSheetDeskripsi}>
                <View style={styles.headerModal}>
                    <Text adjustsFontSizeToFit style={styles.titleDeskripsi}>Ubah Deskripsi Produk</Text>
                    <TouchableOpacity
                        onPress={() =>
                            actionSheetDeskripsi.current?.setModalVisible(false)
                        }>
                        <Image
                            style={styles.iconClose}
                            source={require('../../../icon/close.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.modalColumn}>
                    <Text adjustsFontSizeToFit style={styles.noteDeskripsi}>
                        Note : masukkan deskripsi sesuai dengan produk anda, gunakan kata
                        yang sopan dan jelas agar dapat menarik perhatian pengunjung
                    </Text>
                    <TextInput
                        numberOfLines={17}
                        style={styles.textArea}
                        keyboardType="default"
                        multiline={true}
                        mode="outlined"
                    />
                </View>
                <Button
                    style={styles.buttonModal}
                    mode="contained"
                    onPress={() => handleAlert('deskripsi')}>
                    Simpan
                </Button>
            </ActionSheetDeskripsi>
            <ActionSheetDiskon
                footerHeight={11}
                containerStyle={style.actionSheet}
                ref={actionSheetDiskon}>
                <View style={styles.headerModal}>
                    <Text adjustsFontSizeToFit style={styles.informasiProduk}>Atur Diskon</Text>
                    <TouchableOpacity
                        onPress={() => actionSheetDiskon.current?.setModalVisible()}>
                        <Image
                            style={styles.iconClose}
                            source={require('../../../icon/close.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={[style.column]}>
                    <Text adjustsFontSizeToFit style={styles.textLabel}>
                        Persentase Diskon % <Text adjustsFontSizeToFit style={styles.red}>*</Text>
                    </Text>
                    <View style={styles.flex0}>
                        <TextPaper
                            maxLength={2}
                            keyboardType="numeric"
                            value={aturDiskon}
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                borderBottomWidth: 0,
                                borderBottomColor: 'white',
                            }}
                            onChangeText={(text) => {
                                setaturDiskon(text)
                            }}
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

                    <Text adjustsFontSizeToFit style={styles.textLabel}>
                        Tanggal Mulai Diskon <Text adjustsFontSizeToFit style={styles.red}>*</Text>
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

                    <Text adjustsFontSizeToFit style={styles.textLabel}>
                        Tanggal Berakhir Diskon <Text adjustsFontSizeToFit style={styles.red}>*</Text>
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
            <ActionSheetVariasi
                scrollEnabled={true}
                extraScroll={100}
                containerStyle={styles.actionSheet}
                footerHeight={0}
                ref={actionSheetVariasi}>
                <View style={styles.headerModal}>
                    <Text adjustsFontSizeToFit style={styles.headerTitle}>Pilih Variasi</Text>
                    <TouchableOpacity
                        onPress={() => actionSheetVariasi.current?.setModalVisible(false)}>
                        <Image
                            style={styles.iconClose}
                            source={require('../../../icon/close.png')}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ height: 200, paddingHorizontal: wp('2%') }}>
                    <SelectMultiple
                        items={variasi}
                        renderLabel={renderLabel}
                        selectedItems={selectectedItems}
                        onSelectionsChange={onSelectionsChange}
                    />
                </View>
            </ActionSheetVariasi>
            <ActionSheetListVariasi
                onOpen={() => setidVariasi("")}
                containerStyle={[styles.actionSheet, { height: hp('100%') }]}
                footerHeight={20}
                ref={actionSheetListVariasi}>
                <View style={styles.headerModal}>
                    <Text adjustsFontSizeToFit style={styles.headerTitle}>Variasi Produk</Text>
                    <IconButton
                        style={{ margin: 0, marginLeft: 10 }}
                        icon={require('../../../icon/close.png')}
                        color={Warna.blackLight}
                        size={18}
                        onPress={() =>
                            actionSheetListVariasi.current?.setModalVisible(false)
                        }
                    />
                </View>

                <View
                    style={{ flex: 9, paddingHorizontal: wp('2%'), marginBottom: '2%' }}>
                    <View style={{ height: '100%' }}>
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 0 }}
                            nestedScrollEnabled={false}
                            scrollEnabled={true}>
                            <View style={styles.listvariasi}>
                                <Text adjustsFontSizeToFit style={[styles.textListVariasi, { flex: 2 }]}>Variasi</Text>
                                <Text adjustsFontSizeToFit style={[styles.textListVariasi, { flex: 3 }]}>Harga</Text>
                                <Text adjustsFontSizeToFit style={[styles.textListVariasi, { flex: 1 }]}>Stok</Text>

                                {/* <Text style={styles.textListVariasi}>Diskon</Text> */}
                                <Text adjustsFontSizeToFit style={[styles.textListVariasi, { flex: 2 }]}>Periode</Text>

                                {/* <Text style={[styles.textListVariasi, { flex: 1 }]}>Opsi</Text> */}
                            </View>

                            <FlatList
                                contentContainerStyle={{ height: 100 }}
                                // nestedScrollEnable={true}
                                data={listvariasi}
                                renderItem={renderListvariasi}
                                keyExtractor={(item) => item.id_variasi}
                            />
                        </ScrollView>
                    </View>
                </View>
                <View
                    style={{
                        height: hp('5%'),
                        paddingHorizontal: wp('2%'),
                        marginBottom: '2%',
                    }}>
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
                </View>
            </ActionSheetListVariasi>
            {/* actionSheetSettingVariasi */}
            <ActionSheetLayout
                footerHeight={11}
                containerStyle={style.actionSheet}
                ref={actionSheetLayout}>
                <View style={style.actionSheetHeader}>
                    <Text adjustsFontSizeToFit style={style.actionSheetTitle}>Atur Variasi</Text>
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
                        <Text adjustsFontSizeToFit style={{ fontSize: 14 }}>Ubah Variasi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setalertHapusVariasi(true)}
                        style={style.appBarRow}>
                        <Text adjustsFontSizeToFit style={{ fontSize: 14 }}>Hapus Variasi</Text>
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
                        <Text adjustsFontSizeToFit style={{ fontSize: 14 }}>Atur Diskon</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setalertHapusDiskon(true)}
                        style={style.appBarRow}>
                        <Text adjustsFontSizeToFit style={{ fontSize: 14 }}>Hapus Diskon</Text>
                    </TouchableOpacity>
                </View>
            </ActionSheetLayout>
            <ActionSheetSettingVariasi
                footerHeight={11}
                containerStyle={styles.actionSheet}
                ref={actionSheetSettingVariasi}>
                <View style={styles.headerModal}>
                    <Text adjustsFontSizeToFit style={styles.informasiProduk}>Variasi</Text>
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

                <Variasi
                    status={paramVariasi}
                    handleSaveVariasi={(params) => handleSaveVariasi(params)}
                    valVariasi={statusVariasi == 'Edit' ? valVariasi : valVariasiAdd}
                    status={statusVariasi}
                    idProduct={idProduct}
                />
            </ActionSheetSettingVariasi>
            {/* actionSheetSettingVariasi */}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                onConfirm={(text) => handleConfirm(text)}
                onCancel={() => hideDatePicker()}
            />
            <AwesomeAlert
                show={showAlert}
                message={`Perubahan pada ${titleAlert} anda berhasil disimpan!`}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                overlayStyle={{ backgroundColor: 'white', opacity: 0 }}
            />

            <AwesomeAlert
                alertContainerStyle={styles.alertContainerStyle}
                overlayStyle={{ backgroundColor: 'white', opacity: 0 }}
                show={alertHapus}
                showProgress={false}
                title="PERINGATAN!"
                message="Anda yakin ingin menghapus produk ini?"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="No, cancel"
                confirmText="Yes, delete it"
                confirmButtonColor="#DD6B55"
                onCancelPressed={() => setAlertHapus(false)}
                onConfirmPressed={() => handleHapusProduk()}
            />
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
            <AwesomeAlert
                alertContainerStyle={styles.alertContainerStyle}
                overlayStyle={{ backgroundColor: 'white', opacity: 0 }}
                show={alertHapusVariasi}
                showProgress={false}
                title="PERINGATAN!"
                message="Anda yakin ingin menghapus variasi ini?"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Batal"
                confirmText="Hapus"
                confirmButtonColor="#DD6B55"
                onCancelPressed={() => setalertHapusVariasi(false)}
                onConfirmPressed={handleDeleteVariasi}
            />
        </View>
    );
}


