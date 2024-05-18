import React, { useState, useEffect, createRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, TextInput as TX, Alert, ToastAndroid, Platform } from 'react-native';
import { Button, TextInput, Checkbox, Dialog, Portal, Provider, Paragraph } from 'react-native-paper';
import Warna from '../../config/Warna';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Service from '../../service/wilayahIndonesia';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ActionSheet from 'react-native-actions-sheet';
import AsyncStorage from '@react-native-community/async-storage';
import * as ServiceAccount from '../../service/Account';
import { useNavigation } from '@react-navigation/native';
import * as FetchData from '../../service/Data'
import style from '../../styles/style';
import { useDispatch } from 'react-redux';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Appbar, Colors, Style, Wp } from '../../export';
import { WebView } from 'react-native-webview';
export default function RegistrasiToko() {
  const [checked, setChecked] = useState(false);

  const navigate = useNavigation()
  const dispatch = useDispatch()
  const [kecamatanApi, setkecamatanApi] = useState([]);
  const [kecamatan, setkecamatan] = useState([]);
  const [kecamatanCount, setkecamatanCount] = useState(0);
  const [kelurahan, setkelurahan] = useState([]);
  const [kelurahanApi, setkelurahanApi] = useState([]);

  const [showKelurahan, setshowKelurahan] = useState(false)
  const [alertTitle, setalertTitle] = useState("")
  const [namaToko, setnamaToko] = useState("")
  const [alertTextnamaToko, setalertTextnamaToko] = useState("")
  const [alamat, setalamat] = useState("")
  const [alertTextAlamat, setalertTextAlamat] = useState("")
  const [kodePos, setkodePos] = useState("")
  const [alertTextkodePos, setalertTextkodePos] = useState("")
  const [provinsiId, setprovinsiId] = useState("")
  const [kabkotaId, setkabkotaId] = useState("")
  const [kecamatanId, setkecamatanId] = useState("")
  const [alertTextKecamatan, setalertTextKecamatan] = useState("")
  const [kelurahanId, setkelurahanId] = useState("")
  const [alertTextKelurahan, setalertTextKelurahan] = useState("")
  const [userId, setuserId] = useState("")
  const [kcValue, setkcValue] = useState("Kecamatan")
  const [kcColor, setkcColor] = useState("#9A9A9A")
  const [klValue, setklValue] = useState("Kelurahan")
  const [klColor, setklColor] = useState("#9A9A9A")
  const [spinner, setspinner] = useState(false)
  const [syaratKetentuan, setsyaratKetentuan] = useState(false);
  const [showSK, setShowSK] = useState(false);

  const [alertsnk, setalertsnk] = useState("");

  const actionSheetKecamatan = createRef();
  const actionSheetKelurahan = createRef()

  const text = "1. Untuk penukaran barang, pengembalian barang, dan pengembalian dana dapat dilakukan di marketplace Anda melakukan pembelanjaan dan mengikuti syarat dan ketentuan dari marketplace Anda melakukan pembelanjaan.	2.Penukaran barang dan pengembalian barang hanya akan dilayani di toko fisik kami dengan syarat Anda memiliki struk pembelanjaan resmi dari Jaja.id produk belum digunakan dan produk masih layak untuk dijual (label produk masih terpasang).3.Batas waktu penukaran di toko fisik kami hanya berlaku 30 hari dari tanggal yang tertera di struk pembelanjaan resmi dari Jaja.id4.Ketentuan dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya"

  const showsyaratKetentuan = () => {
    Alert.alert(
      "Syarat dan ketentuan Jaja.id",
      `\n1. Untuk penukaran barang, pengembalian barang, dan pengembalian dana dapat dilakukan di marketplace Anda melakukan pembelanjaan dan mengikuti syarat dan ketentuan dari marketplace Anda melakukan pembelanjaan.\n\n2.Penukaran barang dan pengembalian barang hanya akan dilayani di toko fisik kami dengan syarat Anda memiliki struk pembelanjaan resmi dari Jaja.id produk belum digunakan dan produk masih layak untuk dijual (label produk masih terpasang).\n\n3.Batas waktu penukaran di toko fisik kami hanya berlaku 30 hari dari tanggal yang tertera di struk pembelanjaan resmi dari Jaja.id.\n\n4.Ketentuan dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya`,
      [
        {
          text: "Setuju   ",
          onPress: () => console.log("Pressed"),
          style: "cancel"
        },
      ],
      { cancelable: true }
    );
  }

  const getItem = () => {
    try {
      Service.getKecamatan().then((res) => {
        setkecamatan(res.kecamatan);
        setkecamatanApi(res.kecamatan)
      });
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG, ToastAndroid.CENTER)
    }
  };
  useEffect(() => {
    setalertTitle("")
    setalertTextKecamatan("")
    setalertTextKelurahan("")
    setalertTextAlamat("")
    setalertTextkodePos("")
    setalertTextnamaToko("")
    getItem();
    AsyncStorage.getItem("xOne").then(res => {
      try {
        if (res) {
          console.log("🚀 ~ file: index.js ~ line 89 ~ AsyncStorage.getItem ~ res", JSON.parse(res).id_customer)
          setuserId(JSON.parse(res).id_customer)
        } else {
          ToastAndroid.show("Maaf ada kesalahan teknis, silahkan masuk kembali", ToastAndroid.LONG, ToastAndroid.CENTER)
          setTimeout(() => navigate.replace("Login"));
        }
      } catch (error) {
        ToastAndroid.show("Maaf ada kesalahan teknis, silahkan masuk kembali", ToastAndroid.LONG, ToastAndroid.CENTER)
        setTimeout(() => navigate.replace("Login"));
      }
    }).catch(async err => {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys).then(res => {
        ToastAndroid.show("Maaf ada kesalahan teknis, silahkan masuk kembali", ToastAndroid.LONG, ToastAndroid.CENTER)
        setTimeout(() => navigate.replace("Login"));
      })
    })
  }, []);

  const handleSelected = (name, value) => {
    console.log("handleSelected -> name, value", name, value)
    if (name === "kecamatan") {
      setprovinsiId(value.province_id)
      setkabkotaId(value.city_id)
      setkecamatanId(value.kecamatan_id)
      setkcValue(value.city + ", " + value.kecamatan)
      setkcColor(Warna.black)
      setklValue("Kelurahan")
      setklColor("#9A9A9A")
      setalertTextKecamatan("")
      actionSheetKecamatan.current?.setModalVisible(false)

      Service.getKelurahan(value.kecamatan_kd).then(res => {
        console.log("handleSelected -> res", res)
        setshowKelurahan(true)
        setkelurahan(res.kelurahan)
        setkelurahanApi(res.kelurahan)
      })
    } else if (name === "kelurahan") {
      actionSheetKelurahan.current?.setModalVisible(false)
      setkelurahanId(value.kelurahan_id)
      console.log("handleSelected -> value.kelurahan_id", value.kelurahan_id)
      setklValue(value.kelurahan_desa)
      setklColor(Warna.black)
      setalertTextKelurahan("")
    }
  }

  const renderKecamatan = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleSelected("kecamatan", item)} style={styles.touchKategori}>
        <Text style={styles.textKategori}>{item.city}, {item.kecamatan}</Text>
      </TouchableOpacity>
    )
  }
  const renderKelurahan = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleSelected("kelurahan", item)} style={styles.touchKategori}>
        <Text style={styles.textKategori}>{item.kelurahan_desa}</Text>
      </TouchableOpacity>
    )
  }
  const handleSearch = (name, text) => {
    if (name === "kecamatan") {
      if (text.length === 0) setkecamatan(kecamatanApi);
      const beforeFilter = kecamatanApi;
      const afterFilter = beforeFilter.filter((item) => {
        const itemData = `${item.province.toUpperCase()} ${item.city.toUpperCase()}  ${item.kecamatan.toUpperCase()}`;
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      })
      setkecamatan(afterFilter);
    } else {
      if (text.length === 0) setkelurahanApi(kelurahanApi);
      const beforeFilter = kelurahanApi;
      const afterFilter = beforeFilter.filter(kel => kel.kelurahan_desa.toLowerCase().indexOf(text.toLowerCase()) > -1);
      setkelurahan(afterFilter);
    }
  };

  const onChangeText = (value, name) => {
    console.log("onChangeText -> name : ", name, value)
    if (name === "namaToko") {
      setnamaToko(regex(value, "charNumber"))
      setalertTextnamaToko("")
    } else if (name === 'kodepos') {
      setkodePos(regex(value, 'number'))
      setalertTextkodePos("")
    } else if (name === 'alamat') {
      setalamat(regex(value, 'address'))
      setalertTextAlamat("")
    } else {
      console.log("onChangeText -> else", name)
    }
  }
  const regex = (value, name) => {
    if (name === "charNumber") {
      return (value.replace(/[^a-z0-9 ]/gi, ''))
    } else if (name === 'number') {
      return (value.replace(/[^0-9]/gi, ''))
    } else if (name === 'address') {
      return (value.replace(/[^a-z0-9 ,./-]/gi, ''))
    }
  }

  const handleSimpan = () => {
    let crendetials = {
      'provinsi': provinsiId,
      'kabKota': kabkotaId,
      'kecamatan': kecamatanId,
      'kelurahan': kelurahanId,
      'customer': userId,
      'nama': namaToko,
      'alamat': alamat,
      'kodePos': kodePos
    }
    console.log("🚀 ~ file: index.js ~ line 185 ~ handleSimpan ~ userId", userId)
    if (kecamatanId === "") {
      setalertTextKecamatan("Kecamatan tidak boleh kosong")
    } else if (kelurahanId === "") {
      setalertTextKelurahan("Kelurahan tidak boleh kosong")
    } else if (alamat === "") {
      setalertTextAlamat("Alamat tidak boleh kosong")
    } else if (kodePos === "") {
      setalertTextkodePos("Kode Pos tidak boleh kosong")
    } else if (namaToko === "") {
      setalertTextnamaToko("Nama Toko tidak boleh kosong")
    } else if (syaratKetentuan === false) {
      setalertsnk("Pastikan anda menyetujui syarat dan ketentuan dari Jaja.id")
    } else if (namaToko !== "" && kodePos !== "" && alamat !== "" && kelurahanId !== "" && kecamatanId !== "" && syaratKetentuan !== false) {
      setspinner(true)
      ServiceAccount.registerToko(crendetials).then(async (res) => {
        console.log("handleSimpan yaa -> res", res)
        if (res.status === 201) {
          AsyncStorage.setItem('xxTwo', JSON.stringify(res.seller))
          // AsyncStorage.setItem('jwt', JSON.stringify(generateCode()))
          EncryptedStorage.setItem('seller', JSON.stringify(res.seller))
          FetchData.getProduct(res.seller.id_toko)
          FetchData.getDashboard(res.seller.id_toko)

          navigate.replace("User")
          setTimeout(() => setspinner(false), 200);
        } else if (res.status === 409) {
          setalertTextnamaToko("Nama toko sudah pernah digunakan")
          setTimeout(() => {
            setspinner(false)
          }, 500);
          ToastAndroid.show("Nama toko sudah pernah digunakan", ToastAndroid.LONG, ToastAndroid.CENTER)
          console.log("index -> status -> 409", res.status)
        } else if (res.status === 404) {
          setTimeout(() => setspinner(false), 200);
          ToastAndroid.show("Akun ini sudah memiliki toko", ToastAndroid.LONG, ToastAndroid.CENTER)
          setalertTitle("Akun ini sudah memiliki toko!")
        } else {
          console.log("keluar");
          setTimeout(() => {
            setspinner(false)
            ToastAndroid.show(String(res.status.message + " " + res.status.code), ToastAndroid.LONG, ToastAndroid.CENTER)
          }, 500);
        }
      }).catch((err) => {
        setTimeout(() => {
          ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER)
          setspinner(false)
        }, 500);
      });
    } else {
      ToastAndroid.show("Mohon maaf ada kesalahan teknis, coba lagi nanti", ToastAndroid.LONG, ToastAndroid.CENTER)
    }
  }

  const generateCode = () => {
    let length = 16;
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  const handleShowSK = (e) => {
    console.log("🚀 ~ file: index.js ~ line 281 ~ handleShowSK ~ e", e)
    setShowSK(e)
  }

  return (
    <SafeAreaView style={Style.container}>
      {!showSK ?
        <View style={[Style.container, { backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }]}>
          <Spinner
            visible={spinner}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
          <View style={styles.logo}>
            <Image
              style={styles.logoJaja}
              source={require('../../logo/jaja-logo.png')}
            />
            <Text style={styles.sellerCenter}>SELLER CENTER</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.note}>
              {alertTitle === "" ? 'Note : Isi form alamat di bawah ini dengan benar untuk melengkapi data dan membuka toko anda secara gratis!' : alertTitle}
            </Text>

            <TextInput
              style={styles.inputText}
              mode="flat"
              label="Nama Toko"
              textAlignVertical="bottom"
              keyboardType="default"
              value={namaToko}
              onChangeText={text => onChangeText(text, "namaToko")}
              theme={{
                colors: {
                  primary: Warna.kuningJaja,
                  background: 'transparent'
                },
              }}
            />
            <Text style={{ fontSize: 12, color: 'red', alignSelf: 'center', width: wp('85%') }}>{alertTextnamaToko}</Text>

            <TextInput
              style={styles.inputText}
              mode="flat"
              label="Alamat"
              placeholder="Perum. Bumi Permai, JL. Jati 11, RT 09 RW 03"
              maxLength={70}
              multiline={true}
              textAlignVertical="bottom"
              keyboardType="default"
              value={alamat}
              onChangeText={text => onChangeText(text, "alamat")}
              theme={{
                colors: {
                  primary: Warna.kuningJaja,

                  background: 'transparent'
                },
              }}
            />
            <Text style={{ fontSize: 12, color: 'red', alignSelf: 'center', width: wp('85%') }}>{alertTextAlamat}</Text>

            <TextInput
              style={styles.inputText}
              maxLength={9}
              mode="flat"
              label="Kode Pos"
              textAlignVertical="bottom"
              keyboardType="numeric"
              value={kodePos}
              onChangeText={text => onChangeText(text, "kodepos")}

              theme={{
                colors: {
                  primary: Warna.kuningJaja,
                  background: 'transparent'
                },
              }}
            />
            <Text style={{ fontSize: 12, color: 'red', alignSelf: 'center', width: wp('85%') }}>{alertTextkodePos}</Text>
            <TouchableOpacity onPress={() => actionSheetKecamatan.current?.setModalVisible()} style={styles.viewText}>
              <Text style={[styles.textInput, { color: kcColor }]}>{kcValue}</Text>
              <View>
                <Image style={styles.iconText} source={require('../../icon/down-arrow.png')} />
              </View>
            </TouchableOpacity>
            <Text style={{ fontSize: 12, color: 'red', alignSelf: 'center', width: wp('85%') }}>{alertTextKecamatan}</Text>

            <TouchableOpacity onPress={() => actionSheetKelurahan.current?.setModalVisible(showKelurahan)} style={styles.viewText}>
              <Text style={[styles.textInput, { color: klColor }]}>{klValue}</Text>
              <View>
                <Image style={styles.iconText} source={require('../../icon/down-arrow.png')} />
              </View>
            </TouchableOpacity>
            <Text style={{ fontSize: 12, color: 'red', alignSelf: 'center', width: wp('85%') }}>{alertTextKelurahan}</Text>
            {/* <View style={[style.row_0, { justifyContent: 'center' }]}>
        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => {
            setChecked(!checked);
          }}
        />
        <Text></Text>
      </View> */}
            <View style={[styles.viewText, { borderBottomWidth: 0, justifyContent: 'flex-start', width: wp('89%'), }]}>
              <Checkbox
                color={Warna.biruJaja}
                status={syaratKetentuan ? 'checked' : 'unchecked'}
                onPress={() => {
                  setsyaratKetentuan(!syaratKetentuan);
                }}
              />
              <Text style={[Style.font_12, { alignSelf: 'flex-start' }]}>Saya setuju dengan <Text style={styles.sDANk} onPress={() => setShowSK(true)}>syarat dan ketentuan</Text> Jaja.id</Text>
            </View>
            <Text style={{ fontSize: 12, color: 'red', alignSelf: 'center', width: wp('85%') }}>{alertsnk}</Text>

            <Button
              color={Warna.kuningJaja}
              labelStyle={{ color: Warna.white }}
              label="Simpan"
              mode="contained"
              style={styles.button2}
              contentStyle={styles.contentButton}
              onPress={() => handleSimpan()}>
              Simpan
            </Button>
          </View>
        </View>

        :
        <View style={Style.container}>
          <Appbar back={true} backThere={handleShowSK} back2={true} title='Syarat Ketentuan' />
          <WebView source={{ uri: 'https://jaja.id/syarat-ketentuan' }} />
        </View>
      }



      <ActionSheet containerStyle={styles.actionSheet} ref={actionSheetKecamatan}>
        <View style={styles.headerModal}>
          <Text style={styles.headerTitle}>Kecamatan</Text>
          <TouchableOpacity onPress={() => actionSheetKecamatan.current?.setModalVisible(false)}>
            <Image
              style={styles.iconClose}
              source={require('../../icon/close.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.search}>
          <View style={{ height: '100%', width: '6%', marginRight: '1%' }}>
            <Image
              source={require('../../icon/search.png')}
              style={{
                height: undefined,
                width: undefined,
                flex: 1,
                resizeMode: 'contain',
                tintColor: 'grey',
              }}
            />
          </View>
          <TX
            placeholder="Cari kecamatan"
            style={{ flex: 1, paddingLeft: 10 }}
            onChangeText={(text) => {
              handleSearch("kecamatan", text)
              setkecamatanCount(kecamatanCount + 1)
            }}
          />

        </View>
        <View style={{ height: hp('50%'), paddingHorizontal: wp('2%') }}>
          <ScrollView style={{ flex: 1 }}
            nestedScrollEnabled={true}
            scrollEnabled={true}>
            <FlatList
              data={kecamatan.slice(0, 100)}
              renderItem={renderKecamatan}
              keyExtractor={item => item?.id_data}
            />

          </ScrollView>
        </View>
      </ActionSheet>
      <ActionSheet containerStyle={styles.actionSheet} ref={actionSheetKelurahan}>
        <View style={styles.headerModal}>
          <Text style={styles.headerTitle}>Kelurahan</Text>
          <TouchableOpacity
            onPress={() => actionSheetKelurahan.current?.setModalVisible(false)}
          >
            <Image
              style={styles.iconClose}
              source={require('../../icon/close.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.search}>
          <View style={{ height: '100%', width: '6%', marginRight: '1%' }}>
            <Image
              source={require('../../icon/search.png')}
              style={{
                height: undefined,
                width: undefined,
                flex: 1,
                resizeMode: 'contain',
                tintColor: 'grey',
              }}
            />
          </View>
          <TX
            placeholder="Cari kelurahan"
            style={{ flex: 1, paddingLeft: 10 }}
            onChangeText={(text) => {
              handleSearch("kelurahan", text)
            }}
          />
        </View>
        <View style={{ height: hp('50%'), paddingHorizontal: wp('2%') }}>
          <ScrollView style={{ flex: 1 }}
            nestedScrollEnabled={true}
            scrollEnabled={true}>
            <FlatList
              data={kelurahan.slice(0, 100)}
              renderItem={renderKelurahan}
              keyExtractor={item => item?.id_data}
            />
          </ScrollView>
        </View>
      </ActionSheet>


    </SafeAreaView>
  )

}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF',
  },

  body: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewText: {
    width: wp('85%'),
    height: hp('7%'),
    borderBottomWidth: 0.5,
    borderBottomColor: "#9A9A9A",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  textInput: { fontSize: 14, alignSelf: "center", textAlign: "left", alignItems: 'flex-end' },
  iconText: { tintColor: '#9a9a9a', width: 15, height: 15, alignSelf: "center" },

  item: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logoJaja: {
    flex: 0,
    width: wp('60%'),
    height: hp('17%'),
    resizeMode: 'contain',
    alignSelf: 'center',
    alignItems: 'flex-end'
  },
  text: {
    fontWeight: '900',
    fontFamily: 'Poppins-Italic',
    color: '#ffffff',
    width: wp('79%'),
  },
  sellerCenter: {
    // fontWeight: '900',
    fontFamily: 'Poppins-Italic',
    color: Warna.black,
    alignItems: "flex-start",
    justifyContent: 'flex-end',
    paddingHorizontal: wp('20%'),
    alignSelf: 'flex-end',
    marginTop: hp('-2%'),
    marginBottom: '3%'
  },

  inputBox: {
    width: wp('85%'),
    height: hp('7%'),
  },
  inputText: {
    width: wp('85%'),
    height: hp('7%'),
    justifyContent: "flex-end",
    textAlign: 'left',
    borderBottomColor: '#C0C0C0',
    fontSize: 15,
    paddingHorizontal: 0,
  },
  note: {
    width: wp('85%'),
    height: hp('5%'),
    fontFamily: 'Poppins-Italic',
    color: '#B22222',
    fontSize: 12,
  },
  contentButton: {
    height: hp('5.3%'),
    width: wp('85%'),

  },

  button2: {
    marginTop: '0%'
  },
  daftar: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: wp('77%'),
    marginTop: hp('1%'),


  },
  belumPunyaAkun: {
    color: 'white',
    fontSize: 11,
    marginRight: wp('1%'),
  },
  daftarText: {
    color: Warna.kuningJaja,
    fontSize: 11,
    fontWeight: '500'
  },
  headerModal: { flexDirection: 'row', alignContent: 'space-between', alignItems: 'center', paddingHorizontal: wp('2%') },
  headerTitle: { flex: 1, fontFamily: 'Poppins-SemiBold', fontSize: 17, color: Warna.biruJaja, marginVertical: hp('3%') },
  iconClose: { width: 14, height: 14, tintColor: 'grey', },
  touchKategori: { borderBottomColor: '#454545', borderBottomWidth: 0.5, paddingVertical: hp('2%') },
  textKategori: { fontSize: 14, fontWeight: "bold", color: "#454545" },
  actionSheet: {
    paddingHorizontal: wp('4%'),
    height: hp('70%'),
    width: Wp('100%'),
  },
  search: {
    flexDirection: 'row',
    paddingHorizontal: '3%',
    borderRadius: 5,
    height: hp('6%'),
    marginHorizontal: '2%',
    marginVertical: '2%',
    backgroundColor: '#D3D3D3',
  },
  sDANk: {
    color: '#6495ED',
    fontSize: 11,
  },
});
