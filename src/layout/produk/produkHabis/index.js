import React, { useState, useEffect, createRef, useCallback } from 'react';
import { Text, View, Image, TouchableNativeFeedback, TouchableOpacity, TextInput, FlatList, Alert, ScrollView, RefreshControl, ToastAndroid, TouchableHighlight } from 'react-native';
import { Card, Button, Switch, TextInput as TextPaper, IconButton } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetHargaStok from 'react-native-actions-sheet';
import ActionSheetDiskon from 'react-native-actions-sheet';
import ActionSheetVariasi from 'react-native-actions-sheet';
import SelectMultiple from 'react-native-select-multiple';
import ActionSheetListVariasi from 'react-native-actions-sheet';
import ActionSheetLayout from 'react-native-actions-sheet';
import ActionSheetSettingVariasi from 'react-native-actions-sheet';
import Variasi from '../variasi';
import AwesomeAlert from 'react-native-awesome-alerts';
import { styles } from '../../../styles/product';
import Ubah from '../ubahHargaStok'
import { ServiceProduct, Utils, Colors, useNavigation, Wp, Hp, Loading, Style, ShimmerProduct, ActionSheetProduct } from '../../../export';
import { useSelector, useDispatch } from 'react-redux';
const actionSheetRef = createRef();
const actionSheetHargaStokRef = createRef();
const actionSheetGambar = createRef();
const actionSheetDiskon = createRef();
const actionSheetVariasi = createRef();
const actionSheetListVariasi = createRef();
const actionSheetLayout = createRef();
const actionSheetSettingVariasi = createRef();

