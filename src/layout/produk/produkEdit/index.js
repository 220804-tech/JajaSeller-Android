import React, { useState, useEffect, createRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, TouchableNativeFeedback, FlatList, TextInput, StatusBar, BackHandler, ToastAndroid } from 'react-native';
import * as Service from '../../../service/Produk'
import { Button, Appbar, RadioButton, IconButton, Menu, Divider, Provider } from 'react-native-paper';
import ActionSheet from 'react-native-actionsheet';

import ActionSheetKategori from 'react-native-actions-sheet';
import ActionSheetSubKategori from 'react-native-actions-sheet';
import ActionSheetBrand from 'react-native-actions-sheet';
import ActionSheetPreorder from 'react-native-actions-sheet';
import ActionSheetDetail from 'react-native-actions-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import style from '../../../styles/style';
import AsyncStorage from '@react-native-community/async-storage';
import { Hp, Wp, Colors, Loading, Style } from '../../../export'
import { useSelector, useDispatch } from 'react-redux';
var qs = require('qs');

export default function ProdukEdit({ route }) {
    const reduxSeller = useSelector(state => state.user.seller.id_toko)
    const dispatch = useDispatch()

    const actionSheetRef = createRef();
    const kategoriRef = createRef();
    const subKategoriRef = createRef();
    const brandRef = createRef();
    const preorderRef = createRef();
    const detailRef = createRef();
    const [alasanRevisi, setalasanRevisi] = useState(route.params.alasan ? route.params.alasan : '')

    const [id_produk, setid_produk] = useState(route.params.item.id_produk)

    const [fotoOnPress, setfotoOnPress] = useState("")
    const [alertFoto, setalertFoto] = useState(route.params.revisi ? route.params.revisiName.map(e => e === 'foto' ? 'Foto yang digunakan tidak sesuai dengan ketentuan Jaja.id' : '') : '');

    const [nama_produk, setnama_produk] = useState(route.params.item.nama_produk);
    const [alertnamaProduk, setalertnamaProduk] = useState(route.params.revisi ? route.params.revisiName.map(e => e === 'nama' ? 'Nama yang digunakan tidak sesuai dengan ketentuan Jaja.id' : '') : '')
    const [id_kategori, setid_kategori] = useState("");

    const [ktColor, setktColor] = useState("#C0C0C0")
    const [sktColor, setsktColor] = useState("#C0C0C0")
    const [ktName, setktName] = useState(route.params.item.kategori)
    const [sktName, setsktName] = useState('Sub Kategori')
    const [showSubCategorys, setshowSubCategorys] = useState(false)
    const [id_sub_kategori, setid_sub_kategori] = useState("");
    const [alertTextKategori, setalertTextKategori] = useState("")

    const [brName, setbrName] = useState("Brand");
    const [brColor, setbrColor] = useState("#C0C0C0");
    const [brandId, setbrandId] = useState("");
    const [brands, setbrands] = useState("");
    const [alertTextBrand, setalertTextBrand] = useState("")

    const [asalProduk, setasalProduk] = useState("")
    const [apName, setapName] = useState("")
    const [alertAsalProduk, setAlertAsalProduk] = useState();
    const [checkedAsalproduk, setcheckedAsalproduk] = useState('4')

    const [kondisi, setkondisi] = useState("baru")
    const [alertkondisi, setAlertkondisi] = useState();
    const [checkedKondisi, setcheckedKondisi] = useState('first')

    const [deskripsi, setdeskripsi] = useState(route.params.item.deskripsi);
    const [alertTextDeskripsi, setalertTextDeskripsi] = useState(route.params.revisi ? route.params.revisiName.map(e => e === 'deskripsi' ? 'Deskripsi yang digunakan tidak sesuai dengan ketentuan Jaja.id' : '') : '');

    const [checkedPreorder, setcheckedPreorder] = useState('T')
    const [alertTextPreorder, setalertTextPreorder] = useState();
    const [masa_pengemasan, setmasa_pengemasan] = useState(7);
    const [mpData, setmpData] = useState([{ value: 7 }, { value: 8 }, { value: 9 }, { value: 10 }, { value: 11 }, { value: 12 }, { value: 13 }, { value: 14 }, { value: 15 }]);


    const [tipe_berat, settipe_berat] = useState("gram");
    const [berat, setberat] = useState(route.params.item.berat);
    const [ukuran_paket_panjang, setukuran_paket_panjang] = useState(route.params.item.ukuran_paket_panjang);
    const [ukuran_paket_lebar, setukuran_paket_lebar] = useState(route.params.item.ukuran_paket_lebar);
    const [ukuran_paket_tinggi, setukuran_paket_tinggi] = useState(route.params.item.ukuran_paket_tinggi);


    const [id_foto_1, setid_foto_1] = useState(route.params.item.foto[0] == undefined ? null : route.params.item.foto[0].id_foto);
    const [file_foto_1, setfile_foto_1] = useState(route.params.item.foto[0] == undefined ? null : route.params.item.foto[0])
    const [id_foto_2, setid_foto_2] = useState(route.params.item.foto[1] == undefined ? null : route.params.item.foto[1].id_foto);
    const [file_foto_2, setfile_foto_2] = useState(route.params.item.foto[1] == undefined ? null : route.params.item.foto[1])
    const [id_foto_3, setid_foto_3] = useState(route.params.item.foto[2] == undefined ? null : route.params.item.foto[2].id_foto);
    const [file_foto_3, setfile_foto_3] = useState(route.params.item.foto[2] == undefined ? null : route.params.item.foto[2])
    const [id_foto_4, setid_foto_4] = useState(route.params.item.foto[3] == undefined ? null : route.params.item.foto[3].id_foto);
    const [file_foto_4, setfile_foto_4] = useState(route.params.item.foto[3] == undefined ? null : route.params.item.foto[3])
    const [id_foto_5, setid_foto_5] = useState(route.params.item.foto[4] == undefined ? null : route.params.item.foto[4].id_foto);
    const [file_foto_5, setfile_foto_5] = useState(route.params.item.foto[4] == undefined ? null : route.params.item.foto[4])

    const [voucher, setvoucher] = useState("");
    const [idvoucher, setidvoucher] = useState('');

    const [namavoucher, setnamavoucher] = useState('');
    const [kuotaVoucher, setkuotaVoucher] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [idsubKategori, setidsubKategori] = useState("")
    const [idKategori, setidKategori] = useState("")


    const [kategoriTitle, setkategoriTitle] = useState('Diskon Nominal');
    const [diskon, setDiskon] = useState(null);
    const [lengtDiskon, setlengtDiskon] = useState(8)

    const [loading, setloading] = useState(false)

    const [alertTextKuota, setalertTextKuota] = useState("")

    const [alertTextStartDate, setalertTextStartDate] = useState("")
    const [alertTextEndDate, setalertTextEndDate] = useState("")
    const [alertTextDiskon, setalertTextDiskon] = useState("")
    const [alertTextError, setalertTextError] = useState("")


    const [kategoriLabel, setkategoriLabel] = useState('Contoh : Rp. 10.000');

    const [showButton, setshowButton] = useState(false);
    const [checked, setChecked] = useState('first');
    const [checkedd, setCheckedd] = useState('first');
    const [showdropdown, setshowdropdown] = useState(true);


    const navigation = useNavigation();

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setselectedDate] = useState('start');
    const [visible, setVisible] = React.useState(false);

    const [kodePromo, setkodePromo] = useState("")
    const [categorys, setcategorys] = useState([])
    const [subCategorys, setsubCategorys] = useState([])
    const [toko, settoko] = useState("")
    const [sbColor, setsbColor] = useState(Colors.biruJaja)
    // const [sku, sku] = useState('');


    const { item, revisi } = route.params;
    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);
    const showDatePicker = (text) => {
        if (text === 'end') {
            setselectedDate('end');
            setalertTextEndDate("")
        } else {
            setselectedDate('start');
            setalertTextStartDate("")
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

    const handlePickImageFromCamera = () => {
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true,
            includeBase64: true
        }).then((image) => {
            // actionSheetRef.current?.setModalVisible(false)
            setalertFoto("")
            if (fotoOnPress == 1) setfile_foto_1({ 'url_foto': image.path, 'data': image.data })
            if (fotoOnPress == 2) setfile_foto_2({ 'url_foto': image.path, 'data': image.data })
            if (fotoOnPress == 3) setfile_foto_3({ 'url_foto': image.path, 'data': image.data })
            if (fotoOnPress == 4) setfile_foto_4({ 'url_foto': image.path, 'data': image.data })
            if (fotoOnPress == 5) setfile_foto_5({ 'url_foto': image.path, 'data': image.data })
        });

    };
    const handlePickImageFromGalery = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            includeBase64: true
        }).then((image) => {
            // actionSheetRef.current?.setModalVisible(false)
            setalertFoto("")
            if (fotoOnPress == 1) setfile_foto_1({ 'url_foto': image.path, 'data': image.data })
            if (fotoOnPress == 2) setfile_foto_2({ 'url_foto': image.path, 'data': image.data })
            if (fotoOnPress == 3) setfile_foto_3({ 'url_foto': image.path, 'data': image.data })
            if (fotoOnPress == 4) setfile_foto_4({ 'url_foto': image.path, 'data': image.data })
            if (fotoOnPress == 5) setfile_foto_5({ 'url_foto': image.path, 'data': image.data })
        });
    };

    const onchangeText = (text, name) => {
        if (name === "namaProduk") {
            setnama_produk(regexChar(text, "charNumberAlpha"))
            setalertnamaProduk("")
        } else if (name === "deskripsi") {
            setdeskripsi(text)
            setalertTextDeskripsi("")
        }

        if (namavoucher !== "" && kuotaVoucher !== "" && startDate !== "" && endDate !== "") {
            setshowButton(true)
        }
    }

    const regexChar = (text, name) => {
        if (name === "charNumberAlpha") {
            return (text.replace(/[^a-z0-9 ~|/-]/gi, ''))
        } else if (name === 'date') {
            return (text.replace(/[^-0-9]/gi, ''))
        } else if (name === 'number') {
            return (text.replace(/[^0-9]/gi, ''))
        }
    }

    const handleActionSheet = (text) => {
        if (text === "kategori") {
            kategoriRef.current?.setModalVisible();
        } else if (text === "subKategori") {
            subKategoriRef.current?.setModalVisible();
        } else if (text === "brand") {
            brandRef.current?.setModalVisible();
        } else if (text === "preorder") {
            preorderRef.current?.setModalVisible();
        }
    }

    const getItem = async () => {
        await Service.getKategori().then(res => {
            setcategorys(res.kategori)
            let arrsubCategorys = res.sub_kategori;
            // arrsubCategorys.sort()
            for (const ktgry of res.kategori) {
                if (ktgry.sub_kategori && ktgry.sub_kategori.length && ktgry.kategori == route.params.item.kategori) {
                    setsubCategorys(ktgry.sub_kategori.sort())
                }
            }
        })
        await Service.getBrand().then(res => {
            setbrands(res.brand)
        })
        await AsyncStorage.getItem('xxTwo').then((toko) => {
            settoko(JSON.parse(toko))
        });
    }

    const setState = () => {
        const { item } = route.params
        setid_kategori(item.id_kategori)

        if (item.sub_kategori != null) {
            setshowSubCategorys(true)
            setsktName(item.sub_kategori)
            setsktColor('#454545')
            setid_sub_kategori(item.id_sub_kategori)
        }
        setbrName(item.merek)
        setbrColor('#454545')
        setbrandId(item.id_merek)


    }
    useEffect(() => {
        if (route.params.item) {
            setState()
        }
        console.log("🚀 ~ file: index.js ~ line 265 ~ useEffect ~ route.params", route.params)

        setloading(false);
        setsbColor(Colors.biruJaja);
        setalertTextError("");
        getItem();


        const backAction = () => {
            navigation.goBack()
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, [])

    const renderCategorys = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleValueDropdown("kategori", item)} style={styles.touchKategori}>
                <Text style={styles.textKategori}>{item.kategori}</Text>
            </TouchableOpacity >
        )
    }

    const renderSubCategorys = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleValueDropdown("subKategori", item)} style={styles.touchKategori}>
                <Text style={styles.textKategori}>{item.sub_kategori}</Text>
            </TouchableOpacity >
        )
    }
    const renderBrand = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleValueDropdown("brand", item)} style={styles.touchKategori}>
                <Text style={styles.textKategori}>{item.merek}</Text>
            </TouchableOpacity >
        )
    }
    const renderPreorder = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleValueDropdown("preorder", item)} style={styles.touchKategori}>
                <Text style={styles.textKategori}>{item.value} Hari</Text>
            </TouchableOpacity >
        )
    }
    const handleValueDropdown = (text, val) => {

        if (text === "kategori") {
            kategoriRef.current?.setModalVisible(false)
            let arrsubCategorys = val.sub_kategori;
            arrsubCategorys.sort()
            setsubCategorys(arrsubCategorys)
            setidKategori(val.id_kategori)
            setid_kategori(val.id_kategori)
            setktName(val.kategori)
            setktColor("#454545")
            setsktColor("#C0C0C0")
            setsktName("Sub Kategori")
            setidsubKategori("")
            setalertTextKategori("")
            let arr = val.sub_kategori
            if (arr.length == 0) {
                setshowSubCategorys(false)
            } else {
                setshowSubCategorys(true)
            }
        } else if (text === "subKategori") {
            setidsubKategori(val.id_sub_kategori)
            setid_sub_kategori(val.id_sub_kategori)
            console.log("handleValueDropdown -> val.id_sub_kategori", val.id_sub_kategori)
            setsktName(val.sub_kategori)
            setsktColor("#454545")
            setalertTextKategori("")

            subKategoriRef.current?.setModalVisible(false)
        } else if (text === "brand") {
            setbrColor('#454545')
            setbrName(val.merek)
            setbrandId(val?.id_data)
            brandRef.current?.setModalVisible(false)

        } else if (text === 'preorder') {
            setmasa_pengemasan(val.value)
            preorderRef.current?.setModalVisible();

        }
    }
    const handleSimpan = async () => {

        if (file_foto_1 === null && file_foto_2 === null && file_foto_3 === null && file_foto_4 === null && file_foto_5 === null) {
            setalertFoto("Masukkan foto minimal 1!")
        } else if (nama_produk === "") {
            setalertnamaProduk("Nama produk tidak boleh kosong!")
        } else if (ktName === "Kategori" && id_kategori === "") {
            setalertTextKategori("Kategori tidak boleh kosong!")
        } else if (showSubCategorys === true && id_sub_kategori === "") {
            setalertTextKategori("Sub kategori tidak boleh kosong!")
        } else if (deskripsi === "") {
            setalertTextDeskripsi("Deskripsi produk tidak boleh kosong!")
        } else if (alertFoto && alertnamaProduk && alertTextDeskripsi) {
            console.log("gagal")
            ToastAndroid.show("Periksa kembali tulisan yang berwarna merah!", ToastAndroid.LONG, ToastAndroid.CENTER)

        }
        else {
            setloading(true)
            setsbColor('rgba(0, 0, 0, 0.50)')
            let credentials = qs.stringify({
                'nama_produk': nama_produk,
                'id_kategori': id_kategori,
                'id_sub_kategori': id_sub_kategori,
                'deskripsi': deskripsi,
                'merek': brandId,
                'tipe_berat': 'gram',
                'berat': berat,
                'ukuran_paket_panjang': ukuran_paket_panjang,
                'ukuran_paket_lebar': ukuran_paket_lebar,
                'ukuran_paket_tinggi': ukuran_paket_tinggi,
                'asal_produk': checkedAsalproduk,
                'kondisi': kondisi,
                'pre_order': checkedPreorder,
                'masa_pengemasan': masa_pengemasan,
                'id_foto_1': id_foto_1,
                'file_foto_1': file_foto_1 != null ? file_foto_1.data != undefined ? file_foto_1.data : file_foto_1.foto : null,
                'id_foto_2': id_foto_2,
                'file_foto_2': file_foto_2 != null ? file_foto_2.data != undefined ? file_foto_2.data : file_foto_2.foto : null,
                'id_foto_3': id_foto_3,
                'file_foto_3': file_foto_3 != null ? file_foto_3.data != undefined ? file_foto_3.data : file_foto_3.foto : null,
                'id_foto_4': id_foto_4,
                'file_foto_4': file_foto_4 != null ? file_foto_4.data != undefined ? file_foto_4.data : file_foto_4.foto : null,
                'id_foto_5': id_foto_5,
                'file_foto_5': file_foto_5 != null ? file_foto_5.data != undefined ? file_foto_5.data : file_foto_5.foto : null,
            })

            try {
                let statusEdit = route.params.revisi ? route.params.revisi : "";
                await Service.editProduct(credentials, id_produk, statusEdit);
                handleFetcHproduct()
                setTimeout(() => {
                    setloading(false)
                    navigation.goBack("Produk")
                    setsbColor(Colors.biruJaja)
                }, 1000);
            } catch (error) {
                console.log("index -> error", error)
                setloading(false)
                setsbColor(Colors.biruJaja)

            }
        }
    }
    const handleFetcHproduct = async () => {
        try {
            dispatch({ type: 'FETCH_PRODUCTS', payload: true })
            dispatch({ type: 'FETCH_LIVE', payload: true })
            dispatch({ type: 'FETCH_ARCHIVE', payload: true })
            dispatch({ type: 'FETCH_SOLDOUT', payload: true })
        } catch (error) {
            console.log("file: index.js ~ line 108 ~ handleFetcHproduct ~ error", error)
        }
    }

    return (
        <SafeAreaView style={Style.container}>
            <StatusBar translucent={false} backgroundColor={sbColor} barStyle="light-content" />
            {loading ? <Loading /> : null}
            <Appbar.Header style={Style.appBar}>
                <TouchableOpacity style={{ marginRight: Wp('1%') }} onPress={() => navigation.goBack()}>
                    <Image style={Style.arrowBack} source={require('../../../icon/arrow.png')} />
                </TouchableOpacity>
                <View style={Style.row_start_center}>
                    <Text style={Style.appBarText}>Ubah produk</Text>
                </View>
                {!showButton ?
                    <TouchableOpacity onPress={() => handleSimpan()} style={Style.row_end_center}>
                        <Text style={Style.appBarButton}>SIMPAN</Text>
                    </TouchableOpacity>
                    : null
                }
            </Appbar.Header>
            <View style={Style.containeriOS}>
                {!route.params.revisi ? null :
                    <View style={{ width: '100%', flexDirection: 'column', marginBottom: '2%', backgroundColor: Colors.kuningWarning, padding: '4%' }}>
                        <Text style={{ color: Colors.redPower, fontFamily: 'Poppins-SemiBold' }}>Pelanggaran produk!</Text>
                        <Text style={{ color: Colors.blackgrayScale, fontFamily: 'Poppins-Regular' }}>{alasanRevisi}</Text>
                    </View>
                }
                <ScrollView style={styles.flexColumn} nestedScrollEnabled={true}>
                    <Text style={styles.label}>
                        Foto Produk<Text style={styles.red}> *</Text>
                    </Text>

                    <ScrollView contentContainerStyle={styles.scrollImage} showsHorizontalScrollIndicator={false} horizontal={true} nestedScrollEnabled={true}>
                        {file_foto_1 != null ?
                            <View style={[styles.boxImage, { marginRight: Wp('5%') }]}>
                                <Image style={styles.picture} source={{ uri: file_foto_1.url_foto }} />
                                <TouchableOpacity style={styles.circleXIcon} onPress={() => setfile_foto_1(null)}>
                                    <Image style={styles.XIcon} source={require('../../../icon/close.png')} />
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={[styles.boxImage, { marginRight: Wp('5%') }]}>
                                <TouchableOpacity onPress={() => setfotoOnPress(1) & actionSheetRef.current.show()} style={styles.iconImage}>
                                    <Image style={{ width: '60%', height: '60%', marginTop: '-10%' }} source={require('../../../icon/coin-utama.png')} />
                                    <Text style={{ fontSize: 12, color: Colors.blackgrayScale, position: 'absolute', bottom: 2 }}>Utama</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        {file_foto_2 != null ?
                            <View style={[styles.boxImage, { marginRight: Wp('5%') }]}>
                                <Image style={styles.picture} source={{ uri: file_foto_2.url_foto }} />
                                <TouchableOpacity style={styles.circleXIcon} onPress={() => setfile_foto_2(null)}>
                                    <Image style={styles.XIcon} source={require('../../../icon/close.png')} />
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={[styles.boxImage, { marginRight: Wp('5%') }]}>
                                <TouchableOpacity onPress={() => setfotoOnPress(2) & actionSheetRef.current.show()} style={styles.iconImage}>
                                    <Image style={{ width: '60%', height: '60%', marginTop: '-10%' }} source={require('../../../icon/coin-depan.png')} />
                                    <Text style={{ fontSize: 12, color: Colors.blackgrayScale, position: 'absolute', bottom: 2 }}>Depan</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        {file_foto_3 != null ?
                            <View style={[styles.boxImage, { marginRight: Wp('5%') }]}>
                                <Image style={styles.picture} source={{ uri: file_foto_3.url_foto }} />

                                <TouchableOpacity style={styles.circleXIcon} onPress={() => setfile_foto_3(null)}>
                                    <Image style={styles.XIcon} source={require('../../../icon/close.png')} />
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={[styles.boxImage, { marginRight: Wp('5%') }]}>
                                <TouchableOpacity onPress={() => setfotoOnPress(3) & actionSheetRef.current.show()} style={styles.iconImage}>
                                    <Image style={{ width: '60%', height: '60%', marginTop: '-10%' }} source={require('../../../icon/coin-atas.png')} />
                                    <Text style={{ fontSize: 12, color: Colors.blackgrayScale, position: 'absolute', bottom: 2 }}>Atas</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        {file_foto_4 != null ?
                            <View style={[styles.boxImage, { marginRight: Wp('5%') }]}>
                                <Image style={styles.picture} source={{ uri: file_foto_4.url_foto }} />
                                <TouchableOpacity style={styles.circleXIcon} onPress={() => setfile_foto_4(null)}>
                                    <Image style={styles.XIcon} source={require('../../../icon/close.png')} />
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={[styles.boxImage, { marginRight: Wp('5%') }]}>
                                <TouchableOpacity onPress={() => setfotoOnPress(4) & actionSheetRef.current.show()} style={styles.iconImage}>
                                    <Image style={{ width: '60%', height: '60%', marginTop: '-10%' }} source={require('../../../icon/coin-belakang.png')} />
                                    <Text style={{ fontSize: 12, color: Colors.blackgrayScale, position: 'absolute', bottom: 2 }}>Belakang</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        {file_foto_5 != null ?
                            <View style={[styles.boxImage, { marginRight: Wp('5%') }]}>
                                <Image style={styles.picture} source={{ uri: file_foto_5.url_foto }} />
                                <TouchableOpacity style={styles.circleXIcon} onPress={() => setfile_foto_5(null)}>
                                    <Image style={styles.XIcon} source={require('../../../icon/close.png')} />
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={[styles.boxImage, { marginRight: Wp('5%') }]}>
                                <TouchableOpacity onPress={() => setfotoOnPress(5) & actionSheetRef.current.show()} style={styles.iconImage}>
                                    <Image style={{ width: '60%', height: '60%', marginTop: '-10%' }} source={require('../../../icon/coin-samping.png')} />
                                    <Text style={{ fontSize: 12, color: Colors.blackgrayScale, position: 'absolute', bottom: 2 }}>Samping</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </ScrollView>
                    <Text style={[Style.smallTextAlertError, { color: 'red' }]}>
                        {alertFoto}
                    </Text>
                    <Text style={styles.label}>
                        Nama Produk
                        <Text style={styles.red}> *</Text>
                    </Text>
                    <TextInput
                        style={styles.inputbox}
                        placeholder=""
                        value={nama_produk}
                        maxLength={50}
                        onChangeText={(text) => onchangeText(text, "namaProduk")}
                        theme={{ colors: { primary: Colors.biruJaja } }}
                    />
                    <Text style={Style.smallTextAlertError}>
                        {alertnamaProduk}
                    </Text>
                    <View style={styles.flexRow}>
                        <Text style={[styles.label, { flex: 1 }]}>
                            Kategori<Text style={styles.red}> *</Text>
                        </Text>
                        {showSubCategorys ?
                            <Text style={[styles.label, { flex: 1 }]}>
                                Sub Kategori<Text style={styles.red}> *</Text>
                            </Text>
                            :
                            <Text style={styles.label}>
                                <Text></Text>
                            </Text>
                        }
                    </View>
                    <View style={[styles.flexRow, { paddingVertical: '2%' }]}>
                        <View style={styles.viewText}>
                            <Text style={[styles.textInput]}>{ktName}</Text>
                            <IconButton
                                style={{ margin: 0 }}
                                icon={require('../../../icon/down-arrow.png')}
                                color={Colors.biruJaja}
                                size={22}
                                onPress={() => handleActionSheet("kategori")}
                            />
                        </View>

                        {showSubCategorys ?
                            <View style={styles.viewText}>
                                <Text style={[styles.textInput, { color: sktColor }]}>{sktName}</Text>
                                <IconButton
                                    style={{ margin: 0 }}
                                    icon={require('../../../icon/down-arrow.png')}
                                    color={Colors.biruJaja}
                                    size={22}
                                    onPress={() => handleActionSheet("subKategori")}
                                />
                            </View>
                            :
                            null
                        }
                    </View>
                    <Text style={[Style.smallTextAlertError, { color: 'red' }]}>
                        {alertTextKategori}
                    </Text>

                    <Text style={styles.label}>
                        Brand<Text style={styles.red}> *</Text>
                    </Text>
                    <View style={[styles.flexRow, { paddingVertical: '2%' }]}>
                        <View style={styles.viewText}>
                            <Text style={[styles.textInput, { color: brColor }]}>{brName}</Text>
                            <IconButton
                                style={{ margin: 0 }}
                                icon={require('../../../icon/down-arrow.png')}
                                color={Colors.biruJaja}
                                size={22}
                                onPress={() => handleActionSheet("brand")}
                            />
                        </View>

                    </View>
                    <Text style={[Style.smallTextAlertError, { color: 'red' }]}>
                        {alertTextBrand}
                    </Text>
                    {/* <Text style={styles.label}>
                    SKU Produk
                    <Text style={styles.red}> *</Text>
                </Text>
                <TextInput
                    style={styles.inputbox}
                    placeholder=""
                    value={nama_produk}
                    maxLength={50}
                    onChangeText={(text) => onchangeText(text, "namaProduk")}
                    theme={{ colors: { primary: Colors.biruJaja } }}
                /> */}
                    <Text style={styles.label}>
                        Asal Produk
                        <Text style={styles.red}> *</Text>
                    </Text>
                    <View style={styles.flexRow}>
                        <View style={styles.radioItem}>
                            <RadioButton
                                color={Colors.biruJaja}
                                value="4"
                                status={checkedAsalproduk === '4' ? 'checked' : 'unchecked'}
                                onPress={() => setcheckedAsalproduk('4')}
                            />
                            <Text style={styles.textradio}>Dalam Negri</Text>
                        </View>
                        <View style={styles.radioItem}>
                            <RadioButton
                                color={Colors.biruJaja}
                                value="5"
                                status={checkedAsalproduk === '5' ? 'checked' : 'unchecked'}
                                onPress={() => setcheckedAsalproduk('5')}
                            />
                            <Text style={styles.textradio}>Luar Negri</Text>
                        </View>
                    </View>
                    <Text style={styles.smallTextAlertError}>
                        {alertAsalProduk}
                    </Text>
                    <Text style={styles.label}>
                        Kondisi
                        <Text style={styles.red}> *</Text>
                    </Text>
                    <View style={styles.flexRow}>
                        <View style={styles.radioItem}>
                            <RadioButton
                                color={Colors.biruJaja}
                                value="first"
                                status={checkedKondisi === 'first' ? 'checked' : 'unchecked'}
                                onPress={() => setcheckedKondisi('first') & setkondisi("baru")}
                            />
                            <Text style={styles.textradio}>Baru</Text>
                        </View>
                        <View style={styles.radioItem}>
                            <RadioButton
                                color={Colors.biruJaja}
                                value="second"
                                status={checkedKondisi === 'second' ? 'checked' : 'unchecked'}
                                onPress={() => setcheckedKondisi('second') & setkondisi("pernah dipakai")}
                            />
                            <Text style={styles.textradio}>Pernah Dipakai</Text>
                        </View>
                    </View>
                    <Text style={styles.smallTextAlertError}>
                        {alertkondisi}
                    </Text>
                    <Text style={styles.label}>
                        Pre Order
                        <Text style={styles.red}> *</Text>
                    </Text>
                    <View style={styles.flexRow}>
                        <View style={styles.radioItem}>
                            <RadioButton
                                color={Colors.biruJaja}
                                value="first"
                                status={checkedPreorder === 'T' ? 'checked' : 'unchecked'}
                                onPress={() => setcheckedPreorder('T')}
                            />
                            <Text style={styles.textradio}>Tidak</Text>
                        </View>
                        <View style={styles.radioItem}>
                            <RadioButton
                                color={Colors.biruJaja}
                                value="second"
                                status={checkedPreorder === 'Y' ? 'checked' : 'unchecked'}
                                onPress={() => setcheckedPreorder('Y')}
                            />
                            <Text style={styles.textradio}>Ya</Text>
                        </View>
                    </View>
                    {checkedPreorder === "T" ?
                        null :
                        <>
                            <Text style={styles.label}>
                                Masa Pengemasan<Text style={styles.red}> *</Text>
                            </Text>

                            <View style={[styles.flexRow, { paddingVertical: '2%' }]}>
                                <View style={styles.viewText}>
                                    <Text style={[styles.textInput, { color: '#454545' }]}>{masa_pengemasan} Hari</Text>
                                    <IconButton
                                        style={{ margin: 0 }}
                                        icon={require('../../../icon/down-arrow.png')}
                                        color={Colors.biruJaja}
                                        size={22}
                                        onPress={() => handleActionSheet("preorder")}
                                    />
                                </View>
                            </View>
                            <Text style={[Style.smallTextAlertError, { color: 'red' }]}>
                                {alertTextPreorder}
                            </Text>
                        </>
                    }
                    <Text style={styles.label}>
                        Deskripsi<Text style={styles.red}> *</Text>
                    </Text>
                    <TextInput
                        multiline={true}
                        textAlignVertical="top"
                        maxHeight={222}
                        maxLength={3000}
                        value={deskripsi}
                        onChangeText={(text) => onchangeText(text, "deskripsi")}
                        style={styles.inputbox}
                    />
                    <Text style={[Style.smallTextAlertError]}>
                        {alertTextDeskripsi}
                    </Text>
                    <View style={Style.row_space}>
                        <Text style={styles.label}>
                            Spesifikasi Produk<Text style={styles.red}> *</Text>
                        </Text>
                        <Text onPress={() => detailRef.current?.setModalVisible()} style={{ color: Colors.biruJaja, fontSize: 13 }}>Ubah</Text>
                    </View>
                    <View style={[Style.row_space, { marginBottom: '3%' }]}>
                        <View style={[Style.column, { marginTop: '2%' }]}>
                            <Text style={styles.labelTitle}>Berat</Text>
                            <Text style={styles.textItem}>{berat} {tipe_berat}</Text>
                        </View>
                        <View style={[Style.column, { marginTop: '2%' }]}>
                            <Text style={styles.labelTitle}>Panjang</Text>
                            <Text style={styles.textItem}>{ukuran_paket_panjang} cm</Text>
                        </View>
                        <View style={[Style.column, { marginTop: '2%' }]}>
                            <Text style={styles.labelTitle}>Lebar</Text>
                            <Text style={styles.textItem}>{ukuran_paket_lebar} cm</Text>
                        </View>
                        <View style={[Style.column, { marginTop: '2%' }]}>
                            <Text style={styles.labelTitle}>Tinggi</Text>
                            <Text style={styles.textItem}>{ukuran_paket_tinggi} cm</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <ActionSheet
                ref={actionSheetRef}
                title={'Select a Photo'}
                options={['Take Photo', 'Choose Photo Library', 'Cancel']}
                cancelButtonIndex={2}
                destructiveButtonIndex={1}
                onPress={(index) => {
                    if (index == 0) {
                        handlePickImageFromCamera();
                    } else if (index == 1) {
                        handlePickImageFromGalery();
                    } else {
                        null;
                    }
                }} />

            <ActionSheetKategori
                scrollEnabled={true}
                extraScroll={100}
                containerStyle={styles.actionSheet}
                ref={kategoriRef}>
                <View style={styles.headerModal}>
                    <Text style={styles.headerTitle}>Kategori Produk</Text>
                    <IconButton
                        style={{ margin: 0 }}
                        icon={require('../../../icon/close.png')}
                        color={Colors.biruJaja}
                        size={18}
                        onPress={() => kategoriRef.current?.setModalVisible(false)}
                    />
                </View>
                <View style={{ height: 200, paddingHorizontal: Wp('2%') }}>
                    <ScrollView style={{ flex: 1 }}
                        nestedScrollEnabled={true}
                        scrollEnabled={true}>
                        <FlatList
                            nestedScrollEnable={true}
                            data={categorys}
                            renderItem={renderCategorys}
                            keyExtractor={itm => itm.id_kategori}
                        />

                    </ScrollView>
                </View>
            </ActionSheetKategori>
            <ActionSheetSubKategori scrollEnabled={true} extraScroll={100} containerStyle={styles.actionSheet}
                ref={subKategoriRef}>
                <View style={styles.headerModal}>
                    <Text style={styles.headerTitle}>Sub Kategori</Text>
                    <IconButton
                        style={{ margin: 0 }}
                        icon={require('../../../icon/close.png')}
                        color={Colors.biruJaja}
                        size={18}
                        onPress={() => subKategoriRef.current?.setModalVisible(false)}
                    />
                </View>
                <View style={{ height: 200, paddingHorizontal: Wp('2%') }}>
                    <ScrollView style={{ flex: 1 }}
                        nestedScrollEnabled={true}
                        scrollEnabled={true}>
                        <FlatList
                            nestedScrollEnable={true}
                            data={subCategorys}
                            renderItem={renderSubCategorys}
                            keyExtractor={itm => itm.id_sub_kategori}
                        />
                    </ScrollView>
                </View>
            </ActionSheetSubKategori>
            <ActionSheetBrand scrollEnabled={true} extraScroll={100} containerStyle={styles.actionSheet}
                ref={brandRef}>
                <View style={styles.headerModal}>
                    <Text style={styles.headerTitle}>Merek Produk (Brand)</Text>
                    <IconButton
                        style={{ margin: 0 }}
                        icon={require('../../../icon/close.png')}
                        color={Colors.biruJaja}
                        size={18}
                        onPress={() => brandRef.current?.setModalVisible(false)}
                    />
                </View>

                <View style={{ height: 200, paddingHorizontal: Wp('2%') }}>
                    <ScrollView style={{ flex: 1 }}
                        nestedScrollEnabled={true}
                        scrollEnabled={true}>
                        <FlatList
                            nestedScrollEnable={true}
                            data={brands}
                            renderItem={renderBrand}
                            keyExtractor={itm => itm?.id_data}
                        />
                    </ScrollView>
                </View>
            </ActionSheetBrand>
            <ActionSheetPreorder scrollEnabled={true} extraScroll={100} containerStyle={styles.actionSheet}
                ref={preorderRef}>
                <View style={styles.headerModal}>
                    <Text style={styles.headerTitle}>Masa Pengemasan</Text>
                    <IconButton
                        style={{ margin: 0 }}
                        icon={require('../../../icon/close.png')}
                        color={Colors.biruJaja}
                        size={18}
                        onPress={() => preorderRef.current?.setModalVisible(false)}
                    />
                </View>
                <View style={{ height: 200, paddingHorizontal: Wp('2%') }}>
                    <ScrollView style={{ flex: 1 }}
                        nestedScrollEnabled={true}
                        scrollEnabled={true}>
                        <FlatList
                            nestedScrollEnable={true}
                            data={mpData}
                            renderItem={renderPreorder}
                            keyExtractor={itm => itm?.id_data}
                        />
                    </ScrollView>
                </View>
            </ActionSheetPreorder>
            <ActionSheetDetail scrollEnabled={true} extraScroll={100} containerStyle={styles.actionSheet}
                ref={detailRef}>
                <View style={[styles.headerModal, { flex: 0 }]}>
                    <Text style={styles.headerTitle}>Detail Barang</Text>
                    <IconButton
                        style={{ margin: 0 }}
                        icon={require('../../../icon/close.png')}
                        color={Colors.biruJaja}
                        size={18}
                        onPress={() => detailRef.current?.setModalVisible(false)}
                    />
                </View>
                <View style={styles.ukuranItem}>
                    <Text style={styles.labelUkuran}>
                        Berat<Text style={styles.red}> *</Text>
                    </Text>
                    <Text style={styles.labelUkuran}>
                        {/* Tipe Berat<Text style={styles.red}> *</Text> */}
                    </Text>
                </View>

                <View style={styles.ukuranItem}>
                    <View style={styles.viewText}>
                        <TextInput
                            maxLength={5}
                            keyboardType="number-pad"
                            placeholder="0"
                            value={berat}
                            onChangeText={(text) => setberat(text)}
                        />
                    </View>
                    <View style={styles.viewText}>
                        <Text style={styles.textInput}>{tipe_berat}</Text>
                    </View>
                </View>
                <Text style={styles.smallText}>
                    Masukkan berat yan sesuai dengan produkmu
                </Text>
                <View style={styles.flex0Row}>
                    <Text style={styles.labelUkuran}>Panjang</Text>
                    <Text style={styles.labelUkuran}>Lebar</Text>
                    <Text style={styles.labelUkuran}>Tinggi</Text>
                </View>
                <View style={styles.flex0Row}>
                    <View style={styles.ukuranItem}>
                        <TextInput
                            maxLength={5}
                            keyboardType="numeric"
                            placeholder="0"
                            value={ukuran_paket_panjang}
                            onChangeText={(text) => setukuran_paket_panjang(text)}
                            style={styles.inputText}
                        />
                        <Text style={{ alignSelf: 'center', marginLeft: '3%' }}>
                            cm
                        </Text>
                    </View>
                    <View style={styles.ukuranItem}>
                        <TextInput
                            maxLength={5}
                            keyboardType="numeric"
                            placeholder="0"
                            value={ukuran_paket_lebar}
                            onChangeText={(text) => setukuran_paket_lebar(text)}
                            style={styles.inputText}
                        />
                        <Text style={{ alignSelf: 'center', marginLeft: '3%' }}>
                            cm
                        </Text>
                    </View>
                    <View style={styles.ukuranItem}>
                        <TextInput
                            maxLength={5}
                            keyboardType="numeric"
                            placeholder="0"
                            value={ukuran_paket_tinggi}
                            onChangeText={(text) => setukuran_paket_tinggi(text)}
                            style={styles.inputText}
                        />
                        <Text style={{ alignSelf: 'center', marginLeft: '3%' }}>
                            cm
                        </Text>
                    </View>
                </View>
                <Text style={styles.smallText}>
                    Input detail barang sesuai produkmu!
                </Text>
            </ActionSheetDetail>
            {/* <AwesomeAlert
        show={showAlert}
        shoWprogress={false}
        title="AwesomeAlert"
        message="I have a message for you!"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No, cancel"
        confirmText="Yes, delete it"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          setshowAlert(false)
        }}
        onConfirmPressed={() => {
          hideAlert();
        }}
      /> */}
        </SafeAreaView >
    );


}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        // backgroundColor: 'white'
    },
    flexRow: {
        flex: 0,
        flexDirection: 'row',
    },
    flexColumn: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: Wp('5%'),
        // paddingTop: Wp('5%')
    },
    flexLine: {
        flex: 0,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.biruJaja,
    },
    appBar: {
        backgroundColor: '#64B0C9',
        height: Hp('5%'),
        color: 'white',
        paddingHorizontal: Wp('5%'),
        marginBottom: Hp('1%'),
        flexDirection: 'row'
    },
    iconHeader: {
        width: 50,
    },
    appBarIcon: {
        tintColor: Colors.white,
        width: 27,
        height: 27,
    },
    label: {
        fontSize: 13,
        fontFamily: 'Poppins-SemiBold',
        marginTop: '3%',
        color: Colors.blackLight,
    },
    red: {
        color: 'red',
        fontFamily: 'Poppins-SemiBold',
    },
    inputbox: {
        width: Wp('90%'),
        backgroundColor: 'transparent',
        color: 'black'
        // marginBottom: Hp('3%')
        // height: Hp('6%')
    },

    inputText: {
        fontSize: 13, borderBottomColor: '#9A9A9A', borderBottomWidth: 0
    },
    iconCalendar: {
        position: 'absolute',
        tintColor: Colors.biruJaja,
        width: 25,
        height: 25,
        right: 10,
        bottom: 15,
    },
    iconImage: {
        // marginTop: Hp('1%'),
        // marginBottom: Hp('3%'),
        flex: 0,
        flexDirection: 'column',
        width: '100%',
        height: '80%',
        borderRadius: 5,
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'grey'
        // tintColor: 'grey'
    },
    picture: {
        width: '100%',
        height: '80%',
        borderRadius: 5,

    },
    boxImage: {
        width: Wp('20%'),
        height: Hp('10%'),

        // backgroundColor: 'grey'
    },
    XIcon: { width: 9, height: 9, borderRadius: 100, tintColor: 'white' },
    circleXIcon: { position: 'absolute', right: -3, top: -3, backgroundColor: '#CC0000', padding: 5, borderRadius: 100 },
    actionSheet: {
        paddingHorizontal: Wp('4%'),
        paddingVertical: Hp('1%')
    },
    actionSheetHeader: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Wp('4%'),
        marginBottom: Hp('2%'),
    },
    actionSheetTitle: {
        flex: 1,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 17,
        color: Colors.biruJaja,
        marginTop: Hp('3%'),
        marginBottom: Hp('0.5%'),
    },
    actionSheetClose: {
        width: 14,
        height: 14,
        tintColor: 'grey',
    },
    actionSheetButtonImage: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Wp('3%'),
    },
    buttonPicture: {
        width: Wp('100%'),
        backgroundColor: Colors.white,
        alignSelf: 'center',
        marginBottom: Hp('2%'),
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 0.2,
        // borderColor: 'grey',
        height: Hp('4.7%'),
        padding: '3%',
        elevation: 1,
    },
    buttonItem: {
        color: 'grey',
        fontSize: 15,
    },
    buttonGambar: {
        // zIndex: 1,
        position: 'absolute',
        tintColor: 'grey',
        width: 19,
        height: 19,
        // right: 10,
        // bottom: 37
    },
    textradio: {
        alignSelf: 'center',
    },
    buttonSimpan: {
        marginTop: Hp('1%'),
        backgroundColor: Colors.biruJaja,
    },
    viewText: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", paddingLeft: Wp('1%') },
    textInput: { flex: 1, fontSize: 13, alignSelf: "center", textAlign: "left" },
    iconText: { flex: 1, tintColor: '#454545', width: 20, height: 20, alignSelf: "center", },
    labelUkuran: { fontSize: 14, fontFamily: 'Poppins-SemiBold', marginTop: Hp('3%'), color: '#171717', flex: 1, flexDirection: 'row', alignItems: 'flex-start', },
    ukuranItem: { flex: 1, flexDirection: 'row', alignItems: 'center', },
    touchKategori: { borderBottomColor: '#454545', borderBottomWidth: 0.5, paddingVertical: Hp('2%') },
    textKategori: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: "#454545" },
    headerModal: { flex: 0, flexDirection: 'row', alignContent: 'space-between', alignItems: 'center' },
    headerTitle: { flex: 1, fontFamily: 'Poppins-SemiBold', fontSize: 17, color: Colors.biruJaja, marginVertical: Hp('3%') },
    iconClose: { width: 14, height: 14, tintColor: 'grey', },
    scrollImage: { flex: 0, justifyContent: 'flex-start', alignItems: 'center', paddingTop: '3%' },
    radioItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
    labelTitle: { flex: 1, fontSize: 13, fontFamily: 'Poppins-Regular', color: '#9A9A9A', marginTop: '1%' },
    textItem: { flex: 1, fontSize: 12, fontFamily: 'Poppins-Regular', color: '#000', marginTop: '1%' },
    flex0Row: { flex: 0, flexDirection: 'row', justifyContent: 'flex-start' },
    smallText: { fontSize: 11, color: '#9A9A9A', borderTopColor: '#9A9A9A', borderTopWidth: 0.5, },

});


