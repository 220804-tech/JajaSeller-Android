import React, { useState, useEffect, createRef, useCallback } from 'react';
import { View, Text, SafeAreaView, ScrollView, TextInput, Image, TouchableOpacity, Dimensions, StyleSheet, Platform } from 'react-native';
import ActionButton from 'react-native-action-button';
import ProdukAktif from './produkAktif';
import ProdukTidakAktif from './produkTidakAktif';
import Pelanggaran from './produkDiblokir';
import AllProduct from './allProduct';
import ProdukHabis from './produkHabis'
import ProdukMenunggu from './produkMenunggu'
import ActionSheetLayout from 'react-native-actions-sheet';
import AsyncStorage from '@react-native-community/async-storage';
import { Style, useFocusEffect, useNavigation, Colors, Appbar, Hp, Utils, Wp } from '../../export';
import { useSelector, useDispatch } from 'react-redux';

export default function Produk(props) {
  const navigation = useNavigation();
  const menuRef = createRef()
  const actionSheetLayout = createRef();
  const reduxAuth = useSelector(state => state.user.token)

  const reduxProduct = useSelector(state => state.product)
  console.log("🚀 ~ file: Produk.js ~ line 22 ~ Produk ~ reduxProduct", reduxProduct.length)
  const dispatch = useDispatch()

  const [status, setStatus] = useState('Aktif');


  const [W_Aktif, setW_Aktif] = useState('');
  const [W_NonAktif, setW_NonAktif] = useState('');
  const [W_Semua, setW_Semua] = useState('');
  const [W_Habis, setW_Habis] = useState('');
  const [W_Pelanggaran, setW_Pelanggaran] = useState('');
  const [W_Menunggu, setW_Menunggu] = useState('');

  const [TC_Aktif, setTC_Aktif] = useState(Colors.blackgrayScale);
  const [TC_NonAktif, setTC_NonAktif] = useState(Colors.blackgrayScale);
  const [TC_Pelanggaran, setTC_Pelanggaran] = useState(Colors.blackgrayScale);
  const [TC_Semua, setTC_Semua] = useState(Colors.blackgrayScale);
  const [TC_Habis, setTC_Habis] = useState(Colors.blackgrayScale);
  const [TC_Menunggu, setTC_Menunggu] = useState(Colors.blackgrayScale);

  const [BC_Aktif, setBC_Aktif] = useState('');
  const [BC_NonAktif, setBC_NonAktif] = useState('');
  const [BC_Habis, setBC_Habis] = useState('');
  const [BC_Pelanggaran, setBC_Pelanggaran] = useState('');
  const [BC_Semua, setBC_Semua] = useState('');
  const [BC_Menunggu, setBC_Menunggu] = useState('');

  const [searchValue, setSearch] = useState('');
  const [kategori, setKategori] = useState(0);
  // const [text, setText] = useState('');
  const [params, setparams] = useState("");
  const [update, setupdate] = useState(false);
  const [products, setProducts] = useState([]);

  const [isModalVisible, setModalVisible] = useState(false)
  let ScreenHeight = Dimensions.get('window').height;
  const reduxUser = useSelector(state => state.user)

  const reduxAllProducts = useSelector(state => state.product.apiAllProducts)
  const reduxLiveProducts = useSelector(state => state.product.apiLiveProducts)
  const reduxArchiveProducts = useSelector(state => state.product.apiArchiveProducts)
  const reduxSoldOutProducts = useSelector(state => state.product.apiSoldOutProducts)
  const reduxBlockedProducts = useSelector(state => state.product.apiBlockedProducts)




  const [testState, settestState] = useState([0]);

  function StatusProduk(statusProduk) {
    if (statusProduk == 'Aktif') {
      setStatus(statusProduk);

      setW_Aktif(Colors.biruJaja);
      setW_NonAktif(null);
      setW_Pelanggaran(null);
      setW_Semua(null);
      setW_Habis(null)
      setW_Menunggu(null)

      setTC_Aktif(Colors.white);
      setTC_NonAktif(Colors.blackgrayScale);
      setTC_Pelanggaran(Colors.blackgrayScale);
      setTC_Semua(Colors.blackgrayScale)
      setTC_Habis(Colors.blackgrayScale)
      setTC_Menunggu(Colors.blackgrayScale)

      setBC_Aktif('#639bc6');
      setBC_NonAktif(Colors.blackgrayScale);
      setBC_Pelanggaran(Colors.blackgrayScale);
      setBC_Semua(Colors.blackgrayScale)
      setBC_Habis(Colors.blackgrayScale)
      setBC_Menunggu(Colors.blackgrayScale)

    } else if (statusProduk == 'NonAktif') {
      setStatus(statusProduk);

      setW_Aktif(null);
      setW_NonAktif(Colors.biruJaja);
      setW_Pelanggaran(null);
      setW_Semua(null);
      setW_Habis(null)
      setW_Menunggu(null)

      setTC_Aktif(Colors.blackgrayScale);
      setTC_NonAktif(Colors.white);
      setTC_Pelanggaran(Colors.blackgrayScale);
      setTC_Semua(Colors.blackgrayScale)
      setTC_Habis(Colors.blackgrayScale)
      setTC_Menunggu(Colors.blackgrayScale)

      setBC_Aktif(Colors.blackgrayScale);
      setBC_NonAktif('#639bc6');
      setBC_Pelanggaran(Colors.blackgrayScale);
      setBC_Semua(Colors.blackgrayScale)
      setBC_Habis(Colors.blackgrayScale)
      setBC_Menunggu(Colors.blackgrayScale)

    } else if (statusProduk == 'AllProduct') {
      setStatus(statusProduk);

      setW_Aktif(null);
      setW_NonAktif(null);
      setW_Pelanggaran(null);
      setW_Semua(Colors.biruJaja);
      setW_Habis(null)
      setW_Menunggu(null)

      setTC_Aktif(Colors.blackgrayScale);
      setTC_NonAktif(Colors.blackgrayScale);
      setTC_Pelanggaran(Colors.blackgrayScale);
      setTC_Semua(Colors.white)
      setTC_Habis(Colors.blackgrayScale)
      setTC_Menunggu(Colors.blackgrayScale)

      setBC_Aktif(Colors.blackgrayScale);
      setBC_NonAktif(Colors.blackgrayScale);
      setBC_Pelanggaran(Colors.blackgrayScale);
      setBC_Semua('#639bc6');
      setBC_Habis(Colors.blackgrayScale)
      setBC_Menunggu(Colors.blackgrayScale)

    } else if (statusProduk == 'Habis') {
      setStatus(statusProduk);

      setW_Aktif(null);
      setW_NonAktif(null);
      setW_Pelanggaran(null);
      setW_Semua(null);
      setW_Habis(Colors.biruJaja)
      setW_Menunggu(null)

      setTC_Aktif(Colors.blackgrayScale);
      setTC_NonAktif(Colors.blackgrayScale);
      setTC_Pelanggaran(Colors.blackgrayScale);
      setTC_Semua(Colors.blackgrayScale)
      setTC_Habis(Colors.white)
      setTC_Menunggu(Colors.blackgrayScale)

      setBC_Aktif(Colors.blackgrayScale);
      setBC_NonAktif(Colors.blackgrayScale);
      setBC_Pelanggaran(Colors.blackgrayScale);
      setBC_Semua(Colors.blackgrayScale);
      setBC_Habis('#639bc6')
      setBC_Menunggu(Colors.blackgrayScale)

    } else if (statusProduk == 'Menunggu') {
      setStatus(statusProduk);

      setW_Aktif(null);
      setW_NonAktif(null);
      setW_Pelanggaran(null);
      setW_Semua(null);
      setW_Habis(null)
      setW_Menunggu(Colors.biruJaja)

      setTC_Aktif(Colors.blackgrayScale);
      setTC_NonAktif(Colors.blackgrayScale);
      setTC_Pelanggaran(Colors.blackgrayScale);
      setTC_Semua(Colors.blackgrayScale)
      setTC_Habis(Colors.blackgrayScale)
      setTC_Menunggu(Colors.white)

      setBC_Aktif(Colors.blackgrayScale);
      setBC_NonAktif(Colors.blackgrayScale);
      setBC_Pelanggaran(Colors.blackgrayScale);
      setBC_Semua(Colors.blackgrayScale);
      setBC_Habis(Colors.blackgrayScale)
      setBC_Menunggu('#639bc6')
    } else {
      setStatus(statusProduk);

      setW_Aktif(null);
      setW_NonAktif(null);
      setW_Pelanggaran(Colors.biruJaja);
      setW_Semua(null);
      setW_Habis(null)
      setW_Menunggu(null)

      setTC_Aktif(Colors.blackgrayScale);
      setTC_NonAktif(Colors.blackgrayScale);
      setTC_Pelanggaran(Colors.white);
      setTC_Semua(Colors.blackgrayScale)
      setTC_Habis(Colors.blackgrayScale)
      setTC_Menunggu(Colors.blackgrayScale)

      setBC_Aktif(Colors.blackgrayScale);
      setBC_NonAktif(Colors.blackgrayScale);
      setBC_Pelanggaran('#639bc6');
      setBC_Semua(Colors.blackgrayScale)
      setBC_Habis(Colors.blackgrayScale)
      setBC_Menunggu(Colors.blackgrayScale)

    }
  }

  function statePertama() {
    StatusProduk('AllProduct')
    setStatus('AllProduct');
    setW_Aktif(null);
    setW_NonAktif(null);
    setW_Pelanggaran(null);
    setW_Habis(null)
    setW_Menunggu(null);
    setW_Semua(Colors.biruJaja);

    setTC_Aktif(Colors.blackgrayScale);
    setTC_NonAktif(Colors.blackgrayScale);
    setTC_Pelanggaran(Colors.blackgrayScale);
    setTC_Habis(Colors.blackgrayScale)
    setTC_Menunggu(Colors.blackgrayScale);
    setTC_Semua(Colors.white);

    setBC_Aktif(Colors.blackgrayScale);
    setBC_NonAktif(Colors.blackgrayScale);
    setBC_Pelanggaran(Colors.blackgrayScale);
    setBC_Habis(Colors.blackgrayScale)
    setBC_Menunggu(Colors.blackgrayScale)
    setBC_Semua('#639bc6');

  }

  const handleSearch = (text) => {
    if (reduxAuth) {
      if (text.length) {
        const beforeFilterProducts = JSON.parse(JSON.stringify(reduxAllProducts));
        console.log("🚀 ~ file: Produk.js ~ line 236 ~ handleSearch ~ beforeFilterProducts", beforeFilterProducts)
        const afterFilterProducts = beforeFilterProducts.filter(product => product.nama_produk.toLowerCase().indexOf(text.toLowerCase()) > -1);
        dispatch({ type: 'SET_PRODUCTS', payload: afterFilterProducts })


        const liveProducts = JSON.parse(JSON.stringify(reduxLiveProducts));
        const filterLive = liveProducts.filter(product => product.nama_produk.toLowerCase().indexOf(text.toLowerCase()) > -1);
        dispatch({ type: 'SET_PRODUCTS_LIVE', payload: filterLive })

        const archiveProducts = JSON.parse(JSON.stringify(reduxArchiveProducts));
        const filterArchive = archiveProducts.filter(product => product.nama_produk.toLowerCase().indexOf(text.toLowerCase()) > -1);
        dispatch({ type: 'SET_PRODUCTS_ARCHIVE', payload: filterArchive })

        const soldOutProducts = JSON.parse(JSON.stringify(reduxSoldOutProducts));
        const filterSoldOut = soldOutProducts.filter(product => product.nama_produk.toLowerCase().indexOf(text.toLowerCase()) > -1);
        dispatch({ type: 'SET_PRODUCTS_SOLDOUT', payload: filterSoldOut })

        const blockedProducts = JSON.parse(JSON.stringify(reduxBlockedProducts));
        const filterBlocked = blockedProducts.filter(product => products ? product.nama_produk.toLowerCase().indexOf(text.toLowerCase()) > -1 : null);
        dispatch({ type: 'SET_PRODUCTS_BLOCKED', payload: filterBlocked })

      } else {
        dispatch({ type: 'SET_PRODUCTS', payload: reduxAllProducts })
        dispatch({ type: 'SET_PRODUCTS_LIVE', payload: reduxLiveProducts })
        dispatch({ type: 'SET_PRODUCTS_ARCHIVE', payload: reduxArchiveProducts })
        dispatch({ type: 'SET_PRODUCTS_SOLDOUT', payload: reduxSoldOutProducts })
        dispatch({ type: 'SET_PRODUCTS_BLOCKED', payload: reduxBlockedProducts })
      }
    }
  };


  useFocusEffect(
    useCallback(() => {
      StatusProduk('AllProduct')
      AsyncStorage.removeItem('updateProduk')
    }, []),
  );

  useEffect(() => {
    if (reduxAuth) {
      statePertama();
      newFunction()
      setProducts(reduxProduct)
      if (props.route.params) {
        AsyncStorage.getItem('updateProduk').then(async res => {
          try {
            if (res == 'update' && res != null) {
              setparams("update")
            } else {
              setparams("")
            }
          } catch (error) {
            setparams("")
          }

        })
      }
    }
  }, [props.route.params]);

  function addProduk() {
    navigation.navigate(!reduxAuth ? 'Login' : 'ProdukBaru')
    menuRef.current.hide();
  };

  const handleparams = (val) => setparams(val)

  function newFunction() {
    if (status == 'Aktif') {
      return <ProdukAktif search={searchValue} handleFilter={kategori} params={params} handleparams={handleparams} />
    } else if (status == 'NonAktif') {
      return <ProdukTidakAktif search={searchValue} handleFilter={kategori} />
    } else if (status == 'AllProduct') {
      return <AllProduct search={searchValue} handleFilter={kategori} />
    } else if (status == 'Habis') {
      return <ProdukHabis search={searchValue} handleFilter={kategori} />
    }
    else if (status == 'Menunggu') {
      return <ProdukMenunggu search={searchValue} handleFilter={kategori} />
    }
    else {
      return <Pelanggaran search={searchValue} handleFilter={kategori} />
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, flexDirection: 'column', justifyContent: "center", backgroundColor: Platform.OS === 'ios' ? Colors.biruJaja : null }}
      forceInset={{ bottom: 'never' }}>
      <Appbar title="Daftar Produk" />
      <View style={{ flex: 1, backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }}>
        {/* Body */}
        {/* <View style={[Style.row_0_center, Style.searchCard]}>
        <View style={{ height: '100%', width: '6%', marginRight: '1%' }}>
          <Image
            source={require('../../assets/icons/loupe.png')}
            style={{
              height: undefined,
              width: undefined,
              flex: 1,
              resizeMode: 'contain',
            }}
          />
        </View>
        <TextInput
          placeholder="Cari produk atau SKU"
          style={[Style.font_14, { flex: 1, marginBottom: '-0.5%' }]}

          onChangeText={(text) => handleSearch(text)}
        />
      </View> */}

        <View style={styles.search}>
          <Image
            source={require('../../assets/icons/loupe.png')}
            style={{
              height: 23,
              width: 23,
              flex: 1,
              resizeMode: 'contain',
              marginRight: '1%'
            }}
          />
          <TextInput
            placeholder="Cari Produk"
            style={[Style.font_13, { marginBottom: '-0.5%', width: '90%', height: '100%', color: Colors.black, textAlignVertical: 'center' }]}
            onChangeText={(text) => handleSearch(text)}
          />
        </View>

        <View style={Style.scrollHorizontal}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          // contentContainerStyle={styles.buttonOpsi}
          >
            <TouchableOpacity
              onPress={() =>
                StatusProduk('AllProduct')
              }
              style={{
                borderRadius: 11,
                borderWidth: 0.5,
                paddingVertical: '1.5%',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 6,
                borderColor: BC_Semua,
                backgroundColor: W_Semua,
                alignSelf: 'center',
                width: 100,
              }}>
              <Text adjustsFontSizeToFit style={[Style.font_12, Style.text_center, Style.medium, { color: TC_Semua }]}>Semua</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => StatusProduk('Aktif')}
              style={{
                borderRadius: 11,
                borderWidth: 0.5,
                paddingVertical: '1.5%',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 6,
                borderColor: BC_Aktif,
                backgroundColor: W_Aktif,
                alignSelf: 'center',
                width: 100,
              }}>
              <Text adjustsFontSizeToFit style={[Style.font_12, Style.text_center, Style.medium, { color: TC_Aktif }]} >
                Live
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                //   alert('hehehe'),
                StatusProduk('Habis')
              }
              style={{
                borderRadius: 11,
                borderWidth: 0.5,
                paddingVertical: '1.5%',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 6,
                borderColor: BC_Habis,
                backgroundColor: W_Habis,
                alignSelf: 'center',
                width: 100,
              }}>
              <Text adjustsFontSizeToFit style={[Style.font_12, Style.text_center, Style.medium, { color: TC_Habis }]}>
                Habis
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => StatusProduk('NonAktif')}
              style={{
                borderRadius: 11,
                borderWidth: 0.5,
                paddingVertical: '1.5%',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 6,
                borderColor: BC_NonAktif,
                backgroundColor: W_NonAktif,
                alignSelf: 'center',
                width: 100,
              }}>
              <Text adjustsFontSizeToFit
                style={[Style.font_12, Style.text_center, Style.medium, { color: TC_NonAktif }]}>
                Diarsipkan
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
            onPress={() => StatusProduk('Menunggu')}
            style={{
              borderRadius: 11,
              borderWidth: 0.7,
              paddingHorizontal: 3,
              paddingVertical: 8,
              justifyContent: 'center',
              marginRight: 5,
              borderColor: BC_Menunggu,
              backgroundColor: W_Menunggu,
              alignSelf: 'center',
              width: 125,
            }}>
            <Text adjustsFontSizeToFit style={[Style.font_12,{ color: TC_Menunggu }}>
              Menunggu Konfirmasi
            </Text>
          </TouchableOpacity> */}
            <TouchableOpacity onPress={() => StatusProduk('Pelanggaran')}
              style={{
                borderRadius: 11,
                borderWidth: 0.5,
                paddingVertical: '1.5%',
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: BC_Pelanggaran,
                backgroundColor: W_Pelanggaran,
                alignSelf: 'center',
                width: 100,

              }}>
              <Text adjustsFontSizeToFit style={[Style.font_12, Style.text_center, Style.medium, { color: TC_Pelanggaran }]}>
                Diblokir
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        
        <View style={[Style.container, Style.pickMediaButton, Style.pt, {
          backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null
        }]}>
          {newFunction()}
        </View>
        
        {/* buttonColor='#dbf4ff' */}
        <ActionButton style={{ elevation: 5, zIndex: 999 }} buttonColor={Colors.white} renderIcon={() =>
          <Image
            style={{ width: '37%', height: '37%', }}
            source={require('../../icon/menu.png')}
          />
        }>
          <ActionButton.Item buttonColor={Colors.kuningJaja} title="Review Produk" onPress={() => navigation.navigate(!reduxAuth ? 'Login' : "ReviewProduk")}>
            <Image
              style={{ width: '35%', height: '35%', tintColor: Colors.white }}
              source={require('../../icon/ulasan.png')}
            />
          </ActionButton.Item>

          <ActionButton.Item buttonColor={Colors.kuningJaja} title="Etalase Produk" onPress={() => navigation.navigate(!reduxAuth ? 'Login' : "Etalase")}>
            <Image
              style={{ width: '40%', height: '40%', tintColor: Colors.white }}
              source={require('../../icon/box.png')}
            />
          </ActionButton.Item>

          <ActionButton.Item buttonColor={Colors.biruJaja} title="Tambah Produk" onPress={() => navigation.navigate(!reduxAuth ? 'Login' : 'ProdukBaru')}>
            <Image
              style={{ width: '35%', height: '35%', tintColor: Colors.white }}
              source={require('../../icon/plus-sign.png')}
            />
          </ActionButton.Item>

        </ActionButton>
        
        <ActionSheetLayout
          footerHeight={11}
          containerStyle={Style.actionSheet}
          ref={actionSheetLayout}>
          <View style={Style.actionSheetHeader}>
            <Text adjustsFontSizeToFit style={Style.actionSheetTitle}>Promosi</Text>
            <TouchableOpacity
              onPress={() =>
                actionSheetLayout.current?.setModalVisible(false)
              }>
              <Image
                style={Style.actionSheetClose}
                source={require('../../icon/close.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={Style.column_center_start}>
            <TouchableOpacity onPress={() => handleCloseAS('Voucher Toko')} style={Style.appBarRow}>
              <Text adjustsFontSizeToFit>Voucher Toko</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={() => handleCloseAS('Flashsale')} style={Style.appBarRow}> */}
            <TouchableOpacity onPress={() => alert("Flashsale akan segera hadir!")} style={Style.appBarRow}>
              <Text adjustsFontSizeToFit style={{ color: "#9A9A9A" }}>Flashsale <Text adjustsFontSizeToFit style={{ fontStyle: "italic" }}>(Coming Soon)</Text></Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => handleCloseAS('Diskon')} style={Style.appBarRow}>
                        <Text>Diskon</Text>
                    </TouchableOpacity> */}

          </View>
        </ActionSheetLayout>
      </View>
    </SafeAreaView >
  );



  // function backHandler() {
  //   const backAction = () => {
  //     navigation.goBack()
  //     return true
  //   }
  //   BackHandler.addEventListener('hardwareBackPress', backAction);
  //   return () => {
  //     BackHandler.removeEventListener('hardwareBackPress', backAction);
  //   };
  // }
}



const styles = StyleSheet.create({
  search: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '3%',
    borderRadius: 5,
    height: Hp('5.7%'),
    width: Wp('95%'),
    margin: '2%',
    backgroundColor: Colors.white,
    shadowColor: Colors.biruJaja,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2,
    alignSelf: 'center',
  },
  content: {
    flex: 1,
    // height: Hp('67%'),
    marginHorizontal: '0%',
    marginVertical: '1%',
  },
  add: {
    width: 25,
    height: 25,
    tintColor: Colors.blackgrayScale
  },
  inputDropdown: {
    width: 110,
    // backgroundColor: Colors.biruJaja,
    // color: Colors.white,
    height: Hp('7%'),
  },
  textMenu: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: 'white', fontFamily: 'Poppins-Regular' },

});