export default function index(props) {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const reduxSeller = useSelector(state => state.user.seller.id_toko)
    const reduxSoldOutProducts = useSelector(state => state.product.allProducts)
    const reduxFetchSoldOut = useSelector(state => state.product.fetchsoldOutProduct)

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
    const [onChangePriceStock, setonChangePriceStock] = useState(false);
    const reduxUser = useSelector(state => state.user)


    useEffect(() => {
        if (reduxUser && Object.keys(reduxUser).length) {
            if (reduxFetchSoldOut) {
                handleFetchProduct()
            }
        }
        return () => {
            setRefreshing(false)
            setAlertHapus(false);
            setshowAlert(false);
            setalertHapusDiskon(false);
            setTitleAlert('');
            setalertHapusVariasi(false)
            setspinner(false)
            actionSheetHargaStokRef.current?.setModalVisible(false)
        }
    }, [reduxFetchSoldOut]);

    const handleFetchProduct = async () => {
        setspinner(false)
        setitemPressed("")
        setproductOnpress({})
        try {
            let archiveProduct = await ServiceProduct.fetchSoldOutProduct(reduxSeller)
            if (archiveProduct) {
                dispatch({ type: 'SET_PRODUCTS_SOLDOUT', payload: archiveProduct })
                dispatch({ type: 'FETCH_SOLDOUT', payload: false })
            }
        } catch (error) {
            console.log("file: index.js ~ line 109 ~ handleFetchProduct ~ error", error)
        }
    }

    const onSelectionsChange = (selected) => {
        setselectectedItems(selected);
    };
    const renderLabel = (label) => {
        return (
            <TouchableOpacity
                onPress={() => alert('ahah')}
                style={[Style.row_0_space, Style.py_2, Style.my_2]}>
                <Text adjustsFontSizeToFit style={[Style.font_14, Style.semi_bold]}>{label}</Text>
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
                style={[styles.listvariasi, { backgroundColor: item.id_variasi === idVariasi ? Colors.silver : Colors.white }]}>
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

    const handleActionSheet = (e) => {
        setTitleAlert(e + productOnpress.nama_produk);
        actionSheetRef.current?.setModalVisible(false);
        if (e === 'gambar ') {
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

    const handleHapusProduk = () => {
        // disini nanti ada service untuk delete produk
        setAlertHapus(false);
    };



    const handleOptions = async (item) => {
        actionSheetRef.current?.setModalVisible();
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
        let obj = item.variasi[0];
        let arr = item.variasi;
        setvalVariasiAdd(obj);
        setproductOnpress(item);
        setidProduct(item.id_produk);
        setidVariasi(obj.id_variasi);
        setnamaprodukVariasi(item.nama_produk);
        setlistvariasi(item.variasi);
        let data = [];
        if (arr.lenght > 1) {
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
    };

    const handleRevisi = async (data) => {
        await actionSheetRef.current?.setModalVisible(false);
        navigation.navigate('ProdukEdit', {
            item: data ? data : productOnpress,
            revisi: true,
            revisiName: data.konfirmasi_produk[0].pelanggaran.split(","),
            alasan: data.konfirmasi_produk[0].alasan,
        });
    }
    const renderItem = ({ item }) => {
        if (shimmerProduct === true) {
            return <ShimmerProduct />
        } else {
            return (
                <Card key={item.id}
                    style={[styles.card, { backgroundColor: itemPressed === item.id_produk ? Colors.silver : 'white' }]}>
                    <TouchableOpacity onPress={() => item.status_produk === "blokir" ? handleRevisi(item) : navigation.navigate("ProdukPreview", { data: item })} style={styles.cardItem}>
                        <Card.Cover
                            style={[styles.cardImage, { opacity: item.jumlah_stok_in === "0" ? 0.4 : 1, backgroundColor: 'grey' }]}
                            source={{ uri: item.foto && item.foto[0] && item.foto[0].url_foto }}
                        />
                        <View style={styles.cardText}>
                            <View style={styles.cardParentTitle}>
                                <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.cardTitle]}>{item.nama_produk}</Text>
                                <Text adjustsFontSizeToFit style={styles.cardKondisi}>{item.kondisi}</Text>
                            </View>

                            <Text adjustsFontSizeToFit style={styles.cardHarga}>{item.variasi[0]?.harga_normal}</Text>
                            <Text adjustsFontSizeToFit style={[styles.cardHarga, { color: item.jumlah_stok_in && item.jumlah_stok_in > 0 ? Colors.blackLight : Colors.redPower }]}>{item.jumlah_stok_in && item.jumlah_stok_in > 0 ? 'Stok : ' + item.jumlah_stok_in : "Stok habis"}</Text>

                        </View>
                        {item.status_produk !== "blokir" ?
                            null :
                            <TouchableHighlight onPress={() => handleOptions(item)} style={{ width: '11%', justifyContent: 'flex-end' }}>
                                <IconButton
                                    style={{ margin: 0 }}
                                    icon={require('../../../icon/options.png')}
                                    color={Colors.biruJaja}
                                    size={25}
                                    onPress={() => handleOptions(item)}
                                />
                            </TouchableHighlight>
                        }
                    </TouchableOpacity>
                    {item.status_produk !== "blokir" ?
                        <View style={[Style.row_evenly, { paddingLeft: "0.5%" }]}>
                            <TouchableOpacity onPress={() => {
                                setproductOnpress(item)
                                actionSheetHargaStokRef.current?.setModalVisible(true)
                            }} style={{ borderRadius: 7, padding: '1%', width: '89%', marginRight: '1%', backgroundColor: Colors.biruJaja }}>
                                <Text style={[Style.font_12, Style.semi_bold, Style.text_center, { color: Colors.white }]}>Ubah stok dan harga</Text>
                            </TouchableOpacity>
                            <TouchableHighlight onPress={() => handleOptions(item)} style={{ width: '11%' }}>
                                <IconButton
                                    style={{ margin: 0 }}
                                    icon={require('../../../icon/options.png')}
                                    color={Colors.biruJaja}
                                    size={25}
                                    onPress={() => handleOptions(item)}
                                />
                            </TouchableHighlight>
                        </View>
                        : null}

                </Card>
            );
        }
    };
    const handleEditProduk = () => {
        if (productOnpress.status === "diblokir") {
            handleRevisi()
        } else {
            actionSheetRef.current?.setModalVisible(false);
            setTimeout(() => {
                navigation.navigate('ProdukEdit', {
                    item: productOnpress,
                });
            }, 150);
        }

    };
    const handleReview = () => {
        actionSheetRef.current?.setModalVisible(false);
        setTimeout(() => {
            navigation.navigate('ReviewProduk', {
                item: productOnpress.id_produk,
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
                            setspinner(true);
                            ServiceProduct.deleteProduct(idProduct).then((res) => {
                                if (res.status == 200) {
                                    handleFetchProduct()
                                    dispatch({ type: 'FETCH_LIVE', payload: true })
                                    dispatch({ type: 'FETCH_ARCHIVE', payload: true })
                                    dispatch({ type: 'FETCH_PRODUCTS', payload: true })
                                }
                            }).catch(error => console.log(String(error)));
                            actionSheetRef.current?.setModalVisible(false);

                            setTimeout(() => setspinner(false), 3000);


                        },
                    },
                ],
                { cancelable: false },
            );
        }
    };


    const handlePressDiskon = async () => {
        setspinner(true);
        let credentials = {
            'presentase_diskon': aturDiskon,
            'tgl_mulai_diskon': startDate,
            'tgl_berakhir_diskon': endDate,
        };

        if (selectectedItems.length > 1) {
            for (let value of variasi) {
                try {
                    let response = await ServiceProduct.aturDiskon(credentials, value.idVariasi ? value.idVariasi : value.id_variasi);
                    if (response.status === 200) {
                        ToastAndroid.show("Diskon berhasil ditambahkan", ToastAndroid.SHORT, ToastAndroid.CENTER)
                    } else {
                        ToastAndroid.show("Mohon maaf ada kesalahan teknis", ToastAndroid.LONG, ToastAndroid.CENTER)
                    }
                } catch (error) {
                    ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
                }
            }
            setTimeout(() => setspinner(false), 2500);

        } else {
            try {
                await ServiceProduct.aturDiskon(credentials, idVariasi);
                getProductById();
                actionSheetDiskon.current?.setModalVisible(false);
                setidVariasi("")
                ToastAndroid.show("Diskon berhasil ditambahkan", ToastAndroid.SHORT, ToastAndroid.CENTER)
            } catch (error) {
                ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
            }
            setTimeout(() => setspinner(false), 2500);
        }
    };
    const handleDeleteDiskon = async () => {
        setspinner(true);
        setalertHapusDiskon(false);
        try {
            let resDeleteDiskon = await ServiceProduct.deleteDiskon(idVariasi);
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
            let listVariasi = await ServiceProduct.getProductById(idProduct);
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
        handleFetchProduct()
        setTimeout(() => {
            setshimmerProduct(false)
        }, 2500);
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

    const handleActionsheetHargaStok = () => {
        handleFetchProduct()
        dispatch({ type: 'FETCH_LIVE', payload: true })
        dispatch({ type: 'FETCH_PRODUCTS', payload: true })
        dispatch({ type: 'FETCH_ARCHIVE', payload: true })
        actionSheetHargaStokRef.current?.setModalVisible(false)
    };

    const handleClosePriceStock = () => setonChangePriceStock(true)

    return (
        <View style={{ flex: 1 }}>
            {spinner ? <Loading /> : null}
            {reduxSoldOutProducts && reduxSoldOutProducts.length ?
                <View style={{ flex: 1, width: Wp('100%') }}>
                    <FlatList
                        nestedScrollEnabled={true}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        data={reduxSoldOutProducts.filter(res => res.jumlah_stok_in <= 0)}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id_produk}
                    />
                </View>
                :
                <ScrollView contentContainerStyle={{ flex: 1 }} refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                    <Text adjustsFontSizeToFit style={[Style.font_14, Style.text_center, Style.mt_5, Style.py_5]}>Tidak ada produk</Text>
                </ScrollView>
            }
            <ActionSheet containerStyle={styles.actionSheet} ref={actionSheetRef} onClose={() => onClose ? setitemPressed('') : null} >
                <ActionSheetProduct productOnpress={productOnpress} isEnabled={isEnabled} actionSheetRef={actionSheetRef} actionSheetDiskon={actionSheetDiskon} actionSheetGambar={actionSheetGambar} actionSheetListVariasi={actionSheetListVariasi} setTitleAlert={setTitleAlert} setonClose={setonClose} setspinner={setspinner} setitemPressed={setitemPressed} setproductOnpress={setproductOnpress} />
            </ActionSheet>
            <ActionSheetHargaStok closeOnTouchBackdrop={false} closeOnPressBack={false} containerStyle={styles.actionSheet} ref={actionSheetHargaStokRef} onClose={() => onClose ? setitemPressed('') & setonChangePriceStock(false) & setproductOnpress({}) : null} >
                <View style={styles.headerModal}>
                    <Text adjustsFontSizeToFit style={styles.headerTitle}>Ubah harga dan stok</Text>
                    <IconButton
                        style={{ margin: 0 }}
                        icon={require('../../../icon/close.png')}
                        color={Colors.biruJaja}
                        size={18}
                        onPress={() => {
                            if (onChangePriceStock) {
                                Alert.alert(
                                    'Peringatan!',
                                    'Anda ingin membuang perubahan ini?',
                                    [
                                        {
                                            text: 'BATAL',
                                            onPress: () => console.log("cancel"),
                                            style: 'IYA',
                                        },
                                        {
                                            text: 'Iya',
                                            onPress: () => {
                                                actionSheetHargaStokRef.current?.setModalVisible(false)
                                            },
                                        },
                                    ],
                                    { cancelable: false },
                                );
                            } else {
                                actionSheetHargaStokRef.current?.setModalVisible(false)
                            }
                        }}
                    />
                </View>
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '0%', marginBottom: '2%' }}>
                    <Text style={{ fontSize: 14, color: Colors.biruJaja, flex: 0, width: "55%" }}>Harga</Text>
                    <Text style={{ fontSize: 14, color: Colors.biruJaja, flex: 0, width: "30%" }}>Stok</Text>
                </View>


                <Ubah data={productOnpress.variasi} save={handleClosePriceStock} id={productOnpress.id_produk} handleActionSheet={handleActionsheetHargaStok} />

            </ActionSheetHargaStok>

            <ActionSheetDiskon
                footerHeight={11}
                containerStyle={Style.actionSheet}
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
                <View style={[Style.column]}>
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
                                    primary: Colors.biruJaja,
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

                <View style={{ height: 200, paddingHorizontal: Wp('2%') }}>
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
                containerStyle={[styles.actionSheet, { height: Hp('100%') }]}
                footerHeight={20}
                ref={actionSheetListVariasi}>
                <View style={styles.headerModal}>
                    <Text adjustsFontSizeToFit style={styles.headerTitle}>Variasi Produk</Text>
                    <IconButton
                        style={{ margin: 0, marginLeft: 10 }}
                        icon={require('../../../icon/close.png')}
                        color={Colors.blackLight}
                        size={18}
                        onPress={() =>
                            actionSheetListVariasi.current?.setModalVisible(false)
                        }
                    />
                </View>

                <View
                    style={{ flex: 9, paddingHorizontal: Wp('2%'), marginBottom: '2%' }}>
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
                        height: Hp('5%'),
                        paddingHorizontal: Wp('2%'),
                        marginBottom: '2%',
                    }}>
                    <Button
                        contentStyle={{ height: Hp('5%') }}
                        color={Colors.biruJaja}
                        labelStyle={{ color: Colors.white }}
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
            <ActionSheetLayout
                footerHeight={11}
                containerStyle={Style.actionSheet}
                ref={actionSheetLayout}>
                <View style={Style.actionSheetHeader}>
                    <Text adjustsFontSizeToFit style={Style.actionSheetTitle}>Atur Variasi</Text>
                    <TouchableOpacity
                        onPress={() => actionSheetLayout.current?.setModalVisible(false)}>
                        <Image
                            style={Style.actionSheetClose}
                            source={require('../../../icon/close.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={Style.column_center_start}>
                    <TouchableOpacity
                        onPress={() => handleEditVariasi()}
                        style={Style.appBarRow}>
                        <Text adjustsFontSizeToFit style={{ fontSize: 14 }}>Ubah Variasi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setalertHapusVariasi(true)}
                        style={Style.appBarRow}>
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
                        style={Style.appBarRow}>
                        <Text adjustsFontSizeToFit style={{ fontSize: 14 }}>Atur Diskon</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setalertHapusDiskon(true)}
                        style={Style.appBarRow}>
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
        </View >
    );
}


