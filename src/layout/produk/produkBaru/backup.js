import React, { Component, createRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, TextInput, StyleSheet, TouchableHighlight, Animated, LogBox, Alert, FlatList, BackHandler, Modal } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import ActionSheets from 'react-native-actions-sheet';
import ActionSheetKategori from 'react-native-actions-sheet';
import ActionSheetSubKategori from 'react-native-actions-sheet';
import ActionSheetBrand from 'react-native-actions-sheet';
import ActionSheetWeightType from 'react-native-actions-sheet';
import ActionSheetVariasi from 'react-native-actions-sheet';
import ActionSheetPreorder from 'react-native-actions-sheet';
import { Appbar, RadioButton, IconButton, Button } from 'react-native-paper';
import Variasi from './variasi'
import AsyncStorage from '@react-native-community/async-storage';
import * as Service from '../../../service/Produk'
import NewBrand from '../brand/addBrand';
import { Loading, Wp, Hp, Colors, Style, Utils } from '../../../export'
import { connect } from 'react-redux'

const kategoriRef = createRef();
const subKategoriRef = createRef();
const brandRef = createRef();
const weightRef = createRef();
const variasiRef = createRef();
const preorderRef = createRef();

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ktColor: "#C0C0C0",
            sktColor: "#C0C0C0",
            brColor: "#C0C0C0",
            poColor: "#C0C0C0",
            kategoriName: 'Kategori',
            brandName: "Tidak Ada",
            kategoriValue: "",
            subkategoriValue: "",
            namaprodukValue: "",
            hargaValue: 0,
            diskonValue: 0,
            stockValue: 1,
            brandValue: "",
            kodeProdukValue: "",
            deskripsiValue: "",
            id_toko: '',
            titleHeader: "Tambah Produk",
            tipe_berat: "gram",
            beratValue: 0,
            panjangValue: "0",
            lebarValue: "0",
            tinggiValue: "0",
            beratData: [
                { value: 'gram' }, { value: 'kilogram' }
            ],
            preorderName: "7 Hari",
            preorderValue: "7",
            preorderShow: false,
            preorderData: [
                { value: '7 Hari' }, { value: '14 Hari' }, { value: '21 Hari' }, { value: '28 Hari' }, { value: 'Lainnya' }
            ],
            preorderForm: {
                style: styles.smallTextCenter,
                text: 'Tentukan berapa hari berapa hari masa pengemasan produkmu!'
            },
            variasiStatus: "",
            variasiValue: [],
            variasiSku: "",
            namaVarisasi: "",
            tipeVarisi: "",
            showListVariasi: false,
            statusValue: "",
            checkedKondisi: 'first',
            checkedAsalproduk: 'first',
            checkedPreorder: 'first',
            checkedPreorderTime: '7',
            checkedVariasi: 'first',
            images: {},
            imagesDepan: {},
            imagesAtas: {},
            imagesBelakang: {},
            imagesSamping: {},
            video: {},
            side: '',
            lenghtDeskripsi: 0,
            fotoAnimation: new Animated.Value(110),  //height
            informasiAnimation: new Animated.Value(0),  //height
            deskripsiAnimation: new Animated.Value(0),
            variasiAnimation: new Animated.Value(0),
            detailAnimation: new Animated.Value(0),
            categorys: [],
            subCategorys: [],
            showSubCategorys: false,
            brands: [],
            photos: [],
            fotoProdukShow: true,
            fotoProdukText: 'Tutup',
            informasiProdukShow: false,
            informasiProdukText: '',
            deskripsiShow: false,
            deskripsiText: '',
            variasiShow: false,
            variasiText: '',
            detailProdukShow: false,
            detailProdukText: '',
            asKategori: false,
            textInputCurrency: false,
            autoFocus: false,
            showSelesai: false,
            kategoriForm: {
                style: styles.smallTextCenter,
                text: 'Masukkan kategori sesuai produk yang kamu jual!'
            },
            namaprodukFrom: {
                style: styles.smallTextCenter,
                text: 'Tips: Nama Produk + Tipe Produk + Keterangan Singkat'
            },
            hargaForm: {
                style: styles.smallTextCenter,
                text: 'Tentukan berapa hari harga sesuai pasaran produkmu'
            },
            skuForm: {
                style: styles.smallTextCenter,
                text: 'Input sku sesuai kode produkmu'
            },
            deskripsiForm: {
                style: styles.smallTextDeskripsi,
                text: 'Masukkan deskripsi sesuai produk yang kamu jual'
            },
            deskripsiPlaceholder: "",
            loading: false,
            etalaseModal: false,
            etalaseSelected: '',
            listEtalase: [],

        };
    }

    componentDidMount() {
        // this.setState({ variasiShow: true })
        // this.handleAnimation(550, this.state.variasiAnimation, 400)
        // this.setState({ informasiProdukShow: true })
        // this.handleAnimation(this.state.checkedPreorder == "first" ? 1050 : 1150, this.state.informasiAnimation, 400)
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified.']);
        this.getItem()
    }

    openShowSelesai = () => this.setState({ showItemSelesai: true })
    closeShowSelesai = () => this.setState({ showItemSelesai: false })
    handleTitle = (val) => this.setState({ titleHeader: val })

    showActionSheet(side) {
        this.ActionSheet.show(),
            this.setState({
                side: side,
            });
    }
    handleOpenPicker = () => {
        const { images, imagesDepan, imagesAtas, imagesBelakang, imagesSamping } = this.state;
        ImagePicker.openPicker({
            multiple: true,
            cropping: true,
            maxFiles: 5
        }).then(image => {
            setTimeout(() => this.setState({ informasiProdukShow: true }), 1200)
            setTimeout(() => this.handleAnimation(this.state.checkedPreorder == "first" ? 1050 : 1150, this.state.informasiAnimation, 400), 1000)
        });
    }

    goToPicFromCameras() {
        if (this.state.side == 'utama') {
            ImagePicker.openCamera({
                // cropping: true,
                includeBase64: true,
                // compressImageQuality: 0,
            }).then((image) => {
                setTimeout(() => this.setState({ informasiProdukShow: true }), 1200)
                setTimeout(() => this.handleAnimation(this.state.checkedPreorder == "first" ? 1050 : 1150, this.state.informasiAnimation, 400), 1000)
                this.setState({ images: image });
            });
        } else if (this.state.side == 'depan') {
            ImagePicker.openCamera({
                // cropping: true,
                includeBase64: true,
                // compressImageQuality: 0,
            }).then((image) => {
                setTimeout(() => this.setState({ informasiProdukShow: true }), 1200)
                setTimeout(() => this.handleAnimation(this.state.checkedPreorder == "first" ? 1050 : 1150, this.state.informasiAnimation, 400), 1000)
                this.setState({ imagesDepan: image });
            });
        } else if (this.state.side == 'atas') {
            ImagePicker.openCamera({
                // cropping: true,
                // compressImageQuality: 0,
                includeBase64: true,
            }).then((image) => {
                setTimeout(() => this.setState({ informasiProdukShow: true }), 1200)
                setTimeout(() => this.handleAnimation(this.state.checkedPreorder == "first" ? 1050 : 1150, this.state.informasiAnimation, 400), 1000)
                this.setState({ imagesAtas: image });
            });
        } else if (this.state.side == 'belakang') {
            ImagePicker.openCamera({
                // cropping: true,
                includeBase64: true,
                // compressImageQuality: 0,
            }).then((image) => {
                setTimeout(() => this.setState({ informasiProdukShow: true }), 1200)
                setTimeout(() => this.handleAnimation(this.state.checkedPreorder == "first" ? 1050 : 1150, this.state.informasiAnimation, 400), 1000)
                this.setState({ imagesBelakang: image });
            });
        } else if (this.state.side == 'samping') {
            ImagePicker.openCamera({
                // cropping: true,
                includeBase64: true,
                // compressImageQuality: 0,
            }).then((image) => {
                setTimeout(() => this.setState({ informasiProdukShow: true }), 1200)
                setTimeout(() => this.handleAnimation(this.state.checkedPreorder == "first" ? 1050 : 1150, this.state.informasiAnimation, 400), 1000)
                this.setState({ imagesSamping: image });
            });
        } else {
            ImagePicker.openCamera({
                cropping: false,
                includeBase64: false,
                mediaType: 'video'
                // compressImageQuality: 0,
            }).then((video) => {
                setTimeout(() => this.setState({ informasiProdukShow: true }), 1200)
                setTimeout(() => this.handleAnimation(this.state.checkedPreorder == "first" ? 1050 : 1150, this.state.informasiAnimation, 400), 1000)
                this.setState({ video });
            });
        }
        setTimeout(() => this.setState({ informasiProdukText: "" }), 2000)
    }

    goToPickImage() {
        if (this.state.side == 'utama') {
            ImagePicker.openPicker({
                // cropping: true,
                includeBase64: true,
                // compressImageQuality: 0,
            }).then((image) => {
                setTimeout(() => this.setState({ informasiProdukShow: true }), 1200)
                setTimeout(() => this.handleAnimation(this.state.checkedPreorder == "first" ? 1050 : 1150, this.state.informasiAnimation, 400), 1000)
                this.setState({
                    images: image,
                });
            });
        } else if (this.state.side == 'depan') {
            ImagePicker.openPicker({
                // cropping: true,
                includeBase64: true,
                // compressImageQuality: 0,
            }).then((image) => {
                setTimeout(() => this.setState({ informasiProdukShow: true }), 1200)
                setTimeout(() => this.handleAnimation(this.state.checkedPreorder == "first" ? 1050 : 1150, this.state.informasiAnimation, 400), 1000)
                this.setState({
                    imagesDepan: image,
                });
            });
        } else if (this.state.side == 'atas') {
            ImagePicker.openPicker({
                // cropping: true,
                includeBase64: true,
                // compressImageQuality: 0,
            }).then((image) => {
                setTimeout(() => this.setState({ informasiProdukShow: true }), 1200)
                setTimeout(() => this.handleAnimation(this.state.checkedPreorder == "first" ? 1050 : 1150, this.state.informasiAnimation, 400), 1000)
                this.setState({
                    imagesAtas: image,
                });
            });
        } else if (this.state.side == 'belakang') {
            ImagePicker.openPicker({
                // cropping: true,
                includeBase64: true,
                // compressImageQuality: 0,
            }).then((image) => {
                setTimeout(() => this.setState({ informasiProdukShow: true }), 1200)
                setTimeout(() => this.handleAnimation(this.state.checkedPreorder == "first" ? 1050 : 1150, this.state.informasiAnimation, 400), 1000)
                this.setState({
                    imagesBelakang: image,
                });
            });
        } else {
            ImagePicker.openPicker({
                // cropping: true,
                includeBase64: true,
                // compressImageQuality: 0,
            }).then((image) => {
                setTimeout(() => this.setState({ informasiProdukShow: true }), 1200)
                setTimeout(() => this.handleAnimation(this.state.checkedPreorder == "first" ? 1050 : 1150, this.state.informasiAnimation, 400), 1000)
                this.setState({
                    imagesSamping: image,
                });
            });
        }

    }

    handleValueDropdown = (text, val) => {
        console.log("🚀 ~ file: index.js ~ line 301 ~ index ~ val", val)
        const { categorys, subCategorys, preorderForm, kategoriForm } = this.state
        if (text === "kategori") {
            kategoriRef.current?.setModalVisible(false)
            let textKate = kategoriForm
            textKate.text = "Masukkan kategori sesuai produk yang kamu jual"
            textKate.style = styles.smallTextCenter
            let arrsubCategorys = val.sub_kategori;
            arrsubCategorys.sort()
            this.setState({ subCategorys: arrsubCategorys, kategoriValue: val.id_kategori, kategoriName: val.kategori, ktColor: Colors.blackgrayScale, sktColor: "#C0C0C0", subkategoriName: "Sub Kategori", subkategoriValue: "" })
            let arr = val.sub_kategori
            if (arr.length == 0) {
                this.setState({ showSubCategorys: false })
            } else {
                this.setState({ showSubCategorys: true })

            }
        } else if (text === "subKategori") {
            this.setState({ subkategoriValue: val.id_sub_kategori, subkategoriName: val.sub_kategori, sktColor: Colors.blackgrayScale })
            subKategoriRef.current?.setModalVisible(false)
            let textKate = this.state.kategoriForm
            textKate.text = "Masukkan kategori sesuai produk yang kamu jual"
            textKate.style = styles.smallTextCenter
        } else if (text === "brand") {
            this.setState({ brandValue: val?.id_data, brandName: val.merek, brColor: Colors.blackgrayScale })
            brandRef.current?.setModalVisible(false)

        } else if (text === "preorder") {
            let result = val.value.substring(0, 2);
            result.replace(" ", "")
            let preorder = preorderForm
            preorder.text = "Tentukan berapa hari masa pengemasan produkmu!";
            preorder.style = styles.smallTextAlert;
            this.setState({ preorderValue: result, preorderName: val.value, poColor: Colors.blackgrayScale, preorderForm: preorder })

            preorderRef.current?.setModalVisible(false)
        } else if (text === "tipeBerat") {
            this.setState({ tipe_berat: val.value })
            weightRef.current?.setModalVisible(false)
        }
    }

    getItem = async () => {
        await Service.getKategori().then(res => {
            // console.log("index -> getItem -> category", res)
            this.setState({ categorys: res.kategori })
        })
        await Service.getBrand().then(res => {
            // console.log("index -> getItem -> brand", res)
            // res.map()
            this.setState({ brands: res.brand })
        })
        await AsyncStorage.getItem('xxTwo').then((toko) => {
            this.setState({ id_toko: JSON.parse(toko).id_toko })
        });
    }


    backAction = () => {
        this.props.navigation.navigate('Produk')
        return true;
    };

    componentWillUnmount() {
        this.backHandler.remove();
    }

    handleAnimation = (valChange, valState, valDuration) => {
        Animated.timing(valState, {
            toValue: valChange,
            duration: valDuration,
            useNativeDriver: false
        }).start();
    }

    handleShowCard = (text) => {
        const { informasiProdukShow, informasiAnimation, deskripsiShow, deskripsiAnimation, variasiText, variasiShow, variasiAnimation, detailProdukShow, detailAnimation } = this.state
        if (text === "informasi") {
            if (informasiProdukShow === false) {
                if (variasiText === "Tambah Variasi") {
                    setTimeout(() => this.setState({ informasiProdukShow: true, informasiProdukText: '', deskripsiShow: false, deskripsiText: 'Ubah', variasiShow: false, variasiText: "Tambah Variasi", detailProdukShow: false, detailProdukText: "Ubah" }), 250);
                } else {
                    setTimeout(() => this.setState({ informasiProdukShow: true, informasiProdukText: '', deskripsiShow: false, deskripsiText: 'Ubah', variasiShow: false, }), 250);
                }
                this.handleAnimation(800, informasiAnimation, 400);
                this.handleAnimation(0, deskripsiAnimation, 400);
                this.handleAnimation(0, variasiAnimation, 400);
                this.handleAnimation(0, detailAnimation, 400);
            }
            else {
                this.handleAnimation(0, informasiAnimation, 400);
                setTimeout(() => this.setState({ informasiProdukShow: false, informasiProdukText: 'Ubah', deskripsiShow: false, deskripsiText: "", variasiShow: false, variasiText: "Mulai", detailProdukShow: false, detailProdukText: 'Mulai' }), 50);
            }
        } else if (text === "deskripsi") {
            if (deskripsiShow === false) {
                this.handleAnimation(300, deskripsiAnimation, 400);
                this.handleAnimation(0, informasiAnimation, 400);
                this.handleAnimation(0, variasiAnimation, 400);
                this.handleAnimation(0, detailAnimation, 400);
                if (variasiText === "Tambah Variasi") {
                    setTimeout(() => this.setState({ deskripsiShow: true, deskripsiText: '', informasiProdukShow: false, informasiProdukText: 'Ubah', variasiShow: false, variasiText: "Tambah Variasi", detailProdukShow: false, detailProdukText: 'Ubah' }), 200)
                } else {
                    setTimeout(() => this.setState({ deskripsiShow: true, deskripsiText: '', informasiProdukShow: false, informasiProdukText: 'Ubah', variasiShow: false, variasiText: "Tambah Variasi" }), 200);

                }
            } else {
                this.handleAnimation(0, deskripsiAnimation, 400);

                setTimeout(() => this.setState({ deskripsiShow: false, deskripsiText: 'Ubah' }), 50);
            }
        } else if (text === "variasi") {
            if (variasiShow === false) {
                this.handleAnimation(550, variasiAnimation, 400)
                this.handleAnimation(0, informasiAnimation, 400);
                this.handleAnimation(0, deskripsiAnimation, 400);
                this.handleAnimation(0, detailAnimation, 400);
                setTimeout(() => this.setState({ variasiShow: true, variasiText: "", deskripsiShow: false, deskripsiText: 'Ubah', informasiProdukShow: false, informasiProdukText: 'Ubah', detailProdukShow: false, detailProdukText: 'Ubah' }), 290)
            }
        } else if (text === "detail") {
            if (detailProdukShow === false) {
                this.handleAnimation(300, detailAnimation, 400);
                this.handleAnimation(0, informasiAnimation, 400);
                this.handleAnimation(0, deskripsiAnimation, 400);
                this.handleAnimation(0, variasiAnimation, 400);
                this.setState({ detailProdukShow: true, detailProdukText: 'Tutup', variasiShow: false, variasiText: "Tambah Variasi", deskripsiShow: false, deskripsiText: 'Ubah', informasiProdukShow: false, informasiProdukText: 'Ubah' })
            } else {
                this.handleAnimation(0, detailAnimation, 400);
                this.setState({ detailProdukShow: false, detailProdukText: 'Ubah' })
            }
        } else {
            console.log("not found");
        }
    }

    handleActionSheet = (text) => {
        console.log("index -> text", text)
        if (text === "kategori") {
            kategoriRef.current?.setModalVisible();
        } else if (text === "subKategori") {
            subKategoriRef.current?.setModalVisible();
        } else if (text === 'tipeBerat') {
            weightRef.current?.setModalVisible();
        } else if (text === 'preorder') {
            preorderRef.current?.setModalVisible();
        } else if (text === "brand") {
            brandRef.current?.setModalVisible();
        } else {
            console.log("index -> text", text)
        }
    }

    handleNext = (text) => {
        const { fotoProdukShow, fotoAnimation, informasiProdukShow, informasiAnimation, deskripsiShow, deskripsiAnimation, variasiShow, variasiAnimation, detailProdukShow, detailAnimation, deskripsiValue, deskripsiForm } = this.state;
        if (text === "informasi") {
            let result = this.validationState()
            console.log("index -> result", result)
            if (result === true) {
                if (informasiProdukShow === true) {
                    this.handleAnimation(0, informasiAnimation, 400);
                    this.handleAnimation(300, deskripsiAnimation, 400);
                    setTimeout(() => this.setState({ informasiProdukShow: false, informasiProdukText: 'Ubah', deskripsiShow: true, deskripsiText: "" }), 100)
                } else {
                    this.handleAnimation(800, informasiAnimation, 400);
                    this.handleAnimation(0, deskripsiAnimation, 400);
                    this.handleAnimation(0, variasiAnimation, 400);

                    this.handleAnimation(0, detailAnimation, 400);
                    this.setState({ informasiProdukShow: true, deskripsiShow: false, variasiShow: false, detailProdukShow: false })
                }
            }

        } else if (text === "deskripsi") {
            if (deskripsiValue === "") {
                let text = deskripsiForm
                text.text = "Deskripsi tidak boleh kosong"
                text.style = Style.smallTextAlertError
                this.setState({ deskripsiForm: text })
            } else if (deskripsiValue.length < 50) {
                let text = deskripsiForm
                text.text = "Deskripsi terlalu pendek, minimal 50 karakter"
                text.style = Style.smallTextAlertError
                this.setState({ deskripsiForm: text })
            } else {
                this.handleAnimation(0, deskripsiAnimation, 400);
                this.setState({ deskripsiShow: false, deskripsiText: "Ubah", variasiText: "Tambah Variasi", detailProdukText: "Ubah", showSelesai: true, showSelesai: true })
            }
        }
    }

    handleVariasi = (value) => {
        if (value === "close") {
            console.log("index -> handleVariasi -> Close")
            this.handleAnimation(0, this.state.variasiAnimation, 400);
            setTimeout(() => this.setState({ variasiShow: false, variasiText: 'Tambah Variasi' }), 50)
        } else if (value === true) {
            if (this.state.variasiValue.length < 1) {
                alert("Variasi anda masih kosong!")
            } else {
                variasiRef.current?.setModalVisible();
            }
        } else {
            let newVariasi = this.state.variasiValue;
            newVariasi = [...newVariasi, value]
            this.setState({ variasiValue: newVariasi })
        }
        setTimeout(() => console.log(this.state.variasiValue, "hehe"), 3000)
    }

    validationState = () => {
        const { variasiValue, brandValue, checkedPreorder, preorderValue, checkedKondisi, id_toko, checkedAsalproduk, tipe_berat, stockValue, variasiStatus, varisiValue, deskripsiValue, panjangValue, lebarValue, tinggiValue, beratValue, kategoriValue, kategoriForm, showSubCategorys, subkategoriName, subkategoriValue, namaprodukValue, namaprodukFrom, hargaValue, hargaForm, kodeProdukValue, skuForm
        } = this.state;
        if (kategoriValue === "") {
            let text = kategoriForm
            text.text = "Kategori tidak boleh kosong!"
            text.style = Style.smallTextAlertError
            this.setState({
                kategoriForm: text
            })
            Alert.alert(
                'Jaja.id',
                'Kategori tidak boleh kosong!',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: true }
            );
            return false
        } else if (showSubCategorys === true && subkategoriValue === "") {
            let text = kategoriForm
            text.text = "Sub Kategori tidak boleh kosong!"
            text.style = Style.smallTextAlertError
            this.setState({
                kategoriForm: text
            })
            Alert.alert(
                'Jaja.id',
                'Sub Kategori tidak boleh kosong!',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: true }
            );
            return false
        } else if (namaprodukValue === "") {
            let text = namaprodukFrom
            text.text = "Nama produk tidak boleh kosong"
            text.style = Style.smallTextAlertError
            this.setState({ namaprodukFrom: text })
            Alert.alert(
                'Jaja.id',
                'Nama produk tidak boleh kosong!',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: true }
            );
            return false
        } else if (hargaValue === 0) {
            let text = hargaForm
            text.text = "Harga produk tidak boleh kosong"
            text.style = Style.smallTextAlertError
            this.setState({ hargaForm: text })
            Alert.alert(
                'Jaja.id',
                'Harga tidak boleh kosong!',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: true }
            );
            return false
        } else if (kodeProdukValue === "") {
            let text = skuForm
            text.text = "Kode produk tidak boleh kosong!"
            text.style = Style.smallTextAlertError
            this.setState({ skuForm: text })
            Alert.alert(
                'Jaja.id',
                'Kode produk tidak boleh kosong!',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: true }
            );
            return false
        } else if (brandValue === "") {
            Alert.alert(
                'Jaja.id',
                'Brand tidak boleh kosong!',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: true }
            );
            return false
        }
        else {
            return true
        }
    }

    handleSimpan = async () => {
        let result = this.validationState()
        console.log("index -> result", result)
        if (result == true) {
            if (this.state.beratValue === 0) {
                Alert.alert(
                    'Jaja.id',
                    'Berat barang tidak boleh kosong!',
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') }
                    ],
                    { cancelable: true }
                );
            } else {
                Alert.alert(
                    'Produk anda akan disimpan',
                    'Pilih opsi berikut',
                    [
                        {
                            text: 'Batal',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel'
                        },
                        {
                            text: 'Live',
                            onPress: () => this.handlePostProduk('live') & this.setState({ loading: true })
                        },
                        {
                            text: 'Arsipkan',
                            onPress: () => this.handlePostProduk('arsipkan') & this.setState({ loading: true })
                        },
                    ],
                    { cancelable: true }
                )
            }
        }
    }

    handlePostProduk = (val) => {
        const { variasiValue, brandValue, checkedPreorder, preorderValue, checkedKondisi, id_toko, checkedAsalproduk, tipe_berat, stockValue, variasiStatus, varisiValue, deskripsiValue, panjangValue, lebarValue, tinggiValue, beratValue, kategoriValue, kategoriForm, showSubCategorys, subkategoriName, subkategoriValue, namaprodukValue, namaprodukFrom, hargaValue, hargaForm, kodeProdukValue, skuForm
        } = this.state;

        let asal_produk = checkedAsalproduk === 'first' ? 4 : 5;
        let kondisi = checkedKondisi === 'first' ? 'baru' : 'bekas';
        let preorder_status = checkedPreorder === 'first' ? 'T' : 'Y';
        let variasi = variasiValue;
        let produk_variasi_harga = "Y"
        if (variasiValue.length === 0) {
            produk_variasi_harga = 'T';
            variasi = '';
        }

        let credentials = {
            'save_as': val,
            'nama_produk': namaprodukValue,
            'id_kategori': kategoriValue,
            'id_sub_kategori': subkategoriValue,
            'deskripsi': deskripsiValue,
            'merek': brandValue,
            'produk_variasi_harga': produk_variasi_harga,
            'variasi': variasi,
            'kode_sku_single': kodeProdukValue,
            'harga_single': hargaValue,
            'stok_single': stockValue,
            'tipe_berat': tipe_berat,
            'berat': beratValue,
            'ukuran_paket_panjang': panjangValue,
            'ukuran_paket_lebar': lebarValue,
            'ukuran_paket_tinggi': tinggiValue,
            'asal_produk': asal_produk,
            'id_toko': id_toko,
            'kondisi': kondisi,
            'pre_order': preorder_status,
            'masa_pengemasan': preorderValue,
            'file_foto_1': Object.keys(this.state.images).length === 0 ? "" : this.state.images.data,
            'file_foto_2': Object.keys(this.state.imagesDepan).length === 0 ? "" : this.state.imagesDepan.data,
            'file_foto_3': Object.keys(this.state.imagesAtas).length === 0 ? "" : this.state.imagesAtas.data,
            'file_foto_4': Object.keys(this.state.imagesBelakang).length === 0 ? "" : this.state.imagesBelakang.data,
            'file_foto_5': Object.keys(this.state.imagesSamping).length === 0 ? "" : this.state.imagesSamping.data,
        }
        setTimeout(() => {

            try {
                Service.postProduk(credentials).then(res => {
                    let response = ""
                    try {
                        response = JSON.parse(res)
                    } catch (error) {
                        response = res + ""
                    }
                    if (response.status == 201) {
                        this.handleFetchProduct()
                        setTimeout(() => {
                            AsyncStorage.setItem('updateProduk', 'update');
                            this.setState({ loading: false })
                            setTimeout(() => this.props.navigation.navigate("Produk", { data: 'update' }), 100);
                        }, 1000)

                    } else if (response === "Error: Request failed with status code 409") {
                        this.setState({ loading: false })
                        setTimeout(() => alert("Nama produk sudah pernah digunakan!"), 100)
                    } else {
                        this.setState({ loading: false })
                        console.log("🚀 ~ file: index.js ~ line 755 ~ index ~ Service.postProduk JSON.sTRINGIFY", res.message)
                        if (res.message == "Request failed with status code 500") {
                            setTimeout(() => alert("Pastikan kolom berbintang tidak dikosongi!"), 100)

                        } else {
                            setTimeout(() => alert("Periksa kembali signal anda!"), 100)
                        }
                    }
                })
            } catch (error) {
                alert("Periksa kembali koneksi anda!")
                this.setState({ loading: false })
            }
        }, 1000)
    }

    handleFetchProduct = async () => {
        try {
            this.props.dispatch({ type: 'FETCH_PRODUCTS', payload: true })
            this.props.dispatch({ type: 'FETCH_LIVE', payload: true })
            this.props.dispatch({ type: 'FETCH_ARCHIVE', payload: true })
            this.props.dispatch({ type: 'FETCH_SOLDOUT', payload: true })
        } catch (error) {
            console.log("file: index.js ~ line 1003 ~ handleFetchProduct ~ error", error)
        }
    }
    onChangeText = (val, name) => {
        const { namaprodukFrom, hargaForm, skuForm, hargaValue } = this.state;

        if (name === "namaProduk") {
            let text = namaprodukFrom
            text.text = "Tips: Jenis Produk + Merek Produk + Keterangan Singkat"
            text.style = styles.smallTextCenter;
            let res = this.regexChar(val, "namaProduk")
            this.setState({ namaprodukFrom: text, namaprodukValue: res })
        } else if (name === "harga") {
            let text = hargaForm
            text.text = "Tentukan harga sesuai pasaran produkmu"
            text.style = styles.smallTextCenter;
            let regex = this.regexChar(val, "currency")
            console.log("index -> regex", regex.length)
            let res = Utils.money(regex)
            this.setState({ hargaForm: text, hargaValue: res, textInputCurrency: false, autoFocus: true })
            console.log("index -> res", res)
            // } else {
            //   this.setState({ hargaForm: text, hargaValue: val, textInputCurrency: true })
            // }

            // if (val.length === 4) {
            //   this.setState({ textInputCurrency: true })
            // } else if (val.length === 5 && this.state.textInputCurrency === true) {
            //   this.setState({ textInputCurrency: false })
            // }
            // else {
            //   this.setState({ textInputCurrency: false })

            // }

            // if (val === "0,000") {
            //   this.setState({ hargaForm: text, hargaValue: "" })
            // } else
            //   if (rgx === "0,00") {
            //     console.log("masuk cuy");
            //     let res = val.substring(4, 5)
            //     this.setState({ hargaForm: text, hargaValue: res })
            //   } else {
            //     this.setState({ hargaForm: text, hargaValue: val })
            //   }
        } else if (name === "stock") {
            this.setState({ stockValue: this.regexChar(val, "number") })
        } else if (name === "sku") {
            let text = skuForm
            text.text = "Input sku sesuai kode produkmu"
            text.style = styles.smallTextCenter;

            this.setState({ skuForm: text, kodeProdukValue: this.regexChar(val, "charnumberSpace") })
        } else if (name === "deskripsi") {
            let text = skuForm
            text.text = "Masukkan deskripsi sesuai produk yang kamu jual"
            text.style = styles.smallTextCenter;
            this.setState({ deskripsiForm: text, deskripsiValue: val, lenghtDeskripsi: val.length })
        } else if (name === "berat") {
            this.setState({ beratValue: this.regexChar(val, "number") })
        }
    }


    regexChar = (text, val) => {
        if (val === "charNumber") {
            return (text.replace(/[^a-z0-9]/gi, ''))
        } else if (val === 'namaProduk') {
            return (text.replace(/[^a-z0-9 ~|/-]/gi, ''))
        } else if (val === 'number') {
            return (text.replace(/[^0-9]/gi, ''))
        } else if (val === 'charnumberSpace') {
            return (text.replace(/[^a-z0-9 ]/gi, ''))
        } else if (val === 'currency') {
            return (text.replace(/[^0-9]/gi, ''))
        }
    }
    render() {
        const { navigation } = this.props;

        return (
            <SafeAreaView style={styles.container}>
                {this.state.loading ?
                    <Loading />
                    : null
                }
                <Appbar.Header style={Style.appBar}>

                    <TouchableOpacity style={{ marginRight: Wp('1%') }} onPress={() => {
                        this.state.titleHeader === "Tambah Produk" ? navigation.navigate('Produk') : this.setState({ titleHeader: "Tambah Produk" })

                    }}>
                        <Image style={Style.arrowBack} source={require('../../../icon/arrow.png')} />
                    </TouchableOpacity>
                    <View style={Style.row_start_center}>
                        <Text style={Style.appBarText}>{this.state.titleHeader}</Text>
                    </View>

                    {/* {this.state.showSelesai ?

            <TouchableOpacity onPress={() => this.handleSimpan()} style={Style.row_end_center}>
              <Text style={Style.appBarButton}>SIMPAN</Text>
            </TouchableOpacity>
            : null
          } */}
                </Appbar.Header>
                {this.state.titleHeader === "Tambah Produk" ?

                    <ScrollView style={styles.body}>
                        <View style={styles.card} disabled={true}>
                            <View style={styles.rowSpace}>
                                <View style={Style.row_0}>
                                    <Text style={styles.title}>Foto Produk</Text>
                                    <Text style={[Style.font_14, { color: Colors.redNotif }]}> *</Text><Text style={[Style.font_11, Style.italic, { color: Colors.redNotif }]}> kolom berbintang wajib diisi</Text>
                                </View>
                                {/* <TouchableHighlight
                onPress={() => this.showActionSheet('utama')}>
                <Text style={styles.titlebtn}>
                  Tambah Foto
                </Text>
              </TouchableHighlight> */}
                            </View>

                            <Animated.View
                                style={{ height: this.state.fotoAnimation, flex: 1 }}>
                                {this.state.fotoProdukShow ?

                                    <View style={styles.addImages}>
                                        <View style={styles.rowSpace}>
                                            {/* <Text style={styles.labelRight} onPress={() => alert('foto')}>
                      Ambil Foto</Text> */}
                                            {/* <Text style={styles.label}> */}
                                            {/* Foto Produk<Text style={styles.red}>*</Text> */}
                                            {/* </Text> */}
                                        </View>
                                        <ScrollView horizontal={true} contentContainerStyle={styles.rowWrap} showsHorizontalScrollIndicator={false} pagingEnabled={true}>
                                            {this.state.images.path ?
                                                <View style={styles.produkImage}>
                                                    <Image style={styles.image} source={{ uri: this.state.images.path }} />
                                                    <TouchableOpacity style={styles.iconDelete} onPress={() => this.setState({ images: "" })}>
                                                        <Image source={require("../../../icon/close.png")} style={styles.iconDeleteImage} />
                                                    </TouchableOpacity>
                                                </View>
                                                :
                                                <TouchableOpacity
                                                    style={styles.boxImage}
                                                    onPress={() => this.showActionSheet('utama')}>
                                                    <View style={styles.imageView}>
                                                        <Image
                                                            source={require('../../../icon/add_image.png')}
                                                            style={styles.iconBoxImage}
                                                        />
                                                        <Text style={styles.texBoxImage}>
                                                            utama
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>

                                            }

                                            {this.state.imagesDepan.path ?
                                                <View style={styles.produkImage}>
                                                    <Image style={styles.image} source={{ uri: this.state.imagesDepan.path }} />
                                                    <TouchableOpacity style={styles.iconDelete} onPress={() => this.setState({ imagesDepan: "" })}>
                                                        <Image source={require("../../../icon/close.png")} style={styles.iconDeleteImage} />
                                                    </TouchableOpacity>
                                                </View>
                                                :
                                                <TouchableOpacity
                                                    style={styles.boxImage}
                                                    onPress={() => this.showActionSheet('depan')}>
                                                    <View style={styles.imageView}>
                                                        <Image source={require('../../../icon/add_image.png')} style={styles.iconBoxImage} />
                                                        <Text style={styles.texBoxImage}>depan</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            }

                                            {this.state.imagesAtas.path ?
                                                <View style={styles.produkImage}>
                                                    <Image style={styles.image} source={{ uri: this.state.imagesAtas.path }} />
                                                    <TouchableOpacity style={styles.iconDelete} onPress={() => this.setState({ imagesAtas: "" })}>
                                                        <Image source={require("../../../icon/close.png")} style={styles.iconDeleteImage} />
                                                    </TouchableOpacity>
                                                </View>
                                                :
                                                <TouchableOpacity
                                                    style={styles.boxImage}
                                                    onPress={() => this.showActionSheet('atas')}>
                                                    <View style={styles.imageView}>
                                                        <Image
                                                            source={require('../../../icon/add_image.png')}
                                                            style={styles.iconBoxImage}
                                                        />
                                                        <Text style={styles.texBoxImage}>atas</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            }


                                            {this.state.imagesBelakang.path ?
                                                <View style={styles.produkImage}>
                                                    <Image style={styles.image} source={{ uri: this.state.imagesBelakang.path }} />
                                                    <TouchableOpacity style={styles.iconDelete} onPress={() => this.setState({ imagesBelakang: "" })}>
                                                        <Image source={require("../../../icon/close.png")} style={styles.iconDeleteImage} />
                                                    </TouchableOpacity>
                                                </View>
                                                :
                                                <TouchableOpacity
                                                    style={styles.boxImage}
                                                    onPress={() => this.showActionSheet('belakang')}>
                                                    <View style={styles.imageView}>
                                                        <Image
                                                            source={require('../../../icon/add_image.png')}
                                                            style={styles.iconBoxImage}
                                                        />
                                                        <Text style={styles.texBoxImage}>belakang</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            }
                                            {this.state.imagesSamping.path ?
                                                <View style={styles.produkImage}>
                                                    <Image style={styles.image} source={{ uri: this.state.imagesSamping.path }} />
                                                    <TouchableOpacity style={styles.iconDelete} onPress={() => this.setState({ imagesSamping: "" })}>
                                                        <Image source={require("../../../icon/close.png")} style={styles.iconDeleteImage} />
                                                    </TouchableOpacity>
                                                </View>
                                                :
                                                <TouchableOpacity
                                                    style={styles.boxImage}
                                                    onPress={() => this.showActionSheet('samping')}>
                                                    <View style={styles.imageView}>
                                                        <Image
                                                            source={require('../../../icon/add_image.png')}
                                                            style={styles.iconBoxImage}
                                                        />
                                                        <Text style={styles.texBoxImage}>samping</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            }
                                            {/* {this.state.video.path ?
                      <View style={styles.produkImage}>
                        <Video source={{ uri: this.state.video.path }}   // Can be a URL or a local file.
                          autoplay={false}
                          loop
                          ref={(ref) => {
                            this.player = ref
                          }}
                          onStart                                  // Store reference
                          onBuffer={this.onBuffer}                // Callback when remote video is buffering
                          onError={this.videoError}               // Callback when video cannot be loaded
                          style={styles.image} />
                        <TouchableOpacity style={styles.iconDelete} onPress={() => this.setState({ video: "" })}>
                          <Image source={require("../../../icon/close.png")} style={styles.iconDeleteImage} />
                        </TouchableOpacity>
                      </View>
                      :
                      <TouchableOpacity
                        style={styles.boxImage}
                        onPress={() => this.showActionSheet('video')}>
                        <View style={styles.imageView}>
                          <Image
                            source={require('../../../icon/add_image.png')}
                            style={styles.iconBoxImage}
                          />
                          <Text style={styles.texBoxImage}>video</Text>
                        </View>
                      </TouchableOpacity>

                    } */}
                                        </ScrollView>
                                    </View>
                                    : null}
                            </Animated.View>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.rowSpace}>
                                <View style={Style.row_0}>
                                    <Text style={styles.title}>Informasi Produk</Text>
                                    <Text style={[Style.font_14, { color: Colors.redNotif }]}> *</Text>
                                </View>
                                <TouchableHighlight
                                    onPress={() => this.handleShowCard("informasi")}>
                                    <Text style={styles.titlebtn}>
                                        {this.state.informasiProdukText}
                                    </Text>
                                </TouchableHighlight>
                            </View>

                            <Animated.View
                                style={{ height: this.state.informasiAnimation, flex: 1 }}>

                                {this.state.informasiProdukShow ? (
                                    <>
                                        <View style={styles.ukuranItem}>
                                            <Text style={styles.labelUkuran}>
                                                Kategori<Text style={styles.red}> *</Text>
                                            </Text>
                                            {this.state.showSubCategorys ?
                                                <Text style={styles.labelUkuran}>
                                                    Sub Kategori<Text style={styles.red}> *</Text>
                                                </Text>
                                                :
                                                <Text style={styles.labelUkuran}>
                                                    <Text></Text>
                                                </Text>
                                            }
                                        </View>
                                        <View style={styles.ukuranItem}>
                                            <View style={styles.viewText}>
                                                <Text style={[styles.textInput, { color: this.state.ktColor }]}>{this.state.kategoriName}</Text>
                                                <IconButton
                                                    style={{ margin: 0 }}
                                                    icon={require('../../../icon/down-arrow.png')}
                                                    color={Colors.biruJaja}
                                                    size={27}
                                                    onPress={() => this.handleActionSheet("kategori")} />
                                            </View>
                                            {this.state.showSubCategorys ?
                                                <View style={styles.viewText}>
                                                    <Text style={[styles.textInput, { color: this.state.sktColor }]}>{this.state.subkategoriName}</Text>
                                                    <IconButton
                                                        style={{ margin: 0 }}
                                                        icon={require('../../../icon/down-arrow.png')}
                                                        color={Colors.biruJaja}
                                                        size={27}
                                                        onPress={() => this.handleActionSheet("subKategori")}
                                                    />
                                                </View>
                                                :
                                                null
                                            }
                                        </View>
                                        <Text style={this.state.kategoriForm.style}>
                                            {this.state.kategoriForm.text}
                                        </Text>
                                        <Text style={styles.label}>
                                            Masukkan nama produk yang kamu jual<Text style={styles.red}> *</Text>
                                        </Text>
                                        <TextInput
                                            style={styles.inputbox}
                                            placeholder="Notebook Asus A409UJ-BV351T"
                                            value={this.state.namaprodukValue}
                                            onChangeText={(text) => this.onChangeText(text, "namaProduk")}
                                        />
                                        <Text style={this.state.namaprodukFrom.style}>
                                            {this.state.namaprodukFrom.text}
                                        </Text>
                                        <View style={styles.ukuranItem}>
                                            <Text style={styles.labelUkuran}>
                                                Harga<Text style={styles.red}> *</Text>
                                            </Text>
                                            <Text style={styles.labelUkuran}>
                                                Stock<Text style={styles.red}> *</Text>
                                            </Text>
                                        </View>
                                        <View style={styles.ukuranItem}>
                                            <View style={styles.radioItem}>
                                                <Text style={{ flex: 0, alignSelf: 'center', marginRight: '3%' }}>Rp </Text>
                                                <TextInput
                                                    style={{ flex: 1, padding: '0%' }}
                                                    maxLength={11}

                                                    keyboardType="number-pad"
                                                    placeholder="10000"
                                                    value={String(this.state.hargaValue)}
                                                    onChangeText={(text) => this.onChangeText(text, "harga")}
                                                />

                                            </View>
                                            <View style={styles.radioItem}>
                                                <TextInput
                                                    style={{ flex: 1, padding: '0%' }}
                                                    maxLength={5}
                                                    keyboardType="numeric"
                                                    placeholder="1"
                                                    value={String(this.state.stockValue)}
                                                    onChangeText={(text) => this.onChangeText(text, "stock")} />
                                            </View>
                                        </View>
                                        <Text style={this.state.hargaForm.style}>
                                            {this.state.hargaForm.text}
                                        </Text>
                                        <View style={[styles.ukuranItem, { flex: 0 }]}>
                                            <Text style={styles.labelUkuran}>
                                                Brand<Text style={styles.red}> *</Text>
                                            </Text>
                                        </View>
                                        <View style={styles.ukuranItem}>
                                            <View style={styles.viewText}>
                                                <Text style={[styles.textInput, { color: this.state.brColor }]}>{this.state.brandName}</Text>
                                                <IconButton
                                                    style={{ margin: 0 }}
                                                    icon={require('../../../icon/down-arrow.png')}
                                                    color={Colors.biruJaja}
                                                    size={27}
                                                    onPress={() => this.handleActionSheet("brand")} />
                                            </View>
                                        </View>
                                        <Text style={[styles.smallTextCenter, { marginBottom: '1%' }]}>
                                            Input brand pada produk anda
                                        </Text>
                                        <TouchableOpacity style={{ marginBottom: '2%' }} onPress={() => {
                                            this.state.titleHeader === "Tambah Produk" ? this.setState({ titleHeader: "Usulkan Brand" }) : this.setState({ titleHeader: "Tambah Produk" })
                                        }}>
                                            <Text style={[Style.font_12, Style.italic, { color: Colors.biruJaja }]}>Usulkan Brand</Text>
                                        </TouchableOpacity>
                                        {/* <View style={[styles.ukuranItem, { flex: 0 }]}>
                      <Text style={styles.labelUkuran}>
                        Kategori<Text style={styles.red}> *</Text>
                      </Text>
                    </View>
                    <View style={styles.ukuranItem}>
                      <View style={styles.viewText}>
                        <Text style={[styles.textInput, { color: this.state.brColor }]}>{this.state.brandName}</Text>
                        <IconButton
                          style={{ margin: 0 }}
                          icon={require('../../../icon/down-arrow.png')}
                          color={Colors.biruJaja}
                          size={27}
                          onPress={() => this.handleActionSheet("brand")} />
                      </View>
                    </View>
                    <Text style={[styles.smallTextCenter, { marginBottom: '1%' }]}>
                      Input brand pada produk anda
                    </Text>
                    <TouchableOpacity style={{ marginBottom: '2%' }} onPress={() => this.setState({ etalaseModal: true })} >
                      <Text style={[Style.font_12, Style.italic, { color: Colors.biruJaja }]}>Tambah Kategori</Text>
                    </TouchableOpacity> */}
                                        <Text style={styles.label}>
                                            Kondisi<Text style={styles.red}> *</Text>
                                        </Text>
                                        <View style={[styles.flex0Row, { marginBottom: '1.5%' }]}>
                                            <View style={[styles.radioItem, { marginTop: '1%' }]}>
                                                <RadioButton
                                                    color={Colors.biruJaja}
                                                    value="first"
                                                    status={this.state.checkedKondisi === 'first' ? 'checked' : 'unchecked'}
                                                    onPress={() => this.setState({ checkedKondisi: 'first' })}
                                                />
                                                <Text style={styles.textradio}>Baru</Text>
                                            </View>
                                            <View style={[styles.radioItem, { marginTop: '1%' }]}>
                                                <RadioButton
                                                    color={Colors.biruJaja}
                                                    value="second"
                                                    status={this.state.checkedKondisi === 'second' ? 'checked' : 'unchecked'}
                                                    onPress={() => this.setState({ checkedKondisi: 'second' })}
                                                />
                                                <Text style={styles.textradio}>Bekas</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.label}>
                                            Asal produk<Text style={styles.red}> *</Text>
                                        </Text>
                                        <View style={[styles.flex0Row, { marginBottom: '1.5%' }]}>
                                            <View style={[styles.radioItem, { marginTop: '1%' }]}>
                                                <RadioButton
                                                    color={Colors.biruJaja}
                                                    value="first"
                                                    status={this.state.checkedAsalproduk === 'first' ? 'checked' : 'unchecked'}
                                                    onPress={() => this.setState({ checkedAsalproduk: 'first' })}
                                                />
                                                <Text style={styles.textradio}>Dalam Negri</Text>
                                            </View>
                                            <View style={[styles.radioItem, { marginTop: '1%' }]}>
                                                <RadioButton
                                                    color={Colors.biruJaja}
                                                    value="second"
                                                    status={this.state.checkedAsalproduk === 'second' ? 'checked' : 'unchecked'}
                                                    onPress={() => this.setState({ checkedAsalproduk: 'second' })}
                                                />
                                                <Text style={styles.textradio}>Luar Negri</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.label}>
                                            Pre-order<Text style={styles.red}> *</Text>
                                        </Text>
                                        <View style={[styles.flex0Row, { marginBottom: '1.5%' }]}>
                                            <View style={[styles.radioItem, { marginTop: '1%' }]}>
                                                <RadioButton
                                                    color={Colors.biruJaja}
                                                    value="first"
                                                    status={this.state.checkedPreorder === 'first' ? 'checked' : 'unchecked'}
                                                    onPress={() => this.setState({ checkedPreorder: 'first' })}
                                                />
                                                <Text style={styles.textradio}>Tidak</Text>
                                            </View>
                                            <View style={[styles.radioItem, { marginTop: '1%' }]}>
                                                <RadioButton
                                                    color={Colors.biruJaja}
                                                    value="second"
                                                    status={this.state.checkedPreorder === 'second' ? 'checked' : 'unchecked'}
                                                    onPress={() => this.setState({ checkedPreorder: 'second' })}
                                                />
                                                <Text style={styles.textradio}>Ya</Text>
                                            </View>
                                        </View>
                                        {this.state.checkedPreorder === "first" ?
                                            null :
                                            <>
                                                <View style={styles.ukuranItem}>
                                                    <Text style={styles.labelUkuran}>
                                                        Masa Pengemasan<Text style={styles.red}> *</Text>
                                                    </Text>
                                                </View>
                                                <View style={styles.ukuranItem}>
                                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                                        <View style={Style.row}>
                                                            <RadioButton
                                                                color={Colors.biruJaja}
                                                                value="7"
                                                                status={this.state.checkedPreorderTime === '7' ? 'checked' : 'unchecked'}
                                                                onPress={() => {
                                                                    this.handleAnimation(this.state.checkedPreorder == "first" ? 1050 : 1150, this.state.informasiAnimation, 400)
                                                                    this.setState({ checkedPreorderTime: '7', preorderValue: '7' })
                                                                }}
                                                            />
                                                            <Text style={[Style.font_13, { marginBottom: '-0.5%' }]}>7 Hari</Text>
                                                        </View>
                                                        <View style={Style.row}>
                                                            <RadioButton
                                                                color={Colors.biruJaja}
                                                                value="14"
                                                                status={this.state.checkedPreorderTime === '14' ? 'checked' : 'unchecked'}
                                                                onPress={() => {
                                                                    this.handleAnimation(this.state.checkedPreorder == "first" ? 1050 : 1150, this.state.informasiAnimation, 400)
                                                                    this.setState({ checkedPreorderTime: '14', preorderValue: '14' })
                                                                }}
                                                            />
                                                            <Text style={[Style.font_13, { marginBottom: '-0.5%' }]}>14 Hari</Text>
                                                        </View>
                                                        <View style={Style.row}>
                                                            <RadioButton
                                                                color={Colors.biruJaja}
                                                                value="21"
                                                                status={this.state.checkedPreorderTime === '21' ? 'checked' : 'unchecked'}
                                                                onPress={() => {
                                                                    this.handleAnimation(this.state.checkedPreorder == "first" ? 1050 : 1150, this.state.informasiAnimation, 400)
                                                                    this.setState({ checkedPreorderTime: '21', preorderValue: '21' })
                                                                }}
                                                            />
                                                            <Text style={[Style.font_13, { marginBottom: '-0.5%' }]}>21 Hari</Text>
                                                        </View>
                                                        <View style={Style.row}>
                                                            <RadioButton
                                                                color={Colors.biruJaja}
                                                                value="31"
                                                                status={this.state.checkedPreorderTime === '31' ? 'checked' : 'unchecked'}
                                                                onPress={() => {
                                                                    this.handleAnimation(1150, this.state.informasiAnimation, 400)
                                                                    this.setState({ checkedPreorderTime: '31', preorderValue: '31' })
                                                                }}
                                                            />
                                                            <Text style={[Style.font_13, { marginBottom: '-0.5%' }]}>Lainnya</Text>
                                                        </View>
                                                    </View>

                                                </View>
                                                {this.state.checkedPreorderTime == '31' ?
                                                    <TextInput
                                                        style={styles.inputbox}
                                                        placeholder="31"
                                                        keyboardType='number-pad'
                                                        value={this.state.preorderValue}
                                                        onChangeText={(text) => this.setState({ preorderValue: text, preorderName: text })}
                                                    /> : null
                                                }
                                                <Text style={[styles.smallTextCenter, { borderTopWidth: 0 }]}>
                                                    Tentukan berapa hari masa pengemasan produk kamu
                                                </Text>
                                            </>
                                        }
                                        <Text style={styles.label}>
                                            SKU (Stock Keeping Unit)<Text style={styles.red}> *</Text>
                                        </Text>
                                        <TextInput
                                            style={styles.inputbox}
                                            placeholder="Kode produk"
                                            value={this.state.kodeProdukValue}
                                            onChangeText={(text) => this.onChangeText(text, "sku")}
                                        />
                                        <Text style={this.state.skuForm.style}>{this.state.skuForm.text}</Text>

                                        <View style={styles.rowSpace}>
                                            <Text style={styles.title}>
                                            </Text>
                                            {/* <TouchableHighlight
                        onPress={() => this.handleNext("informasi")}>
                        <Text style={styles.titlebtn}>
                          Lanjutkan
                      </Text>
                      </TouchableHighlight> */}
                                            <Button color={Colors.biruJaja} labelStyle={{ color: Colors.white }} mode="contained" onPress={() => this.handleNext("informasi")}>
                                                Lanjutkan
                                            </Button>
                                        </View>
                                    </>

                                ) : null}

                            </Animated.View>
                        </View>

                        <View style={styles.card}>

                            <View style={styles.rowSpace}>
                                <View style={Style.row_0}>
                                    <Text style={styles.title}>Deskripsi Produk</Text>
                                    <Text style={[Style.font_14, { color: Colors.redNotif }]}> *</Text>
                                </View>
                                <TouchableHighlight
                                    onPress={() => this.handleShowCard("deskripsi")}>
                                    <Text style={styles.titlebtn}>
                                        {this.state.deskripsiText}
                                    </Text>
                                </TouchableHighlight>
                            </View>
                            <Animated.View
                                style={{ height: this.state.deskripsiAnimation, flex: 1 }}>
                                {this.state.deskripsiShow ? (
                                    <>
                                        <View>
                                            <TextInput
                                                multiline={true}
                                                numberOfLines={11}
                                                textAlignVertical="top"
                                                maxHeight={222}
                                                maxLength={3000}
                                                placeholder={this.state.deskripsiPlaceholder}
                                                value={this.state.deskripsiValue}
                                                onChangeText={(text) => this.onChangeText(text, "deskripsi")}
                                                style={styles.inputbox}
                                            />
                                        </View>
                                        <View style={[styles.deskripsiRow, { marginBottom: '3%' }]}>
                                            <Text style={this.state.deskripsiForm.style}>
                                                {this.state.deskripsiForm.text}
                                            </Text>
                                            <Text style={styles.deskripsiSmallTExt}>
                                                {this.state.lenghtDeskripsi}/3000
                                            </Text>



                                        </View>
                                        <View style={styles.rowSpace}>
                                            <Text style={styles.title}>
                                            </Text>

                                            <Button color={Colors.biruJaja} labelStyle={{ color: Colors.white }} mode="contained" onPress={() => this.handleNext("deskripsi")}>
                                                Lanjutkan
                                            </Button>
                                        </View>
                                    </>
                                ) : (
                                    <View style={{ marginBottom: Hp('0%') }}></View>
                                )}
                            </Animated.View>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.rowSpace}>
                                <Text style={styles.title}>
                                    Variasi Produk
                                </Text>
                                <TouchableHighlight
                                    style={this.state.variasiText === "" ? null : styles.btnLabel}
                                    onPress={() => this.handleShowCard("variasi")}>
                                    <Text style={styles.titlebtn}>
                                        {this.state.variasiText}
                                    </Text>
                                </TouchableHighlight>

                            </View>

                            <View style={styles.container}>
                                <Animated.View
                                    style={{ height: this.state.variasiAnimation }}>
                                    {this.state.variasiShow ? (
                                        <Variasi handleVariasi={(value, show) => this.handleVariasi(value, show)} data={{ harga: this.state.hargaValue, sku: this.state.kodeProdukValue }} />
                                    ) : (
                                        <View style={{ marginBottom: Hp('0%') }}></View>
                                    )}
                                </Animated.View>
                            </View>

                        </View>

                        <View style={styles.card}>
                            <View style={styles.rowSpace}>
                                <View style={Style.row_0}>
                                    <Text style={styles.title}>Detail Produk</Text>
                                    <Text style={[Style.font_14, { color: Colors.redNotif }]}> *</Text>
                                </View>
                                <TouchableHighlight
                                    style={this.state.detailProdukText === "" ? null : styles.btnLabel}
                                    onPress={() => this.handleShowCard("detail")}>
                                    <Text style={styles.titlebtn}>
                                        {this.state.detailProdukText}
                                    </Text>
                                </TouchableHighlight>
                            </View>
                            <Animated.View
                                style={{ height: this.state.detailAnimation }}>
                                {this.state.detailProdukShow ? (
                                    <>
                                        {/* <View style={styles.rowSpace}>
                    <TextInput
                      maxLength={17}
                      keyboardType="numeric"
                      placeholder="1000"
                      value={this.state.beratValue}
                      onChangeText={(text) => this.setState({ beratValue: text })}
                      style={styles.inputbox}
                    />
                    <Text style={{ alignSelf: 'center', marginLeft: '3%' }}>
                      gram
                    </Text>
                    <Dropdown
                      containerStyle={styles.inputDropdown}
                      inputContainerStyle={{ borderBottomColor: 'transparent' }}
                      pickerStyle={{ opacity: 0.9 }}
                      label="Kategori"
                      data={this.state.kategori}
                      // disabled={showdropdown}
                      // value={valueThird}
                      onChangeText={(text) => this.setState({ kategoriValue: text })}
                    />
                    
                  </View> */}
                                        <View style={styles.ukuranItem}>
                                            <Text style={styles.labelUkuran}>
                                                Berat<Text style={styles.red}> *</Text>
                                            </Text>
                                            <Text style={styles.labelUkuran}>
                                                Tipe Berat<Text style={styles.red}> *</Text>
                                            </Text>
                                        </View>

                                        <View style={styles.ukuranItem}>
                                            <View style={styles.viewText}>
                                                <TextInput
                                                    maxLength={5}
                                                    keyboardType="number-pad"
                                                    placeholder="0"
                                                    value={this.state.beratValue}
                                                    onChangeText={(text) => this.onChangeText(text, "berat")}
                                                // style={styles.inputbox}
                                                />
                                            </View>

                                            <View style={styles.viewText}>
                                                <Text style={styles.textInput}>{this.state.tipe_berat}</Text>
                                                {/* <Button onPress={() => this.handleActionSheet("tipeBerat")}>
                        <Image style={styles.iconText} source={require('../../../icon/down-arrow.png')} />
                      </Button> */}
                                                <IconButton
                                                    style={{ margin: 0 }}
                                                    icon={require('../../../icon/down-arrow.png')}
                                                    color={Colors.biruJaja}
                                                    size={27}
                                                    onPress={() => this.handleActionSheet("tipeBerat")}
                                                />
                                            </View>
                                        </View>
                                        <Text style={styles.smallText}>
                                            Masukkan berat produkmu dalam satuan gram/kilogram
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
                                                    value={this.state.panjangValue}
                                                    onChangeText={(text) => this.setState({ panjangValue: text })
                                                    }
                                                    style={styles.inputbox}
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
                                                    value={this.state.lebarValue}
                                                    onChangeText={(text) => this.setState({ lebarValue: text })}
                                                    style={styles.inputbox}
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
                                                    value={this.state.tinggiValue}
                                                    onChangeText={(text) => this.setState({ tinggiValue: text })}
                                                    style={styles.inputbox}
                                                />
                                                <Text style={{ alignSelf: 'center', marginLeft: '3%' }}>
                                                    cm
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={styles.smallText}>
                                            Bila belum mengukur anda dapat mengosongkan form ini
                                        </Text>
                                    </>
                                ) : (
                                    <View style={{ marginBottom: Hp('0%') }}></View>
                                )}
                            </Animated.View>
                        </View>
                        {this.state.showSelesai ?
                            <Button style={{ elevation: 5, marginHorizontal: '1%' }} contentStyle={{ paddingVertical: '1.3%', }} labelStyle={{ color: Colors.white }} color={Colors.biruJaja} mode="contained" onPress={() => this.handleSimpan()}>
                                Simpan
                            </Button>
                            : null
                        }
                    </ScrollView>

                    :
                    // <ActionSheetNewBrand containerStyle={{ paddingVertical: '2%', flex: 0, paddingHorizontal: '4%' }} footerHeight={100} ref={newbrandRef}>
                    this.state.categorys.length !== 0 ? <NewBrand id={this.state.id_toko} data={this.state.categorys} handleTitle={this.handleTitle} /> : null
                }
                <ActionSheet
                    ref={(o) => (this.ActionSheet = o)}
                    title={'Select a Photo'}
                    options={['Ambil Gambar', 'Buka Galeri', 'Cancel']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={1}
                    onPress={(index) => {
                        if (index == 0) {
                            this.goToPicFromCameras();
                        } else if (index == 1) {
                            this.goToPickImage();
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
                        <TouchableOpacity
                            onPress={() => kategoriRef.current?.setModalVisible(false)}
                        >
                            <Image
                                style={styles.iconClose}
                                source={require('../../../icon/close.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 200, paddingHorizontal: Wp('2%') }}>
                        <ScrollView style={{ flex: 1 }}
                            nestedScrollEnabled={true}
                            scrollEnabled={true}>
                            <FlatList
                                nestedScrollEnable={true}
                                data={this.state.categorys}
                                renderItem={this.renderCategorys}
                                keyExtractor={item => item.id_kategori}
                            />

                        </ScrollView>
                    </View>
                </ActionSheetKategori>
                <ActionSheetSubKategori scrollEnabled={true} extraScroll={100} containerStyle={styles.actionSheet}
                    ref={subKategoriRef}>
                    <View style={styles.headerModal}>
                        <Text style={styles.headerTitle}>Sub Kategori</Text>
                        <TouchableOpacity
                            onPress={() => subKategoriRef.current?.setModalVisible(false)}
                        >
                            <Image
                                style={styles.iconClose}
                                source={require('../../../icon/close.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 200, paddingHorizontal: Wp('2%') }}>
                        <ScrollView style={{ flex: 1 }}
                            nestedScrollEnabled={true}
                            scrollEnabled={true}>
                            <FlatList
                                nestedScrollEnable={true}
                                data={this.state.subCategorys}
                                renderItem={this.renderSubCategorys}
                                keyExtractor={item => item.id_sub_kategori}
                            />

                        </ScrollView>
                    </View>
                </ActionSheetSubKategori>
                <ActionSheetBrand scrollEnabled={true} extraScroll={100} containerStyle={styles.actionSheet}
                    ref={brandRef}>
                    <View style={styles.headerModal}>
                        <Text style={styles.headerTitle}>Merek Produk (Brand)</Text>
                        <TouchableOpacity
                            onPress={() => brandRef.current?.setModalVisible(false)}
                        >
                            <Image
                                style={styles.iconClose}
                                source={require('../../../icon/close.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 200, paddingHorizontal: Wp('2%') }}>
                        <ScrollView style={{ flex: 1 }}
                            nestedScrollEnabled={true}
                            scrollEnabled={true}>
                            <FlatList
                                nestedScrollEnable={true}
                                data={this.state.brands}
                                renderItem={this.renderBrand}
                                keyExtractor={item => item?.id_data}
                            />

                        </ScrollView>
                    </View>
                </ActionSheetBrand>
                <ActionSheetWeightType scrollEnabled={true} extraScroll={100} containerStyle={styles.actionSheet}
                    ref={weightRef}>
                    <View style={styles.headerModal}>
                        <Text style={styles.headerTitle}>Tipe Berat</Text>
                        <TouchableOpacity
                            onPress={() => weightRef.current?.setModalVisible(false)}
                        >
                            <Image
                                style={styles.iconClose}
                                source={require('../../../icon/close.png')}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 200, paddingHorizontal: Wp('2%') }}>
                        <ScrollView style={{ flex: 1 }}
                            nestedScrollEnabled={true}
                            scrollEnabled={true}>
                            <FlatList
                                nestedScrollEnable={true}
                                data={this.state.beratData}
                                renderItem={this.renderWeightType}
                                keyExtractor={item => item.value}
                            />

                        </ScrollView>
                    </View>
                </ActionSheetWeightType>
                <ActionSheetVariasi scrollEnabled={true} extraScroll={100} containerStyle={styles.actionSheet}
                    ref={variasiRef}>
                    <View style={styles.headerModal}>
                        <Text style={styles.headerTitle}>Daftar Variasi</Text>
                        <TouchableOpacity
                            onPress={() => variasiRef.current?.setModalVisible(false)}
                        >
                            <Image
                                style={styles.iconClose}
                                source={require('../../../icon/close.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ paddingHorizontal: Wp('2%') }}>
                        <TouchableOpacity onPress={() => alert("clicked!")} style={styles.lineVariasi}>
                            <Text style={styles.textlineVariasi}>Tipe</Text>
                            <Text style={styles.textlineVariasi}>Nama</Text>
                            <Text style={styles.textlineVariasi}>Harga</Text>
                            <Text style={styles.textlineVariasi}>Stok</Text>
                            <Text style={styles.textlineVariasi}>SKU</Text>
                            <Text style={styles.textlineVariasi}>Aksi</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 200, paddingHorizontal: Wp('2%') }}>
                        <ScrollView style={{ flex: 1 }}
                            nestedScrollEnabled={true}
                            scrollEnabled={true}>
                            <FlatList
                                nestedScrollEnable={true}
                                data={this.state.variasiValue}
                                renderItem={this.renderVariasi}
                                keyExtractor={(item, index) => index + ""}
                            />

                        </ScrollView>
                    </View>
                </ActionSheetVariasi>

                <ActionSheetPreorder containerStyle={styles.actionSheet}
                    ref={preorderRef}>
                    <View style={styles.headerModal}>
                        <Text style={styles.headerTitle}>Masa Pengemasan</Text>
                        <TouchableOpacity onPress={() => preorderRef.current?.setModalVisible(false)}>
                            <Image
                                style={styles.iconClose}
                                source={require('../../../icon/close.png')}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 200, paddingHorizontal: Wp('2%') }}>
                        <ScrollView style={{ flex: 1 }}
                            nestedScrollEnabled={true}
                            scrollEnabled={true}>
                            <FlatList
                                nestedScrollEnable={true}
                                data={this.state.preorderData}
                                renderItem={this.renderPreorder}
                                keyExtractor={item => item?.id_data}
                            />

                        </ScrollView>
                    </View>
                </ActionSheetPreorder>
                <Modal visible={this.state.etalaseModal} animationType='fade'>
                    <View style={[Style.row_center, { width: '80%', height: '20' }]}>
                        <Text>Masukkan Nama Etalase</Text>
                        <TextInput
                            value={this.state.etalaseSelected}
                            onChangeText={text => this.setState({ etalaseSelected: text })}
                            style={Style.font_13}
                        />
                    </View>
                </Modal>
            </SafeAreaView >
        );
    }

    renderCategorys = ({ item }) => {
        // console.log("renderItem -> category", item)
        return (
            <TouchableOpacity onPress={() => this.handleValueDropdown("kategori", item)} style={styles.touchKategori}>
                <Text style={styles.textKategori}>{item.kategori}</Text>
            </TouchableOpacity >
        )
    }

    renderSubCategorys = ({ item }) => {
        // console.log("renderItem -> sub category", item)
        return (
            <TouchableOpacity onPress={() => this.handleValueDropdown("subKategori", item)} style={styles.touchKategori}>
                <Text style={styles.textKategori}>{item.sub_kategori}</Text>
            </TouchableOpacity >
        )
    }
    renderBrand = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => this.handleValueDropdown("brand", item)} style={styles.touchKategori}>
                <Text style={styles.textKategori}>{item.merek}</Text>
            </TouchableOpacity >
        )
    }

    renderPreorder = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => this.handleValueDropdown("preorder", item)} style={styles.touchKategori}>
                <Text style={styles.textKategori}>{item.value}</Text>
            </TouchableOpacity >
        )
    }

    renderWeightType = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => this.handleValueDropdown("tipeBerat", item)} style={styles.touchKategori}>
                <Text style={styles.textKategori}>{item.value}</Text>
            </TouchableOpacity >
        )
    }

    renderVariasi = ({ item, index }) => {
        console.log("renderVariasi -> index", index)
        console.log("renderVariasi -> item", item)

        return (
            <TouchableOpacity onPress={() => this.handleValueDropdown("variasi", item)} style={styles.lineVariasi}>
                <Text style={styles.textlineVariasi} numberOfLines={1}>{item.pilihan}</Text>
                <Text style={styles.textlineVariasi} numberOfLines={1}>{item.nama}</Text>
                <Text style={styles.textlineVariasi} numberOfLines={1}>{item.harga}</Text>
                <Text style={styles.textlineVariasi} numberOfLines={1}>{item.stok}</Text>
                <Text style={styles.textlineVariasi} numberOfLines={1}>{item.kode_sku}</Text>
                <TouchableOpacity onPress={() => this.handleDeleteVariasi(index)}>
                    <Text style={[styles.textlineVariasi, { color: 'red', fontSize: 13 }]}>Hapus</Text>
                </TouchableOpacity>

            </TouchableOpacity>
        )
    }


    handleDeleteVariasi = (index) => {
        // Alert.alert(
        //   'Anda ingin menghapus variasi ini?',
        //   [
        //     {
        //       text: 'Batal',
        //       onPress: () => console.log('Cancel Pressed'),
        //       style: 'cancel'
        //     },
        //     {
        //       text: 'Hapus',
        //       onPress: () => {
        //         let newArray = this.state.variasiValue.slice(this.state.variasiValue.splice(index, 1))
        //         setTimeout(() => this.setState({ variasiValue: newArray }), 500)
        //       }
        //     }
        //   ],
        //   { cancelable: true }
        // )

        let newArray = this.state.variasiValue.slice(this.state.variasiValue.splice(index, 1))
        setTimeout(() => this.setState({ variasiValue: newArray }), 100)
    }

    handleOnSubmit = () => {

        console.log("==============================================================================");
        this.state.kategoriValue
        console.log("handleOnSubmit -> kategoriValue ", this.state.kategoriValue)
        this.state.subkategoriValue
        console.log("handleOnSubmit -> subkategoriValue ", this.state.subkategoriValue)
        this.state.namaprodukValue
        console.log("handleOnSubmit -> namaprodukValue ", this.state.namaprodukValue)
        this.state.hargaValue
        console.log("handleOnSubmit -> hargaValue ", this.state.hargaValue)
        this.state.diskonValue
        console.log("handleOnSubmit -> diskonValue ", this.state.diskonValue)
        this.state.stockValue
        console.log("handleOnSubmit -> stockValue ", this.state.stockValue)
        this.state.brandValue
        console.log("handleOnSubmit -> brandValue ", this.state.brandValue)
        this.state.kodeProdukValue
        console.log("handleOnSubmit -> kodeProdukValue ", this.state.kodeProdukValue)
        this.state.deskripsiValue
        console.log("handleOnSubmit -> deskripsiValue ", this.state.deskripsiValue)
        this.state.beratValue
        console.log("handleOnSubmit -> beratValue ", this.state.beratValue)
        this.state.panjangValue
        console.log("handleOnSubmit -> panjangValue ", this.state.panjangValue)
        this.state.lebarValue
        console.log("handleOnSubmit -> lebarValue ", this.state.lebarValue)
        this.state.tinggiValue
        console.log("handleOnSubmit -> tinggiValue ", this.state.tinggiValue)
    };
}

