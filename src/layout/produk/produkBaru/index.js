import React, { useState, useEffect, useCallback, createRef } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage'
import { View, Text, SafeAreaView, ScrollView, BackHandler, LogBox, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, Modal, Alert, TouchableHighlight } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { RadioButton, IconButton, Button, TouchableRipple } from 'react-native-paper';
import NewBrand from '../brand/addBrand';
import ImagePicker from 'react-native-image-crop-picker';
import Collapsible from 'react-native-collapsible';

import { Appbar, Style, ServiceProduct, Colors, Wp, Hp, useNavigation, Utils, Loading, ModalAlert } from '../../../export'
import ActionSheet from 'react-native-actionsheet';
import ActionSheets from 'react-native-actions-sheet';
import Variasi from './variasi'
import AsyncStorage from '@react-native-community/async-storage';
import { useAndroidBackHandler } from 'react-navigation-backhandler';
import { getEtalase } from '../../../service/Product';
export default function ProdukBaru() {
  const navigation = useNavigation()
  const reduxStore = useSelector(state => state.user.seller)
  const dispatch = useDispatch()
  const [update, setUpdate] = useState(0)

  const [side, setSide] = useState({})
  const [open, setOpen] = useState(1)
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [open3, setOpen3] = useState(false)
  const [open4, setOpen4] = useState(false)

  const [images, setimages] = useState({})
  const [imagesDepan, setimagesDepan] = useState({})
  const [imagesAtas, setimagesAtas] = useState({})
  const [imagesBelakang, setimagesBelakang] = useState({})
  const [imagesSamping, setimagesSamping] = useState({})
  const [video, setVideo] = useState({})


  const [ktColor, setktColor] = useState('#C0C0C0')
  const [kategoriName, setkategoriName] = useState('Electronics')
  const [kategoriValue, setkategoriValue] = useState('')
  const [kategoriForm, setkategoriForm] = useState({
    style: styles.smallTextCenter,
    text: ''
  })
  const [sktColor, setsktColor] = useState('#C0C0C0')
  const [showSubCategorys, setshowSubCategorys] = useState(false)
  const [subkategoriName, setsubkategoriName] = useState('Kategori')
  const [subkategoriValue, setsubkategoriValue] = useState('')


  const [subCategorys, setsubCategorys] = useState([])
  const [categorys, setcategorys] = useState([])
  const [brands, setbrands] = useState([])
  const [photos, setphotos] = useState([])

  const [loading, setloading] = useState(false)


  const [namaprodukValue, setnamaprodukValue] = useState('')
  const [namaprodukFrom, setnamaprodukFrom] = useState({
    style: styles.smallTextCenter,
    text: ''
  })

  const [hargaValue, sethargaValue] = useState(0)
  const [textInputCurrency, settextInputCurrency] = useState(false)
  const [autoFocus, setAutoFocus] = useState(false)
  const [hargaForm, sethargaForm] = useState({
    style: styles.smallTextCenter,
    text: ''
  })

  const [kodeProdukValue, setKodeProdukValue] = useState('')
  const [skuForm, setskuForm] = useState({
    style: styles.smallTextCenter,
    text: ''
  })

  const [deskripsiValue, setDeskripsiValue] = useState('')
  const [deskripsiPlaceholder, setDeskripsiPlaceholder] = useState('Masukkan deskripsi produk')
  //     `Intel Celeron N4020 (4 MB Cache, 1.10 GHz up to 2.80 GHz)
  // Windows 10 Home
  // Memory 4 GB DDR IV
  // Display 14.0' Inch LED backlit HD (1366x768) 60Hz Glare Panel with 45% NTSC
  // Intel UHD Graphics 600
  // HDD 1 TB 5400RPM
  // Chiclet keyboard
  // NO ODD
  // Multi-format card reader (SD/SDHC)
  // VGA Web Camera
  // Networking :
  // * Wi-Fi 5(802.11ac)
  // * Bluetooth 4.1 (Dual band) 1*1
  // Interface :
  // * 1x USB 2.0 Type-A
  // * 1x USB 3.2 Gen 1 Type-A
  // * 1x USB 3.2 Gen 1 Type-C
  // * 1x HDMI 1.4
  // * 1x VGA Port (D-Sub)
  // * 1x 3.5mm Combo Audio Jack
  // * 1x Headphone out
  // * 1x RJ45 Fast Ethernet
  // * Micro SD card reader
  // Audio :
  // * Built-in speaker
  // * Built-in microphone
  // Battery 36WHrs, 3S1P, 3-cell Li-ion (up to 8 hours battery life)`)
  const [lenghtDeskripsi, setLenghtDeskripsi] = useState(0)
  const [deskripsiForm, setdeskripsiForm] = useState({
    style: styles.smallTextDeskripsi,
    text: 'Masukkan deskripsi sesuai produk yang kamu jual'
  })

  const [stockValue, setStockValue] = useState(1)

  const [count, setcount] = useState(0)

  const [brandValue, setbrandValue] = useState('')
  const [brandName, setbrandName] = useState('')
  const [brColor, setbrColor] = useState('#C0C0C0')
  const [titleHeader, setTitleHeader] = useState("Tambah Produk")

  const [etalaseModal, setEtalaseModal] = useState(false)
  const [etalaseSelected, setetalaseSelected] = useState({})
  const [etalasenew, setetalaseNew] = useState('')

  const [listEtalase, setlistEtalase] = useState([])
  const [imageError, setimageError] = useState()


  const [statusValue, setstatusValue] = useState('')
  const [checkedKondisi, setcheckedKondisi] = useState('first')
  const [checkedAsalproduk, setcheckedAsalproduk] = useState('first')
  const [checkedPreorderTime, setcheckedPreorderTime] = useState('7')
  const [checkedVariasi, setcheckedVariasi] = useState('first')

  const [tipe_berat, settipe_berat] = useState('gram')
  const [beratValue, setberatValue] = useState(0)
  const [panjangValue, setpanjangValue] = useState('0')
  const [lebarValue, setlebarValue] = useState('0')
  const [tinggiValue, settinggiValue] = useState('0')
  const [beratData, setberatData] = useState([
    { value: 'gram' }, { value: 'kilogram' }
  ])

  const [preorderName, setpreorderName] = useState('7 Hari')
  const [preorderValue, setpreorderValue] = useState('7')
  const [preorderShow, setpreorderShow] = useState(false)
  const [preorderData, setpreorderData] = useState([
    { value: '7 Hari' }, { value: '14 Hari' }, { value: '21 Hari' }, { value: '28 Hari' }, { value: 'Lainnya' }
  ])
  const [preorderForm, setpreorderForm] = useState({
    style: styles.smallTextCenter,
    text: 'Tentukan berapa hari berapa hari masa pengemasan produkmu!'
  })
  const [poColor, setpoColor] = useState('#C0C0C0')
  const [checkedPreorder, setcheckedPreorder] = useState('first')
  const [variasi, setvariasi] = useState([])
  const [detailProdukText, setdetailProdukText] = useState('')
  const [modalsave, setmodalSave] = useState(false)


  const imageRef = createRef()
  const kategoriRef = createRef();
  const subKategoriRef = createRef();
  const brandRef = createRef();
  const weightRef = createRef();
  const variasiRef = createRef();
  const preorderRef = createRef();
  const etalaseRef = createRef();

  useAndroidBackHandler(() => {
    if (open != 1) {
      handleSave()
      setOpen(open - 1)
      return true
    } else {
      return false
    }
  });

  useEffect(() => {
    getItem()
    // getData()
    // return () => setOpen(1)
  }, [])

  const handleNewEtalase = () => {
    let loadingStop = false
    setEtalaseModal(false)
    setloading(true)
    try {
      ServiceProduct.addEtalase(reduxStore.id_toko, etalasenew).then(res => {
        if (res) {
          getEtalase()
          Utils.alertPopUp('Etalase berhasil ditambahkan!')
          setetalaseNew('')
          setEtalaseModal(false)
        }
        loadingStop = true
        setloading(false)
      })
    } catch (error) {
      loadingStop = true
      console.log("🚀 ~ file: index.js ~ line 187 ~ handleNewEtalase ~ error", error)
      setloading(false)
    }

    setTimeout(() => {
      if (!loadingStop) {
        setloading(false)
      }
    }, 15000);
  }

  useEffect(() => {
    handleStateInformasi()

    return () => {
      setEtalaseModal(false)
    }
  }, []);

  const handleStateInformasi = () => {
    setloading(true)
    setTimeout(() => {
      EncryptedStorage.getItem('informasiForm').then(res => {
        if (res) {
          try {
            let data = JSON.parse(res)
            setimages(data.images)
            setimagesAtas(data.imagesAtas)
            setimagesDepan(data.imagesDepan)
            setimagesBelakang(data.imagesBelakang)
            setimagesSamping(data.imagesSamping)
            setkategoriName(data.kategoriName)
            setktColor(data.ktColor)
            setkategoriValue(data.kategoriValue)
            setshowSubCategorys(data.showSubCategorys)
            setkategoriName(data.kategoriName)
            setsubkategoriName(data.subkategoriName)
            setsktColor(data.sktColor)
            setkategoriForm(data.kategoriForm)
            setnamaprodukValue(data.namaprodukValue)
            setnamaprodukFrom(data.namaprodukFrom)
            sethargaValue(data.hargaValue)
            setStockValue(data.stockValue)
            sethargaForm(data.hargaForm)
            setbrandName(data.brandName)
            setbrandValue(data.brandValue)

            setbrColor(data.brColor)
            setetalaseSelected(data.etalaseSelected)
            setcheckedKondisi(data.checkedKondisi)
            setcheckedAsalproduk(data.checkedAsalproduk)
            setpreorderForm(data.preorderForm)
            setpreorderName(data.preorderName)
            setpreorderValue(data.preorderValue)
            setpreorderShow(data.preorderShow)
            setcheckedPreorder(data.checkedPreorder)
            setcheckedPreorderTime(data.checkedPreorderTime)
            setskuForm(data.skuForm)
            setKodeProdukValue(data.kodeProdukValue)
            setsubkategoriValue(data.subkategoriValue)
            handleStateDeskripsi()
            handleStateDetail()

          } catch (error) {
            getBrand()
          }
        } else {
          // getBrand()
        }
        setloading(false)
      }).catch(err => {
        setloading(false)
      })
    }, 100);

    setTimeout(() => {
      setloading(false)
    }, 2000);
  }

  const handleSave = () => {
    if (open === 1) {
      handleSaveInformasiProduk()
    } else if (open === 2) {
      handleSaveDescription()
    } else if (open === 3) {
      handleSaveDetail()
    } else {
      handleSaveVariasi()
    }
  }

  const handleSaveInformasiProduk = () => {
    try {
      EncryptedStorage.setItem('informasiForm', JSON.stringify({
        images: images,
        imagesAtas: imagesAtas,
        imagesDepan: imagesDepan,
        imagesBelakang: imagesBelakang,
        imagesSamping: imagesSamping,
        kategoriName: kategoriName,
        ktColor: ktColor,
        kategoriValue: kategoriValue,
        showSubCategorys: showSubCategorys,
        subkategoriValue: subkategoriValue,
        subkategoriName: subkategoriName,
        sktColor: sktColor,
        kategoriForm: kategoriForm,
        namaprodukValue: namaprodukValue,
        namaprodukFrom: namaprodukFrom,
        hargaValue, hargaValue,
        stockValue: stockValue,
        hargaForm: hargaForm,
        brandName: brandName,
        brandValue: brandValue,
        brColor: brColor,
        etalaseSelected: etalaseSelected,
        checkedKondisi: checkedKondisi,
        checkedAsalproduk: checkedAsalproduk,
        preorderForm: preorderForm,
        preorderName: preorderName,
        preorderValue: preorderValue,
        preorderShow: preorderShow,
        checkedPreorder: checkedPreorder,
        checkedPreorderTime: checkedPreorderTime,
        skuForm: skuForm,
        kodeProdukValue: kodeProdukValue,
        skuForm: skuForm
      }))
    } catch (error) {
      console.log("🚀 ~ file: index.js ~ line 267 ~ handleSaveInformasiProduk ~ error", error)
    }
  }

  const handleSaveDescription = () => {
    try {
      EncryptedStorage.setItem('deskripsiForm', JSON.stringify({
        deskripsiValue: deskripsiValue
      }))
    } catch (error) {
      console.log("🚀 ~ file: index.js ~ line 315 ~ handleSaveDescription ~ error", error)
    }
  }
  const handleSaveDetail = () => {
    try {
      EncryptedStorage.setItem('detailForm', JSON.stringify({
        beratValue: beratValue,
        tipe_berat: tipe_berat,
        panjangValue: panjangValue,
        lebarValue: lebarValue,
        tinggiValue: tinggiValue
      }))
    } catch (error) {
      console.log("🚀 ~ file: index.js ~ line 320 ~ handleSaveDetail ~ error", error)
    }
  }
  const handleSaveVariasi = () => {
    try {
      EncryptedStorage.setItem('detailVariasi', JSON.stringify(variasi))
    } catch (error) {
      console.log("🚀 ~ file: index.js ~ line 320 ~ handleSaveDetail ~ error", error)
    }
  }

  const handleStateDeskripsi = () => {
    EncryptedStorage.getItem('deskripsiForm').then(res => {
      if (res) {
        try {
          let data = JSON.parse(res)
          setDeskripsiValue(data.deskripsiValue)
          setdeskripsiForm({
            style: styles.smallTextDeskripsi,
            text: 'Masukkan deskripsi sesuai produk yang kamu jual'
          })
          setLenghtDeskripsi(String(data.deskripsiValue).length)
        } catch (error) {
        }
      } else {
      }
    }).catch(err => {
    })
  }

  const handleStateDetail = () => {
    EncryptedStorage.getItem('detailForm').then(res => {
      if (res) {
        try {
          let data = JSON.parse(res)
          setberatValue(data.beratValue)
          settipe_berat(data.tipe_berat)
          setpanjangValue(data.panjangValue)
          setlebarValue(data.lebarValue)
          settinggiValue(data.tinggiValue)

        } catch (error) {
        }
      } else {
      }
    }).catch(err => {
    })
  }

  const getItem = () => {
    try {
      ServiceProduct.getCategorys().then(res => {
        setcategorys(res.kategori)
      })
      ServiceProduct.getBrands().then(res => {
        setbrands(res.brand)
        setbrandValue(res.brand[0]?.id_data)
        setbrandName(res.brand[0]?.merek)
        setbrColor(Colors.blackgrayScale)
      })
      getEtalase()
    } catch (error) {
      console.log("🚀 ~ file: index.js ~ line 292 ~ getItem ~ error", error)
    }
  }


  const getBrand = () => {
    setbrandValue(brands[0]?.id_data)
    setbrandName(brands[0]?.merek)
    setbrColor(Colors.blackgrayScale)
  }

  const backAction = () => {
    navigation.navigate('Produk')
    return true;
  };

  const showActionSheet = (val) => {
    imageRef.current.show()
    setSide(val)
  }

  const goToPicFromCameras = () => {
    if (side == 'utama') {
      ImagePicker.openCamera({
        includeBase64: true,
      }).then((image) => {
        setimages(image)
      });
    } else if (side == 'depan') {
      ImagePicker.openCamera({
        includeBase64: true,
      }).then((image) => {
        setimagesDepan(image)
      });
    } else if (side == 'atas') {
      ImagePicker.openCamera({
        includeBase64: true,
      }).then((image) => {
        setimagesAtas(image)
      });
    } else if (side == 'belakang') {
      ImagePicker.openCamera({
        includeBase64: true,
      }).then((image) => {
        setimagesBelakang(image)
      });
    } else if (side == 'samping') {
      ImagePicker.openCamera({
        includeBase64: true,
      }).then((image) => {
        setimagesSamping(image)
      });
    } else {
      ImagePicker.openCamera({
        cropping: false,
        includeBase64: false,
        mediaType: 'video'
      }).then(vid => {
        setVideo(vid)
      });
    }
    setimageError(false)
  }

  const goToPickImage = () => {
    if (side == 'utama') {
      ImagePicker.openPicker({
        includeBase64: true,
      }).then((image) => {
        setimages(image)
      });
    } else if (side == 'depan') {
      ImagePicker.openPicker({
        includeBase64: true,
      }).then((image) => {
        setimagesDepan(image)
      });
    } else if (side == 'atas') {
      ImagePicker.openPicker({
        includeBase64: true,
      }).then((image) => {
        setimagesAtas(image)
      });
    } else if (side == 'belakang') {
      ImagePicker.openPicker({
        includeBase64: true,
      }).then((image) => {
        setimagesBelakang(image)
      });
    } else {
      ImagePicker.openPicker({
        includeBase64: true,
      }).then((image) => {
        setimagesSamping(image)
      });
    }
    setimageError(false)
  }

  const handleActionSheet = (text) => {
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
    } else if (text === 'etalase') {
      etalaseRef.current?.setModalVisible();
    } else {
      console.log("index -> text", text)
    }
  }

  const onChangeText = (val, name) => {
    if (name === "namaProduk") {
      let newObj = namaprodukFrom
      newObj.text = ""
      newObj.style = styles.smallTextCenter;
      let res = regexChar(val, "namaProduk")
      setnamaprodukFrom(newObj)
      setnamaprodukValue(res)

    } else if (name === "harga") {
      let newObj = hargaForm
      newObj.text = ""
      newObj.style = styles.smallTextCenter;
      let regex = regexChar(val, "currency")
      let res = Utils.money(regex)
      sethargaForm(newObj)
      sethargaValue(res)
      settextInputCurrency(false)
      setAutoFocus(true)

    } else if (name === "stock") {
      setStockValue(regexChar(val, "number"))

    } else if (name === "sku") {
      let newObj = skuForm
      newObj.text = ""
      newObj.style = styles.smallTextCenter;
      setskuForm(newObj)
      setKodeProdukValue(regexChar(val, "charnumberSpace"))

    } else if (name === "deskripsi") {
      let newObj = skuForm
      newObj.text = "Masukkan deskripsi sesuai produk yang kamu jual"
      newObj.style = styles.smallTextCenter;
      setskuForm(newObj)
      setDeskripsiValue(val)
      setLenghtDeskripsi(String(val).length)

    } else if (name === "berat") {
      setberatValue(regexChar(val, "number"))
    }
    setUpdate(update + 1)
  }

  const regexChar = (text, val) => {
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

  const handleSimpan = (val) => {
    switch (val) {
      case 'next':
        handlePostProduk('arsipkan')
        setloading(true)
        break;
      case 'nextTwo':
        handlePostProduk('live')
        setloading(true)
        break;
      default:
        break;
    }
  }

  const handlePostProduk = (val) => {
    let asal_produk = checkedAsalproduk === 'first' ? 4 : 5;
    let kondisi = checkedKondisi === 'first' ? 'baru' : 'bekas';
    let preorder_status = checkedPreorder === 'first' ? 'T' : 'Y';
    let produk_variasi_harga = "Y"
    let newArr = variasi
    if (newArr?.length === 0) {
      produk_variasi_harga = 'T';
      newArr = '';
    }

    let credentials = {
      'save_as': val,
      'nama_produk': namaprodukValue,
      'id_kategori': kategoriValue,
      'id_sub_kategori': subkategoriValue,
      'deskripsi': deskripsiValue,
      'merek': brandValue,
      'etalase': etalaseSelected?.id ? etalaseSelected.id : '',
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
      'id_toko': reduxStore.id_toko,
      'kondisi': kondisi,
      'pre_order': preorder_status,
      'masa_pengemasan': preorderValue,
      'file_foto_1': Object.keys(images).length === 0 ? "" : images.data,
      'file_foto_2': Object.keys(imagesDepan).length === 0 ? "" : imagesDepan.data,
      'file_foto_3': Object.keys(imagesAtas).length === 0 ? "" : imagesAtas.data,
      'file_foto_4': Object.keys(imagesBelakang).length === 0 ? "" : imagesBelakang.data,
      'file_foto_5': Object.keys(imagesSamping).length === 0 ? "" : imagesSamping.data,
    }
    setTimeout(() => {
      try {
        ServiceProduct.addProduct(credentials).then(res => {
          let response = ""
          try {
            response = JSON.parse(res)
          } catch (error) {
            response = res + ""
          }
          if (response.status == 201) {
            handleFetchProduct()
            setTimeout(() => {
              AsyncStorage.setItem('updateProduk', 'update');
              setloading(false)
              setTimeout(() => navigation.navigate("Produk", { data: 'update' }), 100);
            }, 1000)
            EncryptedStorage.removeItem("informasiForm");
            EncryptedStorage.removeItem("deskripsiForm");
            EncryptedStorage.removeItem("detailForm");
            EncryptedStorage.removeItem("detailVariasi");


          } else if (response.status === 409) {
            setloading(false)
            setTimeout(() => Utils.alertPopUp(`Nama produk ${namaprodukValue} sudah pernah digunakan!`), 100)
            setOpen(1)
          } else {
            setloading(false)
            if (res.message == "Request failed with status code 500") {
              setTimeout(() => Utils.alertPopUp("Pastikan kolom berbintang tidak dikosongi!"), 100)
            } else {
              setTimeout(() => Utils.alertPopUp("Periksa kembali signal anda!"), 100)
            }
          }
        })
      } catch (error) {
        Utils.alertPopUp("Periksa kembali koneksi anda!")
        setloading(false)
      }
    }, 1000)
  }

  const handleFetchProduct = async () => {
    try {
      dispatch({ type: 'FETCH_PRODUCTS', payload: true })
      dispatch({ type: 'FETCH_LIVE', payload: true })
      dispatch({ type: 'FETCH_ARCHIVE', payload: true })
      dispatch({ type: 'FETCH_SOLDOUT', payload: true })
    } catch (error) {
      console.log("file: index.js ~ line 106 ~ handleFetchProduct ~ error", error)
    }
  }

  const handleNext = (text) => {
    try {
      if (text === "informasi") {
        let result = validationState()
        if (result === true) {
          setOpen(open + 1)
          handleSave()
        }
      } else if (text === "deskripsi") {
        if (!deskripsiValue) {
          let newObj = deskripsiForm
          newObj.text = "Deskripsi tidak boleh kosong"
          newObj.style = Style.smallTextAlertError
          setdeskripsiForm(newObj)
          Utils.alertPopUp('Deskripsi tidak boleh kosong')
        } else if (deskripsiValue.length < 50) {
          let newObj = deskripsiForm
          newObj.text = "Deskripsi terlalu pendek, minimal 50 karakter"
          newObj.style = Style.smallTextAlertError
          setdeskripsiForm(newObj)
          Utils.alertPopUp('Deskripsi terlalu pendek, minimal 50 karakter')
        } else {
          setOpen(open + 1)
          handleSave()
        }
      } else if (text === 'detail') {
        handleSave()
      }
    } catch (error) {
      console.log("🚀 ~ file: index.js ~ line 379 ~ handleNext ~ error", error)
    }
  }

  const validationState = () => {
    if (!images?.path && !imagesDepan?.path && !imagesBelakang?.path && !imagesAtas?.path && !imagesBelakang?.path && !imagesSamping?.path) {
      Utils.alertPopUp("Foto produk tidak boleh kosong!")
      setimageError(true)
    } else if (!kategoriValue) {
      let newObj = kategoriForm
      newObj.text = "Kategori tidak boleh kosong!"
      newObj.style = Style.smallTextAlertError
      setkategoriForm(newObj)
      setUpdate(update + 1)
      Utils.alertPopUp("Kategori tidak boleh kosong!")
      return false
    } else if (showSubCategorys && !subkategoriValue) {
      console.log("🚀 ~ file: index.js ~ line 482 ~ validationState ~ subkategoriValue", subkategoriValue)
      console.log("🚀 ~ file: index.js ~ line 482 ~ validationState ~ showSubCategorys", showSubCategorys)
      let newObj = kategoriForm
      newObj.text = "Sub Kategori tidak boleh kosong!"
      newObj.style = Style.smallTextAlertError
      setkategoriForm(newObj)
      setUpdate(update + 1)
      Utils.alertPopUp("Sub Kategori tidak boleh kosong!")
      return false

    } else if (!namaprodukValue) {
      let newObj = namaprodukFrom
      newObj.text = "Nama produk tidak boleh kosong"
      newObj.style = Style.smallTextAlertError
      setnamaprodukFrom(newObj)
      setUpdate(update + 1)
      Utils.alertPopUp("Nama produk tidak boleh kosong!")
      return false

    } else if (!hargaValue) {
      let newObj = hargaForm
      newObj.text = "Harga produk tidak boleh kosong"
      newObj.style = Style.smallTextAlertError
      sethargaForm(newObj)
      setUpdate(update + 1)
      Utils.alertPopUp("Harga produk tidak boleh kosong!")
      return false

    } else if (!kodeProdukValue) {
      let newObj = skuForm
      newObj.text = "Kode produk tidak boleh kosong!"
      newObj.style = Style.smallTextAlertError
      setskuForm(newObj)
      setUpdate(update + 1)
      Utils.alertPopUp("Kode produk tidak boleh kosong!")
      return false
    } else if (!brandValue) {
      setUpdate(update + 1)
      Utils.alertPopUp("Merek produk tidak boleh kosong!")
      return false
    }
    else {
      return true
    }
  }

  const handleValueDropdown = (text, val) => {
    if (text === "kategori") {
      kategoriRef.current?.setModalVisible(false)
      let newObj = kategoriForm
      newObj.text = ""
      newObj.style = styles.smallTextCenter
      let arrsubCategorys = val.sub_kategori;
      arrsubCategorys.sort()
      setsubCategorys(arrsubCategorys)
      setkategoriValue(val.id_kategori)
      setkategoriName(val.kategori)
      setktColor(Colors.blackgrayScale)
      setsktColor('#C0C0C0')
      setsubkategoriName('Sub Kategori')
      setsubkategoriValue('')
      let arr = val.sub_kategori
      if (arr.length == 0) {
        setshowSubCategorys(false)
      } else {
        setshowSubCategorys(true)
      }
    } else if (text === "subKategori") {
      setsubkategoriValue(val.id_sub_kategori)
      setsubkategoriName(val.sub_kategori)
      setsktColor(Colors.blackgrayScale)
      subKategoriRef.current?.setModalVisible(false)
      let newObj = kategoriForm
      newObj.text = ""
      newObj.style = styles.smallTextCenter
      setkategoriForm(newObj)
    } else if (text === "brand") {
      setbrandValue(val?.id_data)
      setbrandName(val?.merek)
      setbrColor(Colors.blackgrayScale)
      brandRef.current?.setModalVisible(false)
    } else if (text === "preorder") {
      let result = val.value.substring(0, 2);
      result.replace(" ", "")
      let newObj = preorderForm
      newObj.text = "Tentukan berapa hari masa pengemasan produkmu!";
      newObj.style = styles.smallTextAlert;
      setpreorderForm(newObj)
      setpreorderValue(result)
      setpreorderName(val.value)
      setpoColor(Colors.blackgrayScale)
      preorderRef.current?.setModalVisible(false)
    } else if (text === "tipeBerat") {
      settipe_berat(val.value)
      weightRef.current?.setModalVisible(false)
    } else if (text === 'etalase') {
      setetalaseSelected(val)
      etalaseRef.current?.setModalVisible(false)
    }

  }

  const renderCategorys = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleValueDropdown("kategori", item)} style={styles.touchKategori}>
        <Text style={styles.textKategori}>{item.kategori}</Text>
      </TouchableOpacity >
    )
  }

  const renderSubCategorys = ({ item }) => {
    // console.log("renderItem -> sub category", item)
    return (
      <TouchableOpacity onPress={() => handleValueDropdown("subKategori", item)} style={styles.touchKategori}>
        <Text style={styles.textKategori}>{item.sub_kategori}</Text>
      </TouchableOpacity >
    )
  }
  const renderBrand = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleValueDropdown("brand", item)} style={styles.touchKategori}>
        <Text style={styles.textKategori}>{item?.merek}</Text>
      </TouchableOpacity >
    )
  }

  const renderEtalase = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleValueDropdown("etalase", item)} style={styles.touchKategori}>
        <Text style={styles.textKategori}>{item?.name}</Text>
      </TouchableOpacity >
    )
  }

  const renderPreorder = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleValueDropdown("preorder", item)} style={styles.touchKategori}>
        <Text style={styles.textKategori}>{item.value}</Text>
      </TouchableOpacity >
    )
  }

  const renderWeightType = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleValueDropdown("tipeBerat", item)} style={styles.touchKategori}>
        <Text style={styles.textKategori}>{item.value}</Text>
      </TouchableOpacity >
    )
  }

  const handleDeleteVariasi = (index) => {
    // let newArray = variasiValue.slice(variasiValue.splice(index, 1))
    // setTimeout(() => this.setState({ variasiValue: newArray }), 100)
  }

  const getEtalase = async () => {
    ServiceProduct.getEtalase(reduxStore.id_toko).then(res => {
      console.log("🚀 ~ file: index.js ~ line 905 ~ ServiceProduct.getEtalase ~ res", res)
      if (res?.length) {
        setlistEtalase(res.reverse())
        setcount(count + 1)
      }
    })
  }

  return (
    <SafeAreaView style={[Style.container]}>
      {loading ? <Loading /> : null}

      <View style={[Style.header, { backgroundColor: Colors.biruJaja }]}>
        <View style={Style.row_start_center}>
          <IconButton
            icon={require('../../../icon/arrow.png')}
            style={{ margin: 0, padding: 0 }}
            color={Colors.white}
            size={24}
            onPress={() => {
              if (titleHeader === 'Usulkan Brand') {
                setTitleHeader('Tambah Produk')
              } else if (open > 1) {
                setOpen(open - 1)
                handleSave()
              }
              else {
                navigation.goBack()
              }
            }}
          />
          <Text adjustsFontSizeToFit style={[Style.font_16, Style.semi_bold, { color: Colors.white, marginBottom: Platform.OS == 'android' ? '-1%' : 3 }]}>{titleHeader === 'Tambah Produk' ? 'Tambah Produk' : 'Kembali'}</Text>

        </View>
      </View>
      <View style={[Style.column_center, { backgroundColor: Platform.OS === 'ios' ? Colors.white : null }]}>
        {titleHeader === 'Tambah Produk' ?
          open === 1 ?
            <View style={[Style.column, Style.p_3]}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={[Style.font_14, Style.semi_bold, { color: Colors.biruJaja }]}>Foto Produk</Text>
                <ScrollView horizontal={true} contentContainerStyle={Style.row_wrap} showsHorizontalScrollIndicator={false} >
                  {images?.path ?
                    <View style={styles.produkImage}>
                      <Image style={styles.image} source={{ uri: images.path }} />
                      <TouchableOpacity style={styles.iconDelete} onPress={() => setimages({})} >
                        <Image source={require("../../../icon/close.png")} style={styles.iconDeleteImage} />
                      </TouchableOpacity>
                    </View>
                    :
                    <TouchableOpacity
                      style={styles.boxImage}
                      onPress={() => showActionSheet('utama')}>
                      <View style={[styles.imageView, { borderColor: imageError ? Colors.redNotif : Colors.blackgrayScale }]}>
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

                  {imagesDepan?.path ?
                    <View style={styles.produkImage}>
                      <Image style={styles.image} source={{ uri: imagesDepan.path }} />
                      <TouchableOpacity style={styles.iconDelete} onPress={() => setimagesDepan({})}>
                        <Image source={require("../../../icon/close.png")} style={styles.iconDeleteImage} />
                      </TouchableOpacity>
                    </View>
                    :
                    <TouchableOpacity
                      style={styles.boxImage}
                      onPress={() => showActionSheet('depan')}>
                      <View style={[styles.imageView, { borderColor: imageError ? Colors.redNotif : Colors.blackgrayScale }]}>
                        <Image source={require('../../../icon/add_image.png')}
                          style={styles.iconBoxImage}
                        />
                        <Text style={styles.texBoxImage}>depan</Text>
                      </View>
                    </TouchableOpacity>
                  }

                  {imagesAtas?.path ?
                    <View style={styles.produkImage}>
                      <Image style={styles.image} source={{ uri: imagesAtas.path }} />
                      <TouchableOpacity style={styles.iconDelete} onPress={() => setimagesAtas({})}>
                        <Image source={require("../../../icon/close.png")} style={styles.iconDeleteImage} />
                      </TouchableOpacity>
                    </View>
                    :
                    <TouchableOpacity
                      style={styles.boxImage}
                      onPress={() => showActionSheet('atas')}>
                      <View style={[styles.imageView, { borderColor: imageError ? Colors.redNotif : Colors.blackgrayScale }]}>
                        <Image
                          source={require('../../../icon/add_image.png')}
                          style={styles.iconBoxImage}
                        />
                        <Text style={styles.texBoxImage}>atas</Text>
                      </View>
                    </TouchableOpacity>

                  }


                  {imagesBelakang?.path ?
                    <View style={styles.produkImage}>
                      <Image style={styles.image} source={{ uri: imagesBelakang.path }} />
                      <TouchableOpacity style={styles.iconDelete} onPress={() => setimagesBelakang({})}>
                        <Image source={require("../../../icon/close.png")} style={styles.iconDeleteImage} />
                      </TouchableOpacity>
                    </View>
                    :
                    <TouchableOpacity
                      style={styles.boxImage}
                      onPress={() => showActionSheet('belakang')}>
                      <View style={[styles.imageView, { borderColor: imageError ? Colors.redNotif : Colors.blackgrayScale }]}>
                        <Image
                          source={require('../../../icon/add_image.png')}
                          style={styles.iconBoxImage}
                        />
                        <Text style={styles.texBoxImage}>belakang</Text>
                      </View>
                    </TouchableOpacity>
                  }
                  {imagesSamping?.path ?
                    <View style={styles.produkImage}>
                      <Image style={styles.image} source={{ uri: imagesSamping.path }} />
                      <TouchableOpacity style={styles.iconDelete} onPress={() => setimagesSamping({})}>
                        <Image source={require("../../../icon/close.png")} style={styles.iconDeleteImage} />
                      </TouchableOpacity>
                    </View>
                    :
                    <TouchableOpacity
                      style={styles.boxImage}
                      onPress={() => showActionSheet('samping')}>
                      <View style={[styles.imageView, { borderColor: imageError ? Colors.redNotif : Colors.blackgrayScale }]}>
                        <Image
                          source={require('../../../icon/add_image.png')}
                          style={styles.iconBoxImage}
                        />
                        <Text style={styles.texBoxImage}>samping</Text>
                      </View>
                    </TouchableOpacity>
                  }
                </ScrollView>
                <View style={[Style.column, Style.mt_5]}>
                  <Text style={[Style.font_14, Style.semi_bold, Style.mb_2, { color: Colors.biruJaja }]}>Informasi Produk</Text>
                  <View style={[Style.row_center]}>
                    <Text style={[Style.font_13, Style.medium, { flex: 1 }]}>Kategori<Text style={[Style.font_14, { color: Colors.redNotif }]}> *</Text></Text>
                    {showSubCategorys ?
                      <Text style={[Style.font_13, Style.medium, { flex: 1 }]}>
                        Sub Kategori<Text style={styles.red}> *</Text>
                      </Text>
                      :
                      null
                    }
                  </View>
                  <View style={[Style.row_center]}>
                    <View style={[Style.row_space, Style.pl, { width: '100%', }]}>
                      <Text style={[Style.font_12, { color: ktColor }]}>{kategoriName}</Text>
                      <IconButton
                        style={{ margin: 0 }}
                        icon={require('../../../icon/down-arrow.png')}
                        color={Colors.biruJaja}
                        size={25}
                        onPress={() => handleActionSheet("kategori")} />
                    </View>
                    {showSubCategorys ?
                      <View style={[Style.row_space, Style.pl, { width: '100%', }]}>
                        <Text style={[Style.font_12, { color: sktColor }]}>{subkategoriName}</Text>
                        <IconButton
                          style={{ margin: 0 }}
                          icon={require('../../../icon/down-arrow.png')}
                          color={Colors.biruJaja}
                          size={25}
                          onPress={() => handleActionSheet("subKategori")}
                        />
                      </View>
                      :
                      null
                    }
                  </View>
                  <Text style={kategoriForm.style}>
                    {kategoriForm.text}
                  </Text>
                  <Text style={[Style.font_13, Style.medium, { flex: 1 }]}>
                    Nama<Text style={styles.red}> *</Text>
                  </Text>
                  <TextInput
                    style={[Style.font_12, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver, padding: '1%' }]}
                    placeholder="Notebook Asus A409UJ-BV351T"
                    placeholderTextColor={Colors.silver}
                    value={namaprodukValue}
                    onChangeText={(text) => onChangeText(text, "namaProduk")}
                  />
                  <Text style={namaprodukFrom.style}>
                    {namaprodukFrom.text}
                  </Text>
                  <View style={[Style.row_center, Style.mb]}>
                    <Text style={[Style.font_13, Style.medium, { flex: 1 }]}>
                      Harga<Text style={styles.red}> *</Text>
                    </Text>
                    <Text style={[Style.font_13, Style.medium, { flex: 1 }]}>
                      Stok Tersedia<Text style={styles.red}> *</Text>
                    </Text>
                  </View>
                  <View style={[Style.row_center]}>
                    <View style={Style.row_center}>
                      <Text style={[Style.mr_2, { flex: 0, alignSelf: 'center' }]}> Rp</Text>
                      <TextInput
                        style={{ flex: 1, padding: 0 }}
                        maxLength={11}

                        keyboardType="number-pad"
                        placeholder="10000"
                        value={String(hargaValue)}
                        onChangeText={(text) => onChangeText(text, "harga")}
                      />

                    </View>
                    <View style={Style.row_center}>
                      <TextInput
                        style={{ flex: 1, padding: 0 }}
                        maxLength={5}
                        keyboardType="numeric"
                        placeholder="0"
                        value={String(stockValue)}
                        onChangeText={(text) => onChangeText(text, "stock")} />
                    </View>
                  </View>
                  <Text style={hargaForm.style}>
                    {hargaForm.text}
                  </Text>
                  <Text style={[Style.font_13, Style.medium, { flex: 1 }]}>
                    Merek<Text style={styles.red}> *</Text>
                  </Text>
                  <View style={[Style.row_center, Style.mb, { borderBotColor: Colors.silver, borderBottomWidth: 0.2, }]}>
                    <View style={[Style.row_space, Style.pl, { width: '100%', }]}>
                      <Text style={[Style.font_12, { color: brColor }]}>{brandName}</Text>
                      <IconButton
                        style={{ margin: 0 }}
                        icon={require('../../../icon/down-arrow.png')}
                        color={Colors.biruJaja}
                        size={25}
                        onPress={() => handleActionSheet("brand")} />
                    </View>
                  </View>
                  <TouchableOpacity style={{ marginBottom: '2%' }} onPress={() => {
                    titleHeader === "Tambah Produk" ? setTitleHeader('Usulkan Brand') : setTitleHeader('Tambah Produk')
                  }}>
                    <Text style={[Style.font_12, Style.italic, { color: Colors.biruJaja }]}>Usulkan Brand</Text>
                  </TouchableOpacity>
                  <View style={[Style.row_0_center]}>
                    <Text style={[Style.font_13, Style.medium, { flex: 1 }]}>
                      Etalase Toko
                    </Text>
                  </View>
                  <View style={[Style.row_center, Style.mb, { borderBotColor: Colors.silver, borderBottomWidth: 0.2, }]}>
                    <View style={[Style.row_space, Style.pl, { width: '100%', }]}>
                      <Text style={[Style.font_12, { color: brColor }]}>{etalaseSelected?.name ? etalaseSelected.name : 'Tidak Ada'}</Text>
                      <IconButton
                        style={{ margin: 0 }}
                        icon={require('../../../icon/down-arrow.png')}
                        color={Colors.biruJaja}
                        size={25}
                        onPress={() => {
                          if (listEtalase?.length) {
                            handleActionSheet("etalase")
                          } else {
                            setEtalaseModal(true)
                          }
                        }} />

                    </View>
                  </View>

                  <TouchableOpacity style={{ marginBottom: '2%' }} onPress={() => setEtalaseModal(true)} >
                    <Text style={[Style.font_12, Style.italic, { color: Colors.biruJaja }]}>Tambah Etalase Toko</Text>
                  </TouchableOpacity>
                  <Text style={[Style.font_13, Style.medium]}>
                    Kondisi<Text style={styles.red}> *</Text>
                  </Text>
                  <View style={[Style.row_start_center]}>
                    <View style={[Style.row_start_center, Style.mt]}>
                      <RadioButton
                        color={Colors.biruJaja}
                        value="first"
                        status={checkedKondisi === 'first' ? 'checked' : 'unchecked'}
                        onPress={() => setcheckedKondisi('first')}
                      />
                      <Text style={[Style.font_13]}>Baru</Text>
                    </View>
                    <View style={[Style.row_start_center, Style.mt]}>
                      <RadioButton
                        color={Colors.biruJaja}
                        value="second"
                        status={checkedKondisi === 'second' ? 'checked' : 'unchecked'}
                        onPress={() => setcheckedKondisi('second')}
                      />
                      <Text style={[Style.font_13]}>Bekas</Text>
                    </View>
                  </View>
                  <Text style={[Style.font_13, Style.medium]}>
                    Asal produk<Text style={styles.red}> *</Text>
                  </Text>
                  <View style={[Style.row_start_center]}>
                    <View style={[Style.row_start_center, Style.mt]}>
                      <RadioButton
                        color={Colors.biruJaja}
                        value="first"
                        status={checkedAsalproduk === 'first' ? 'checked' : 'unchecked'}
                        onPress={() => setcheckedAsalproduk('first')}
                      />
                      <Text style={[Style.font_13]}>Dalam Negri</Text>
                    </View>
                    <View style={[Style.row_start_center, Style.mt]}>
                      <RadioButton
                        color={Colors.biruJaja}
                        value="second"
                        status={checkedAsalproduk === 'second' ? 'checked' : 'unchecked'}
                        onPress={() => setcheckedAsalproduk('second')}
                      />
                      <Text style={[Style.font_13]}>Luar Negri</Text>
                    </View>
                  </View>
                  <Text style={[Style.font_13, Style.medium]}>
                    Pre-order<Text style={styles.red}> *</Text>
                  </Text>
                  <View style={[Style.row_start_center]}>
                    <View style={[Style.row_start_center, Style.mt]}>
                      <RadioButton
                        color={Colors.biruJaja}
                        value="first"
                        status={checkedPreorder === 'first' ? 'checked' : 'unchecked'}
                        onPress={() => setcheckedPreorder('first')}
                      />
                      <Text style={[Style.font_13]}>Tidak</Text>
                    </View>
                    <View style={[Style.row_start_center, Style.mt]}>
                      <RadioButton
                        color={Colors.biruJaja}
                        value="second"
                        status={checkedPreorder === 'second' ? 'checked' : 'unchecked'}
                        onPress={() => setcheckedPreorder('second')}
                      />
                      <Text style={[Style.font_13]}>Ya</Text>
                    </View>
                  </View>
                  {checkedPreorder === "first" ?
                    null :
                    <>
                      <View style={[Style.row_center, Style.mb]}>
                        <Text style={[Style.font_13, Style.medium, { flex: 1 }]}>
                          Masa Pengemasan<Text style={styles.red}> *</Text>
                        </Text>
                      </View>
                      <View style={[Style.row_center, Style.mb]}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                          <View style={Style.row}>
                            <RadioButton
                              color={Colors.biruJaja}
                              value="7"
                              status={checkedPreorderTime === '7' ? 'checked' : 'unchecked'}
                              onPress={() => {
                                setcheckedPreorderTime('7')
                                setpreorderValue('7')
                              }}
                            />
                            <Text style={[Style.font_13, { marginBottom: '-0.5%' }]}>7 Hari</Text>
                          </View>
                          <View style={Style.row}>
                            <RadioButton
                              color={Colors.biruJaja}
                              value="14"
                              status={checkedPreorderTime === '14' ? 'checked' : 'unchecked'}
                              onPress={() => {
                                setcheckedPreorderTime('14')
                                setpreorderValue('14')
                              }}
                            />
                            <Text style={[Style.font_13, { marginBottom: '-0.5%' }]}>14 Hari</Text>
                          </View>
                          <View style={Style.row}>
                            <RadioButton
                              color={Colors.biruJaja}
                              value="21"
                              status={checkedPreorderTime === '21' ? 'checked' : 'unchecked'}
                              onPress={() => {
                                setcheckedPreorderTime('21')
                                setpreorderValue('21')
                              }}
                            />
                            <Text style={[Style.font_13, { marginBottom: '-0.5%' }]}>21 Hari</Text>
                          </View>
                          <View style={Style.row}>
                            <RadioButton
                              color={Colors.biruJaja}
                              value="31"
                              status={checkedPreorderTime === '31' ? 'checked' : 'unchecked'}
                              onPress={() => {
                                setcheckedPreorderTime('31')
                                setpreorderValue('31')
                              }}
                            />
                            <Text style={[Style.font_13, { marginBottom: '-0.5%' }]}>Lainnya</Text>
                          </View>
                        </View>

                      </View>
                      {checkedPreorderTime == '31' ?
                        <TextInput
                          style={[Style.font_13, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver }]}
                          placeholder="31"
                          keyboardType='number-pad'
                          value={preorderValue}
                          onChangeText={(text) => {
                            setpreorderValue(text)
                            setpreorderName(text)
                          }}
                        /> : null
                      }
                      <Text style={[styles.smallTextCenter, { borderTopWidth: 0 }]}>
                      </Text>
                    </>
                  }
                  <Text style={[Style.font_13, Style.medium,]}>
                    SKU (Stock Keeping Unit)<Text style={styles.red}> *</Text>
                  </Text>
                  <TextInput
                    style={[Style.font_13, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver }]}
                    placeholder="Kode produk"
                    value={kodeProdukValue}
                    onChangeText={(text) => onChangeText(text, "sku")}
                  />
                  <Text style={skuForm?.style}>{skuForm?.text}</Text>

                  <Button contentStyle={{ width: Wp('100%') }} color={Colors.biruJaja} uppercase={false} labelStyle={[Style.font_12, Style.semi_bold, { color: Colors.white }]} mode="contained" onPress={() => handleNext("informasi")}>
                    Lanjutkan
                  </Button>
                </View>
              </ScrollView >
            </View >
            : open === 2 ?
              <View style={[Style.column, Style.px_3, Style.py_5, { width: '100%', height: '100%' }]}>
                <Text style={[Style.font_14, Style.semi_bold, { color: Colors.biruJaja }]}>Deskripsi Produk</Text>
                <View>
                  <TextInput
                    multiline={true}
                    numberOfLines={25}
                    textAlignVertical="top"
                    maxLength={3000}
                    placeholder={deskripsiPlaceholder}
                    value={deskripsiValue}
                    onChangeText={(text) => onChangeText(text, "deskripsi")}
                    style={styles.inputbox}
                  />
                </View>
                <View style={[styles.deskripsiRow, { marginBottom: '3%' }]}>
                  <Text style={deskripsiForm?.style}>
                    {deskripsiForm?.text}
                  </Text>
                  <Text style={styles.deskripsiSmallTExt}>
                    {lenghtDeskripsi}/3000
                  </Text>



                </View>
                <View style={Style.row_between_center}>
                  <Button color={Colors.kuningJaja} uppercase={false} labelStyle={[Style.font_12, Style.semi_bold, { color: Colors.white }]} mode="contained" onPress={() => setOpen(open - 1)}>
                    Sebelumnya
                  </Button>

                  <Button color={Colors.biruJaja} uppercase={false} labelStyle={[Style.font_12, Style.semi_bold, { color: Colors.white }]} mode="contained" onPress={() => handleNext("deskripsi")}>
                    Lanjutkan
                  </Button>
                </View>
              </View>
              : open === 4 ?
                <View style={[Style.column, Style.p_3, { width: Wp('100%'), height: Hp('100%') }]}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={[Style.font_14, Style.semi_bold, { color: Colors.biruJaja }]}>Variasi Produk</Text>
                    <Variasi handleNext={(val, arr) => {
                      if (val === 5) {
                        setmodalSave(true)
                      } else {
                        setOpen(val)
                      }
                      setvariasi(arr)
                    }}
                      // setvariasi={(val) => setvariasi(val)}
                      dataVariasi={variasi}
                      handleVariasi={(value, show) => handleVariasi(value, show)}
                      data={{ harga: hargaValue, sku: kodeProdukValue }} />
                  </ScrollView>
                </View>
                : open === 3 ?
                  <View style={[Style.column, Style.p_3, { width: '100%', height: '100%' }]}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <Text style={[Style.font_14, Style.semi_bold, { color: Colors.biruJaja }]}>Detail Produk</Text>
                      <View style={[Style.column]}>
                        <View style={Style.row_between_center}>
                          <TouchableHighlight>
                            <Text style={styles.titlebtn}>
                              {detailProdukText}
                            </Text>
                          </TouchableHighlight>
                        </View>

                        <View style={Style.row}>
                          <Text style={[Style.font_13, Style.medium, { flex: 1 }]}>
                            Berat<Text style={styles.red}> *</Text>
                          </Text>
                          <Text style={[Style.font_13, Style.medium, { flex: 1 }]}>
                            Tipe Berat<Text style={styles.red}> *</Text>
                          </Text>
                        </View>

                        <View style={[Style.row_center, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver }]}>
                          <View style={{ flex: 1 }}>
                            <TextInput
                              maxLength={5}
                              keyboardType="number-pad"
                              placeholder="0"
                              value={beratValue}
                              onChangeText={(text) => onChangeText(text, "berat")}
                              style={[Style.font_13, { padding: 0, borderWidth: 0, margin: 0, textAlignVertical: 'bottom', marginBottom: '-1%' }]}
                            />
                          </View>
                          <View style={[Style.row_space]}>
                            <Text style={Style.font_13}>{tipe_berat}</Text>
                            <IconButton
                              style={{ margin: 0 }}
                              icon={require('../../../icon/down-arrow.png')}
                              color={Colors.biruJaja}
                              size={25}
                              onPress={() => handleActionSheet("tipeBerat")}
                            />
                          </View>
                        </View>
                        <View style={[Style.row, Style.mt_5]}>
                          <Text style={[Style.font_13, Style.medium, { flex: 1 }]}>Panjang</Text>
                          <Text style={[Style.font_13, Style.medium, { flex: 1 }]}>Lebar</Text>
                          <Text style={[Style.font_13, Style.medium, { flex: 1 }]}>Tinggi</Text>
                        </View>
                        <View style={[Style.row_center, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver }]}>
                          <View style={Style.row}>
                            <TextInput
                              maxLength={5}
                              keyboardType="numeric"
                              placeholder="0"
                              value={panjangValue}
                              onChangeText={(text) => setpanjangValue(text)}
                              style={[Style.font_13, { width: '70%', padding: 0, borderWidth: 0, margin: 0, textAlignVertical: 'bottom', marginBottom: '-1%' }]}
                            />
                            <Text style={{ alignSelf: 'center', marginLeft: '3%' }}>
                              cm
                            </Text>
                          </View>
                          <View style={Style.row}>
                            <TextInput
                              maxLength={5}
                              keyboardType="numeric"
                              placeholder="0"
                              value={lebarValue}
                              onChangeText={(text) => setlebarValue(text)}
                              style={[Style.font_13, { width: '70%', padding: 0, borderWidth: 0, margin: 0, textAlignVertical: 'bottom', marginBottom: '-1%' }]}
                            />
                            <Text style={{ alignSelf: 'center', marginLeft: '3%' }}>
                              cm
                            </Text>
                          </View>
                          <View style={Style.row}>
                            <TextInput
                              maxLength={5}
                              keyboardType="numeric"
                              placeholder="0"
                              value={tinggiValue}
                              onChangeText={(text) => settinggiValue(text)}
                              style={[Style.font_13, { width: '70%', padding: 0, borderWidth: 0, margin: 0, textAlignVertical: 'bottom', marginBottom: '-1%' }]}
                            />
                            <Text style={{ alignSelf: 'center', marginLeft: '3%' }}>
                              cm
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={[Style.row_between_center, Style.mt_5]}>
                        <TouchableRipple
                          style={[Style.px_4, Style.py_2, { width: Wp('30%'), backgroundColor: Colors.kuningJaja, }]}
                          uppercase={false} mode="contained" onPress={async () => {
                            await setOpen(open - 1)
                            handleNext('detail')
                          }}>
                          <Text style={[Style.font_12, Style.semi_bold, { color: Colors.white, alignSelf: 'center' }]}>Sebelumnya</Text>
                        </TouchableRipple>
                        <TouchableRipple
                          style={[Style.px_4, Style.py_2, { width: Wp('35%'), backgroundColor: Colors.greenDep, }]}
                          uppercase={false} mode="contained" onPress={() => {
                            if (!beratValue) {
                              Utils.alertPopUp('Berat produk tidak boleh kosong!')
                            } else {
                              setOpen(4)
                              handleNext('detail')
                            }
                          }}>
                          <Text style={[Style.font_12, Style.semi_bold, { color: Colors.white, alignSelf: 'center' }]}>Tambah Variasi</Text>
                        </TouchableRipple>
                        <TouchableRipple
                          style={[Style.px_4, Style.py_2, { width: Wp('30%'), backgroundColor: Colors.biruJaja, }]}
                          uppercase={false} mode="contained" onPress={async () => {
                            if (!beratValue) {
                              Utils.alertPopUp('Berat produk tidak boleh kosong!')
                            } else {
                              handleNext('detail')
                              setmodalSave(true)
                            }
                          }}>
                          <Text style={[Style.font_12, Style.semi_bold, { color: Colors.white, alignSelf: 'center' }]}>Selesai</Text>
                        </TouchableRipple>
                      </View>
                    </ScrollView>
                  </View>
                  : null
          :
          <NewBrand id={reduxStore.id_toko} data={categorys} handleTitle={(val) => setTitleHeader(val)} />
        }
      </View >

      <ActionSheet
        ref={imageRef}
        title={'Select a Photo'}
        options={['Ambil Gambar', 'Buka Galeri', 'Cancel']}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={(index) => {
          if (index == 0) {
            goToPicFromCameras();
          } else if (index == 1) {
            goToPickImage();
          } else {
            null;
          }
        }} />

      <ActionSheets
        scrollEnabled={true}
        containerStyle={[Style.p_3]}
        ref={kategoriRef}>
        <View style={[Style.column, { height: Hp('55%') }]}>
          <View style={[Style.row_0_center]}>
            <Text style={[Style.font_14, Style.semi_bold, Style.my_3, { color: Colors.biruJaja, flex: 1 }]}>Kategori Produk</Text>
            <TouchableOpacity
              onPress={() => kategoriRef.current?.setModalVisible(false)}>
              <Image
                style={styles.iconClose}
                source={require('../../../icon/close.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={[Style.column, { height: '100%', paddingBottom: 55 }]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              scrollEnabled={true}>
              <FlatList
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
                data={categorys}
                renderItem={renderCategorys}
                keyExtractor={(item, index) => String(index + 'HA')}
              />
            </ScrollView>
          </View>
        </View>
      </ActionSheets>

      <ActionSheets scrollEnabled={true} containerStyle={[Style.p_3]}
        ref={subKategoriRef}>
        <View style={[Style.column, { minHeight: Hp('33%'), maxHeight: Hp('55%') }]}>
          <View style={[Style.row_0_center]}>
            <Text style={[Style.font_14, Style.semi_bold, Style.my_3, { color: Colors.biruJaja, flex: 1 }]}>Sub Kategori</Text>
            <TouchableOpacity onPress={() => subKategoriRef.current?.setModalVisible(false)}>
              <Image
                style={styles.iconClose}
                source={require('../../../icon/close.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={[Style.column, { height: '100%', paddingBottom: 55 }]}>
            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              scrollEnabled={true}>
              <FlatList
                showsVerticalScrollIndicator={false}
                nestedScrollEnable={true}
                data={subCategorys}
                renderItem={renderSubCategorys}
                keyExtractor={(item, index) => String(index + 'HK')}
              />
            </ScrollView>
          </View>
        </View>
      </ActionSheets>

      <ActionSheets scrollEnabled={true} containerStyle={Style.p_3}
        ref={brandRef}>
        <View style={[Style.column, { minHeight: Hp('66%'), maxHeight: Hp('55%') }]}>
          <View style={[Style.row_0_center]}>
            <Text style={[Style.font_14, Style.semi_bold, Style.my_3, { color: Colors.biruJaja, flex: 1 }]}>Merek Produk (Brand)</Text>
            <TouchableOpacity
              onPress={() => brandRef.current?.setModalVisible(false)}
            >
              <Image
                style={styles.iconClose}
                source={require('../../../icon/close.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={{ height: '100%', paddingHorizontal: '1%' }}>
            <ScrollView style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              scrollEnabled={true}>
              <FlatList
                showsVerticalScrollIndicator={false}
                nestedScrollEnable={true}
                data={brands}
                renderItem={renderBrand}
                keyExtractor={(item, index) => String(index + 'DA')}
              />

            </ScrollView>
          </View>
        </View>
      </ActionSheets>

      <ActionSheets scrollEnabled={true} containerStyle={styles.actionSheet}
        ref={weightRef}>
        <View style={styles.headerModal}>
          <Text style={[Style.font_14, Style.semi_bold, Style.my_3, { color: Colors.biruJaja, flex: 1 }]}>Tipe Berat</Text>
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
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            scrollEnabled={true}>
            <FlatList
              showsVerticalScrollIndicator={false}
              nestedScrollEnable={true}
              data={beratData}
              renderItem={renderWeightType}
              keyExtractor={(item, index) => String(index + 'JA')}
            />

          </ScrollView>
        </View>
      </ActionSheets>


      <ActionSheets containerStyle={styles.actionSheet}

        ref={preorderRef}>
        <View style={styles.headerModal}>
          <Text style={[Style.font_14, Style.semi_bold, Style.my_3, { color: Colors.biruJaja, flex: 1 }]}>Masa Pengemasan</Text>
          <TouchableOpacity onPress={() => preorderRef.current?.setModalVisible(false)}>
            <Image
              style={styles.iconClose}
              source={require('../../../icon/close.png')}
            />
          </TouchableOpacity>
        </View>

        <View style={{ height: 200, paddingHorizontal: Wp('2%') }}>
          <ScrollView style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            scrollEnabled={true}>
            <FlatList
              showsVerticalScrollIndicator={false}
              nestedScrollEnable={true}
              data={preorderData}
              renderItem={renderPreorder}
              keyExtractor={(item, index) => String(index + 'GF')}
            />

          </ScrollView>
        </View>
      </ActionSheets>

      <ActionSheets scrollEnabled={true} containerStyle={Style.p_3}
        ref={etalaseRef}>
        <View style={[Style.column, { minHeight: Hp('66%'), maxHeight: Hp('55%') }]}>
          <View style={[Style.row_0_center]}>
            <Text style={[Style.font_14, Style.semi_bold, Style.my_3, { color: Colors.biruJaja, flex: 1 }]}>Etalase Toko</Text>
            <TouchableOpacity
              onPress={() => etalaseRef.current?.setModalVisible(false)}
            >
              <Image
                style={styles.iconClose}
                source={require('../../../icon/close.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={{ height: '100%', paddingHorizontal: '1%' }}>
            <ScrollView style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              scrollEnabled={true}>
              <FlatList
                showsVerticalScrollIndicator={false}
                nestedScrollEnable={true}
                data={listEtalase}
                renderItem={renderEtalase}
                keyExtractor={(item, index) => index + 'AN'}
              />
            </ScrollView>
          </View>
        </View>
      </ActionSheets>
      <Modal transparent={true} visible={etalaseModal} animationType='fade'>
        <View style={{ width: Wp('100%'), height: Hp('100%'), zIndex: 999, justifyContent: 'center', alignItems: 'center' }}>

          <View style={[Style.column, { width: Wp('90%'), height: Hp('22%'), backgroundColor: Colors.white, elevation: 11, }]}>
            <View style={[Style.column_0_start, Style.p_4, { flex: 1 }]}>
              <Text style={[Style.font_14, Style.semi_bold, Style.mb_5, { color: Colors.biruJaja }]}>Tambah Etalase</Text>

              <Text style={[Style.font_13]}>Masukkan nama etalase</Text>
              <TextInput
                // value={etalaseSelected}
                onChangeText={text => setetalaseNew(text)}
                style={[Style.font_13, Style.pt, Style.pl, { borderBottomWidth: 0.5, borderBottomColor: Colors.silver, width: '100%', paddingBottom: 0 }]}
              />
            </View>
            <View style={[Style.row_0_end, Style.p_2, { alignItems: 'flex-end', width: '100%', }]}>
              <Button onPress={() => setEtalaseModal(false)} mode="text" labelStyle={[Style.font_13, Style.semi_bold]} style={{ height: '100%', width: '30%' }} color={Colors.kuningJaja}>
                Batal
              </Button>
              <Button onPress={handleNewEtalase} mode="text" labelStyle={[Style.font_13, Style.semi_bold]} style={{ height: '100%', width: '30%', marginLeft: '2%' }} color={Colors.biruJaja}>
                Simpan
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <ModalAlert
        visible={modalsave}
        title="Produk anda akan disimpan"
        subTitle="Pilih opsi berikut"
        close='Tutup'
        next='Live'
        nextTwo='Arsipkan'
        height={Wp('45%')}
        handleVisible={(show, val) => {
          setmodalSave(show)
          handleSimpan(val)
        }}
      />
    </SafeAreaView >
  )
}

export const styles = StyleSheet.create({
  produkImage: { width: Wp('23%'), height: Hp('11%'), padding: 2, marginRight: 11, marginBottom: 11, borderRadius: 10 },
  red: { color: 'red', fontFamily: 'Poppins-Regular', fontSize: 14 },
  inputbox: { fontSize: 13, borderBottomColor: Colors.blackGrey, borderBottomWidth: 0.2, fontFamily: 'Poppins-Regular' },
  smallTextCenter: { fontSize: 11, color: Colors.blackGrey, marginBottom: '0%', borderTopColor: Colors.blackGrey, borderTopWidth: 0.5, fontFamily: 'Poppins-Regular' },
  smallTextDeskripsi: { fontSize: 11, color: Colors.blackGrey, marginBottom: Hp('0%'), fontFamily: 'Poppins-Regular' },
  // rowWrap: {flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" },
  boxImage: { flex: 0, width: Wp('23%'), height: Hp('11%'), padding: 2, marginRight: 11, marginBottom: 11, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  image: { flex: 0, width: Wp('23%'), height: Hp('11%'), padding: 2, marginRight: Wp('5%'), borderRadius: 10, borderWidth: 0.2, borderColor: Colors.blackGrey },
  iconDelete: { position: 'absolute', right: -5, top: 0, marginRight: 0, width: 21, height: 21, backgroundColor: '#CC0000', borderRadius: 100 },
  iconDeleteImage: { alignSelf: "center", width: 8, height: 8, resizeMode: 'contain', flex: 1, borderRadius: 25, tintColor: Colors.white },
  iconBoxImage: { width: undefined, height: undefined, resizeMode: 'contain', flex: 1, tintColor: Colors.blackgrayScale },
  texBoxImage: { color: Colors.blackgrayScale, fontSize: 11, fontFamily: "Poppins-Light", position: 'absolute', bottom: 10, alignSelf: 'center', },
  imageView: { flex: 1, width: Wp('23%'), height: Hp('25%'), borderRadius: 10, borderColor: Colors.blackGrey, borderWidth: 0.7, borderRadius: 7, padding: 4, },
  deskripsiRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderTopColor: Colors.blackGrey, borderTopWidth: 0.5 },
  deskripsiSmallTExt: { fontSize: 11, color: Colors.blackGrey, fontFamily: 'Poppins-Regular' },

  actionSheet: { paddingHorizontal: Wp('2%') },
  headerModal: { flex: 1, flexDirection: 'row', alignContent: 'space-between', alignItems: 'center', paddingHorizontal: Wp('2%') },
  iconClose: { width: 14, height: 14, tintColor: Colors.blackGrey, },
  touchKategori: { borderBottomColor: Colors.blackgrayScale, borderBottomWidth: 0.2, paddingVertical: '3%', fontFamily: 'Poppins-Regular' },
  textKategori: { fontSize: 13, fontFamily: 'Poppins-Medium', color: Colors.blackgrayScale },

  lineVariasi: { flex: 0, flexDirection: 'row', borderBottomColor: Colors.blackgrayScale, borderBottomWidth: 0.2, paddingVertical: Hp('2%'), alignSelf: 'center', justifyContent: 'center' },
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