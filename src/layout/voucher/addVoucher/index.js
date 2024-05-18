import React, { useState, useEffect, createRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ToastAndroid, TouchableNativeFeedback, FlatList, Image, TextInput, StatusBar, BackHandler, ImageBackground } from 'react-native';
import * as Service from '../../../service/Produk'
import * as VoucherService from '../../../service/Voucher'
import ActionSheets from "react-native-actionsheet";
import { Button, Appbar, RadioButton, IconButton } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ActionSheetKategori from 'react-native-actions-sheet';
import ActionSheetSubKategori from 'react-native-actions-sheet';
import Warna from '../../../config/Warna';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-crop-picker';
import style from '../../../styles/style';
import AsyncStorage from '@react-native-community/async-storage';
import Loading from '../../../component/loading'
import { Colors, Style, Utils, Wp } from '../../../export';
import { useSelector } from 'react-redux';
// import { color } from 'react-native-reanimated';

export default function AddVoucher({ route }) {
  const navigation = useNavigation();
  const actionSheetRef = createRef();
  const kategoriRef = createRef();
  const subKategoriRef = createRef();
  const reduxseller = useSelector(state => state.user.seller)
  console.log("🚀 ~ file: index.js ~ line 25 ~ index ~ reduxseller", reduxseller.foto)

  const [voucher, setvoucher] = useState("");
  const [idvoucher, setidvoucher] = useState('');
  const [namavoucher, setnamavoucher] = useState('');
  const [kuotaVoucher, setkuotaVoucher] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [idsubKategori, setidsubKategori] = useState("")
  const [idKategori, setidKategori] = useState("")
  const [gambarvoucher, setgambarvoucher] = useState({});
  const [banner, setbanner] = useState(false);
  const [showImage, setshowImage] = useState(false);
  const [kategoriTitle, setkategoriTitle] = useState('Diskon Nominal');
  const [diskon, setDiskon] = useState(null);
  const [lengtDiskon, setlengtDiskon] = useState(8)
  const [loading, setloading] = useState(false)
  const [alertTextJudul, setalertTextJudul] = useState("")
  const [alertTextKuota, setalertTextKuota] = useState("")
  const [alertTextStartDate, setalertTextStartDate] = useState("")
  const [alertTextEndDate, setalertTextEndDate] = useState("")
  const [alertTextDiskon, setalertTextDiskon] = useState("")
  const [alertTextKategori, setalertTextKategori] = useState("")
  const [alertTextError, setalertTextError] = useState("")
  const [kategoriLabel, setkategoriLabel] = useState('Contoh : Rp. 10.000');
  const [showButton, setshowButton] = useState(false);
  const [checked, setChecked] = useState('first');
  const [checkedd, setCheckedd] = useState('first');
  const [showdropdown, setshowdropdown] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setselectedDate] = useState('start');
  const [kodePromo, setkodePromo] = useState("")
  const [toko, settoko] = useState("")
  const [focusKuotaVoucher, setfocusKuotaVoucher] = useState("")

  const [categorys, setcategorys] = useState([])
  const [subCategorys, setsubCategorys] = useState([])
  const [sbColor, setsbColor] = useState(Warna.biruJaja)
  const [showSubCategorys, setshowSubCategorys] = useState(false)
  const [ktColor, setktColor] = useState('#C0C0C0')
  const [sktColor, setsktColor] = useState('#C0C0C0')
  const [kategoriName, setkategoriName] = React.useState("Kategori")
  const [subkategoriName, setsubkategoriName] = useState("Sub Kategori")

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
      cropping: true,
      includeBase64: true
    }).then((image) => {
      console.log("handlePickImageFromCamera -> image path", image.path)
      setgambarvoucher(image);
    });

  };
  const handlePickImageFromGalery = () => {
    ImagePicker.openPicker({
      cropping: true,
      includeBase64: true
    }).then((image) => {
      setgambarvoucher(image);
    });
  };

  const onchangeText = (text, val, sub) => {
    if (val === "namavoucher") {
      setnamavoucher(regexChar(text, "charNumber"))
      setalertTextJudul('')
    } else if (val === "kuotavoucher") {
      setkuotaVoucher(regexChar(text, "number"))
      setalertTextKuota('')
    } else if (val === "date") {
      let date = regexChar(text, "date")
      if (sub === "start") {
        setStartDate(date)
        setalertTextStartDate("")
      }
      if (sub === "end") {
        setEndDate(date)
        setalertTextEndDate("")
      }
    } else if (val === "diskon") {
      setDiskon(Utils.money(regexChar(text, "number")))
      setalertTextDiskon("")
    }
    if (namavoucher !== "" && kuotaVoucher !== "" && startDate !== "" && endDate !== "") {
      setshowButton(true)
    }
  }

  const regexChar = (text, val) => {
    if (val === "charNumber") {
      return (text.replace(/[^a-z0-9 .-]/gi, ''))
    } else if (val === 'date') {
      return (text.replace(/[^-0-9]/gi, ''))
    } else if (val === 'number') {
      return (text.replace(/[^0-9]/gi, ''))
    }
  }

  const handleActionSheet = (text) => {
    if (text === "kategori") {
      kategoriRef.current?.setModalVisible();
    } else if (text === "subKategori") {
      subKategoriRef.current?.setModalVisible();
    }
  }

  const getItem = async () => {
    await Service.getKategori().then(res => {
      setcategorys(res.kategori)
    })
    await AsyncStorage.getItem('xxTwo').then((toko) => {
      settoko(JSON.parse(toko))
    });
  }

  useEffect(() => {
    setloading(false)
    setalertTextJudul("");
    setalertTextStartDate("");
    setalertTextEndDate("");
    setalertTextDiskon("");
    setloading(false);
    setsbColor(Warna.biruJaja);
    setalertTextError("");
    getItem();
    try {
      let res = route.params.voucherDetail
      setvoucher(res)
      setbanner(true)
      setnamavoucher(res.judul_promo)
      setStartDate(res.mulai)
      setEndDate(res.berakhir)
      setkuotaVoucher(res.kuota_voucher)
      setshowImage(true)
      setDiskon(res.potongan_diskon)
      setkodePromo(res.kode_promo)
      setidvoucher(res.id_promo)
      setshowButton(true)
      if (res.tipe_diskon === "nominal") {
        setChecked('first');
        setkategoriTitle('Diskon Nominal');
        setkategoriLabel('20.000');
        setlengtDiskon(8)
      } else {
        setChecked('second');
        setkategoriTitle('Diskon Persentase');
        setkategoriLabel('20');
        setlengtDiskon(3)
      }
      if (res.kategori !== null) {
        setCheckedd('second');
        setshowdropdown(false)
        setkategoriName(res.kategori)
        setktColor("#454545")
        setsktColor("#COCOCO")
        if (res.sub_kategori !== null) setshowSubCategorys(true) & setsubkategoriName(res.sub_kategori) & setsktColor('#454545')
        setshowButton(true);
      }
    } catch (error) {
      console.log("index -> error", error)
    }
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
  const handleValueDropdown = (text, val) => {

    if (text === "kategori") {
      kategoriRef.current?.setModalVisible(false)
      let arrsubCategorys = val.sub_kategori;
      arrsubCategorys.sort()

      setsubCategorys(arrsubCategorys)
      setidKategori(val.id_kategori)
      console.log("handleValueDropdown -> val.id_kategori", val.id_kategori)
      setkategoriName(val.kategori)
      setktColor("#454545")
      setsktColor("#C0C0C0")
      setsubkategoriName("Sub Kategori")
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
      console.log("handleValueDropdown -> val.id_sub_kategori", val.id_sub_kategori)
      setsubkategoriName(val.sub_kategori)
      setsktColor("#454545")
      setalertTextKategori("")

      subKategoriRef.current?.setModalVisible(false)
    }
  }
  const handleSimpan = async () => {
    let id = toko.id_toko
    let nominal_diskon = "";
    let persentase_diskon = "";
    console.log("🚀 ~ file: index.js ~ line 295 ~ handleSimpan ~ kategoriTitle", kategoriTitle)
    kategoriTitle === "Diskon Nominal" ? nominal_diskon = diskon : persentase_diskon = diskon

    if (namavoucher === "") {
      setalertTextJudul("Judul promo tidak boleh kosong")
      handleShowToast("Judul promo tidak boleh kosong")
    } else if (kuotaVoucher === "") {
      setalertTextKuota("Kuota voucher tidak boleh kosong")
      handleShowToast("Kuota voucher tidak boleh kosong")
    } else if (startDate === "") {
      setalertTextStartDate("Tanggal mulai voucher tidak boleh kosong")
      handleShowToast("Tanggal mulai voucher tidak boleh kosong")
    } else if (endDate === "") {
      setalertTextEndDate("Tanggal berakhir voucher tidak boleh kosong!")
      handleShowToast("Tanggal berakhir voucher tidak boleh kosong!")
    } else if (diskon === null) {
      setalertTextDiskon("Diskon tidak boleh kosong!")
      handleShowToast("Diskon tidak boleh kosong!")
    } else if (checkedd === "second" && idKategori === "") {
      setalertTextKategori("Kategori tidak boleh kosong!")
      handleShowToast("Kategori tidak boleh kosong!")
    } else if (showSubCategorys === true && idsubKategori === "") {
      setalertTextKategori("Sub kategori tidak boleh kosong!")
      handleShowToast("Sub kategori tidak boleh kosong!")
    } else {
      setloading(true)
      setsbColor('#303030')
      if (voucher === "") {
        let credentials = {
          'kode_promo': generateKodeVoucher(),
          'mulai': startDate,
          'berakhir': endDate,
          'judul_promo': namavoucher,
          'nominal_diskon': nominal_diskon,
          'persentase_diskon': persentase_diskon,
          'id_toko': id,
          'kuota_voucher': kuotaVoucher,
          'banner_promo': banner.data,
          'id_kategori': idKategori,
          "sub_kategori": idsubKategori
        }
        await VoucherService.addVoucher(credentials)
          .then(res => {
            JSON.stringify(res.data)
            setTimeout(() => {
              setloading(false)
              setsbColor(Warna.biruJaja)
              navigation.navigate("Promosi", { update: true })
            }, 5000);
          })
          .catch(error => {
            setTimeout(() => {
              setloading(false)
              setsbColor(Warna.biruJaja)
              setalertTextError("Periksa kembali koneksi anda!")
            }, 2000);
          });
      } else {
        let credentials = {
          'kode_promo': kodePromo,
          'mulai': startDate,
          'berakhir': endDate,
          'judul_promo': namavoucher,
          'nominal_diskon': nominal_diskon,
          'persentase_diskon': persentase_diskon,
          'kuota_voucher': kuotaVoucher,
          'banner_promo': gambarvoucher.data,
          'id_kategori': idKategori,
          "sub_kategori": idsubKategori,
        }
        try {
          let res = await VoucherService.editVoucher(credentials, idvoucher)
          setTimeout(() => {
            setloading(false)
            setsbColor(Warna.biruJaja)
            navigation.navigate("Promosi", { update: true })
          }, 5000);
        } catch (error) {
          setTimeout(() => {
            setloading(false)
            setsbColor(Warna.biruJaja)
            setalertTextError("Periksa kembali koneksi anda!")
          }, 2000);
        }
      }
    }
  }
  const generateKodeVoucher = () => {
    let length = 7;
    var result = toko.nama_toko.substring(0, 3);

    let characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result.toUpperCase();
  };
  const handleStokPlus = () => {
    setkuotaVoucher(kuotaVoucher + 1);
  };
  const handleStokMinus = () => {
    kuotaVoucher < 1 ? setkuotaVoucher(0) : setkuotaVoucher(kuotaVoucher - 1)
  };

  const handleShowToast = (text) => ToastAndroid.show(text, ToastAndroid.SHORT, ToastAndroid.CENTER)


  return (
    <SafeAreaView style={[style.container, { backgroundColor: Platform.OS === 'ios' ? Colors.biruJaja : Colors.white }]}>
      <StatusBar translucent={false} backgroundColor={sbColor} barStyle="light-content" />
      {loading ?
        <Loading />
        : null
      }
      <View style={style.appBar}>
        <TouchableOpacity style={{ marginRight: wp('1%') }} onPress={() => navigation.navigate('Promosi')}>
          <Image style={style.arrowBack} source={require('../../../icon/arrow.png')} />
        </TouchableOpacity>
        <View style={style.row_start_center}>
          <Text style={style.appBarText}>Voucher Toko</Text>
        </View>

      </View>
      <ScrollView style={{ backgroundColor: Colors.white }} contentContainerStyle={{ paddingBottom: '5%', paddingHorizontal: '2%' }}>
        <Text style={styles.label}>
          Masukkan Judul
          <Text style={styles.red}> *</Text>
        </Text>
        <TextInput
          style={[styles.inputbox, styles.borderBottom]}
          placeholder="Masukkan nama voucher"
          value={namavoucher}
          maxLength={100}
          // autoCapitalize="characters"
          onChangeText={(text) => onchangeText(text, "namavoucher", "")}
          theme={{
            colors: {
              primary: Warna.biruJaja,
            },
          }}
        />
        <Text style={[style.smallTextAlert, { color: 'red' }]}>
          {alertTextJudul}
        </Text>
        <Text style={styles.label}>
          Kuota Voucher
          <Text style={styles.red}> *</Text>
        </Text>
        <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.2 }}>
          <Text style={[styles.inputbox, { flex: 1, color: Warna.blackgrayScale }]}>{kuotaVoucher + " Pembeli"}</Text>
          <TouchableOpacity style={{ padding: '2.3%', backgroundColor: Warna.kuningJaja, borderRadius: 100 }} onPress={() => handleStokMinus()}>
            <Image
              style={styles.iconPlusMinus}
              source={require('../../../icon/line.png')}
            />
          </TouchableOpacity>
          <TextInput focusable={focusKuotaVoucher} maxLength={8} keyboardType="numeric" style={{ width: wp('10%'), textAlign: 'center' }} onChangeText={text => text.length === 0 ? setkuotaVoucher(0) : setkuotaVoucher(text)}>
            {kuotaVoucher}
          </TextInput>
          <TouchableOpacity style={{ padding: '2.3%', backgroundColor: Warna.kuningJaja, borderRadius: 100 }} onPress={() => handleStokPlus()}>
            <Image
              style={styles.iconPlusMinus}
              source={require('../../../icon/plus.png')}
            />
          </TouchableOpacity>
        </View>
        <Text style={[style.smallTextAlert, { color: 'red' }]}>
          {alertTextKuota}
        </Text>
        <Text style={styles.label}>
          Tanggal Mulai<Text style={styles.red}> *</Text>
        </Text>
        <TouchableOpacity style={[styles.flexRow, styles.borderBottom]} onPress={() => showDatePicker('start')}>
          <TextInput
            editable={false}
            keyboardType="phone-pad"
            placeholder="yyyy-mm-dd"
            style={styles.inputbox}
            value={startDate}
            onChangeText={(text) => onchangeText(text, 'date', 'start')}
            theme={{
              colors: {
                primary: Warna.biruJaja,
              },
            }}
          />
          <TouchableNativeFeedback onPress={() => showDatePicker('start')}>
            <Image
              style={styles.iconCalendar}
              source={require('../../../icon/calendar.png')}
            />
          </TouchableNativeFeedback>
        </TouchableOpacity>
        <Text style={[style.smallTextAlert, { color: 'red' }]}>
          {alertTextStartDate}
        </Text>
        <Text style={styles.label}>
          Tanggal Berakhir<Text style={styles.red}> *</Text>
        </Text>
        <TouchableOpacity style={[styles.flexRow, styles.borderBottom]} onPress={() => showDatePicker('end')} >
          <TextInput
            editable={false}
            keyboardType="phone-pad"
            placeholder="yyyy-mm-dd"
            style={styles.inputbox}
            value={endDate}
            onChangeText={(text) => onchangeText(text, 'date', 'end')}
            theme={{
              colors: {
                primary: Warna.biruJaja,
              },
            }}
          />
          <TouchableNativeFeedback onPress={() => showDatePicker('end')}>
            <Image
              style={styles.iconCalendar}
              source={require('../../../icon/calendar.png')}
            />
          </TouchableNativeFeedback>
        </TouchableOpacity>
        <Text style={[style.smallTextAlert, { color: 'red' }]}>
          {alertTextEndDate}
        </Text>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={(text) => handleConfirm(text)}
          onCancel={() => hideDatePicker()}
        />
        {/* <Text style={styles.label}>
          Gambar Voucher<Text style={styles.red}> *</Text>
        </Text>
        {banner ?
          <View style={styles.boxImage}>
            <Image
              style={{ width: 100, height: 73, borderRadius: 5 }}
              source={{ uri: "" + voucher.banner_promo }}
            />

            <TouchableOpacity style={styles.circleXIcon}
              onPress={() => setgambarvoucher({}) & setshowImage(false) & setbanner(false)}>
              <Image
                style={styles.XIcon}
                source={require('../../../icon/close.png')}
              />

            </TouchableOpacity>
          </View>
          : showImage ?
            <View style={styles.boxImage}>
              <Image
                style={{ width: 100, height: 73, borderRadius: 5 }}
                source={{ uri: gambarvoucher }}
              />
              <TouchableOpacity style={styles.circleXIcon}
                onPress={() => setgambarvoucher({}) & setshowImage(false)}>
                <Image
                  style={styles.XIcon}
                  source={require('../../../icon/close.png')}
                />
              </TouchableOpacity>
            </View>
            :
            gambarvoucher.path ?
              <View style={styles.boxImage}>
                <Image
                  style={{ width: 100, height: 73, borderRadius: 5 }}
                  source={{ uri: gambarvoucher.path }}
                />
                <TouchableOpacity style={styles.circleXIcon}
                  onPress={() => setgambarvoucher({})}>
                  <Image
                    style={styles.XIcon}
                    source={require('../../../icon/close.png')}
                  />
                </TouchableOpacity>
              </View>
              :
              <View style={styles.boxImage}>
                <TouchableOpacity
                  onPress={() => actionSheetRef.current.show()}>
                  <Image
                    style={styles.iconImage}
                    source={require('../../../icon/add.png')}
                  />
                </TouchableOpacity>
              </View>
        } */}

        {/* <Text style={styles.label}>
          Kategori Diskon<Text style={styles.red}> *</Text>
        </Text>
        <View style={style.row_space}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <RadioButton
              color={Warna.kuningJaja}
              value="first"
              status={checked === 'first' ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked('first');
                setkategoriTitle('Diskon Nominal');
                setkategoriLabel('20.000');
                setlengtDiskon(8)
              }}
            />
            <Text style={styles.textradio}>Diskon Nominal</Text>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <RadioButton
              color={Warna.kuningJaja}
              value="second"
              status={checked === 'second' ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked('second');
                setkategoriTitle('Diskon Persentase');
                setkategoriLabel('20');
                setlengtDiskon(3)
              }}
            />
            <Text style={styles.textradio}>Diskon Persentase</Text>
          </View>
        </View> */}
        <Text style={styles.label}>
          {/* {kategoriTitle} */}
          Nominal Diskon
          <Text style={styles.red}> *</Text>
        </Text>
        <TextInput
          placeholder={kategoriLabel}
          style={[styles.inputbox, styles.borderBottom]}
          keyboardType="numeric"
          maxLength={lengtDiskon}
          value={diskon}
          onChangeText={(text) => onchangeText(text, "diskon")}
          theme={{ colors: { primary: Warna.biruJaja } }} />
        <Text style={[style.smallTextAlert, { color: 'red' }]}>
          {alertTextDiskon}
        </Text>
        <Text style={styles.label}>
          Target Voucher<Text style={styles.red}> *</Text>
        </Text>
        <View style={style.row_space}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <RadioButton
              color={Warna.kuningJaja}
              value="first"
              status={checkedd === 'first' ? 'checked' : 'unchecked'}
              onPress={() => {
                setCheckedd('first');
                setshowdropdown(true)

              }}
            />
            <Text style={styles.textradio}>Semua Produk</Text>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <RadioButton
              color={Warna.kuningJaja}
              value="second"
              status={checkedd === 'second' ? 'checked' : 'unchecked'}
              onPress={() => {
                setCheckedd('second');
                setshowdropdown(false)
              }}
            />
            <Text style={styles.textradio}>Per-Kategori</Text>
          </View>
        </View>
        {!showdropdown ? (
          <>
            <View style={styles.ukuranItem}>
              <Text style={styles.labelUkuran}>
                Kategori<Text style={styles.red}> *</Text>
              </Text>
              {showSubCategorys ?
                <Text style={styles.labelUkuran}>
                  Sub Kategori<Text style={styles.red}> *</Text>
                </Text>
                :
                <Text style={styles.labelUkuran}>
                  <Text></Text>
                </Text>
              }

            </View>
            <View style={[styles.ukuranItem, styles.borderBottom]}>
              <View style={styles.viewText}>
                <Text style={[styles.textInput, { color: ktColor }]}>{kategoriName}</Text>

                <IconButton
                  style={{ margin: 0 }}
                  icon={require('../../../icon/down-arrow.png')}
                  color={Warna.biruJaja}
                  size={25}
                  onPress={() => handleActionSheet("kategori")} />
              </View>


              {showSubCategorys ?
                <View style={styles.viewText}>
                  <Text style={[styles.textInput, { color: sktColor }]}>{subkategoriName}</Text>
                  <IconButton
                    style={{ margin: 0 }}
                    icon={require('../../../icon/down-arrow.png')}
                    color={Warna.biruJaja}
                    size={25}
                    onPress={() => handleActionSheet("subKategori")}
                  />
                </View>
                :
                null
              }

            </View>
            <Text style={[style.smallTextAlert, { color: 'red' }]}>
              {alertTextKategori}
            </Text>
          </>
        ) : null}
        <Text style={[style.smallTextAlertError, { borderTopWidth: 0 }]}>
          {alertTextError}
        </Text>
        {/* <View style={[style.column, style.mb_2, { width: Wp('90%'), backgroundColor: 'grey', height: Wp('35%') }]}> */}
        {/* <View style={[style.row_start_center, { flex: 0, height: Wp('13%') }]}>
              <Image style={[{ width: Wp('11%'), height: Wp('11%'), borderRadius: 100, marginRight: Wp('10%') }]} source={{ uri: reduxseller.foto }} />
              <Text style={[style.font_14, style.medium, { color: Colors.lighter }]}>{reduxseller.nama_toko}</Text>
            </View>
            <View style={[style.column, { flex: 0, justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: Wp('11%'), height: Wp('10%') }]}>
            <Text style={[style.font_16, style.semi_bold, { color: Colors.lighter }]}>{namavoucher} <Text style={[style.font_16, style.semi_bold, { color: Colors.lighter, textAlignVertical: 'top' }]}><Text style={[style.font_14, style.semi_bold, { color: Colors.lighter }]}>Rp</Text>{diskon}</Text></Text>
          </View> */}
        <View style={[Style.row_0_center, Style.mb_3]}>
          <View style={[Style.row, { width: '100%', height: Wp('25%'), backgroundColor: Colors.white, borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: Colors.biruJaja, }]}>
            {/* <ImageBackground source={require('../../../assets/icons/bgVoucher.jpg')} style={[{ backgroundColor: 'yellow', width: '100%', height: '100%', flexDirection: 'column', }]}> */}
            <View style={{ position: 'absolute', height: '100%', width: Wp('5%'), backgroundColor: Colors.biruJaja, flexDirection: 'column', justifyContent: 'center' }}>
              <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: Colors.white, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
              <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: Colors.white, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
              <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: Colors.white, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
              <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: Colors.white, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
              <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: Colors.white, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
              <View style={{ height: Wp('4%'), width: Wp('3%'), backgroundColor: Colors.white, borderTopRightRadius: 100, borderBottomRightRadius: 100 }}></View>
            </View>
            <View style={[Style.column_0_center, Style.p, { height: '100%', width: '30%', marginLeft: Wp('3%'), backgroundColor: Colors.biruJaja, }]}>
              <Text style={[Style.font_14, Style.mb_2, Style.semi_bold, { marginBottom: '-1%', color: Colors.white, alignSelf: 'center', textAlign: 'center' }]}>{namavoucher}</Text>
            </View>
            <View style={[Style.column_0_center, Style.px_2, { width: '44%' }]}>
              <Text numberOfLines={3} style={[Style.font_13, Style.mb_2, Style.semi_bold, { color: Colors.biruJaja, width: '100%' }]}>{String(namavoucher).toUpperCase()}</Text>
              <Text style={[Style.font_10, Style.semi_bold, { position: 'absolute', bottom: 5, color: Colors.biruJaja, width: '100%' }]}> {endDate}</Text>
            </View>
            <View style={[Style.column_0_center, { width: '22%' }]}>
              <TouchableOpacity onPress={() => console.log('pressed')} style={{ width: '90%', height: '30%', backgroundColor: Colors.white, padding: '2%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderWidth: 1, borderColor: Colors.biruJaja, borderRadius: 5 }}>
                <Text style={[Style.font_10, Style.semi_bold, { marginBottom: '-1%', color: Colors.biruJaja }]}>KLAIM</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => handleDescription(item)} style={{ position: 'absolute', bottom: 5 }}>
                    <Text style={[styles.font_12, { color: Colors.BlueLink }]}>S&K</Text>
                  </TouchableOpacity> */}
            </View>
            {/* </ImageBackground> */}
          </View>
        </View>
        {/* </View> */}

        <Button onPress={() => handleSimpan()} contentStyle={{ paddingVertical: '0.5%', }} labelStyle={{ color: Warna.white }} color={Warna.biruJaja} mode="contained">
          Simpan
        </Button>
      </ScrollView >
      <ActionSheetKategori
        scrollEnabled={true}
        extraScroll={100}
        containerStyle={styles.actionSheet}
        ref={kategoriRef}>
        <View style={styles.headerModal}>
          <Text style={styles.headerTitle}>Kategori Produk</Text>
          <TouchableOpacity
            onPress={() => kategoriRef.current?.setModalVisible()}
          >
            <Image
              style={styles.iconClose}
              source={require('../../../icon/close.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={{ height: 200, paddingHorizontal: wp('2%') }}>
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
        <View style={{ height: 200, paddingHorizontal: wp('2%') }}>
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
      </ActionSheetSubKategori>
      <ActionSheets ref={actionSheetRef}
        title={"Select a Photo"}
        options={["Take Photo", "Choose Photo Library", "Cancel"]}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={index => {
          if (index == 0) {
            handlePickImageFromCamera();
          } else if (index == 1) {
            handlePickImageFromGalery();
          } else {
            null;
          }
        }} />
    </SafeAreaView >
  );


}
const styles = StyleSheet.create({
  flexRow: {
    flex: 0,
    flexDirection: 'row',
  },
  flexColumn: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: wp('5%'),
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginTop: hp('3%'),
    color: Warna.biruJaja,
  },
  red: {
    color: 'red',
    fontFamily: 'Poppins-SemiBold',
  },
  borderBottom: { borderBottomWidth: 0.2 },
  inputbox: {
    width: wp('90%'),
    backgroundColor: 'transparent',
    color: 'black'
  },
  iconCalendar: {
    position: 'absolute',
    tintColor: Warna.kuningJaja,
    width: 25,
    height: 25,
    right: 10,
    bottom: 15,
  },
  iconImage: {
    marginTop: hp('1%'),
    marginLeft: wp('1%'),
    width: 60,
    height: 60,
    borderRadius: 5
  },
  iconPlusMinus: {
    width: 15,
    height: 15,
    tintColor: Warna.white,
  },
  boxImage: {
    width: 104,
    height: 75,
    marginTop: hp('1.5%'),
  },
  XIcon: { width: 9, height: 9, borderRadius: 100, tintColor: 'white' },
  circleXIcon: { position: 'absolute', right: 0, top: -3, backgroundColor: '#CC0000', padding: 5, borderRadius: 100 },
  actionSheet: {
    paddingHorizontal: wp('4%'),
  },
  textradio: { alignSelf: 'center' },
  viewText: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", paddingLeft: wp('1%') },
  textInput: { flex: 1, fontSize: 13, alignSelf: "center", textAlign: "left" },
  iconText: { flex: 1, tintColor: Warna.biruJaja, width: 20, height: 20, alignSelf: "center", },
  labelUkuran: { fontSize: 14, fontFamily: 'Poppins-SemiBold', marginTop: hp('3%'), color: '#171717', flex: 1, flexDirection: 'row', alignItems: 'flex-start', },
  ukuranItem: { flex: 1, flexDirection: 'row', alignItems: 'center', },
  touchKategori: { borderBottomColor: '#454545', borderBottomWidth: 0.5, paddingVertical: hp('2%') },
  textKategori: { fontSize: 14, fontWeight: "bold", color: "#454545" },
  headerModal: { flex: 1, flexDirection: 'row', alignContent: 'space-between', alignItems: 'center', paddingHorizontal: wp('2%') },
  headerTitle: { flex: 1, fontFamily: 'Poppins-SemiBold', fontSize: 17, color: Warna.biruJaja, marginVertical: hp('3%') },
  iconClose: { width: 14, height: 14, tintColor: 'grey', },
  smallTextAlertError: { fontSize: 11, color: 'red', marginBottom: hp('0%'), marginBottom: hp('3%') },

});