export const styles = StyleSheet.create({
    container: { flex: 1 },
    body: { flex: 1, flexDirection: 'column' },
    card: { flex: 1, flexDirection: 'column', elevation: 2, backgroundColor: 'white', paddingHorizontal: Wp('4%'), paddingVertical: Hp('2%'), marginBottom: Hp('1%') },
    cardbutton: { flex: 1, flexDirection: 'row', paddingHorizontal: Wp('2%'), position: 'relative', left: 0, right: 0, bottom: 0 },
    buttonsubmit: { flex: 1, borderRadius: 5, backgroundColor: Colors.biruJaja, justifyContent: 'center', alignItems: 'center', marginVertical: Hp('1%'), marginHorizontal: Hp('0.5%') },
    buttonText: { fontSize: 11, },
    title: { fontFamily: 'Poppins-SemiBold', fontSize: 14, alignSelf: 'center', color: Colors.blackgrayScale },
    titlebtn: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: Colors.biruJaja },
    simpanbtn: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: Colors.biruJaja, marginTop: Hp('2%') },
    produkImage: { flex: 1, padding: 2, marginRight: Wp('1%'), borderRadius: 10 },
    red: { color: 'red', fontFamily: 'Poppins-Regular', fontSize: 14 },
    label: { fontSize: 14, fontFamily: 'Poppins-SemiBold', marginTop: '2%', color: Colors.blackLight },
    labelRight: { fontSize: 12, fontFamily: 'Poppins-SemiBold', marginTop: Hp('2%'), color: Colors.blackLight },
    labelUkuran: { fontSize: 14, fontFamily: 'Poppins-SemiBold', marginTop: '3%', color: Colors.blackLight, flex: 1, flexDirection: 'row', alignItems: 'center' },
    inputbox: { fontSize: 13, borderBottomColor: Colors.blackGrey, borderBottomWidth: 0.2, fontFamily: 'Poppins-Regular' },
    viewText: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", paddingLeft: Wp('1%') },
    textInput: { flex: 1, fontSize: 13, alignSelf: "center", textAlign: "left", fontFamily: 'Poppins-Regular' },
    iconText: { flex: 1, tintColor: Colors.blackgrayScale, width: 20, height: 20, alignSelf: "center" },
    inputDropdown: { fontSize: 14, marginTop: Wp('-3%'), flex: 1, width: 200, fontFamily: 'Poppins-Regular' },
    inputBoxStock: { fontSize: 14, flex: 1, width: 200, fontFamily: 'Poppins-Regular' },
    inputDropdownBrand: { fontSize: 14, marginTop: Wp('-3%'), flex: 1, width: 200, },
    smallText: { fontSize: 11, color: Colors.blackGrey, borderTopColor: Colors.blackGrey, borderTopWidth: 0.5, fontFamily: 'Poppins-Regular' },
    smallTextCenter: { fontSize: 11, color: Colors.blackGrey, marginBottom: '3%', borderTopColor: Colors.blackGrey, borderTopWidth: 0.5, fontFamily: 'Poppins-Regular' },
    smallTextDeskripsi: { fontSize: 11, color: Colors.blackGrey, marginBottom: Hp('0%'), fontFamily: 'Poppins-Regular' },
    addImages: { flex: 1, flexDirection: 'column' },
    rowSpace: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', },
    rowWrap: { flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" },
    boxImage: { flex: 0, width: Wp('23%'), height: Hp('11%'), padding: 2, marginRight: Wp('5%'), borderRadius: 10 },
    image: { flex: 0, width: Wp('23%'), height: Hp('11%'), padding: 2, marginRight: Wp('5%'), borderRadius: 10, borderWidth: 0.2, borderColor: Colors.blackGrey },
    iconDelete: { position: 'absolute', right: Wp('0%'), top: Hp('0%'), marginRight: Wp('4.5%'), width: 21, height: 21, backgroundColor: '#CC0000', borderRadius: 100 },
    iconDeleteImage: { alignSelf: "center", width: 8, height: 8, resizeMode: 'contain', flex: 1, borderRadius: 25, tintColor: Colors.white },
    iconBoxImage: { width: undefined, height: undefined, resizeMode: 'contain', flex: 1, tintColor: Colors.blackgrayScale },
    texBoxImage: { color: Colors.blackgrayScale, fontSize: 11, fontFamily: "Poppins-Light", position: 'absolute', bottom: 10, alignSelf: 'center', },
    imageView: { flex: 1, width: Wp('23%'), height: Hp('25%'), borderRadius: 10, borderColor: Colors.blackGrey, borderWidth: 0.7, borderRadius: 7, padding: 4 },
    textradio: { alignSelf: 'center' },
    flex0Row: { flex: 0, flexDirection: 'row', justifyContent: 'flex-start' },
    flex0RowCenter: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'space-between' },
    radioItem: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    radioItemLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start" },
    radioItemCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: "center" },
    radioItemRight: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: "flex-end" },

    ukuranItem: { flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: '1.5%' },
    deskripsiRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderTopColor: Colors.blackGrey, borderTopWidth: 0.5 },
    deskripsiSmallTExt: { fontSize: 11, color: Colors.blackGrey, fontFamily: 'Poppins-Regular' },

    actionSheet: { paddingHorizontal: Wp('2%') },
    headerModal: { flex: 1, flexDirection: 'row', alignContent: 'space-between', alignItems: 'center', paddingHorizontal: Wp('2%') },
    headerTitle: { flex: 1, fontFamily: 'Poppins-SemiBold', fontSize: 17, color: Colors.biruJaja, marginVertical: Hp('3%') },
    iconClose: { width: 14, height: 14, tintColor: Colors.blackGrey, },
    touchKategori: { borderBottomColor: Colors.blackgrayScale, borderBottomWidth: 0.5, paddingVertical: Hp('2%'), fontFamily: 'Poppins-Regular' },
    textKategori: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: Colors.blackgrayScale },

    lineVariasi: { flex: 0, flexDirection: 'row', borderBottomColor: Colors.blackgrayScale, borderBottomWidth: 0.5, paddingVertical: Hp('2%'), alignSelf: 'center', justifyContent: 'center' },
    textlineVariasi: { flex: 1, fontSize: 12, fontFamily: 'Poppins-SemiBold', color: Colors.blackgrayScale, flexDirection: 'row', alignSelf: 'center', justifyContent: 'center', textAlign: 'center' },
    iconlineVariasiDelete: { alignSelf: 'center', width: 16, height: 16, tintColor: 'red' },

    btnLabel: { elevation: 0, alignSelf: 'center', paddingHorizontal: Wp('2%'), paddingVertical: Hp('0.5%'), backgroundColor: Colors.white, borderRadius: 5, color: Colors.white, marginHorizontal: Wp('1%') },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});
export default connect(state => ({ state: state.product }))(index)
