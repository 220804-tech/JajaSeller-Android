import React, { useState, useEffect, useCallback, createRef } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage'
import { View, Text, SafeAreaView, ScrollView, BackHandler, LogBox, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, Modal, Alert, ToastAndroid } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { RadioButton, IconButton, Button } from 'react-native-paper';
import NewBrand from '../brand/addBrand';
import ImagePicker from 'react-native-image-crop-picker';
import Collapsible from 'react-native-collapsible';

import { Appbar, Style, ServiceProduct, Colors, Wp, Hp, useNavigation, Utils, } from '../../../export'
import ActionSheet from 'react-native-actionsheet';
import ActionSheets from 'react-native-actions-sheet';

import Variasi from './variasi'

export default function ProdukBaru() {
  const navigation = useNavigation()
  const reduxStore = useSelector(state => state.user.seller)

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
    text: 'Masukkan kategori sesuai produk yang kamu jual!'
  })
  const [sktColor, setsktColor] = useState('Tidak Ada')
  const [showSubCategorys, setshowSubCategorys] = useState(false)
  const [subkategoriName, setsubkategoriName] = useState('Kategori')
  const [subkategoriValue, setsubkategoriValue] = useState('')


  const [subCategorys, setsubCategorys] = useState([])
  const [categorys, setcategorys] = useState([])
  const [brands, setbrands] = useState([])
  const [photos, setphotos] = useState([])


  const [namaprodukValue, setnamaprodukValue] = useState('')
  const [namaprodukFrom, setnamaprodukFrom] = useState({
    style: styles.smallTextCenter,
    text: 'Tips: Nama Produk + Tipe Produk + Keterangan Singkat'
  })

  const [hargaValue, sethargaValue] = useState(0)
  const [textInputCurrency, settextInputCurrency] = useState(false)
  const [autoFocus, setAutoFocus] = useState(false)
  const [hargaForm, sethargaForm] = useState({
    style: styles.smallTextCenter,
    text: 'Tentukan berapa hari harga sesuai pasaran produkmu'
  })

  const [kodeProdukValue, setKodeProdukValue] = useState('')
  const [skuForm, setskuForm] = useState({
    style: styles.smallTextCenter,
    text: 'Input kode sku produk kamu'
  })

  const [deskripsiValue, setDeskripsiValue] = useState('')
  const [deskripsiPlaceholder, setDeskripsiPlaceholder] = useState('')
  const [lenghtDeskripsi, setLenghtDeskripsi] = useState(0)
  const [deskripsiForm, setdeskripsiForm] = useState({
    style: styles.smallTextDeskripsi,
    text: 'Masukkan deskripsi sesuai produk yang kamu jual'
  })

  const [stockValue, setStockValue] = useState(1)


  const [brandValue, setbrandValue] = useState('')
  const [brandName, setbrandName] = useState('')
  const [brColor, setbrColor] = useState('#C0C0C0')
  const [titleHeader, setTitleHeader] = useState("")

  const [etalaseModal, setEtalaseModal] = useState(false)
  const [etalaseSelected, setetalaseSelected] = useState('Tidak ada')
  const [listEtalase, setlistEtalase] = useState([])


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

  const [informasiProdukShow, setinformasiProdukShow] = useState(false)
  const [variasiValue, setvariasiValue] = useState([])


  const imageRef = createRef()
  const kategoriRef = createRef();
  const subKategoriRef = createRef();
  const brandRef = createRef();
  const weightRef = createRef();
  const variasiRef = createRef();
  const preorderRef = createRef();
  const etalaseRef = createRef();


  useEffect(() => {
    getItem()
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    // setTimeout(() => {
    //   setOpen(2)
    // }, 3000);
    LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified.']);
    return () => backHandler.remove();
  }, [])

  const getItem = () => {
    ServiceProduct.getCategorys().then(res => {
      setcategorys(res.kategori)
    })
    ServiceProduct.getBrands().then(res => {
      setbrands(res.brand)
      setbrandValue(res.brand[0]?.id_data)
      setbrandName(res.brand[0].merek)
      setbrColor(Colors.blackgrayScale)
    })
  }
  const backAction = () => {
    navigation.navigate('Produk')
    return true;
  };

  const showActionSheet = (val) => {
    imageRef.current.show(

    )
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
      if (listEtalase.length) {
        etalaseRef.current?.setModalVisible(true)
      } else {
        setEtalaseModal(true)
      }
    } else {
      console.log("index -> text", text)
    }
  }


  const onChangeText = (val, name) => {
    if (name === "namaProduk") {
      let newObj = namaprodukFrom
      newObj.text = "Tips: Jenis Produk + Merek Produk + Keterangan Singkat"
      newObj.style = styles.smallTextCenter;
      let res = regexChar(val, "namaProduk")
      setnamaprodukFrom(newObj)
      setnamaprodukValue(res)

    } else if (name === "harga") {
      let newObj = hargaForm
      newObj.text = "Tentukan harga sesuai pasaran produkmu"
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
      newObj.text = "Input kode sku produk kamu"
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
      setBeratValue(regexChar(val, "number"))
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

  const handleAnimation = (valChange, valState, valDuration) => {

  }

  const handleNext = (text) => {
    if (text === "informasi") {
      let result = validationState()
      if (result === true) {
        if (informasiProdukShow === true) {
          setOpen1(true)
          setOpen(2)
        } else {
          setOpen(1)
        }
      }

    } else if (text === "deskripsi") {
      if (deskripVsialue === "") {
        let newObj = deskripsiForm
        newObj.text = "Deskripsi tidak boleh kosong"
        newObj.style = Style.smallTextAlertError
        setdeskripsiForm(newObj)

      } else if (deskripsiValue.length < 50) {
        let newObj = deskripsiForm
        newObj.text = "Deskripsi terlalu pendek, minimal 50 karakter"
        newObj.style = Style.smallTextAlertError
        setdeskripsiForm(newObj)

      } else {
        setOpen(4)
        setOpen3(true)
        setOpen4(true)

      }
    }
  }

  const validationState = () => {
    if (!kategoriValue) {
      let newObj = kategoriForm
      newObj.text = "Kategori tidak boleh kosong!"
      newObj.style = Style.smallTextAlertError
      setkategoriForm(newObj)
      setUpdate(update + 1)
      ToastAndroid.show("Kategori tidak boleh kosong!", ToastAndroid.SHORT, ToastAndroid.CENTER)
      return false

    } else if (showSubCategorys && !subkategoriValue) {
      let newObj = kategoriForm
      newObj.text = "Sub Kategori tidak boleh kosong!"
      newObj.style = Style.smallTextAlertError
      setkategoriForm(newObj)
      setUpdate(update + 1)
      ToastAndroid.show("Sub Kategori tidak boleh kosong!", ToastAndroid.SHORT, ToastAndroid.CENTER)
      return false

    } else if (!namaprodukValue) {
      let newObj = namaprodukFrom
      newObj.text = "Nama produk tidak boleh kosong"
      newObj.style = Style.smallTextAlertError
      setnamaprodukFrom(newObj)
      setUpdate(update + 1)
      ToastAndroid.show("Nama produk tidak boleh kosong!", ToastAndroid.SHORT, ToastAndroid.CENTER)
      return false

    } else if (!hargaValue) {
      let newObj = hargaForm
      newObj.text = "Harga produk tidak boleh kosong"
      newObj.style = Style.smallTextAlertError
      sethargaForm(newObj)
      setUpdate(update + 1)
      ToastAndroid.show("Harga produk tidak boleh kosong!", ToastAndroid.SHORT, ToastAndroid.CENTER)
      return false

    } else if (!kodeProdukValue) {
      let newObj = skuForm
      newObj.text = "Kode produk tidak boleh kosong!"
      newObj.style = Style.smallTextAlertError
      setskuForm(newObj)
      setUpdate(update + 1)
      ToastAndroid.show("Kode produk tidak boleh kosong!", ToastAndroid.SHORT, ToastAndroid.CENTER)
      return false

    } else if (!brandValue) {
      setUpdate(update + 1)
      ToastAndroid.show("Merek produk tidak boleh kosong!", ToastAndroid.SHORT, ToastAndroid.CENTER)
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
      newObj.text = "Masukkan kategori sesuai produk yang kamu jual"
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
      newObj.text = "Masukkan kategori sesuai produk yang kamu jual"
      newObj.style = styles.smallTextCenter
      setkategoriForm(newObj)
    } else if (text === "brand") {
      setbrandValue(val?.id_data)
      setbrandName(val.merek)
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
        <Text style={styles.textKategori}>{item.merek}</Text>
      </TouchableOpacity >
    )
  }

  const renderEtalase = ({ item }) => {
    console.log("🚀 ~ file: index.js ~ line 511 ~ renderEtalase ~ item", item)
    return (
      <TouchableOpacity onPress={() => setetalaseSelected(item)} style={styles.touchKategori}>
        <Text style={styles.textKategori}>{item}</Text>
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

  const renderVariasi = ({ item, index }) => {
    console.log("renderVariasi -> index", index)
    console.log("renderVariasi -> item", item)

    return (
      <TouchableOpacity onPress={() => handleValueDropdown("variasi", item)} style={styles.lineVariasi}>
        <Text style={styles.textlineVariasi} numberOfLines={1}>{item.pilihan}</Text>
        <Text style={styles.textlineVariasi} numberOfLines={1}>{item.nama}</Text>
        <Text style={styles.textlineVariasi} numberOfLines={1}>{item.harga}</Text>
        <Text style={styles.textlineVariasi} numberOfLines={1}>{item.stok}</Text>
        <Text style={styles.textlineVariasi} numberOfLines={1}>{item.kode_sku}</Text>
        <TouchableOpacity onPress={() => handleDeleteVariasi(index)}>
          <Text style={[styles.textlineVariasi, { color: 'red', fontSize: 13 }]}>Hapus</Text>
        </TouchableOpacity>

      </TouchableOpacity>
    )
  }



  const handleDeleteVariasi = (index) => {
    // let newArray = variasiValue.slice(variasiValue.splice(index, 1))
    // setTimeout(() => this.setState({ variasiValue: newArray }), 100)
  }
  return (
    <SafeAreaView style={[Style.container, { backgroundColor: Colors.white }]}>
      <Appbar back={true} title="Tambah Produk" />
      <ScrollView>
        <View style={[Style.column, Style.p_3]}>
          <Text style={[Style.font_14, Style.semi_bold, { color: Colors.biruJaja }]}>Foto Produk <Text style={[Style.font_14, { color: Colors.redNotif }]}> *</Text></Text>
          <ScrollView horizontal={true} contentContainerStyle={styles.rowWrap} showsHorizontalScrollIndicator={false} >
            {images.path ?
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

            {imagesDepan.path ?
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
                <View style={styles.imageView}>
                  <Image source={require('../../../icon/add_image.png')} style={styles.iconBoxImage} />
                  <Text style={styles.texBoxImage}>depan</Text>
                </View>
              </TouchableOpacity>
            }

            {imagesAtas.path ?
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
                <View style={styles.imageView}>
                  <Image
                    source={require('../../../icon/add_image.png')}
                    style={styles.iconBoxImage}
                  />
                  <Text style={styles.texBoxImage}>atas</Text>
                </View>
              </TouchableOpacity>

            }


            {imagesBelakang.path ?
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
                <View style={styles.imageView}>
                  <Image
                    source={require('../../../icon/add_image.png')}
                    style={styles.iconBoxImage}
                  />
                  <Text style={styles.texBoxImage}>belakang</Text>
                </View>
              </TouchableOpacity>
            }
            {imagesSamping.path ?
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
                <View style={styles.imageView}>
                  <Image
                    source={require('../../../icon/add_image.png')}
                    style={styles.iconBoxImage}
                  />
                  <Text style={styles.texBoxImage}>samping</Text>
                </View>
              </TouchableOpacity>
            }
            {/* {video.path ?
                      <View style={styles.produkImage}>
                        <Video source={{ uri: video.path }}   // Can be a URL or a local file.
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
                        onPress={() => showActionSheet('video')}>
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

          <View style={[Style.column, Style.mt_5]}>
            <View style={Style.row_space}>
              <Text style={[Style.font_14, Style.semi_bold, { color: Colors.biruJaja }]}>Informasi Produk <Text style={[Style.font_14, { color: Colors.redNotif }]}> *</Text></Text>
              <Text style={[Style.font_13, Style.medium, { color: Colors.biruJaja }]}>Ubah</Text>
            </View>
            <Collapsible collapsed={open === 1 ? false : true}>
              <View style={styles.ukuranItem}>
                <Text style={[Style.font_13, Style.medium, Style.mt, { marginBottom: '-1%', flex: 1 }]}>Kategori<Text style={[Style.font_14, { color: Colors.redNotif }]}> *</Text></Text>
                {showSubCategorys ?
                  <Text style={[Style.font_13, Style.medium, Style.mt, { marginBottom: '-1%', flex: 1 }]}>
                    Sub Kategori<Text style={styles.red}> *</Text>
                  </Text>
                  :
                  <Text style={[Style.font_13, Style.medium, Style.mt, { marginBottom: '-1%', flex: 1 }]}>
                    <Text></Text>
                  </Text>
                }
              </View>
              <View style={styles.ukuranItem}>
                <View style={styles.viewText}>
                  <Text style={[styles.textInput, { color: ktColor }]}>{kategoriName}</Text>
                  <IconButton
                    style={{ margin: 0 }}
                    icon={require('../../../icon/down-arrow.png')}
                    color={Colors.biruJaja}
                    size={25}
                    onPress={() => handleActionSheet("kategori")} />
                </View>
                {showSubCategorys ?
                  <View style={styles.viewText}>
                    <Text style={[styles.textInput, { color: sktColor }]}>{subkategoriName}</Text>
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
              <Text style={[Style.font_13, Style.medium, Style.mt, { marginBottom: '-1%', flex: 1 }]}>
                Nama<Text style={styles.red}> *</Text>
              </Text>
              <TextInput
                style={[Style.font_13, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver }]}
                placeholder="Notebook Asus A409UJ-BV351T"
                value={namaprodukValue}
                onChangeText={(text) => onChangeText(text, "namaProduk")}
              />
              <Text style={namaprodukFrom.style}>
                {namaprodukFrom.text}
              </Text>
              <View style={styles.ukuranItem}>
                <Text style={[Style.font_13, Style.medium, Style.mt, { marginBottom: '0%', flex: 1 }]}>
                  Harga<Text style={styles.red}> *</Text>
                </Text>
                <Text style={[Style.font_13, Style.medium, Style.mt, { marginBottom: '0%', flex: 1 }]}>
                  Stok Tersedia<Text style={styles.red}> *</Text>
                </Text>
              </View>
              <View style={styles.ukuranItem}>
                <View style={styles.radioItem}>
                  <Text style={{ flex: 0, alignSelf: 'center', marginRight: '3%' }}> Rp</Text>
                  <TextInput
                    style={{ flex: 1, padding: '0%' }}
                    maxLength={11}

                    keyboardType="number-pad"
                    placeholder="10000"
                    value={String(hargaValue)}
                    onChangeText={(text) => onChangeText(text, "harga")}
                  />

                </View>
                <View style={styles.radioItem}>
                  <TextInput
                    style={{ flex: 1, padding: '0%' }}
                    maxLength={5}
                    keyboardType="numeric"
                    placeholder="1"
                    value={String(stockValue)}
                    onChangeText={(text) => onChangeText(text, "stock")} />
                </View>
              </View>
              <Text style={hargaForm.style}>
                {hargaForm.text}
              </Text>
              <View style={[styles.ukuranItem, { flex: 0 }]}>
                <Text style={[Style.font_13, Style.medium, Style.mt, { marginBottom: '-1%', flex: 1 }]}>
                  Merek<Text style={styles.red}> *</Text>
                </Text>
              </View>
              <View style={styles.ukuranItem}>
                <View style={styles.viewText}>
                  <Text style={[styles.textInput, { color: brColor }]}>{brandName}</Text>
                  <IconButton
                    style={{ margin: 0 }}
                    icon={require('../../../icon/down-arrow.png')}
                    color={Colors.biruJaja}
                    size={25}
                    onPress={() => handleActionSheet("brand")} />
                </View>
              </View>
              <Text style={[styles.smallTextCenter, { marginBottom: '1%' }]}>
                Input brand pada produk anda
              </Text>
              <TouchableOpacity style={{ marginBottom: '2%' }} onPress={() => {
                titleHeader === "Tambah Produk" ? setTitleHeader('Usulkan Brand') : setTitleHeader('Tambah Produk')
              }}>
                <Text style={[Style.font_12, Style.italic, { color: Colors.biruJaja }]}>Usulkan Brand</Text>
              </TouchableOpacity>
              <View style={[styles.ukuranItem, { flex: 0 }]}>
                <Text style={[Style.font_13, Style.medium, Style.mt, { marginBottom: '-1%', flex: 1 }]}>
                  Kategori<Text style={styles.red}> *</Text>
                </Text>
              </View>
              <View style={styles.ukuranItem}>
                <View style={styles.viewText}>
                  <Text style={[styles.textInput, { color: brColor }]}>{etalaseSelected}</Text>
                  <IconButton
                    style={{ margin: 0 }}
                    icon={require('../../../icon/down-arrow.png')}
                    color={Colors.biruJaja}
                    size={25}
                    onPress={() => handleActionSheet("etalase")} />
                </View>
              </View>
              <Text style={[styles.smallTextCenter, { marginBottom: '1%' }]}>
                Input kategori
              </Text>
              <TouchableOpacity style={{ marginBottom: '2%' }} onPress={() => setEtalaseModal(true)} >
                <Text style={[Style.font_12, Style.italic, { color: Colors.biruJaja }]}>Tambah Kategori</Text>
              </TouchableOpacity>
              <Text style={[Style.font_13, Style.medium, Style.mt, { marginBottom: '0%', flex: 1 }]}>
                Kondisi<Text style={styles.red}> *</Text>
              </Text>
              <View style={[styles.flex0Row, { marginBottom: '1.5%' }]}>
                <View style={[styles.radioItem, { marginTop: '1%' }]}>
                  <RadioButton
                    color={Colors.biruJaja}
                    value="first"
                    status={checkedKondisi === 'first' ? 'checked' : 'unchecked'}
                    onPress={() => setcheckedKondisi('first')}
                  />
                  <Text style={[Style.font_13]}>Baru</Text>
                </View>
                <View style={[styles.radioItem, { marginTop: '1%' }]}>
                  <RadioButton
                    color={Colors.biruJaja}
                    value="second"
                    status={checkedKondisi === 'second' ? 'checked' : 'unchecked'}
                    onPress={() => setcheckedKondisi('second')}
                  />
                  <Text style={[Style.font_13]}>Bekas</Text>
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
                    status={checkedAsalproduk === 'first' ? 'checked' : 'unchecked'}
                    onPress={() => setcheckedAsalproduk('first')}
                  />
                  <Text style={[Style.font_13]}>Dalam Negri</Text>
                </View>
                <View style={[styles.radioItem, { marginTop: '1%' }]}>
                  <RadioButton
                    color={Colors.biruJaja}
                    value="second"
                    status={checkedAsalproduk === 'second' ? 'checked' : 'unchecked'}
                    onPress={() => setcheckedAsalproduk('second')}
                  />
                  <Text style={[Style.font_13]}>Luar Negri</Text>
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
                    status={checkedPreorder === 'first' ? 'checked' : 'unchecked'}
                    onPress={() => setcheckedPreorder('first')}
                  />
                  <Text style={[Style.font_13]}>Tidak</Text>
                </View>
                <View style={[styles.radioItem, { marginTop: '1%' }]}>
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
                  <View style={styles.ukuranItem}>
                    <Text style={[Style.font_13, Style.medium, Style.mt, { marginBottom: '-1%', flex: 1 }]}>
                      Masa Pengemasan<Text style={styles.red}> *</Text>
                    </Text>
                  </View>
                  <View style={styles.ukuranItem}>
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
                    Tentukan berapa hari masa pengemasan produk kamu
                  </Text>
                </>
              }
              <Text style={styles.label}>
                SKU (Stock Keeping Unit)<Text style={styles.red}> *</Text>
              </Text>
              <TextInput
                style={[Style.font_13, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver }]}
                placeholder="Kode produk"
                value={kodeProdukValue}
                onChangeText={(text) => onChangeText(text, "sku")}
              />
              <Text style={skuForm.style}>{skuForm.text}</Text>

              <View style={styles.rowSpace}>
                <Text style={styles.title}>
                </Text>
                {/* <TouchableHighlight
                        onPress={() => handleNext("informasi")}>
                        <Text style={styles.titlebtn}>
                          Lanjutkan
                      </Text>
                      </TouchableHighlight> */}
                <Button color={Colors.biruJaja} labelStyle={[Style.font_13, Style.semi_bold, { color: Colors.white }]} mode="contained" onPress={() => handleNext("informasi")}>
                  Lanjutkan
                </Button>
              </View>
            </Collapsible>


          </View>

          <View style={[Style.column, Style.mt_5]}>
            <Text style={[Style.font_14, Style.semi_bold, { color: Colors.biruJaja }]}>Deskripsi Produk <Text style={[Style.font_14, { color: Colors.redNotif }]}> *</Text></Text>
            <Collapsible collapsed={open === 2 ? false : true}>
              <Text>
                Id laborum anim in ut deserunt amet ad fugiat ipsum duis sit quis nostrud.
              </Text>
            </Collapsible>


          </View>

          <View style={[Style.column, Style.mt_5]}>
            <Text style={[Style.font_14, Style.semi_bold, { color: Colors.biruJaja }]}>Variasi Produk <Text style={[Style.font_14, { color: Colors.redNotif }]}> *</Text></Text>
            <Collapsible collapsed={open === 3 ? false : true}>
              <Text>
                Id laborum anim in ut deserunt amet ad fugiat ipsum duis sit quis nostrud.
              </Text>
            </Collapsible>


          </View>

          <View style={[Style.column, Style.mt_5]}>
            <Text style={[Style.font_14, Style.semi_bold, { color: Colors.biruJaja }]}>Detail Produk <Text style={[Style.font_14, { color: Colors.redNotif }]}> *</Text></Text>
            <Collapsible collapsed={open === 4 ? false : true}>
              <Text>
                Id laborum anim in ut deserunt amet ad fugiat ipsum duis sit quis nostrud.
              </Text>
            </Collapsible>


          </View>

        </View>
      </ScrollView>
      <Text></Text>
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
        extraScroll={100}
        containerStyle={styles.actionSheet}
        ref={kategoriRef}>
        <View style={styles.headerModal}>
          <Text style={[Style.font_14, Style.semi_bold, Style.my_3, { color: Colors.biruJaja, flex: 1 }]}>Kategori Produk</Text>
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
              data={categorys}
              renderItem={renderCategorys}
              keyExtractor={item => item.id_kategori}
            />

          </ScrollView>
        </View>
      </ActionSheets>
      <ActionSheets scrollEnabled={true} extraScroll={100} containerStyle={styles.actionSheet}
        ref={subKategoriRef}>
        <View style={styles.headerModal}>
          <Text style={[Style.font_14, Style.semi_bold, Style.my_3, { color: Colors.biruJaja, flex: 1 }]}>Sub Kategori</Text>
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
              data={subCategorys}
              renderItem={renderSubCategorys}
              keyExtractor={item => item.id_sub_kategori}
            />

          </ScrollView>
        </View>
      </ActionSheets>
      <ActionSheets scrollEnabled={true} extraScroll={100} containerStyle={styles.actionSheet}
        ref={brandRef}>
        <View style={styles.headerModal}>
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
        <View style={{ height: 200, paddingHorizontal: Wp('2%') }}>
          <ScrollView style={{ flex: 1 }}
            nestedScrollEnabled={true}
            scrollEnabled={true}>
            <FlatList
              nestedScrollEnable={true}
              data={brands}
              renderItem={renderBrand}
              keyExtractor={item => item?.id_data}
            />

          </ScrollView>
        </View>
      </ActionSheets>
      <ActionSheets scrollEnabled={true} extraScroll={100} containerStyle={styles.actionSheet}
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
            nestedScrollEnabled={true}
            scrollEnabled={true}>
            <FlatList
              nestedScrollEnable={true}
              data={beratData}
              renderItem={renderWeightType}
              keyExtractor={item => item.value}
            />

          </ScrollView>
        </View>
      </ActionSheets>
      <ActionSheets scrollEnabled={true} extraScroll={100} containerStyle={styles.actionSheet}
        ref={variasiRef}>
        <View style={styles.headerModal}>
          <Text style={[Style.font_14, Style.semi_bold, Style.my_3, { color: Colors.biruJaja, flex: 1 }]}>Daftar Variasi</Text>
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
              data={variasiValue}
              renderItem={renderVariasi}
              keyExtractor={(item, index) => index + ""}
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
            nestedScrollEnabled={true}
            scrollEnabled={true}>
            <FlatList
              nestedScrollEnable={true}
              data={preorderData}
              renderItem={renderPreorder}
              keyExtractor={item => item?.id_data}
            />

          </ScrollView>
        </View>
      </ActionSheets>

      <ActionSheets containerStyle={styles.actionSheet}
        ref={etalaseRef}>
        <View style={styles.headerModal}>
          <Text style={[Style.font_14, Style.semi_bold, Style.my_3, { color: Colors.biruJaja, flex: 1 }]}>Pilih Etalase</Text>
          <TouchableOpacity onPress={() => etalaseRef.current?.setModalVisible(false)}>
            <Image
              style={styles.iconClose}
              source={require('../../../icon/close.png')}
            />
          </TouchableOpacity>
        </View>

        <View style={{ height: 200, paddingHorizontal: Wp('2%') }}>
          <ScrollView style={{ flex: 1, backgroundColor: 'grey' }}
            nestedScrollEnabled={true}
            scrollEnabled={true}>
            <FlatList
              nestedScrollEnable={true}
              data={listEtalase}
              renderItem={renderEtalase}
              keyExtractor={(item, index) => String(index) + 'K9'}
            />

          </ScrollView>
        </View>
      </ActionSheets>
      <Modal transparent={true} visible={etalaseModal} animationType='fade'>
        <View style={{ width: Wp('100%'), height: Hp('100%'), zIndex: 999, justifyContent: 'center', alignItems: 'center' }}>

          <View style={[Style.column, { width: Wp('90%'), height: Hp('22%'), backgroundColor: Colors.white, elevation: 11, }]}>
            <View style={[Style.column_0_start, Style.p_4, { flex: 1 }]}>
              <Text style={[Style.font_14, Style.semi_bold, Style.mb_5, { color: Colors.biruJaja }]}>Tambah Kategori</Text>

              <Text style={[Style.font_13]}>Masukkan nama kategori</Text>
              <TextInput
                // value={etalaseSelected}
                onChangeText={text => setetalaseSelected(text)}
                style={[Style.font_13, Style.pt, Style.pl, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver, width: '100%', paddingBottom: 0 }]}
              />
            </View>
            <View style={[Style.row_0_end, Style.p_2, { alignItems: 'flex-end', width: '100%', }]}>
              <Button onPress={() => setEtalaseModal(false)} mode="text" labelStyle={[Style.font_13, Style.semi_bold]} style={{ height: '100%', width: '30%' }} color={Colors.kuningJaja}>
                Batal
              </Button>
              <Button onPress={() => {
                setlistEtalase(listEtalase.push(etalaseSelected))
                setEtalaseModal(false)
                setUpdate(update + 1)
              }} mode="text" labelStyle={[Style.font_13, Style.semi_bold]} style={{ height: '100%', width: '30%', marginLeft: '2%' }} color={Colors.biruJaja}>
                Simpan
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView >
  )
}
export const styles = StyleSheet.create({
  card: { flex: 1, flexDirection: 'column', elevation: 2, backgroundColor: 'white', paddingHorizontal: Wp('4%'), paddingVertical: Hp('2%'), marginBottom: Hp('1%') },
  cardbutton: { flex: 1, flexDirection: 'row', paddingHorizontal: Wp('2%'), position: 'relative', left: 0, right: 0, bottom: 0 },
  buttonsubmit: { flex: 1, borderRadius: 5, backgroundColor: Colors.biruJaja, justifyContent: 'center', alignItems: 'center', marginVertical: Hp('1%'), marginHorizontal: Hp('0.5%') },
  buttonText: { fontSize: 11, },
  title: { fontFamily: 'Poppins-SemiBold', fontSize: 14, alignSelf: 'center', color: Colors.blackgrayScale },
  titlebtn: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: Colors.biruJaja },
  simpanbtn: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: Colors.biruJaja, marginTop: Hp('2%') },
  produkImage: { width: Wp('23%'), height: Hp('11%'), padding: 2, marginRight: 11, borderRadius: 10 },
  red: { color: 'red', fontFamily: 'Poppins-Regular', fontSize: 14 },
  label: { fontSize: 14, fontFamily: 'Poppins-SemiBold', marginTop: '2%', color: Colors.blackLight },
  labelRight: { fontSize: 12, fontFamily: 'Poppins-SemiBold', marginTop: Hp('2%'), color: Colors.blackLight },
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
  // rowWrap: {flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" },
  boxImage: { flex: 0, width: Wp('23%'), height: Hp('11%'), padding: 2, marginRight: 11, borderRadius: 10 },
  image: { flex: 0, width: Wp('23%'), height: Hp('11%'), padding: 2, marginRight: Wp('5%'), borderRadius: 10, borderWidth: 0.2, borderColor: Colors.blackGrey },
  iconDelete: { position: 'absolute', right: -5, top: 0, marginRight: 0, width: 21, height: 21, backgroundColor: '#CC0000', borderRadius: 100 },
  iconDeleteImage: { alignSelf: "center", width: 8, height: 8, resizeMode: 'contain', flex: 1, borderRadius: 25, tintColor: Colors.white },
  iconBoxImage: { width: undefined, height: undefined, resizeMode: 'contain', flex: 1, tintColor: Colors.blackgrayScale },
  texBoxImage: { color: Colors.blackgrayScale, fontSize: 11, fontFamily: "Poppins-Light", position: 'absolute', bottom: 10, alignSelf: 'center', },
  imageView: { flex: 1, width: Wp('23%'), height: Hp('25%'), borderRadius: 10, borderColor: Colors.blackGrey, borderWidth: 0.7, borderRadius: 7, padding: 4 },
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
  iconClose: { width: 14, height: 14, tintColor: Colors.blackGrey, },
  touchKategori: { borderBottomColor: Colors.blackgrayScale, borderBottomWidth: 0.5, paddingVertical: '3%', fontFamily: 'Poppins-Regular' },
  textKategori: { fontSize: 13, fontFamily: 'Poppins-Medium', color: Colors.blackgrayScale },

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